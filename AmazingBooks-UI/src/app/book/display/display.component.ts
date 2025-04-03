import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../../model/book';
import { BookApiService } from '../../services/book-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartApiService } from '../../services/cart-api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  book: Book | undefined;
  quantity = 1;

  constructor(
    private bookApi: BookApiService,
    private cartApi: CartApiService,
    private router: ActivatedRoute
  ) {
    this.router.params.subscribe((params) => {
      let id = params['id'];
      if (id != null) {
        this.bookApi.getBook(id).subscribe({
          next: (data) => {
            this.book = data;
          },
          error: (error) => {
            console.error('Something went wrong: ', error.message);
          },
        });
      } else {
        console.log('invalid Id');
      }
    });
  }

  addToCart() {
    if (!this.book) {
      console.log('Something went wrong');
      return;
    }

    let books: Book[] = JSON.parse(localStorage.getItem('myCart')!);
    console.log('AddtoCart');
    this.cartApi.addToCart(this.quantity);
    let booktoAdd = {
      id: this.book.id,
      quantity: this.quantity,
      name: this.book.name,
      price: this.book.price,
      author: this.book.author,
      hardcover: this.book.hardcover,
    };

    if (books) {
      let existingBook = books.find((data) => data.id == this.book!.id);
      if (existingBook) {
        existingBook.quantity += this.quantity;
      } else {
        this.book.quantity = this.quantity;
      }
      books.push(booktoAdd);
    } else {
      books = [booktoAdd];
    }

    let serializedData = JSON.stringify(books);
    localStorage.setItem('myCart', serializedData);
  }
}
