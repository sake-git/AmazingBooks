import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address';

@Injectable({
  providedIn: 'root',
})
export class ShippoApiService {
  baseUrl = 'https://localhost:7186/api/Addresses';

  constructor(private http: HttpClient) {}

  saveAddress(address: Address) {
    console.log('In Service to call API');
    return this.http.post(`${this.baseUrl}`, address);
  }
}
