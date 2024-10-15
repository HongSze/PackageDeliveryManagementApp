import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (token) {
      // Optionally, you can add more validation logic here, such as verifying the token's expiration
      return true;
    } else {
      this.router.navigate(['33934479/HongSze/login']);
      return false;
    }
  }
}