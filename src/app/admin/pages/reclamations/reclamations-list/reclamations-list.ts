import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReclamationService, Reclamation } from '../../../../services/reclamation';

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

    this.reclamationService.getMesReclamations().subscribe({
      next: (data) => {
        this.reclamations = data;
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
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