import { z } from 'zod';

const sourceLocationSchema = z.object({
  label: z.string().min(1),
  fact: z.string().min(1),
});

export const sourceSchema = z.object({
  id: z.string().min(1),
  documentTitle: z.string().min(1),
  publisher: z.string().min(1),
  officialUrl: z.url(),
  retrievedAt: z.iso.date(),
  fileSha256: z.string().regex(/^[a-f0-9]{64}$/),
  locations: z.array(sourceLocationSchema).min(1),
});

const curriculumItemSchema = z.object({
  id: z.string().min(1),
  officialCode: z.string().min(1),
  title: z.object({ de: z.string().min(1) }),
  type: z.literal('module'),
  area: z.literal('basic-compulsory'),
  recommendedSemester: z.number().int().positive(),
  creditsHundredths: z.number().int().positive(),
  assessment: z.object({
    id: z.string().min(1),
    title: z.object({ de: z.string().min(1) }),
    type: z.literal('written-exam'),
    minutes: z.literal(60),
  }),
  prerequisites: z.literal('none'),
  sourceRefs: z.array(z.string().min(1)).min(1),
});

const sumCreditsRequirementSchema = z.object({
  id: z.literal('total-credits'),
  operator: z.literal('sumCredits'),
  creditStatus: z.literal('BE'),
  targetHundredths: z.number().int().positive(),
  sourceRefs: z.array(z.string().min(1)).min(1),
});

export const curriculumConfigSchema = z
  .object({
    regulationVersion: z.literal('mi7-sose2025'),
    sourceRevision: z.literal('hdm-sose2025-initial'),
    completeness: z.literal('incomplete-development-slice'),
    applicability: z.object({
      program: z.literal('medieninformatik-bachelor'),
      enrollmentFrom: z.literal('sose-2025'),
    }),
    gradingScale: z.object({
      allowedHundredths: z.array(z.number().int()).min(1),
    }),
    sources: z.array(sourceSchema).min(1),
    curriculumItems: z.array(curriculumItemSchema).length(1),
    requirements: z.array(sumCreditsRequirementSchema).length(1),
  })
  .superRefine((config, context) => {
    const sourceIds = new Set(config.sources.map((source) => source.id));
    if (sourceIds.size !== config.sources.length) {
      context.addIssue({
        code: 'custom',
        message: 'Quellen-IDs müssen eindeutig sein.',
        path: ['sources'],
      });
    }

    const itemIds = config.curriculumItems.map((item) => item.id);

    if (new Set(itemIds).size !== itemIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'Curriculums-IDs müssen eindeutig sein.',
        path: ['curriculumItems'],
      });
    }

    for (const [index, item] of config.curriculumItems.entries()) {
      for (const sourceRef of item.sourceRefs) {
        if (!sourceIds.has(sourceRef)) {
          context.addIssue({
            code: 'custom',
            message: `Unbekannte Quellenreferenz: ${sourceRef}`,
            path: ['curriculumItems', index, 'sourceRefs'],
          });
        }
      }
    }

    for (const [index, requirement] of config.requirements.entries()) {
      for (const sourceRef of requirement.sourceRefs) {
        if (!sourceIds.has(sourceRef)) {
          context.addIssue({
            code: 'custom',
            message: `Unbekannte Quellenreferenz: ${sourceRef}`,
            path: ['requirements', index, 'sourceRefs'],
          });
        }
      }
    }
  });

export const officialStatusSchema = z.enum(['AN', 'BE', 'NB', 'EN', 'RT']);

const componentRecordSchema = z.object({
  componentId: z.string().min(1),
  semester: z.number().int().positive(),
  officialStatus: officialStatusSchema,
  officialAttempt: z.number().int().positive().optional(),
});

const moduleRecordSchema = z.object({
  curriculumItemId: z.string().min(1),
  semester: z.number().int().positive().optional(),
  officialStatus: officialStatusSchema,
  officialAttempt: z.number().int().positive().optional(),
  gradeHundredths: z.number().int().optional(),
  componentRecords: z.array(componentRecordSchema),
});

const enrollmentSemesterSchema = z
  .string()
  .regex(/^(sose-\d{4}|wise-\d{4}-\d{2})$/);

const calendarSemesterSchema = z.object({
  key: enrollmentSemesterSchema,
  label: z.string().min(1),
  source: z.enum(['derived', 'manual']),
});

export const planSemesterSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['regular', 'vacation', 'interruption']),
  fachsemester: z.number().int().positive().optional(),
  fachsemesterConfirmed: z.boolean(),
  calendarSemester: calendarSemesterSchema,
});

export const modulePlanSchema = z.object({
  curriculumItemId: z.string().min(1),
  semesterId: z.string().min(1).nullable(),
  availability: z.enum(['confirmed', 'unconfirmed']),
  availabilityNote: z.string().max(500).optional(),
});

