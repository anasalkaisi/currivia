import { openDB } from 'idb';
import { describe, expect, it } from 'vitest';
import { parseCurriculumConfig, type PersonalPlan } from '@currivia/schema';

import { IndexedDbPersonalPlanRepository } from './indexedDbPersonalPlanRepository';
import { InvalidStoredPlanError } from './personalPlanRepository';

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
});

function repository() {
  const name = `currivia-test-${crypto.randomUUID()}`;
  return { name, value: new IndexedDbPersonalPlanRepository(config, name) };
}

const emptyPlan: PersonalPlan = {
  schemaVersion: 1,
  regulationVersion: 'mi7-sose2025',
  enrollmentSemester: 'sose-2025',
  regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
  completions: [],
};

describe('IndexedDB-Repository', () => {
  it('initialisiert ohne gespeicherten Zustand leer', async () => {
    expect(await repository().value.load()).toBeNull();
  });

  it('speichert und lädt BE round-trip-stabil', async () => {
    const { value } = repository();
    const passedPlan: PersonalPlan = {
      ...emptyPlan,
      completions: [
        { curriculumItemId: 'hdm-mi7-113114', officialStatus: 'BE' },
      ],
    };
    await value.save(passedPlan);
    expect(await value.load()).toEqual(passedPlan);

    await value.save(emptyPlan);
    expect((await value.load())?.completions).toEqual([]);
  });

  it('lehnt einen ungültigen gespeicherten Zustand sicher ab', async () => {
    const { name, value } = repository();
    const database = await openDB(name, 1, {
      upgrade(db) {
        db.createObjectStore('personal-plan');
      },
    });
    await database.put(
      'personal-plan',
      { ...emptyPlan, schemaVersion: 99 },
      'active-plan',
    );
    database.close();

    await expect(value.load()).rejects.toBeInstanceOf(InvalidStoredPlanError);

    const check = await openDB(name, 1);
    expect(await check.get('personal-plan', 'active-plan')).toMatchObject({
      schemaVersion: 99,
    });
    check.close();
  });
});
