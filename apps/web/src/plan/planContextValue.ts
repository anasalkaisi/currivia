import type { ModuleRecord, PersonalPlan } from '@currivia/schema';
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
};

export const PlanContext = createContext<PlanContextValue | null>(null);
