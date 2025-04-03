import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address';

@Injectable({
  providedIn: 'root',
})
export class ShippoApiService {
  baseUrl = 'https://api.goshippo.com/v2/addresses/validate';
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
      'Content-Type': 'application/json',
      Authorization: 'ShippoToken ',
    }),
  };
  validateAddress(address: Address) {
    return this.http.get(
      `${this.baseUrl}?address_line_1=${address.addressLine1}&address_line_2
      =${address.addressLine2}&city_locality=${address.city}&state_province
      =${address.state}&postal_code=${address.zip}&country_code=${address.country}`,
      this.httpOptions
    );
  }
}
