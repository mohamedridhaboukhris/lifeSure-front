/*import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReclamationService, Reclamation } from '../../../../services/reclamation';

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

  constructor(
    private reclamationService: ReclamationService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.reclamationService.soumettre(this.reclamation).subscribe({
      next: () => {
        this.successMessage = 'Réclamation soumise avec succès !';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/admin/reclamations']), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la soumission';
      }
    });
  }
}*/


import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReclamationService, Reclamation } from '../../../../services/reclamation';

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

  constructor(
    private reclamationService: ReclamationService,
    private router: Router,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.reclamationService.soumettre(this.reclamation).subscribe({
      next: () => {
        this.successMessage = 'Réclamation soumise avec succès !';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
        setTimeout(() => this.router.navigate(['/admin/reclamations']), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la soumission';
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }
}

