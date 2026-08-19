import { describe, expect, it } from 'vitest';
import { parseCurriculumConfig, parsePersonalPlan } from '@currivia/schema';

import { evaluateTotalCredits } from './index';

const config = parseCurriculumConfig({
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
});

function plan(
  completions: { curriculumItemId: string; officialStatus: 'BE' }[],
) {
  return parsePersonalPlan(
    {
      schemaVersion: 1,
      regulationVersion: 'mi7-sose2025',
      enrollmentSemester: 'sose-2025',
      regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
      completions,
    },
    config,
  );
}

describe('sumCredits', () => {
  it('liefert ohne Abschlussdatensatz 0 Hundertstel-ECTS', () => {
    const result = evaluateTotalCredits(config, plan([]));
    expect(result).toMatchObject({
      state: 'unsatisfied',
      currentHundredths: 0,
      targetHundredths: 21000,
      contributingItemIds: [],
    });
  });

  it('liefert für Web Development mit BE 500 Hundertstel-ECTS', () => {
    const result = evaluateTotalCredits(
      config,
      plan([{ curriculumItemId: 'hdm-mi7-113114', officialStatus: 'BE' }]),
    );
    expect(result).toMatchObject({
      state: 'unsatisfied',
      currentHundredths: 500,
      targetHundredths: 21000,
      contributingItemIds: ['hdm-mi7-113114'],
    });
  });
});
