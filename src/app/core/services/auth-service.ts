import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { AuthResponse, JwtPayload } from '../models/auth-response.model';
import { jwtDecode } from 'jwt-decode';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // State management: Holds the current user object
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(data: { email: string; password: string; name?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }


  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        // We receive the token from the backend
        if (response.token) {
          this.setSession(response.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  // Helper: Checks if user is logged in (used by AuthGuard)
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  // Helper: Checks if user is Admin (used by AdminGuard)
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN'; 
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // --- Private Helpers ---

  // Decodes the token and updates the application state
  private setSession(token: string) {
    try {
      const decoded: JwtPayload = jwtDecode(token);

      const user: User = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        token: token
      };

      localStorage.setItem('token', token);
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
  }

  // Restores session on page refresh
  private loadUserFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        if (isExpired) {
          this.logout();
        } else {
          this.setSession(token);
        }
      } catch (e) {
        this.logout();
      }
    }
  }
}