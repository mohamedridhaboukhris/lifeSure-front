/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContratService,  TypeContrat } from '../../../../services/contrat';

@Component({
  selector: 'app-contrat-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contrat-form.html',
  styleUrls: ['./contrat-form.css']
})
export class ContratFormComponent implements OnInit {

  contrat: any = {
    typeContrat: 'AUTO',
    dateDebut: '',
    dateFin: ''
    // ❌ Plus besoin de client: { id: 0 }
  };

  isEdit = false;
  editId: number | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  typesContrat: TypeContrat[] = ['AUTO', 'HABITATION', 'SANTE', 'VOYAGE'];

  constructor(
   private contratService: ContratService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.loadContrat(+id);
    }
  }

  loadContrat(id: number): void {
    this.loading = true;
    this.contratService.getById(id).subscribe({
      next: (data) => {
        this.contrat = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement du contrat';
        this.loading = false;
      }
    });
  }

  onTypeChange(): void {
    this.contrat.vehiculeMarque = undefined;
    this.contrat.vehiculeModele = undefined;
    this.contrat.vehiculeImmatriculation = undefined;
    this.contrat.adresseBien = undefined;
    this.contrat.superficieBien = undefined;
    this.contrat.typeBien = undefined;
    this.contrat.ageAssure = undefined;
    this.contrat.plafondAnnuel = undefined;
    this.contrat.destination = undefined;
    this.contrat.dureeVoyage = undefined;
    this.contrat.plafondAssurance = undefined;
    this.contrat.montantGarantie = undefined;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    // ✅ Plus besoin de gérer clientId, le backend s'en occupe

    if (this.isEdit && this.editId) {
      this.contratService.update(this.editId, this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat modifié avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.contratService.creer(this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat créé avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }
}*/


























































































/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContratService, TypeContrat } from '../../../../services/contrat';

@Component({
  selector: 'app-contrat-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contrat-form.html',
  styleUrls: ['./contrat-form.css']
})
export class ContratFormComponent implements OnInit {

  contrat: any = {
    typeContrat: 'AUTO',
    dateDebut: '',
    dateFin: ''
  };

  isEdit = false;
  editId: number | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  // 🆕 Date du jour (pour bloquer les dates passées)
  today = new Date().toISOString().split('T')[0];

  typesContrat: TypeContrat[] = ['AUTO', 'HABITATION', 'SANTE', 'VOYAGE'];

  constructor(
    private contratService: ContratService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.loadContrat(+id);
    }
  }

  loadContrat(id: number): void {
    this.loading = true;
    this.contratService.getById(id).subscribe({
      next: (data) => {
        this.contrat = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement du contrat';
        this.loading = false;
      }
    });
  }

  onTypeChange(): void {
    this.contrat.vehiculeMarque = undefined;
    this.contrat.vehiculeModele = undefined;
    this.contrat.vehiculeImmatriculation = undefined;
    this.contrat.adresseBien = undefined;
    this.contrat.superficieBien = undefined;
    this.contrat.typeBien = undefined;
    this.contrat.ageAssure = undefined;
    this.contrat.plafondAnnuel = undefined;
    this.contrat.destination = undefined;
    this.contrat.dureeVoyage = undefined;
    this.contrat.plafondAssurance = undefined;
    this.contrat.montantGarantie = undefined;
  }

  // 🆕 Validation des dates
  isDateValid(): boolean {
    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      return true; // Pas encore rempli, on ne montre pas d'erreur
    }
    return new Date(this.contrat.dateDebut) < new Date(this.contrat.dateFin);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // 🆕 VALIDATION DATES
    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      this.errorMessage = "Les dates de début et de fin sont obligatoires";
      return;
    }

    const debut = new Date(this.contrat.dateDebut);
    const fin = new Date(this.contrat.dateFin);

    if (debut >= fin) {
      this.errorMessage = "⚠️ La date de début doit être ANTÉRIEURE à la date de fin";
      return;
    }

    // 🆕 Bonus : vérifier que la date de début n'est pas dans le passé (pour nouveau contrat)
    if (!this.isEdit) {
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      if (debut < aujourdhui) {
        this.errorMessage = "⚠️ La date de début ne peut pas être dans le passé";
        return;
      }
    }

    this.loading = true;

    if (this.isEdit && this.editId) {
      this.contratService.update(this.editId, this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat modifié avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.contratService.creer(this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat créé avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }
}*/






























































































































































/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContratService, TypeContrat } from '../../../../services/contrat';

@Component({
  selector: 'app-contrat-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contrat-form.html',
  styleUrls: ['./contrat-form.css']
})
export class ContratFormComponent implements OnInit {

  contrat: any = {
    typeContrat: 'AUTO',
    dateDebut: '',
    dateFin: ''
  };

  isEdit = false;
  editId: number | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  today = new Date().toISOString().split('T')[0];

