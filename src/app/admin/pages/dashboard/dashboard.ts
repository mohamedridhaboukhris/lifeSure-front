/*import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { DashboardService } from '../../../services/dashboard';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  stats: any = {};
  loading = false;
  role: string | null = null;

  isAgentRole = false;
  isExpertRole = false;

  private chartScript: HTMLScriptElement | null = null;
  private pieChart: any = null;
  private barChart: any = null;

  constructor(
    public auth: Auth,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pas de token → redirection login
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = this.auth.getRole();

    // ✅ CLIENT → redirige automatiquement vers "Mes contrats"
    if (this.auth.isClient()) {
      this.router.navigate(['/admin/contrats']);
      return;
    }

    // Rôle invalide → déconnexion
    if (!this.role) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }

    // Détermine le rôle (AGENT ou EXPERT seulement)
    this.isAgentRole = this.auth.isAgent();
    this.isExpertRole = this.auth.isExpert();

    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Pas besoin de Chart.js pour le client (déjà redirigé)
    if (this.auth.isClient()) return;

    if (typeof Chart === 'undefined') {
      this.chartScript = document.createElement('script');
      this.chartScript.src = 'assets/admin/vendor/chart.js/Chart.min.js';
      this.chartScript.onload = () => {
        setTimeout(() => this.initCharts(), 500);
      };
      document.body.appendChild(this.chartScript);
    } else {
      setTimeout(() => this.initCharts(), 500);
    }
  }

  ngOnDestroy(): void {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
  }

  loadStats(): void {
    this.loading = true;

    let request: any;
    if (this.isAgentRole) {
      request = this.dashboardService.getStatsAgent();
    } else if (this.isExpertRole) {
      request = this.dashboardService.getStatsExpert();
    } else {
      this.loading = false;
      return;
    }

    request.subscribe({
      next: (data: any) => {
        this.stats = data;
        this.loading = false;
        if (this.isAgentRole) {
          setTimeout(() => this.initCharts(), 500);
        }
      },
      error: (err: any) => {
        console.error('Erreur dashboard:', err);
        this.loading = false;

        // Si token expiré → déconnexion
        if (err.status === 401 || err.status === 403) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  initCharts(): void {
    if (!this.isAgentRole || !this.stats.contratsParType) return;

    // 🥧 Camembert : Contrats par type
    const pieCanvas = document.getElementById('chartContratsType') as HTMLCanvasElement;
    if (pieCanvas && typeof Chart !== 'undefined') {
      const ctx = pieCanvas.getContext('2d');
      if (this.pieChart) this.pieChart.destroy();
      this.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.stats.contratsParType),
          datasets: [{
            data: Object.values(this.stats.contratsParType),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
          }]
        },
        options: {
          maintainAspectRatio: false,
          legend: { position: 'bottom' }
        }
      });
    }

    // 📊 Barres : Revenus par type
    const barCanvas = document.getElementById('chartRevenusType') as HTMLCanvasElement;
    if (barCanvas && typeof Chart !== 'undefined' && this.stats.revenusParType) {
      const ctx = barCanvas.getContext('2d');
      if (this.barChart) this.barChart.destroy();
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.stats.revenusParType),
          datasets: [{
            label: 'Revenus mensuels (DT)',
            data: Object.values(this.stats.revenusParType),
            backgroundColor: '#4e73df'
          }]
        },
        options: {
          maintainAspectRatio: false,
          legend: { display: false },
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        }
      });
    }
  }
}*/




