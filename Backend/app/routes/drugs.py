from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models import Drug

from app.schemas import DrugSchema

from app.auth import (
    get_current_user,
    admin_only
)

router = APIRouter()


# GET ALL DRUGS
# ADMIN + PHARMACIST

@router.get("/drugs")
def get_drugs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    drugs = db.query(Drug).all()

    return drugs



# ADD DRUG
# ADMIN ONLY

@router.post("/drugs")
def add_drug(
    data: DrugSchema,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # ADMIN CHECK
    admin_only(current_user)

    # CREATE DRUG
    new_drug = Drug(
        name=data.name,
        generic_name=data.generic_name,
        category=data.category,
        stock_quantity=data.stock_quantity,
        unit_of_measure=data.unit_of_measure,
        low_stock_threshold=data.low_stock_threshold,
    )

    db.add(new_drug)

    db.commit()

    db.refresh(new_drug)

    return {
        "message": "Drug added successfully",
        "drug": new_drug
    }



# UPDATE DRUG
# ADMIN ONLY

@router.put("/drugs/{drug_id}")
def update_drug(
    drug_id: int,
    data: DrugSchema,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # ADMIN CHECK
    admin_only(current_user)

    # FIND DRUG
    drug = db.query(Drug).filter(
        Drug.id == drug_id
    ).first()

    if not drug:

        raise HTTPException(
            status_code=404,
            detail="Drug not found"
        )

    # UPDATE FIELDS
    drug.name = data.name

    drug.generic_name = (
        data.generic_name
    )

    drug.category = data.category

    drug.stock_quantity = (
        data.stock_quantity
    )

    drug.unit_of_measure = (
        data.unit_of_measure
    )

    drug.low_stock_threshold = (
        data.low_stock_threshold
    )

    db.commit()

    db.refresh(drug)

    return {
        "message": "Drug updated successfully",
        "drug": drug
    }



# DELETE DRUG
# ADMIN ONLY

@router.delete("/drugs/{drug_id}")
def delete_drug(
    drug_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    
    admin_only(current_user)

    
    drug = db.query(Drug).filter(
        Drug.id == drug_id
    ).first()

    if not drug:

        raise HTTPException(
            status_code=404,
            detail="Drug not found"
        )

    db.delete(drug)

    db.commit()

    return {
        "message": "Drug deleted successfully"
    }