const personalPlanV3Schema = z
  .object({
    schemaVersion: z.literal(3),
    regulationVersion: z.literal('mi7-sose2025'),
    enrollmentSemester: enrollmentSemesterSchema,
    regulationConfirmedAt: z.iso.datetime(),
    currentSemesterId: z.string().min(1),
    currentSemesterConfirmed: z.boolean(),
    semesters: z.array(planSemesterSchema).min(1),
    moduleRecords: z.array(moduleRecordSchema),
    modulePlans: z.array(modulePlanSchema),
  })
  .superRefine((plan, context) => {
    const semesterIds = new Set(plan.semesters.map((semester) => semester.id));
    if (semesterIds.size !== plan.semesters.length) {
      context.addIssue({
        code: 'custom',
        message: 'Semester-IDs müssen eindeutig sein.',
        path: ['semesters'],
      });
    }
    if (!semesterIds.has(plan.currentSemesterId)) {
      context.addIssue({
        code: 'custom',
        message: 'Das aktuelle Semester ist unbekannt.',
        path: ['currentSemesterId'],
      });
    }

    const modulePlanIds = plan.modulePlans.map(
      (modulePlan) => modulePlan.curriculumItemId,
    );
    if (new Set(modulePlanIds).size !== modulePlanIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'Ein Modul darf nur eine Planungszuordnung besitzen.',
        path: ['modulePlans'],
      });
    }
    for (const [index, modulePlan] of plan.modulePlans.entries()) {
      if (
        modulePlan.semesterId !== null &&
        !semesterIds.has(modulePlan.semesterId)
      ) {
        context.addIssue({
          code: 'custom',
          message:
            'Die Planungszuordnung verweist auf ein unbekanntes Semester.',
          path: ['modulePlans', index, 'semesterId'],
        });
      }
    }

    const recordIds = plan.moduleRecords.map(
      (record) => record.curriculumItemId,
    );
    if (new Set(recordIds).size !== recordIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'Ein Modul darf nur einen Abschlussdatensatz besitzen.',
        path: ['moduleRecords'],
      });
    }

    for (const [recordIndex, record] of plan.moduleRecords.entries()) {
      const componentIds = record.componentRecords.map(
        (component) => component.componentId,
      );
      if (new Set(componentIds).size !== componentIds.length) {
        context.addIssue({
          code: 'custom',
          message: 'Ein Prüfungsbestandteil darf nur einmal erfasst werden.',
          path: ['moduleRecords', recordIndex, 'componentRecords'],
        });
      }
    }
  });

export const personalPlanSchema = personalPlanV3Schema;

const legacyPersonalPlanV2Schema = z.object({
  schemaVersion: z.literal(2),
  regulationVersion: z.literal('mi7-sose2025'),
  enrollmentSemester: enrollmentSemesterSchema,
  regulationConfirmedAt: z.iso.datetime(),
  moduleRecords: z.array(moduleRecordSchema),
});

const legacyPersonalPlanV1Schema = z.object({
  schemaVersion: z.literal(1),
  regulationVersion: z.literal('mi7-sose2025'),
  enrollmentSemester: enrollmentSemesterSchema,
  regulationConfirmedAt: z.iso.datetime(),
  completions: z.array(
    z.object({
      curriculumItemId: z.string().min(1),
      officialStatus: z.literal('BE'),
    }),
  ),
});

export type CurriculumConfig = z.infer<typeof curriculumConfigSchema>;
export type CurriculumItem = CurriculumConfig['curriculumItems'][number];
export type SumCreditsRequirement = z.infer<typeof sumCreditsRequirementSchema>;
export type PlanSemester = z.infer<typeof planSemesterSchema>;
export type ModulePlan = z.infer<typeof modulePlanSchema>;
export type PersonalPlan = z.infer<typeof personalPlanV3Schema>;
export type ModuleRecord = PersonalPlan['moduleRecords'][number];
export type OfficialStatus = z.infer<typeof officialStatusSchema>;

export function parseCurriculumConfig(input: unknown): CurriculumConfig {
  return curriculumConfigSchema.parse(input);
}

type ParsedCalendarSemester = {
  season: 'sose' | 'wise';
  startYear: number;
  key: string;
  label: string;
};

function parseCalendarSemester(key: string): ParsedCalendarSemester {
  const soseMatch = /^sose-(\d{4})$/.exec(key);
  if (soseMatch) {
    const startYear = Number(soseMatch[1]);
    return {
      season: 'sose',
      startYear,
      key,
      label: `SoSe ${startYear}`,
    };
  }

  const wiseMatch = /^wise-(\d{4})-(\d{2})$/.exec(key);
  if (wiseMatch) {
    const startYear = Number(wiseMatch[1]);
    return {
      season: 'wise',
      startYear,
      key,
      label: `WiSe ${startYear}/${wiseMatch[2]}`,
    };
  }

  throw new Error(`Ungültiges Kalendersemester: ${key}`);
}

export function getCalendarSemesterLabel(key: string): string {
  return parseCalendarSemester(key).label;
}

function nextCalendarSemester(key: string): ParsedCalendarSemester {
  const current = parseCalendarSemester(key);
  if (current.season === 'sose') {
    const startYear = current.startYear;
    return parseCalendarSemester(
      `wise-${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`,
    );
  }
  return parseCalendarSemester(`sose-${current.startYear + 1}`);
}

export function nextCalendarSemesterKey(key: string): string {
  return nextCalendarSemester(key).key;
}

