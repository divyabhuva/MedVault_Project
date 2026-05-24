from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from sqlalchemy.orm import Session

import json

from app.schemas import (
    LoginSchema,
    RegisterSchema
)

from app.auth import create_token

from app.dependencies import get_db

from app.models import (
    User,
    Drug
)

from app.redis_client import redis_client

router = APIRouter()


security = HTTPBearer()


@router.post("/auth/register")
def register(
    data: RegisterSchema,
    db: Session = Depends(get_db)
):

    # REMOVE EXTRA SPACES
    name = data.name.strip()

    email = data.email.strip()

    password = data.password.strip()

    print("================================")
    print("REGISTER EMAIL:", email)

    
    existing_user = db.query(User).filter(
        User.email == email
    ).first()

    # EMAIL EXISTS
    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

   
    user = User(
        name=name,

        email=email,

        password=password,

        role="pharmacist"
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    print("USER REGISTERED")

    return {
        "message":
            "Registration successful"
    }



@router.post("/auth/login")
def login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):

    # REMOVE EXTRA SPACES
    email = data.email.strip()

    password = data.password.strip()

    print("================================")
    print("LOGIN EMAIL:", email)


    user = db.query(User).filter(
        User.email == email
    ).first()

    print("FOUND USER:", user)

    # USER NOT FOUND
    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    # PASSWORD CHECK
    if password != user.password:

        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    print("LOGIN SUCCESS")

   
    token = create_token({
        "id": user.id,

        "role": user.role,

        "name": user.name
    })

    
    redis_client.set(
        f"session:{token}",

        json.dumps({
            "id": user.id,

            "name": user.name,

            "role": user.role
        }),

        ex=7200
    )

    print("SESSION STORED IN REDIS")

    return {
        "token": token,

        "user": {
            "id": user.id,

            "name": user.name,

            "email": user.email,

            "role": user.role
        }
    }



@router.post("/auth/logout")
def logout(
    credentials:
    HTTPAuthorizationCredentials
    = Depends(security)
):

    token = credentials.credentials

    # REMOVE SESSION
    redis_client.delete(
        f"session:{token}"
    )

    return {
        "message":
            "Logged out successfully"
    }



@router.get("/drugs/low-stock")
def get_low_stock_drugs(
    db: Session = Depends(get_db)
):

    drugs = db.query(
        Drug
    ).all()

    low_stock = []

   
    for drug in drugs:

        if (
            drug.stock_quantity
            <=
            drug.low_stock_threshold
        ):

            low_stock.append(drug)

    return low_stock