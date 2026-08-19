import type { CurriculumConfig, PersonalPlan } from '@currivia/schema';
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
        revision: state.revision + 1,
      };
    case 'setPassed': {
      if (!state.plan) return state;
      const completions = state.plan.completions.some(
        (completion) => completion.curriculumItemId === action.itemId,
      )
        ? state.plan.completions
        : [
            ...state.plan.completions,
            { curriculumItemId: action.itemId, officialStatus: 'BE' as const },
          ];
      return {
        ...state,
        plan: { ...state.plan, completions },
        revision: state.revision + 1,
      };
    }
    case 'resetOpen':
      if (!state.plan) return state;
      return {
        ...state,
        plan: {
          ...state.plan,
          completions: state.plan.completions.filter(
            (completion) => completion.curriculumItemId !== action.itemId,
          ),
        },
        revision: state.revision + 1,
      };
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
    dispatch({ type: 'saving' });
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => repository.save(planToSave))
      .then(() => dispatch({ type: 'saved' }))
      .catch(() => dispatch({ type: 'saveFailed' }));
  }, [repository, state.plan, state.revision]);

  const createPlan = useCallback(() => {
    dispatch({
      type: 'created',
      plan: {
        schemaVersion: 1,
        regulationVersion: config.regulationVersion,
        enrollmentSemester: config.applicability.enrollmentFrom,
        regulationConfirmedAt: new Date().toISOString(),
        completions: [],
      },
    });
  }, [config]);

  const setPassed = useCallback((itemId: string) => {
    dispatch({ type: 'setPassed', itemId });
  }, []);

  const resetOpen = useCallback((itemId: string) => {
    dispatch({ type: 'resetOpen', itemId });
  }, []);

  const value = useMemo(
    () => ({ ...state, createPlan, setPassed, resetOpen }),
    [state, createPlan, setPassed, resetOpen],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
