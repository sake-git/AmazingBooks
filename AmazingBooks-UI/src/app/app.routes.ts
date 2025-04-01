import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './book/list/list.component';
import { DisplayComponent } from './book/display/display.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'list-book', pathMatch: 'full' },
  { path: 'list-book', component: ListComponent },
  { path: 'display-book', component: DisplayComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  /*  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'list-book', component: ListComponent },
      { path: 'display-book', component: DisplayComponent },
    ],
  },*/
];
