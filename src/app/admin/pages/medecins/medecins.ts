import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedecinService, Medecin } from '../../../services/medecin';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-medecins',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './medecins.html',
  styleUrls: ['./medecins.css']
})
export class MedecinsComponent implements OnInit {

  medecins: Medecin[] = [];
  filteredMedecins: Medecin[] = [];
  loading = false;

  // Filtres
  searchTerm = '';
  filterSpecialite = '';
  filterVille = '';

  // Listes uniques pour les filtres
  specialites: string[] = [];
  villes: string[] = [];

  constructor(
    private medecinService: MedecinService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.medecinService.getAllMedecins().subscribe({
      next: (data) => {
        this.medecins = data;
        this.specialites = [...new Set(data.map(m => m.specialite))].sort();
        this.villes = [...new Set(data.map(m => m.ville))].sort();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let result = [...this.medecins];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(m =>
        m.nom.toLowerCase().includes(term) ||
        m.prenom.toLowerCase().includes(term) ||
        m.specialite.toLowerCase().includes(term) ||
        m.ville.toLowerCase().includes(term)
      );
    }

    if (this.filterSpecialite) {
      result = result.filter(m => m.specialite === this.filterSpecialite);
    }

    if (this.filterVille) {
      result = result.filter(m => m.ville === this.filterVille);
    }

    this.filteredMedecins = result;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterSpecialite = '';
    this.filterVille = '';
    this.applyFilters();
  }

  prendreRdv(medecin: Medecin): void {
    alert(`✅ Demande de RDV envoyée à Dr. ${medecin.prenom} ${medecin.nom}\n\n` +
          `📞 Téléphone : ${medecin.telephone}\n` +
          `📧 Email : ${medecin.email}\n\n` +
          `Le médecin vous contactera sous 24h.`);
  }

  getStars(note: number): string[] {
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 >= 0.5;
    const stars: string[] = [];

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');

    return stars;
  }

  getEconomy(m: Medecin): number {
    return m.tarifNormal - m.tarifPartenaire;
  }

  getEconomyPercent(m: Medecin): number {
    return Math.round(((m.tarifNormal - m.tarifPartenaire) / m.tarifNormal) * 100);
  }
}