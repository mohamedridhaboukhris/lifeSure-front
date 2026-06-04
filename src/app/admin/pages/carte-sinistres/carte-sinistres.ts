/*import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { SinistreService, SinistreCarte } from '../../../services/sinistre';

@Component({
  selector: 'app-carte-sinistres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carte-sinistres.html',
  styleUrls: ['./carte-sinistres.css']
})
export class CarteSinistresComponent implements OnInit, AfterViewInit {

  private map!: L.Map;
  private markers: L.Marker[] = [];

  sinistres: SinistreCarte[] = [];
  filteredSinistres: SinistreCarte[] = [];
  loading = false;

  // Filtres
  filterType = '';
  filterStatut = '';

  // Stats
  stats = {
    total: 0,
    enCours: 0,
    acceptes: 0,
    refuses: 0
  };

  // Types et statuts uniques
  types: string[] = [];
  statuts: string[] = [];

  constructor(
    private sinistreService: SinistreService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadSinistres();
  }

  / Initialise la carte sur la Tunisie
   
  private initMap(): void {
    // Coordonnées centrales de la Tunisie
    const tunisCenter: L.LatLngExpression = [34.0, 9.5];

    this.map = L.map('map').setView(tunisCenter, 7);

    // OpenStreetMap (gratuit)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(this.map);
  }

  
  //  Charge les sinistres et place les marqueurs
 
  loadSinistres(): void {
    this.loading = true;
    this.sinistreService.getSinistresCarte().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.types = [...new Set(data.map(s => s.typeSinistre))];
        this.statuts = [...new Set(data.map(s => s.statut))];
        this.applyFilters();
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement carte', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


   //*Applique les filtres et redessine la carte
 
  applyFilters(): void {
    this.filteredSinistres = this.sinistres.filter(s => {
      if (this.filterType && s.typeSinistre !== this.filterType) return false;
      if (this.filterStatut && s.statut !== this.filterStatut) return false;
      return true;
    });

    this.updateMarkers();
  }


   /* Réinitialise les filtres
 
  resetFilters(): void {
    this.filterType = '';
    this.filterStatut = '';
    this.applyFilters();
  }


   /* Calcule les statistiques
 
  private calculateStats(): void {
    this.stats.total = this.sinistres.length;
    this.stats.enCours = this.sinistres.filter(s =>
      s.statut === 'EN_COURS' || s.statut === 'DECLARE').length;
    this.stats.acceptes = this.sinistres.filter(s => s.statut === 'ACCEPTE').length;
    this.stats.refuses = this.sinistres.filter(s => s.statut === 'REFUSE').length;
  }


   /* Redessine les marqueurs sur la carte
 
  private updateMarkers(): void {
    // Supprimer les anciens marqueurs
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    // Ajouter les nouveaux marqueurs
    this.filteredSinistres.forEach(s => {
      const icon = this.getMarkerIcon(s.statut);

      const marker = L.marker([s.latitude, s.longitude], { icon })
        .addTo(this.map)
        .bindPopup(this.buildPopupContent(s));

      this.markers.push(marker);
    });

    // Ajuster la vue si on a des marqueurs
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

   /* Retourne l'icône colorée selon le statut

  private getMarkerIcon(statut: string): L.DivIcon {
    let color = '#6c757d'; // gris par défaut

    switch (statut) {
      case 'DECLARE':
      case 'EN_COURS':
        color = '#dc3545'; // rouge
        break;
      case 'ACCEPTE':
        color = '#28a745'; // vert
        break;
      case 'REFUSE':
        color = '#343a40'; // noir
        break;
      case 'CLOTURE':
        color = '#17a2b8'; // bleu
        break;
    }

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  }


   /* Construit le HTML du popup
  
  private buildPopupContent(s: SinistreCarte): string {
    const statutColor = this.getStatutColor(s.statut);
    return `
      <div style="min-width: 220px; font-family: Arial, sans-serif;">
        <h6 style="margin: 0 0 10px; color: #4e73df; font-weight: bold;">
          📋 ${s.numeroSinistre}
        </h6>

        <div style="margin-bottom: 8px;">
          <span style="background: ${statutColor}; color: white; padding: 3px 8px;
                border-radius: 4px; font-size: 11px; font-weight: bold;">
            ${s.statut}
          </span>
          <span style="background: #e3f2fd; color: #1976d2; padding: 3px 8px;
                border-radius: 4px; font-size: 11px; margin-left: 5px;">
            ${s.typeSinistre}
          </span>
        </div>

        ${s.clientNom ? `<p style="margin: 4px 0;"><strong>👤</strong> ${s.clientNom}</p>` : ''}
        ${s.numeroContrat ? `<p style="margin: 4px 0;"><strong>📄</strong> ${s.numeroContrat}</p>` : ''}
        ${s.lieuSinistre ? `<p style="margin: 4px 0;"><strong>📍</strong> ${s.lieuSinistre}</p>` : ''}
        <p style="margin: 4px 0;"><strong>📅</strong> ${s.dateSinistre}</p>
        ${s.montantEstime ? `<p style="margin: 4px 0;"><strong>💰</strong> ${s.montantEstime} DT</p>` : ''}

        <p style="margin: 8px 0 4px; font-size: 12px; color: #666;">
          ${s.description ? s.description.substring(0, 100) + (s.description.length > 100 ? '...' : '') : ''}
        </p>
      </div>
    `;
  }

  private getStatutColor(statut: string): string {
    switch (statut) {
      case 'DECLARE':
      case 'EN_COURS': return '#dc3545';
      case 'ACCEPTE': return '#28a745';
      case 'REFUSE': return '#343a40';
      case 'CLOTURE': return '#17a2b8';
      default: return '#6c757d';
    }
  }
}*/
































































