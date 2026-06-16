import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="min-height: 80vh; display: flex; align-items: center; justify-content: center;">
      <div class="glass-card" style="padding: 40px; width: 100%; max-width: 420px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="font-size: 40px; margin-bottom: 8px;">🏥</div>
          <h1 style="font-size: 28px; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MedFlow</h1>
          <p style="color: #718096; font-size: 14px; margin-top: 4px;">Système de Gestion Médicale</p>
        </div>
        <div *ngIf="error" class="glass-card" style="padding: 12px 16px; margin-bottom: 16px; background: #fff5f5; border-color: #feb2b2;">
          <span style="color: #c53030; font-size: 14px;">{{ error }}</span>
        </div>
        <form (ngSubmit)="login()">
          <div class="form-group">
            <label class="form-label">Nom d'utilisateur</label>
            <input class="form-input" type="text" [(ngModel)]="username" name="username" placeholder="admin" required>
          </div>
          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <input class="form-input" type="password" [(ngModel)]="password" name="password" placeholder="••••••" required>
          </div>
          <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; font-size: 16px; margin-top: 8px;" [disabled]="loading">
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private api: ApiService, private router: Router) {}

  login() {
    if (!this.username || !this.password) return;
    this.loading = true;
    this.error = '';
    this.api.login(this.username, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Erreur de connexion';
        this.loading = false;
      }
    });
  }
}
