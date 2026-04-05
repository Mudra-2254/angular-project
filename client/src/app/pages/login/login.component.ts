import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  errorMessage = '';

  constructor(
    private authser: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  async login() {

    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    try {
      console.log('LoginComponent: attempting login...');
      const credential = await this.authser.login(email, password);
      console.log('LoginComponent: login successful, syncing user...');
      await this.authser.syncUser(credential.user);
      console.log('LoginComponent: user synced, navigating home...');
      console.log('LoginComponent: user synced, navigating home...');
      this.toastService.success('Login successful');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('LoginComponent error:', error);

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
