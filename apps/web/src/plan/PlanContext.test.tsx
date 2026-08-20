import type { PersonalPlan } from '@currivia/schema';
import { curriculumConfigSchema } from '@currivia/schema';
import { act, render, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import { describe, expect, it } from 'vitest';

import { curriculumDefinition } from '../../../../curricula/hdm/mi7/sose2025/curriculum';
import type { PersonalPlanRepository } from '../persistence/personalPlanRepository';
import type { PlanContextValue } from './planContextValue';
import { PlanProvider } from './PlanContext';
import { usePlan } from './usePlan';

const config = curriculumConfigSchema.parse(curriculumDefinition);

class MemoryRepository implements PersonalPlanRepository {
  plan: PersonalPlan | null = null;

  async load() {
    return this.plan;
  }

  async save(plan: PersonalPlan) {
    this.plan = structuredClone(plan);
  }
}

function ContextProbe({
  onValue,
}: {
  onValue: (value: PlanContextValue) => void;
}) {
  const value = usePlan();

  useEffect(() => onValue(value), [onValue, value]);

  return null;
}

describe('PlanProvider', () => {
  it('settelt mehrere Modul-Saves aus einem React-Batch getrennt', async () => {
    const repository = new MemoryRepository();
    let context: PlanContextValue | undefined;
    const onValue = (value: PlanContextValue) => {
      context = value;
    };
    render(
      <PlanProvider config={config} repository={repository}>
        <ContextProbe onValue={onValue} />
      </PlanProvider>,
    );

    await waitFor(() => expect(context?.loadState).toBe('ready'));
    await act(async () => context?.createPlan());
    await waitFor(() => expect(context?.plan).not.toBeNull());

    const record = {
      curriculumItemId: 'hdm-mi7-113114',
      semester: 1,
      officialStatus: 'BE' as const,
      componentRecords: [],
    };
    let firstSave!: Promise<void>;
    let secondSave!: Promise<void>;

    await act(async () => {
      firstSave = context!.saveModuleRecord(record);
      secondSave = context!.saveModuleRecord(record);
    });

    await expect(Promise.all([firstSave, secondSave])).resolves.toEqual([
      undefined,
      undefined,
    ]);
    expect(repository.plan?.moduleRecords).toHaveLength(1);
  });
});
