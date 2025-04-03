import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Book } from '../../model/book';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  books: Book[] = [];

  constructor() {
    this.books = JSON.parse(localStorage.getItem('myCart')!);
  }
}
