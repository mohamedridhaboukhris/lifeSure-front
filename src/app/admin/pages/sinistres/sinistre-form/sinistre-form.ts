






/*import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SinistreService, SinistreDTO, TypeSinistre } from '../../../../services/sinistre';
import { ContratService, Contrat } from '../../../../services/contrat';

@Component({
  selector: 'app-sinistre-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sinistre-form.html',
  styleUrls: ['./sinistre-form.css']
})
export class SinistreFormComponent implements OnInit {

  dto: SinistreDTO = {
    numeroContrat: '',
    dateSinistre: '',
    description: '',
    typeSinistre: 'ACCIDENT',
    montantEstime: 0
  };

  mesContrats: Contrat[] = [];
  fichiers: File[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  typesDispo: TypeSinistre[] = [];

  constructor(
    private sinistreService: SinistreService,
    private contratService: ContratService,
    private router: Router,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.loadContrats();
  }

  loadContrats(): void {
    this.contratService.getMesContrats().subscribe({
      next: (data) => {
        this.mesContrats = data.filter(c => c.statut === 'ACTIF');
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  onContratChange(): void {
    const contrat = this.mesContrats.find(c => c.numeroContrat === this.dto.numeroContrat);
    if (!contrat) { return; }

    switch (contrat.typeContrat) {
      case 'AUTO':
        this.typesDispo = ['ACCIDENT', 'VOL', 'INCENDIE_AUTO', 'BRIS_DE_GLACE', 'DOMMAGES_TOUS_ACCIDENTS'];
        break;
      case 'HABITATION':
        this.typesDispo = ['INCENDIE_HABITATION', 'DEGAT_EAUX', 'VOL_HABITATION', 'CATASTROPHE_NATURELLE', 'RESPONSABILITE_CIVILE'];
        break;
      case 'SANTE':
        this.typesDispo = ['HOSPITALISATION', 'CONSULTATION', 'SOINS_DENTAIRES', 'MALADIE_GRAVE', 'PHARMACIE'];
        break;
      case 'VOYAGE':
        this.typesDispo = ['ANNULATION', 'PERTE_BAGAGES', 'ACCIDENT_VOYAGE', 'SOINS_MEDICAUX', 'RETARD_VOL'];
        break;
    }
    this.dto.typeSinistre = this.typesDispo[0];
    this.cdr.detectChanges();  // ✅ AJOUTÉ
  }

  onFichiersChange(event: any): void {
    this.fichiers = Array.from(event.target.files);
    this.cdr.detectChanges();  // ✅ AJOUTÉ
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.sinistreService.declarer(this.dto, this.fichiers).subscribe({
      next: () => {
        this.successMessage = 'Sinistre déclaré avec succès !';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
        setTimeout(() => this.router.navigate(['/admin/sinistres']), 1200);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la déclaration';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }
}*/



