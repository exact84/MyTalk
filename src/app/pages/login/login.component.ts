import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from '../../data/interfaces/auth.interface';

type LoginFormData = {
  //типизация формы чтобы избежать возможных null
  username: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup<LoginFormData>({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.form.invalid) return;
    const loginData = this.form.getRawValue();
    this.authService.login(loginData).subscribe({
      next: (response: AuthResponse) => {
        console.log('Server Response:', response);
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login Error:', err);
      },
    });
    console.log(this.form.value);
  }
}
