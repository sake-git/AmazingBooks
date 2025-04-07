import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/order';
import { OrderApiService } from '../../services/order-api.service';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../model/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orderList: Order[] = [];
  user: User | undefined;
  message = '';
  errorMessage = '';

  constructor(
    private orderApi: OrderApiService,
    private userApi: UserApiService
  ) {}

  ngOnInit(): void {
    this.user = this.userApi.GetUserIdFromLocal();
    this.GetOrderHistory();
  }

  GetOrderHistory() {
    this.orderApi.GetOrdersByUser(this.user?.id!).subscribe({
      next: (data: any) => {
        this.orderList = data;
        console.log('Order history retrieved', data);
      },
      error: (error) => {
        this.errorMessage = 'Error retrieving Order history';
        console.log(error.message);
      },
    });
  }
}