/*import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SinistreService, SinistreDTO, TypeSinistre } from '../../../../services/sinistre';
import { ContratService, Contrat } from '../../../../services/contrat';

@Component({
  selector: 'app-sinistre-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sinistre-form.html',
  styleUrls: ['./sinistre-form.css']
})
export class SinistreFormComponent implements OnInit {

  dto: SinistreDTO = {
    numeroContrat: '',
    dateSinistre: '',
    description: '',
    typeSinistre: 'ACCIDENT',
    montantEstime: 0,
    latitude: undefined,
    longitude: undefined,
    lieuSinistre: ''
  };

  mesContrats: Contrat[] = [];
  fichiers: File[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  // 📍 Géolocalisation
  loadingGeo = false;
  geoMessage = '';

  typesDispo: TypeSinistre[] = [];

  constructor(
    private sinistreService: SinistreService,
    private contratService: ContratService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContrats();
  }

  loadContrats(): void {
    this.contratService.getMesContrats().subscribe({
      next: (data) => {
        this.mesContrats = data.filter(c => c.statut === 'ACTIF');
        this.cdr.detectChanges();
      }
    });
  }

  onContratChange(): void {
    const contrat = this.mesContrats.find(c => c.numeroContrat === this.dto.numeroContrat);
    if (!contrat) { return; }

    switch (contrat.typeContrat) {
      case 'AUTO':
        this.typesDispo = ['ACCIDENT', 'VOL', 'INCENDIE_AUTO', 'BRIS_DE_GLACE', 'DOMMAGES_TOUS_ACCIDENTS'];
        break;
      case 'HABITATION':
        this.typesDispo = ['INCENDIE_HABITATION', 'DEGAT_EAUX', 'VOL_HABITATION', 'CATASTROPHE_NATURELLE', 'RESPONSABILITE_CIVILE'];
        break;
      case 'SANTE':
        this.typesDispo = ['HOSPITALISATION', 'CONSULTATION', 'SOINS_DENTAIRES', 'MALADIE_GRAVE', 'PHARMACIE'];
        break;
      case 'VOYAGE':
        this.typesDispo = ['ANNULATION', 'PERTE_BAGAGES', 'ACCIDENT_VOYAGE', 'SOINS_MEDICAUX', 'RETARD_VOL'];
        break;
    }
    this.dto.typeSinistre = this.typesDispo[0];
    this.cdr.detectChanges();
  }

  onFichiersChange(event: any): void {
    this.fichiers = Array.from(event.target.files);
    this.cdr.detectChanges();
  }

  // 📍 Détecter ma position automatiquement (GPS)
  detecterPosition(): void {
    if (!navigator.geolocation) {
      this.geoMessage = '❌ La géolocalisation n\'est pas supportée par votre navigateur';
      this.cdr.detectChanges();
      return;
    }

    this.loadingGeo = true;
    this.geoMessage = '📡 Recherche de votre position...';
    this.cdr.detectChanges();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.dto.latitude = position.coords.latitude;
        this.dto.longitude = position.coords.longitude;
        this.loadingGeo = false;
        this.geoMessage = `✅ Position détectée : ${this.dto.latitude.toFixed(4)}, ${this.dto.longitude.toFixed(4)}`;
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingGeo = false;
        this.geoMessage = '❌ Impossible de détecter votre position. Veuillez saisir le lieu manuellement.';
        this.cdr.detectChanges();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // 📍 Sélectionner une ville prédéfinie
  selectionnerVille(ville: string, lat: number, lng: number): void {
    this.dto.lieuSinistre = ville;
    this.dto.latitude = lat;
    this.dto.longitude = lng;
    this.geoMessage = `✅ Lieu sélectionné : ${ville}`;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    this.cdr.detectChanges();

    this.sinistreService.declarer(this.dto, this.fichiers).subscribe({
      next: () => {
        this.successMessage = 'Sinistre déclaré avec succès !';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/admin/sinistres']), 1200);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la déclaration';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}*/










































import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SinistreService, SinistreDTO, TypeSinistre } from '../../../../services/sinistre';
import { ContratService, Contrat } from '../../../../services/contrat';

@Component({
  selector: 'app-sinistre-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sinistre-form.html',
  styleUrls: ['./sinistre-form.css']
})
export class SinistreFormComponent implements OnInit {

  dto: SinistreDTO = {
    numeroContrat: '',
    dateSinistre: '',
    description: '',
    typeSinistre: 'ACCIDENT',
    montantEstime: 0,
    latitude: undefined,
    longitude: undefined,
    lieuSinistre: ''
  };

  mesContrats: Contrat[] = [];
  fichiers: File[] = [];

  loading = false;
  errorMessage = '';
  successMessage = '';

  // 📍 Géolocalisation
  loadingGeo = false;
  geoMessage = '';

  // 🆕 Contrat sélectionné (pour les dates)
  contratSelectionne: Contrat | null = null;

  typesDispo: TypeSinistre[] = [];

  constructor(
    private sinistreService: SinistreService,
    private contratService: ContratService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadContrats();
  }

  loadContrats(): void {
    this.contratService.getMesContrats().subscribe({
      next: (data) => {
        this.mesContrats = data.filter(c => c.statut === 'ACTIF');
        this.cdr.detectChanges();
      }
    });
  }

