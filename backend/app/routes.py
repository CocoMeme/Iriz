import os
import time
from flask import Blueprint, request, jsonify
from services.detection_service import detect_signboards, crop_signboard, save_image_with_boxes
from services.ocr_service import extract_text_from_image
from services.cloudinary_service import upload_to_cloudinary

bp = Blueprint('api', __name__)

@bp.route('/detect-signboard', methods=['POST'])
def detect_signboard():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    upload_dir = os.path.join('static', 'uploads')
    os.makedirs(upload_dir, exist_ok=True)

    # Save original image locally (for YOLO model)
    timestamp = str(int(time.time() * 1000))
    image_filename = f"Signboard_{timestamp}.jpg"
    image_path = os.path.join(upload_dir, image_filename)
    image.save(image_path)

    # Run YOLO detection
    detections = detect_signboards(image_path)

    # Save boxed version and upload to Cloudinary
    boxed_path = save_image_with_boxes(image_path, detections, timestamp)
    boxed_url = upload_to_cloudinary(boxed_path)
    print(f"Boxed Image URL: {boxed_url}")

    results = []
    for idx, det in enumerate(detections):
        # Crop each signboard and upload to Cloudinary
        cropped_path = crop_signboard(image_path, det['bbox'], idx, timestamp)
        cropped_url = upload_to_cloudinary(cropped_path)
        extracted_text = extract_text_from_image(cropped_path)
        print(f"Cropped Image URL: {cropped_url}")

        results.append({
            "bbox": det['bbox'],
            "confidence": det['confidence'],
            "class": det['class'],
            "cropped_url": cropped_url,
            "extracted_text": extracted_text
        })

    return jsonify({
        "original_image": f"/static/uploads/{os.path.basename(image_path)}",
        "boxed_image_url": boxed_url,
        "detections": results
    })
