import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartApiService } from './services/cart-api.service';
import { Book } from './model/book';
import { UserApiService } from './services/user-api.service';
import { FormsModule } from '@angular/forms';
import { User } from './model/user';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'AmazingBooks-UI';
  quantity = 0;
  isLoggedIn = false;
  city = '';
  state = '';
  isUpdateCity = false;
  errorMessage = '';
  originalCity = '';
  originalState = '';
  user: User | undefined;

  constructor(
    private cartApi: CartApiService,
    private userApi: UserApiService
  ) {
    this.user = this.userApi.GetUserIdFromLocal();
    if (this.user) {
      this.isLoggedIn = true;
    }

    this.cartApi.GetCartBookCount().subscribe({
      next: (data: number) => {
        if (data == -99) {
          this.quantity = 0;
        } else {
          this.quantity += data;
        }
      },
    });

    if (navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.userApi
            .GetLocation(position.coords.latitude, position.coords.longitude)
            .subscribe((data: any) => {
              console.log(data.features[0].properties.city);
              this.city = data.features[0].properties.city;
              this.state = data.features[0].properties.state_code;
              this.originalCity = this.city;
              this.originalState = this.state;
            });
        }
      });
    }
  }

  OnActivate(componentRef: any) {
    if (componentRef.loginEvent) {
      componentRef.loginEvent.subscribe((data: boolean) => {
        this.isLoggedIn = data;
        this.user = this.userApi.GetUserIdFromLocal();
      });
    }
  }

  UpdateLocation() {
    let state = '';
    let city = '';
    this.errorMessage = '';
    this.userApi.ValidateLocation(this.city, this.state).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.features.length; i++) {
          let property = data.features[i];
          if (
            property.properties.city == this.city &&
            (property.properties.state == this.state ||
              property.properties.state_code == this.state)
          ) {
            city = data.features[0].properties.city;
            state = data.features[0].properties.state_code;
            this.originalCity = city;
            this.originalState = state;
            this.isUpdateCity = false;
          }
        }
        if (city == '' && state == '') {
          this.errorMessage = 'Invalid location';
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid Location';
      },
    });
  }

  CancelLocation() {
    this.isUpdateCity = false;
    this.errorMessage = '';
    this.city = this.originalCity;
    this.state = this.originalState;
  }
  Logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    console.log(this.user);
    this.userApi.Logout(this.user!).subscribe({
      next: (data) => {
        console.log('Success');
      },
    });
  }
}
