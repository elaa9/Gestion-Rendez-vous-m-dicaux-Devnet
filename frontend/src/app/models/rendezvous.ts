export interface RendezVous {
  id: string;
  patient: string;
  medecin: string;
  patient_nom?: string;
  medecin_nom?: string;
  date: string;
  heure: string;
  motif: string;
  statut: string;
  createdAt?: string;
}

export interface RendezVousCreate {
  patient: string;
  medecin: string;
  date: string;
  heure: string;
  motif: string;
  statut: string;
}
