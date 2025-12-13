import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from './core/models/user.model';
import { AuthService } from './core/services/auth-service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLinkActive,NgIf,AsyncPipe,RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    // 1. Subscribe to the user state stream
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  // 2. Helper to check if the specific user has Admin privileges
  isAdmin(user: User): boolean {
    return user.role === 'ADMIN';
  }
}