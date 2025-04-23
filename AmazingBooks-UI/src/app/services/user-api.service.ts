import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../model/user';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  baseUrl = environment.UserApi;

  constructor(private http: HttpClient) {}

  public GetUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/Authenticate`, user);
  }

  public GetLocation(latitude: number, longitude: number) {
    return this.http.get(
      `${environment.GeoApiCodeR}?lat=${latitude}&lon=${longitude}&apiKey=${environment.GeoApiFy}`
    );
  }

  public ValidateLocation(city: string, state: string) {
    return this.http.get(
      `${environment.GeoApiCode}?city=${city}&state=${state}&apiKey=${environment.GeoApiFy}`
    );
  }

  public CreateUser(user: User) {
    return this.http.post(`${this.baseUrl}`, user);
  }

  public Logout(user: User) {
    return this.http.put(`${this.baseUrl}/RevokeToken`, user);
  }

  public RefreshToken(user: User): Observable<any> {
    console.log('refresh token called');
    return this.http.post<User>(`${this.baseUrl}/RefreshToken`, user).pipe(
      tap({
        next: (data: User) => {
          let user = data;
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('accessToken', user.token!);
        },
        error: (error) => {
          console.error('Error refreshing access token:', error);
        },
      })
    );
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
