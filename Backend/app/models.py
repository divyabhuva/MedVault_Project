from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database import Base

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        default="pharmacist"
    )


class Drug(Base):
    __tablename__ = "drugs"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    generic_name = Column(String)
    category = Column(String)
    stock_quantity = Column(Integer)
    unit_of_measure = Column(String)
    low_stock_threshold = Column(Integer)
    is_active = Column(Boolean, default=True)


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True)

    patient_name = Column(String)

    doctor_name = Column(String)

    quantity = Column(Integer)

    status = Column(String, default="pending")

    drug_name = Column(String)