  typesContrat: TypeContrat[] = ['AUTO', 'HABITATION', 'SANTE', 'VOYAGE'];

  // 🆕 MARQUES ET MODÈLES (Tunisie)
  marquesVoitures: { [marque: string]: string[] } = {
    'Renault': ['Clio', 'Mégane', 'Symbol', 'Captur', 'Kangoo', 'Duster', 'Logan', 'Sandero', 'Talisman', 'Koleos'],
    'Peugeot': ['208', '301', '308', '2008', '3008', '5008', '508', 'Partner', 'Boxer', 'Rifter'],
    'Citroën': ['C3', 'C4', 'C-Elysée', 'C5 Aircross', 'Berlingo', 'Jumpy', 'Jumper'],
    'Dacia': ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring'],
    'Hyundai': ['i10', 'i20', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Creta', 'Kona', 'H1', 'Sonata'],
    'Kia': ['Picanto', 'Rio', 'Cerato', 'Sportage', 'Sorento', 'Carnival', 'Stonic', 'Soul'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'T-Cross', 'Caddy', 'Transporter'],
    'Toyota': ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Hilux', 'Hiace', 'Fortuner'],
    'Nissan': ['Micra', 'Sunny', 'Sentra', 'Qashqai', 'X-Trail', 'Patrol', 'Navara', 'Juke'],
    'Suzuki': ['Swift', 'Baleno', 'Vitara', 'Jimny', 'S-Cross', 'Celerio'],
    'Isuzu': ['D-Max', 'MU-X', 'NPR', 'NLR', 'NMR'],
    'Mitsubishi': ['Lancer', 'ASX', 'Outlander', 'Pajero', 'L200', 'Eclipse Cross'],
    'Ford': ['Fiesta', 'Focus', 'Kuga', 'EcoSport', 'Ranger', 'Transit', 'Mondeo'],
    'Fiat': ['Panda', '500', 'Tipo', 'Doblo', 'Ducato', 'Punto'],
    'Chevrolet': ['Aveo', 'Cruze', 'Captiva', 'Trax', 'Spark', 'Tahoe'],
    'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLC', 'GLE', 'Sprinter', 'Vito'],
    'BMW': ['Série 1', 'Série 3', 'Série 5', 'Série 7', 'X1', 'X3', 'X5', 'X6'],
    'Audi': ['A1', 'A3', 'A4', 'A6', 'Q2', 'Q3', 'Q5', 'Q7'],
    'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
    'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
    'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9'],
    'Honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland'],
    'Autre': ['Autre modèle']
  };




