export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  dateNaissance: string;
  adresse?: string;
  photo?: string;
  nationalite?: string;
  createdAt?: string;
}

export interface PatientCreate {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  dateNaissance: string;
  adresse?: string;
  photo?: string;
  nationalite?: string;
}
