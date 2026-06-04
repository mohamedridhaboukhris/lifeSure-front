/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TauxAssuranceService, TauxAssurance } from '../../../services/taux-assurance';
import { TypeContrat } from '../../../services/contrat';

@Component({
  selector: 'app-taux',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taux.html',
  styleUrls: ['./taux.css']
})
export class TauxComponent implements OnInit {

  tauxList: TauxAssurance[] = [];
  typesContrat: TypeContrat[] = ['AUTO', 'HABITATION', 'SANTE', 'VOYAGE'];

  newTaux = {
    typeContrat: 'AUTO' as TypeContrat,
    taux: 0
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private tauxService: TauxAssuranceService) {}

  ngOnInit(): void {
    this.loadTaux();
  }

  loadTaux(): void {
    this.loading = true;
    this.tauxService.getAll().subscribe({
      next: (data) => {

        this.tauxList = [...data];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur de chargement';
        this.loading = false;
      }
    });
  }

  onSetTaux(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newTaux.taux <= 0) {
      this.errorMessage = 'Le taux doit être supérieur à 0';
      return;
    }

    this.tauxService.setTaux(this.newTaux.typeContrat, this.newTaux.taux).subscribe({
      next: () => {
        this.successMessage = `Taux défini pour ${this.newTaux.typeContrat}`;
        this.newTaux.taux = 0;
        this.loadTaux();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
      }
    });
  }

  getActifTauxForType(type: TypeContrat): TauxAssurance | undefined {
    return this.tauxList.find(t => t.typeContrat === type && t.actif);
  }
}*/


























import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TauxAssuranceService, TauxAssurance } from '../../../services/taux-assurance';
import { TypeContrat } from '../../../services/contrat';

@Component({
  selector: 'app-taux',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taux.html',
  styleUrls: ['./taux.css']
})
export class TauxComponent implements OnInit {

  tauxList: TauxAssurance[] = [];
  typesContrat: TypeContrat[] = ['AUTO', 'HABITATION', 'SANTE', 'VOYAGE'];

  newTaux = {
    typeContrat: 'AUTO' as TypeContrat,
    taux: 0
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private tauxService: TauxAssuranceService,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.loadTaux();
  }

  loadTaux(): void {
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.tauxService.getAll().subscribe({
      next: (data) => {
        this.tauxList = [...data];
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        this.errorMessage = 'Erreur de chargement';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  onSetTaux(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.newTaux.taux <= 0) {
      this.errorMessage = 'Le taux doit être supérieur à 0';
      this.cdr.detectChanges();  // ✅ AJOUTÉ
      return;
    }

    this.tauxService.setTaux(this.newTaux.typeContrat, this.newTaux.taux).subscribe({
      next: () => {
        this.successMessage = `Taux défini pour ${this.newTaux.typeContrat}`;
        this.newTaux.taux = 0;
        this.loadTaux();
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la mise à jour';
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  getActifTauxForType(type: TypeContrat): TauxAssurance | undefined {
    return this.tauxList.find(t => t.typeContrat === type && t.actif);
  }
}