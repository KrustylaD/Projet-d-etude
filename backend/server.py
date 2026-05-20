from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# LLM API Key
LLM_API_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============= MODELS =============

class UserCreate(BaseModel):
    email: str
    password: str
    display_name: str
    phone_number: Optional[str] = None
    farm_name: Optional[str] = None
    location: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    phone_number: Optional[str] = None
    farm_name: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str

class UserResponse(BaseModel):
    uid: str
    email: str
    display_name: str
    phone_number: Optional[str] = None
    farm_name: Optional[str] = None
    location: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime

class MessageCreate(BaseModel):
    role: str  # "user" or "assistant" or "diagnosis"
    content: str

class DiagnosticCreate(BaseModel):
    culture: str
    symptoms: str
    location: Optional[str] = None
    image_base64: Optional[str] = None

class DiagnosticResponse(BaseModel):
    id: str
    user_id: str
    culture: str
    symptoms: str
    diagnosis: Optional[str] = None
    probability: Optional[float] = None
    treatment: Optional[str] = None
    status: str  # "en cours", "traité", "surveillance"
    location: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class AlertCreate(BaseModel):
    type: str  # "maladie", "météo", "recommandation", "système"
    message: str
    severity: str  # "info", "warning", "critical"

class AlertResponse(BaseModel):
    id: str
    user_id: str
    type: str
    message: str
    severity: str
    read: bool
    created_at: datetime

class ChatRequest(BaseModel):
    diagnostic_id: str
    message: str
    image_base64: Optional[str] = None  # Image plante en base64 (sans préfixe data:)

class ChatResponse(BaseModel):
    role: str
    content: str
    image_base64: Optional[str] = None
    created_at: datetime

# ============= AUTH ENDPOINTS =============

