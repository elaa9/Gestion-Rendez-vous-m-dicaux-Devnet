import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "rendez-vous-db")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    existing_admin = await db.users.find_one({"username": "admin"})
    if not existing_admin:
        await db.users.insert_one({
            "username": "admin",
            "password": pwd_context.hash("admin123"),
            "role": "secrétaire",
            "createdAt": __import__('datetime').datetime.utcnow()
        })
        print("✓ Admin créé (admin / admin123)")
    else:
        print("→ Admin existe déjà")

    medecins_count = await db.medecins.count_documents({})
    if medecins_count == 0:
        medecins = [
            {"nom": "Benali", "prenom": "Karim", "specialite": "Cardiologie", "email": "k.benali@med.com", "telephone": "0550123456", "createdAt": __import__('datetime').datetime.utcnow()},
            {"nom": "Mansouri", "prenom": "Leila", "specialite": "Dermatologie", "email": "l.mansouri@med.com", "telephone": "0550654321", "createdAt": __import__('datetime').datetime.utcnow()},
            {"nom": "Touati", "prenom": "Sofiane", "specialite": "Pédiatrie", "email": "s.touati@med.com", "telephone": "0550987654", "createdAt": __import__('datetime').datetime.utcnow()},
            {"nom": "Kaci", "prenom": "Nadia", "specialite": "Gynécologie", "email": "n.kaci@med.com", "telephone": "0550112233", "createdAt": __import__('datetime').datetime.utcnow()},
            {"nom": "Boumediene", "prenom": "Rachid", "specialite": "Ophtalmologie", "email": "r.boumediene@med.com", "telephone": "0550445566", "createdAt": __import__('datetime').datetime.utcnow()},
        ]
        result = await db.medecins.insert_many(medecins)
        print(f"✓ {len(result.inserted_ids)} médecins créés")
    else:
        print(f"→ {medecins_count} médecins existent déjà")

    patients_count = await db.patients.count_documents({})
    if patients_count == 0:
        patients = [
            {"nom": "Amrani", "prenom": "Yasmine", "telephone": "0661122334", "email": "y.amrani@mail.com", "dateNaissance": __import__('datetime').datetime(1990, 4, 15), "adresse": "Alger Centre", "createdAt": __import__('datetime').datetime.utcnow()},
            {"nom": "Ziani", "prenom": "Mohamed", "telephone": "0665566778", "email": "m.ziani@mail.com", "dateNaissance": __import__('datetime').datetime(1985, 8, 22), "adresse": "Bab Ezzouar", "createdAt": __import__('datetime').datetime.utcnow()},
            {"nom": "Haddad", "prenom": "Sara", "telephone": "0669900112", "email": "s.haddad@mail.com", "dateNaissance": __import__('datetime').datetime(2000, 1, 10), "adresse": "Hydra", "createdAt": __import__('datetime').datetime.utcnow()},
        ]
        result = await db.patients.insert_many(patients)
        print(f"✓ {len(result.inserted_ids)} patients créés")
    else:
        print(f"→ {patients_count} patients existent déjà")

    rdv_count = await db.rendezvous.count_documents({})
    if rdv_count == 0:
        all_patients = await db.patients.find().to_list(10)
        all_medecins = await db.medecins.find().to_list(10)
        if all_patients and all_medecins:
            rendezvous = [
                {"patient": str(all_patients[0]["_id"]), "medecin": str(all_medecins[0]["_id"]), "date": __import__('datetime').datetime(2026, 6, 20), "heure": "09:00", "motif": "Consultation cardiaque", "statut": "Confirmé", "createdAt": __import__('datetime').datetime.utcnow()},
                {"patient": str(all_patients[1]["_id"]), "medecin": str(all_medecins[1]["_id"]), "date": __import__('datetime').datetime(2026, 6, 21), "heure": "14:30", "motif": "Examen dermatologique", "statut": "En attente", "createdAt": __import__('datetime').datetime.utcnow()},
            ]
            result = await db.rendezvous.insert_many(rendezvous)
            print(f"✓ {len(result.inserted_ids)} rendez-vous créés")

    client.close()
    print("✅ Base de données initialisée avec succès!")

if __name__ == "__main__":
    asyncio.run(seed())
