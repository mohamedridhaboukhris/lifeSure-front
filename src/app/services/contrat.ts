import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type TypeContrat = 'AUTO' | 'HABITATION' | 'SANTE' | 'VOYAGE';
export type StatutContrat = 'EN_ATTENTE_VALIDATION'|'EN_ATTENTE' | 'ACTIF' | 'SUSPENDU' | 'RESILIE' | 'EXPIRE' | 'ANNULE';

export interface Contrat {
  id?: number;
  numeroContrat?: string;
  typeContrat: TypeContrat;
  statut?: StatutContrat;
  dateDebut: string;
  dateFin: string;
  primeMensuelle?: number;
  montantGarantie?: number;
  description?: string;
  dateCreation?: string;
  dateModification?: string;
  actif?: boolean;

// 🆕 Validation
motifRefus?: string;
dateValidation?: string;
agentValidateur?: {
  id: number;
  nom?: string;
  prenom?: string;
};

client?: {
  id: number;
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
};






  // AUTO
  vehiculeMarque?: string;
  vehiculeModele?: string;
  vehiculeImmatriculation?: string;

  // HABITATION
  adresseBien?: string;
  superficieBien?: number;
  typeBien?: string;

  // SANTE
  ageAssure?: number;
  plafondAnnuel?: number;

  // VOYAGE
  destination?: string;
  dureeVoyage?: number;
  plafondAssurance?: number;


 signature?: string;
  dateSignature?: string;




}





// Ajouter cette interface
export interface CarteSante {
  numeroAdherent: string;
  nomComplet: string;
  email: string;
  telephone: string;
  typeContrat: string;
  plafondAnnuel: number;
  plafondUtilise: number;
  plafondRestant: number;
  dateDebut: string;
  dateFin: string;
  statut: string;
  urlVerification: string;
}
















@Injectable({ providedIn: 'root' })
export class ContratService {

  private api = environment.apiUrl + '/api/contrats';

  constructor(private http: HttpClient) {}

  creer(contrat: Contrat): Observable<Contrat> {
    return this.http.post<Contrat>(this.api, contrat);
  }

  getAll(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(this.api);
  }

  getById(id: number): Observable<Contrat> {
    return this.http.get<Contrat>(`${this.api}/${id}`);
  }

  getByClient(clientId: number): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.api}/client/${clientId}`);
  }

  getByType(type: TypeContrat): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.api}/type/${type}`);
  }

  update(id: number, contrat: Contrat): Observable<Contrat> {
    return this.http.put<Contrat>(`${this.api}/${id}`, contrat);
  }

  activer(id: number): Observable<Contrat> {
    return this.http.put<Contrat>(`${this.api}/${id}/activer`, {});
  }

  suspendre(id: number): Observable<Contrat> {
    return this.http.put<Contrat>(`${this.api}/${id}/suspendre`, {});
  }

  resilier(id: number): Observable<Contrat> {
    return this.http.put<Contrat>(`${this.api}/${id}/resilier`, {});
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  statsNombreParType(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.api}/stats/nombre-par-type`);
  }

  statsRevenusParType(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.api}/stats/revenus-par-type`);
  }

getMesContrats(): Observable<Contrat[]> {
  return this.http.get<Contrat[]>(`${this.api}/mes-contrats`);
}

signerContrat(id: number, signature: string): Observable<any> {
  return this.http.post(`${this.api}/${id}/signer`, { signature });
}
// Dans la classe ContratService, ajouter :
getCarteSante(contratId: number): Observable<CarteSante> {
  return this.http.get<CarteSante>(`${this.api}/${contratId}/carte-sante`);
}

























// 🆕 VALIDATION AGENT
getContratsEnAttenteValidation(): Observable<Contrat[]> {
  return this.http.get<Contrat[]>(`${this.api}/en-attente-validation`);
}





  

validerContrat(id: number): Observable<Contrat> {
  return this.http.put<Contrat>(`${this.api}/${id}/valider`, {});
}

refuserContrat(id: number, motif: string): Observable<Contrat> {
  return this.http.put<Contrat>(`${this.api}/${id}/refuser`, { motif });
}







}