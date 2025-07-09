import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/hu';
import { UIFuncs } from '../../utils/uiFuncs';
import { PageObjects } from '@pages/pages';
import { AnimalDecors } from '@fixtures/productNames';
import { TestUser } from '@fixtures/user';

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
    await page.pause();
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

  test.skip('[222] check admin', { tag: ['@smoke'], annotation: [{ type: 'test case'}] }, async ({request}) => {
  let incidentId: string;

    await test.step(`Login to admin`, async () => {
      //const requestBody = require('@apiData/adminlogin.json');
      //const { response, responseBody } = await pages.apiFuncs.apiCall(request, 'POST', `https://shop.unas.hu/admin_logincheck.php`, requestBody, 28_000);
      await page.goto('https://shop.unas.hu/admin_order.php')
    });

    await test.step(`Open admin`, async () => {
      await page.getByRole('textbox', { name: 'Felhasználónév Email cím' }).fill('kovacsdani04');
      await page.getByRole('textbox', { name: 'Felhasználónév Email cím' }).press('Tab');
      await page.getByRole('textbox', { name: 'Jelszó' }).fill('19900604');
      await page.getByRole('textbox', { name: 'Jelszó' }).press('Enter');
      await page.getByRole('button', { name: 'Belépés ' }).click();
      await page.goto('https://shop.unas.hu/admin_order.php')
      await expect(page.getByText('Nincs kiegyenlítve!')).toBeVisible();
      await expect(page.getByText('Kiegyenlítve:')).toBeVisible();
    });
  });
});