import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { SinistreService, SinistreCarte } from '../../../services/sinistre';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-carte-sinistres',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './carte-sinistres.html',
  styleUrls: ['./carte-sinistres.css']
})
export class CarteSinistresComponent implements OnInit, AfterViewInit {

  private map!: L.Map;
  private markers: L.Marker[] = [];

  sinistres: SinistreCarte[] = [];
  filteredSinistres: SinistreCarte[] = [];
  loading = false;

  // Filtres
  filterType = '';
  filterStatut = '';

  // Stats
  stats = {
    total: 0,
    enCours: 0,
    acceptes: 0,
    refuses: 0
  };

  // Types et statuts uniques
  types: string[] = [];
  statuts: string[] = [];

  // 🆕 Focus sur un sinistre spécifique
  focusLat?: number;
  focusLng?: number;
  focusZoom?: number;
  focusSinistreId?: number;

  constructor(
    private sinistreService: SinistreService,
    private router: Router,
    private route: ActivatedRoute,  // 🆕 AJOUT
    private cdr: ChangeDetectorRef,
     public auth: Auth
  ) {}
//hedi alli 3maltha bch l agent w sinistre yarja3 win yheb houa 
get retourLink(): string {
  if (this.auth.isExpert()) {
    return '/admin/sinistres/expert';
  }

  if (this.auth.isAgent()) {
    return '/admin/contrats';
  }

  return '/admin/dashboard';
}


