


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VerificationContrat {
  valide: boolean;
  message?: string;
  numeroContrat?: string;
  typeContrat?: string;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
  primeMensuelle?: number;
  clientNom?: string;
  compagnie?: string;
}

@Injectable({ providedIn: 'root' })
export class PublicContratService {

  private api = environment.apiUrl + '/api/public';

  constructor(private http: HttpClient) {}

  verifierContrat(numero: string): Observable<VerificationContrat> {
    return this.http.get<VerificationContrat>(`${this.api}/contrat/${numero}`);
  }
}