import { describe, expect, it } from 'vitest';

import {
  parseCurriculumConfig,
  parsePersonalPlan,
  personalPlanSchema,
} from './index';

const validConfig = {
  regulationVersion: 'mi7-sose2025',
  sourceRevision: 'hdm-sose2025-initial',
  completeness: 'incomplete-development-slice',
  applicability: {
    program: 'medieninformatik-bachelor',
    enrollmentFrom: 'sose-2025',
  },
  sources: [
    {
      id: 'Q-SPO-2025',
      documentTitle: 'SPO',
      publisher: 'HdM',
      officialUrl: 'https://example.com/spo.pdf',
      retrievedAt: '2026-08-19',
      fileSha256: 'a'.repeat(64),
      locations: [{ label: 'Seite 70', fact: 'Web Development' }],
    },
  ],
  curriculumItems: [
    {
      id: 'hdm-mi7-113114',
      officialCode: '113114',
      title: { de: 'Web Development' },
      type: 'module',
      area: 'basic-compulsory',
      recommendedSemester: 1,
      creditsHundredths: 500,
      assessment: { type: 'written-exam', minutes: 60 },
      prerequisites: 'none',
      sourceRefs: ['Q-SPO-2025'],
    },
  ],
  requirements: [
    {
      id: 'total-credits',
      operator: 'sumCredits',
      creditStatus: 'BE',
      targetHundredths: 21000,
      sourceRefs: ['Q-SPO-2025'],
    },
  ],
} as const;

describe('Curriculumsschema', () => {
  it('akzeptiert die gültige Minimalkonfiguration', () => {
    expect(parseCurriculumConfig(validConfig).curriculumItems).toHaveLength(1);
  });

  it('lehnt fehlende Quellen ab', () => {
    expect(() =>
      parseCurriculumConfig({ ...validConfig, sources: [] }),
    ).toThrow();
  });

  it('lehnt ungültige ECTS ab', () => {
    const curriculumItems = [
      { ...validConfig.curriculumItems[0], creditsHundredths: -500 },
    ];
    expect(() =>
      parseCurriculumConfig({ ...validConfig, curriculumItems }),
    ).toThrow();
  });

  it('lehnt unbekannte Quellenreferenzen ab', () => {
    const curriculumItems = [
      { ...validConfig.curriculumItems[0], sourceRefs: ['Q-UNKNOWN'] },
    ];
    expect(() =>
      parseCurriculumConfig({ ...validConfig, curriculumItems }),
    ).toThrow();
  });
});

describe('persönliches Schema', () => {
  const plan = {
    schemaVersion: 1,
    regulationVersion: 'mi7-sose2025',
    enrollmentSemester: 'sose-2025',
    regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
    completions: [],
  } as const;

  it('enthält keine duplizierten offiziellen Moduldaten', () => {
    const keys = Object.keys(personalPlanSchema.parse(plan));
    expect(keys).not.toContain('curriculumItems');
    expect(keys).not.toContain('requirements');
  });

  it('lehnt eine unbekannte Modulreferenz ab', () => {
    const config = parseCurriculumConfig(validConfig);
    expect(() =>
      parsePersonalPlan(
        {
          ...plan,
          completions: [{ curriculumItemId: 'unknown', officialStatus: 'BE' }],
        },
        config,
      ),
    ).toThrow(/Unbekannte Modulreferenz/);
  });
});
