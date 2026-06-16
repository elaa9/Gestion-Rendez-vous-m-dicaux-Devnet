from fastapi import APIRouter, HTTPException
from bson import ObjectId
from ..database import get_db
from ..schemas import RendezVousCreate, RendezVousUpdate
from datetime import datetime

router = APIRouter(prefix="/api/rendezvous", tags=["Rendez-vous"])

async def enrich_rdv(r) -> dict:
    db = get_db()
    patient = await db.patients.find_one({"_id": ObjectId(r["patient"])}) if ObjectId.is_valid(r["patient"]) else None
    medecin = await db.medecins.find_one({"_id": ObjectId(r["medecin"])}) if ObjectId.is_valid(r["medecin"]) else None
    return {
        "id": str(r["_id"]),
        "patient": r["patient"],
        "medecin": r["medecin"],
        "patient_nom": f"{patient['prenom']} {patient['nom']}" if patient else "Inconnu",
        "medecin_nom": f"{medecin['prenom']} {medecin['nom']} ({medecin['specialite']})" if medecin else "Inconnu",
        "date": r["date"].isoformat() if isinstance(r["date"], datetime) else str(r["date"]),
        "heure": r["heure"],
        "motif": r["motif"],
        "statut": r["statut"],
        "createdAt": r.get("createdAt").isoformat() if isinstance(r.get("createdAt"), datetime) else str(r.get("createdAt", ""))
    }

@router.get("")
async def get_rendezvous(date: str = ""):
    db = get_db()
    query = {}
    if date:
        try:
            date_obj = datetime.strptime(date, "%Y-%m-%d")
            next_date = date_obj.replace(hour=23, minute=59, second=59)
            query["date"] = {"$gte": date_obj, "$lte": next_date}
        except ValueError:
            pass
    cursor = db.rendezvous.find(query).sort("date", -1).sort("heure", -1)
    rdvs = await cursor.to_list(length=200)
    results = []
    for r in rdvs:
        results.append(await enrich_rdv(r))
    return results

@router.get("/{id}")
async def get_rendezvous_by_id(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    r = await db.rendezvous.find_one({"_id": ObjectId(id)})
    if not r:
        raise HTTPException(404, "Rendez-vous non trouvé")
    return await enrich_rdv(r)

@router.post("", status_code=201)
async def create_rendezvous(data: RendezVousCreate):
    db = get_db()
    if not ObjectId.is_valid(data.patient):
        raise HTTPException(400, "ID patient invalide")
    if not ObjectId.is_valid(data.medecin):
        raise HTTPException(400, "ID médecin invalide")
    patient = await db.patients.find_one({"_id": ObjectId(data.patient)})
    if not patient:
        raise HTTPException(404, "Patient non trouvé")
    medecin = await db.medecins.find_one({"_id": ObjectId(data.medecin)})
    if not medecin:
        raise HTTPException(404, "Médecin non trouvé")
    doc = data.model_dump()
    try:
        doc["date"] = datetime.strptime(data.date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, "Format de date invalide (YYYY-MM-DD)")
    doc["createdAt"] = datetime.utcnow()
    result = await db.rendezvous.insert_one(doc)
    r = await db.rendezvous.find_one({"_id": result.inserted_id})
    return await enrich_rdv(r)

@router.put("/{id}")
async def update_rendezvous(id: str, data: RendezVousUpdate):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    updates = {k: v for k, v in data.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(400, "Aucune donnée à mettre à jour")
    if "date" in updates:
        try:
            updates["date"] = datetime.strptime(data.date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(400, "Format de date invalide (YYYY-MM-DD)")
    await db.rendezvous.update_one({"_id": ObjectId(id)}, {"$set": updates})
    r = await db.rendezvous.find_one({"_id": ObjectId(id)})
    if not r:
        raise HTTPException(404, "Rendez-vous non trouvé")
    return await enrich_rdv(r)

@router.delete("/{id}")
async def delete_rendezvous(id: str):
    db = get_db()
    if not ObjectId.is_valid(id):
        raise HTTPException(400, "ID invalide")
    result = await db.rendezvous.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        raise HTTPException(404, "Rendez-vous non trouvé")
    return {"message": "Rendez-vous supprimé"}
