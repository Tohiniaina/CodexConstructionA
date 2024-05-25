import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  logOutLoading: boolean = false;

  constructor(private router: Router) { }

  logout() {
    this.logOutLoading = true;
    setTimeout(() => {
      console.log("Log out")
      this.router.navigate(['']);
    }, 2000);
  }
}
