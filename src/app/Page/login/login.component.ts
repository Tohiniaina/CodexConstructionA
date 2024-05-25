import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  logInLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.logInLoading = true;
    setTimeout(() => {
      this.authService.signinAdmin(this.email, this.password).subscribe(
        response => {
          if (response.accessToken) {
            this.authService.saveTokenAndUser(response.accessToken);
            console.log('Token saved:', response.accessToken);
            this.router.navigate(['/home']);
          } else {
            this.logInLoading = false;
            this.errorMessage = response.error || 'Une erreur s\'est produite';
          }
        },
        error => {
          this.logInLoading = false;
          this.errorMessage = 'Email or Password invalid';
        }
      );
    }, 500);

  }
}
