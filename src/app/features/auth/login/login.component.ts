import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, CardModule, FloatLabelModule,
    PasswordModule, ButtonModule, InputTextModule, ToastModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private msg = inject(MessageService);

  loginError = signal(false);
  isLoading = signal(false);

  // Usamos nonNullable para evitar nulls en TypeScript
  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.loginError.set(false);

    setTimeout(() => {
      // Usamos getRawValue() que es más seguro y no retorna undefined
      const { username, password } = this.form.getRawValue();

      if (this.auth.login(username, password)) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loginError.set(true);
        this.msg.add({
          severity: 'error',
          summary: 'Acceso Denegado',
          detail: 'Solo guerreros Z pueden entrar.'
        });
      }
      this.isLoading.set(false);
    }, 800);
  }
}