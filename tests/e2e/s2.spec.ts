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
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
