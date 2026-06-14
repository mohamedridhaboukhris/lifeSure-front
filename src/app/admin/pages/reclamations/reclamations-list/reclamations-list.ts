import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReclamationService, Reclamation } from '../../../../services/reclamation';
import { Auth } from '../../../../services/auth'; // ← ajouté

@Component({
  selector: 'app-reclamations-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reclamations-list.html',
  styleUrls: ['./reclamations-list.css']
})
export class ReclamationsListComponent implements OnInit {

  reclamations: Reclamation[] = [];
  loading = false;
  errorMessage = '';
  isClient = false; // ← ajouté

  constructor(
    private reclamationService: ReclamationService,
    private cdr: ChangeDetectorRef,
    private auth: Auth // ← ajouté
  ) {}

  ngOnInit(): void {
    this.isClient = this.auth.isClient(); // ← ajouté
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.reclamationService.getMesReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
        this.cdr.detectChanges();
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











getStatutIcon(s?: string): string {
  switch (s) {
    case 'SOUMISE':  return '📋';
    case 'EN_COURS': return '⏳';
    case 'ACCEPTEE': return '✅';
    case 'REFUSEE':  return '❌';
    default: return '';
  }
}

getStatutBadgeClass(s?: string): string {
  switch (s) {
    case 'SOUMISE':  return 'badge-warning';
    case 'EN_COURS': return 'badge-info';
    case 'ACCEPTEE': return 'badge-success';
    case 'REFUSEE':  return 'badge-danger';
    default: return 'badge-light';
  }
}






















}