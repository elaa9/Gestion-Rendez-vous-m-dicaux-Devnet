import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="glass-nav" *ngIf="isLoggedIn()" style="padding: 12px 24px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 32px;">
        <span style="font-size: 20px; font-weight: 700; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">MedFlow</span>
        <div style="display: flex; gap: 8px;">
          <a routerLink="/dashboard" style="text-decoration: none; color: #4a5568; padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px;">Dashboard</a>
          <a routerLink="/patients" style="text-decoration: none; color: #4a5568; padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px;">Patients</a>
          <a routerLink="/medecins" style="text-decoration: none; color: #4a5568; padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px;">Médecins</a>
          <a routerLink="/rendezvous" style="text-decoration: none; color: #4a5568; padding: 8px 16px; border-radius: 8px; font-weight: 500; font-size: 14px;">Rendez-vous</a>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-size: 13px; color: #718096;">{{ username }}</span>
        <button (click)="logout()" class="btn-danger" style="padding: 6px 16px; font-size: 13px;">Déconnexion</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(private router: Router) {}

  get username(): string {
    return localStorage.getItem('username') || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
