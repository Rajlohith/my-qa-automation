import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// scope: covers 2 user (standard_user, locked_out_user)


// valid credentials for login
test('standard user can log in and sees the Products title', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // auto-waits and retries until the text matches or times out
  await expect(page.getByTestId('title')).toHaveText('Products');
});

// invalid credentials for login
test('locked out user sees an error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('locked_out_user', 'secret_sauce');

  // used toContainText instead of toHaveText for part match
  await expect(page.getByTestId('error')).toContainText('locked out');
});

// Bonus: logout from hamburger menu
test('user can log out from the side menu and returns to the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsStandardUser();

  // The menu button no data-test, so getByRole (button + accessible name) is used
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.getByTestId('logout-sidebar-link').click();

  await expect(page).toHaveURL('/'); // checking for both URL and page
  await expect(page.getByTestId('login-button')).toBeVisible(); // look for unique elements of login page
});