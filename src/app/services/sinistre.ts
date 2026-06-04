import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type StatutSinistre = 'DECLARE' | 'EN_COURS' | 'ACCEPTE' | 'REFUSE' | 'CLOTURE';

export type TypeSinistre =
  | 'ACCIDENT' | 'VOL' | 'INCENDIE_AUTO' | 'BRIS_DE_GLACE' | 'DOMMAGES_TOUS_ACCIDENTS'
  | 'INCENDIE_HABITATION' | 'DEGAT_EAUX' | 'VOL_HABITATION' | 'CATASTROPHE_NATURELLE' | 'RESPONSABILITE_CIVILE'
  | 'HOSPITALISATION' | 'CONSULTATION' | 'SOINS_DENTAIRES' | 'MALADIE_GRAVE' | 'PHARMACIE'
  | 'ANNULATION' | 'PERTE_BAGAGES' | 'ACCIDENT_VOYAGE' | 'SOINS_MEDICAUX' | 'RETARD_VOL';

export interface SinistreDTO {
  numeroContrat: string;
  dateSinistre: string;
  description: string;
  typeSinistre: TypeSinistre;
  montantEstime: number;
// 🗺️ AJOUTÉ — Géolocalisation

 latitude?: number;
  longitude?: number;
  lieuSinistre?: string;

}

export interface DocumentSinistre {
  id: number;
  fileName: string;
  fileType: string;
}

export interface Sinistre {
  id?: number;
  numeroSinistre?: string;
  dateSinistre: string;
  description: string;
  statut?: StatutSinistre;
  montantEstime?: number;
  montantIndemnisation?: number;
  dateDeclaration?: string;
  dateCloture?: string;
  typeSinistre: TypeSinistre;
  fraude?: boolean;
  scoreFraude?: number;
  nbSinistresClient?: number;
  delaiDeclaration?: number;
  contrat?: any;
  client?: any;
  agent?: any;
  expert?: any;
  documents?: DocumentSinistre[];
  latitude?: number;
  longitude?: number;
  lieuSinistre?: string;
}

export interface PlafondCheckResponse {
  plafond: number;
  montantDejaPaye: number;
  restant: number;
  message: string;
  depasse: boolean;
}


export interface IaAnalyseResponse {
  success: boolean;
  typeDegat: string;
  gravite: string;
  scoreConfiance: number;
  montantMin: number;
  montantMax: number;
  montantSuggere: number;
  detailsTechniques: string[];
  message: string;
  nbImagesAnalysees: number;
}



export interface SinistreCarte {
  id: number;
  numeroSinistre: string;
  typeSinistre: string;
  statut: string;
  latitude: number;
  longitude: number;
  lieuSinistre: string;
  dateSinistre: string;
  description: string;
  montantEstime: number;
  clientNom?: string;
  numeroContrat?: string;
}









@Injectable({ providedIn: 'root' })
export class SinistreService {

  private api = environment.apiUrl + '/api/sinistres';

  constructor(private http: HttpClient) {}

  // 🔵 CLIENT
  declarer(dto: SinistreDTO, fichiers: File[]): Observable<Sinistre> {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
    if (fichiers && fichiers.length > 0) {
      fichiers.forEach(f => formData.append('fichiers', f));
    }
    return this.http.post<Sinistre>(`${this.api}/declarer`, formData);
  }

  getByClient(clientId: number): Observable<Sinistre[]> {
    return this.http.get<Sinistre[]>(`${this.api}/client/${clientId}`);
  }

  ajouterDocuments(sinistreId: number, files: File[]): Observable<Sinistre> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    return this.http.post<Sinistre>(`${this.api}/${sinistreId}/documents`, formData);
  }

  // 🟡 AGENT
  getAll(): Observable<Sinistre[]> {
    return this.http.get<Sinistre[]>(this.api);
  }

  getDeclares(): Observable<Sinistre[]> {
    return this.http.get<Sinistre[]>(`${this.api}/declares`);
  }

  affecterAgent(sinistreId: number): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.api}/${sinistreId}/affecter-agent`, {});
  }

  affecterExpert(sinistreId: number, expertId: number): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.api}/${sinistreId}/affecter-expert/${expertId}`, {});
  }

  checkPlafond(sinistreId: number): Observable<PlafondCheckResponse> {
    return this.http.get<PlafondCheckResponse>(`${this.api}/${sinistreId}/check-plafond`);
  }

  cloturer(sinistreId: number): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.api}/${sinistreId}/cloturer`, {});
  }

  // 🟢 EXPERT
  getMesSinistres(): Observable<Sinistre[]> {
    return this.http.get<Sinistre[]>(`${this.api}/mes-sinistres`);
  }

  estimerAvecIA(sinistreId: number): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.api}/${sinistreId}/estimer`, {});
  }

  accepter(sinistreId: number, montant: number): Observable<Sinistre> {
    const params = new HttpParams().set('montant', montant.toString());
    return this.http.put<Sinistre>(`${this.api}/${sinistreId}/accepter`, null, { params });
  }

  refuser(sinistreId: number): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.api}/${sinistreId}/refuser`, {});
  }

  // 🔁 COMMUN
  getById(id: number): Observable<Sinistre> {
    return this.http.get<Sinistre>(`${this.api}/${id}`);
  }

  getDocuments(sinistreId: number): Observable<DocumentSinistre[]> {
    return this.http.get<DocumentSinistre[]>(`${this.api}/${sinistreId}/documents`);
  }




getMesSinistresClient(): Observable<Sinistre[]> {
  return this.http.get<Sinistre[]>(`${this.api}/mes-sinistres-client`);
}


analyserAvecIa(sinistreId: number): Observable<IaAnalyseResponse> {
  return this.http.post<IaAnalyseResponse>(
    `${this.api}/${sinistreId}/analyse-ia`, {}
  );
}






// Dans la classe SinistreService
getSinistresCarte(): Observable<SinistreCarte[]> {
  return this.http.get<SinistreCarte[]>(`${this.api}/carte`);
}









}