import { test, firefox } from '@playwright/test';
const fs = require('fs');

import { ADMIN_STATE } from '../../playwright.config';

export const baseUrl = 'https://shop.unas.hu/';

test('save state for one webapp manually @smoke', async ({ page }) => {
  await page.goto(baseUrl);
await page.pause();
  await page.context().storageState({
    path: ADMIN_STATE,
  });
});
