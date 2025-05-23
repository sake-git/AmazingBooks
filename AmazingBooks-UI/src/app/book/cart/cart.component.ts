import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartApiService } from '../../services/cart-api.service';
import { User } from '../../model/user';
import { Cart } from '../../model/cart';
import { UserApiService } from '../../services/user-api.service';
import { AddressApiService } from '../../services/address.service';
import { Address } from '../../model/address';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  user: User | undefined;
  cartItems: Cart[] = [];
  errorMessage = '';
  addrErrorMessage = '';
  addrMessage = '';
  message = '';
  addressList: Address[] = [];
  address: Address | undefined;
  addressForm: FormGroup;
  newAddress: Address | undefined;
  selectedAddress: number = 0;
  isAddAddress = false;

  constructor(
    private cartApi: CartApiService,
    private userApi: UserApiService,
    private addressApi: AddressApiService,
    private router: Router
  ) {
    this.addressForm = new FormGroup({
      name: new FormControl('', Validators.required),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      country: new FormControl('US', Validators.required),
      type: new FormControl('Secondary'),
      fkuserId: new FormControl('1'),
    });
  }

  ngOnInit(): void {
    this.user = this.userApi.GetUserIdFromLocal();

    if (!this.user) {
      this.router.navigate(['/login']);
    }

    this.GetCartDetails(this.user?.id!);
    if (this.user) {
      this.GetAddress();
    }
  }

  GetCartDetails(id: number) {
    this.cartApi.GetCartItems(id).subscribe({
      next: (data: Cart[]) => {
        this.cartItems = data;
        let count = this.cartItems.reduce(
          (count, current) => (count += current.quantity),
          0
        );
        this.cartApi.AddCountToCart(-99);
        this.cartApi.AddCountToCart(count);
      },
      error: (error) => {
        this.errorMessage = 'Error while retrieving Cart information';
        console.log(error.message);
      },
    });
  }

  RemoveFromCart(item: Cart) {
    this.cartApi.RemoveFromCart(item.id!).subscribe({
      next: (data) => {
        this.message = 'Item removed from cart';
        this.GetCartDetails(this.user?.id!);
        this.cartApi.AddCountToCart(item.quantity * -1);
      },
      error: (error) => {
        this.errorMessage = 'Failed to Remove item from cart';
        console.log(error.message);
      },
    });
  }

  UpdateCart(item: Cart, action: number) {
    this.errorMessage = '';
    this.message = '';
    let previousQuantity = item.quantity;
    let count = 0;
    if (action == 0) {
      if (item.quantity <= 1) {
        this.RemoveFromCart(item);
        return;
      } else {
        --item.quantity;
      }
      --count;
    } else if (action == 1) {
      ++item.quantity;
      ++count;
    } else {
      this.errorMessage = 'Unknown action requested';
      return;
    }
    this.cartApi.UpdateCartItems(item).subscribe({
      next: (data: any) => {
        this.message = 'Cart Updated successfully';
        this.cartApi.AddCountToCart(count);
      },
      error: (error) => {
        this.errorMessage = 'Cart Update failed';
        item.quantity = previousQuantity;
        console.log(error.message);
      },
    });
  }

  GetAddress() {
    this.addressApi.GetAddressForUser(this.user!.id).subscribe({
      next: (data) => {
        this.addressList = data;
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.log('User not logged it');
      },
    });
  }

  DeleteAddress(addr: Address) {
    this.addressApi.UpdateAddress(addr).subscribe({
      next: (data) => {
        this.message = 'Address deleted successfully';
        this.GetAddress();
      },
      error: (error) => {
        this.errorMessage = 'Error while deleting address.';
        console.log(error.message);
      },
    });
    this.GetAddress();
  }

  AddAddress() {
    this.isAddAddress = true;
  }

  ValidateAddress() {
    this.addrErrorMessage = '';
    this.addrMessage = '';

    this.address = this.addressForm.value;
    this.address!.fkuserId = this.user?.id;

    this.addressApi.ValidateAddress(this.address!).subscribe({
      next: (data: any) => {
        if (data == true) {
          this.newAddress = undefined;
          this.addrMessage = 'Address is valid';
          this.SaveAddress();
        } else if (data) {
          this.newAddress = data;
          this.newAddress!.fkuserId = this.user?.id;
          this.newAddress!.name = this.address?.name!;
          this.addrMessage = 'Corrected address';
        }
      },
      error: (error) => {
        console.log('error', error);
        if (error instanceof HttpErrorResponse) {
          console.log('error part', error.error);
          this.addrErrorMessage = error.error;
        } else {
          this.addrErrorMessage = error.Message;
        }
      },
    });
  }

  SaveAddress() {
    if (this.newAddress) {
      this.address = this.newAddress;
      this.newAddress = undefined;
    }
    this.addressApi.SaveAddress(this.address!).subscribe({
      next: (data) => {
        this.isAddAddress = false;
        this.GetAddress();
      },
      error: (error) => {
        console.log('Error: ', error.message);
      },
    });
  }

  Cancel() {
    this.addressForm.reset();
    this.isAddAddress = false;
  }

  Checkout() {
    this.router.navigateByUrl(`/checkout/${this.selectedAddress}`);
  }

  Clear() {
    this.errorMessage = '';
    this.message = '';
  }
}
