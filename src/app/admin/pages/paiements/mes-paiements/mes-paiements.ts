import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaiementService, Paiement } from '../../../../services/paiement';
import { PdfService } from '../../../../services/pdf';

@Component({
  selector: 'app-mes-paiements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mes-paiements.html',
  styleUrls: ['./mes-paiements.css']
})
export class MesPaiementsComponent implements OnInit {

  paiements: Paiement[] = [];
  loading = false;

constructor(
  private paiementService: PaiementService,
  private pdfService: PdfService ,
  private cdr: ChangeDetectorRef // ✅ ajouter
) {}


telechargerRecu(paiementId: number): void {
  this.pdfService.recuPaiement(paiementId).subscribe({
    next: (blob) => {
      this.pdfService.downloadBlob(blob, `Recu_Paiement_${paiementId}.pdf`);
    },
    error: () => alert('Erreur téléchargement')
  });
}



  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();
    this.paiementService.mesPaiements().subscribe({
      next: (data) => {
        // Trier par date la plus récente en premier
        this.paiements = data.sort((a: any, b: any) => {
          return new Date(b.datePaiement || 0).getTime() - new Date(a.datePaiement || 0).getTime();
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement paiements:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  total(): number {
    return this.paiements.reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
  }

  dernierPaiement(): string {
    if (this.paiements.length === 0) return '—';
    return this.paiements[0].datePaiement || '—';
  }

  getStatutBadge(statut?: string): string {
    switch (statut) {
      case 'REUSSI':     return 'badge-success';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'ECHOUE':     return 'badge-danger';
      default:           return 'badge-light';
    }
  }
}