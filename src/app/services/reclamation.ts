import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type StatutReclamation = 'SOUMISE' | 'EN_COURS' | 'ACCEPTEE' | 'REFUSEE';

export interface Reclamation {
  id?: number;
  sujet: string;
  description: string;
  justification?: string;
  statut?: StatutReclamation;
  dateDepot?: string;
  client?: any;
  agent?: any;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {

  private api = environment.apiUrl + '/api/reclamations';

  constructor(private http: HttpClient) {}

  // 🔵 CLIENT
  soumettre(reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.api}/soumettre`, reclamation);
  }

  getMesReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.api}/mes-reclamations`);
  }

  // 🟢 EXPERT
  getSoumises(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.api}/soumises`);
  }

  traiter(id: number, statut: StatutReclamation, justification: string): Observable<Reclamation> {
    const params = new HttpParams()
      .set('statut', statut)
      .set('justification', justification);
    return this.http.put<Reclamation>(`${this.api}/${id}/traiter`, null, { params });
  }
}