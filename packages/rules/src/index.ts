import type {
  CurriculumConfig,
  PersonalPlan,
  SumCreditsRequirement,
} from '@currivia/schema';

export type SumCreditsResult = {
  ruleId: string;
  operator: 'sumCredits';
  state: 'satisfied' | 'unsatisfied';
  currentHundredths: number;
  targetHundredths: number;
  contributingItemIds: string[];
  sourceRefs: string[];
};

export function evaluateSumCredits(
  requirement: SumCreditsRequirement,
  config: CurriculumConfig,
  plan: PersonalPlan,
): SumCreditsResult {
  const passedIds = new Set(
    plan.completions
      .filter(
        (completion) => completion.officialStatus === requirement.creditStatus,
      )
      .map((completion) => completion.curriculumItemId),
  );
  const contributingItems = config.curriculumItems.filter((item) =>
    passedIds.has(item.id),
  );
  const currentHundredths = contributingItems.reduce(
    (sum, item) => sum + item.creditsHundredths,
    0,
  );

  return {
    ruleId: requirement.id,
    operator: requirement.operator,
    state:
      currentHundredths >= requirement.targetHundredths
        ? 'satisfied'
        : 'unsatisfied',
    currentHundredths,
    targetHundredths: requirement.targetHundredths,
    contributingItemIds: contributingItems.map((item) => item.id),
    sourceRefs: [...requirement.sourceRefs],
  };
}

export function evaluateTotalCredits(
  config: CurriculumConfig,
  plan: PersonalPlan,
): SumCreditsResult {
  const requirement = config.requirements.find(
    (candidate) => candidate.id === 'total-credits',
  );

  if (!requirement) {
    throw new Error('Die Konfiguration enthält keine Gesamt-ECTS-Regel.');
  }

  return evaluateSumCredits(requirement, config, plan);
}
