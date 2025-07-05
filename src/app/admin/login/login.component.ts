import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  loginFailed = false;
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    if (!this.username || !this.password) {
      this.loginFailed = true;
      return;
    }

    this.isLoading = true;
    this.loginFailed = false;

    try {
      const success = await this.auth.login(this.username, this.password);
      if (success) {
        this.router.navigate(['/admin']);
      } else {
        this.loginFailed = true;
      }
    } catch (error) {
      console.error('Login error:', error);
      this.loginFailed = true;
    } finally {
      this.isLoading = false;
    }
  }
}
