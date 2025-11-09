from ultralytics import YOLO
import os
from PIL import Image, ImageDraw

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'best.pt')

# Load YOLO model once
yolo_model = YOLO(MODEL_PATH)

def detect_signboards(image_path):
    """
    Runs YOLO detection on the given image and returns detected signboard regions.
    """
    results = yolo_model(image_path)
    detections = []
    for result in results:
        for box in result.boxes:
            # Each box: [x1, y1, x2, y2, confidence, class]
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = box.conf[0].item()
            cls = box.cls[0].item()
            detections.append({
                "bbox": [x1, y1, x2, y2],
                "confidence": conf,
                "class": cls
            })
    return detections

def crop_signboard(image_path, bbox, idx=None, timestamp=None):
    """
    Crops the signboard from the image using the bounding box.
    """
    image = Image.open(image_path)
    x1, y1, x2, y2 = map(int, bbox)
    cropped = image.crop((x1, y1, x2, y2))
    base_dir = os.path.dirname(image_path)
    if timestamp is None:
        import time
        timestamp = str(int(time.time() * 1000))
    if idx is not None:
        cropped_filename = f"Signboard_cropped_{timestamp}_{idx}.jpg"
    else:
        cropped_filename = f"Signboard_cropped_{timestamp}.jpg"
    cropped_path = os.path.join(base_dir, cropped_filename)
    cropped.save(cropped_path)
    return cropped_path

def save_image_with_boxes(image_path, detections, timestamp=None):
    """
    Saves the original image with bounding boxes drawn around detected signboards.
    """
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)
    for det in detections:
        x1, y1, x2, y2 = map(int, det["bbox"])
        draw.rectangle([x1, y1, x2, y2], outline="red", width=4)
    base_dir = os.path.dirname(image_path)
    if timestamp is None:
        import time
        timestamp = str(int(time.time() * 1000))
    boxed_filename = f"Signboard_boxed_{timestamp}.jpg"
    boxed_path = os.path.join(base_dir, boxed_filename)
    image.save(boxed_path)
    return boxed_path