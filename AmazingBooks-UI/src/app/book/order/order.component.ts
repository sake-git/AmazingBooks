import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/order';
import { OrderApiService } from '../../services/order-api.service';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../model/user';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterLink],
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
    private userApi: UserApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userApi.GetUserIdFromLocal();
    this.GetOrderHistory();
  }

  GetOrderHistory() {
    this.orderApi.GetOrdersByUser(this.user?.id!).subscribe({
      next: (data: any) => {
        this.orderList = data;
        /*  let order: Order;
        order = data;
        console.log('Order history retrieved', data);
        this.router.navigateByUrl('./order-details/${}');*/
      },
      error: (error) => {
        this.errorMessage = 'Error retrieving Order history';
        console.log(error.message);
      },
    });
  }
}
