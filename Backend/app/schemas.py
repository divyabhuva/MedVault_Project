from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class DrugSchema(BaseModel):
    name: str
    generic_name: str
    category: str
    stock_quantity: int
    unit_of_measure: str
    low_stock_threshold: int

class PrescriptionSchema(BaseModel):
    patient_name: str
    doctor_name: str
    quantity: int
    drug_name: str