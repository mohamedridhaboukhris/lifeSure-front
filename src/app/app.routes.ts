/*import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

// Admin
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout';
import { DashboardComponent } from './admin/pages/dashboard/dashboard';
import { UsersComponent } from './admin/pages/users/users';
import { TablesComponent } from './admin/pages/tables/tables';
import { ChartsComponent } from './admin/pages/charts/charts';
import { ContratsListComponent } from './admin/pages/contrats/contrats-list/contrats-list';
import { ContratFormComponent } from './admin/pages/contrats/contrat-form/contrat-form';
import { TauxComponent } from './admin/pages/taux/taux';

// Guard
import { authGuard } from './guards/auth-guard';
import { SinistresListComponent } from './admin/pages/sinistres/sinistres-list/sinistres-list';
import { SinistreFormComponent } from './admin/pages/sinistres/sinistre-form/sinistre-form';
import { SinistresAgentComponent } from './admin/pages/sinistres/sinistres-agent/sinistres-agent';
import { SinistresExpertComponent } from './admin/pages/sinistres/sinistres-expert/sinistres-expert';
import { SinistreDetailComponent } from './admin/pages/sinistres/sinistre-detail/sinistre-detail';
import { ReclamationsListComponent } from './admin/pages/reclamations/reclamations-list/reclamations-list';
import { ReclamationFormComponent } from './admin/pages/reclamations/reclamation-form/reclamation-form';
import { ReclamationsExpertComponent } from './admin/pages/reclamations/reclamations-expert/reclamations-expert';
import { MesPaiementsComponent } from './admin/pages/paiements/mes-paiements/mes-paiements';
import { PaiementStripeComponent } from './admin/pages/paiements/paiement-stripe/paiement-stripe';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

 

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'charts', component: ChartsComponent },

      // ✅ Contrats
      { path: 'contrats', component: ContratsListComponent },
      { path: 'contrats/nouveau', component: ContratFormComponent },
      { path: 'contrats/edit/:id', component: ContratFormComponent },

      // ✅ Taux
      { path: 'taux', component: TauxComponent },



// Dans children de 'admin'
{ path: 'sinistres', component: SinistresListComponent },       // CLIENT
{ path: 'sinistres/declarer', component: SinistreFormComponent },
{ path: 'sinistres/agent', component: SinistresAgentComponent }, // AGENT
{ path: 'sinistres/expert', component: SinistresExpertComponent }, // EXPERT
{ path: 'sinistres/:id', component: SinistreDetailComponent }, //Client


{ path: 'reclamations', component: ReclamationsListComponent },       // CLIENT
{ path: 'reclamations/nouvelle', component: ReclamationFormComponent },
{ path: 'reclamations/expert', component: ReclamationsExpertComponent }, // EXPERT
{ path: 'paiements', component: MesPaiementsComponent },
{ path: 'paiements/payer/:id', component: PaiementStripeComponent },
    ]
  },

  { path: '**', redirectTo: 'home' }
];
*/














import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

// Admin
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout';
import { DashboardComponent } from './admin/pages/dashboard/dashboard';
import { UsersComponent } from './admin/pages/users/users';
import { TablesComponent } from './admin/pages/tables/tables';
import { ChartsComponent } from './admin/pages/charts/charts';
import { ContratsListComponent } from './admin/pages/contrats/contrats-list/contrats-list';
import { ContratFormComponent } from './admin/pages/contrats/contrat-form/contrat-form';
import { TauxComponent } from './admin/pages/taux/taux';

// Guard
import { authGuard } from './guards/auth-guard';
import { SinistresListComponent } from './admin/pages/sinistres/sinistres-list/sinistres-list';
import { SinistreFormComponent } from './admin/pages/sinistres/sinistre-form/sinistre-form';
import { SinistresAgentComponent } from './admin/pages/sinistres/sinistres-agent/sinistres-agent';
import { SinistresExpertComponent } from './admin/pages/sinistres/sinistres-expert/sinistres-expert';
import { SinistreDetailComponent } from './admin/pages/sinistres/sinistre-detail/sinistre-detail';
import { ReclamationsListComponent } from './admin/pages/reclamations/reclamations-list/reclamations-list';
import { ReclamationFormComponent } from './admin/pages/reclamations/reclamation-form/reclamation-form';
import { ReclamationsExpertComponent } from './admin/pages/reclamations/reclamations-expert/reclamations-expert';
import { MesPaiementsComponent } from './admin/pages/paiements/mes-paiements/mes-paiements';
import { PaiementStripeComponent } from './admin/pages/paiements/paiement-stripe/paiement-stripe';



