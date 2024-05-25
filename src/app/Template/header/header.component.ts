import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  logOutLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  logout() {
    this.logOutLoading = true;
    this.authService.logout()
    setTimeout(() => {
      console.log("Log out")
      this.router.navigate(['']);
    }, 2000);
  }
}
