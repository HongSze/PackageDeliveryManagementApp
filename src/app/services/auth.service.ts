import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/v1/auth'; 
  private loggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  signup(username: string, password: string, confirmPassword: string): Observable<any> {
    console.log('Signup request:', { username, password, confirmPassword });
    return this.http.post(`${this.apiUrl}/signup`, { username, password, confirmPassword }, httpOptions)
      .pipe(
        tap(response => {
          console.log('Signup response:', response);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Signup error:', error);
          return of(null);
        })
      );
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }, httpOptions)
      .pipe(
        tap(response => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', response.token);
          }
        })
      );
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['33934479/HongSze/login']);
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }
}