  ngOnInit(): void {
    // 🆕 Lire les query params
    this.route.queryParams.subscribe(params => {
      if (params['lat'] && params['lng']) {
        this.focusLat = parseFloat(params['lat']);
        this.focusLng = parseFloat(params['lng']);
        this.focusZoom = parseInt(params['zoom']) || 16;
        this.focusSinistreId = params['sinistreId'] ? parseInt(params['sinistreId']) : undefined;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadSinistres();
  }

  /**
   * Initialise la carte sur la Tunisie
   */
  private initMap(): void {
    const tunisCenter: L.LatLngExpression = [34.0, 9.5];
    this.map = L.map('map').setView(tunisCenter, 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 18
    }).addTo(this.map);
  }

  /**
   * Charge les sinistres et place les marqueurs
   */
  loadSinistres(): void {
    this.loading = true;
    this.sinistreService.getSinistresCarte().subscribe({
      next: (data) => {
        this.sinistres = data;
        this.types = [...new Set(data.map(s => s.typeSinistre))];
        this.statuts = [...new Set(data.map(s => s.statut))];
        this.applyFilters();
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();

        // 🆕 Si on a un focus sur un sinistre, zoomer dessus
        if (this.focusLat && this.focusLng) {
          setTimeout(() => {
            this.focusOnSinistre();
          }, 500);
        }
      },
      error: (err) => {
        console.error('Erreur chargement carte', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * 🆕 Focus sur un sinistre spécifique
   */
  private focusOnSinistre(): void {
    if (!this.focusLat || !this.focusLng) return;

    // Centrer la carte sur les coordonnées
    this.map.setView([this.focusLat, this.focusLng], this.focusZoom || 16);

    // Trouver le marqueur et ouvrir le popup
    if (this.focusSinistreId) {
      const sinistre = this.filteredSinistres.find(s => s.id === this.focusSinistreId);
      if (sinistre) {
        const marker = this.markers.find(m => {
          const latlng = m.getLatLng();
          return latlng.lat === sinistre.latitude && latlng.lng === sinistre.longitude;
        });
        if (marker) {
          marker.openPopup();
        }
      }
    }
  }

  /**
   * Applique les filtres et redessine la carte
   */
  applyFilters(): void {
    this.filteredSinistres = this.sinistres.filter(s => {
      if (this.filterType && s.typeSinistre !== this.filterType) return false;
      if (this.filterStatut && s.statut !== this.filterStatut) return false;
      return true;
    });

    this.updateMarkers();
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filterType = '';
    this.filterStatut = '';
    // 🆕 Aussi réinitialiser le focus
    this.focusLat = undefined;
    this.focusLng = undefined;
    this.focusSinistreId = undefined;
    this.applyFilters();
    // Revenir à la vue Tunisie complète
    this.map.setView([34.0, 9.5], 7);
  }

  /**
   * Calcule les statistiques
   */
  private calculateStats(): void {
    this.stats.total = this.sinistres.length;
    this.stats.enCours = this.sinistres.filter(s =>
      s.statut === 'EN_COURS' || s.statut === 'DECLARE').length;
    this.stats.acceptes = this.sinistres.filter(s => s.statut === 'ACCEPTE').length;
    this.stats.refuses = this.sinistres.filter(s => s.statut === 'REFUSE').length;
  }

  /**
   * Redessine les marqueurs sur la carte
   */
  private updateMarkers(): void {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    this.filteredSinistres.forEach(s => {
      const icon = this.getMarkerIcon(s.statut);

      const marker = L.marker([s.latitude, s.longitude], { icon })
        .addTo(this.map)
        .bindPopup(this.buildPopupContent(s));

      this.markers.push(marker);
    });

    // 🆕 Si pas de focus, ajuster la vue pour montrer tous les marqueurs
    if (this.markers.length > 0 && !this.focusLat) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  /**
   * Retourne l'icône colorée selon le statut
   */
  /*private getMarkerIcon(statut: string): L.DivIcon {
    let color = '#6c757d';

    switch (statut) {
      case 'DECLARE':
      case 'EN_COURS':
        color = '#dc3545';
        break;
      case 'ACCEPTE':
        color = '#28a745';
        break;
      case 'REFUSE':
        color = '#343a40';
        break;
      case 'CLOTURE':
        color = '#17a2b8';
        break;
    }

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });
  }*/










private getMarkerIcon(statut: string): L.DivIcon {
  let color = '#888';

  switch (statut) {
    case 'DECLARE':
    case 'EN_COURS':
      color = '#d4af37';  // 🆕 OR pour en cours
      break;
    case 'ACCEPTE':
      color = '#f4d03f';  // 🆕 OR clair pour acceptés
      break;
    case 'REFUSE':
      color = '#1a1a1a';  // 🆕 NOIR pour refusés
      break;
    case 'CLOTURE':
      color = '#c4a26a';  // 🆕 BEIGE pour clôturés
      break;
  }

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.25);
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
}













  /**
   * Construit le HTML du popup
   */
 /* private buildPopupContent(s: SinistreCarte): string {
    const statutColor = this.getStatutColor(s.statut);
    return `
      <div style="min-width: 220px; font-family: Arial, sans-serif;">
        <h6 style="margin: 0 0 10px; color: #4e73df; font-weight: bold;">
          📋 ${s.numeroSinistre}
        </h6>

        <div style="margin-bottom: 8px;">
          <span style="background: ${statutColor}; color: white; padding: 3px 8px;
                border-radius: 4px; font-size: 11px; font-weight: bold;">
            ${s.statut}
          </span>
          <span style="background: #e3f2fd; color: #1976d2; padding: 3px 8px;
                border-radius: 4px; font-size: 11px; margin-left: 5px;">
            ${s.typeSinistre}
          </span>
        </div>

        ${s.clientNom ? `<p style="margin: 4px 0;"><strong>👤</strong> ${s.clientNom}</p>` : ''}
        ${s.numeroContrat ? `<p style="margin: 4px 0;"><strong>📄</strong> ${s.numeroContrat}</p>` : ''}
        ${s.lieuSinistre ? `<p style="margin: 4px 0;"><strong>📍</strong> ${s.lieuSinistre}</p>` : ''}
        <p style="margin: 4px 0;"><strong>📅</strong> ${s.dateSinistre}</p>
        ${s.montantEstime ? `<p style="margin: 4px 0;"><strong>💰</strong> ${s.montantEstime} DT</p>` : ''}

        <p style="margin: 8px 0 4px; font-size: 12px; color: #666;">
          ${s.description ? s.description.substring(0, 100) + (s.description.length > 100 ? '...' : '') : ''}
        </p>
      </div>
    `;
  }*/










private buildPopupContent(s: SinistreCarte): string {
  const statutColor = this.getStatutColor(s.statut);
  return `
    <div style="min-width: 220px; font-family: Arial, sans-serif;">
      <h6 style="margin: 0 0 10px; color: #b8860b; font-weight: bold;">
        📋 ${s.numeroSinistre}
      </h6>

      <div style="margin-bottom: 8px;">
        <span style="background: ${statutColor}; color: white; padding: 3px 8px;
              border-radius: 4px; font-size: 11px; font-weight: bold;">
          ${s.statut}
        </span>
        <span style="background: rgba(212, 175, 55, 0.15); color: #b8860b; padding: 3px 8px;
              border-radius: 4px; font-size: 11px; margin-left: 5px;">
          ${s.typeSinistre}
        </span>
      </div>

      ${s.clientNom ? `<p style="margin: 4px 0;"><strong>👤</strong> ${s.clientNom}</p>` : ''}
      ${s.numeroContrat ? `<p style="margin: 4px 0;"><strong>📄</strong> ${s.numeroContrat}</p>` : ''}
      ${s.lieuSinistre ? `<p style="margin: 4px 0;"><strong>📍</strong> ${s.lieuSinistre}</p>` : ''}
      <p style="margin: 4px 0;"><strong>📅</strong> ${s.dateSinistre}</p>
      ${s.montantEstime ? `<p style="margin: 4px 0;"><strong>💰</strong> ${s.montantEstime} DT</p>` : ''}

      <p style="margin: 8px 0 4px; font-size: 12px; color: #666;">
        ${s.description ? s.description.substring(0, 100) + (s.description.length > 100 ? '...' : '') : ''}
      </p>
    </div>
  `;
}













  private getStatutColor(statut: string): string {
  switch (statut) {
    case 'DECLARE':
    case 'EN_COURS': return '#d4af37';
    case 'ACCEPTE':  return '#b8860b';
    case 'REFUSE':   return '#1a1a1a';
    case 'CLOTURE':  return '#c4a26a';
    default:         return '#888';
  }
}
}