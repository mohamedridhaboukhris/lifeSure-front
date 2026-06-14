import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaiementService, Paiement } from '../../../../services/paiement';
import { PdfService } from '../../../../services/pdf';
import { Auth } from '../../../../services/auth';

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
  isClient = false;

constructor(
  private paiementService: PaiementService,
  private pdfService: PdfService ,
  private cdr: ChangeDetectorRef ,
   private auth: Auth   // ✅ ajouter
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
    this.isClient = this.auth.isClient(); // ← ajouter
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

  


getStatutIcon(statut?: string): string {
  switch (statut) {
    case 'REUSSI':     return '✅';
    case 'EN_ATTENTE': return '⏳';
    case 'ECHOUE':     return '❌';
    default:           return '';
  }
}

getStatutBadge(statut?: string): string {
  switch (statut) {
    case 'REUSSI':     return 's-reussi';
    case 'EN_ATTENTE': return 's-attente';
    case 'ECHOUE':     return 's-echoue';
    default:           return 's-default';
  }
}

getNbReussis():  number { return this.paiements.filter(p => p.statut === 'REUSSI').length; }
getNbAttente():  number { return this.paiements.filter(p => p.statut === 'EN_ATTENTE').length; }
getNbEchoues():  number { return this.paiements.filter(p => p.statut === 'ECHOUE').length; }

getMoisStats() {
  const mois = ['Jan','Fév','Mar','Avr','Mai','Juin'];
  const now = new Date().getMonth();
  return mois.map((lbl, i) => {
    const montant = this.paiements
      .filter(p => p.datePaiement && new Date(p.datePaiement).getMonth() === i)
      .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
    const max = Math.max(...mois.map((_, j) =>
      this.paiements
        .filter(p => p.datePaiement && new Date(p.datePaiement).getMonth() === j)
        .reduce((sum, p) => sum + (Number(p.montant) || 0), 0)
    ), 1);
    return {
      lbl,
      val: montant > 0 ? (montant / 1000).toFixed(1) + 'k' : '0',
      hauteur: Math.max(10, Math.round((montant / max) * 100)),
      actif: i === now
    };
  });
}


















}