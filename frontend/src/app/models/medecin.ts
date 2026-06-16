export interface Medecin {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  telephone: string;
  createdAt?: string;
}

export interface MedecinCreate {
  nom: string;
  prenom: string;
  specialite: string;
  email: string;
  telephone: string;
}