/*import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { DashboardService } from '../../../services/dashboard';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  stats: any = {};
  loading = false;
  role: string | null = null;

  isAgentRole = false;
  isExpertRole = false;

  private chartScriptLoaded = false;
  private pieChart: any = null;
  private barChart: any = null;
  private expertPieChart: any = null;
private expertBarChart: any = null;















  constructor(
    public auth: Auth,
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef  // ✅ AJOUTÉ
  ) {}




  

  ngOnInit(): void {
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = this.auth.getRole();

    if (this.auth.isClient()) {
      this.router.navigate(['/admin/contrats']);
      return;
    }

    if (!this.role) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.isAgentRole = this.auth.isAgent();
    this.isExpertRole = this.auth.isExpert();

    this.loadChartScript().then(() => {
      this.loadStats();
    });
  }

  ngAfterViewInit(): void {
    // Chart.js sera chargé dans ngOnInit
  }

  ngOnDestroy(): void {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
  }

  // ✅ Charge Chart.js de manière fiable (Promise)
  private loadChartScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof Chart !== 'undefined') {
        this.chartScriptLoaded = true;
        resolve();
        return;
      }

      // Vérifier si le script est déjà en train de charger
      const existingScript = document.querySelector('script[src*="Chart.min.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.chartScriptLoaded = true;
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'assets/admin/vendor/chart.js/Chart.min.js';
      script.onload = () => {
        this.chartScriptLoaded = true;
        console.log('✅ Chart.js chargé');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Impossible de charger Chart.js');
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  loadStats(): void {
    this.loading = true;

    let request: any;
    if (this.isAgentRole) {
      request = this.dashboardService.getStatsAgent();
    } else if (this.isExpertRole) {
      request = this.dashboardService.getStatsExpert();
    } else {
      this.loading = false;
      return;
    }

    request.subscribe({
      next: (data: any) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();  // ✅ AJOUTÉ - rafraîchit l'affichage

        // Attendre que le DOM soit prêt avant de créer les graphiques
        if (this.isAgentRole) {
          setTimeout(() => {
            this.initCharts();
            this.cdr.detectChanges();  // ✅ AJOUTÉ
          }, 300);
        }
      },
      error: (err: any) => {
        console.error('Erreur dashboard:', err);
        this.loading = false;
        this.cdr.detectChanges();

        if (err.status === 401 || err.status === 403) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

 















  initCharts(): void {

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js pas encore chargé');
    return;
  }

  // =========================
  // 🟡 AGENT CHARTS
  // =========================
  if (this.isAgentRole) {

    // 🥧 Contrats par type
    const pieCanvas = document.getElementById('chartContratsType') as HTMLCanvasElement;

    if (pieCanvas && this.stats.contratsParType) {
      const ctx = pieCanvas.getContext('2d');

      if (this.pieChart) this.pieChart.destroy();

      this.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(this.stats.contratsParType),
          datasets: [{
            data: Object.values(this.stats.contratsParType),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: { position: 'bottom' }
        }
      });
    }

    // 📊 Revenus
    const barCanvas = document.getElementById('chartRevenusType') as HTMLCanvasElement;

    if (barCanvas && this.stats.revenusParType) {
      const ctx = barCanvas.getContext('2d');

      if (this.barChart) this.barChart.destroy();

      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(this.stats.revenusParType),
          datasets: [{
            label: 'Revenus (DT)',
            data: Object.values(this.stats.revenusParType),
            backgroundColor: '#4e73df'
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: { display: false },
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        }
      });
    }
  }

  // =========================
  // 🟢 EXPERT CHARTS
  // =========================
  if (this.isExpertRole) {

    // 🥧 Sinistres (attente / acceptés / fraude)
    const expertPie = document.getElementById('chartSinistres') as HTMLCanvasElement;

    if (expertPie) {
      const ctx = expertPie.getContext('2d');

      if (this.expertPieChart) this.expertPieChart.destroy();

      this.expertPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['En attente', 'Acceptés', 'Fraudes'],
          datasets: [{
            data: [
              this.stats.sinistresEnAttente || 0,
              this.stats.sinistresAcceptes || 0,
              this.stats.fraudesDetectees || 0
            ],
            backgroundColor: ['#f6c23e', '#1cc88a', '#e74a3b']

          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { position: 'bottom' }
        }
      });
    }

    // 📊 Indemnisations
    const expertBar = document.getElementById('chartIndemnisation') as HTMLCanvasElement;

    if (expertBar) {
      const ctx = expertBar.getContext('2d');

      if (this.expertBarChart) this.expertBarChart.destroy();

      this.expertBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Indemnisations'],
          datasets: [{
            label: 'Total DT',
            data: [this.stats.totalIndemnisations || 0],
            backgroundColor: '#36b9cc'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: false },
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        }
      });
    }
  }
}

  
}*/














































































































import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../services/auth';
import { DashboardService } from '../../../services/dashboard';

declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  stats: any = {};
  loading = false;
  role: string | null = null;

  isAgentRole = false;
  isExpertRole = false;

  private chartScriptLoaded = false;
  private pieChart: any = null;
  private barChart: any = null;
  private expertPieChart: any = null;
  private expertBarChart: any = null;

  constructor(
    public auth: Auth,
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.auth.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    this.role = this.auth.getRole();

    if (this.auth.isClient()) {
      this.router.navigate(['/admin/contrats']);
      return;
    }

    if (!this.role) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }

    this.isAgentRole = this.auth.isAgent();
    this.isExpertRole = this.auth.isExpert();

    this.loadChartScript().then(() => {
      this.loadStats();
    });
  }

  ngAfterViewInit(): void {
    // Chart.js sera chargé dans ngOnInit
  }











