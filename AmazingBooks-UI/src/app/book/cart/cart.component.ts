import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../../model/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  books: Book[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.books = JSON.parse(localStorage.getItem('myCart')!);
  }

  Checkout() {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    localStorage.setItem('myCart', JSON.stringify(this.books));
  }
}
