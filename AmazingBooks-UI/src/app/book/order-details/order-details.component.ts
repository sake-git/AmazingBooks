import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/order';
import { OrderApiService } from '../../services/order-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  order: Order | undefined;
  errorMessage = '';
  constructor(
    private orderApi: OrderApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      let id = param['id'];
      if (id == null) {
        this.errorMessage = 'Order information missing';
      } else {
        this.orderApi.GetOrderDetails(id).subscribe({
          next: (data: any) => {
            this.order = data;
            console.log('Data', data);
          },
          error: (error) => {
            this.errorMessage = 'Error fetching error information';
            console.log(error);
          },
        });
      }
    });
  }
}
