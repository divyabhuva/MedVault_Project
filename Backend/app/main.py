from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.database import engine

from app.models import Base
from app.routes import (
    auth,
    drugs,
    prescriptions,
    dashboard
)

app = FastAPI()

# CREATE DATABASE TABLES
Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(auth.router, prefix="/api")

app.include_router(drugs.router, prefix="/api")

app.include_router(
    prescriptions.router,
    prefix="/api"
)

app.include_router(
    dashboard.router,
    prefix="/api"
)

@app.get("/")
def root():

    return {
        "message": "MedVault API Running"
    }