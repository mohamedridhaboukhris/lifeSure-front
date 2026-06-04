import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SinistreService, Sinistre, DocumentSinistre } from '../../../../services/sinistre';
import { Auth } from '../../../../services/auth';
import { environment } from '../../../../../environments/environment';
import { PdfService } from '../../../../services/pdf';

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
  apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private sinistreService: SinistreService,
    public auth: Auth,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSinistre(+id);
      this.loadDocuments(+id);
    }
  }

  loadSinistre(id: number): void {
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.sinistreService.getById(id).subscribe({
      next: (data) => {
        this.sinistre = data;
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement du sinistre';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  loadDocuments(id: number): void {
    this.sinistreService.getDocuments(id).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: (err) => {
        console.error('Erreur chargement documents:', err);
      }
    });
  }

  telechargerRapport(sinistreId: number): void {
    this.pdfService.rapportSinistre(sinistreId).subscribe({
      next: (blob) => {
        this.pdfService.downloadBlob(blob, `Rapport_Sinistre_${sinistreId}.pdf`);
      },
      error: () => alert('Erreur téléchargement')
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

  getFileIcon(fileType?: string): string {
    if (!fileType) return 'fa-file';
    if (fileType.startsWith('image/')) return 'fa-file-image';
    if (fileType === 'application/pdf') return 'fa-file-pdf';
    if (fileType.includes('word')) return 'fa-file-word';
    return 'fa-file';
  }
}