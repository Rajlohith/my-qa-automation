import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('standard user can log in and sees the Products title', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('locked out user sees an error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('locked_out_user', 'secret_sauce');

  await expect(page.getByTestId('error')).toContainText('locked out');
});

test('user can log out from the side menu and returns to the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsStandardUser();

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();

  await expect(page).toHaveURL('/');
  await expect(page.getByTestId('login-button')).toBeVisible();
});