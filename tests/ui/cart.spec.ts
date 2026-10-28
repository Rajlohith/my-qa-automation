import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// scope: 1 product testing of adding and removing


test('adding a product shows 1 on the cart badge', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsStandardUser();

  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();

  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});

// Bonus: removing item
test('removing the product makes the cart badge disappear', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsStandardUser();

  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1'); // check item was added before we remove it

  await page.getByTestId('remove-sauce-labs-backpack').click();

  await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});