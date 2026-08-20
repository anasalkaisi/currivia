import type { ModulePlan, ModuleRecord, PersonalPlan } from '@currivia/schema';
import { createContext } from 'react';

export type PlanContextValue = {
  loadState: 'loading' | 'ready' | 'invalid';
  plan: PersonalPlan | null;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  revision: number;
  createPlan: () => void;
  setPassed: (itemId: string) => void;
  resetOpen: (itemId: string) => void;
  saveModuleRecord: (record: ModuleRecord) => Promise<void>;
  undoModulePlans: ModulePlan[] | null;
  moveModule: (itemId: string, semesterId: string | null) => void;
  undoLastMove: () => void;
  confirmCurrentSemester: () => void;
  confirmSpecialSemester: (semesterId: string) => void;
  addSpecialSemester: (kind: 'regular' | 'vacation' | 'interruption') => void;
};

export const PlanContext = createContext<PlanContextValue | null>(null);
