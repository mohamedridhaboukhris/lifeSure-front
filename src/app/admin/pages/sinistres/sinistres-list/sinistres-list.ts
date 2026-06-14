import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SinistreService, Sinistre } from '../../../../services/sinistre';
import { Auth } from '../../../../services/auth';
import { PdfService } from '../../../../services/pdf';

@Component({
  selector: 'app-sinistres-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sinistres-list.html',
  styleUrls: ['./sinistres-list.css']
})
export class SinistresListComponent implements OnInit {

  sinistres: Sinistre[] = [];
  loading = false;
  errorMessage = '';
  isClient = false;

  constructor(
    private sinistreService: SinistreService,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.isClient = this.auth.isClient();
    this.load();
  }


















  load(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.sinistreService.getMesSinistresClient().subscribe({
      next: (data) => {
        this.sinistres = data.sort((a: any, b: any) =>
          new Date(b.dateSinistre || 0).getTime() - new Date(a.dateSinistre || 0).getTime()
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur chargement de vos sinistres';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── STATUT ──
  getStatutBadge(s?: string): string {
    switch (s) {
      case 'DECLARE':   return 's-declare';
      case 'EN_COURS':  return 's-encours';
      case 'ACCEPTE':   return 's-accepte';
      case 'REFUSE':    return 's-refuse';
      case 'CLOTURE':   return 's-cloture';
      default:          return 's-declare';
    }
  }

  getStatutIcon(s?: string): string {
    switch (s) {
      case 'DECLARE':   return '📋';
      case 'EN_COURS':  return '⏳';
      case 'ACCEPTE':   return '✅';
      case 'REFUSE':    return '❌';
      case 'CLOTURE':   return '🔒';
      default:          return '';
    }
  }

  getStatutLabel(s?: string): string {
    switch (s) {
      case 'DECLARE':   return 'Déclaré';
      case 'EN_COURS':  return 'En cours';
      case 'ACCEPTE':   return 'Accepté';
      case 'REFUSE':    return 'Refusé';
      case 'CLOTURE':   return 'Clôturé';
      default:          return s || '';
    }
  }

  // ── TYPE ──
  getTypeIcon(type?: string): string {
    if (!type) return '⚠️';
    if (type.includes('AUTO') || type === 'ACCIDENT' || type === 'BRIS_DE_GLACE' || type === 'VOL' || type.includes('DOMMAGES')) return '🚗';
    if (type.includes('HABITATION') || type.includes('DEGAT') || type.includes('VOL_HAB') || type.includes('CATASTROPHE') || type.includes('RESPONSABILITE')) return '🏠';
    if (type === 'ANNULATION' || type.includes('VOYAGE') || type === 'PERTE_BAGAGES' || type === 'RETARD_VOL') return '✈️';
    if (type.includes('HOSPITALISATION') || type.includes('CONSULTATION') || type.includes('DENTAIRE') || type.includes('MALADIE') || type.includes('PHARMACIE')) return '🏥';
    return '⚠️';
  }

  getIconClass(type?: string): string {
    if (!type) return 'icon-autre';
    if (type.includes('AUTO') || type === 'ACCIDENT' || type.includes('DOMMAGES') || type === 'BRIS_DE_GLACE') return 'icon-auto';
    if (type.includes('HABITATION') || type.includes('DEGAT') || type.includes('CATASTROPHE')) return 'icon-hab';
    if (type === 'ANNULATION' || type.includes('VOYAGE') || type === 'PERTE_BAGAGES') return 'icon-voyage';
    if (type.includes('HOSPITALISATION') || type.includes('SANTE') || type.includes('MEDICAL')) return 'icon-sante';
    return 'icon-autre';
  }

  getTypeBadgeClass(type?: string): string {
    if (!type) return 'badge-autre';
    if (type === 'ACCIDENT') return 'badge-accident';
    if (type.includes('INCENDIE')) return 'badge-incendie';
    if (type.includes('VOL')) return 'badge-vol';
    if (type === 'ANNULATION' || type.includes('VOYAGE')) return 'badge-annulation';
    if (type.includes('DOMMAGES')) return 'badge-dommages';
    return 'badge-autre';
  }

  // ── STATS ──
  getCount(statut: string): number {
    return this.sinistres.filter(s => s.statut === statut).length;
  }

  // ── DONUT ──
  getNbAuto(): number {
    return this.sinistres.filter(s =>
      s.typeSinistre && (
        s.typeSinistre.includes('AUTO') ||
        s.typeSinistre === 'ACCIDENT' ||
        s.typeSinistre.includes('DOMMAGES') ||
        s.typeSinistre === 'BRIS_DE_GLACE' ||
        s.typeSinistre === 'VOL'
      )
    ).length;
  }

  getNbVoyage(): number {
    return this.sinistres.filter(s =>
      s.typeSinistre && (
        s.typeSinistre === 'ANNULATION' ||
        s.typeSinistre.includes('VOYAGE') ||
        s.typeSinistre === 'PERTE_BAGAGES' ||
        s.typeSinistre === 'RETARD_VOL'
      )
    ).length;
  }

  getNbHab(): number {
    return this.sinistres.filter(s =>
      s.typeSinistre && (
        s.typeSinistre.includes('HABITATION') ||
        s.typeSinistre.includes('DEGAT') ||
        s.typeSinistre.includes('CATASTROPHE') ||
        s.typeSinistre.includes('RESPONSABILITE')
      )
    ).length;
  }

  getNbSante(): number {
    return this.sinistres.filter(s =>
      s.typeSinistre && (
        s.typeSinistre.includes('HOSPITALISATION') ||
        s.typeSinistre.includes('CONSULTATION') ||
        s.typeSinistre.includes('DENTAIRE') ||
        s.typeSinistre.includes('MALADIE') ||
        s.typeSinistre.includes('PHARMACIE')
      )
    ).length;
  }

  getDonutAuto(): number {
    if (this.sinistres.length === 0) return 0;
    return Math.round((this.getNbAuto() / this.sinistres.length) * 188);
  }

  getDonutVoyage(): number {
    if (this.sinistres.length === 0) return 0;
    return Math.round((this.getNbVoyage() / this.sinistres.length) * 188);
  }

  getDonutHab(): number {
    if (this.sinistres.length === 0) return 0;
    return Math.round((this.getNbHab() / this.sinistres.length) * 188);
  }

  // ── TIMELINE ──
  getRecents(): Sinistre[] {
    return this.sinistres.slice(0, 4);
  }

  getTlDotClass(statut?: string): string {
    switch (statut) {
      case 'ACCEPTE':  return 'dot-green';
      case 'REFUSE':   return 'dot-red';
      case 'EN_COURS': return 'dot-or';
      case 'DECLARE':  return 'dot-blue';
      default:         return 'dot-gray';
    }
  }

  formatDateCourt(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
}