  onContratChange(): void {
    const contrat = this.mesContrats.find(c => c.numeroContrat === this.dto.numeroContrat);
    if (!contrat) {
      this.contratSelectionne = null;
      return;
    }

    // 🆕 Mémoriser le contrat pour valider les dates
    this.contratSelectionne = contrat;

    // 🆕 Réinitialiser la date du sinistre si elle est hors période
    if (this.dto.dateSinistre && !this.isDateSinistreValide()) {
      this.dto.dateSinistre = '';
    }

    switch (contrat.typeContrat) {
      case 'AUTO':
        this.typesDispo = ['ACCIDENT', 'VOL', 'INCENDIE_AUTO', 'BRIS_DE_GLACE', 'DOMMAGES_TOUS_ACCIDENTS'];
        break;
      case 'HABITATION':
        this.typesDispo = ['INCENDIE_HABITATION', 'DEGAT_EAUX', 'VOL_HABITATION', 'CATASTROPHE_NATURELLE', 'RESPONSABILITE_CIVILE'];
        break;
      case 'SANTE':
        this.typesDispo = ['HOSPITALISATION', 'CONSULTATION', 'SOINS_DENTAIRES', 'MALADIE_GRAVE', 'PHARMACIE'];
        break;
      case 'VOYAGE':
        this.typesDispo = ['ANNULATION', 'PERTE_BAGAGES', 'ACCIDENT_VOYAGE', 'SOINS_MEDICAUX', 'RETARD_VOL'];
        break;
    }
    this.dto.typeSinistre = this.typesDispo[0];
    this.cdr.detectChanges();
  }

  // 🆕 Vérifier si la date du sinistre est dans la période du contrat
  isDateSinistreValide(): boolean {
    if (!this.contratSelectionne || !this.dto.dateSinistre) {
      return true; // Pas encore rempli
    }
    const dateSinistre = new Date(this.dto.dateSinistre);
    const dateDebut = new Date(this.contratSelectionne.dateDebut);
    const dateFin = new Date(this.contratSelectionne.dateFin);

    return dateSinistre >= dateDebut && dateSinistre <= dateFin;
  }

  // 🆕 Récupérer la date min (début contrat)
  get dateMinSinistre(): string {
    return this.contratSelectionne?.dateDebut || '';
  }

  // 🆕 Récupérer la date max (fin contrat)
  get dateMaxSinistre(): string {
    return this.contratSelectionne?.dateFin || '';
  }

  onFichiersChange(event: any): void {
    this.fichiers = Array.from(event.target.files);
    this.cdr.detectChanges();
  }

  // 📍 Détecter ma position automatiquement (GPS)
  detecterPosition(): void {
    if (!navigator.geolocation) {
      this.geoMessage = '❌ La géolocalisation n\'est pas supportée par votre navigateur';
      this.cdr.detectChanges();
      return;
    }

    this.loadingGeo = true;
    this.geoMessage = '📡 Recherche de votre position...';
    this.cdr.detectChanges();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.dto.latitude = position.coords.latitude;
        this.dto.longitude = position.coords.longitude;
        this.loadingGeo = false;
        this.geoMessage = `✅ Position détectée : ${this.dto.latitude.toFixed(4)}, ${this.dto.longitude.toFixed(4)}`;
        this.cdr.detectChanges();
      },
      (error) => {
        this.loadingGeo = false;
        this.geoMessage = '❌ Impossible de détecter votre position. Veuillez saisir le lieu manuellement.';
        this.cdr.detectChanges();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // 📍 Sélectionner une ville prédéfinie
  selectionnerVille(ville: string, lat: number, lng: number): void {
    this.dto.lieuSinistre = ville;
    this.dto.latitude = lat;
    this.dto.longitude = lng;
    this.geoMessage = `✅ Lieu sélectionné : ${ville}`;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // 🆕 VALIDATION : date sinistre dans la période du contrat
    if (!this.contratSelectionne) {
      this.errorMessage = "Veuillez d'abord sélectionner un contrat";
      return;
    }

    if (!this.dto.dateSinistre) {
      this.errorMessage = "La date du sinistre est obligatoire";
      return;
    }

    if (!this.isDateSinistreValide()) {
      const debut = new Date(this.contratSelectionne.dateDebut).toLocaleDateString('fr-FR');
      const fin = new Date(this.contratSelectionne.dateFin).toLocaleDateString('fr-FR');
      this.errorMessage = `⚠️ La date du sinistre doit être comprise entre le ${debut} et le ${fin} (période de validité du contrat)`;
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.sinistreService.declarer(this.dto, this.fichiers).subscribe({
      next: () => {
        this.successMessage = 'Sinistre déclaré avec succès !';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/admin/sinistres']), 1200);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la déclaration';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}













