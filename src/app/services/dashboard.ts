import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private api = environment.apiUrl + '/api/dashboard';

  constructor(private http: HttpClient) {}






  getStatsClient(): Observable<any> {
    return this.http.get<any>(`${this.api}/client`);
  }

  getStatsAgent(): Observable<any> {
    return this.http.get<any>(`${this.api}/agent`);
  }

  getStatsExpert(): Observable<any> {
    return this.http.get<any>(`${this.api}/expert`);
  }






}