// Ajouter dans DashboardComponent :

getContratsParType(): any[] {
  if (!this.stats.contratsParType) return [];
  return Object.keys(this.stats.contratsParType).map(type => ({
    type,
    icon: type === 'AUTO' ? '🚗' : type === 'HABITATION' ? '🏠' : type === 'VOYAGE' ? '✈️' : '🏥',
    count: this.stats.contratsParType[type],
    revenu: this.stats.revenusParType?.[type] || 0
  }));
}

getTauxAcceptation(): number {
  const total = (this.stats.sinistresAcceptes || 0) + (this.stats.sinistresEnAttente || 0);
  if (total === 0) return 0;
  return Math.round((this.stats.sinistresAcceptes / total) * 100);
}

getTotalSinistres(): number {
  return (this.stats.sinistresAcceptes || 0) + (this.stats.sinistresEnAttente || 0) + (this.stats.fraudesDetectees || 0);
}


getLegendColor(type: string): string {
  const colors: any = {
    'AUTO':      '#b8860b',
    'VOYAGE':    '#d4af37',
    'HABITATION':'#c4a26a',
    'SANTE':     '#1a1a1a'
  };
  return colors[type] || '#d4af37';
}

formatRevenu(val: number): string {
  if (val >= 1000) return (val / 1000).toFixed(1).replace('.0','') + 'k';
  return val.toString();
}



// ── Nouvelles méthodes fraude ──
getFraudColor(score: number): string {
  if (score >= 0.7) return '#ef4444';
  if (score >= 0.4) return '#f59e0b';
  return '#10b981';
}

getFraudBadgeClass(score: number): string {
  if (score >= 0.7) return 'db-fraud-badge-haut';
  if (score >= 0.4) return 'db-fraud-badge-moyen';
  return 'db-fraud-badge-faible';
}