function calendarSemesterForDate(date: Date): string {
  const year = date.getFullYear();
  // March through August is the summer-semester planning window.
  if (date.getMonth() >= 2 && date.getMonth() <= 7) {
    return `sose-${year}`;
  }
  const startYear = date.getMonth() < 2 ? year - 1 : year;
  return `wise-${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`;
}

export function createDefaultSemesterAxis(
  enrollmentSemester: string,
  now = new Date(),
): { semesters: PlanSemester[]; currentSemesterId: string } {
  let key = parseCalendarSemester(enrollmentSemester).key;
  const semesters: PlanSemester[] = [];
  for (let index = 1; index <= 7; index += 1) {
    const calendar = parseCalendarSemester(key);
    semesters.push({
      id: `regular-${index}`,
      kind: 'regular',
      fachsemester: index,
      fachsemesterConfirmed: true,
      calendarSemester: {
        key: calendar.key,
        label: calendar.label,
        source: 'derived',
      },
    });
    key = nextCalendarSemester(key).key;
  }

  const currentKey = calendarSemesterForDate(now);
  const currentIndex = semesters.findIndex(
    (semester) => semester.calendarSemester.key === currentKey,
  );
  const currentSemesterId =
    semesters[
      currentIndex >= 0 ? currentIndex : currentKey < enrollmentSemester ? 0 : 6
    ]?.id ?? semesters[0]!.id;

  return { semesters, currentSemesterId };
}

function migrateToV3(
  input: z.infer<typeof legacyPersonalPlanV2Schema>,
  config: CurriculumConfig,
): z.infer<typeof personalPlanV3Schema> {
  const axis = createDefaultSemesterAxis(input.enrollmentSemester);
  return {
    schemaVersion: 3,
    regulationVersion: input.regulationVersion,
    enrollmentSemester: input.enrollmentSemester,
    regulationConfirmedAt: input.regulationConfirmedAt,
    currentSemesterId: axis.currentSemesterId,
    currentSemesterConfirmed: false,
    semesters: axis.semesters,
    moduleRecords: input.moduleRecords,
    modulePlans: config.curriculumItems.map((item) => {
      const record = input.moduleRecords.find(
        (candidate) => candidate.curriculumItemId === item.id,
      );
      const preferredSemester = record?.semester ?? item.recommendedSemester;
      const semesterId = `regular-${Math.min(7, Math.max(1, preferredSemester))}`;
      return {
        curriculumItemId: item.id,
        semesterId,
        availability: 'confirmed' as const,
      };
    }),
  };
}

function assertReferences(
  plan: z.infer<typeof personalPlanV3Schema>,
  config: CurriculumConfig,
): PersonalPlan {
  const itemIds = new Set(config.curriculumItems.map((item) => item.id));
  for (const record of plan.moduleRecords) {
    if (!itemIds.has(record.curriculumItemId)) {
      throw new Error(
        `Unbekannte Modulreferenz im persönlichen Zustand: ${record.curriculumItemId}`,
      );
    }

    const item = config.curriculumItems.find(
      (candidate) => candidate.id === record.curriculumItemId,
    );
    const componentIds = new Set(item ? [item.assessment.id] : []);
    for (const component of record.componentRecords) {
      if (!componentIds.has(component.componentId)) {
        throw new Error(
          `Unbekannte Komponentenreferenz im persönlichen Zustand: ${component.componentId}`,
        );
      }
    }

    if (
      record.gradeHundredths !== undefined &&
      !config.gradingScale.allowedHundredths.includes(record.gradeHundredths)
    ) {
      throw new Error(
        `Ungültige Note im Moduldatensatz ${record.curriculumItemId}: ${record.gradeHundredths}`,
      );
    }
  }

  for (const modulePlan of plan.modulePlans) {
    if (!itemIds.has(modulePlan.curriculumItemId)) {
      throw new Error(
        `Unbekannte Planungsreferenz im persönlichen Zustand: ${modulePlan.curriculumItemId}`,
      );
    }
  }

  return plan;
}

export function parsePersonalPlan(
  input: unknown,
  config: CurriculumConfig,
): PersonalPlan {
  const current = personalPlanV3Schema.safeParse(input);
  if (current.success) return assertReferences(current.data, config);

  const legacyV2 = legacyPersonalPlanV2Schema.safeParse(input);
  if (legacyV2.success) {
    return assertReferences(migrateToV3(legacyV2.data, config), config);
  }

  const legacyV1 = legacyPersonalPlanV1Schema.safeParse(input);
  if (legacyV1.success) {
    return assertReferences(
      migrateToV3(
        {
          schemaVersion: 2,
          regulationVersion: legacyV1.data.regulationVersion,
          enrollmentSemester: legacyV1.data.enrollmentSemester,
          regulationConfirmedAt: legacyV1.data.regulationConfirmedAt,
          moduleRecords: legacyV1.data.completions.map((completion) => ({
            curriculumItemId: completion.curriculumItemId,
            officialStatus: completion.officialStatus,
            componentRecords: [],
          })),
        },
        config,
      ),
      config,
    );
  }

  throw current.error;
}