// 🆕 LISTE DESTINATIONS (100+ pays avec drapeaux)
destinations: string[] = [
  '🇿🇦 Afrique du Sud',
  '🇩🇪 Allemagne',
  '🇸🇦 Arabie Saoudite',
  '🇦🇷 Argentine',
  '🇦🇲 Arménie',
  '🇦🇺 Australie',
  '🇦🇹 Autriche',
  '🇦🇿 Azerbaïdjan',
  '🇧🇸 Bahamas',
  '🇧🇭 Bahreïn',
  '🇧🇩 Bangladesh',
  '🇧🇧 Barbade',
  '🇧🇪 Belgique',
  '🇧🇿 Belize',
  '🇧🇯 Bénin',
  '🇧🇹 Bhoutan',
  '🇧🇴 Bolivie',
  '🇧🇦 Bosnie-Herzégovine',
  '🇧🇼 Botswana',
  '🇧🇷 Brésil',
  '🇧🇬 Bulgarie',
  '🇧🇫 Burkina Faso',
  '🇨🇲 Cameroun',
  '🇨🇦 Canada',
  '🇨🇻 Cap-Vert',
  '🇨🇱 Chili',
  '🇨🇳 Chine',
  '🇨🇾 Chypre',
  '🇨🇴 Colombie',
  '🇰🇲 Comores',
  '🇰🇷 Corée du Sud',
  '🇨🇷 Costa Rica',
  '🇨🇮 Côte d\'Ivoire',
  '🇭🇷 Croatie',
  '🇨🇺 Cuba',
  '🇩🇰 Danemark',
  '🇩🇯 Djibouti',
  '🇪🇬 Égypte',
  '🇦🇪 Émirats Arabes Unis',
  '🇪🇨 Équateur',
  '🇪🇸 Espagne',
  '🇪🇪 Estonie',
  '🇺🇸 États-Unis',
  '🇪🇹 Éthiopie',
  '🇫🇮 Finlande',
  '🇫🇷 France',
  '🇬🇦 Gabon',
  '🇬🇲 Gambie',
  '🇬🇪 Géorgie',
  '🇬🇭 Ghana',
  '🇬🇷 Grèce',
  '🇬🇹 Guatemala',
  '🇬🇳 Guinée',
  '🇭🇹 Haïti',
  '🇭🇳 Honduras',
  '🇭🇰 Hong Kong',
  '🇭🇺 Hongrie',
  '🇮🇳 Inde',
  '🇮🇩 Indonésie',
  '🇮🇶 Irak',
  '🇮🇷 Iran',
  '🇮🇪 Irlande',
  '🇮🇸 Islande',
  '🇮🇱 Israël',
  '🇮🇹 Italie',
  '🇯🇲 Jamaïque',
  '🇯🇵 Japon',
  '🇯🇴 Jordanie',
  '🇰🇿 Kazakhstan',
  '🇰🇪 Kenya',
  '🇰🇼 Koweït',
  '🇱🇦 Laos',
  '🇱🇧 Liban',
  '🇱🇾 Libye',
  '🇱🇮 Liechtenstein',
  '🇱🇺 Luxembourg',
  '🇲🇰 Macédoine du Nord',
  '🇲🇬 Madagascar',
  '🇲🇾 Malaisie',
  '🇲🇼 Malawi',
  '🇲🇻 Maldives',
  '🇲🇱 Mali',
  '🇲🇹 Malte',
  '🇲🇦 Maroc',
  '🇲🇺 Maurice',
  '🇲🇷 Mauritanie',
  '🇲🇽 Mexique',
  '🇲🇩 Moldavie',
  '🇲🇨 Monaco',
  '🇲🇳 Mongolie',
  '🇲🇪 Monténégro',
  '🇲🇿 Mozambique',
  '🇲🇲 Myanmar (Birmanie)',
  '🇳🇦 Namibie',
  '🇳🇵 Népal',
  '🇳🇮 Nicaragua',
  '🇳🇪 Niger',
  '🇳🇬 Nigéria',
  '🇳🇴 Norvège',
  '🇳🇿 Nouvelle-Zélande',
  '🇴🇲 Oman',
  '🇺🇬 Ouganda',
  '🇺🇿 Ouzbékistan',
  '🇵🇰 Pakistan',
  '🇵🇸 Palestine',
  '🇵🇦 Panama',
  '🇵🇾 Paraguay',
  '🇳🇱 Pays-Bas',
  '🇵🇪 Pérou',
  '🇵🇭 Philippines',
  '🇵🇱 Pologne',
  '🇵🇹 Portugal',
  '🇶🇦 Qatar',
  '🇨🇫 République Centrafricaine',
  '🇨🇩 République Démocratique du Congo',
  '🇩🇴 République Dominicaine',
  '🇨🇿 République Tchèque',
  '🇷🇴 Roumanie',
  '🇬🇧 Royaume-Uni',
  '🇷🇺 Russie',
  '🇷🇼 Rwanda',
  '🇸🇲 Saint-Marin',
  '🇻🇨 Saint-Vincent-et-les-Grenadines',
  '🇸🇳 Sénégal',
  '🇷🇸 Serbie',
  '🇸🇨 Seychelles',
  '🇸🇱 Sierra Leone',
  '🇸🇬 Singapour',
  '🇸🇰 Slovaquie',
  '🇸🇮 Slovénie',
  '🇸🇴 Somalie',
  '🇸🇩 Soudan',
  '🇱🇰 Sri Lanka',
  '🇸🇪 Suède',
  '🇨🇭 Suisse',
  '🇸🇷 Suriname',
  '🇸🇾 Syrie',
  '🇹🇯 Tadjikistan',
  '🇹🇼 Taïwan',
  '🇹🇿 Tanzanie',
  '🇹🇩 Tchad',
  '🇹🇭 Thaïlande',
  '🇹🇬 Togo',
  '🇹🇹 Trinité-et-Tobago',
  '🇹🇳 Tunisie',
  '🇹🇲 Turkménistan',
  '🇹🇷 Turquie',
  '🇺🇦 Ukraine',
  '🇺🇾 Uruguay',
  '🇻🇺 Vanuatu',
  '🇻🇪 Venezuela',
  '🇻🇳 Vietnam',
  '🇾🇪 Yémen',
  '🇿🇲 Zambie',
  '🇿🇼 Zimbabwe'
];





















  // 🆕 Liste des marques (pour le select)
  get listeMarques(): string[] {
    return Object.keys(this.marquesVoitures).sort();
  }

  // 🆕 Modèles disponibles selon la marque sélectionnée
  get modelesDisponibles(): string[] {
    if (!this.contrat.vehiculeMarque) return [];
    return this.marquesVoitures[this.contrat.vehiculeMarque] || [];
  }

  constructor(
    private contratService: ContratService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.loadContrat(+id);
    }
  }

  loadContrat(id: number): void {
    this.loading = true;
    this.contratService.getById(id).subscribe({
      next: (data) => {
        this.contrat = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement du contrat';
        this.loading = false;
      }
    });
  }

  onTypeChange(): void {
    this.contrat.vehiculeMarque = undefined;
    this.contrat.vehiculeModele = undefined;
    this.contrat.vehiculeImmatriculation = undefined;
    this.contrat.adresseBien = undefined;
    this.contrat.superficieBien = undefined;
    this.contrat.typeBien = undefined;
    this.contrat.ageAssure = undefined;
    this.contrat.plafondAnnuel = undefined;
    this.contrat.destination = undefined;
    this.contrat.dureeVoyage = undefined;
    this.contrat.plafondAssurance = undefined;
    this.contrat.montantGarantie = undefined;
  }

  // 🆕 Reset du modèle quand on change de marque
  onMarqueChange(): void {
    this.contrat.vehiculeModele = '';
  }

  isDateValid(): boolean {
    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      return true;
    }
    return new Date(this.contrat.dateDebut) < new Date(this.contrat.dateFin);
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      this.errorMessage = "Les dates de début et de fin sont obligatoires";
      return;
    }

    const debut = new Date(this.contrat.dateDebut);
    const fin = new Date(this.contrat.dateFin);

    if (debut >= fin) {
      this.errorMessage = "⚠️ La date de début doit être ANTÉRIEURE à la date de fin";
      return;
    }

    if (!this.isEdit) {
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      if (debut < aujourdhui) {
        this.errorMessage = "⚠️ La date de début ne peut pas être dans le passé";
        return;
      }
    }

    this.loading = true;

    if (this.isEdit && this.editId) {
      this.contratService.update(this.editId, this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat modifié avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.contratService.creer(this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat créé avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }
}*/








































































































































import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContratService, TypeContrat } from '../../../../services/contrat';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-contrat-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contrat-form.html',
  styleUrls: ['./contrat-form.css']
})
export class ContratFormComponent implements OnInit {

