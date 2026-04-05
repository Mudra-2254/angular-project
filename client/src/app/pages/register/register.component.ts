import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register.component.html',
})
export class RegisterComponent {

  errorMsg = '';

  constructor(
    private authser: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  async register() {

    try {
      console.log('RegisterComponent: attempting registration...');
      const email = this.registerForm.value.email!;
      const password = this.registerForm.value.password!;
      const credential = await this.authser.register(email, password);
      console.log('RegisterComponent: registration successful, saving user...');
      await this.authser.saveUser(credential.user);
      console.log('RegisterComponent: user saved, navigating back to login...');
      this.toastService.success('Registration successful');

      // ✅ redirect after register
      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('RegisterComponent error:', error);
      this.errorMsg = error.message;
      this.toastService.error(this.errorMsg);
    }
  }
}
