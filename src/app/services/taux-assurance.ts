/*import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TypeContrat } from './contrat';

export interface TauxAssurance {
  id?: number;
  typeContrat: TypeContrat;
  taux: number;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class TauxAssuranceService {

  private api = environment.apiUrl + '/api/taux-assurance';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TauxAssurance[]> {
    return this.http.get<TauxAssurance[]>(this.api);
  }

  setTaux(type: TypeContrat, taux: number): Observable<TauxAssurance> {
    const params = new HttpParams()
      .set('type', type)
      .set('taux', taux.toString());
    return this.http.post<TauxAssurance>(`${this.api}/set`, null, { params });
  }

  ajouter(type: TypeContrat, taux: number): Observable<TauxAssurance> {
    const params = new HttpParams()
      .set('type', type)
      .set('taux', taux.toString());
    return this.http.post<TauxAssurance>(`${this.api}/ajouter`, null, { params });
  }
}*/











import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TypeContrat } from './contrat';

export interface TauxAssurance {
  id?: number;
  typeContrat: TypeContrat;
  taux: number;
  actif: boolean;
}

@Injectable({ providedIn: 'root' })
export class TauxAssuranceService {

  private api = environment.apiUrl + '/api/taux';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TauxAssurance[]> {
    return this.http.get<TauxAssurance[]>(`${this.api}/all`);
  }

  setTaux(type: TypeContrat, taux: number): Observable<TauxAssurance> {

    const body = {
      typeContrat: type,
      taux: taux,
      actif: true
    };

    return this.http.post<TauxAssurance>(
      `${this.api}/set`,
      body
    );
  }

  ajouter(type: TypeContrat, taux: number): Observable<TauxAssurance> {

    const body = {
      typeContrat: type,
      taux: taux,
      actif: true
    };

    return this.http.post<TauxAssurance>(
      `${this.api}/add`,
      body
    );
  }
}