  contrat: any = {
    typeContrat: 'AUTO',
    dateDebut: '',
    dateFin: ''
  };

  isEdit = false;
  editId: number | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  today = new Date().toISOString().split('T')[0];

  typesContrat: TypeContrat[] = ['AUTO', 'HABITATION', 'SANTE', 'VOYAGE'];

  // 🆕 Variables séparées pour gouvernorat + délégation
  gouvernoratSelectionne: string = '';
  delegationSelectionnee: string = '';
  rueDetail: string = '';

  // 🆕 MARQUES ET MODÈLES (Tunisie)
  marquesVoitures: { [marque: string]: string[] } = {
    'Renault': ['Clio', 'Mégane', 'Symbol', 'Captur', 'Kangoo', 'Duster', 'Logan', 'Sandero', 'Talisman', 'Koleos'],
    'Peugeot': ['208', '301', '308', '2008', '3008', '5008', '508', 'Partner', 'Boxer', 'Rifter'],
    'Citroën': ['C3', 'C4', 'C-Elysée', 'C5 Aircross', 'Berlingo', 'Jumpy', 'Jumper'],
    'Dacia': ['Logan', 'Sandero', 'Duster', 'Lodgy', 'Dokker', 'Spring'],
    'Hyundai': ['i10', 'i20', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Creta', 'Kona', 'H1', 'Sonata'],
    'Kia': ['Picanto', 'Rio', 'Cerato', 'Sportage', 'Sorento', 'Carnival', 'Stonic', 'Soul'],
    'Volkswagen': ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'T-Cross', 'Caddy', 'Transporter'],
    'Toyota': ['Yaris', 'Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Hilux', 'Hiace', 'Fortuner'],
    'Nissan': ['Micra', 'Sunny', 'Sentra', 'Qashqai', 'X-Trail', 'Patrol', 'Navara', 'Juke'],
    'Suzuki': ['Swift', 'Baleno', 'Vitara', 'Jimny', 'S-Cross', 'Celerio'],
    'Isuzu': ['D-Max', 'MU-X', 'NPR', 'NLR', 'NMR'],
    'Mitsubishi': ['Lancer', 'ASX', 'Outlander', 'Pajero', 'L200', 'Eclipse Cross'],
    'Ford': ['Fiesta', 'Focus', 'Kuga', 'EcoSport', 'Ranger', 'Transit', 'Mondeo'],
    'Fiat': ['Panda', '500', 'Tipo', 'Doblo', 'Ducato', 'Punto'],
    'Chevrolet': ['Aveo', 'Cruze', 'Captiva', 'Trax', 'Spark', 'Tahoe'],
    'Mercedes-Benz': ['Classe A', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLC', 'GLE', 'Sprinter', 'Vito'],
    'BMW': ['Série 1', 'Série 3', 'Série 5', 'Série 7', 'X1', 'X3', 'X5', 'X6'],
    'Audi': ['A1', 'A3', 'A4', 'A6', 'Q2', 'Q3', 'Q5', 'Q7'],
    'Seat': ['Ibiza', 'Leon', 'Arona', 'Ateca', 'Tarraco'],
    'Skoda': ['Fabia', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
    'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9'],
    'Honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot'],
    'Opel': ['Corsa', 'Astra', 'Insignia', 'Mokka', 'Crossland', 'Grandland'],
    'Autre': ['Autre modèle']
  };

