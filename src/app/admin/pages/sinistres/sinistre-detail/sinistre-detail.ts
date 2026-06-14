import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SinistreService, Sinistre, DocumentSinistre } from '../../../../services/sinistre';
import { Auth } from '../../../../services/auth';
import { PdfService } from '../../../../services/pdf';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sinistre-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sinistre-detail.html',
  styleUrls: ['./sinistre-detail.css']
})
export class SinistreDetailComponent implements OnInit {

  sinistre: Sinistre | null = null;
  documents: DocumentSinistre[] = [];
  loading = false;
  errorMessage = '';
  isClient = false;
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private sinistreService: SinistreService,
    public auth: Auth,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isClient = this.auth.isClient();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSinistre(+id);
      this.loadDocuments(+id);
    }
  }

  loadSinistre(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.sinistreService.getById(id).subscribe({
      next: (data) => { this.sinistre = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.errorMessage = 'Erreur chargement'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  loadDocuments(id: number): void {
    this.sinistreService.getDocuments(id).subscribe({
      next: (docs) => { this.documents = docs; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  telechargerRapport(id: number): void {
    this.pdfService.rapportSinistre(id).subscribe({
      next: (blob) => this.pdfService.downloadBlob(blob, `Rapport_Sinistre_${id}.pdf`),
      error: () => alert('Erreur téléchargement')
    });
  }

  // ── STATUT ──
  getStatutBadge(s?: string): string {
    switch (s) {
      case 'DECLARE':  return 's-declare';
      case 'EN_COURS': return 's-encours';
      case 'ACCEPTE':  return 's-accepte';
      case 'REFUSE':   return 's-refuse';
      case 'CLOTURE':  return 's-cloture';
      default:         return 's-declare';
    }
  }

  getStatutIcon(s?: string): string {
    switch (s) {
      case 'DECLARE':  return '📋';
      case 'EN_COURS': return '⏳';
      case 'ACCEPTE':  return '✅';
      case 'REFUSE':   return '❌';
      case 'CLOTURE':  return '🔒';
      default:         return '';
    }
  }

  // ── TYPE ──
  getTypeIcon(type?: string): string {
    if (!type) return '⚠️';
    if (type.includes('AUTO') || type === 'ACCIDENT' || type.includes('DOMMAGES') || type === 'BRIS_DE_GLACE') return '🚗';
    if (type.includes('HABITATION') || type.includes('DEGAT') || type.includes('CATASTROPHE')) return '🏠';
    if (type === 'ANNULATION' || type.includes('VOYAGE') || type === 'PERTE_BAGAGES') return '✈️';
    if (type.includes('HOSPITALISATION') || type.includes('CONSULTATION') || type.includes('MALADIE')) return '🏥';
    if (type === 'VOL') return '🔓';
    if (type.includes('INCENDIE')) return '🔥';
    return '⚠️';
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

  getContratIcon(type?: string): string {
    const icons: any = { AUTO: '🚗', HABITATION: '🏠', SANTE: '🏥', VOYAGE: '✈️' };
    return icons[type || ''] || '📋';
  }

  // ── MONTANTS ──
  getTauxIndemnisation(): number {
    if (!this.sinistre?.montantEstime || !this.sinistre?.montantIndemnisation) return 0;
    return Math.min(100, Math.round((this.sinistre.montantIndemnisation / this.sinistre.montantEstime) * 100));
  }

  // ── GRAVITÉ ──
  getGravite(): number {
    if (!this.sinistre?.montantEstime) return 0;
    if (this.sinistre.montantEstime > 10000) return 90;
    if (this.sinistre.montantEstime > 5000)  return 65;
    if (this.sinistre.montantEstime > 1000)  return 40;
    return 20;
  }

  // ── TIMELINE ÉTAPES ──
  getSteps(): any[] {
    const statut = this.sinistre?.statut || '';
    const order = ['DECLARE', 'EN_COURS', 'ACCEPTE', 'CLOTURE'];
    const currentIndex = order.indexOf(statut);

    const steps = [
      { key: 'DECLARE',  icon: '📋', label: 'Déclaré',    desc: 'Sinistre enregistré' },
      { key: 'EN_COURS', icon: '🔍', label: 'En cours',   desc: 'Expertise en cours' },
      { key: 'ACCEPTE',  icon: '✅', label: 'Accepté',    desc: 'Indemnisation validée' },
      { key: 'CLOTURE',  icon: '🔒', label: 'Clôturé',    desc: 'Dossier fermé' },
    ];

    if (statut === 'REFUSE') {
      return [
        { key: 'DECLARE',  icon: '📋', label: 'Déclaré',   desc: 'Sinistre enregistré',  dotClass: 'dot-done',    textClass: 'tl-done-color' },
        { key: 'EN_COURS', icon: '🔍', label: 'En cours',  desc: 'Expertise réalisée',   dotClass: 'dot-done',    textClass: 'tl-done-color' },
        { key: 'REFUSE',   icon: '❌', label: 'Refusé',    desc: 'Dossier non accepté',  dotClass: 'dot-active',  textClass: 'tl-active-color' },
      ];
    }

    return steps.map((s, i) => ({
      ...s,
      dotClass:  i < currentIndex ? 'dot-done' : i === currentIndex ? 'dot-active' : 'dot-pending',
      textClass: i < currentIndex ? 'tl-done-color' : i === currentIndex ? 'tl-active-color' : 'tl-pending-color',
    }));
  }

  // ── DOCUMENTS ──
  getFileEmoji(fileType?: string): string {
    if (!fileType) return '📄';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📑';
    if (fileType.includes('word')) return '📝';
    return '📄';
  }
}
