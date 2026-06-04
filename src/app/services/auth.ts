import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private api = environment.apiUrl + '/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post<any>(`${this.api}/login`, data);
  }

  register(data: any) {
    return this.http.post(
      `${this.api}/register`,
      data,
      { responseType: 'text' }
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  // ✅ NOUVEAU — Décoder le token pour récupérer le rôle
  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // role dans le token est par ex. "ROLE_CLIENT" ou "ROLE_AGENT"
      const role: string = payload.role || '';
      return role.replace('ROLE_', ''); // → "CLIENT", "AGENT", "EXPERT"
    } catch (e) {
      return null;
    }
  }

  // ✅ NOUVEAU — Récupérer l'email du user connecté
  getEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;  // "sub" = subject = email
    } catch (e) {
      return null;
    }
  }

  // ✅ NOUVEAU — Helpers pratiques
  isClient(): boolean  { return this.getRole() === 'CLIENT'; }
  isAgent(): boolean   { return this.getRole() === 'AGENT'; }
  isExpert(): boolean  { return this.getRole() === 'EXPERT'; }






/*// ✅ NOUVEAU — Récupérer le nom complet du user
getFullName(): string {
  const token = this.getToken();
  if (!token) return 'Utilisateur';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const prenom = payload.prenom || '';
    const nom = payload.nom || '';
    return (prenom + ' ' + nom).trim() || payload.sub || 'Utilisateur';
  } catch (e) {
    return 'Utilisateur';
  }
}

// ✅ NOUVEAU — Récupérer les initiales pour l'avatar
getInitials(): string {
  const fullName = this.getFullName();
  if (fullName === 'Utilisateur') return '?';

  const parts = fullName.split(' ');
  const first = parts[0]?.charAt(0) || '';
  const last = parts[1]?.charAt(0) || '';
  return (first + last).toUpperCase();  
}*/




getFullName(): string {
  const token = this.getToken();
  if (!token) return 'Utilisateur';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const prenom = payload.prenom || '';
    const nom = payload.nom || '';
    const fullName = (prenom + ' ' + nom).trim();
    
    if (fullName) return fullName;
    
    // ✅ Extraire le nom depuis l'email : "aymen@gmail.com" → "aymen"
    const email = payload.sub || '';
    const nameFromEmail = email.split('@')[0] || 'Utilisateur';
    return nameFromEmail;
  } catch (e) {
    return 'Utilisateur';
  }
}

getInitials(): string {
  const token = this.getToken();
  if (!token) return '?';

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const prenom = payload.prenom || '';
    const nom = payload.nom || '';

    if (prenom || nom) {
      const first = prenom.charAt(0) || '';
      const last  = nom.charAt(0)    || '';
      return (first + last).toUpperCase();
    }

    // ✅ Initiale depuis l'email : "aymen@gmail.com" → "A"
    const email = payload.sub || '';
    return email.charAt(0).toUpperCase() || '?';
  } catch (e) {
    return '?';
  }
}









}