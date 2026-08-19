import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { afterEach, describe, expect, it } from 'vitest';
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
    await waitFor(() => expect(repository.stored?.completions).toHaveLength(1));
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
