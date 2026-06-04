/*import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent implements AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  suggestions = [
    'Quels sont mes contrats ?',
    'Comment déclarer un sinistre ?',
    'Quels types d\'assurance proposez-vous ?',
    'Comment payer ma prime ?'
  ];

  constructor(
    private chatbotService: ChatbotService,
    public auth: Auth
  ) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.welcomeMessage();
    }
  }

  welcomeMessage(): void {
    const name = this.auth.getEmail() ? this.auth.getEmail()?.split('@')[0] : '';
    const welcome = name
      ? `Bonjour ${name} 👋 Je suis LifeBot, l'assistant virtuel de LifeSure. Comment puis-je vous aider ?`
      : `Bonjour 👋 Je suis LifeBot, l'assistant virtuel de LifeSure. Comment puis-je vous aider ?`;

    this.messages.push({
      role: 'bot',
      text: welcome,
      timestamp: new Date()
    });
  }

  send(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    // Ajouter message utilisateur
    this.messages.push({
      role: 'user',
      text: text,
      timestamp: new Date()
    });

    this.userInput = '';
    this.loading = true;

    this.chatbotService.ask(text).subscribe({
      next: (res) => {
        this.messages.push({
          role: 'bot',
          text: res.reply,
          timestamp: new Date()
        });
        this.loading = false;
      },
      error: () => {
        this.messages.push({
          role: 'bot',
          text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          timestamp: new Date()
        });
        this.loading = false;
      }
    });
  }

  sendSuggestion(suggestion: string): void {
    this.userInput = suggestion;
    this.send();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (e) {}
  }

  clearChat(): void {
    this.messages = [];
    this.welcomeMessage();
  }
}*/


import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css']
})
export class ChatbotComponent implements AfterViewChecked {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  loading = false;

  suggestions = [
    'Quels sont mes contrats ?',
    'Comment déclarer un sinistre ?',
    'Quels types d\'assurance proposez-vous ?',
    'Comment payer ma prime ?'
  ];

  constructor(
    private chatbotService: ChatbotService,
    public auth: Auth,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.welcomeMessage();
    }
    this.cdr.detectChanges();  // ✅ AJOUTÉ
  }

  welcomeMessage(): void {
    const name = this.auth.getEmail() ? this.auth.getEmail()?.split('@')[0] : '';
    const welcome = name
      ? `Bonjour ${name} 👋 Je suis LifeBot, l'assistant virtuel de LifeSure. Comment puis-je vous aider ?`
      : `Bonjour 👋 Je suis LifeBot, l'assistant virtuel de LifeSure. Comment puis-je vous aider ?`;

    this.messages.push({
      role: 'bot',
      text: welcome,
      timestamp: new Date()
    });
    this.cdr.detectChanges();  // ✅ AJOUTÉ
  }

  send(): void {
    const text = this.userInput.trim();
    if (!text || this.loading) return;

    // Ajouter message utilisateur
    this.messages.push({
      role: 'user',
      text: text,
      timestamp: new Date()
    });

    this.userInput = '';
    this.loading = true;
    this.cdr.detectChanges();  // ✅ AJOUTÉ - rafraîchit après ajout user message

    this.chatbotService.ask(text).subscribe({
      next: (res) => {
        this.messages.push({
          role: 'bot',
          text: res.reply,
          timestamp: new Date()
        });
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ - rafraîchit après réception réponse
      },
      error: () => {
        this.messages.push({
          role: 'bot',
          text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          timestamp: new Date()
        });
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ
      }
    });
  }

  sendSuggestion(suggestion: string): void {
    this.userInput = suggestion;
    this.send();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (e) {}
  }

  clearChat(): void {
    this.messages = [];
    this.welcomeMessage();
  }
}