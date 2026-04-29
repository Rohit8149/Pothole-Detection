from ultralytics import YOLO
import os
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# ====== CONFIG ======
MODEL_PATH = "best.pt"                    # trained YOLO model
DATA_YAML = "Pothole-Detection--1/data.yaml"  # dataset config file
IMG_SIZE = 640                            # image size
CONF_THRESHOLDS = [0.1, 0.25, 0.5, 0.75, 0.9]  # thresholds to test

# ====== LOAD MODEL ======
model = YOLO(MODEL_PATH)
print(f"✅ Loaded model from {MODEL_PATH}")

# ====== CHECK DATASET ======
if not os.path.exists(DATA_YAML):
    raise FileNotFoundError(f"{DATA_YAML} not found. Please check the path.")

# ====== EVALUATE AT MULTIPLE CONFIDENCE THRESHOLDS ======
results = []

for conf in CONF_THRESHOLDS:
    print(f"\nEvaluating at confidence threshold: {conf}")
    metrics = model.val(data=DATA_YAML, imgsz=IMG_SIZE, conf=conf, plots=False)

    results.append({
    "confidence": conf,
    "precision": metrics.box.mp,         # scalar float, no ()
    "recall": metrics.box.mr,            # scalar float, no ()
    "f1": float(metrics.box.f1.mean()) if len(metrics.box.f1) > 0 else 0,  # average F1
    "mAP50": metrics.box.map50,          # scalar float
    "mAP50_95": metrics.box.map           # scalar float
})


# ====== SAVE RESULTS TO CSV ======
df = pd.DataFrame(results)
df.to_csv("evaluation_metrics.csv", index=False)
print("\n✅ Saved metrics to evaluation_metrics.csv")

# ====== PLOT METRICS ======
plt.figure(figsize=(8,6))
plt.plot(df['confidence'], df['precision'], marker='o', label='Precision', linewidth=2)
plt.plot(df['confidence'], df['recall'], marker='o', label='Recall', linewidth=2)
plt.plot(df['confidence'], df['f1'], marker='o', label='F1-score', linewidth=2)
plt.plot(df['confidence'], df['mAP50'], marker='o', label='mAP@0.5', linewidth=2)
plt.plot(df['confidence'], df['mAP50_95'], marker='o', label='mAP@0.5:0.95', linewidth=2)

plt.xlabel("Confidence Threshold", fontsize=12)
plt.ylabel("Metric Value", fontsize=12)
plt.title("YOLOv12 Evaluation Metrics vs Confidence Threshold", fontsize=14)
plt.xticks(CONF_THRESHOLDS)
plt.ylim(0, 1)
plt.legend()
plt.grid(True, linestyle='--', alpha=0.7)
plt.tight_layout()
plt.savefig("metrics_vs_threshold.png", dpi=300)
print("✅ Plot saved as metrics_vs_threshold.png")

