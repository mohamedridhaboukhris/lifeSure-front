import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../../services/auth';
import { ThemeService } from '../../../services/theme';
import { LanguageService } from '../../../services/language';
import { NotificationService, Notification } from '../../../services/notification';

@Component({
  selector: 'app-client-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './client-topbar.html',
  styleUrls: ['./client-topbar.css']
})
export class ClientTopbarComponent implements OnInit, OnDestroy {

  userName = '';
  userInitials = '';
  userEmail = '';
  userRole = '';

  showAlerts = false;
  showUser = false;
  showLangMenu = false;
  showProfileModal = false;

  notifications: Notification[] = [];
  notifCount = 0;
  loadingNotifs = false;
  private refreshInterval: any;

  constructor(
    public auth: Auth,
    private router: Router,
    public themeService: ThemeService,
    public languageService: LanguageService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userName     = this.auth.getFullName();
    this.userInitials = this.auth.getInitials();
    this.userEmail    = this.auth.getEmail() || '';
    this.userRole     = this.auth.getRole()  || '';

    if (this.auth.getToken()) {
      this.loadCount();
      this.refreshInterval = setInterval(() => {
        if (this.auth.getToken()) {
          this.loadCount();
          if (this.showAlerts) this.loadNotifications();
        }
      }, 15000);
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadCount(): void {
    this.notificationService.getCount().subscribe({
      next: (res: { count: number }) => { this.notifCount = res.count; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadNotifications(): void {
    this.loadingNotifs = true;
    this.notificationService.getMesNotifications().subscribe({
      next: (data: Notification[]) => {
        this.notifications = data.slice(0, 8);
        this.loadingNotifs = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingNotifs = false; this.cdr.detectChanges(); }
    });
  }

  onNotifClick(notif: Notification, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!notif.lue) {
      this.notificationService.marquerCommeLue(notif.id).subscribe({
        next: () => { notif.lue = true; this.loadCount(); this.cdr.detectChanges(); }
      });
    }
    if (notif.lien) { this.showAlerts = false; this.router.navigateByUrl(notif.lien); }
  }

  marquerToutesCommeLues(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.marquerToutesCommeLues().subscribe({
      next: () => { this.notifications.forEach(n => n.lue = true); this.notifCount = 0; this.cdr.detectChanges(); }
    });
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return '';
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return "à l'instant";
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
    return `il y a ${Math.floor(diff / 86400)}j`;
  }

  openProfile(event: Event): void { event.preventDefault(); event.stopPropagation(); this.showUser = false; this.showProfileModal = true; }
  closeProfile(): void { this.showProfileModal = false; }

  toggleAlerts(event: Event): void {
    event.preventDefault(); event.stopPropagation();
    this.showAlerts = !this.showAlerts; this.showUser = false; this.showLangMenu = false;
    if (this.showAlerts) this.loadNotifications();
  }
  toggleUser(event: Event): void {
    event.preventDefault(); event.stopPropagation();
    this.showUser = !this.showUser; this.showAlerts = false; this.showLangMenu = false;
  }
  toggleLangMenu(event: Event): void {
    event.preventDefault(); event.stopPropagation();
    this.showLangMenu = !this.showLangMenu; this.showAlerts = false; this.showUser = false;
  }
  changeLanguage(code: string): void { this.languageService.useLanguage(code); this.showLangMenu = false; }
  toggleTheme(): void { this.themeService.toggleTheme(); }

  @HostListener('document:click')
  closeAll(): void { this.showAlerts = false; this.showUser = false; this.showLangMenu = false; }

  logout(event: Event): void { event.preventDefault(); this.auth.logout(); this.router.navigate(['/login']); }
}