@api_router.post("/auth/signup", response_model=UserResponse)
async def signup(user_data: UserCreate):
    """Créer un nouvel utilisateur"""
    try:
        # Vérifier si l'email existe déjà
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        # Créer le document utilisateur
        user_dict = {
            "uid": str(uuid.uuid4()),
            "email": user_data.email,
            "password": user_data.password,  # En production, hasher le mot de passe!
            "display_name": user_data.display_name,
            "phone_number": user_data.phone_number,
            "farm_name": user_data.farm_name,
            "location": user_data.location,
            "role": "farmer",
            "created_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(user_dict)
        user_dict["_id"] = str(result.inserted_id)
        
        return UserResponse(
            uid=user_dict["uid"],
            email=user_dict["email"],
            display_name=user_dict["display_name"],
            phone_number=user_dict.get("phone_number"),
            farm_name=user_dict.get("farm_name"),
            location=user_dict.get("location"),
            photo_url=user_dict.get("photo_url"),
            created_at=user_dict["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/auth/login", response_model=UserResponse)
async def login(credentials: UserLogin):
    """Connexion utilisateur"""
    try:
        user = await db.users.find_one({
            "email": credentials.email,
            "password": credentials.password
        })
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return UserResponse(
            uid=user["uid"],
            email=user["email"],
            display_name=user["display_name"],
            phone_number=user.get("phone_number"),
            farm_name=user.get("farm_name"),
            location=user.get("location"),
            photo_url=user.get("photo_url"),
            created_at=user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/users/{uid}", response_model=UserResponse)
async def get_user(uid: str):
    """Récupérer un utilisateur par UID"""
    try:
        user = await db.users.find_one({"uid": uid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return UserResponse(
            uid=user["uid"],
            email=user["email"],
            display_name=user["display_name"],
            phone_number=user.get("phone_number"),
            farm_name=user.get("farm_name"),
            location=user.get("location"),
            photo_url=user.get("photo_url"),
            created_at=user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get user error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/users/{uid}")
async def update_user(uid: str, user_update: UserUpdate):
    """Mettre à jour le profil utilisateur"""
    try:
        update_data = {k: v for k, v in user_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No data to update")
        
        result = await db.users.update_one(
            {"uid": uid},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = await db.users.find_one({"uid": uid})
        return UserResponse(
            uid=user["uid"],
            email=user["email"],
            display_name=user["display_name"],
            phone_number=user.get("phone_number"),
            farm_name=user.get("farm_name"),
            location=user.get("location"),
            photo_url=user.get("photo_url"),
            created_at=user["created_at"]
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update user error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/users/{uid}/password")
async def update_password(uid: str, password_update: PasswordUpdate):
    """Changer le mot de passe"""
    try:
        user = await db.users.find_one({"uid": uid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user["password"] != password_update.old_password:
            raise HTTPException(status_code=401, detail="Incorrect old password")
        
        result = await db.users.update_one(
            {"uid": uid},
            {"$set": {"password": password_update.new_password}}
        )
        
        return {"message": "Password updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update password error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= DIAGNOSTIC ENDPOINTS =============

@api_router.post("/diagnostics", response_model=DiagnosticResponse)
async def create_diagnostic(diagnostic: DiagnosticCreate, user_id: str):
    """Créer un nouveau diagnostic"""
    try:
        diagnostic_dict = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "culture": diagnostic.culture,
            "symptoms": diagnostic.symptoms,
            "diagnosis": None,
            "probability": None,
            "treatment": None,
            "status": "en cours",
            "location": diagnostic.location,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.diagnostics.insert_one(diagnostic_dict)
        diagnostic_dict["_id"] = str(result.inserted_id)
        
        return DiagnosticResponse(**diagnostic_dict)
    except Exception as e:
        logger.error(f"Create diagnostic error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/diagnostics/{user_id}", response_model=List[DiagnosticResponse])
async def get_diagnostics(user_id: str):
    """Récupérer tous les diagnostics d'un utilisateur"""
    try:
        diagnostics = await db.diagnostics.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
        return [DiagnosticResponse(**d) for d in diagnostics]
    except Exception as e:
        logger.error(f"Get diagnostics error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/diagnostics/{diagnostic_id}/detail", response_model=DiagnosticResponse)
async def get_diagnostic_detail(diagnostic_id: str, user_id: str):
    """Récupérer un diagnostic spécifique"""
    try:
        diagnostic = await db.diagnostics.find_one({"id": diagnostic_id, "user_id": user_id})
        if not diagnostic:
            raise HTTPException(status_code=404, detail="Diagnostic not found")
        return DiagnosticResponse(**diagnostic)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get diagnostic detail error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= CHAT / AI ENDPOINTS =============

SYSTEM_PROMPT = """Tu es un assistant spécialisé en diagnostic agricole pour les maladies des plantes.

🎯 Ton rôle :
• Aider les agriculteurs à identifier les maladies de leurs plantes
• Poser des questions de clarification si nécessaire
• Fournir des diagnostics précis avec une probabilité estimée
• Recommander des traitements appropriés
• Donner des conseils de prévention

📋 Format de réponse :

Pour les questions de clarification :
Réponds de manière concise et amicale.

Pour un diagnostic final, utilise CE FORMAT EXACT :

🔍 **DIAGNOSTIC**
[Nom de la maladie identifiée]

📊 **PROBABILITÉ**
[XX]% de certitude

🌿 **SYMPTÔMES OBSERVÉS**
• [Symptôme 1]
• [Symptôme 2]
• [Symptôme 3]

💊 **TRAITEMENT RECOMMANDÉ**
**Traitement immédiat :**
• [Action 1]
• [Action 2]

**Traitement préventif :**
• [Mesure 1]
• [Mesure 2]

⚠️ **URGENCE**
[Faible / Modérée / Élevée] - [Explication courte]

🛡️ **PRÉVENTION FUTURE**
• [Conseil 1]
• [Conseil 2]

Sois concis, professionnel et empathique. Utilise des emojis pertinents pour la lisibilité."""

@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(chat_req: ChatRequest, user_id: str):
    """Envoyer un message au chatbot IA et recevoir une réponse (avec image optionnelle)"""
    try:
        # Vérifier que le diagnostic appartient à l'utilisateur
        diagnostic = await db.diagnostics.find_one({
            "id": chat_req.diagnostic_id,
            "user_id": user_id
        })
        
        if not diagnostic:
            raise HTTPException(status_code=404, detail="Diagnostic not found")
        
        # Nettoyer le base64 (enlever le préfixe data:image/...;base64, si présent)
        image_b64_clean = None
        if chat_req.image_base64:
            raw = chat_req.image_base64.strip()
            if raw.startswith("data:"):
                # data:image/jpeg;base64,XXXX
                parts = raw.split(",", 1)
                image_b64_clean = parts[1] if len(parts) == 2 else raw
            else:
                image_b64_clean = raw
        
        # Sauvegarder le message utilisateur (contenu enrichi si image)
        user_content_stored = chat_req.message
        if image_b64_clean:
            # Marqueur pour pouvoir afficher la photo dans l'historique côté frontend
            user_content_stored = f"{chat_req.message}\n\n[image_jointe]"
        
        user_message_dict = {
            "role": "user",
            "content": user_content_stored,
            "image_base64": image_b64_clean,  # stocké pour réaffichage
            "created_at": datetime.utcnow()
        }
        await db[f"messages_{chat_req.diagnostic_id}"].insert_one(user_message_dict)
        
        # Appeler l'IA
        chat = LlmChat(
            api_key=LLM_API_KEY,
            session_id=chat_req.diagnostic_id,
            system_message=SYSTEM_PROMPT
        ).with_model("openai", "gpt-5.2")
        
        # Construire le contexte
        if image_b64_clean:
            context_message = (
                f"Culture: {diagnostic['culture']}\n"
                f"Symptômes initialement décrits: {diagnostic['symptoms']}\n\n"
                f"L'agriculteur a joint une photo de la plante. "
                f"Analyse VISUELLEMENT la photo pour identifier les maladies, "
                f"parasites, carences, anomalies visibles (taches, décolorations, déformations, etc.). "
                f"Confronte ce que tu vois avec les symptômes décrits.\n\n"
                f"Question / commentaire: {chat_req.message or '(aucun message texte)'}"
            )
            user_msg = UserMessage(
                text=context_message,
                file_contents=[ImageContent(image_base64=image_b64_clean)]
            )
        else:
            context_message = (
                f"Culture: {diagnostic['culture']}\n"
                f"Symptômes: {diagnostic['symptoms']}\n\n"
                f"Question: {chat_req.message}"
            )
            user_msg = UserMessage(text=context_message)
        
        ai_response = await chat.send_message(user_msg)
        
        # Sauvegarder la réponse IA
        ai_message_dict = {
            "role": "assistant",
            "content": ai_response,
            "created_at": datetime.utcnow()
        }
        await db[f"messages_{chat_req.diagnostic_id}"].insert_one(ai_message_dict)
        
        # Mettre à jour le diagnostic si la réponse contient un diagnostic
        if "Diagnostic:" in ai_response and "Probabilité:" in ai_response:
            # Parser la réponse pour extraire les informations
            lines = ai_response.split("\n")
            diagnosis_text = None
            probability = None
            treatment = None
            
            for line in lines:
                if line.startswith("- Diagnostic:"):
                    diagnosis_text = line.replace("- Diagnostic:", "").strip()
                elif line.startswith("- Probabilité:"):
                    prob_str = line.replace("- Probabilité:", "").strip().replace("%", "")
                    try:
                        probability = float(prob_str) / 100
                    except:
                        probability = 0.8
                elif line.startswith("- Traitement:"):
                    treatment = line.replace("- Traitement:", "").strip()
            
            if diagnosis_text:
                await db.diagnostics.update_one(
                    {"id": chat_req.diagnostic_id},
                    {"$set": {
                        "diagnosis": diagnosis_text,
                        "probability": probability,
                        "treatment": treatment if treatment else ai_response,
                        "status": "traité",
                        "updated_at": datetime.utcnow()
                    }}
                )
        
        return ChatResponse(**ai_message_dict)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/messages/{diagnostic_id}", response_model=List[ChatResponse])
async def get_messages(diagnostic_id: str, user_id: str):
    """Récupérer l'historique des messages d'un diagnostic"""
    try:
        # Vérifier que le diagnostic appartient à l'utilisateur
        diagnostic = await db.diagnostics.find_one({
            "id": diagnostic_id,
            "user_id": user_id
        })
        
        if not diagnostic:
            raise HTTPException(status_code=404, detail="Diagnostic not found")
        
        messages = await db[f"messages_{diagnostic_id}"].find().sort("created_at", 1).to_list(100)
        return [ChatResponse(**m) for m in messages]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get messages error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= ALERTS ENDPOINTS =============

@api_router.post("/alerts", response_model=AlertResponse)
async def create_alert(alert: AlertCreate, user_id: str):
    """Créer une nouvelle alerte"""
    try:
        alert_dict = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": alert.type,
            "message": alert.message,
            "severity": alert.severity,
            "read": False,
            "latitude": alert.latitude,
            "longitude": alert.longitude,
            "location_name": alert.location_name,
            "created_at": datetime.utcnow()
        }
        
        await db.alerts.insert_one(alert_dict)
        return AlertResponse(**alert_dict)
    except Exception as e:
        logger.error(f"Create alert error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/alerts/{user_id}", response_model=List[AlertResponse])
async def get_alerts(user_id: str, unread_only: bool = False):
    """Récupérer les alertes d'un utilisateur"""
    try:
        query = {"user_id": user_id}
        if unread_only:
            query["read"] = False
        
        alerts = await db.alerts.find(query).sort("created_at", -1).to_list(50)
        return [AlertResponse(**a) for a in alerts]
    except Exception as e:
        logger.error(f"Get alerts error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.patch("/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str, user_id: str):
    """Marquer une alerte comme lue"""
    try:
        result = await db.alerts.update_one(
            {"id": alert_id, "user_id": user_id},
            {"$set": {"read": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"message": "Alert marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Mark alert read error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= DASHBOARD / STATS =============

@api_router.get("/stats/{user_id}")
async def get_user_stats(user_id: str):
    """Récupérer les statistiques d'un utilisateur"""
    try:
        # Compter les diagnostics
        total_diagnostics = await db.diagnostics.count_documents({"user_id": user_id})
        
        # Compter par statut
        en_cours = await db.diagnostics.count_documents({"user_id": user_id, "status": "en cours"})
        traites = await db.diagnostics.count_documents({"user_id": user_id, "status": "traité"})
        surveillance = await db.diagnostics.count_documents({"user_id": user_id, "status": "surveillance"})
        
        # Alertes non lues
        unread_alerts = await db.alerts.count_documents({"user_id": user_id, "read": False})
        
        # Derniers diagnostics
        recent_diagnostics = await db.diagnostics.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(5).to_list(5)
        
        return {
            "total_diagnostics": total_diagnostics,
            "status_breakdown": {
                "en_cours": en_cours,
                "traité": traites,
                "surveillance": surveillance
            },
            "unread_alerts": unread_alerts,
            "recent_diagnostics": [DiagnosticResponse(**d) for d in recent_diagnostics]
        }
    except Exception as e:
        logger.error(f"Get stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============= BASIC ROUTES =============

@api_router.get("/")
async def root():
    return {"message": "AgriScan AI API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
