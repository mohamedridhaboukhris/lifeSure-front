/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SinistreService, Sinistre } from '../../../../services/sinistre';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-sinistres-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sinistres-list.html',
  styleUrls: ['./sinistres-list.css']
})
export class SinistresListComponent implements OnInit {

  sinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private sinistreService: SinistreService,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    // L'endpoint backend attend un clientId — on décode du token
    const email = this.auth.getEmail();
    // Option propre : demander au backend un endpoint /mes-sinistres pour le client aussi
    // Pour l'instant on suppose que tu ajouteras un endpoint ou on fait via getByClient
    this.sinistreService.getMesSinistresClient().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement de vos sinistres';
        this.loading = false;
      }
    });
  }

  private getClientIdFromToken(): number {
    // Si tu as mis l'ID dans le token JWT tu le récupères ici
    // Sinon il te faut un endpoint /mes-sinistres côté backend
    return 0;
  }

  getStatutBadge(s?: string): string {
    switch (s) {
      case 'DECLARE':  return 'badge-warning';
      case 'EN_COURS': return 'badge-info';
      case 'ACCEPTE':  return 'badge-success';
      case 'REFUSE':   return 'badge-danger';
      case 'CLOTURE':  return 'badge-secondary';
      default:         return 'badge-light';
    }
  }
}*/




































import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SinistreService, Sinistre } from '../../../../services/sinistre';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-sinistres-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sinistres-list.html',
  styleUrls: ['./sinistres-list.css']
})
export class SinistresListComponent implements OnInit {

  sinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private sinistreService: SinistreService,
    private auth: Auth,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.sinistreService.getMesSinistresClient().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        this.errorMessage = 'Erreur chargement de vos sinistres';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  private getClientIdFromToken(): number {
    return 0;
  }

  getStatutBadge(s?: string): string {
    switch (s) {
      case 'DECLARE':  return 'badge-warning';
      case 'EN_COURS': return 'badge-info';
      case 'ACCEPTE':  return 'badge-success';
      case 'REFUSE':   return 'badge-danger';
      case 'CLOTURE':  return 'badge-secondary';
      default:         return 'badge-light';
    }
  }
}