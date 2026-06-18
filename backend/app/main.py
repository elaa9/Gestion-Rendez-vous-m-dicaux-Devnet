from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import connect_db, close_db
from .routes import auth, patients, medecins, rendezvous, external

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()

app = FastAPI(
    title="MedFlowApp API",
    description="Système de gestion de rendez-vous médicaux",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(medecins.router)
app.include_router(rendezvous.router)
app.include_router(external.router)

@app.get("/")
async def root():
    return {"message": "API MedFlowApp is running...", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
