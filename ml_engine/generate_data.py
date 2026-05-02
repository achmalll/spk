import pandas as pd
import numpy as np
import os

# Set seed for reproducibility
np.random.seed(42)

def generate_dummy_data(filename, n_rows=500):
    data = []
    for _ in range(n_rows):
        achievement = np.random.randint(20, 101)
        engagement = np.random.randint(20, 101)
        completion = np.random.randint(20, 101)
        feedback = round(np.random.uniform(1.0, 5.0), 1)
        
        # Super clean deterministic logic for high accuracy
        # Weighted average score
        score = (achievement * 0.3) + (engagement * 0.25) + (completion * 0.2) + ((feedback * 20) * 0.25)
        
        # Simple threshold
        if score >= 65:
            label = 1
        else:
            label = 0
            
        data.append([achievement, engagement, completion, feedback, label])
        
    df = pd.DataFrame(data, columns=['achievement', 'engagement', 'completion', 'feedback', 'label'])
    df.to_csv(filename, index=False)
    print(f"Dataset {filename} regenerated with {n_rows} rows (Deterministic Quality).")

if __name__ == "__main__":
    generate_dummy_data("ml_engine/data_cm_performance.csv")
