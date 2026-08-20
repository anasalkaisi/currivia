import { describe, expect, it } from 'vitest';

import {
  parseCurriculumConfig,
  parsePersonalPlan,
  personalPlanSchema,
  createDefaultSemesterAxis,
} from './index';

const validConfig = {
  regulationVersion: 'mi7-sose2025',
  sourceRevision: 'hdm-sose2025-initial',
  completeness: 'incomplete-development-slice',
  applicability: {
    program: 'medieninformatik-bachelor',
    enrollmentFrom: 'sose-2025',
  },
  gradingScale: {
    allowedHundredths: [100, 130, 170, 200, 230, 270, 300, 330, 370, 400, 500],
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
      assessment: {
        id: 'hdm-mi7-113114-written-exam',
        title: { de: 'Schriftliche Prüfung' },
        type: 'written-exam',
        minutes: 60,
      },
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
  const axis = createDefaultSemesterAxis(
    'sose-2025',
    new Date('2026-08-20T12:00:00.000Z'),
  );
  const plan = {
    schemaVersion: 3,
    regulationVersion: 'mi7-sose2025',
    enrollmentSemester: 'sose-2025',
    regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
    currentSemesterId: axis.currentSemesterId,
    currentSemesterConfirmed: true,
    semesters: axis.semesters,
    moduleRecords: [],
    modulePlans: [
      {
        curriculumItemId: 'hdm-mi7-113114',
        semesterId: 'regular-1',
        availability: 'confirmed',
      },
    ],
  } as const;

  it('enthält keine duplizierten offiziellen Moduldaten', () => {
    const keys = Object.keys(personalPlanSchema.parse(plan));
    expect(keys).not.toContain('curriculumItems');
    expect(keys).not.toContain('requirements');
  });

  it('migriert einen S1-Abschlussdatensatz verlustfrei', () => {
    const config = parseCurriculumConfig(validConfig);
    const migrated = parsePersonalPlan(
      {
        schemaVersion: 1,
        regulationVersion: 'mi7-sose2025',
        enrollmentSemester: 'sose-2025',
        regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
        completions: [
          { curriculumItemId: 'hdm-mi7-113114', officialStatus: 'BE' },
        ],
      },
      config,
    );
    expect(migrated).toMatchObject({
      schemaVersion: 3,
      moduleRecords: [
        {
          curriculumItemId: 'hdm-mi7-113114',
          officialStatus: 'BE',
          componentRecords: [],
        },
      ],
    });
    expect(migrated.moduleRecords[0]?.semester).toBeUndefined();
  });

  it('lehnt eine unbekannte Modulreferenz ab', () => {
    const config = parseCurriculumConfig(validConfig);
    expect(() =>
      parsePersonalPlan(
        {
          ...plan,
          moduleRecords: [
            {
              curriculumItemId: 'unknown',
              semester: 1,
              officialStatus: 'BE',
              componentRecords: [],
            },
          ],
        },
        config,
      ),
    ).toThrow(/Unbekannte Modulreferenz/);
  });

  it('lehnt eine Note außerhalb der konfigurierten Skala ab', () => {
    const config = parseCurriculumConfig(validConfig);
    expect(() =>
      parsePersonalPlan(
        {
          ...plan,
          moduleRecords: [
            {
              curriculumItemId: 'hdm-mi7-113114',
              semester: 1,
              officialStatus: 'BE',
              gradeHundredths: 150,
              componentRecords: [],
            },
          ],
        },
        config,
      ),
    ).toThrow(/Ungültige Note/);
  });

  it('lehnt unbekannte Prüfungsbestandteile ab', () => {
    const config = parseCurriculumConfig(validConfig);
    expect(() =>
      parsePersonalPlan(
        {
          ...plan,
          moduleRecords: [
            {
              curriculumItemId: 'hdm-mi7-113114',
              semester: 1,
              officialStatus: 'AN',
              componentRecords: [
                {
                  componentId: 'unknown',
                  semester: 2,
                  officialStatus: 'RT',
                },
              ],
            },
          ],
        },
        config,
      ),
    ).toThrow(/Unbekannte Komponentenreferenz/);
  });
});
