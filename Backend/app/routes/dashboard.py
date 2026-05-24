from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models import (
    Drug,
    Prescription
)

router = APIRouter()


# DASHBOARD STATS

@router.get("/dashboard/stats")
def stats(
    db: Session = Depends(get_db)
):

    
    # TOTAL DRUGS
    
    total_drugs = db.query(
        Drug
    ).count()

    
    # LOW STOCK COUNT
    
    low_stock = db.query(
        Drug
    ).filter(
        Drug.stock_quantity
        <=
        Drug.low_stock_threshold
    ).count()

    
    # TOTAL PRESCRIPTIONS
    
    prescriptions_today = db.query(
        Prescription
    ).count()

    
    # DISPENSED PRESCRIPTIONS
    
    dispensed_today = db.query(
        Prescription
    ).filter(
        Prescription.status
        == "dispensed"
    ).count()

    
    # RETURN RESPONSE
    
    return {
        "totalDrugs": total_drugs,

        "lowStock": low_stock,

        "prescriptionsToday":
            prescriptions_today,

        "dispensedToday":
            dispensed_today
    }



# LOW STOCK DRUGS API

@router.get("/dashboard/low-stock")
def low_stock_drugs(
    db: Session = Depends(get_db)
):

    drugs = db.query(
        Drug
    ).filter(
        Drug.stock_quantity
        <=
        Drug.low_stock_threshold
    ).all()

    return drugs