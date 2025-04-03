import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Address } from '../../model/address';
import { ShippoApiService } from '../../services/shippo-api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  address: Address | undefined;
  addressForm: FormGroup;
  errorMessage = '';
  message = '';
  newAddress: Address | undefined;

  constructor(private shippoApi: ShippoApiService) {
    this.addressForm = new FormGroup({
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

  SaveAddress() {
    this.errorMessage = '';
    let address = this.addressForm.value;
    console.log('Address', address);
    this.shippoApi.saveAddress(address).subscribe({
      next: (data: any) => {
        console.log('Data', data);
        if (data == true) {
          this.newAddress = undefined;
          this.message = 'Address is valid';
        } else if (data) {
          this.newAddress = data;
          console.log(data);
          this.message = 'Address is partially valid';
        }
      },
      error: (error) => {
        console.log('error', error);
        if (error instanceof HttpErrorResponse) {
          console.log('error part', error.error);
          this.errorMessage = error.error[0].code;
        } else {
          this.errorMessage = error.Message;
        }
      },
    });
  }

  Cancel() {}
}
