import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {

  private api = environment.apiUrl + '/api/chatbot';

  constructor(private http: HttpClient) {}

  ask(message: string): Observable<{reply: string}> {
    return this.http.post<{reply: string}>(`${this.api}/ask`, { message });
  }
}