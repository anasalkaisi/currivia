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

export type ForecastCreditsResult = {
  targetSemesterId: string;
  currentHundredths: number;
  forecastHundredths: number;
  plannedItemIds: string[];
};

/**
 * Evaluates a credit-sum requirement against the learner's module records.
 *
 * @param requirement - The credit requirement and the official status used to identify completed modules
 * @param config - The curriculum configuration containing credit values
 * @param plan - The learner's module records
 * @returns The requirement evaluation, including current and target credits, satisfaction state, contributing item IDs, and source references
 */
export function evaluateSumCredits(
  requirement: SumCreditsRequirement,
  config: CurriculumConfig,
  plan: PersonalPlan,
): SumCreditsResult {
  const passedIds = new Set(
    plan.moduleRecords
      .filter((record) => record.officialStatus === requirement.creditStatus)
      .map((record) => record.curriculumItemId),
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

/**
 * Evaluates the curriculum's total-credit requirement for a personal plan.
 *
 * @param config - The curriculum configuration containing the total-credit requirement
 * @param plan - The personal plan whose credits are evaluated
 * @returns The evaluation result for the total-credit requirement
 * @throws Error if the configuration does not contain a `total-credits` requirement
 */
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

/**
 * Forecasts total credits through a selected semester, including officially passed and eligible planned modules.
 *
 * @param targetSemesterId - The semester through which planned modules are included
 * @returns The selected semester, current official credits, forecast credits, and planned curriculum item IDs
 * @throws Error if `targetSemesterId` does not identify a semester in the plan
 */
export function evaluateForecastCredits(
  config: CurriculumConfig,
  plan: PersonalPlan,
  targetSemesterId: string,
): ForecastCreditsResult {
  const targetIndex = plan.semesters.findIndex(
    (semester) => semester.id === targetSemesterId,
  );
  if (targetIndex < 0) {
    throw new Error(`Unbekanntes Zielsemester: ${targetSemesterId}`);
  }

  const semesterIndex = new Map(
    plan.semesters.map((semester, index) => [semester.id, index]),
  );
  const records = new Map(
    plan.moduleRecords.map((record) => [record.curriculumItemId, record]),
  );
  const current = evaluateTotalCredits(config, plan).currentHundredths;
  const plannedItemIds: string[] = [];
  let forecast = 0;

  for (const item of config.curriculumItems) {
    const record = records.get(item.id);
    if (record?.officialStatus === 'BE') {
      forecast += item.creditsHundredths;
      continue;
    }

    const assignment = plan.modulePlans.find(
      (modulePlan) => modulePlan.curriculumItemId === item.id,
    );
    const assignmentIndex = assignment?.semesterId
      ? semesterIndex.get(assignment.semesterId)
      : undefined;
    if (
      assignmentIndex !== undefined &&
      assignmentIndex <= targetIndex &&
      (record === undefined || record.officialStatus === 'AN')
    ) {
      forecast += item.creditsHundredths;
      plannedItemIds.push(item.id);
    }
  }

  return {
    targetSemesterId,
    currentHundredths: current,
    forecastHundredths: forecast,
    plannedItemIds,
  };
}
