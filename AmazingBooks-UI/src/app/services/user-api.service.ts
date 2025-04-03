import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  baseUrl = 'https://localhost:7186/api/Users';

  constructor(private http: HttpClient) {}

  public getUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/Authenticate`, user);
  }

  createUser(user: User) {
    console.log('called Create user from api service', user);
    return this.http.post(`${this.baseUrl}`, user);
  }
}
