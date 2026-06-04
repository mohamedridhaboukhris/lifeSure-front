/*import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../../services/auth';
import { ThemeService } from '../../../services/theme';
import { LanguageService, Language } from '../../../services/language';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {

  userName = 'Douglas McGee';

  showAlerts = false;
  showMessages = false;
  showUser = false;
  showLangMenu = false;

  alerts = [
    { date: '12 Déc. 2025', message: 'Un nouveau contrat a été créé !' },
    { date: '10 Déc. 2025', message: 'Paiement reçu de 2 500 DT' },
    { date: '08 Déc. 2025', message: 'Nouvelle demande en attente' }
  ];

  messages = [
    {
      avatar: 'https://source.unsplash.com/fn_BT9fwg_E/60x60',
      text: 'Bonjour, je souhaite souscrire à une assurance vie...',
      sender: 'Emily Fowler',
      time: '58m'
    },
    {
      avatar: 'https://source.unsplash.com/AU4VPcFN4LE/60x60',
      text: 'Le dossier client est prêt à être validé.',
      sender: 'Jae Chun',
      time: '1h'
    },
    {
      avatar: 'https://source.unsplash.com/CS2uCrpNzJY/60x60',
      text: 'Pouvez-vous me rappeler demain matin ?',
      sender: 'Morgan Alvarez',
      time: '2h'
    },
    {
      avatar: 'https://source.unsplash.com/Mv9hjnEUHR4/60x60',
      text: 'Merci pour votre retour rapide !',
      sender: 'Chicken the Dog',
      time: '2 jours'
    },
    {
      avatar: 'https://source.unsplash.com/QAB-WJcbgJk/60x60',
      text: 'Document signé, à votre disposition.',
      sender: 'Admin',
      time: '3 jours'
    },
    {
      avatar: 'https://source.unsplash.com/fn_BT9fwg_E/60x60',
      text: 'Rappel de rendez-vous vendredi 14h.',
      sender: 'Agenda',
      time: '5 jours'
    },
    {
      avatar: 'https://source.unsplash.com/AU4VPcFN4LE/60x60',
      text: 'Nouvelle réclamation à traiter.',
      sender: 'Support',
      time: '1 sem'
    }
  ];

  constructor(
    private auth: Auth,
    private router: Router,
    public themeService: ThemeService,
    public languageService: LanguageService
  ) {}

  // ===== Dropdowns =====
  toggleAlerts(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showAlerts = !this.showAlerts;
    this.showMessages = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  toggleMessages(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showMessages = !this.showMessages;
    this.showAlerts = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  toggleUser(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showUser = !this.showUser;
    this.showAlerts = false;
    this.showMessages = false;
    this.showLangMenu = false;
  }

  // ===== 🌍 Sélecteur de langue =====
  toggleLangMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showLangMenu = !this.showLangMenu;
    this.showAlerts = false;
    this.showMessages = false;
    this.showUser = false;
  }

  changeLanguage(code: string): void {
    this.languageService.useLanguage(code);
    this.showLangMenu = false;
  }

  // ===== 🌙 Mode sombre =====
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // ===== Fermer tout au clic extérieur =====
  @HostListener('document:click')
  closeAll(): void {
    this.showAlerts = false;
    this.showMessages = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}*/














/*import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../../services/auth';
import { ThemeService } from '../../../services/theme';
import { LanguageService, Language } from '../../../services/language';
import { NotificationService, Notification } from '../../../services/notification';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent implements OnInit, OnDestroy {

  //userName = 'Douglas McGee';


  userName = '';
userInitials = '';

  showAlerts = false;
  showMessages = false;
  showUser = false;
  showLangMenu = false;

  // 🔔 NOTIFICATIONS
  notifications: Notification[] = [];
  notifCount = 0;
  loadingNotifs = false;
  private refreshInterval: any;

  messages = [
    {
      avatar: 'https://source.unsplash.com/fn_BT9fwg_E/60x60',
      text: 'Bonjour, je souhaite souscrire à une assurance vie...',
      sender: 'Emily Fowler',
      time: '58m'
    },
    {
      avatar: 'https://source.unsplash.com/AU4VPcFN4LE/60x60',
      text: 'Le dossier client est prêt à être validé.',
      sender: 'Jae Chun',
      time: '1h'
    },
    {
      avatar: 'https://source.unsplash.com/CS2uCrpNzJY/60x60',
      text: 'Pouvez-vous me rappeler demain matin ?',
      sender: 'Morgan Alvarez',
      time: '2h'
    }
  ];

  constructor(
    private auth: Auth,
    private router: Router,
    public themeService: ThemeService,
    public languageService: LanguageService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  // ✅ Récupérer le vrai nom du user connecté

 this.userName = this.auth.getFullName();
  this.userInitials = this.auth.getInitials();





    // ✅ Utilise getToken() de ton service Auth
    if (this.auth.getToken()) {
      this.loadCount();

      this.refreshInterval = setInterval(() => {
        if (this.auth.getToken()) {
          this.loadCount();
          if (this.showAlerts) {
            this.loadNotifications();
          }
        }
      }, 15000);
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // ===== 🔔 NOTIFICATIONS =====
  loadCount(): void {
    this.notificationService.getCount().subscribe({
      next: (res: { count: number }) => {
        this.notifCount = res.count;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadNotifications(): void {
    this.loadingNotifs = true;
    this.cdr.detectChanges();

    this.notificationService.getMesNotifications().subscribe({
      next: (data: Notification[]) => {
        this.notifications = data.slice(0, 10);
        this.loadingNotifs = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingNotifs = false;
        this.cdr.detectChanges();
      }
    });
  }

  onNotificationClick(notif: Notification, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!notif.lue) {
      this.notificationService.marquerCommeLue(notif.id).subscribe({
        next: () => {
          notif.lue = true;
          this.loadCount();
          this.cdr.detectChanges();
        }
      });
    }

    if (notif.lien) {
      this.showAlerts = false;
      this.cdr.detectChanges();
      this.router.navigateByUrl(notif.lien);
    }
  }

  marquerToutesCommeLues(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.marquerToutesCommeLues().subscribe({
      next: () => {
        this.notifications.forEach(n => n.lue = true);
        this.notifCount = 0;
        this.cdr.detectChanges();
      }
    });
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "à l'instant";
    if (diffMin < 60) return `il y a ${diffMin} min`;
    if (diffHour < 24) return `il y a ${diffHour}h`;
    if (diffDay < 7) return `il y a ${diffDay}j`;

    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  // ===== Dropdowns =====
  toggleAlerts(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showAlerts = !this.showAlerts;
    this.showMessages = false;
    this.showUser = false;
    this.showLangMenu = false;

    if (this.showAlerts) {
      this.loadNotifications();
    }
  }

  toggleMessages(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showMessages = !this.showMessages;
    this.showAlerts = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  toggleUser(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showUser = !this.showUser;
    this.showAlerts = false;
    this.showMessages = false;
    this.showLangMenu = false;
  }

  // ===== 🌍 Sélecteur de langue =====
  toggleLangMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showLangMenu = !this.showLangMenu;
    this.showAlerts = false;
    this.showMessages = false;
    this.showUser = false;
  }

  changeLanguage(code: string): void {
    this.languageService.useLanguage(code);
    this.showLangMenu = false;
  }

  // ===== 🌙 Mode sombre =====
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // ===== Fermer tout au clic extérieur =====
  @HostListener('document:click')
  closeAll(): void {
    this.showAlerts = false;
    this.showMessages = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }


 
}*/



