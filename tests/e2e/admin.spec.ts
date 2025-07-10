import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();
import { UIFuncs } from '../../utils/uiFuncs';
import { PageObjects } from '@pages/pages';

let pages: PageObjects;
let uiFuncs: UIFuncs;

test.describe('Admin case entities', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser: browserFixture }) => {
    browser = browserFixture;
    context = await browser.newContext();
    page = await context.newPage();
    pages = new PageObjects(page);
    await page.goto('https://unas.hu/belepes');
    /*
    const { token } = await getAccessToken();
    accessToken = token;
    headers = {
      Authorization: `Bearer ${accessToken}`,
    };*/

  });

  test.beforeEach(async () => {

  });

  test.afterAll(async () => {
    await page.close();
  });

  test('[265] Check admin order', { tag: ['@smoke'], annotation: [{ type: 'test case'}] }, async ({request}) => {

    await test.step(`Login to admin`, async () => {
      //const requestBody = require('@apiData/adminlogin.json');
      //const { response, responseBody } = await pages.apiFuncs.apiCall(request, 'POST', `https://shop.unas.hu/admin_logincheck.php`, requestBody, 28_000);
      await page.getByRole('button', { name: 'Elfogadom' }).click()
    });

    await test.step(`Open admin`, async () => {
      await page.getByRole('textbox', { name: 'Felhasználónév Email cím' }).fill(process.env.ADMIN_NAME!);
      await page.getByRole('textbox', { name: 'Felhasználónév Email cím' }).press('Tab');
      await page.getByRole('textbox', { name: 'Jelszó' }).fill(process.env.ADMIN_PWS!);
      await page.getByRole('textbox', { name: 'Jelszó' }).press('Enter');
      await page.getByRole('button', { name: '' }).click();
      await page.locator('.order-list-row').first().click()
      await expect(page.getByText('Nincs kiegyenlítve!')).toBeVisible();
    });
  });
});
