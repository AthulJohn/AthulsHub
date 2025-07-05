import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from '../shared/services/supabase.service';
import { User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import * as SHA256 from 'crypto-js/sha256';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    // Subscribe to Supabase auth changes
    this.supabaseService.getCurrentUser().subscribe(user => {
      this.currentUser.next(user);
      console.log('Auth state updated:', user ? 'Authenticated' : 'Not authenticated');
    });

    // Check for existing session on startup
    this.checkExistingSession();
  }

  private async checkExistingSession() {
    const { data: { session }, error } = await this.supabaseService.getClient().auth.getSession();
    if (session && !error) {
      this.currentUser.next(session.user);
      console.log('Existing session found');
    } else if (error) {
      console.error('Session check error:', error);
    }
  }

  private checkPasswordHash(username: string, password: string): boolean {
    const hashed = SHA256(password).toString();
    return username === 'admin' && hashed === environment.adminPasswordHash;
  }

  async login(username: string, password: string): Promise<boolean> {
    // First check the password hash
    if (!this.checkPasswordHash(username, password)) {
      console.error('Password hash check failed');
      return false;
    }

    // If hash check passes, attempt Supabase login
    try {
      // Use a predefined admin email for Supabase (can be different from the username)
      const adminEmail = environment.adminEmail || 'admin@atjhub.com';
      const { error } = await this.supabaseService.signIn(adminEmail, environment.SUPABASE_PASSWORD);
      if (error) {
        console.error('Supabase login error:', error);
        return false;
      }
      
      // Verify the session was created
      const { data: { session } } = await this.supabaseService.getClient().auth.getSession();
      if (!session) {
        console.error('No session created after login');
        return false;
      }

      console.log('Login successful, session created');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async logout() {
    await this.supabaseService.signOut();
    this.currentUser.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser.value !== null;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async refreshSession(): Promise<void> {
    const { data: { session }, error } = await this.supabaseService.getClient().auth.getSession();
    if (error) {
      console.error('Session refresh error:', error);
      this.currentUser.next(null);
      this.router.navigate(['/login']);
      return;
    }
    
    if (session) {
      this.currentUser.next(session.user);
    }
  }
}
