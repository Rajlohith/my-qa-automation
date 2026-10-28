import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test('adding a product shows 1 on the cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsStandardUser();

  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});