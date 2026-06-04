import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicContratService, VerificationContrat } from '../../services/public-contrat';

@Component({
  selector: 'app-verifier-contrat',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verifier-contrat.html',
  styleUrls: ['./verifier-contrat.css']
})
export class VerifierContratComponent implements OnInit {

  loading = true;
  result: VerificationContrat | null = null;
  numeroContrat = '';
  dateVerification = new Date();

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicContratService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.numeroContrat = this.route.snapshot.params['numero'];

    this.publicService.verifierContrat(this.numeroContrat).subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.result = {
          valide: false,
          message: 'Erreur de connexion au serveur'
        };
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  isContratActif(): boolean {
    return this.result?.statut === 'ACTIF';
  }

  isContratExpire(): boolean {
    if (!this.result?.dateFin) return false;
    return new Date(this.result.dateFin) < new Date();
  }
}