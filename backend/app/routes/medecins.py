from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..database import get_db
from ..schemas import MedecinCreate, MedecinUpdate
from datetime import datetime

router = APIRouter(prefix="/api/medecins", tags=["Médecins"])

def serialize_medecin(m) -> dict:
    return {
        "id": str(m["_id"]),
        "nom": m["nom"],
        "prenom": m["prenom"],
        "specialite": m["specialite"],
        "email": m["email"],
        "telephone": m["telephone"],
        "createdAt": m.get("createdAt").isoformat() if isinstance(m.get("createdAt"), datetime) else str(m.get("createdAt", ""))
    }

@router.get("")
async def get_medecins():
    db = get_db()
    cursor = db.medecins.find().sort("nom", 1)
    medecins = await cursor.to_list(length=100)
    return [serialize_medecin(m) for m in medecins]

@router.get("/{id}")
async def get_medecin(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    m = await db.medecins.find_one({"_id": ObjectId(id)})
    if not m:
        raise HTTPException(404, "Médecin non trouvé")
    return serialize_medecin(m)

@router.post("", status_code=201)
async def create_medecin(data: MedecinCreate):
    db = get_db()
    existing = await db.medecins.find_one({"email": data.email})
    if existing:
        raise HTTPException(400, "Cet email est déjà utilisé")
    doc = data.model_dump()
    doc["createdAt"] = datetime.utcnow()
    result = await db.medecins.insert_one(doc)
    m = await db.medecins.find_one({"_id": result.inserted_id})
    return serialize_medecin(m)

@router.put("/{id}")
async def update_medecin(id: str, data: MedecinUpdate):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "Aucune donnée à mettre à jour")
    if "email" in updates:
        existing = await db.medecins.find_one({"email": updates["email"], "_id": {"$ne": ObjectId(id)}})
        if existing:
            raise HTTPException(400, "Cet email est déjà utilisé")
    await db.medecins.update_one({"_id": ObjectId(id)}, {"$set": updates})
    m = await db.medecins.find_one({"_id": ObjectId(id)})
    if not m:
        raise HTTPException(404, "Médecin non trouvé")
    return serialize_medecin(m)

@router.delete("/{id}")
async def delete_medecin(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    result = await db.medecins.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Médecin non trouvé")
    await db.rendezvous.delete_many({"medecin": id})
    return {"message": "Médecin supprimé"}
