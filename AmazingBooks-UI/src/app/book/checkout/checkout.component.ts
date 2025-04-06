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
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../model/user';
import { UserApiService } from '../../services/user-api.service';
import { CartApiService } from '../../services/cart-api.service';
import { Cart } from '../../model/cart';

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

  constructor(
    private addressApi: AddressApiService,
    private userApi: UserApiService,
    private cartApi: CartApiService
  ) {}

  ngOnInit(): void {
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
}
