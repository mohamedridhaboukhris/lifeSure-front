/*import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContratService, Contrat } from '../../../../services/contrat';
import { Auth } from '../../../../services/auth';
import { PdfService } from '../../../../services/pdf';

@Component({
  selector: 'app-contrats-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contrats-list.html',
  styleUrls: ['./contrats-list.css']
})
export class ContratsListComponent implements OnInit {

  contrats: Contrat[] = [];
  loading = false;
  errorMessage = '';
  isAgent = false;

 constructor(
  private contratService: ContratService,
  private auth: Auth,
  private pdfService: PdfService  // ✅ ajouter
) {}





telechargerAttestation(contratId: number): void {
  this.pdfService.attestation(contratId).subscribe({
    next: (blob) => {
      this.pdfService.downloadBlob(blob, `Attestation_${contratId}.pdf`);
    },
    error: () => alert('Erreur téléchargement')
  });
}

  //ngOnInit(): void {
    //this.isAgent = this.auth.isAgent();
    //this.loadContrats();
 // }









ngOnInit(): void {
  console.log('🎯 TOKEN:', this.auth.getToken()?.substring(0, 50));
  console.log('🎯 ROLE détecté:', this.auth.getRole());
  console.log('🎯 isAgent():', this.auth.isAgent());
  console.log('🎯 isClient():', this.auth.isClient());

  this.isAgent = this.auth.isAgent();
  this.loadContrats();
}






  loadContrats(): void {
    this.loading = true;
    this.errorMessage = '';

    if (this.isAgent) {
      // ✅ AGENT voit TOUS les contrats
      this.contratService.getAll().subscribe({
        next: (data) => {
          this.contrats = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors du chargement des contrats';
          this.loading = false;
        }
      });
    } else {
      // ✅ CLIENT voit SES contrats
      this.contratService.getMesContrats().subscribe({
        next: (data) => {
          this.contrats = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erreur lors du chargement de vos contrats';
          this.loading = false;
        }
      });
    }
  }

  activer(id: number | undefined): void {
    if (!id) return;
    this.contratService.activer(id).subscribe({
      next: () => this.loadContrats(),
      error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
    });
  }

  suspendre(id: number | undefined): void {
    if (!id) return;
    if (confirm('Confirmer la suspension de ce contrat ?')) {
      this.contratService.suspendre(id).subscribe({
        next: () => this.loadContrats(),
        error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
      });
    }
  }

  resilier(id: number | undefined): void {
    if (!id) return;
    if (confirm('Confirmer la résiliation de ce contrat ?')) {
      this.contratService.resilier(id).subscribe({
        next: () => this.loadContrats(),
        error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
      });
    }
  }

  supprimer(id: number | undefined): void {
    if (!id) return;
    if (confirm('Supprimer définitivement ce contrat ?')) {
      this.contratService.supprimer(id).subscribe({
        next: () => this.loadContrats(),
        error: (err) => alert('Erreur : ' + (err.error?.message || err.message))
      });
    }
  }

  getStatutBadge(statut?: string): string {
    switch (statut) {
      case 'ACTIF':      return 'badge-success';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'SUSPENDU':   return 'badge-secondary';
      case 'RESILIE':
      case 'EXPIRE':
      case 'ANNULE':     return 'badge-danger';
      default:           return 'badge-light';
    }
  }
}*/










