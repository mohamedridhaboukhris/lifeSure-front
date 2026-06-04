








/*import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SinistreService, Sinistre, PlafondCheckResponse } from '../../../../services/sinistre';

@Component({
  selector: 'app-sinistres-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sinistres-agent.html',
  styleUrls: ['./sinistres-agent.css']
})
export class SinistresAgentComponent implements OnInit {

  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';

  plafondResult: { [id: number]: PlafondCheckResponse } = {};
  expertIdToAffect: { [id: number]: number } = {};

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
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.sinistreService.getAll().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.types = [...new Set(data.map(s => s.typeSinistre).filter(t => t))] as string[];
        this.applyFilters();
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

  // ====================================
  // 🔍 RECHERCHE + FILTRES
  // ====================================
  applyFilters(): void {
    let result = [...this.sinistres];

    // 🔍 Recherche texte
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

    // 🎯 Filtres
    if (this.filterStatut)    result = result.filter(s => s.statut === this.filterStatut);
    if (this.filterType)      result = result.filter(s => s.typeSinistre === this.filterType);
    if (this.filterDateDebut) result = result.filter(s => s.dateSinistre && s.dateSinistre >= this.filterDateDebut);
    if (this.filterDateFin)   result = result.filter(s => s.dateSinistre && s.dateSinistre <= this.filterDateFin);

    // 🤖 Filtre fraude IA
    if (this.filterFraude === 'oui') result = result.filter(s => s.fraude === true);
    if (this.filterFraude === 'non') result = result.filter(s => s.fraude === false);

    // 📊 Tri
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
    this.cdr.detectChanges();  // ✅ AJOUTÉ
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
      this.cdr.detectChanges();  // ✅ AJOUTÉ
    }
  }

  // ====================================
  // 🛠️ Actions existantes
  // ====================================
  prendre(id: number): void {
    this.sinistreService.affecterAgent(id).subscribe(() => this.load());
  }

  checkPlafond(id: number): void {
    this.sinistreService.checkPlafond(id).subscribe(res => {
      this.plafondResult[id] = res;
      this.cdr.detectChanges();  // ✅ AJOUTÉ
    });
  }

  affecterExpert(sinistreId: number): void {
    const expertId = this.expertIdToAffect[sinistreId];
    if (!expertId) {
      alert("Entrez l'ID d'un expert");
      return;
    }
    this.sinistreService.affecterExpert(sinistreId, expertId).subscribe(() => this.load());
  }

  refuser(id: number): void {
    if (confirm('Confirmer le refus ?')) {
      this.sinistreService.refuser(id).subscribe(() => this.load());
    }
  }

  cloturer(id: number): void {
    if (confirm('Clôturer ce sinistre ?')) {
      this.sinistreService.cloturer(id).subscribe(() => this.load());
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
import { SinistreService, Sinistre, PlafondCheckResponse } from '../../../../services/sinistre';

@Component({
  selector: 'app-sinistres-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sinistres-agent.html',
  styleUrls: ['./sinistres-agent.css']
})
export class SinistresAgentComponent implements OnInit {

  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';

  plafondResult: { [id: number]: PlafondCheckResponse } = {};
  expertIdToAffect: { [id: number]: number } = {};

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

    this.sinistreService.getAll().subscribe({
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
  // 🛠️ Actions agent (CORRIGÉES)
  // ====================================
  prendre(id: number): void {
    this.sinistreService.affecterAgent(id).subscribe({
      next: () => {
        this.load();
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        alert('Erreur lors de la prise en charge');
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  checkPlafond(id: number): void {
    this.sinistreService.checkPlafond(id).subscribe({
      next: (res) => {
        this.plafondResult[id] = res;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        alert('Erreur vérification plafond');
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  affecterExpert(sinistreId: number): void {
    const expertId = this.expertIdToAffect[sinistreId];
    if (!expertId) {
      alert("Entrez l'ID d'un expert");
      return;
    }
    this.sinistreService.affecterExpert(sinistreId, expertId).subscribe({
      next: () => {
        this.load();
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        alert('Erreur affectation expert');
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  refuser(id: number): void {
    if (confirm('Confirmer le refus ?')) {
      this.sinistreService.refuser(id).subscribe({
        next: () => {
          this.load();
          this.cdr.detectChanges();  // ✅ AJOUTÉ
        },
        error: () => {
          alert('Erreur lors du refus');
          this.cdr.detectChanges();  // ✅ AJOUTÉ
        }
      });
    }
  }

  cloturer(id: number): void {
    if (confirm('Clôturer ce sinistre ?')) {
      this.sinistreService.cloturer(id).subscribe({
        next: () => {
          this.load();
          this.cdr.detectChanges();  // ✅ AJOUTÉ
        },
        error: () => {
          alert('Erreur clôture');
          this.cdr.detectChanges();  // ✅ AJOUTÉ
        }
      });
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



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SinistreService, Sinistre, PlafondCheckResponse } from '../../../../services/sinistre';

@Component({
  selector: 'app-sinistres-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sinistres-agent.html',
  styleUrls: ['./sinistres-agent.css']
})
export class SinistresAgentComponent implements OnInit {

  sinistres: Sinistre[] = [];
  filteredSinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';

  plafondResult: { [id: number]: PlafondCheckResponse } = {};
  expertIdToAffect: { [id: number]: number } = {};

  searchTerm: string = '';
  filterStatut: string = '';
  filterType: string = '';
  filterDateDebut: string = '';
  filterDateFin: string = '';
  filterFraude: string = '';

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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

    this.sinistreService.getAll().subscribe({
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
//hedi mta3 last update fel affichage
    /*if (this.sortColumn) {
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
    }*/
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
  // 🆕 TRI PAR DÉFAUT : Dernier sinistre en premier (par ID descendant)
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
  // 🛠️ Actions agent
  // ====================================
  prendre(id: number): void {
    this.sinistreService.affecterAgent(id).subscribe({
      next: () => {
        alert('✅ Sinistre pris en charge !');
        this.load();
      },
      error: () => {
        alert('❌ Erreur lors de la prise en charge');
        this.cdr.detectChanges();
      }
    });
  }

  checkPlafond(id: number): void {
    this.sinistreService.checkPlafond(id).subscribe({
      next: (res) => {
        this.plafondResult[id] = res;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('❌ Erreur vérification plafond');
        this.cdr.detectChanges();
      }
    });
  }

  affecterExpert(sinistreId: number): void {
    const expertId = this.expertIdToAffect[sinistreId];
    if (!expertId) {
      alert("⚠️ Entrez l'ID d'un expert");
      return;
    }
    this.sinistreService.affecterExpert(sinistreId, expertId).subscribe({
      next: () => {
        alert('✅ Expert affecté avec succès !');
        this.load();
      },
      error: () => {
        alert('❌ Erreur affectation expert');
        this.cdr.detectChanges();
      }
    });
  }

  refuser(id: number): void {
    if (confirm('Confirmer le refus ?')) {
      this.sinistreService.refuser(id).subscribe({
        next: () => {
          alert('✅ Sinistre refusé');
          this.load();
        },
        error: () => {
          alert('❌ Erreur lors du refus');
          this.cdr.detectChanges();
        }
      });
    }
  }

  cloturer(id: number): void {
    if (confirm('Clôturer ce sinistre ?')) {
      this.sinistreService.cloturer(id).subscribe({
        next: () => {
          alert('✅ Sinistre clôturé');
          this.load();
        },
        error: () => {
          alert('❌ Erreur clôture');
          this.cdr.detectChanges();
        }
      });
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
}