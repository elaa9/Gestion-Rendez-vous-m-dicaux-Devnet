from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date, datetime
from enum import Enum

class StatutRendezVous(str, Enum):
    confirme = "Confirmé"
    en_attente = "En attente"
    annule = "Annulé"

class Role(str, Enum):
    secretaire = "secrétaire"
    medecin = "médecin"

class PatientCreate(BaseModel):
    nom: str
    prenom: str
    telephone: str
    email: EmailStr
    dateNaissance: date
    adresse: Optional[str] = None
    photo: Optional[str] = None
    nationalite: Optional[str] = None

class PatientUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    telephone: Optional[str] = None
    email: Optional[EmailStr] = None
    dateNaissance: Optional[date] = None
    adresse: Optional[str] = None
    photo: Optional[str] = None
    nationalite: Optional[str] = None

class PatientOut(BaseModel):
    id: str
    nom: str
    prenom: str
    telephone: str
    email: str
    dateNaissance: str
    adresse: Optional[str] = None
    photo: Optional[str] = None
    nationalite: Optional[str] = None
    createdAt: Optional[str] = None

class MedecinCreate(BaseModel):
    nom: str
    prenom: str
    specialite: str
    email: EmailStr
    telephone: str

class MedecinUpdate(BaseModel):
    nom: Optional[str] = None
    prenom: Optional[str] = None
    specialite: Optional[str] = None
    email: Optional[EmailStr] = None
    telephone: Optional[str] = None

class MedecinOut(BaseModel):
    id: str
    nom: str
    prenom: str
    specialite: str
    email: str
    telephone: str
    createdAt: Optional[str] = None

class RendezVousCreate(BaseModel):
    patient: str
    medecin: str
    date: str
    heure: str
    motif: str
    statut: StatutRendezVous = StatutRendezVous.en_attente

class RendezVousUpdate(BaseModel):
    patient: Optional[str] = None
    medecin: Optional[str] = None
    date: Optional[str] = None
    heure: Optional[str] = None
    motif: Optional[str] = None
    statut: Optional[StatutRendezVous] = None

class RendezVousOut(BaseModel):
    id: str
    patient: str
    medecin: str
    patient_nom: Optional[str] = None
    medecin_nom: Optional[str] = None
    date: str
    heure: str
    motif: str
    statut: str
    createdAt: Optional[str] = None

class AuthLogin(BaseModel):
    username: str
    password: str

class AuthRegister(BaseModel):
    username: str
    password: str
    role: Role = Role.secretaire
    medecinRef: Optional[str] = None

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
