from ultralytics import YOLO
import os

# ====== CONFIG ======
MODEL_PATH = "best.pt"                   # your trained model
DATA_YAML = "Pothole-Detection--1/data.yaml"  # dataset config file
CONF_THRESHOLD = 0.25                     # confidence threshold for predictions
IMG_SIZE = 640                            # image size

# ====== LOAD MODEL ======
model = YOLO(MODEL_PATH)
print(f"Loaded model from {MODEL_PATH}")

# ====== EVALUATE ON DATASET ======
if os.path.exists(DATA_YAML):
    print(f"\nEvaluating model on dataset: {DATA_YAML}")
    
    # model.val() computes metrics like Precision, Recall, mAP, F1-score
    metrics = model.val(data=DATA_YAML, imgsz=IMG_SIZE, conf=CONF_THRESHOLD, plots=True)
    
    print("\n==== EVALUATION METRICS ====")
    print(metrics)
    print("\nConfusion matrix and example predictions saved in runs/val/")
else:
    print(f"\ndata.yaml not found at {DATA_YAML}. Please check the path.")
