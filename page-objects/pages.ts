import { Page } from '@playwright/test';

// If NavBar.page.ts is in 'c:\mygit\netlock_\page-objects\common\NavBar.page.ts', use:
import { NavBar } from '@pages/common/NavBar.page';
import { Product } from '@pages/Product.page';
import { Checkout } from '@pages/CheckoutContact.page';
import { CheckoutPayment } from '@pages/CheckoutPay.page';
import { ApiFuncs } from '@api/login';

export class PageObjects {
  navBar: NavBar;
  product: Product;
  checkout: Checkout;
  checkoutPayment: CheckoutPayment;
  apiFuncs: ApiFuncs;

  constructor(page: Page) {
    this.navBar = new NavBar(page);
    this.product = new Product(page);
    this.checkout = new Checkout(page);
    this.checkoutPayment = new CheckoutPayment(page);
    this.apiFuncs = new ApiFuncs(page);
  }   
}
