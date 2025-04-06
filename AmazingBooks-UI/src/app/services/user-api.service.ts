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

  public GetUser(user: User): Observable<User> {
    console.log('User login Serive', user);
    return this.http.post<User>(`${this.baseUrl}/Authenticate`, user);
  }

  public CreateUser(user: User) {
    console.log('called Create user from api service', user);
    return this.http.post(`${this.baseUrl}`, user);
  }

  public GetUserIdFromLocal() {
    let stringToParse = localStorage.getItem('user');
    if (!stringToParse) {
      return null;
    } else {
      let user = JSON.parse(stringToParse!);
      return user;
    }
  }
}
