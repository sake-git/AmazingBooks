import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './book/list/list.component';
import { DisplayComponent } from './book/display/display.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { CartComponent } from './book/cart/cart.component';
import { CheckoutComponent } from './book/checkout/checkout.component';
import { OrderComponent } from './book/order/order.component';
import { OrderDetailsComponent } from './book/order-details/order-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/list-books', pathMatch: 'full' },
  { path: 'list-books', component: ListComponent },
  { path: 'list-books/display-book/:id', component: DisplayComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout/:id', component: CheckoutComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order/order-details/:id', component: OrderDetailsComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  /*  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'list-book', component: ListComponent },
      { path: 'display-book', component: DisplayComponent },
    ],
  },*/
];
