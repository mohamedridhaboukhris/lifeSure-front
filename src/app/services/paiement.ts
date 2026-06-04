import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Paiement {
  id?: number;
  montant: number;
  datePaiement?: string;
  modePaiement?: string;
  statut?: string;
  contrat?: any;
}

@Injectable({ providedIn: 'root' })
export class PaiementService {

  private api = environment.apiUrl + '/api/paiements';

  constructor(private http: HttpClient) {}

  createPaymentIntent(contratId: number): Observable<any> {
    return this.http.post<any>(`${this.api}/create-payment-intent`, { contratId });
  }

  confirmerPaiement(contratId: number, paymentIntentId: string): Observable<Paiement> {
    const params = new HttpParams().set('paymentIntentId', paymentIntentId);
    return this.http.post<Paiement>(`${this.api}/confirmer/${contratId}`, null, { params });
  }

  mesPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.api}/mes-paiements`);
  }

  getByContrat(contratId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.api}/contrat/${contratId}`);
  }
}