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

const completionSchema = z.object({
  curriculumItemId: z.string().min(1),
  officialStatus: z.literal('BE'),
});

export const personalPlanSchema = z
  .object({
    schemaVersion: z.literal(1),
    regulationVersion: z.literal('mi7-sose2025'),
    enrollmentSemester: z.literal('sose-2025'),
    regulationConfirmedAt: z.iso.datetime(),
    completions: z.array(completionSchema),
  })
  .superRefine((plan, context) => {
    const ids = plan.completions.map(
      (completion) => completion.curriculumItemId,
    );
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: 'custom',
        message: 'Ein Modul darf nur einen Abschlussdatensatz besitzen.',
        path: ['completions'],
      });
    }
  });

export type CurriculumConfig = z.infer<typeof curriculumConfigSchema>;
export type CurriculumItem = CurriculumConfig['curriculumItems'][number];
export type SumCreditsRequirement = CurriculumConfig['requirements'][number];
export type PersonalPlan = z.infer<typeof personalPlanSchema>;

export function parseCurriculumConfig(input: unknown): CurriculumConfig {
  return curriculumConfigSchema.parse(input);
}

export function parsePersonalPlan(
  input: unknown,
  config: CurriculumConfig,
): PersonalPlan {
  const plan = personalPlanSchema.parse(input);
  const itemIds = new Set(config.curriculumItems.map((item) => item.id));

  if (plan.regulationVersion !== config.regulationVersion) {
    throw new Error(
      'Der persönliche Zustand gehört zu einer anderen Regelgeneration.',
    );
  }

  for (const completion of plan.completions) {
    if (!itemIds.has(completion.curriculumItemId)) {
      throw new Error(
        `Unbekannte Modulreferenz im persönlichen Zustand: ${completion.curriculumItemId}`,
      );
    }
  }

  return plan;
}
