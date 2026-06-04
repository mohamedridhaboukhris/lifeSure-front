



















/*import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SinistreService, Sinistre, IaAnalyseResponse } from '../../../../services/sinistre';

@Component({
  selector: 'app-sinistres-expert',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sinistres-expert.html',
  styleUrls: ['./sinistres-expert.css']
})
export class SinistresExpertComponent implements OnInit {

  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';
  montantFinal: { [id: number]: number } = {};

  // 🤖 Analyse IA
  loadingIa: { [id: number]: boolean } = {};
  iaResults: { [id: number]: IaAnalyseResponse } = {};

  // 🔍 Recherche
  searchTerm: string = '';

  // 🎯 Filtres
  filterStatut: string = '';
  filterType: string = '';
  filterDateDebut: string = '';
  filterDateFin: string = '';
  filterFraude: string = '';

  // 📊 Tri
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // 📃 Pagination
  currentPage = 1;
  itemsPerPage = 5;

  statuts = ['DECLARE', 'EN_COURS', 'ACCEPTE', 'REFUSE', 'CLOTURE'];
  types: string[] = [];

  constructor(
    private sinistreService: SinistreService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.sinistreService.getMesSinistres().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.types = [...new Set(data.map(s => s.typeSinistre).filter(t => t))] as string[];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ====================================
  // 🤖 ANALYSE IA (Hugging Face)
  // ====================================
  analyserAvecIa(sinistreId: number): void {
    this.loadingIa[sinistreId] = true;
    this.cdr.detectChanges();

    this.sinistreService.analyserAvecIa(sinistreId).subscribe({
      next: (res) => {
        this.iaResults[sinistreId] = res;
        this.loadingIa[sinistreId] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur IA:', err);
        alert('Erreur lors de l\'analyse IA. Vérifiez que le sinistre a des images jointes.');
        this.loadingIa[sinistreId] = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeIaResult(sinistreId: number): void {
    delete this.iaResults[sinistreId];
    this.cdr.detectChanges();
  }

  utiliserMontantIa(sinistreId: number, montant: number): void {
    // ✅ Pré-remplit directement le champ "Montant final proposé"
    this.montantFinal[sinistreId] = montant;
    this.cdr.detectChanges();
    alert(`✅ Montant ${montant} DT pré-rempli. Vous pouvez l'ajuster avant de valider.`);
  }

  // ====================================
  // 🔍 RECHERCHE + FILTRES
  // ====================================
  applyFilters(): void {
    let result = [...this.sinistres];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        (s.numeroSinistre?.toLowerCase().includes(term)) ||
        (s.description?.toLowerCase().includes(term)) ||
        (s.client?.nom?.toLowerCase().includes(term)) ||
        (s.client?.prenom?.toLowerCase().includes(term)) ||
        (s.client?.email?.toLowerCase().includes(term)) ||
        (s.contrat?.numeroContrat?.toLowerCase().includes(term)) ||
        (s.typeSinistre?.toLowerCase().includes(term))
      );
    }

    if (this.filterStatut)    result = result.filter(s => s.statut === this.filterStatut);
    if (this.filterType)      result = result.filter(s => s.typeSinistre === this.filterType);
    if (this.filterDateDebut) result = result.filter(s => s.dateSinistre && s.dateSinistre >= this.filterDateDebut);
    if (this.filterDateFin)   result = result.filter(s => s.dateSinistre && s.dateSinistre <= this.filterDateFin);

    if (this.filterFraude === 'oui') result = result.filter(s => s.fraude === true);
    if (this.filterFraude === 'non') result = result.filter(s => s.fraude === false);

    if (this.sortColumn) {
      result.sort((a: any, b: any) => {
        const valA = this.getValueByPath(a, this.sortColumn);
        const valB = this.getValueByPath(b, this.sortColumn);
        if (valA == null) return 1;
        if (valB == null) return -1;
        let cmp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else {
          cmp = String(valA).localeCompare(String(valB));
        }
        return this.sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    this.filteredSinistres = result;
    this.currentPage = 1;
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatut = '';
    this.filterType = '';
    this.filterDateDebut = '';
    this.filterDateFin = '';
    this.filterFraude = '';
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatut || this.filterType
              || this.filterDateDebut || this.filterDateFin || this.filterFraude);
  }

  // 📃 Pagination
  get paginatedSinistres(): Sinistre[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSinistres.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSinistres.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // ====================================
  // 🛠️ Actions Expert
  // ====================================
  estimerIA(id: number): void {
    this.sinistreService.estimerAvecIA(id).subscribe({
      next: (updated) => {
        this.montantFinal[id] = updated.montantIndemnisation || 0;
        const idx = this.sinistres.findIndex(s => s.id === id);
        if (idx >= 0) this.sinistres[idx] = updated;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => alert('Erreur estimation IA')
    });
  }

  accepter(id: number): void {
    const montant = this.montantFinal[id];
    if (!montant || montant <= 0) {
      alert('Entrez un montant valide');
      return;
    }
    if (confirm(`Accepter ce sinistre avec ${montant} DT ?`)) {
      this.sinistreService.accepter(id, montant).subscribe(() => this.load());
    }
  }

  refuser(id: number): void {
    if (confirm('Refuser ce sinistre ?')) {
      this.sinistreService.refuser(id).subscribe(() => this.load());
    }
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




















/*import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SinistreService, Sinistre, IaAnalyseResponse } from '../../../../services/sinistre';

@Component({
  selector: 'app-sinistres-expert',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ],
  templateUrl: './sinistres-expert.html',
  styleUrls: ['./sinistres-expert.css']
})
export class SinistresExpertComponent implements OnInit {

  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';
  montantFinal: { [id: number]: number } = {};

  // 🤖 Analyse IA
  loadingIa: { [id: number]: boolean } = {};
  iaResults: { [id: number]: IaAnalyseResponse } = {};

  // 🔄 Loading pour chaque action
  loadingEstimation: { [id: number]: boolean } = {};
  loadingAction: { [id: number]: boolean } = {};

  // 🔍 Recherche
  searchTerm: string = '';

  // 🎯 Filtres
  filterStatut: string = '';
  filterType: string = '';
  filterDateDebut: string = '';
  filterDateFin: string = '';
  filterFraude: string = '';

  // 📊 Tri
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // 📃 Pagination
  currentPage = 1;
  itemsPerPage = 5;

  statuts = ['DECLARE', 'EN_COURS', 'ACCEPTE', 'REFUSE', 'CLOTURE'];
  types: string[] = [];

  constructor(
    private sinistreService: SinistreService,
    private cdr: ChangeDetectorRef
   
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.sinistreService.getMesSinistres().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.types = [...new Set(data.map(s => s.typeSinistre).filter(t => t))] as string[];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ====================================
  // 🤖 ANALYSE IA (Groq)
  // ====================================
  analyserAvecIa(sinistreId: number): void {
    this.loadingIa[sinistreId] = true;
    this.cdr.detectChanges();

    this.sinistreService.analyserAvecIa(sinistreId).subscribe({
      next: (res) => {
        this.iaResults[sinistreId] = res;
        this.loadingIa[sinistreId] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur IA:', err);
        alert('❌ Erreur lors de l\'analyse IA. Vérifiez que le sinistre a des images jointes.');
        this.loadingIa[sinistreId] = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeIaResult(sinistreId: number): void {
    delete this.iaResults[sinistreId];
    this.cdr.detectChanges();
  }

  utiliserMontantIa(sinistreId: number, montant: number): void {
    this.montantFinal[sinistreId] = montant;
    this.cdr.detectChanges();
    alert(`✅ Montant ${montant} DT pré-rempli. Vous pouvez l'ajuster avant de valider.`);
  }

  // ====================================
  // 🔍 RECHERCHE + FILTRES
  // ====================================
  applyFilters(): void {
    let result = [...this.sinistres];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        (s.numeroSinistre?.toLowerCase().includes(term)) ||
        (s.description?.toLowerCase().includes(term)) ||
        (s.client?.nom?.toLowerCase().includes(term)) ||
        (s.client?.prenom?.toLowerCase().includes(term)) ||
        (s.client?.email?.toLowerCase().includes(term)) ||
        (s.contrat?.numeroContrat?.toLowerCase().includes(term)) ||
        (s.typeSinistre?.toLowerCase().includes(term))
      );
    }

    if (this.filterStatut)    result = result.filter(s => s.statut === this.filterStatut);
    if (this.filterType)      result = result.filter(s => s.typeSinistre === this.filterType);
    if (this.filterDateDebut) result = result.filter(s => s.dateSinistre && s.dateSinistre >= this.filterDateDebut);
    if (this.filterDateFin)   result = result.filter(s => s.dateSinistre && s.dateSinistre <= this.filterDateFin);

    if (this.filterFraude === 'oui') result = result.filter(s => s.fraude === true);
    if (this.filterFraude === 'non') result = result.filter(s => s.fraude === false);

    
if (this.sortColumn) {
  result.sort((a: any, b: any) => {
    const valA = this.getValueByPath(a, this.sortColumn);
    const valB = this.getValueByPath(b, this.sortColumn);
    if (valA == null) return 1;
    if (valB == null) return -1;
    let cmp = 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      cmp = valA - valB;
    } else {
      cmp = String(valA).localeCompare(String(valB));
    }
    return this.sortDirection === 'asc' ? cmp : -cmp;
  });
} else {
  // 🆕 TRI PAR DÉFAUT : Plus récent en premier
  result.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
}

this.filteredSinistres = result;

      

    this.filteredSinistres = result;
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatut = '';
    this.filterType = '';
    this.filterDateDebut = '';
    this.filterDateFin = '';
    this.filterFraude = '';
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatut || this.filterType
              || this.filterDateDebut || this.filterDateFin || this.filterFraude);
  }

  // 📃 Pagination
  get paginatedSinistres(): Sinistre[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSinistres.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSinistres.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  // ====================================
  // 🛠️ Actions Expert (CORRIGÉES)
  // ====================================
  estimerIA(id: number): void {
    this.loadingEstimation[id] = true;
    this.cdr.detectChanges();

    this.sinistreService.estimerAvecIA(id).subscribe({
      next: (updated) => {
        this.montantFinal[id] = updated.montantIndemnisation || 0;
        const idx = this.sinistres.findIndex(s => s.id === id);
        if (idx >= 0) this.sinistres[idx] = updated;
        this.applyFilters();
        this.loadingEstimation[id] = false;
        this.cdr.detectChanges();
        alert(`✅ Estimation IA : ${updated.montantIndemnisation} DT`);
      },
      error: () => {
        alert('❌ Erreur estimation IA');
        this.loadingEstimation[id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  accepter(id: number): void {
    const montant = this.montantFinal[id];
    if (!montant || montant <= 0) {
      alert('⚠️ Entrez un montant valide');
      return;
    }
    if (!confirm(`Accepter ce sinistre avec ${montant} DT ?`)) {
      return;
    }

    this.loadingAction[id] = true;
    this.cdr.detectChanges();

    this.sinistreService.accepter(id, montant).subscribe({
      next: () => {
        alert('✅ Sinistre accepté avec succès !');
        this.loadingAction[id] = false;
        this.load();
      },
      error: () => {
        alert('❌ Erreur lors de l\'acceptation');
        this.loadingAction[id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  refuser(id: number): void {
    if (!confirm('Refuser ce sinistre ?')) {
      return;
    }

    this.loadingAction[id] = true;
    this.cdr.detectChanges();

    this.sinistreService.refuser(id).subscribe({
      next: () => {
        alert('✅ Sinistre refusé');
        this.loadingAction[id] = false;
        this.load();
      },
      error: () => {
        alert('❌ Erreur lors du refus');
        this.loadingAction[id] = false;
        this.cdr.detectChanges();
      }
    });
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
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SinistreService, Sinistre, IaAnalyseResponse } from '../../../../services/sinistre';

@Component({
  selector: 'app-sinistres-expert',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sinistres-expert.html',
  styleUrls: ['./sinistres-expert.css']
})
export class SinistresExpertComponent implements OnInit {

  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';
  montantFinal: { [id: number]: number } = {};

  // 🤖 Analyse IA
  loadingIa: { [id: number]: boolean } = {};
  iaResults: { [id: number]: IaAnalyseResponse } = {};

  // 🔄 Loading pour chaque action
  loadingEstimation: { [id: number]: boolean } = {};
  loadingAction: { [id: number]: boolean } = {};

  // 🔍 Recherche
  searchTerm: string = '';

  // 🎯 Filtres
  filterStatut: string = '';
  filterType: string = '';
  filterDateDebut: string = '';
  filterDateFin: string = '';
  filterFraude: string = '';

  // 📊 Tri
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // 📃 Pagination
  currentPage = 1;
  itemsPerPage = 5;

  statuts = ['DECLARE', 'EN_COURS', 'ACCEPTE', 'REFUSE', 'CLOTURE'];
  types: string[] = [];

  constructor(
    private sinistreService: SinistreService,
    private cdr: ChangeDetectorRef,
    private router: Router  // 🆕 AJOUT
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.sinistreService.getMesSinistres().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.types = [...new Set(data.map(s => s.typeSinistre).filter(t => t))] as string[];
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ====================================
  // 🆕 VOIR LIEU SUR LA CARTE
  // ====================================
  voirLieuSurCarte(sinistre: Sinistre): void {
    if (!sinistre.latitude || !sinistre.longitude) {
      alert('⚠️ Ce sinistre n\'a pas de coordonnées GPS');
      return;
    }
    
    this.router.navigate(['/admin/carte-sinistres'], {
      queryParams: {
        sinistreId: sinistre.id,
        lat: sinistre.latitude,
        lng: sinistre.longitude,
        zoom: 16
      }
    });
  }

  // ====================================
  // 🤖 ANALYSE IA (Groq)
  // ====================================
  analyserAvecIa(sinistreId: number): void {
    this.loadingIa[sinistreId] = true;
    this.cdr.detectChanges();

    this.sinistreService.analyserAvecIa(sinistreId).subscribe({
      next: (res) => {
        this.iaResults[sinistreId] = res;
        this.loadingIa[sinistreId] = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur IA:', err);
        alert('❌ Erreur lors de l\'analyse IA. Vérifiez que le sinistre a des images jointes.');
        this.loadingIa[sinistreId] = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeIaResult(sinistreId: number): void {
    delete this.iaResults[sinistreId];
    this.cdr.detectChanges();
  }

  utiliserMontantIa(sinistreId: number, montant: number): void {
    this.montantFinal[sinistreId] = montant;
    this.cdr.detectChanges();
    alert(`✅ Montant ${montant} DT pré-rempli. Vous pouvez l'ajuster avant de valider.`);
  }

  // ====================================
  // 🔍 RECHERCHE + FILTRES
  // ====================================
  applyFilters(): void {
    let result = [...this.sinistres];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        (s.numeroSinistre?.toLowerCase().includes(term)) ||
        (s.description?.toLowerCase().includes(term)) ||
        (s.client?.nom?.toLowerCase().includes(term)) ||
        (s.client?.prenom?.toLowerCase().includes(term)) ||
        (s.client?.email?.toLowerCase().includes(term)) ||
        (s.contrat?.numeroContrat?.toLowerCase().includes(term)) ||
        (s.typeSinistre?.toLowerCase().includes(term))
      );
    }

    if (this.filterStatut)    result = result.filter(s => s.statut === this.filterStatut);
    if (this.filterType)      result = result.filter(s => s.typeSinistre === this.filterType);
    if (this.filterDateDebut) result = result.filter(s => s.dateSinistre && s.dateSinistre >= this.filterDateDebut);
    if (this.filterDateFin)   result = result.filter(s => s.dateSinistre && s.dateSinistre <= this.filterDateFin);

    if (this.filterFraude === 'oui') result = result.filter(s => s.fraude === true);
    if (this.filterFraude === 'non') result = result.filter(s => s.fraude === false);

    if (this.sortColumn) {
      result.sort((a: any, b: any) => {
        const valA = this.getValueByPath(a, this.sortColumn);
        const valB = this.getValueByPath(b, this.sortColumn);
        if (valA == null) return 1;
        if (valB == null) return -1;
        let cmp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          cmp = valA - valB;
        } else {
          cmp = String(valA).localeCompare(String(valB));
        }
        return this.sortDirection === 'asc' ? cmp : -cmp;
      });
    } else {
      // 🆕 TRI PAR DÉFAUT : Plus récent en premier
      result.sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
    }

    this.filteredSinistres = result;
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterStatut = '';
    this.filterType = '';
    this.filterDateDebut = '';
    this.filterDateFin = '';
    this.filterFraude = '';
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.filterStatut || this.filterType
              || this.filterDateDebut || this.filterDateFin || this.filterFraude);
  }

  // 📃 Pagination
  get paginatedSinistres(): Sinistre[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredSinistres.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredSinistres.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  // ====================================
  // 🛠️ Actions Expert
  // ====================================
  estimerIA(id: number): void {
    this.loadingEstimation[id] = true;
    this.cdr.detectChanges();

    this.sinistreService.estimerAvecIA(id).subscribe({
      next: (updated) => {
        this.montantFinal[id] = updated.montantIndemnisation || 0;
        const idx = this.sinistres.findIndex(s => s.id === id);
        if (idx >= 0) this.sinistres[idx] = updated;
        this.applyFilters();
        this.loadingEstimation[id] = false;
        this.cdr.detectChanges();
        alert(`✅ Estimation IA : ${updated.montantIndemnisation} DT`);
      },
      error: () => {
        alert('❌ Erreur estimation IA');
        this.loadingEstimation[id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  accepter(id: number): void {
    const montant = this.montantFinal[id];
    if (!montant || montant <= 0) {
      alert('⚠️ Entrez un montant valide');
      return;
    }
    if (!confirm(`Accepter ce sinistre avec ${montant} DT ?`)) {
      return;
    }

    this.loadingAction[id] = true;
    this.cdr.detectChanges();

    this.sinistreService.accepter(id, montant).subscribe({
      next: () => {
        alert('✅ Sinistre accepté avec succès !');
        this.loadingAction[id] = false;
        this.load();
      },
      error: () => {
        alert('❌ Erreur lors de l\'acceptation');
        this.loadingAction[id] = false;
        this.cdr.detectChanges();
      }
    });
  }

  refuser(id: number): void {
    if (!confirm('Refuser ce sinistre ?')) {
      return;
    }

    this.loadingAction[id] = true;
    this.cdr.detectChanges();

    this.sinistreService.refuser(id).subscribe({
      next: () => {
        alert('✅ Sinistre refusé');
        this.loadingAction[id] = false;
        this.load();
      },
      error: () => {
        alert('❌ Erreur lors du refus');
        this.loadingAction[id] = false;
        this.cdr.detectChanges();
      }
    });
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