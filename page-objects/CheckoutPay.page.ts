import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPayment {
  readonly page: Page;

  // --- Payment method locators ---
  readonly barionPayment: Locator;
  readonly paypalPayment: Locator;
  readonly bankTransfer: Locator;
  readonly cashOnPickup: Locator;
  readonly codGLS: Locator;
  readonly codMPL: Locator;

  // --- Delivery method locators ---
  readonly personalPickup: Locator;
  readonly glsHomeDelivery: Locator;
  readonly mplHomeDelivery: Locator;

  constructor(page: Page) {
    this.page = page;

    // Payment methods
    this.barionPayment = page.getByText('Bankkártyás fizetés BARIONnal');
    this.paypalPayment = page.getByText('PayPal fizetés');
    this.bankTransfer = page.getByText('Előre utalással');
    this.cashOnPickup = page.getByText('Készpénz/kártya átvételkor');
    this.codGLS = page.getByText('Utánvét GLS');
    this.codMPL = page.getByText('Utánvét MPL');

    // Delivery methods
    this.personalPickup = page.getByText('Személyes átvétel', { exact: true });
    this.glsHomeDelivery = page.getByText('GLS házhozszállítás');
    this.mplHomeDelivery = page.getByText('MPL házhozszállítás');
  }

  /**
   * Chooses a payment method by name.
   * @param method One of the supported payment method keys
   */
  async selectPaymentMethod(method: 'barion' | 'paypal' | 'transfer' | 'pickup' | 'codGLS' | 'codMPL') {
    switch (method) {
      case 'barion':
        await this.barionPayment.click();
        break;
      case 'paypal':
        await this.paypalPayment.click();
        break;
      case 'transfer':
        await this.bankTransfer.click();
        break;
      case 'pickup':
        await this.cashOnPickup.click();
        break;
      case 'codGLS':
        await this.codGLS.click();
        break;
      case 'codMPL':
        await this.codMPL.click();
        break;
      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }

  /**
   * Chooses a delivery method by name (if applicable).
   * @param method One of the supported delivery method keys
   * payment: készpénz just pickup
   * payment: utánvét gls just gls
   * payment: utánvét mpl just mpl
   */
  async selectDeliveryMethod(method: 'pickup' | 'gls' | 'mpl') {
    switch (method) {
      case 'pickup':
        await this.personalPickup.click();
        break;
      case 'gls':
        await this.glsHomeDelivery.click();
        break;
      case 'mpl':
        await this.mplHomeDelivery.click();
        break;
      default:
        throw new Error(`Unsupported delivery method: ${method}`);
    }
  }

  /**
   * Selects both payment and delivery methods (if required).
   */
  async fillPaymentAndDelivery(options: {
    payment: 'barion' | 'paypal' | 'transfer' | 'pickup' | 'codGLS' | 'codMPL';
    delivery?: 'pickup' | 'gls' | 'mpl';
  }) {
    await this.selectPaymentMethod(options.payment);

    // Some payment methods also require delivery selection
    if (options.delivery) {
      await this.selectDeliveryMethod(options.delivery);
    }
  }
}
