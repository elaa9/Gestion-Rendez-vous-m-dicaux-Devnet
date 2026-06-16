from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..database import get_db
from ..schemas import PatientCreate, PatientUpdate, PatientOut
from datetime import datetime

router = APIRouter(prefix="/api/patients", tags=["Patients"])

def serialize_patient(p) -> dict:
    return {
        "id": str(p["_id"]),
        "nom": p["nom"],
        "prenom": p["prenom"],
        "telephone": p["telephone"],
        "email": p["email"],
        "dateNaissance": p["dateNaissance"].isoformat() if isinstance(p["dateNaissance"], datetime) else str(p["dateNaissance"]),
        "adresse": p.get("adresse"),
        "photo": p.get("photo"),
        "nationalite": p.get("nationalite"),
        "createdAt": p.get("createdAt").isoformat() if isinstance(p.get("createdAt"), datetime) else str(p.get("createdAt", ""))
    }

@router.get("")
async def get_patients(search: str = ""):
    db = get_db()
    if search:
        cursor = db.patients.find({
            "$or": [
                {"nom": {"$regex": search, "$options": "i"}},
                {"prenom": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        }).sort("createdAt", -1)
    else:
        cursor = db.patients.find().sort("createdAt", -1)
    patients = await cursor.to_list(length=100)
    return [serialize_patient(p) for p in patients]

@router.get("/{id}")
async def get_patient(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    p = await db.patients.find_one({"_id": ObjectId(id)})
    if not p:
        raise HTTPException(404, "Patient non trouvé")
    return serialize_patient(p)

@router.post("", status_code=201)
async def create_patient(data: PatientCreate):
    db = get_db()
    existing = await db.patients.find_one({"email": data.email})
    if existing:
        raise HTTPException(400, "Cet email est déjà utilisé")
    doc = data.model_dump()
    doc["dateNaissance"] = datetime.combine(data.dateNaissance, datetime.min.time())
    doc["createdAt"] = datetime.utcnow()
    result = await db.patients.insert_one(doc)
    p = await db.patients.find_one({"_id": result.inserted_id})
    return serialize_patient(p)

@router.put("/{id}")
async def update_patient(id: str, data: PatientUpdate):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "Aucune donnée à mettre à jour")
    if "email" in updates:
        existing = await db.patients.find_one({"email": updates["email"], "_id": {"$ne": ObjectId(id)}})
        if existing:
            raise HTTPException(400, "Cet email est déjà utilisé")
    if "dateNaissance" in updates:
        updates["dateNaissance"] = datetime.combine(data.dateNaissance, datetime.min.time())
    await db.patients.update_one({"_id": ObjectId(id)}, {"$set": updates})
    p = await db.patients.find_one({"_id": ObjectId(id)})
    if not p:
        raise HTTPException(404, "Patient non trouvé")
    return serialize_patient(p)

@router.delete("/{id}")
async def delete_patient(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    result = await db.patients.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Patient non trouvé")
    await db.rendezvous.delete_many({"patient": id})
    return {"message": "Patient supprimé"}
