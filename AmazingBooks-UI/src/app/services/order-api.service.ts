import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../model/order';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  baseUrl = environment.OrderApi;
  constructor(private http: HttpClient) {}

  public GetOrdersByUser(userId: number, orderId: number, id: number) {
    console.log('Get Orders Api called ', userId);
    return this.http.get(
      `${this.baseUrl}/ByUser/${userId}?id=${id}&&orderId=${orderId}`
    );
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
    zip = zip.substring(0, 5);
    console.log('Calling api for Sales Tax for Zip: ', zip);
    return this.http.get(`${this.baseUrl}/SalesTax/${zip}`);
  }

  public UpdateOrderStatus(order: Order) {
    console.log('Calling api for order update: ', order);
    return this.http.put(`${this.baseUrl}`, order);
  }
}
