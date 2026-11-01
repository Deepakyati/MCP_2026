import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly termsCheckbox: Locator;
  private readonly signInButton: Locator;
  private readonly credentialsHint: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'Username:' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password:' });
    this.termsCheckbox = page.getByRole('checkbox', {
      name: 'I Agree to the terms and conditions',
    });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.credentialsHint = page.locator('p').filter({ hasText: 'username is' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/loginpagePractise/');
  }

  async loginAsTeacher(): Promise<void> {
    const hint = await this.credentialsHint.innerText();
    const username = hint.match(/username is\s+(\S+)/i)?.[1];
    const password = hint.match(/Password is\s+(.+?)\s*\)/i)?.[1];

    if (!username || !password) {
      throw new Error('Could not read the demo credentials displayed on the login page.');
    }

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.page.getByRole('combobox').selectOption({ label: 'Teacher' });
    await this.termsCheckbox.check();
    await this.signInButton.click();
    await expect(this.page).toHaveURL(/\/angularpractice\/shop$/);
  }
}
