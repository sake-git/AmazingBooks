import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartApiService } from './services/cart-api.service';
import { Book } from './model/book';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AmazingBooks-UI';
  quantity = 0;
  isLoggedIn = false;

  constructor(private cartApi: CartApiService) {
    if (localStorage.getItem('user')) {
      this.isLoggedIn = true;
    }

    if (localStorage.getItem('user')) {
      this.isLoggedIn = true;
    }
    /*  let dataStringToParse = localStorage.getItem('myCart');
    if (dataStringToParse) {
      let books: Book[] = JSON.parse(dataStringToParse);
      this.quantity = books.length;
    }
  */
    this.cartApi.GetCartBookCount().subscribe({
      next: (data: number) => {
        this.quantity += data;
        console.log('cart Subscription called');
      },
    });
  }

  OnActivate(componentRef: any) {
    console.log('Inside OnActivated');
    if (componentRef.loginEvent) {
      componentRef.loginEvent.subscribe((data: boolean) => {
        this.isLoggedIn = data;
      });
    }
  }

  Logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
    localStorage.removeItem('myToken');
  }
}
