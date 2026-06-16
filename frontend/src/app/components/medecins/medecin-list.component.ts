import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Medecin, MedecinCreate } from '../../models/medecin';

@Component({
  selector: 'app-medecin-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Médecins</h1>
      <button class="btn-primary" (click)="openCreate()">+ Nouveau Médecin</button>
    </div>

    <div class="glass-card" style="overflow: hidden;">
      <table class="data-table">
        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>Spécialité</th><th>Email</th><th>Téléphone</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let m of medecins">
            <td><strong>{{ m.nom }}</strong></td>
            <td>{{ m.prenom }}</td>
            <td><span class="badge badge-confirme">{{ m.specialite }}</span></td>
            <td>{{ m.email }}</td>
            <td>{{ m.telephone }}</td>
            <td>
              <button class="btn-primary" style="padding: 6px 12px; font-size: 12px; margin-right: 4px;" (click)="openEdit(m)">Modifier</button>
              <button class="btn-danger" style="padding: 6px 12px; font-size: 12px;" (click)="deleteMedecin(m.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="medecins.length === 0" style="text-align: center; padding: 32px; color: #a0aec0;">Aucun médecin trouvé</p>
    </div>

    <div class="modal-overlay" *ngIf="showModal" (click)="showModal = false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ editId ? 'Modifier' : 'Nouveau' }} Médecin</h2>
          <button class="modal-close" (click)="showModal = false">&times;</button>
        </div>
        <form (ngSubmit)="saveMedecin()">
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
              <label class="form-label">Spécialité</label>
              <input class="form-input" [(ngModel)]="form.specialite" name="specialite" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input class="form-input" type="email" [(ngModel)]="form.email" name="email" required>
            </div>
            <div class="form-group" style="grid-column: span 2;">
              <label class="form-label">Téléphone</label>
              <input class="form-input" [(ngModel)]="form.telephone" name="telephone" required>
            </div>
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
export class MedecinListComponent implements OnInit {
  medecins: Medecin[] = [];
  showModal = false;
  editId = '';
  form: MedecinCreate = { nom: '', prenom: '', specialite: '', email: '', telephone: '' };

  constructor(private api: ApiService) {}

  ngOnInit() { this.loadMedecins(); }

  loadMedecins() { this.api.getMedecins().subscribe(m => this.medecins = m); }

  openCreate() {
    this.editId = '';
    this.form = { nom: '', prenom: '', specialite: '', email: '', telephone: '' };
    this.showModal = true;
  }

  openEdit(m: Medecin) {
    this.editId = m.id;
    this.form = { nom: m.nom, prenom: m.prenom, specialite: m.specialite, email: m.email, telephone: m.telephone };
    this.showModal = true;
  }

  saveMedecin() {
    if (this.editId) {
      this.api.updateMedecin(this.editId, this.form).subscribe(() => { this.showModal = false; this.loadMedecins(); });
    } else {
      this.api.createMedecin(this.form).subscribe(() => { this.showModal = false; this.loadMedecins(); });
    }
  }

  deleteMedecin(id: string) {
    if (confirm('Supprimer ce médecin ?')) {
      this.api.deleteMedecin(id).subscribe(() => this.loadMedecins());
    }
  }
}
