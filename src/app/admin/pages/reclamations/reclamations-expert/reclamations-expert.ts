/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReclamationService, Reclamation, StatutReclamation } from '../../../../services/reclamation';

@Component({
  selector: 'app-reclamations-expert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamations-expert.html',
  styleUrls: ['./reclamations-expert.css']
})
export class ReclamationsExpertComponent implements OnInit {

  reclamations: Reclamation[] = [];
  loading = false;
  errorMessage = '';

  // Pour chaque réclamation : justification en cours de rédaction
  justifications: { [id: number]: string } = {};

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.reclamationService.getSoumises().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement';
        this.loading = false;
      }
    });
  }

  traiter(id: number, statut: StatutReclamation): void {
    const justification = this.justifications[id];

    if (!justification || justification.trim().length < 10) {
      alert('La justification doit contenir au moins 10 caractères');
      return;
    }

    const action = statut === 'ACCEPTEE' ? 'accepter' : 'refuser';
    if (!confirm(`Confirmer de ${action} cette réclamation ?`)) {
      return;
    }

    this.reclamationService.traiter(id, statut, justification).subscribe({
      next: () => {
        alert(`Réclamation ${action === 'accepter' ? 'acceptée' : 'refusée'} ! Email envoyé au client.`);
        this.load();
      },
      error: (err) => {
        alert('Erreur : ' + (err.error?.message || err.message));
      }
    });
  }

  getStatutBadge(s?: string): string {
    switch (s) {
      case 'SOUMISE':  return 'badge-warning';
      case 'EN_COURS': return 'badge-info';
      case 'ACCEPTEE': return 'badge-success';
      case 'REFUSEE':  return 'badge-danger';
      default:         return 'badge-light';
    }
  }
}*/
























import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReclamationService, Reclamation, StatutReclamation } from '../../../../services/reclamation';

@Component({
  selector: 'app-reclamations-expert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reclamations-expert.html',
  styleUrls: ['./reclamations-expert.css']
})
export class ReclamationsExpertComponent implements OnInit {

  reclamations: Reclamation[] = [];
  loading = false;
  errorMessage = '';

  justifications: { [id: number]: string } = {};

  constructor(
    private reclamationService: ReclamationService,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.reclamationService.getSoumises().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        this.errorMessage = 'Erreur chargement';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  traiter(id: number, statut: StatutReclamation): void {
    const justification = this.justifications[id];

    if (!justification || justification.trim().length < 10) {
      alert('La justification doit contenir au moins 10 caractères');
      return;
    }

    const action = statut === 'ACCEPTEE' ? 'accepter' : 'refuser';
    if (!confirm(`Confirmer de ${action} cette réclamation ?`)) {
      return;
    }

    this.reclamationService.traiter(id, statut, justification).subscribe({
      next: () => {
        alert(`Réclamation ${action === 'accepter' ? 'acceptée' : 'refusée'} ! Email envoyé au client.`);
        this.load();
      },
      error: (err) => {
        alert('Erreur : ' + (err.error?.message || err.message));
      }
    });
  }

  getStatutBadge(s?: string): string {
    switch (s) {
      case 'SOUMISE':  return 'badge-warning';
      case 'EN_COURS': return 'badge-info';
      case 'ACCEPTEE': return 'badge-success';
      case 'REFUSEE':  return 'badge-danger';
      default:         return 'badge-light';
    }
  }
}