/*import {  ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContratService, Contrat } from '../../../../services/contrat';
import { Auth } from '../../../../services/auth';
import { PdfService } from '../../../../services/pdf';
import { FormsModule } from '@angular/forms';
import { SignatureModalComponent } from '../../signature-modal/signature-modal';

@Component({
  selector: 'app-contrats-list',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule, SignatureModalComponent],
  templateUrl: './contrats-list.html',
  styleUrls: ['./contrats-list.css']
})
export class ContratsListComponent implements OnInit {

  contrats: Contrat[] = [];
  loading = false;
  errorMessage = '';
  isAgent = false;

  constructor(
    private contratService: ContratService,
    private auth: Auth,
    private pdfService: PdfService,
     private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.isAgent = this.auth.isAgent();
    this.load();
  }

  load(): void {
     this.cdr.detectChanges();
    this.loading = true;
    const request = this.isAgent
      ? this.contratService.getAll()
      : this.contratService.getMesContrats();

    request.subscribe({
      next: (data) => {
        this.contrats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur de chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getStatutBadge(s?: string): string {
    switch (s) {
      case 'ACTIF':       return 'badge-success';
      case 'EN_ATTENTE':  return 'badge-warning';
      case 'SUSPENDU':    return 'badge-info';
      case 'RESILIE':     return 'badge-danger';
      default:            return 'badge-light';
    }
  }

  // ====================================
  // 🛠️ Actions agent
  // ====================================
  activer(id?: number): void {
    if (!id || !confirm('Activer ce contrat ?')) return;
    this.contratService.activer(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  suspendre(id?: number): void {
    if (!id || !confirm('Suspendre ce contrat ?')) return;
    this.contratService.suspendre(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  resilier(id?: number): void {
    if (!id || !confirm('Résilier ce contrat ?')) return;
    this.contratService.resilier(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  supprimer(id?: number): void {
    if (!id || !confirm('Supprimer ce contrat ?')) return;
    this.contratService.supprimer(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  // 📄 Télécharger attestation PDF
  telechargerAttestation(contratId: number): void {
    this.pdfService.attestation(contratId).subscribe({
      next: (blob) => {
        this.pdfService.downloadBlob(blob, `Attestation_${contratId}.pdf`);
      },
      error: () => alert('Erreur téléchargement')
    });
  }




 // 🖊️ Signature
  showSignatureModal = false;
  selectedContratForSignature: any = null;

  ouvrirSignature(contrat: any): void {
    this.selectedContratForSignature = contrat;
    this.showSignatureModal = true;
    this.cdr.detectChanges();
  }

  fermerSignature(): void {
    this.showSignatureModal = false;
    this.selectedContratForSignature = null;
     this.cdr.detectChanges();
  }

  signatureReussie(): void {
    this.showSignatureModal = false;
    this.selectedContratForSignature = null;
    alert('✅ Contrat signé avec succès !');
    this.load(); // Recharger les contrats
  }







}*/






































































































import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContratService, Contrat } from '../../../../services/contrat';
import { Auth } from '../../../../services/auth';
import { PdfService } from '../../../../services/pdf';
import { FormsModule } from '@angular/forms';
import { SignatureModalComponent } from '../../signature-modal/signature-modal';

@Component({
  selector: 'app-contrats-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, SignatureModalComponent],
  templateUrl: './contrats-list.html',
  styleUrls: ['./contrats-list.css']
})
export class ContratsListComponent implements OnInit {

  contrats: Contrat[] = [];
  contratsFiltres: Contrat[] = [];
  loading = false;
  errorMessage = '';
  isAgent = false;

  // 🆕 Filtres
  filtreStatut: string = 'TOUS';

  // 🆕 Modal validation
  showValidationModal = false;
  showRefusModal = false;
  contratSelectionne: Contrat | null = null;
  motifRefus = '';
  motifError = '';
  processing = false;

  // 🆕 Toast
  toast = { show: false, message: '', type: 'success' };

  constructor(
    private contratService: ContratService,
    private auth: Auth,
    private pdfService: PdfService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.isAgent = this.auth.isAgent();
    this.load();
  }

