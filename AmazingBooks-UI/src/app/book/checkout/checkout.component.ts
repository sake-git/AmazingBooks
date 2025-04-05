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

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  address: Address | undefined;
  addressList: Address[] = [];
  addressForm: FormGroup;
  errorMessage = '';
  message = '';
  newAddress: Address | undefined;
  user: User | undefined;
  isAddAddress = false;

  constructor(private addressApi: AddressApiService) {
    this.addressForm = new FormGroup({
      name: new FormControl('', Validators.required),
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      country: new FormControl('US', Validators.required),
      type: new FormControl('Secondary'),
      FkuserId: new FormControl('1'),
    });
  }

  ngOnInit(): void {
    let userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
      this.GetAddress();
    } else {
      this.errorMessage = 'User not logged in';
      console.log('User not logged it');
    }
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

  SelectAddress(addr: Address) {
    this.address = addr;
  }

  DeleteAddress(addr: Address) {
    this.addressApi.UpdateAddress(addr);
    this.GetAddress();
  }

  AddAddress() {
    this.isAddAddress = true;
  }

  ValidateAddress() {
    this.errorMessage = '';
    this.message = '';

    let address = this.addressForm.value;
    console.log('Address', address);
    this.addressApi.ValidateAddress(address).subscribe({
      next: (data: any) => {
        console.log('Data', data);
        if (data == true) {
          this.newAddress = undefined;
          this.message = 'Address is valid';
          this.SaveAddress();
        } else if (data) {
          this.newAddress = data;
          console.log(data);
          this.message = 'Corrected address';
        }
      },
      error: (error) => {
        console.log('error', error);
        if (error instanceof HttpErrorResponse) {
          console.log('error part', error.error);
          this.errorMessage = error.error;
        } else {
          this.errorMessage = error.Message;
        }
      },
    });
  }

  SaveAddress() {
    console.log('Save address called');
    this.addressApi.SaveAddress(this.address!).subscribe({
      next: (data) => {
        console.log('Saved Message: ', data);
        this.isAddAddress = false;
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
}
