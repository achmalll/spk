import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib
import os

# 1. Load dataset
data_path = "ml_engine/data_cm_performance.csv"
if not os.path.exists(data_path):
    print(f"Error: {data_path} not found. Please run generate_data.py first.")
    exit()

data = pd.read_csv(data_path)

# 2. Pemisahan Fitur dan Label
X = data[['achievement', 'engagement', 'completion', 'feedback']]
y = data['label']

# 3. Scaling Fitur
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. Split Data (80:20)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# 5. Training Model Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluasi Akurasi
y_pred = model.predict(X_test)
print(f"\nAkurasi Model: {accuracy_score(y_test, y_pred) * 100:.1f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 7. Cek Kriteria Paling Berpengaruh (Feature Importance)
importances = model.feature_importances_
features = ['Achievement', 'Engagement', 'Completion', 'Feedback']
print("\nFeature Importance:")
for feature, importance in zip(features, importances):
    print(f"{feature:12}: {importance:.4f}")

# 8. Simpan Model dan Scaler
joblib.dump(model, 'ml_engine/model_cm.pkl')
joblib.dump(scaler, 'ml_engine/scaler_cm.pkl')

print("\nModel dan scaler berhasil disimpan di folder 'ml_engine/' untuk persiapan Meeting 9.")
