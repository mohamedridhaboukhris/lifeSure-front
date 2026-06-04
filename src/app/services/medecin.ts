import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Medecin {
  id: number;
  nom: string;
  prenom: string;
  specialite: string;
  ville: string;
  adresse: string;
  telephone: string;
  email: string;
  tarifNormal: number;
  tarifPartenaire: number;
  note: number;
  nbAvis: number;
  description: string;
  horaires: string;
  actif: boolean;
  conventionne: boolean;
}

@Injectable({ providedIn: 'root' })
export class MedecinService {

  private api = environment.apiUrl + '/api/medecins';

  constructor(private http: HttpClient) {}

  getAllMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(this.api);
  }

  getMedecinById(id: number): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.api}/${id}`);
  }
}