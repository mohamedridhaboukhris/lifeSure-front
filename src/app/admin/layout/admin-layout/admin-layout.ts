import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
import { AdminFooterComponent } from '../admin-footer/admin-footer';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, AdminFooterComponent],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  private loadedAssets: HTMLElement[] = [];

  ngOnInit(): void {
    document.body.classList.add('admin-body');

    // CSS
    this.loadCss('assets/admin/vendor/fontawesome-free/css/all.min.css');
    this.loadCss('assets/admin/css/sb-admin-2.min.css');

    // JS (séquentiel)
    this.loadScript('assets/admin/vendor/jquery/jquery.min.js')
      .then(() => this.loadScript('assets/admin/vendor/bootstrap/js/bootstrap.bundle.min.js'))
      .then(() => this.loadScript('assets/admin/vendor/jquery-easing/jquery.easing.min.js'))
      .then(() => this.loadScript('assets/admin/js/sb-admin-2.min.js'))
      .catch(err => console.error('Erreur chargement scripts admin :', err));
  }

  ngOnDestroy(): void {
    document.body.classList.remove('admin-body');
    this.loadedAssets.forEach(el => el.remove());
    this.loadedAssets = [];
  }

  private loadCss(href: string): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-admin-asset', 'true');
    document.head.appendChild(link);
    this.loadedAssets.push(link);
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.setAttribute('data-admin-asset', 'true');
      script.onload = () => resolve();
      script.onerror = () => reject(`Erreur chargement : ${src}`);
      document.body.appendChild(script);
      this.loadedAssets.push(script);
    });
  }
}