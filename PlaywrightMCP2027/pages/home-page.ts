import type { Locator, Page } from '@playwright/test';

export interface HomeFormData {
  name: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  employmentStatus: 'Student' | 'Employed';
  dateOfBirth: string;
  dataBindingText: string;
}

export class HomePage {
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  private readonly page: Page;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly iceCreamsCheckbox: Locator;
  private readonly genderSelect: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly dataBindingInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('form input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.iceCreamsCheckbox = page.getByRole('checkbox', {
      name: 'Check me out if you Love IceCreams!',
    });
    this.genderSelect = page.getByLabel('Gender');
    this.dateOfBirthInput = page.locator('input[name="bday"]');
    this.dataBindingInput = page
      .getByRole('heading', { name: 'Two-way Data Binding example' })
      .getByRole('textbox');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successMessage = page.getByText(/The Form has been submitted successfully/);
  }

  async fill(data: HomeFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.iceCreamsCheckbox.check();
    await this.genderSelect.selectOption({ label: data.gender });
    await this.page.getByRole('radio', { name: data.employmentStatus }).check();
    await this.dateOfBirthInput.fill(data.dateOfBirth);
    await this.dataBindingInput.fill(data.dataBindingText);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
