import { describe, expect, it } from 'vitest';
import {
  createDefaultSemesterAxis,
  parseCurriculumConfig,
  parsePersonalPlan,
} from '@currivia/schema';

import { evaluateTotalCredits } from './index';

const config = parseCurriculumConfig({
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
      locations: [{ label: 'Seite 69', fact: '210 ECTS' }],
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
});

function plan(officialStatus?: 'AN' | 'BE' | 'NB' | 'EN' | 'RT') {
  return parsePersonalPlan(
    {
      schemaVersion: 2,
      regulationVersion: 'mi7-sose2025',
      enrollmentSemester: 'sose-2025',
      regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
      moduleRecords: officialStatus
        ? [
            {
              curriculumItemId: 'hdm-mi7-113114',
              semester: 1,
              officialStatus,
              componentRecords: [],
            },
          ]
        : [],
    },
    config,
  );
}

describe('sumCredits', () => {
  it('liefert ohne Abschlussdatensatz 0 Hundertstel-ECTS', () => {
    const result = evaluateTotalCredits(config, plan());
    expect(result).toMatchObject({
      state: 'unsatisfied',
      currentHundredths: 0,
      targetHundredths: 21000,
      contributingItemIds: [],
    });
  });

  it('liefert für Web Development mit BE 500 Hundertstel-ECTS', () => {
    const result = evaluateTotalCredits(config, plan('BE'));
    expect(result).toMatchObject({
      state: 'unsatisfied',
      currentHundredths: 500,
      targetHundredths: 21000,
      contributingItemIds: ['hdm-mi7-113114'],
    });
  });

  it.each(['AN', 'NB', 'EN', 'RT'] as const)(
    'rechnet für %s keine ECTS an',
    (status) => {
      expect(evaluateTotalCredits(config, plan(status)).currentHundredths).toBe(
        0,
      );
    },
  );
});

describe('Semesterprognose', () => {
  it('trennt BE-Ist von geplanter Prognose', async () => {
    const axis = createDefaultSemesterAxis(
      'sose-2025',
      new Date('2026-08-20T12:00:00.000Z'),
    );
    const plan = parsePersonalPlan(
      {
        schemaVersion: 3,
        regulationVersion: 'mi7-sose2025',
        enrollmentSemester: 'sose-2025',
        regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
        currentSemesterId: axis.currentSemesterId,
        currentSemesterConfirmed: false,
        semesters: axis.semesters,
        moduleRecords: [],
        modulePlans: [
          {
            curriculumItemId: 'hdm-mi7-113114',
            semesterId: 'regular-3',
            availability: 'confirmed',
          },
        ],
      },
      config,
    );

    const { evaluateForecastCredits } = await import('./index');
    expect(evaluateForecastCredits(config, plan, 'regular-3')).toMatchObject({
      currentHundredths: 0,
      forecastHundredths: 500,
      plannedItemIds: ['hdm-mi7-113114'],
    });
  });
});