import { Component, HostListener, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Auth } from '../../../services/auth';
import { ThemeService } from '../../../services/theme';
import { LanguageService, Language } from '../../../services/language';
import { NotificationService, Notification } from '../../../services/notification';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent implements OnInit, OnDestroy {

  userName = '';
  userInitials = '';
  userEmail = '';
  userRole = '';

  showAlerts = false;
  showMessages = false;
  showUser = false;
  showLangMenu = false;
  showProfileModal = false;

  // 🔔 NOTIFICATIONS
  notifications: Notification[] = [];
  notifCount = 0;
  loadingNotifs = false;
  private refreshInterval: any;

  constructor(
    private auth: Auth,
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
          if (this.showAlerts) {
            this.loadNotifications();
          }
        }
      }, 15000);
    }
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  // ===== 🔔 NOTIFICATIONS =====
  loadCount(): void {
    this.notificationService.getCount().subscribe({
      next: (res: { count: number }) => {
        this.notifCount = res.count;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  loadNotifications(): void {
    this.loadingNotifs = true;
    this.cdr.detectChanges();

    this.notificationService.getMesNotifications().subscribe({
      next: (data: Notification[]) => {
        this.notifications = data.slice(0, 10);
        this.loadingNotifs = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingNotifs = false;
        this.cdr.detectChanges();
      }
    });
  }

  onNotificationClick(notif: Notification, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!notif.lue) {
      this.notificationService.marquerCommeLue(notif.id).subscribe({
        next: () => {
          notif.lue = true;
          this.loadCount();
          this.cdr.detectChanges();
        }
      });
    }

    if (notif.lien) {
      this.showAlerts = false;
      this.cdr.detectChanges();
      this.router.navigateByUrl(notif.lien);
    }
  }

  marquerToutesCommeLues(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.marquerToutesCommeLues().subscribe({
      next: () => {
        this.notifications.forEach(n => n.lue = true);
        this.notifCount = 0;
        this.cdr.detectChanges();
      }
    });
  }

  getTimeAgo(dateString: string): string {
    if (!dateString) return '';

    const date    = new Date(dateString);
    const now     = new Date();
    const diffMs  = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay  = Math.floor(diffHour / 24);

    if (diffSec  < 60) return "à l'instant";
    if (diffMin  < 60) return `il y a ${diffMin} min`;
    if (diffHour < 24) return `il y a ${diffHour}h`;
    if (diffDay  <  7) return `il y a ${diffDay}j`;

    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  // ===== 👤 PROFIL MODAL =====
  openProfile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showUser = false;
    this.showProfileModal = true;
  }

  closeProfile(): void {
    this.showProfileModal = false;
  }

  // ===== Dropdowns =====
  toggleAlerts(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showAlerts = !this.showAlerts;
    this.showMessages = false;
    this.showUser = false;
    this.showLangMenu = false;

    if (this.showAlerts) {
      this.loadNotifications();
    }
  }

  toggleMessages(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showMessages = !this.showMessages;
    this.showAlerts = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  toggleUser(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showUser = !this.showUser;
    this.showAlerts = false;
    this.showMessages = false;
    this.showLangMenu = false;
  }

  toggleLangMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.showLangMenu = !this.showLangMenu;
    this.showAlerts = false;
    this.showMessages = false;
    this.showUser = false;
  }

  changeLanguage(code: string): void {
    this.languageService.useLanguage(code);
    this.showLangMenu = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  @HostListener('document:click')
  closeAll(): void {
    this.showAlerts = false;
    this.showMessages = false;
    this.showUser = false;
    this.showLangMenu = false;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}