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
  constructor(private shippoApi: ShippoApiService) {
    this.addressForm = new FormGroup({
      addressLine1: new FormControl('', Validators.required),
      addressLine2: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      country: new FormControl('US', Validators.required),
    });
  }

  SaveAddress() {
    let address = this.addressForm.value;
    console.log('Address', address);
    this.shippoApi.validateAddress(address).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        this.errorMessage = error.errorMessage;
      },
    });
  }

  Cancel() {}
}
