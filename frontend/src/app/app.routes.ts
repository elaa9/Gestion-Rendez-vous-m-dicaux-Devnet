import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patients/patient-list.component';
import { MedecinListComponent } from './components/medecins/medecin-list.component';
import { RendezVousListComponent } from './components/rendezvous/rendezvous-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'patients', component: PatientListComponent },
  { path: 'medecins', component: MedecinListComponent },
  { path: 'rendezvous', component: RendezVousListComponent },
];