getFraudLabel(score: number): string {
  if (score >= 0.7) return 'Haut';
  if (score >= 0.4) return 'Moyen';
  return 'Faible';
}









  ngOnDestroy(): void {
    if (this.pieChart) this.pieChart.destroy();
    if (this.barChart) this.barChart.destroy();
    if (this.expertPieChart) this.expertPieChart.destroy();
    if (this.expertBarChart) this.expertBarChart.destroy();
  }

  // ✅ Charge Chart.js de manière fiable (Promise)
  private loadChartScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof Chart !== 'undefined') {
        this.chartScriptLoaded = true;
        resolve();
        return;
      }

      // Vérifier si le script est déjà en train de charger
      const existingScript = document.querySelector('script[src*="Chart.min.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.chartScriptLoaded = true;
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'assets/admin/vendor/chart.js/Chart.min.js';
      script.onload = () => {
        this.chartScriptLoaded = true;
        console.log('✅ Chart.js chargé');
        resolve();
      };
      script.onerror = () => {
        console.error('❌ Impossible de charger Chart.js');
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  loadStats(): void {
    this.loading = true;

    let request: any;
    if (this.isAgentRole) {
      request = this.dashboardService.getStatsAgent();
    } else if (this.isExpertRole) {
      request = this.dashboardService.getStatsExpert();
    } else {
      this.loading = false;
      return;
    }

    request.subscribe({
      next: (data: any) => {
        this.stats = data;
        this.loading = false;
        this.cdr.detectChanges();

        // Attendre que le DOM soit prêt avant de créer les graphiques
        if (this.isAgentRole || this.isExpertRole) {
          setTimeout(() => {
            this.initCharts();
            this.cdr.detectChanges();
          }, 300);
        }
      },
      error: (err: any) => {
        console.error('Erreur dashboard:', err);
        this.loading = false;
        this.cdr.detectChanges();

        if (err.status === 401 || err.status === 403) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // ====================================
  // 🎨 INIT CHARTS - THÈME NOIR + OR
  // ====================================
  initCharts(): void {

    if (typeof Chart === 'undefined') {
      console.warn('Chart.js pas encore chargé');
      return;
    }

    // 🎨 PALETTE NOIR + OR PREMIUM
    const PALETTE_OR = ['#d4af37', '#b8860b', '#1a1a1a', '#c4a26a', '#f4d03f', '#8b7355'];

    // =========================
    // 🟡 AGENT CHARTS
    // =========================
    if (this.isAgentRole) {

      // 🥧 Contrats par type (DOUGHNUT)
      const pieCanvas = document.getElementById('chartContratsType') as HTMLCanvasElement;

      if (pieCanvas && this.stats.contratsParType) {
        const ctx = pieCanvas.getContext('2d');

        if (this.pieChart) this.pieChart.destroy();

       /* this.pieChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: Object.keys(this.stats.contratsParType),
            datasets: [{
              data: Object.values(this.stats.contratsParType),
              backgroundColor: PALETTE_OR,
              borderColor: '#ffffff',
              borderWidth: 3
            }]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              position: 'bottom',
              labels: {
                fontColor: '#1a1a1a',
                fontSize: 12,
                padding: 15
              }
            }
          }
        });*/
        this.pieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: Object.keys(this.stats.contratsParType),
    datasets: [{
      data: Object.values(this.stats.contratsParType),
      backgroundColor: PALETTE_OR,
      borderColor: '#ffffff',
      borderWidth: 3
    }]
  },
  options: {
    maintainAspectRatio: false,  // ← important
    responsive: true,
    legend: {
      display: false  // ← désactiver légende Chart.js
    },
    cutoutPercentage: 65,  // ← trou au centre
    layout: {
      padding: 0
    }
  }
});

























        console.log('✅ Pie chart agent créé');
      }

      // 📊 Revenus par type (BAR)
      const barCanvas = document.getElementById('chartRevenusType') as HTMLCanvasElement;

      if (barCanvas && this.stats.revenusParType) {
        const ctx = barCanvas.getContext('2d');

        if (this.barChart) this.barChart.destroy();

        this.barChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(this.stats.revenusParType),
            datasets: [{
              label: 'Revenus (DT)',
              data: Object.values(this.stats.revenusParType),
              backgroundColor: '#d4af37',
              borderColor: '#b8860b',
              borderWidth: 1,
              hoverBackgroundColor: '#f4d03f'
            }]
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: { display: false },
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  fontColor: '#888'
                },
                gridLines: {
                  color: '#f0f0eb'
                }
              }],
              xAxes: [{
                ticks: {
                  fontColor: '#1a1a1a',
                  fontStyle: 'bold'
                },
                gridLines: {
                  display: false
                }
              }]
            }
          }
        });
        console.log('✅ Bar chart agent créé');
      }
    }

    // =========================
    // 🟢 EXPERT CHARTS
    // =========================
    if (this.isExpertRole) {

  // DONUT SINISTRES
  const expertPie = document.getElementById('chartSinistres') as HTMLCanvasElement;
  if (expertPie) {
    const ctx = expertPie.getContext('2d');
    if (this.expertPieChart) this.expertPieChart.destroy();
    this.expertPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Acceptés', 'En attente', 'Fraudes'],
        datasets: [{
          data: [
            this.stats.sinistresAcceptes || 0,
            this.stats.sinistresEnAttente || 0,
            this.stats.fraudesDetectees || 0
          ],
          backgroundColor: ['#10b981', '#d4af37', '#1a1a1a'],
          borderColor: '#ffffff',
          borderWidth: 3
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: { display: false },
        cutoutPercentage: 65
      }
    });
  }













  // BAR INDEMNISATIONS
  const expertBar = document.getElementById('chartIndemnisation') as HTMLCanvasElement;
  if (expertBar) {
    const ctx = expertBar.getContext('2d');
    if (this.expertBarChart) this.expertBarChart.destroy();
    this.expertBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Indemnisations', 'Acceptés', 'En cours'],
        datasets: [{
          data: [
            this.stats.totalIndemnisations || 0,
            this.stats.sinistresAcceptes || 0,
            this.stats.sinistresEnAttente || 0
          ],
          backgroundColor: ['#d4af37', '#f4d03f', '#b8860b'],
          borderColor: '#b8860b',
          borderWidth: 1,
          hoverBackgroundColor: '#f4d03f'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true, fontColor: '#888' }, gridLines: { color: '#f0f0eb' } }],
          xAxes: [{ ticks: { fontColor: '#1a1a1a', fontStyle: 'bold' }, gridLines: { display: false } }]
        }
      }
    });
  }
}
  }

}
























































