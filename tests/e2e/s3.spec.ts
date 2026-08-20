import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('S3: Modul ohne Drag-and-drop verschieben, rückgängig machen und laden', async ({
  page,
}) => {
  await page.goto('/#/onboarding');
  await page.getByRole('checkbox', { name: /SPO-Version.*geprüft/i }).check();
  await page.getByRole('button', { name: /Plan öffnen/ }).click();

  await expect(
    page.getByRole('heading', { name: 'Semester für Semester.' }),
  ).toBeVisible();
  await page.getByRole('button', { name: /FS 1 SoSe 2025/ }).click();
  const planning = page.getByLabel('Planungssemester');
  await expect(planning).toHaveValue('regular-1');

  await planning.selectOption('regular-3');
  await expect(page.getByRole('button', { name: 'Rückgängig' })).toBeVisible();
  await page.getByRole('button', { name: 'Rückgängig' }).click();
  await expect(planning).toHaveValue('regular-1');

  await planning.selectOption('regular-3');
  await page.getByRole('button', { name: /FS 3 SoSe 2026/ }).click();
  await expect(page.getByLabel('Planungssemester')).toHaveValue('regular-3');
  await expect(
    page.getByText('Lokal gespeichert', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Planungssemester')).toHaveValue('regular-3');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
