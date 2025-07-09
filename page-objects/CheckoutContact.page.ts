import { Page, Locator } from '@playwright/test';

export class Checkout {
  readonly page: Page;

  // Input fields
  readonly emailInput: Locator;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly recipientNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly addressInput: Locator;

  // Actions
  readonly deliverySection: Locator;
  readonly nextStepButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole('textbox', { name: 'E-mail' });
    this.nameInput = page.locator('#kap_nev');
    this.phoneInput = page.getByRole('spinbutton', { name: 'Mobilszám' });
    this.recipientNameInput = page.locator('#default_nev');
    this.zipCodeInput = page.locator('#default_irany');
    this.addressInput = page.getByRole('textbox', { name: 'Utca, házszám' });

    this.deliverySection = page.getByText('A szállítási adatok');
    this.nextStepButton = page.getByRole('button', { name: 'Tovább' });
  }

  /**
   * Fills the contact and shipping form fields.
   */
  async fillContactForm(data: {
    email: string;
    name: string;
    phone: string;
    recipientName: string;
    zipCode: string;
    address: string;
  }) {
    await this.emailInput.fill(data.email);
    await this.nameInput.fill(data.name);
    await this.phoneInput.fill(data.phone);

    await this.deliverySection.click(); // Expand delivery section

    await this.recipientNameInput.fill(data.recipientName);
    await this.zipCodeInput.fill(data.zipCode);
    await this.addressInput.fill(data.address);
  }

  /**
   * Clicks the "Tovább" (Next Step) button.
   */
  async continueCheckout() {
    await this.nextStepButton.click();
  }
}
