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
    await page.goto('https://fakeapi.platzi.com/en/rest/products/#product-schema');
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

  test.only('[222]', { tag: ['@smoke'], annotation: [{ type: 'test case'}] }, async ({request}) => {
  let incidentId: string;

    await test.step(`Login to admin`, async () => {
      const requestBody = require('@apiData/adminlogin.json');
      const { response, responseBody } = await pages.apiFuncs.apiCall(request, 'POST', `https://shop.unas.hu/admin_logincheck.php`, requestBody, 28_000);
      await page.goto('https://shop.unas.hu/admin_order.php')
    });

    await test.step(`Open admin`, async () => {
    });
  });
});
