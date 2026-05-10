from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os

# Inisialisasi aplikasi FastAPI
app = FastAPI(title="SPK Class Manager ML API")

# Load model dan scaler yang sudah dilatih
MODEL_PATH = "ml_engine/model_cm.pkl"
SCALER_PATH = "ml_engine/scaler_cm.pkl"

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
else:
    model = None
    scaler = None
    print("Warning: Model or Scaler file not found!")

# Schema input: sesuai dengan 4 kriteria Class Manager
class CMInput(BaseModel):
    nama: str
    kr11: float # Service Class Manager Quality
    kr12: float # Student Experience
    kr13: float # CSAT (Customer Satisfaction)
    kr14: float # Student Engagement (CRR)

# Schema output prediksi satu CM
class PrediksiOutput(BaseModel):
    nama: str
    label: int  # 1=Rekomendasi, 0=Tidak
    probabilitas: float
    keterangan: str

@app.get("/")
def root():
    return {
        "message": "SPK Class Manager ML API aktif",
        "status": "ready" if model else "model_missing"
    }

@app.post("/prediksi-batch")
def prediksi_batch(items: list[CMInput]):
    if not model or not scaler:
        return {"error": "Model files are missing"}
    
    hasil = []
    for item in items:
        # 1. Bentuk array input (sesuai urutan saat training: achievement, engagement, completion, feedback)
        X = np.array([[item.kr11, item.kr12, item.kr13, item.kr14]])
        
        # 2. Scaling menggunakan scaler yang sama saat training
        X_scaled = scaler.transform(X)
        
        # 3. Prediksi label (0 atau 1)
        label = int(model.predict(X_scaled)[0])
        
        # 4. Probabilitas prediksi (ambil probabilitas untuk label 1 / rekomendasi)
        # Random Forest predict_proba returns [prob_0, prob_1]
        proba = float(model.predict_proba(X_scaled)[0][1])
        
        hasil.append({
            "nama": item.nama,
            "label": label,
            "proba": round(proba, 4),
            "keterangan": "Direkomendasikan" if label == 1 else "Tidak Direkomendasikan"
        })
    
    return {"hasil": hasil}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002)
