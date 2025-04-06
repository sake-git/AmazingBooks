import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../model/cart';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private cartObservable = new BehaviorSubject<number>(0);
  baseUrl = 'https://localhost:7186/api/Carts';
  constructor(private http: HttpClient) {}

  GetCartBookCount() {
    return this.cartObservable.asObservable();
  }

  AddCountToCart(count: number) {
    console.log('Inservice: count:' + count);
    this.cartObservable.next(count);
  }

  GetCartItems(userId: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/GetUserCart/${userId}`);
  }

  SaveToCart(cart: Cart) {
    console.log('Save to cart Api called1 ', cart);
    return this.http.post(`${this.baseUrl}`, cart);
  }

  RemoveFromCart(id: number) {
    console.log('Remove to cart Api called1 ', id);
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  UpdateCartItems(cart: Cart) {
    console.log('Update cart Api called1 ', cart);
    return this.http.put(`${this.baseUrl}`, cart);
  }
}
