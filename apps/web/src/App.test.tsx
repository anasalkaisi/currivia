import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { PersonalPlan } from '@currivia/schema';

import { App } from './App';
import type { PersonalPlanRepository } from './persistence/personalPlanRepository';

class MemoryRepository implements PersonalPlanRepository {
  public stored: PersonalPlan | null;

  constructor(initial: PersonalPlan | null = null) {
    this.stored = initial;
  }

  async load() {
    return this.stored;
  }

  async save(plan: PersonalPlan) {
    this.stored = structuredClone(plan);
  }
}

class DeferredHistoryRepository extends MemoryRepository {
  public releaseHistorySave = () => undefined;

  override save(plan: PersonalPlan): Promise<void> {
    if (plan.moduleRecords.length === 0) {
      return super.save(plan);
    }
    return new Promise((resolve) => {
      this.releaseHistorySave = () => {
        this.stored = structuredClone(plan);
        resolve();
      };
    });
  }
}

beforeEach(() => {
  window.location.hash = '';
});

afterEach(() => {
  window.location.hash = '';
  cleanup();
});

describe('S1-Nutzerweg', () => {
  it('öffnet den Planner erst nach SPO-Bestätigung und aktualisiert ECTS', async () => {
    const user = userEvent.setup();
    const repository = new MemoryRepository();
    render(<App repository={repository} />);

    const openButton = await screen.findByRole('button', {
      name: /Plan öffnen/,
    });
    expect(openButton).toBeDisabled();

    await user.click(
      screen.getByRole('checkbox', { name: /SPO-Version.*geprüft/i }),
    );
    await user.click(openButton);

    expect(await screen.findByText('0 / 210 ECTS')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Als bestanden markieren' }),
    );

    expect(screen.getByText('5 / 210 ECTS')).toBeInTheDocument();
    expect(screen.getByText(/Bestanden \(BE\)/)).toBeInTheDocument();
    await waitFor(() =>
      expect(repository.stored?.moduleRecords).toHaveLength(1),
    );
  });

  it('öffnet für einen nicht unterstützten Geltungsbereich keinen Planner', async () => {
    const user = userEvent.setup();
    render(<App repository={new MemoryRepository()} />);

    await user.selectOptions(
      await screen.findByLabelText('Erstmalige Einschreibung'),
      'wise-2024-25',
    );

    expect(screen.getByRole('button', { name: /Plan öffnen/ })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      /nicht zum bestätigten Geltungsbereich/,
    );
  });

  it('hat in Einstieg und Planner keine automatischen axe-Verstöße', async () => {
    const user = userEvent.setup();
    const { container } = render(<App repository={new MemoryRepository()} />);

    await screen.findByRole('button', { name: /Plan öffnen/ });
    expect(
      (
        await axe.run(container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations,
    ).toEqual([]);

    await user.click(
      screen.getByRole('checkbox', { name: /SPO-Version.*geprüft/i }),
    );
    await user.click(screen.getByRole('button', { name: /Plan öffnen/ }));
    await screen.findByRole('heading', { name: '1. Fachsemester' });
    expect(
      (
        await axe.run(container, {
          rules: { 'color-contrast': { enabled: false } },
        })
      ).violations,
    ).toEqual([]);
  });

  it('zeigt einen ungültigen gespeicherten Zustand an, ohne ihn zu überschreiben', async () => {
    let saveWasCalled = false;
    const repository: PersonalPlanRepository = {
      load: () => Promise.reject(new Error('invalid')),
      save: () => {
        saveWasCalled = true;
        return Promise.resolve();
      },
    };

    render(<App repository={repository} />);

    expect(
      await screen.findByRole('heading', {
        name: 'Lokaler Zustand konnte nicht sicher geladen werden',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/weder übernommen noch überschrieben/),
    ).toBeInTheDocument();
    expect(saveWasCalled).toBe(false);
  });
});

describe('S2-Erfassungsassistent', () => {
  it('übernimmt ungültige Zahlen nicht in den persönlichen Plan', async () => {
    const user = userEvent.setup();
    const repository = new MemoryRepository();
    render(<App repository={repository} />);

    await user.click(
      await screen.findByRole('checkbox', { name: /SPO-Version.*geprüft/i }),
    );
    await user.click(screen.getByRole('button', { name: /Plan öffnen/ }));
    await user.click(
      screen.getByRole('link', { name: 'Studienverlauf erfassen' }),
    );
    await user.type(screen.getByLabelText('Tatsächliches Fachsemester'), '1');
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('checkbox', { name: /Web Development/ }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('radio', { name: /BE Bestanden.*ECTS/ }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));

    await user.type(screen.getByLabelText('Offizielle Versuchszahl'), '1.5');

    expect(screen.getByRole('alert')).toHaveTextContent(/positive ganze Zahl/);
    expect(screen.getByRole('button', { name: 'Weiter' })).toBeDisabled();
    expect(repository.stored?.moduleRecords).toEqual([]);
  });

  it('führt ein noch nicht individuell geändertes Komponentensemester mit', async () => {
    const user = userEvent.setup();
    render(<App repository={new MemoryRepository()} />);

    await user.click(
      await screen.findByRole('checkbox', { name: /SPO-Version.*geprüft/i }),
    );
    await user.click(screen.getByRole('button', { name: /Plan öffnen/ }));
    await user.click(
      screen.getByRole('link', { name: 'Studienverlauf erfassen' }),
    );
    const semesterInput = screen.getByLabelText('Tatsächliches Fachsemester');
    await user.type(semesterInput, '1');
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('button', { name: 'Zurück' }));
    const correctedSemesterInput = screen.getByLabelText(
      'Tatsächliches Fachsemester',
    );
    await user.clear(correctedSemesterInput);
    await user.type(correctedSemesterInput, '2');
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('checkbox', { name: /Web Development/ }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('radio', { name: /BE Bestanden.*ECTS/ }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(
      screen.getByRole('checkbox', {
        name: /Schriftliche Prüfung detaillieren/,
      }),
    );

    expect(screen.getByLabelText('Fachsemester der Aktivität')).toHaveValue(2);
    expect(
      screen.getByRole('button', { name: 'Verlauf lokal speichern' }),
    ).toBeDisabled();
  });

  it('speichert offiziellen Status, Note, Versuch und semesterübergreifenden Bestandteil getrennt', async () => {
    const user = userEvent.setup();
    const repository = new DeferredHistoryRepository();
    render(<App repository={repository} />);

    await user.click(
      await screen.findByRole('checkbox', { name: /SPO-Version.*geprüft/i }),
    );
    await user.click(screen.getByRole('button', { name: /Plan öffnen/ }));
    await user.click(
      screen.getByRole('link', { name: 'Studienverlauf erfassen' }),
    );

    await user.type(screen.getByLabelText('Tatsächliches Fachsemester'), '1');
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(screen.getByRole('checkbox', { name: /Web Development/ }));
    await user.click(screen.getByRole('button', { name: 'Weiter' }));
    await user.click(
      screen.getByRole('radio', { name: /Endgültig nicht bestanden/ }),
    );
    expect(screen.getByRole('alert')).toHaveTextContent(/offiziell klären/i);
    await user.click(screen.getByRole('button', { name: 'Weiter' }));

    await user.selectOptions(screen.getByLabelText('Note'), '170');
    await user.type(screen.getByLabelText('Offizielle Versuchszahl'), '2');
    await user.click(screen.getByRole('button', { name: 'Weiter' }));

    await user.click(
      screen.getByRole('checkbox', {
        name: /Schriftliche Prüfung detaillieren/,
      }),
    );
    await user.selectOptions(
      screen.getByLabelText('Status des Bestandteils'),
      'RT',
    );
    await user.clear(screen.getByLabelText('Fachsemester der Aktivität'));
    await user.type(screen.getByLabelText('Fachsemester der Aktivität'), '2');
    await user.type(
      screen.getByLabelText('Offizielle Versuchszahl des Bestandteils'),
      '1',
    );
    await user.click(
      screen.getByRole('button', { name: 'Verlauf lokal speichern' }),
    );

    expect(screen.getByText('Wird lokal gespeichert …')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Was steht in SELMA?' }),
    ).toBeInTheDocument();
    await act(async () => repository.releaseHistorySave());

    expect(
      await screen.findByText('Status: Endgültig nicht bestanden (EN)'),
    ).toBeInTheDocument();
    expect(screen.getByText(/FS 2 · Rücktritt \(RT\)/)).toBeInTheDocument();
    expect(screen.getByText('1,7')).toBeInTheDocument();
    await waitFor(() =>
      expect(repository.stored?.moduleRecords[0]).toMatchObject({
        officialStatus: 'EN',
        officialAttempt: 2,
        gradeHundredths: 170,
        componentRecords: [
          {
            officialStatus: 'RT',
            semester: 2,
            officialAttempt: 1,
          },
        ],
      }),
    );
  });

  it('zeigt fehlende Bestandteildaten als nicht prüfbar', async () => {
    const repository = new MemoryRepository({
      schemaVersion: 2,
      regulationVersion: 'mi7-sose2025',
      enrollmentSemester: 'sose-2025',
      regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
      moduleRecords: [
        {
          curriculumItemId: 'hdm-mi7-113114',
          semester: 1,
          officialStatus: 'AN',
          componentRecords: [],
        },
      ],
    });
    window.location.hash = '#/planner';
    render(<App repository={repository} />);

    expect(
      await screen.findByText(/Nicht prüfbar · Bestandteildaten nicht erfasst/),
    ).toBeInTheDocument();
    expect(screen.getByText('0 / 210 ECTS')).toBeInTheDocument();
  });

  it('wertet einen Rücktritt nicht als Widerspruch zum Modulstatus', async () => {
    const repository = new MemoryRepository({
      schemaVersion: 2,
      regulationVersion: 'mi7-sose2025',
      enrollmentSemester: 'sose-2025',
      regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
      moduleRecords: [
        {
          curriculumItemId: 'hdm-mi7-113114',
          semester: 1,
          officialStatus: 'BE',
          componentRecords: [
            {
              componentId: 'hdm-mi7-113114-written-exam',
              semester: 1,
              officialStatus: 'RT',
            },
          ],
        },
      ],
    });
    window.location.hash = '#/planner';
    render(<App repository={repository} />);

    expect(
      await screen.findByText(/FS 1 · Rücktritt \(RT\)/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/widersprüchlich/i)).not.toBeInTheDocument();
  });

  it('bietet bei einem erfassten Semester Bearbeiten statt Löschen an', async () => {
    const repository = new MemoryRepository({
      schemaVersion: 2,
      regulationVersion: 'mi7-sose2025',
      enrollmentSemester: 'sose-2025',
      regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
      moduleRecords: [
        {
          curriculumItemId: 'hdm-mi7-113114',
          semester: 2,
          officialStatus: 'BE',
          componentRecords: [],
        },
      ],
    });
    window.location.hash = '#/planner';
    render(<App repository={repository} />);

    expect(
      await screen.findByRole('link', {
        name: 'Offiziellen Status bearbeiten',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /auf.*offen.*zurücksetzen/i }),
    ).not.toBeInTheDocument();
  });

  it('zeigt ganzzahlige offizielle Noten mit einer Nachkommastelle', async () => {
    const repository = new MemoryRepository({
      schemaVersion: 2,
      regulationVersion: 'mi7-sose2025',
      enrollmentSemester: 'sose-2025',
      regulationConfirmedAt: '2026-08-19T12:00:00.000Z',
      moduleRecords: [
        {
          curriculumItemId: 'hdm-mi7-113114',
          semester: 1,
          officialStatus: 'BE',
          gradeHundredths: 100,
          componentRecords: [],
        },
      ],
    });
    window.location.hash = '#/planner';
    render(<App repository={repository} />);

    expect(await screen.findByText('1,0')).toBeInTheDocument();
  });
});
