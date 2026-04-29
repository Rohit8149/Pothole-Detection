# app.py
#   python -m uvicorn app:app --reload

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from PIL import Image
import io

app = FastAPI()

# Load YOLOv12 model
model = YOLO("best.pt")  # replace with your trained model path

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read uploaded image
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")

        # Run prediction
        results = model.predict(source=img, imgsz=640, conf=0.25)  # set desired conf threshold

        predictions = []
        for r in results:
            boxes = r.boxes
            if boxes is not None and len(boxes) > 0:
                for i in range(len(boxes)):
                    box = boxes.xyxy[i]
                    conf = float(boxes.conf[i])
                    cls_idx = int(boxes.cls[i])
                    label = model.names.get(cls_idx, str(cls_idx))  # fallback to index
                    predictions.append({
                        "xmin": int(box[0]),
                        "ymin": int(box[1]),
                        "xmax": int(box[2]),
                        "ymax": int(box[3]),
                        "confidence": conf,
                        "class": cls_idx,
                        "label": label
                    })

        return JSONResponse({"predictions": predictions})

    except Exception as e:
        return JSONResponse({"error": str(e)})
