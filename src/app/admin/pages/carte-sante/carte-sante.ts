import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContratService, CarteSante } from '../../../services/contrat';

@Component({
  selector: 'app-carte-sante',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carte-sante.html',
  styleUrls: ['./carte-sante.css']
})
export class CarteSanteComponent implements OnInit {

  contratId!: number;
  carte: CarteSante | null = null;
  loading = false;
  errorMessage = '';
  qrCodeUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratService: ContratService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.contratId = +this.route.snapshot.params['id'];
    this.load();
  }

  load(): void {
    this.loading = true;
    this.contratService.getCarteSante(this.contratId).subscribe({
      next: (data) => {
        this.carte = data;
        // Générer URL QR code via API publique (alternative simple)
        this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.urlVerification)}`;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur de chargement';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPourcentageUtilise(): number {
    if (!this.carte || !this.carte.plafondAnnuel) return 0;
    return Math.round((this.carte.plafondUtilise / this.carte.plafondAnnuel) * 100);
  }

  imprimer(): void {
    window.print();
  }

  retour(): void {
    this.router.navigate(['/admin/contrats']);
  }
}