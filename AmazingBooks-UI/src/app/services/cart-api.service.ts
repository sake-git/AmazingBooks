import { Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../model/book';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private cartObservable = new BehaviorSubject<number>(0);

  constructor() {}

  getCartBooks() {
    return this.cartObservable.asObservable();
  }

  addToCart(count: number) {
    console.log('Inservice: count:' + count);
    this.cartObservable.next(count);
  }
}
