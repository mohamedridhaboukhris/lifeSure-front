import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EvenementCalendrier {
  id: number;
  type: string;
  titre: string;
  date: string;
  couleur: string;
  numeroContrat: string;
  typeContrat: string;
  clientNom: string;
  clientEmail: string;
  montant: number;
  statut: string;
  rappelEnvoye: boolean;
}

@Injectable({ providedIn: 'root' })
export class CalendrierService {

  private api = environment.apiUrl + '/api/calendrier';

  constructor(private http: HttpClient) {}

  getEvenements(): Observable<EvenementCalendrier[]> {
    return this.http.get<EvenementCalendrier[]>(this.api);
  }

  envoyerRappel(contratId: number, type: 'PAIEMENT' | 'EXPIRATION'): Observable<string> {
    return this.http.post(`${this.api}/rappel/${contratId}/${type}`, {}, { responseType: 'text' });
  }
}