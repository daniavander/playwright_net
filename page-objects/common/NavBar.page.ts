import { Page, Locator } from '@playwright/test';

export class NavBar {
  readonly page: Page;

  private readonly menuItems: {
    deals: Locator;
    charity: Locator;
    customRequests: Locator;
    wallDecor: Locator;
    medalHolders: Locator;
    blog: Locator;
    faq: Locator;
    aboutUs: Locator;
    contact: Locator;
  };

  constructor(page: Page) {
    this.page = page;
    this.menuItems = {
      deals: this.page.getByRole('link', { name: 'Akciók' }),
      charity: this.page.getByRole('link', { name: 'Charity' }),
      customRequests: this.page.getByRole('link', { name: 'egyedi kérések' }),
      wallDecor: page.getByRole('link', { name: 'fém fali dekoráció', exact: true }),
      medalHolders: this.page.getByRole('link', { name: 'éremtartók' }),
      blog: this.page.getByRole('link', { name: 'Blog' }),
      faq: this.page.getByRole('link', { name: 'gyakori kérdések', exact: true }),
      aboutUs: this.page.getByRole('link', { name: 'rólunk' }),
      contact: this.page.getByRole('link', { name: 'kapcsolat', exact: true }),
    };
  }

  async navigateTo(menuKey: keyof typeof this.menuItems) {
    await this.menuItems[menuKey].click();
  }
}
