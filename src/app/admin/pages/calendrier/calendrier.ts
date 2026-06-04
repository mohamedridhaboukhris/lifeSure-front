import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendrierService, EvenementCalendrier } from '../../../services/calendrier';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-calendrier',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, RouterModule],
  templateUrl: './calendrier.html',
  styleUrls: ['./calendrier.css']
})
export class CalendrierComponent implements OnInit {

  evenements: EvenementCalendrier[] = [];
  filteredEvenements: EvenementCalendrier[] = [];
  loading = false;

  // Filtres
  filterType: string = '';

  // Stats
  stats = {
    total: 0,
    paiements: 0,
    expirations: 0,
    rappelsEnvoyes: 0
  };

  // Modal
  selectedEvent: EvenementCalendrier | null = null;
  showModal = false;
  loadingRappel = false;

  // Configuration FullCalendar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    locale: 'fr',
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine'
    },
    events: [],
    eventClick: (info: EventClickArg) => this.onEventClick(info),
    height: 'auto',
    dayMaxEvents: 3,
    weekNumbers: false,
    eventDisplay: 'block'
  };

  constructor(
    private calendrierService: CalendrierService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.calendrierService.getEvenements().subscribe({
      next: (data) => {
        this.evenements = data;
        this.applyFilters();
        this.calculateStats();
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
    let result = [...this.evenements];

    if (this.filterType) {
      result = result.filter(e => e.type === this.filterType);
    }

    this.filteredEvenements = result;
    this.updateCalendar();
  }

  resetFilters(): void {
    this.filterType = '';
    this.applyFilters();
  }

  private updateCalendar(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.filteredEvenements.map(e => ({
        id: `${e.type}-${e.id}`,
        title: e.titre,
        date: e.date,
        backgroundColor: e.couleur,
        borderColor: e.couleur,
        textColor: '#ffffff',
        extendedProps: e
      }))
    };
    this.cdr.detectChanges();
  }

  private calculateStats(): void {
    this.stats.total = this.evenements.length;
    this.stats.paiements = this.evenements.filter(e => e.type === 'PAIEMENT').length;
    this.stats.expirations = this.evenements.filter(e => e.type === 'EXPIRATION').length;
    this.stats.rappelsEnvoyes = this.evenements.filter(e => e.rappelEnvoye).length;
  }

  onEventClick(info: EventClickArg): void {
    const event = info.event.extendedProps as EvenementCalendrier;
    this.selectedEvent = event;
    this.showModal = true;
    this.cdr.detectChanges();
  }

  fermerModal(): void {
    this.showModal = false;
    this.selectedEvent = null;
    this.cdr.detectChanges();
  }

  envoyerRappel(): void {
    if (!this.selectedEvent) return;

    this.loadingRappel = true;
    this.cdr.detectChanges();

    const type = this.selectedEvent.type as 'PAIEMENT' | 'EXPIRATION';
    const contratId = this.selectedEvent.id;

    this.calendrierService.envoyerRappel(contratId, type).subscribe({
      next: (msg) => {
        alert(msg);
        this.loadingRappel = false;
        this.fermerModal();
        this.load();
      },
      error: (err) => {
        alert('❌ Erreur : ' + (err.error?.message || err.message));
        this.loadingRappel = false;
        this.cdr.detectChanges();
      }
    });
  }
}