  // 🆕 GOUVERNORATS + DÉLÉGATIONS TUNISIE
  gouvernorats: { [gouv: string]: string[] } = {
    'Tunis': ['Tunis', 'Carthage', 'La Marsa', 'Le Bardo', 'La Goulette', 'Sidi Bou Said', 'El Menzah', 'El Manar', 'Sidi Hassine', 'El Omrane', 'Bab Bhar', 'Bab Souika', 'Cité El Khadra', 'Ettahrir', 'Ezzouhour', 'Hraïria', 'Jebel Jelloud', 'Kabaria', 'La Médina', 'Séjoumi', 'Sidi El Béchir'],
    'Ariana': ['Ariana Ville', 'La Soukra', 'Raoued', 'Sidi Thabet', 'Kalâat el-Andalous', 'Ettadhamen', 'Mnihla'],
    'Ben Arous': ['Ben Arous', 'El Mourouj', 'Hammam Lif', 'Hammam Chott', 'Boumhel', 'Ezzahra', 'Radès', 'Mégrine', 'Mohamedia', 'Fouchana', 'Mornag', 'Nouvelle Médina'],
    'Manouba': ['Manouba', 'Den Den', 'Douar Hicher', 'Oued Ellil', 'Mornaguia', 'Borj El Amri', 'Tebourba', 'Jedaida', 'El Battan'],
    'Nabeul': ['Nabeul', 'Hammamet', 'Dar Chaabane El Fehri', 'Béni Khiar', 'Korba', 'Menzel Temime', 'El Mida', 'Kelibia', 'Hammam Ghezèze', 'El Haouaria', 'Takelsa', 'Soliman', 'Menzel Bouzelfa', 'Béni Khalled', 'Grombalia', 'Bou Argoub', 'El Maâmoura'],
    'Zaghouan': ['Zaghouan', 'Zriba', 'Bir Mcherga', 'El Fahs', 'Nadhour', 'Saouaf'],
    'Bizerte': ['Bizerte Nord', 'Bizerte Sud', 'Zarzouna', 'Menzel Jemil', 'Menzel Bourguiba', 'Tinja', 'Mateur', 'Ghezala', 'Joumine', 'Sejnane', 'Ras Jebel', 'El Alia', 'Ghar El Melh', 'Utique'],
    'Béja': ['Béja Nord', 'Béja Sud', 'Téboursouk', 'Tibar', 'Testour', 'Goubellat', 'Nefza', 'Amdoun', 'Medjez el-Bab'],
    'Jendouba': ['Jendouba', 'Jendouba Nord', 'Bou Salem', 'Tabarka', 'Aïn Draham', 'Fernana', 'Ghardimaou', 'Oued Meliz', 'Balta-Bou Aouane'],
    'Le Kef': ['Le Kef Ouest', 'Le Kef Est', 'Dahmani', 'Sakiet Sidi Youssef', 'Tajerouine', 'Nebeur', 'Touiref', 'Sers', 'Kalâat Senan', 'Kalâat Khasba', 'Jérissa'],
    'Siliana': ['Siliana Nord', 'Siliana Sud', 'Bou Arada', 'Gaâfour', 'El Krib', 'El Aroussa', 'Makthar', 'Rouhia', 'Kesra', 'Bargou', 'Sidi Bou Rouis'],
    'Sousse': ['Sousse Ville', 'Sousse Médina', 'Sousse Riadh', 'Sousse Jaouhara', 'Sousse Sidi Abdelhamid', 'Hammam Sousse', 'Akouda', 'Kalâa Kebira', 'Sidi Bou Ali', 'Hergla', 'Enfida', 'Bouficha', 'Kondar', 'Sidi El Hani', 'M\'saken', 'Kalâa Seghira'],
    'Monastir': ['Monastir', 'Khniss', 'Ouerdanine', 'Sahline', 'Zéramdine', 'Beni Hassen', 'Jemmal', 'Bembla', 'Moknine', 'Bekalta', 'Téboulba', 'Ksar Hellal', 'Ksibet el-Médiouni'],
    'Mahdia': ['Mahdia', 'Bou Merdes', 'Ouled Chamekh', 'Chorbane', 'Hebira', 'Essouassi', 'El Djem', 'Chebba', 'Melloulèche', 'Sidi Alouane', 'Ksour Essef'],
    'Sfax': ['Sfax Ville', 'Sfax Ouest', 'Sfax Sud', 'Sakiet Ezzit', 'Sakiet Eddaïer', 'Gremda', 'El Aïn', 'Thyna', 'Agareb', 'Jebiniana', 'El Hencha', 'Menzel Chaker', 'Ghraïba', 'Bir Ali Ben Khalifa', 'Skhira', 'Mahras', 'Kerkennah'],
    'Kairouan': ['Kairouan Nord', 'Kairouan Sud', 'Chebika', 'Sbikha', 'Haffouz', 'Alâa', 'Hajeb El Ayoun', 'Nasrallah', 'Cherarda', 'Bou Hajla', 'Oueslatia'],
    'Kasserine': ['Kasserine Nord', 'Kasserine Sud', 'Ezzouhour', 'Hassi El Ferid', 'Sbeitla', 'Sbiba', 'Jedeliane', 'Thala', 'Hidra', 'Foussana', 'Fériana', 'Majel Bel Abbès', 'El Ayoun'],
    'Sidi Bouzid': ['Sidi Bouzid Ouest', 'Sidi Bouzid Est', 'Jilma', 'Cebbala', 'Bir El Hafey', 'Sidi Ali Ben Aoun', 'Menzel Bouzaiane', 'Meknassy', 'Mezzouna', 'Regueb', 'Ouled Haffouz', 'Souk Jedid'],
    'Gabès': ['Gabès Ville', 'Gabès Sud', 'Gabès Ouest', 'Ghannouch', 'Métouia', 'Menzel El Habib', 'El Hamma', 'Matmata', 'Nouvelle Matmata', 'Mareth'],
    'Médenine': ['Médenine Nord', 'Médenine Sud', 'Beni Khedache', 'Ben Gardane', 'Zarzis', 'Houmt Souk (Djerba)', 'Midoun (Djerba)', 'Ajim (Djerba)', 'Sidi Makhloulf'],
    'Tataouine': ['Tataouine Nord', 'Tataouine Sud', 'Smâr', 'Bir Lahmar', 'Ghomrassen', 'Dehiba', 'Remada'],
    'Gafsa': ['Gafsa Nord', 'Gafsa Sud', 'Ksar', 'Moularès', 'Redeyef', 'Métlaoui', 'Mdhilla', 'El Guettar', 'Belkhir', 'Sened', 'Sidi Aïch'],
    'Tozeur': ['Tozeur', 'Degache', 'Tameghza', 'Nefta', 'Hazoua', 'Hamma'],
    'Kébili': ['Kébili Nord', 'Kébili Sud', 'Souk Lahad', 'Douz Nord', 'Douz Sud', 'El Faouar']
  };

