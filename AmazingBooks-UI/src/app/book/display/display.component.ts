import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../../model/book';
import { BookApiService } from '../../services/book-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartApiService } from '../../services/cart-api.service';
import { FormsModule } from '@angular/forms';
import { Cart } from '../../model/cart';
import { UserApiService } from '../../services/user-api.service';

@Component({
  selector: 'app-display',
  imports: [CommonModule, FormsModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css',
})
export class DisplayComponent {
  book: Book | undefined;
  cart: Cart | undefined;
  quantity = 1;
  errorMessage = '';
  message = '';

  constructor(
    private bookApi: BookApiService,
    private cartApi: CartApiService,
    private userApi: UserApiService,
    private router: ActivatedRoute
  ) {
    this.router.params.subscribe((params) => {
      let id = params['id'];
      if (id != null) {
        this.bookApi.GetBook(id).subscribe({
          next: (data) => {
            this.book = data;
          },
          error: (error) => {
            console.error('Something went wrong: ', error);
            this.errorMessage = 'Error fetching book infromation';
          },
        });
      } else {
        console.log('invalid Id');
      }
    });
  }

  addToCart() {
    console.log('AddtoCart');
    let user = this.userApi.GetUserIdFromLocal();
    if (!user) {
      this.errorMessage = 'Please log in to Add to cart';
    }
    if (!this.book) {
      console.log('Something went wrong');
      return;
    }

    this.cartApi.AddCountToCart(this.quantity);
    this.cart = {
      fkuserId: user.id,
      fkbookId: this.book.id!,
      quantity: this.quantity,
    };

    this.cartApi.SaveToCart(this.cart).subscribe({
      next: (data) => {
        console.log('Item added to cart');
        this.message = 'Item added to cart';
      },
      error: (error) => {
        console.log(error.message);
      },
    });

    /*
    let books: Book[] = JSON.parse(localStorage.getItem('myCart')!);
    console.log('AddtoCart');
    this.cartApi.AddCountToCart(this.quantity);
    let booktoAdd = {
      id: this.book.id,
      quantity: this.quantity,
      name: this.book.name,
      price: this.book.price,
      author: this.book.author,
      hardcover: this.book.hardcover,
      imgUrl: this.book.imgUrl,
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
    localStorage.setItem('myCart', serializedData);*/
  }

  UpdateQuantity(action: number) {
    this.errorMessage = '';
    this.message = '';
    if (action == 0) {
      if (this.quantity > 1) {
        --this.quantity;
      }
    } else if (action == 1) {
      ++this.quantity;
    }
  }
}
