import { test, expect, Page, Browser, BrowserContext } from '@playwright/test';
import { ZodError } from 'zod';
import { faker } from '@faker-js/faker';
import { UIFuncs } from '../../utils/uiFuncs';
import { PageObjects } from '@pages/pages';
import { ProductSchema } from '@apiData/schemas/productSchema.schema';

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

  test('[222] Get product and schema validation', { tag: ['@smoke', '@api'], annotation: [{ type: 'test case'}] }, async ({request}) => {
    let responseBody: any;

    await test.step(`Get a product`, async () => {
      const result = await pages.apiFuncs.apiCall(request, 'GET', `/api/v1/products/11`, 6_000);
      responseBody = result.responseBody;
    });

    await test.step('Product schema validation', async () => {
      if (!responseBody || typeof responseBody !== 'object') {
        throw new Error('responseBody is undefined or not an object');
      }
      // ✅ Validate API response against Zod schema
      try {
        const parsedData = ProductSchema.parse(responseBody);
        // simple expect
        expect(parsedData.title).toContain('Baseball');
        expect(parsedData.category.id).toBe('1');
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            console.error(`❌ Schema validation error at ${issue.path.join('.')}:`, issue.message);
          }
          throw err;
        }
      }
      // ✅ Validate just a part API response against Zod schema
      const titleSchema = ProductSchema.shape.title;
      titleSchema.parse(responseBody.title);

      //another expect
      try {
        const parsedData = ProductSchema.parse(responseBody);
        expect(parsedData.title).toContain('Baseball');
      } catch (err) {
        // Handle validation errors
      }
    });
  });

  test('[223] Add get and delete product', { tag: ['@smoke', '@api'], annotation: [{ type: 'test case'}] }, async ({request}) => {
    let responseBody: any;
    let fakerTitle = faker.person.jobTitle();

    await test.step(`Add a product`, async () => {
      const requestBody = require('@apiData/creating/newProduct.json');
      requestBody.title = fakerTitle
      const result = await pages.apiFuncs.apiCall(request, 'POST', `/api/v1/products/`,{}, requestBody, 6_000);
    });

    let id: any; 
    await test.step(`Get product list and validate the added is`, async () => {
      const newProductData = require('@apiData/creating/newProduct.json');
      const result = await pages.apiFuncs.apiCall(request, 'GET', `/api/v1/products`);
      responseBody = result.responseBody;
      const lastProduct = responseBody[responseBody.length - 1];
      id = responseBody[responseBody.length - 1].id;
      expect(lastProduct.title).toBe(fakerTitle);
    });

    await test.step(`Delete the product`, async () => {
      const { response, responseBody } = await pages.apiFuncs.apiCall(request, 'DELETE', `/api/v1/products/${id}`);
      expect(response.status()).toBe(200);
    });


  });
});
