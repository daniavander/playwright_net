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

    uiFuncs = new UIFuncs(page);
  });

  test.beforeEach(async () => {
    await page.goto('');
    await uiFuncs.closeBonusPopup();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('[59676] Case - Field config case title fehervar audit', { tag: ['@smoke'], annotation: [{ type: 'test case', description: 'https://avanderonline.visual...' }] }, async () => {

    await test.step(`Choose item: ${AnimalDecors.francbulldog}`, async () => {
      await pages.navBar.navigateTo('wallDecor');
      //todo decor submenu names to a dictionary
      await page.locator('a').filter({ hasText: 'Állatos dekorációk fémből' }).click();
      await pages.product.chooseProduct(AnimalDecors.francbulldog);
    });

    await test.step('Add product parameters', async () => {
      await pages.product.addParams('fehér', '30 x 31');
    });

    await test.step('Add to cart', async () => {
      await page.locator('#artdet__cart').getByRole('button', { name: 'Kosárba' }).click();
      await expect(page.getByText('A termék a kosárba került.')).toBeVisible();
    });

    await test.step('Checkout', async () => {
      await page.getByRole('button', { name: 'cart button' }).click();
      await page.getByRole('button', { name: 'Pénztár' }).click();
      await page.getByRole('button', { name: 'Regisztráció nélkül vásárolok' }).click();
      await expect(page).toHaveURL(/shop_reg\.php\?no_reg=1$/);
    });

    const fakeEmail = faker.internet.email();
    await test.step('Fill the contact form', async () => {
      await pages.checkout.fillContactForm({
        email: fakeEmail,
        name: TestUser.name,
        phone: TestUser.phone,
        recipientName: TestUser.name,
        zipCode: TestUser.zipCode,
        address: TestUser.address,
      });

      //todo create a json for zip codes: { "zip": "3770", "city": "Sajószentpéter" },
      await expect(page.locator('#default_varos')).toHaveValue('Sajószentpéter');

      await page.getByRole('button', { name: 'Tovább' }).click();
    });

    await test.step('Paying and delivery', async () => {
      await pages.checkoutPayment.fillPaymentAndDelivery({
        payment: 'barion',
        delivery: 'pickup',
      });
      await page.getByRole('button', { name: 'Tovább' }).click();

      //example assert
      await expect(page.locator('#page_order_control_main')).toContainText(fakeEmail);
      await page.getByText('Elfogadom az Általános szerző').click();
      await page.getByRole('button', { name: 'Megrendel' }).click();
      //simulate unsuccessfull payment
      await page.getByRole('link', { name: 'BackArrow Vissza' })
    });

  });

});
