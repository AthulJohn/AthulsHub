import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as SHA256 from 'crypto-js/sha256';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInValue = false;

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    const hashed = SHA256(password).toString();
    if (username === 'admin' && hashed === environment.adminPasswordHash ) {
      this.isLoggedInValue = true;
      return true;
    }

    return false;
  }

  logout() {
    this.isLoggedInValue = false;
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInValue;
  }
}
