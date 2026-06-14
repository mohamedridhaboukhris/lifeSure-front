


import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReclamationService, Reclamation } from '../../../../services/reclamation';
import { Auth } from '../../../../services/auth'; // ← ajouté

@Component({
  selector: 'app-reclamation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reclamation-form.html',
  styleUrls: ['./reclamation-form.css']
})
export class ReclamationFormComponent {

  reclamation: Reclamation = {
    sujet: '',
    description: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';
  isClient = false; // ← ajouté

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: Auth // ← ajouté
  ) {
    this.isClient = this.auth.isClient(); // ← ajouté
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    this.cdr.detectChanges();

    this.reclamationService.soumettre(this.reclamation).subscribe({
      next: () => {
        this.successMessage = 'Réclamation soumise avec succès !';
        this.loading = false;
        this.cdr.detectChanges();
        const route = this.isClient ? '/client/reclamations' : '/admin/reclamations'; // ← ajouté
        setTimeout(() => this.router.navigate([route]), 1200); // ← modifié
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la soumission';
        this.cdr.detectChanges();
      }
    });
  }
}
