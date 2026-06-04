/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  type: string;
  titre: string;
  message: string;
  icone: string;
  couleur: string;
  lien: string;
  lue: boolean;
  dateCreation: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private api = environment.apiUrl + '/api/notifications';

  constructor(private http: HttpClient) {}

  // 📬 Toutes mes notifications
  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.api);
  }

  // 🔔 Compteur non lues
  getCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.api}/count`);
  }

  // ✅ Marquer comme lue
  marquerCommeLue(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.api}/${id}/lue`, {});
  }

  // ✅ Marquer toutes comme lues
  marquerToutesCommeLues(): Observable<any> {
    return this.http.put(`${this.api}/toutes-lues`, {});
  }
}*/


/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  type: string;
  titre: string;
  message: string;
  icone: string;
  couleur: string;
  lien: string;
  lue: boolean;
  dateCreation: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private api = environment.apiUrl + '/api/notifications';

  constructor(private http: HttpClient) {}

  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.api);
  }

  getCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.api}/count`);
  }

  marquerCommeLue(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.api}/${id}/lue`, {});
  }

  marquerToutesCommeLues(): Observable<any> {
    return this.http.put(`${this.api}/toutes-lues`, {});
  }
}*/



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  type: string;
  titre: string;
  message: string;
  icone: string;
  couleur: string;
  lien: string;
  lue: boolean;
  dateCreation: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private api = environment.apiUrl + '/api/notifications';

  constructor(private http: HttpClient) {}

  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.api);
  }

  getCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.api}/count`);
  }

  marquerCommeLue(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.api}/${id}/lue`, {});
  }

  marquerToutesCommeLues(): Observable<any> {
    return this.http.put(`${this.api}/toutes-lues`, {});
  }
}