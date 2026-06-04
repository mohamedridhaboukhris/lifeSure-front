import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PdfService {

  private api = environment.apiUrl + '/api/pdf';

  constructor(private http: HttpClient) {}

  // 📄 Reçu de paiement
  recuPaiement(paiementId: number): Observable<Blob> {
    return this.http.get(`${this.api}/recu/${paiementId}`, {
      responseType: 'blob'
    });
  }

  // 🛡️ Attestation
  attestation(contratId: number): Observable<Blob> {
    return this.http.get(`${this.api}/attestation/${contratId}`, {
      responseType: 'blob'
    });
  }

  // 📋 Rapport de sinistre
  rapportSinistre(sinistreId: number): Observable<Blob> {
    return this.http.get(`${this.api}/sinistre/${sinistreId}`, {
      responseType: 'blob'
    });
  }

  // 🛠️ Helper pour télécharger un Blob
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
