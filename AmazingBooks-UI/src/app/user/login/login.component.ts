import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserApiService } from '../../services/user-api.service';
import { User } from '../../model/user';
import { CartApiService } from '../../services/cart-api.service';
import { Cart } from '../../model/cart';
@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  @Output() loginEvent = new EventEmitter<boolean>();
  user: User = {
    id: 0,
    name: '',
    loginId: '',
    password: '',
    email: '',
  };

  errorMessage = '';
  message = '';

  constructor(
    private userApi: UserApiService,
    private cartApi: CartApiService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    localStorage.removeItem('user');
    localStorage.removeItem('myToken');
    this.activeRoute.params.subscribe((params) => {
      this.errorMessage = params['error'];
      this.message = params['success'];
    });
  }

  userLogin(loginForm: NgForm) {
    console.log('User login called');
    this.userApi.GetUser(this.user).subscribe({
      next: (data: any) => {
        this.user = data;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('myToken', this.user.token!);
        console.log('Data:', this.user);
        this.loginEvent.emit(true);
        this.cartApi.GetCartItems(this.user.id).subscribe({
          next: (data: Cart[]) => {
            this.cartApi.AddCountToCart(
              data.reduce((sum, data) => sum + data.quantity, 0)
            );
          },
          error: (error) => {
            console.log(error.message);
          },
        });
        this.router.navigateByUrl('/list-books');
      },
      error: (error) => {
        console.log(error);
        this.errorMessage = error?.error;
        loginForm.reset();
      },
    });
  }

  Cancel(loginForm: NgForm) {
    console.log('cancel called');
    loginForm.reset();
    this.message = '';
    this.errorMessage = '';
  }
}
