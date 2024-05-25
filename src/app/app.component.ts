import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CodexConstruction';
  showHeader = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showHeader = this.shouldShowHeader(event.urlAfterRedirects);
    });
  }

  shouldShowHeader(url: string): boolean {
    // Ajoutez ici les chemins pour lesquels l'en-tête ne doit pas être affiché
    const noHeaderRoutes = ['/welcome', '/login'];
    return !noHeaderRoutes.some(route => url.includes(route));
  }
}
