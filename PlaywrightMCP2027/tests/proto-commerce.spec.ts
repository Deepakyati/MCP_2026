import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { LoginPage } from '../pages/login-page';
import { ShopPage } from '../pages/shop-page';

test.describe('ProtoCommerce', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsTeacher();
  });

  test('logs in as Teacher and shows iPhone X in the shop', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await expect(page).toHaveURL(/\/angularpractice\/shop$/);
    await expect(shopPage.productHeading('iphone X')).toBeVisible();
  });

  for (const category of ['Category 1', 'Category 2', 'Category 3'] as const) {
    test(`${category} opens the home form`, async ({ page }) => {
      const shopPage = new ShopPage(page);
      const homePage = new HomePage(page);

      await shopPage.openCategory(category);

      await expect(page).toHaveURL(/\/angularpractice\/?$/);
      await expect(homePage.nameInput).toBeVisible();
      await expect(homePage.submitButton).toBeVisible();
    });
  }

  test('fills every enabled home form control and submits successfully', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const homePage = new HomePage(page);

    await shopPage.openCategory('Category 3');
    await homePage.fill({
      name: 'Taylor Sample',
      email: `taylor.sample.${Date.now()}@example.com`,
      password: 'DemoPass789!',
      gender: 'Female',
      employmentStatus: 'Employed',
      dateOfBirth: '1994-08-22',
      dataBindingText: 'Taylor Sample',
    });
    await homePage.submit();

    await expect(homePage.successMessage).toBeVisible();
  });
});
