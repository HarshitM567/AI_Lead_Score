
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field, EmailStr
import joblib
import uvicorn

# Load model
model = joblib.load("lead_intent_model.pkl")

# Initialize app
app = FastAPI()

# Keyword-based reranker dictionary
rerank_rules = {
    "urgent": 10,
    "priority": 8,
    "follow-up": 5,
    "not interested": -10,
    "budget issue": -5
}

# Request schema
class LeadInput(BaseModel):
    credit_score: int = Field(..., ge=300, le=850)
    age_group: str
    family_status: str
    income: int = Field(..., ge=0)
    comments: str
    email: EmailStr
    phone_number: str
    consent: bool

@app.post("/score")
def score_lead(lead: LeadInput):
    if not lead.consent:
        raise HTTPException(status_code=400, detail="Consent is required to process data.")

    # Prepare features for model
    input_features = {
        "credit_score": lead.credit_score,
        "age_group": lead.age_group,
        "family_status": lead.family_status,
        "income": lead.income
    }
    X = [input_features]
    initial_score = int(model.predict_proba(X)[0][1] * 100)

    # Apply reranker based on comments
    adjustment = 0
    comment_lower = lead.comments.lower()
    for keyword, score_change in rerank_rules.items():
        if keyword in comment_lower:
            adjustment += score_change

    reranked_score = max(0, min(100, initial_score + adjustment))

    return {
        "email": lead.email,
        "initial_score": initial_score,
        "reranked_score": reranked_score,
        "comments": lead.comments
    }
