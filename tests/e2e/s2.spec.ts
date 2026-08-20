import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('S2: offiziellen Verlauf mit EN und semesterübergreifendem Bestandteil erfassen', async ({
  page,
}) => {
  await page.goto('/#/onboarding');
  await page.getByRole('checkbox', { name: /SPO-Version.*geprüft/i }).check();
  await page.getByRole('button', { name: /Plan öffnen/ }).click();
  await page.getByRole('link', { name: 'Studienverlauf erfassen' }).click();

  await expect(
    page.getByRole('heading', { name: 'Was steht in SELMA?' }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.getByLabel('Tatsächliches Fachsemester').fill('1');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('checkbox', { name: /Web Development/ }).check();
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page.getByRole('radio', { name: /Endgültig nicht bestanden/ }).check();
  await expect(page.getByRole('alert')).toContainText('offiziell klären');
  await page.getByRole('button', { name: 'Weiter' }).click();

  await page.getByLabel('Note').selectOption('170');
  await page.getByLabel('Offizielle Versuchszahl').fill('2');
  await page.getByRole('button', { name: 'Weiter' }).click();
  await page
    .getByRole('checkbox', { name: /Schriftliche Prüfung detaillieren/ })
    .check();
  await page.getByLabel('Status des Bestandteils').selectOption('RT');
  await page.getByLabel('Fachsemester der Aktivität').fill('2');
  await page.getByLabel('Offizielle Versuchszahl des Bestandteils').fill('1');
  await page.getByRole('button', { name: 'Verlauf lokal speichern' }).click();

  await expect(page).toHaveURL(/#\/planner$/);
  await expect(
    page
      .getByRole('status')
      .filter({ hasText: 'Endgültig nicht bestanden (EN)' }),
  ).toBeVisible();
  await expect(page.getByText(/FS 2 · Rücktritt \(RT\)/)).toBeVisible();
  await expect(page.getByText('0 / 210 ECTS')).toBeVisible();
  await page.reload();
  await expect(page.getByText(/FS 2 · Rücktritt \(RT\)/)).toBeVisible();
  await expect(page.getByText('1,7')).toBeVisible();
  await expect(page.getByText('2', { exact: true })).toHaveCount(1);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test('S2: Verlauf per Tastatur speichern', async ({ page }) => {
  await page.goto('/#/onboarding');
  const consent = page.getByRole('checkbox', {
    name: /SPO-Version.*geprüft/i,
  });
  await consent.focus();
  await page.keyboard.press('Space');
  const openButton = page.getByRole('button', { name: /Plan öffnen/ });
  await openButton.focus();
  await page.keyboard.press('Enter');

  const historyLink = page.getByRole('link', {
    name: 'Studienverlauf erfassen',
  });
  await historyLink.focus();
  await page.keyboard.press('Enter');

  const semester = page.getByLabel('Tatsächliches Fachsemester');
  await semester.focus();
  await page.keyboard.type('1');
  const next = page.getByRole('button', { name: 'Weiter' });
  await next.focus();
  await page.keyboard.press('Enter');

  const moduleChoice = page.getByRole('checkbox', { name: /Web Development/ });
  await moduleChoice.focus();
  await page.keyboard.press('Space');
  await next.focus();
  await page.keyboard.press('Enter');

  const passed = page.getByRole('radio', { name: /Bestanden/ });
  await passed.focus();
  await page.keyboard.press('Space');
  await next.focus();
  await page.keyboard.press('Enter');
  await next.focus();
  await page.keyboard.press('Enter');

  const save = page.getByRole('button', { name: 'Verlauf lokal speichern' });
  await save.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/planner$/);
});
