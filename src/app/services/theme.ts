import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly THEME_KEY = 'app-theme';

  constructor() {
    this.applyTheme(this.getCurrentTheme());
  }

  getCurrentTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.THEME_KEY) as 'light' | 'dark') || 'light';
  }

  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  isDark(): boolean {
    return this.getCurrentTheme() === 'dark';
  }
}