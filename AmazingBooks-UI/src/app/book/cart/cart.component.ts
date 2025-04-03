import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Book } from '../../model/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  books: Book[] = [];

  constructor(private router: Router) {
    this.books = JSON.parse(localStorage.getItem('myCart')!);
  }

  Checkout() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