  // 🆕 LISTE DESTINATIONS (100+ pays avec drapeaux)
  destinations: string[] = [
    '🇿🇦 Afrique du Sud', '🇩🇪 Allemagne', '🇸🇦 Arabie Saoudite', '🇦🇷 Argentine',
    '🇦🇲 Arménie', '🇦🇺 Australie', '🇦🇹 Autriche', '🇦🇿 Azerbaïdjan',
    '🇧🇸 Bahamas', '🇧🇭 Bahreïn', '🇧🇩 Bangladesh', '🇧🇧 Barbade',
    '🇧🇪 Belgique', '🇧🇿 Belize', '🇧🇯 Bénin', '🇧🇹 Bhoutan',
    '🇧🇴 Bolivie', '🇧🇦 Bosnie-Herzégovine', '🇧🇼 Botswana', '🇧🇷 Brésil',
    '🇧🇬 Bulgarie', '🇧🇫 Burkina Faso', '🇨🇲 Cameroun', '🇨🇦 Canada',
    '🇨🇻 Cap-Vert', '🇨🇱 Chili', '🇨🇳 Chine', '🇨🇾 Chypre',
    '🇨🇴 Colombie', '🇰🇲 Comores', '🇰🇷 Corée du Sud', '🇨🇷 Costa Rica',
    '🇨🇮 Côte d\'Ivoire', '🇭🇷 Croatie', '🇨🇺 Cuba', '🇩🇰 Danemark',
    '🇩🇯 Djibouti', '🇪🇬 Égypte', '🇦🇪 Émirats Arabes Unis', '🇪🇨 Équateur',
    '🇪🇸 Espagne', '🇪🇪 Estonie', '🇺🇸 États-Unis', '🇪🇹 Éthiopie',
    '🇫🇮 Finlande', '🇫🇷 France', '🇬🇦 Gabon', '🇬🇲 Gambie',
    '🇬🇪 Géorgie', '🇬🇭 Ghana', '🇬🇷 Grèce', '🇬🇹 Guatemala',
    '🇬🇳 Guinée', '🇭🇹 Haïti', '🇭🇳 Honduras', '🇭🇰 Hong Kong',
    '🇭🇺 Hongrie', '🇮🇳 Inde', '🇮🇩 Indonésie', '🇮🇶 Irak',
    '🇮🇷 Iran', '🇮🇪 Irlande', '🇮🇸 Islande', '🇮🇱 Israël',
    '🇮🇹 Italie', '🇯🇲 Jamaïque', '🇯🇵 Japon', '🇯🇴 Jordanie',
    '🇰🇿 Kazakhstan', '🇰🇪 Kenya', '🇰🇼 Koweït', '🇱🇦 Laos',
    '🇱🇧 Liban', '🇱🇾 Libye', '🇱🇮 Liechtenstein', '🇱🇺 Luxembourg',
    '🇲🇰 Macédoine du Nord', '🇲🇬 Madagascar', '🇲🇾 Malaisie', '🇲🇼 Malawi',
    '🇲🇻 Maldives', '🇲🇱 Mali', '🇲🇹 Malte', '🇲🇦 Maroc',
    '🇲🇺 Maurice', '🇲🇷 Mauritanie', '🇲🇽 Mexique', '🇲🇩 Moldavie',
    '🇲🇨 Monaco', '🇲🇳 Mongolie', '🇲🇪 Monténégro', '🇲🇿 Mozambique',
    '🇲🇲 Myanmar (Birmanie)', '🇳🇦 Namibie', '🇳🇵 Népal', '🇳🇮 Nicaragua',
    '🇳🇪 Niger', '🇳🇬 Nigéria', '🇳🇴 Norvège', '🇳🇿 Nouvelle-Zélande',
    '🇴🇲 Oman', '🇺🇬 Ouganda', '🇺🇿 Ouzbékistan', '🇵🇰 Pakistan',
    '🇵🇸 Palestine', '🇵🇦 Panama', '🇵🇾 Paraguay', '🇳🇱 Pays-Bas',
    '🇵🇪 Pérou', '🇵🇭 Philippines', '🇵🇱 Pologne', '🇵🇹 Portugal',
    '🇶🇦 Qatar', '🇨🇫 République Centrafricaine', '🇨🇩 République Démocratique du Congo',
    '🇩🇴 République Dominicaine', '🇨🇿 République Tchèque', '🇷🇴 Roumanie',
    '🇬🇧 Royaume-Uni', '🇷🇺 Russie', '🇷🇼 Rwanda', '🇸🇲 Saint-Marin',
    '🇻🇨 Saint-Vincent-et-les-Grenadines', '🇸🇳 Sénégal', '🇷🇸 Serbie',
    '🇸🇨 Seychelles', '🇸🇱 Sierra Leone', '🇸🇬 Singapour', '🇸🇰 Slovaquie',
    '🇸🇮 Slovénie', '🇸🇴 Somalie', '🇸🇩 Soudan', '🇱🇰 Sri Lanka',
    '🇸🇪 Suède', '🇨🇭 Suisse', '🇸🇷 Suriname', '🇸🇾 Syrie',
    '🇹🇯 Tadjikistan', '🇹🇼 Taïwan', '🇹🇿 Tanzanie', '🇹🇩 Tchad',
    '🇹🇭 Thaïlande', '🇹🇬 Togo', '🇹🇹 Trinité-et-Tobago', '🇹🇳 Tunisie',
    '🇹🇲 Turkménistan', '🇹🇷 Turquie', '🇺🇦 Ukraine', '🇺🇾 Uruguay',
    '🇻🇺 Vanuatu', '🇻🇪 Venezuela', '🇻🇳 Vietnam', '🇾🇪 Yémen',
    '🇿🇲 Zambie', '🇿🇼 Zimbabwe'
  ];

