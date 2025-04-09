import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../model/address';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AddressApiService {
  baseUrl = environment.AddressApi;

  constructor(private http: HttpClient) {}

  GetAddress(id: number): Observable<Address> {
    console.log('Get address for ', id);
    return this.http.get<Address>(`${this.baseUrl}/${id}`);
  }

  GetAddressForUser(userId: number): Observable<Address[]> {
    console.log('Get address for ', userId);
    return this.http.get<Address[]>(`${this.baseUrl}/ByUser/${userId}`);
  }

  ValidateAddress(address: Address) {
    console.log('In Service to call API');
    return this.http.post(`${this.baseUrl}/Validate`, address);
  }

  SaveAddress(address: Address) {
    console.log('In Service to call save API', address);
    return this.http.post(`${this.baseUrl}`, address);
  }

  UpdateAddress(address: Address) {
    console.log('In Service to call delete API', address);
    return this.http.put(`${this.baseUrl}`, address);
  }
}
