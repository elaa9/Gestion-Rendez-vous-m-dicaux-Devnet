import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { RendezVous, RendezVousCreate } from '../../models/rendezvous';
import { Patient } from '../../models/patient';
import { Medecin } from '../../models/medecin';

@Component({
  selector: 'app-rendezvous-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Rendez-vous</h1>
      <button class="btn-primary" (click)="openCreate()">+ Nouveau Rendez-vous</button>
    </div>

    <div class="search-bar">
      <input class="form-input" type="date" [(ngModel)]="filterDate" (input)="loadRdvs()">
      <button class="btn-danger" *ngIf="filterDate" (click)="filterDate = ''; loadRdvs()" style="padding: 8px 16px;">Réinitialiser</button>
    </div>

    <div class="glass-card" style="overflow: hidden;">
      <table class="data-table">
        <thead>
          <tr><th>Patient</th><th>Médecin</th><th>Date</th><th>Heure</th><th>Motif</th><th>Statut</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of rdvs">
            <td><strong>{{ r.patient_nom }}</strong></td>
            <td>{{ r.medecin_nom }}</td>
            <td>{{ r.date | date:'dd/MM/yyyy' }}</td>
            <td>{{ r.heure }}</td>
            <td>{{ r.motif }}</td>
            <td>
              <select [(ngModel)]="r.statut" (change)="updateStatus(r)" class="form-input" style="padding: 4px 8px; font-size: 12px; width: auto;">
                <option value="Confirmé">Confirmé</option>
                <option value="En attente">En attente</option>
                <option value="Annulé">Annulé</option>
              </select>
            </td>
            <td>
              <button class="btn-danger" style="padding: 6px 12px; font-size: 12px;" (click)="deleteRdv(r.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="rdvs.length === 0" style="text-align: center; padding: 32px; color: #a0aec0;">Aucun rendez-vous trouvé</p>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Nouveau Rendez-vous</h2>
          <button class="modal-close" (click)="showModal = false">&times;</button>
        </div>
        <form (ngSubmit)="createRdv()">
          <div class="form-group">
            <label class="form-label">Patient</label>
            <select class="form-input" [(ngModel)]="form.patient" name="patient" required>
              <option value="">-- Sélectionner --</option>
              <option *ngFor="let p of patients" [value]="p.id">{{ p.nom }} {{ p.prenom }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Médecin</label>
            <select class="form-input" [(ngModel)]="form.medecin" name="medecin" required>
              <option value="">-- Sélectionner --</option>
              <option *ngFor="let m of medecins" [value]="m.id">{{ m.prenom }} {{ m.nom }} - {{ m.specialite }}</option>
            </select>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Date</label>
              <input class="form-input" type="date" [(ngModel)]="form.date" name="date" required>
            </div>
            <div class="form-group">
              <label class="form-label">Heure</label>
              <input class="form-input" type="time" [(ngModel)]="form.heure" name="heure" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Motif</label>
            <input class="form-input" [(ngModel)]="form.motif" name="motif" required>
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;">
            <button type="button" class="btn-danger" (click)="showModal = false">Annuler</button>
            <button type="submit" class="btn-primary">Créer</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RendezVousListComponent implements OnInit {
  rdvs: RendezVous[] = [];
  patients: Patient[] = [];
  medecins: Medecin[] = [];
  showModal = false;
  filterDate = '';
  form: RendezVousCreate = { patient: '', medecin: '', date: '', heure: '', motif: '', statut: 'En attente' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadRdvs();
    this.api.getPatients().subscribe(p => this.patients = p);
    this.api.getMedecins().subscribe(m => this.medecins = m);
  }

  loadRdvs() { this.api.getRendezVous(this.filterDate).subscribe(r => this.rdvs = r); }

  openCreate() {
    this.form = { patient: '', medecin: '', date: '', heure: '', motif: '', statut: 'En attente' };
    this.showModal = true;
  }

  createRdv() {
    this.api.createRendezVous(this.form).subscribe(() => {
      this.showModal = false;
      this.loadRdvs();
    });
  }

  updateStatus(r: RendezVous) {
    this.api.updateRendezVous(r.id, { statut: r.statut }).subscribe();
  }

  deleteRdv(id: string) {
    if (confirm('Supprimer ce rendez-vous ?')) {
      this.api.deleteRendezVous(id).subscribe(() => this.loadRdvs());
    }
  }
}
