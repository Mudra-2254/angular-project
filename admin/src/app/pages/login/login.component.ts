import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastService } from '../../service/toast.service';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  errorMessage = '';

  constructor(
    private authser: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  async login() {

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    try {

      await this.authser.login(email, password);
      this.toastService.success('Login successful');

      // ✅ Navigate to Add Product page
      this.router.navigate(['/']);

    } catch (error: any) {

      console.log(error);

      // ✅ Firebase error handling
      if (error.code === 'auth/user-not-found') {
        this.errorMessage = 'User not found';
      }
      else if (error.code === 'auth/wrong-password') {
        this.errorMessage = 'Incorrect password';
      }
      else if (error.code === 'auth/invalid-email') {
        this.errorMessage = 'Invalid email format';
      }
      else {
        this.errorMessage = 'Login failed. Try again.';
      }
      this.toastService.error(this.errorMessage);
    }
  }
}
