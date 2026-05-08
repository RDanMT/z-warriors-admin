import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'zw_token';
const VALID_USER = 'kakarot';
const VALID_PASS = 'saiyan123';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  login(username: string, password: string): boolean {
    if (username === VALID_USER && password === VALID_PASS) {
      localStorage.setItem(TOKEN_KEY, btoa(`${username}:${Date.now()}`));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }
}
