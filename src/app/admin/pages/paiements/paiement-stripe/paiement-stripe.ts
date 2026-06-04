/*import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { PaiementService } from '../../../../services/paiement';
import { ContratService, Contrat } from '../../../../services/contrat';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-paiement-stripe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paiement-stripe.html',
  styleUrls: ['./paiement-stripe.css']
})
export class PaiementStripeComponent implements OnInit, AfterViewInit {

  contrat: Contrat | null = null;
  contratId!: number;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;

  clientSecret: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  processing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paiementService: PaiementService,
    private contratService: ContratService
  ) {}

  ngOnInit(): void {
    this.contratId = +this.route.snapshot.paramMap.get('id')!;
    this.loadContrat();
  }

  ngAfterViewInit(): void {
    this.initStripe();
  }

  loadContrat(): void {
    this.contratService.getById(this.contratId).subscribe({
      next: (data) => this.contrat = data,
      error: () => this.errorMessage = 'Erreur chargement contrat'
    });
  }

  async initStripe(): Promise<void> {
    this.loading = true;

    // Charger Stripe.js
    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (!this.stripe) {
      this.errorMessage = 'Impossible de charger Stripe';
      this.loading = false;
      return;
    }

    // Créer le PaymentIntent côté backend
    this.paiementService.createPaymentIntent(this.contratId).subscribe({
      next: (response: any) => {
        this.clientSecret = response.clientSecret;

        // Initialiser Stripe Elements
        this.elements = this.stripe!.elements({ clientSecret: this.clientSecret });
        this.paymentElement = this.elements.create('payment');
        this.paymentElement.mount('#payment-element');
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur initialisation paiement';
        this.loading = false;
      }
    });
  }

  async payer(): Promise<void> {
    if (!this.stripe || !this.elements) return;

    this.processing = true;
    this.errorMessage = '';

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required'
    });

    if (error) {
      this.errorMessage = error.message || 'Erreur lors du paiement';
      this.processing = false;
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Confirmer côté backend
      this.paiementService.confirmerPaiement(this.contratId, paymentIntent.id).subscribe({
        next: () => {
          this.successMessage = '✅ Paiement réussi ! Votre contrat est maintenant ACTIF.';
          this.processing = false;
          setTimeout(() => this.router.navigate(['/admin/paiements']), 2000);
        },
        error: () => {
          this.errorMessage = 'Paiement Stripe OK mais erreur côté serveur';
          this.processing = false;
        }
      });
    }
  }
}*/













import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { PaiementService } from '../../../../services/paiement';
import { ContratService, Contrat } from '../../../../services/contrat';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-paiement-stripe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './paiement-stripe.html',
  styleUrls: ['./paiement-stripe.css']
})
export class PaiementStripeComponent implements OnInit, AfterViewInit {

  contrat: Contrat | null = null;
  contratId!: number;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;

  clientSecret: string = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  processing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paiementService: PaiementService,
    private contratService: ContratService,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngOnInit(): void {
    this.contratId = +this.route.snapshot.paramMap.get('id')!;
    this.loadContrat();
  }

  ngAfterViewInit(): void {
    this.initStripe();
  }

  loadContrat(): void {
    this.contratService.getById(this.contratId).subscribe({
      next: (data) => {
        this.contrat = data;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: () => {
        this.errorMessage = 'Erreur chargement contrat';
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  async initStripe(): Promise<void> {
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (!this.stripe) {
      this.errorMessage = 'Impossible de charger Stripe';
      this.loading = false;
      this.cdr.detectChanges();  // ✅ AJOUTÉ
      return;
    }

    this.paiementService.createPaymentIntent(this.contratId).subscribe({
      next: (response: any) => {
        this.clientSecret = response.clientSecret;

        this.elements = this.stripe!.elements({ clientSecret: this.clientSecret });
        this.paymentElement = this.elements.create('payment');
        this.paymentElement.mount('#payment-element');
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erreur initialisation paiement';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  async payer(): Promise<void> {
    if (!this.stripe || !this.elements) return;

    this.processing = true;
    this.errorMessage = '';
    this.cdr.detectChanges();  // ✅ AJOUTÉ

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required'
    });

    if (error) {
      this.errorMessage = error.message || 'Erreur lors du paiement';
      this.processing = false;
      this.cdr.detectChanges();  // ✅ AJOUTÉ
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.paiementService.confirmerPaiement(this.contratId, paymentIntent.id).subscribe({
        next: () => {
          this.successMessage = '✅ Paiement réussi ! Votre contrat est maintenant ACTIF.';
          this.processing = false;
          this.cdr.detectChanges();  // ✅ AJOUTÉ
          setTimeout(() => this.router.navigate(['/admin/paiements']), 2000);
        },
        error: () => {
          this.errorMessage = 'Paiement Stripe OK mais erreur côté serveur';
          this.processing = false;
          this.cdr.detectChanges();  // ✅ AJOUTÉ
        }
      });
    }
  }
}