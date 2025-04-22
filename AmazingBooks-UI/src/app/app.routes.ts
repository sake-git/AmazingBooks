import { Routes } from '@angular/router';

import { ListComponent } from './book/list/list.component';
import { DisplayComponent } from './book/display/display.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { CartComponent } from './book/cart/cart.component';
import { CheckoutComponent } from './book/checkout/checkout.component';
import { OrderComponent } from './book/order/order.component';
import { OrderDetailsComponent } from './book/order-details/order-details.component';
import { authGuard } from './services/auth.guard';
import { RequestComponent } from './book/request/request.component';
import { ProcureBookComponent } from './admin/procure-book/procure-book.component';
import { PageNotFoundComponent } from './user/page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/list-books', pathMatch: 'full' },
  { path: 'list-books', component: ListComponent },
  { path: 'list-books/display-book/:id', component: DisplayComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  {
    path: 'checkout/:id',
    component: CheckoutComponent,
    canActivate: [authGuard],
  },
  { path: 'order', component: OrderComponent, canActivate: [authGuard] },
  {
    path: 'order/order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'request-book',
    component: RequestComponent,
    canActivate: [authGuard],
  },
  {
    path: 'procure-book',
    component: ProcureBookComponent,
    canActivate: [authGuard],
  },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: PageNotFoundComponent },
];