  // 🆕 Getters pour les listes
  get listeMarques(): string[] {
    return Object.keys(this.marquesVoitures).sort();
  }

  get modelesDisponibles(): string[] {
    if (!this.contrat.vehiculeMarque) return [];
    return this.marquesVoitures[this.contrat.vehiculeMarque] || [];
  }

  get listeGouvernorats(): string[] {
    return Object.keys(this.gouvernorats).sort();
  }

  get delegationsDisponibles(): string[] {
    if (!this.gouvernoratSelectionne) return [];
    return this.gouvernorats[this.gouvernoratSelectionne] || [];
  }


  getTypeIcon(type: string): string {
  const icons: any = { AUTO: '🚗', HABITATION: '🏠', SANTE: '🏥', VOYAGE: '✈️' };
  return icons[type] || '📋';
}

  constructor(
    private contratService: ContratService,
    private router: Router,
    private route: ActivatedRoute,
      private auth: Auth 
  ) {}


  isClient = false;

  ngOnInit(): void {
    this.isClient = this.auth.isClient(); // ← ajouter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.loadContrat(+id);
      
    }
  }

  loadContrat(id: number): void {
    this.loading = true;
    this.contratService.getById(id).subscribe({
      next: (data) => {
        this.contrat = data;
        // 🆕 Parser l'adresse existante (si édition)
        if (data.adresseBien) {
          this.parseAdresseExistante(data.adresseBien);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur chargement du contrat';
        this.loading = false;
      }
    });
  }

  // 🆕 Parser une adresse existante (mode édition)
  parseAdresseExistante(adresse: string): void {
    // Format attendu : "12 Rue X, La Marsa, Tunis"
    const parts = adresse.split(',').map(p => p.trim());
    if (parts.length >= 3) {
      this.rueDetail = parts[0];
      this.delegationSelectionnee = parts[1];
      this.gouvernoratSelectionne = parts[2];
    }
  }



  

  onTypeChange(): void {
    this.contrat.vehiculeMarque = undefined;
    this.contrat.vehiculeModele = undefined;
    this.contrat.vehiculeImmatriculation = undefined;
    this.contrat.adresseBien = undefined;
    this.contrat.superficieBien = undefined;
    this.contrat.typeBien = undefined;
    this.contrat.ageAssure = undefined;
    this.contrat.plafondAnnuel = undefined;
    this.contrat.destination = undefined;
    this.contrat.dureeVoyage = undefined;
    this.contrat.plafondAssurance = undefined;
    this.contrat.montantGarantie = undefined;
    // 🆕 Reset adresse
    this.gouvernoratSelectionne = '';
    this.delegationSelectionnee = '';
    this.rueDetail = '';
  }

  onMarqueChange(): void {
    this.contrat.vehiculeModele = '';
  }

  // 🆕 Reset délégation quand on change de gouvernorat
  onGouvernoratChange(): void {
    this.delegationSelectionnee = '';
    this.updateAdresseBien();
  }

  // 🆕 Mettre à jour l'adresse complète
  updateAdresseBien(): void {
    const parts = [];
    if (this.rueDetail) parts.push(this.rueDetail);
    if (this.delegationSelectionnee) parts.push(this.delegationSelectionnee);
    if (this.gouvernoratSelectionne) parts.push(this.gouvernoratSelectionne);
    this.contrat.adresseBien = parts.join(', ');
  }

  isDateValid(): boolean {
    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      return true;
    }
    return new Date(this.contrat.dateDebut) < new Date(this.contrat.dateFin);
  }

  /*onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      this.errorMessage = "Les dates de début et de fin sont obligatoires";
      return;
    }

    const debut = new Date(this.contrat.dateDebut);
    const fin = new Date(this.contrat.dateFin);

    if (debut >= fin) {
      this.errorMessage = "⚠️ La date de début doit être ANTÉRIEURE à la date de fin";
      return;
    }

    if (!this.isEdit) {
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      if (debut < aujourdhui) {
        this.errorMessage = "⚠️ La date de début ne peut pas être dans le passé";
        return;
      }
    }

    // 🆕 Validation adresse HABITATION
    if (this.contrat.typeContrat === 'HABITATION') {
      if (!this.gouvernoratSelectionne || !this.delegationSelectionnee || !this.rueDetail) {
        this.errorMessage = "⚠️ Veuillez remplir gouvernorat, délégation et rue pour l'habitation";
        return;
      }
      // S'assurer que l'adresse est bien construite
      this.updateAdresseBien();
    }

    this.loading = true;

    if (this.isEdit && this.editId) {
      this.contratService.update(this.editId, this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat modifié avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.contratService.creer(this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat créé avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/contrats']), 1200);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }*/















onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.contrat.dateDebut || !this.contrat.dateFin) {
      this.errorMessage = "Les dates de début et de fin sont obligatoires";
      return;
    }

    const debut = new Date(this.contrat.dateDebut);
    const fin = new Date(this.contrat.dateFin);

    if (debut >= fin) {
      this.errorMessage = "⚠️ La date de début doit être ANTÉRIEURE à la date de fin";
      return;
    }

    if (!this.isEdit) {
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      if (debut < aujourdhui) {
        this.errorMessage = "⚠️ La date de début ne peut pas être dans le passé";
        return;
      }
    }

    if (this.contrat.typeContrat === 'HABITATION') {
      if (!this.gouvernoratSelectionne || !this.delegationSelectionnee || !this.rueDetail) {
        this.errorMessage = "⚠️ Veuillez remplir gouvernorat, délégation et rue pour l'habitation";
        return;
      }
      this.updateAdresseBien();
    }

    this.loading = true;

    // ← ajouter cette ligne une seule fois ici
    const route = this.auth.isClient() ? '/client/contrats' : '/admin/contrats';

    if (this.isEdit && this.editId) {
      this.contratService.update(this.editId, this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat modifié avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate([route]), 1200); // ← modifié
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la modification';
          this.loading = false;
        }
      });
    } else {
      this.contratService.creer(this.contrat).subscribe({
        next: () => {
          this.successMessage = 'Contrat créé avec succès !';
          this.loading = false;
          setTimeout(() => this.router.navigate([route]), 1200); // ← modifié
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }















}


















































