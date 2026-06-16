import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Patient, PatientCreate } from '../../models/patient';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Patients</h1>
      <button class="btn-primary" (click)="openCreate()">+ Nouveau Patient</button>
    </div>

    <div class="search-bar">
      <input class="form-input" type="text" [(ngModel)]="search" placeholder="Rechercher par nom, prénom ou email..." (input)="loadPatients()">
    </div>

    <div class="glass-card" style="overflow: hidden;">
      <table class="data-table">
        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Téléphone</th><th>Nationalité</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of patients">
            <td><strong>{{ p.nom }}</strong></td>
            <td>{{ p.prenom }}</td>
            <td>{{ p.email }}</td>
            <td>{{ p.telephone }}</td>
            <td>{{ p.nationalite || '-' }}</td>
            <td>
              <button class="btn-primary" style="padding: 6px 12px; font-size: 12px; margin-right: 4px;" (click)="openEdit(p)">Modifier</button>
              <button class="btn-danger" style="padding: 6px 12px; font-size: 12px;" (click)="deletePatient(p.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="patients.length === 0" style="text-align: center; padding: 32px; color: #a0aec0;">Aucun patient trouvé</p>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ editId ? 'Modifier' : 'Nouveau' }} Patient</h2>
          <button class="modal-close" (click)="showModal = false">&times;</button>
        </div>
        <form (ngSubmit)="savePatient()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label class="form-label">Nom</label>
              <input class="form-input" [(ngModel)]="form.nom" name="nom" required>
            </div>
            <div class="form-group">
              <label class="form-label">Prénom</label>
              <input class="form-input" [(ngModel)]="form.prenom" name="prenom" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input class="form-input" type="email" [(ngModel)]="form.email" name="email" required>
            </div>
            <div class="form-group">
              <label class="form-label">Téléphone</label>
              <input class="form-input" [(ngModel)]="form.telephone" name="telephone" required>
            </div>
            <div class="form-group">
              <label class="form-label">Date de naissance</label>
              <input class="form-input" type="date" [(ngModel)]="form.dateNaissance" name="dateNaissance" required>
            </div>
            <div class="form-group">
              <label class="form-label">Nationalité</label>
              <div style="display: flex; gap: 8px;">
                <input class="form-input" [(ngModel)]="form.nationalite" name="nationalite" placeholder="Saisir ou prédire...">
                <button type="button" class="btn-primary" style="padding: 8px 16px; white-space: nowrap;" (click)="predictNationalite()" [disabled]="!form.nom">Prédire</button>
              </div>
              <small *ngIf="prediction" style="color: #718096; font-size: 12px;">Prédiction basée sur le nom: {{ prediction }}</small>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Adresse</label>
            <input class="form-input" [(ngModel)]="form.adresse" name="adresse">
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;">
            <button type="button" class="btn-danger" (click)="showModal = false">Annuler</button>
            <button type="submit" class="btn-primary">{{ editId ? 'Mettre à jour' : 'Créer' }}</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  search = '';
  showModal = false;
  editId = '';
  prediction = '';
  form: PatientCreate = { nom: '', prenom: '', email: '', telephone: '', dateNaissance: '', adresse: '', nationalite: '' };

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadPatients(); }

  loadPatients() { this.api.getPatients(this.search).subscribe(p => this.patients = p); }

  predictNationalite() {
    if (!this.form.nom) return;
    this.api.predictNationality(this.form.nom).subscribe({
      next: (res) => {
        if (res.countries && res.countries.length > 0) {
          this.prediction = res.countries.map((c: any) => `${c.country_name} (${(c.probability * 100).toFixed(0)}%)`).join(', ');
          if (!this.form.nationalite) {
            this.form.nationalite = res.countries[0].country_name;
          }
        }
      },
      error: () => { this.prediction = 'Service indisponible'; }
    });
  }

  openCreate() {
    this.editId = '';
    this.form = { nom: '', prenom: '', email: '', telephone: '', dateNaissance: '', adresse: '', nationalite: '' };
    this.showModal = true;
  }

  openEdit(p: Patient) {
    this.editId = p.id;
    this.form = {
      nom: p.nom, prenom: p.prenom, email: p.email,
      telephone: p.telephone, dateNaissance: p.dateNaissance.split('T')[0],
      adresse: p.adresse || '', nationalite: p.nationalite || ''
    };
    this.showModal = true;
  }

  savePatient() {
    if (this.editId) {
      this.api.updatePatient(this.editId, this.form).subscribe(() => {
        this.showModal = false;
        this.loadPatients();
      });
    } else {
      this.api.createPatient(this.form).subscribe(() => {
        this.showModal = false;
        this.loadPatients();
      });
    }
  }

  deletePatient(id: string) {
    if (confirm('Supprimer ce patient ?')) {
      this.api.deletePatient(id).subscribe(() => this.loadPatients());
    }
  }
}
