from fastapi import APIRouter, HTTPException, Header
from ..database import get_db
from ..schemas import AuthLogin, AuthRegister
from ..utils import verify_password, get_password_hash, create_access_token, decode_token
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["Authentification"])

@router.post("/login")
async def login(data: AuthLogin):
    db = get_db()
    user = await db.users.find_one({"username": data.username})
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(401, "Identifiants invalides")
    token = create_access_token({"id": str(user["_id"]), "username": user["username"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
        "username": user["username"]
    }

@router.post("/register", status_code=201)
async def register(data: AuthRegister):
    db = get_db()
    existing = await db.users.find_one({"username": data.username})
    if existing:
        raise HTTPException(400, "Ce nom d'utilisateur existe déjà")
    if data.medecinRef and not ObjectId.is_valid(data.medecinRef):
        raise HTTPException(400, "ID médecin invalide")
    doc = {
        "username": data.username,
        "password": get_password_hash(data.password),
        "role": data.role,
        "medecinRef": data.medecinRef,
        "createdAt": datetime.utcnow()
    }
    await db.users.insert_one(doc)
    return {"message": "Utilisateur créé avec succès"}

@router.get("/me")
async def get_me(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(401, "Token manquant")
    token = authorization.replace("Bearer ", "")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(401, "Token invalide")
    return payload
