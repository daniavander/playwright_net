import { Page, Locator } from '@playwright/test';

export class Product {
  private readonly page: Page;

  readonly productLink: (name: string) => Locator;
  readonly sizeSelect: Locator;
  readonly customTextInput: Locator;
  readonly quantityInput: Locator;
  readonly addToBasketButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productLink = (name: string) => page.locator('a').filter({ hasText: name });
    this.sizeSelect = page.locator('select[name="valtozat_merete"]');
    this.customTextInput = page.locator('textarea[name="egyedi_szoveg"]');
    this.quantityInput = page.locator('input[name="cart_quantity"]');
    this.addToBasketButton = page.locator('button#button_cart');
  }

  /**
   * Selects a product from listing by its visible name.
   */
  async chooseProduct(productName: string) {
    await this.productLink(productName).click();
  }

  /**
   * Selects product parameters.
   * @param color required color
   * @param size optional size
   * @param text optional custom text
   */
  async addParams(color: string, size?: string, text?: string) {
    await this.page.getByLabel('Milyen színt szeretnél?').selectOption(color);
    await this.page.locator('#egyeb_list1_375').selectOption(size);
     if (text) {
        const input = this.page.getByLabel('Milyen egyedi szöveget szeretnél?');
        if (await input.isVisible()) {
          await input.pressSequentially(text);
        }
    }
  }

  /**
     * Changes the quantity of the product by clicking the increment or decrement button.
     *
     * @param operation - Type of quantity change: `'increment'` to increase, `'decrement'` to decrease.
     * @param quantity - Number of times to click the corresponding quantity button.
     *
     * @example
     * await product.setQuantity('increment', 3); // Clicks '+' button 3 times
     */
    async setQuantity(operation: 'increment' | 'decrement', quantity: number) {
        const button = this.page.getByRole('button', {
            name: operation === 'increment' ? 'quantity plus' : 'quantity minus',
        });

        for (let i = 0; i < quantity; i++) {
            await button.click();
        }
    }

  
    
  /**
   * Clicks Add to Basket.
   */
  async addToBasket() {
    await this.addToBasketButton.click();
  }
}
