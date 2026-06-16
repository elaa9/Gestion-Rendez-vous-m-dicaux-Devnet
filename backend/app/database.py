from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "rendez-vous-db")

client = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    await db.patients.create_index("email", unique=True)
    await db.medecins.create_index("email", unique=True)
    await db.users.create_index("username", unique=True)

async def close_db():
    global client
    if client:
        client.close()

def get_db():
    return db
