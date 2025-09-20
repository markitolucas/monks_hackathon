from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from fastapi.concurrency import asynccontextmanager
from schemas import PostBase
from db.repository import init_db,get_db
import schemas
import services
import asyncio
import threading
import logging

from kafka_subscriber import RAGResultSubscriber
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAG Analysis API",
    description="API para análise de textos usando RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # URL do seu frontend React
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

rag_subscriber = RAGResultSubscriber()

def start_kafka_consumer():
    """Função para iniciar o consumer Kafka em thread separada"""
    try:
        rag_subscriber.start_consuming()
    except Exception as e:
        logger.error(f"Erro no consumer Kafka: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Evento de inicialização da aplicação"""
    try:
        # Inicializar banco de dados
        init_db()
        logger.info("Banco de dados inicializado")
        
        # Iniciar consumer Kafka em thread separada
        kafka_thread = threading.Thread(target=start_kafka_consumer, daemon=True)
        kafka_thread.start()
        logger.info("Consumer Kafka iniciado em thread separada")
        
    except Exception as e:
        logger.error(f"Erro na inicialização: {e}")

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

#####POSTS#####
@app.get("/posts/{post_id}")
def read_item(post_id: str, db: Session = Depends(get_db)):
    post = services.PostService.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/posts")
def create_post(request: schemas.PostBase, db: Session = Depends(get_db)):
    try:
        result = services.PostService.create_post(
            db, 
            request
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erro na análise: {str(e)}"
        )
    
@app.get("/posts")
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = services.PostService.get_posts(db, skip=skip, limit=limit)
    return posts

#####RAG#####
@app.get("/rag")
def get_rag_results(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    results = services.RAGService.get_all_rag_results(db)
    return results