import { ClientLayoutComponent } from './admin/layout/client-layout/client-layout';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ✅ NOUVEAU : Page publique de vérification de contrat (QR Code)
  // Accessible sans authentification (utilisée par le QR code des attestations)
  {
    path: 'verifier-contrat/:numero',
    loadComponent: () => import('./pages/verifier-contrat/verifier-contrat')
      .then(m => m.VerifierContratComponent)
  },

{
  path: 'admin/carte-sinistres',
  loadComponent: () => import('./admin/pages/carte-sinistres/carte-sinistres')
    .then(m => m.CarteSinistresComponent),
  canActivate: [authGuard]
},




{
  path: 'admin/medecins',
  loadComponent: () => import('./admin/pages/medecins/medecins').then(m => m.MedecinsComponent),
  canActivate: [authGuard]
},
{
  path: 'admin/carte-sante/:id',
  loadComponent: () => import('./admin/pages/carte-sante/carte-sante').then(m => m.CarteSanteComponent),
  canActivate: [authGuard]
},

{
  path: 'admin/calendrier',
  loadComponent: () => import('./admin/pages/calendrier/calendrier').then(m => m.CalendrierComponent),
  canActivate: [authGuard]
},









  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'charts', component: ChartsComponent },

      // ✅ Contrats
      { path: 'contrats', component: ContratsListComponent },
      { path: 'contrats/nouveau', component: ContratFormComponent },
      { path: 'contrats/edit/:id', component: ContratFormComponent },

      // ✅ Taux
      { path: 'taux', component: TauxComponent },

      // ✅ Sinistres
      { path: 'sinistres', component: SinistresListComponent },         // CLIENT
      { path: 'sinistres/declarer', component: SinistreFormComponent },
      { path: 'sinistres/agent', component: SinistresAgentComponent },   // AGENT
      { path: 'sinistres/expert', component: SinistresExpertComponent }, // EXPERT
      { path: 'sinistres/:id', component: SinistreDetailComponent },     // CLIENT

      // ✅ Réclamations
      { path: 'reclamations', component: ReclamationsListComponent },         // CLIENT
      { path: 'reclamations/nouvelle', component: ReclamationFormComponent },
      { path: 'reclamations/expert', component: ReclamationsExpertComponent }, // EXPERT

      // ✅ Paiements
      { path: 'paiements', component: MesPaiementsComponent },
      { path: 'paiements/payer/:id', component: PaiementStripeComponent },
    ]
  },
































{
    path: 'client',
    component: ClientLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'contrats', pathMatch: 'full' },
      { path: 'contrats',     component: ContratsListComponent },
      { path: 'sinistres',    component: SinistresListComponent },
      { path: 'sinistres/declarer', component: SinistreFormComponent },
      { path: 'sinistres/:id', component: SinistreDetailComponent },
      { path: 'paiements',    component: MesPaiementsComponent },
      { path: 'paiements/payer/:id', component: PaiementStripeComponent },
      { path: 'reclamations', component: ReclamationsListComponent },
      { path: 'reclamations/nouvelle', component: ReclamationFormComponent },
      { path: 'medecins',     loadComponent: () => import('./admin/pages/medecins/medecins').then(m => m.MedecinsComponent) },
      { path: 'carte-sante/:id', loadComponent: () => import('./admin/pages/carte-sante/carte-sante').then(m => m.CarteSanteComponent) },

      { path: 'contrats/nouveau', component: ContratFormComponent },
      { path: 'contrats/edit/:id', component: ContratFormComponent },
      
    ]
  },

















  { path: '**', redirectTo: 'home' }
];