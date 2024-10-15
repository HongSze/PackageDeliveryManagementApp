import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    console.log('Login button clicked');
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login successful');
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Login error:', err);
        this.router.navigate(['33934479/HongSze/invalid-data']);
      }
    });
  }

  logout() {
    console.log('Logout button clicked');
    this.authService.logout();
  }
}