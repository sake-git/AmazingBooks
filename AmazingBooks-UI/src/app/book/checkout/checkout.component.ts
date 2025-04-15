import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address } from '../../model/address';
import { AddressApiService } from '../../services/address.service';
import { User } from '../../model/user';
import { UserApiService } from '../../services/user-api.service';
import { CartApiService } from '../../services/cart-api.service';
import { Cart } from '../../model/cart';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderLine } from '../../model/orderLine';
import { Order } from '../../model/order';
import { OrderApiService } from '../../services/order-api.service';
import { StripeService } from '../../services/stripe.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  address: Address | undefined;
  cartItems: Cart[] = [];
  sum = 0;
  errorMessage = '';
  message = '';
  user: User | undefined;
  taxRate: number = 0.0;
  order: Order | undefined;

  constructor(
    private addressApi: AddressApiService,
    private userApi: UserApiService,
    private cartApi: CartApiService,
    private orderApi: OrderApiService,
    private stripeApi: StripeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      let id = param['id'];
      this.addressApi.GetAddress(id).subscribe({
        next: (data) => {
          this.address = data;
          console.log('Address: ', this.address);
          this.orderApi.GetSalesTax(this.address?.zip!).subscribe({
            next: (data: any) => {
              console.log('Rate fetched successfully: ', data);
              this.taxRate = data;
            },
            error: (error) => {
              console.log('Error while fetching data: ', error);
              this.errorMessage = 'Sales tax rate fetch failed';
            },
          });
        },
        error: (error) => {
          this.errorMessage = 'Error retrieving selected Address';
          console.log(error.message);
        },
      });
    });
    this.user = this.userApi.GetUserIdFromLocal();
    this.GetCartDetails(this.user?.id!);
  }

  GetCartDetails(id: number) {
    this.cartApi.GetCartItems(id).subscribe({
      next: (data: Cart[]) => {
        this.cartItems = data;
        console.log('Cart data Received:', data);
        this.sum = this.cartItems.reduce(
          (sum, current) => (sum += current.quantity * current.book?.price!),
          0
        );
      },
      error: (error) => {
        this.errorMessage = 'Error while retrieving Cart information';
        console.log(error.message);
      },
    });
  }

  PlaceOrder(action: number) {
    let lineItemtotal = 0;
    let orderLine: OrderLine[] = [];
    this.cartItems.forEach((item) => {
      console.log('Item', item);
      orderLine.push({
        id: 0,
        fkbookId: item.fkbookId,
        amount: item.book?.price!,
        quantity: item.quantity,
      });
      console.log('OrderLine infor loop');
      lineItemtotal += item.book?.price! * item.quantity;
    });

    console.log('OrderLine', orderLine);
    let shipping = 7.99;
    let subTotal = lineItemtotal + shipping;
    let tax = subTotal * this.taxRate;
    let total = parseFloat((subTotal + tax).toFixed(2));

    let order: Order = {
      id: 0,
      orderDate: new Date(),
      subTotal: lineItemtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      status: 'Pending',
      fkuserId: this.user?.id!,
      fkshippingAddress: this.address?.id!,
      orderLines: orderLine,
      paymentMethod: 'Online',
      paymentStatus: 'Failed',
    };
    console.log('Order', order);
    if (action == 1) {
      order.status = 'Placed';
      order.paymentMethod = 'COD';
      order.paymentStatus = 'Pending';
    }

    this.orderApi.SaveOrder(order).subscribe({
      next: (data: any) => {
        console.log('Data after order placement', data);
        this.order = data;
        this.cartApi.AddCountToCart(-99);
        if (this.order != null && action == 0) {
          this.message = 'Awaiting Payment';
          this.MakePayment();
        } else {
          this.message = 'Order Placed';
          setTimeout(() => '', 2000);

          this.router.navigateByUrl('order-details/' + this.order?.id);
        }
      },
      error: (error: any) => {
        this.errorMessage =
          'Order could not be proccessed at this time. Please try later.';
        console.log(error.message);
      },
    });
  }

  MakePayment() {
    this.stripeApi.MakePayment(this.order!).subscribe({
      next: (data) => {
        console.log('data', data);
      },
      error: (error) => console.log('Error: ', error),
    });
  }

  Clear() {
    this.message = '';
    this.errorMessage = '';
  }
}
