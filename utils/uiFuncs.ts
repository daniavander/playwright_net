// utils/uiFuncs.ts
import { Page, expect } from '@playwright/test';

export class UIFuncs {
  constructor(private page: Page) {}

  async closeBonusPopup() {
    const bonusPopup = this.page.locator('#optimonk');
    if ((await bonusPopup.isVisible())) {
      await this.page.locator('.om-popup-close-x').first().click();
      return true;
    }
    return false;
  }
}
