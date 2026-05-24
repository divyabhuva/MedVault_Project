from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models import (
    Prescription,
    Drug
)

from app.schemas import (
    PrescriptionSchema
)

router = APIRouter()

# DATABASE DEPENDENCY
def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()



@router.get("/prescriptions")
def get_prescriptions(
    db: Session = Depends(get_db)
):

    prescriptions = db.query(
        Prescription
    ).all()

    return prescriptions


# CREATE PRESCRIPTION

@router.post("/prescriptions")
def create_prescription(
    data: PrescriptionSchema,
    db: Session = Depends(get_db),
):

    # FIND DRUG

    drug = db.query(Drug).filter(
        Drug.name == data.drug_name
    ).first()

    # DRUG NOT FOUND
    if not drug:

        raise HTTPException(
            status_code=404,
            detail="Drug not found"
        )

    # CHECK STOCK

    if data.quantity > drug.stock_quantity:

        raise HTTPException(
            status_code=400,
            detail=f"""
Insufficient stock.

Available stock:
{drug.stock_quantity}
"""
        )

    # CREATE PRESCRIPTION

    prescription = Prescription(
        patient_name=data.patient_name,

        doctor_name=data.doctor_name,

        quantity=data.quantity,

        drug_name=data.drug_name,

        status="pending",
    )

    db.add(prescription)

    db.commit()

    db.refresh(prescription)

    return {
        "message":
            "Prescription created successfully",

        "data":
            prescription,
    }



# DISPENSE PRESCRIPTION
@router.patch(
    "/prescriptions/{id}/dispense"
)
def dispense_prescription(
    id: int,
    db: Session = Depends(get_db),
):

    # FIND PRESCRIPTION
    prescription = (
        db.query(Prescription)
        .filter(
            Prescription.id == id
        )
        .first()
    )

    # NOT FOUND
    if not prescription:

        raise HTTPException(
            status_code=404,
            detail="Prescription not found",
        )

    
    # FIND DRUG
    drug = db.query(Drug).filter(
        Drug.name
        == prescription.drug_name
    ).first()

    # DRUG NOT FOUND
    if not drug:

        raise HTTPException(
            status_code=404,
            detail="Drug not found"
        )

    # CHECK STOCK AGAIN
    if (
        prescription.quantity
        >
        drug.stock_quantity
    ):

        raise HTTPException(
            status_code=400,
            detail=f"""
Cannot dispense.

Available stock:
{drug.stock_quantity}
"""
        )

    # REDUCE STOCK
    drug.stock_quantity = (
        drug.stock_quantity
        -
        prescription.quantity
    )

    # UPDATE STATUS
    prescription.status = "dispensed"

    db.commit()

    return {
        "message":
            "Prescription dispensed successfully",

        "remaining_stock":
            drug.stock_quantity
    }



# CANCEL PRESCRIPTION

@router.patch(
    "/prescriptions/{id}/cancel"
)
def cancel_prescription(
    id: int,
    db: Session = Depends(get_db),
):

    prescription = (
        db.query(Prescription)
        .filter(
            Prescription.id == id
        )
        .first()
    )

    # NOT FOUND
    if not prescription:

        raise HTTPException(
            status_code=404,
            detail="Prescription not found",
        )

    
    # UPDATE STATUS
    
    prescription.status = "cancelled"

    db.commit()

    return {
        "message":
            "Prescription cancelled"
    }