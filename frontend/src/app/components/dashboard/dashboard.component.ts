import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <span style="color: #718096; font-size: 14px;">Bienvenue, {{ username }}</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px;">
      <div class="stat-card">
        <div class="stat-label">Patients</div>
        <div class="stat-value">{{ stats.patients }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Médecins</div>
        <div class="stat-value">{{ stats.medecins }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Rendez-vous</div>
        <div class="stat-value">{{ stats.rendezvous }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Confirmés</div>
        <div class="stat-value" style="color: #38a169;">{{ stats.confirmes }}</div>
      </div>
    </div>

    <div class="glass-card" style="padding: 24px;">
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Rendez-vous du jour</h2>
      <table class="data-table" *ngIf="todayRdvs.length > 0">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Médecin</th>
            <th>Heure</th>
            <th>Motif</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of todayRdvs">
            <td><strong>{{ r.patient_nom }}</strong></td>
            <td>{{ r.medecin_nom }}</td>
            <td>{{ r.heure }}</td>
            <td>{{ r.motif }}</td>
            <td><span class="badge badge-{{ r.statut === 'Confirmé' ? 'confirme' : r.statut === 'En attente' ? 'attente' : 'annule' }}">{{ r.statut }}</span></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="todayRdvs.length === 0" style="color: #a0aec0; text-align: center; padding: 32px;">Aucun rendez-vous aujourd'hui</p>
    </div>

    <div style="display: flex; gap: 16px; margin-top: 24px;">
      <button class="btn-primary" (click)="goTo('patients')">Gérer les Patients</button>
      <button class="btn-success" (click)="goTo('medecins')">Gérer les Médecins</button>
      <button class="btn-primary" (click)="goTo('rendezvous')">Voir les Rendez-vous</button>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = { patients: 0, medecins: 0, rendezvous: 0, confirmes: 0 };
  todayRdvs: any[] = [];
  username = localStorage.getItem('username') || '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    const today = new Date().toISOString().split('T')[0];
    this.api.getPatients().subscribe(p => this.stats.patients = p.length);
    this.api.getMedecins().subscribe(m => this.stats.medecins = m.length);
    this.api.getRendezVous(today).subscribe(r => {
      this.todayRdvs = r;
      this.stats.rendezvous = r.length;
      this.stats.confirmes = r.filter(x => x.statut === 'Confirmé').length;
    });
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
