import { Component } from '@angular/core';
import { UserApiService } from '../../services/user-api.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../model/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  user: User = {
    id: 0,
    name: '',
    loginId: '',
    email: '',
  };

  errorMessage = '';

  constructor(private userApi: UserApiService, private router: Router) {}

  CreateUser() {
    var message = this.userApi.CreateUser(this.user).subscribe({
      next: (data) => {
        this.router.navigate([
          '/login',
          { success: 'User created successfully' },
        ]);
      },
      error: (error) => {
        this.errorMessage = error.error;
        console.log('Error creating user', error);
      },
    });
  }

  Cancel() {
    this.router.navigateByUrl('/login');
  }
}
