import type { Locator, Page } from '@playwright/test';

export type ShopCategory = 'Category 1' | 'Category 2' | 'Category 3';

export class ShopPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  productHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  async openCategory(category: ShopCategory): Promise<void> {
    await this.page.getByRole('link', { name: category, exact: true }).click();
  }
}
