import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface Language {
  code: string;
  name: string;
  flag: string;
  rtl: boolean;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private readonly LANG_KEY = 'app-language';

  languages: Language[] = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', rtl: false },
    { code: 'en', name: 'English',  flag: '🇬🇧', rtl: false },
    { code: 'ar', name: 'العربية',   flag: '🇹🇳', rtl: true }
  ];

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['fr', 'en', 'ar']);
    this.translate.setDefaultLang('fr');

    const saved = this.getCurrentLanguage();
    this.useLanguage(saved.code);
  }

  getCurrentLanguage(): Language {
    const code = localStorage.getItem(this.LANG_KEY) || 'fr';
    return this.languages.find(l => l.code === code) || this.languages[0];
  }

  useLanguage(code: string): void {
    const lang = this.languages.find(l => l.code === code);
    if (!lang) return;

    localStorage.setItem(this.LANG_KEY, code);
    this.translate.use(code);

    // RTL pour l'arabe
    document.documentElement.dir = lang.rtl ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
  }
}