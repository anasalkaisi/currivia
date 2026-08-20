import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('S1: SPO bestätigen, BE speichern, neu laden und Quelle prüfen', async ({
  page,
}) => {
  await page.goto('/#/onboarding');

  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await expect(
    page.getByText('Vorgeschlagene SPO').locator('..'),
  ).toContainText('mi7-sose2025');
  const openButton = page.getByRole('button', { name: /Plan öffnen/ });
  await expect(openButton).toBeDisabled();

  await page.getByRole('checkbox', { name: /SPO-Version.*geprüft/i }).check();
  await openButton.click();

  await expect(page).toHaveURL(/#\/planner$/);
  await expect(page.getByText('0 / 210 ECTS')).toBeVisible();
  await page.getByRole('button', { name: /FS 1 SoSe 2025/ }).click();
  await expect(
    page.getByText(/Curriculumsdatensatz enthält weiterhin nur ein Modul/),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.getByRole('link', { name: 'Zum Inhalt springen' }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/planner$/);
  await expect(page.locator('#main-content')).toBeFocused();

  await page.getByRole('button', { name: 'Als bestanden markieren' }).click();
  await expect(page.getByText('5 / 210 ECTS', { exact: true })).toBeVisible();
  await expect(page.getByText(/Bestanden \(BE\)/)).toBeVisible();
  await expect(
    page.getByText('Lokal gespeichert', { exact: true }),
  ).toBeVisible();

  await page.reload();
  await expect(page.getByText('5 / 210 ECTS', { exact: true })).toBeVisible();
  await expect(page.getByText(/Bestanden \(BE\)/)).toBeVisible();

  await page.getByRole('link', { name: /Quelle anzeigen/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Web Development' }),
  ).toBeVisible();
  await expect(
    page.getByText('§ 36 Tabelle 2, gedruckte Seite 70'),
  ).toBeVisible();
  await expect(page.getByText('PDF-Seite 20')).toBeVisible();
  await expect(page.getByText('hdm-sose2025-initial')).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('S1: BE lässt sich wieder auf offen zurücksetzen', async ({ page }) => {
  await page.goto('/#/onboarding');
  await page.getByRole('checkbox', { name: /SPO-Version.*geprüft/i }).check();
  await page.getByRole('button', { name: /Plan öffnen/ }).click();
  await page.getByRole('button', { name: /FS 1 SoSe 2025/ }).click();
  await page.getByRole('button', { name: 'Als bestanden markieren' }).click();
  await page.getByRole('button', { name: /Auf „offen“ zurücksetzen/ }).click();

  await expect(page.getByText('0 / 210 ECTS')).toBeVisible();
  await expect(page.getByText('Status: Offen')).toBeVisible();
});
