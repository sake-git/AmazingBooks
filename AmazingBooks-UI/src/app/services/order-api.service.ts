import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../model/order';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  baseUrl = 'https://localhost:7186/api/Orders';
  constructor(private http: HttpClient) {}

  public GetOrdersByUser(userId: number) {
    console.log('Get Orders Api called ', userId);
    return this.http.get(`${this.baseUrl}/ByUser/${userId}`);
  }

  public GetOrderDetails(id: number) {
    console.log('Get Orders Api called ', id);
    return this.http.get(`${this.baseUrl}/Details/${id}`);
  }

  public SaveOrder(order: Order) {
    console.log('Get Orders Api called ', order);
    return this.http.post(`${this.baseUrl}`, order);
  }
  public CancelOrder(order: Order) {
    console.log('Get Orders Api called ', order);
    return this.http.put(`${this.baseUrl}`, order);
  }

  public GetSalesTax(zip: string) {
    console.log('Calling api for Sales Tax for Zip: ', zip);
    return this.http.get(`${this.baseUrl}/SalesTax/${zip}`);
  }
}