 /* load(): void {
    this.cdr.detectChanges();
    this.loading = true;
    const request = this.isAgent
      ? this.contratService.getAll()
      : this.contratService.getMesContrats();

    request.subscribe({
      next: (data) => {
        this.contrats = data;
        this.appliquerFiltre();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Erreur de chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }*/

load(): void {
  this.cdr.detectChanges();
  this.loading = true;
  const request = this.isAgent
    ? this.contratService.getAll()
    : this.contratService.getMesContrats();

  request.subscribe({
    next: (data) => {
      this.contrats = data.sort((a: any, b: any) => (b.id || 0) - (a.id || 0)); // 🆕 Plus récent en premier
      this.appliquerFiltre();
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.errorMessage = 'Erreur de chargement';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}









  // 🆕 Appliquer filtre
  appliquerFiltre(): void {
    if (this.filtreStatut === 'TOUS') {
      this.contratsFiltres = this.contrats;
    } else {
      this.contratsFiltres = this.contrats.filter(c => c.statut === this.filtreStatut);
    }
    this.cdr.detectChanges();
  }

  changerFiltre(statut: string): void {
    this.filtreStatut = statut;
    this.appliquerFiltre();
  }

  // 🆕 Compteur par statut
  getCountByStatut(statut: string): number {
    if (statut === 'TOUS') return this.contrats.length;
    return this.contrats.filter(c => c.statut === statut).length;
  }

  getStatutBadge(s?: string): string {
    switch (s) {
      case 'ACTIF':                  return 'badge-success';
      case 'EN_ATTENTE_VALIDATION':  return 'badge-validation';
      case 'EN_ATTENTE':             return 'badge-warning';
      case 'SUSPENDU':               return 'badge-info';
      case 'RESILIE':                return 'badge-danger';
      case 'REFUSE':                 return 'badge-refuse';
      default:                       return 'badge-light';
    }
  }

  // 🆕 Label statut
  getStatutLabel(s?: string): string {
    switch (s) {
      case 'EN_ATTENTE_VALIDATION':  return '⏳ À valider';
      case 'EN_ATTENTE':             return '💳 Attente paiement';
      case 'ACTIF':                  return '✅ Actif';
      case 'SUSPENDU':               return '⏸️ Suspendu';
      case 'RESILIE':                return '🚫 Résilié';
      case 'REFUSE':                 return '❌ Refusé';
      default:                       return s || '-';
    }
  }

  // ====================================
  // 🆕 VALIDATION AGENT
  // ====================================
  ouvrirValidation(contrat: Contrat): void {
    this.contratSelectionne = contrat;
    this.showValidationModal = true;
    this.cdr.detectChanges();
  }

  fermerValidation(): void {
    this.showValidationModal = false;
    this.contratSelectionne = null;
    this.cdr.detectChanges();
  }

  accepterContrat(): void {
    if (!this.contratSelectionne?.id) return;

    if (!confirm(`✅ Confirmer l'acceptation du contrat ${this.contratSelectionne.numeroContrat} ?`)) {
      return;
    }

    this.processing = true;
    this.cdr.detectChanges();

    this.contratService.validerContrat(this.contratSelectionne.id).subscribe({
      next: () => {
        this.showToast('✅ Contrat accepté ! Email envoyé au client.', 'success');
        this.processing = false;
        this.fermerValidation();
        this.load();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.showToast('❌ Erreur lors de l\'acceptation', 'error');
        this.processing = false;
        this.cdr.detectChanges();
      }
    });
  }

  ouvrirRefus(): void {
    this.motifRefus = '';
    this.motifError = '';
    this.showRefusModal = true;
    this.cdr.detectChanges();
  }

  fermerRefus(): void {
    this.showRefusModal = false;
    this.motifRefus = '';
    this.motifError = '';
    this.cdr.detectChanges();
  }

  confirmerRefus(): void {
    if (!this.contratSelectionne?.id) return;

    if (!this.motifRefus || this.motifRefus.trim().length < 20) {
      this.motifError = '⚠️ Le motif doit faire au moins 20 caractères';
      this.cdr.detectChanges();
      return;
    }

    this.processing = true;
    this.cdr.detectChanges();

    this.contratService.refuserContrat(this.contratSelectionne.id, this.motifRefus.trim()).subscribe({
      next: () => {
        this.showToast('❌ Contrat refusé. Email envoyé au client.', 'success');
        this.processing = false;
        this.fermerRefus();
        this.fermerValidation();
        this.load();
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.showToast('❌ Erreur lors du refus', 'error');
        this.processing = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 🆕 Toast
  showToast(message: string, type: string = 'success'): void {
    this.toast = { show: true, message, type };
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toast.show = false;
      this.cdr.detectChanges();
    }, 4000);
  }

  // ====================================
  // 🛠️ Actions agent existantes
  // ====================================
  activer(id?: number): void {
    if (!id || !confirm('Activer ce contrat ?')) return;
    this.contratService.activer(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  suspendre(id?: number): void {
    if (!id || !confirm('Suspendre ce contrat ?')) return;
    this.contratService.suspendre(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  resilier(id?: number): void {
    if (!id || !confirm('Résilier ce contrat ?')) return;
    this.contratService.resilier(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  supprimer(id?: number): void {
    if (!id || !confirm('Supprimer ce contrat ?')) return;
    this.contratService.supprimer(id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur')
    });
  }

  // 📄 Télécharger attestation PDF
  telechargerAttestation(contratId: number): void {
    this.pdfService.attestation(contratId).subscribe({
      next: (blob) => {
        this.pdfService.downloadBlob(blob, `Attestation_${contratId}.pdf`);
      },
      error: () => alert('Erreur téléchargement')
    });
  }

  // 🖊️ Signature
  showSignatureModal = false;
  selectedContratForSignature: any = null;

  ouvrirSignature(contrat: any): void {
    this.selectedContratForSignature = contrat;
    this.showSignatureModal = true;
    this.cdr.detectChanges();
  }

  fermerSignature(): void {
    this.showSignatureModal = false;
    this.selectedContratForSignature = null;
    this.cdr.detectChanges();
  }

  signatureReussie(): void {
    this.showSignatureModal = false;
    this.selectedContratForSignature = null;
    alert('✅ Contrat signé avec succès !');
    this.load();
  }

  // 🆕 Helpers
  getTypeIcon(type: string): string {
    const icons: any = { 'AUTO': '🚗', 'HABITATION': '🏠', 'SANTE': '🏥', 'VOYAGE': '✈️' };
    return icons[type] || '📋';
  }

  getTypeColor(type: string): string {
    const colors: any = { 'AUTO': '#3b82f6', 'HABITATION': '#10b981', 'SANTE': '#ef4444', 'VOYAGE': '#f59e0b' };
    return colors[type] || '#6b7280';
  }

  formatDate(date?: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }
}