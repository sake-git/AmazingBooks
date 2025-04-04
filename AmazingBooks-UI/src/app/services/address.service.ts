import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address';
import { User } from '../model/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressApiService {
  baseUrl = 'https://localhost:7186/api/Addresses';

  constructor(private http: HttpClient) {}

  GetAddressForUser(userId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.baseUrl}/ByUser/${userId}`);
  }

  ValidateAddress(address: Address) {
    console.log('In Service to call API');
    return this.http.post(`${this.baseUrl}/Validate`, address);
  }

  SaveAddress(address: Address) {
    console.log('In Service to call save API');
    return this.http.post(`${this.baseUrl}`, address);
  }

  UpdateAddress(address: Address) {
    console.log('In Service to call delete API');
    return this.http.put(`${this.baseUrl}`, address);
  }
}
