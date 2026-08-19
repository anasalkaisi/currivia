import type { CurriculumConfig, PersonalPlan } from '@currivia/schema';
import { parsePersonalPlan } from '@currivia/schema';
import { openDB, type IDBPDatabase } from 'idb';

import {
  InvalidStoredPlanError,
  type PersonalPlanRepository,
} from './personalPlanRepository';

const STORE_NAME = 'personal-plan';
const ACTIVE_PLAN_KEY = 'active-plan';

export class IndexedDbPersonalPlanRepository implements PersonalPlanRepository {
  constructor(
    private readonly config: CurriculumConfig,
    private readonly databaseName = 'currivia-s1',
  ) {}

  private open(): Promise<IDBPDatabase> {
    return openDB(this.databaseName, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME);
        }
      },
    });
  }

  async load(): Promise<PersonalPlan | null> {
    const database = await this.open();
    const stored: unknown = await database.get(STORE_NAME, ACTIVE_PLAN_KEY);
    database.close();

    if (stored === undefined) {
      return null;
    }

    try {
      return parsePersonalPlan(stored, this.config);
    } catch (error) {
      throw new InvalidStoredPlanError({ cause: error });
    }
  }

  async save(plan: PersonalPlan): Promise<void> {
    const validatedPlan = parsePersonalPlan(plan, this.config);
    const database = await this.open();
    await database.put(STORE_NAME, validatedPlan, ACTIVE_PLAN_KEY);
    database.close();
  }
}
