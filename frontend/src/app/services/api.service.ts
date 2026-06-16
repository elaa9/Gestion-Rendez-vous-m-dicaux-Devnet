import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient, PatientCreate } from '../models/patient';
import { Medecin, MedecinCreate } from '../models/medecin';
import { RendezVous, RendezVousCreate } from '../models/rendezvous';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.api}/api/auth/login`, { username, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.api}/api/auth/register`, data);
  }

  getPatients(search?: string): Observable<Patient[]> {
    const params = search ? `?search=${search}` : '';
    return this.http.get<Patient[]>(`${this.api}/api/patients${params}`, { headers: this.getHeaders() });
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.api}/api/patients/${id}`, { headers: this.getHeaders() });
  }

  createPatient(data: PatientCreate): Observable<Patient> {
    return this.http.post<Patient>(`${this.api}/api/patients`, data, { headers: this.getHeaders() });
  }

  updatePatient(id: string, data: any): Observable<Patient> {
    return this.http.put<Patient>(`${this.api}/api/patients/${id}`, data, { headers: this.getHeaders() });
  }

  deletePatient(id: string): Observable<any> {
    return this.http.delete(`${this.api}/api/patients/${id}`, { headers: this.getHeaders() });
  }

  getMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.api}/api/medecins`, { headers: this.getHeaders() });
  }

  getMedecin(id: string): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.api}/api/medecins/${id}`, { headers: this.getHeaders() });
  }

  createMedecin(data: MedecinCreate): Observable<Medecin> {
    return this.http.post<Medecin>(`${this.api}/api/medecins`, data, { headers: this.getHeaders() });
  }

  updateMedecin(id: string, data: any): Observable<Medecin> {
    return this.http.put<Medecin>(`${this.api}/api/medecins/${id}`, data, { headers: this.getHeaders() });
  }

  deleteMedecin(id: string): Observable<any> {
    return this.http.delete(`${this.api}/api/medecins/${id}`, { headers: this.getHeaders() });
  }

  getRendezVous(date?: string): Observable<RendezVous[]> {
    const params = date ? `?date=${date}` : '';
    return this.http.get<RendezVous[]>(`${this.api}/api/rendezvous${params}`, { headers: this.getHeaders() });
  }

  getRendezVousById(id: string): Observable<RendezVous> {
    return this.http.get<RendezVous>(`${this.api}/api/rendezvous/${id}`, { headers: this.getHeaders() });
  }

  createRendezVous(data: RendezVousCreate): Observable<RendezVous> {
    return this.http.post<RendezVous>(`${this.api}/api/rendezvous`, data, { headers: this.getHeaders() });
  }

  updateRendezVous(id: string, data: any): Observable<RendezVous> {
    return this.http.put<RendezVous>(`${this.api}/api/rendezvous/${id}`, data, { headers: this.getHeaders() });
  }

  deleteRendezVous(id: string): Observable<any> {
    return this.http.delete(`${this.api}/api/rendezvous/${id}`, { headers: this.getHeaders() });
  }

  predictNationality(name: string): Observable<any> {
    return this.http.get(`${this.api}/api/external/predict/${name}`, { headers: this.getHeaders() });
  }
}
