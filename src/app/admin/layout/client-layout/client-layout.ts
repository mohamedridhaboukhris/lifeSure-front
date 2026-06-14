import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ClientTopbarComponent } from '../client-topbar/client-topbar';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ClientTopbarComponent, ],
  templateUrl: './client-layout.html',
  styleUrls: ['./client-layout.css']
})
export class ClientLayoutComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  private loadedAssets: HTMLElement[] = [];

  ngOnInit(): void {
    document.body.classList.add('client-body-theme');
    this.loadCss('assets/admin/vendor/fontawesome-free/css/all.min.css');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('client-body-theme');
    this.loadedAssets.forEach(el => el.remove());
    this.loadedAssets = [];
  }

  private loadCss(href: string): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-client-asset', 'true');
    document.head.appendChild(link);
    this.loadedAssets.push(link);
  }
}
