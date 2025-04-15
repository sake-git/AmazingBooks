import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/order';
import { OrderApiService } from '../../services/order-api.service';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../model/user';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orderList: Order[] = [];
  user: User | undefined;
  message = '';
  errorMessage = '';
  orderId: string = '';
  id = 0;
  pages: number[] = [];

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
    let filterId;
    if (Number.isNaN(parseInt(this.orderId))) {
      filterId = 0;
    } else {
      filterId = parseInt(this.orderId);
    }
    this.orderApi.GetOrdersByUser(this.user?.id!, filterId, this.id).subscribe({
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

  SearchOrder() {
    this.id = 0;
    this.pages = [];
    this.GetOrderHistory();
  }
  ClearFilter() {
    this.orderId = '';
    this.id = 0;
    this.pages = [];
    this.GetOrderHistory();
  }

  GetPrev() {
    if (this.pages.length != 0) {
      this.id = this.pages.pop()!;
      console.log('Prev', this.id);
      this.GetOrderHistory();
    }
  }
  GetNext() {
    this.pages.push(this.id);
    console.log('Innext', this.orderList[this.orderList.length - 1].id);
    this.id = this.orderList[this.orderList.length - 1].id!;
    this.GetOrderHistory();
  }

  Clear() {
    this.errorMessage = '';
    this.message = '';
  }
}
