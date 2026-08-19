import type { PersonalPlan } from '@currivia/schema';

export interface PersonalPlanRepository {
  load(): Promise<PersonalPlan | null>;
  save(plan: PersonalPlan): Promise<void>;
}

export class InvalidStoredPlanError extends Error {
  constructor(options?: ErrorOptions) {
    super('Der gespeicherte persönliche Zustand ist ungültig.', options);
    this.name = 'InvalidStoredPlanError';
  }
}
