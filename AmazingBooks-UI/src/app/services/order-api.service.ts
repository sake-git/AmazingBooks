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
    return this.http.get(
      `${this.baseUrl}/ByUser/${userId}?id=${id}&&orderId=${orderId}`
    );
  }

  public GetOrderDetails(id: number) {
    return this.http.get(`${this.baseUrl}/Details/${id}`);
  }

  public SaveOrder(order: Order) {
    return this.http.post(`${this.baseUrl}`, order);
  }
  public CancelOrder(order: Order) {
    return this.http.put(`${this.baseUrl}`, order);
  }

  public GetSalesTax(zip: string) {
    zip = zip.substring(0, 5);
    return this.http.get(`${this.baseUrl}/SalesTax/${zip}`);
  }

  public UpdateOrderStatus(order: Order) {
    return this.http.put(`${this.baseUrl}`, order);
  }
}
