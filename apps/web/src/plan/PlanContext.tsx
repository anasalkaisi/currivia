import type {
  CurriculumConfig,
  ModuleRecord,
  PersonalPlan,
} from '@currivia/schema';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import type { PersonalPlanRepository } from '../persistence/personalPlanRepository';
import { PlanContext } from './planContextValue';

type LoadState = 'loading' | 'ready' | 'invalid';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

type State = {
  loadState: LoadState;
  plan: PersonalPlan | null;
  saveState: SaveState;
  revision: number;
};

type Action =
  | { type: 'loaded'; plan: PersonalPlan | null }
  | { type: 'loadFailed' }
  | { type: 'created'; plan: PersonalPlan }
  | { type: 'setPassed'; itemId: string }
  | { type: 'resetOpen'; itemId: string }
  | { type: 'saveModuleRecord'; record: ModuleRecord }
  | { type: 'saving' }
  | { type: 'saved' }
  | { type: 'saveFailed' };

const initialState: State = {
  loadState: 'loading',
  plan: null,
  saveState: 'idle',
  revision: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loaded':
      return { ...state, loadState: 'ready', plan: action.plan };
    case 'loadFailed':
      return { ...state, loadState: 'invalid', plan: null };
    case 'created':
      return {
        ...state,
        loadState: 'ready',
        plan: action.plan,
        saveState: 'saving',
        revision: state.revision + 1,
      };
    case 'setPassed': {
      if (!state.plan) return state;
      const existing = state.plan.moduleRecords.find(
        (record) => record.curriculumItemId === action.itemId,
      );
      const moduleRecords = existing
        ? state.plan.moduleRecords.map((record) =>
            record.curriculumItemId === action.itemId
              ? { ...record, officialStatus: 'BE' as const }
              : record,
          )
        : [
            ...state.plan.moduleRecords,
            {
              curriculumItemId: action.itemId,
              officialStatus: 'BE' as const,
              componentRecords: [],
            },
          ];
      return {
        ...state,
        plan: { ...state.plan, moduleRecords },
        saveState: 'saving',
        revision: state.revision + 1,
      };
    }
    case 'resetOpen':
      if (!state.plan) return state;
      return {
        ...state,
        plan: {
          ...state.plan,
          moduleRecords: state.plan.moduleRecords.filter(
            (record) => record.curriculumItemId !== action.itemId,
          ),
        },
        saveState: 'saving',
        revision: state.revision + 1,
      };
    case 'saveModuleRecord': {
      if (!state.plan) return state;
      const exists = state.plan.moduleRecords.some(
        (record) => record.curriculumItemId === action.record.curriculumItemId,
      );
      const moduleRecords = exists
        ? state.plan.moduleRecords.map((record) =>
            record.curriculumItemId === action.record.curriculumItemId
              ? action.record
              : record,
          )
        : [...state.plan.moduleRecords, action.record];
      return {
        ...state,
        plan: { ...state.plan, moduleRecords },
        saveState: 'saving',
        revision: state.revision + 1,
      };
    }
    case 'saving':
      return { ...state, saveState: 'saving' };
    case 'saved':
      return { ...state, saveState: 'saved' };
    case 'saveFailed':
      return { ...state, saveState: 'error' };
  }
}

export function PlanProvider({
  config,
  repository,
  children,
}: {
  config: CurriculumConfig;
  repository: PersonalPlanRepository;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const saveQueue = useRef(Promise.resolve());
  const nextSaveRequestId = useRef(0);
  const claimedSaveRequestIds = useRef(new Set<number>());
  const saveWaiters = useRef(
    new Map<
      number,
      { resolve: () => void; reject: (reason?: unknown) => void }
    >(),
  );

  useEffect(() => {
    let active = true;
    repository
      .load()
      .then((plan) => {
        if (active) dispatch({ type: 'loaded', plan });
      })
      .catch(() => {
        if (active) dispatch({ type: 'loadFailed' });
      });
    return () => {
      active = false;
    };
  }, [repository]);

  useEffect(() => {
    if (state.revision === 0 || !state.plan) return;

    const planToSave = state.plan;
    const requestIdsToSettle = [...saveWaiters.current.keys()].filter(
      (requestId) => !claimedSaveRequestIds.current.has(requestId),
    );
    requestIdsToSettle.forEach((requestId) =>
      claimedSaveRequestIds.current.add(requestId),
    );
    dispatch({ type: 'saving' });
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => repository.save(planToSave))
      .then(() => {
        dispatch({ type: 'saved' });
        requestIdsToSettle.forEach((requestId) => {
          saveWaiters.current.get(requestId)?.resolve();
          saveWaiters.current.delete(requestId);
          claimedSaveRequestIds.current.delete(requestId);
        });
      })
      .catch((error: unknown) => {
        dispatch({ type: 'saveFailed' });
        requestIdsToSettle.forEach((requestId) => {
          saveWaiters.current.get(requestId)?.reject(error);
          saveWaiters.current.delete(requestId);
          claimedSaveRequestIds.current.delete(requestId);
        });
      });
  }, [repository, state.plan, state.revision]);

  const createPlan = useCallback(() => {
    dispatch({
      type: 'created',
      plan: {
        schemaVersion: 2,
        regulationVersion: config.regulationVersion,
        enrollmentSemester: config.applicability.enrollmentFrom,
        regulationConfirmedAt: new Date().toISOString(),
        moduleRecords: [],
      },
    });
  }, [config]);

  const setPassed = useCallback((itemId: string) => {
    dispatch({ type: 'setPassed', itemId });
  }, []);

  const resetOpen = useCallback((itemId: string) => {
    dispatch({ type: 'resetOpen', itemId });
  }, []);

  const saveModuleRecord = useCallback((record: ModuleRecord) => {
    const requestId = nextSaveRequestId.current + 1;
    nextSaveRequestId.current = requestId;
    const completion = new Promise<void>((resolve, reject) => {
      saveWaiters.current.set(requestId, { resolve, reject });
    });
    dispatch({ type: 'saveModuleRecord', record });
    return completion;
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      createPlan,
      setPassed,
      resetOpen,
      saveModuleRecord,
    }),
    [state, createPlan, setPassed, resetOpen, saveModuleRecord],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
