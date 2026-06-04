/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'lifesure';
  isAdminRoute = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Vérifie l'URL actuelle immédiatement
    this.isAdminRoute = this.router.url.startsWith('/admin');

    // Puis écoute les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.isAdminRoute = url.startsWith('/admin');
        console.log('Route actuelle :', url, '| isAdminRoute :', this.isAdminRoute);
      });
  }
}*/





import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { ChatbotComponent } from './components/chatbot/chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    ChatbotComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'lifesure';
  isAdminRoute = false;
  isAuthRoute = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Vérifie l'URL actuelle immédiatement
    this.checkRoute(this.router.url);

    // Puis écoute les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.checkRoute(url);
        console.log('Route actuelle :', url, '| isAdminRoute :', this.isAdminRoute);
      });
  }

  private checkRoute(url: string): void {
    this.isAdminRoute = url.startsWith('/admin');
    this.isAuthRoute = url.startsWith('/login') || url.startsWith('/register');
  }
}