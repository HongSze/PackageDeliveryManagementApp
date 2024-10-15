import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    console.log('Signup button clicked');
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Confirm Password:', this.confirmPassword);
    this.authService.signup(this.username, this.password, this.confirmPassword).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.router.navigate(['/33934479/HongSze/login']);
      },
      error: (err: any) => {
        console.error('Signup error:', err);
      }
    });
  }
}