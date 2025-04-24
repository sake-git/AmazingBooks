import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../model/cart';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  private cartObservable = new BehaviorSubject<number>(0);
  baseUrl = environment.CartApi;
  constructor(private http: HttpClient) {}

  GetCartBookCount() {
    return this.cartObservable.asObservable();
  }

  AddCountToCart(count: number) {
    this.cartObservable.next(count);
  }

  GetCartItems(userId: number): Observable<Cart[]> {
    return this.http.get<Cart[]>(`${this.baseUrl}/GetUserCart/${userId}`);
  }

  SaveToCart(cart: Cart) {
    return this.http.post(`${this.baseUrl}`, cart);
  }

  RemoveFromCart(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  UpdateCartItems(cart: Cart) {
    return this.http.put(`${this.baseUrl}`, cart);
  }
}
