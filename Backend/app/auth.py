from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.redis_client import redis_client


import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_HOURS = 2


security = HTTPBearer()


def create_token(data: dict):

    payload = data.copy()

    
    payload["exp"] = (
        datetime.utcnow() +
        timedelta(
            hours=ACCESS_TOKEN_EXPIRE_HOURS
        )
    )

    # GENERATE TOKEN
    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        
        session = redis_client.get(
            f"session:{token}"
        )

        if not session:

            raise HTTPException(
                status_code=401,
                detail="Session expired"
            )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_token(token)

    return payload


def admin_only(user):

    if user["role"] != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


def pharmacist_only(user):

    if user["role"] != "pharmacist":

        raise HTTPException(
            status_code=403,
            detail="Pharmacist access required"
        )


def admin_or_pharmacist(user):

    if user["role"] not in [
        "admin",
        "pharmacist"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )