from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.concurrency import asynccontextmanager
from schemas import PostBase
from db.repository import init_db,get_db
import schemas
import services


app = FastAPI(
    title="RAG Analysis API",
    description="API para análise de textos usando RAG",
    version="1.0.0"
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando o banco de dados...")
    init_db()
    yield

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

@app.post("/post")
def create_post(request: schemas.PostCreate, item: PostBase, db: Session = Depends(get_db)):
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
