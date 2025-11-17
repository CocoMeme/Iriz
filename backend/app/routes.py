import os
import time
import tempfile
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
    timestamp = str(int(time.time() * 1000))
    
    # Create temporary directory for this request
    temp_dir = tempfile.mkdtemp(prefix=f'signboard_{timestamp}_')
    temp_files = []  # Track all temporary files for cleanup
    
    try:
        # Save original image to temporary file
        image_filename = f"Signboard_{timestamp}.jpg"
        image_path = os.path.join(temp_dir, image_filename)
        image.save(image_path)
        temp_files.append(image_path)

        # Run YOLO detection
        detections = detect_signboards(image_path)

        # Save boxed version and upload to Cloudinary
        boxed_path = save_image_with_boxes(image_path, detections, timestamp)
        temp_files.append(boxed_path)
        boxed_url = upload_to_cloudinary(boxed_path)
        print(f"Boxed Image URL: {boxed_url}")

        results = []
        for idx, det in enumerate(detections):
            # Crop each signboard and upload to Cloudinary
            cropped_path = crop_signboard(image_path, det['bbox'], idx, timestamp)
            temp_files.append(cropped_path)
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
            "boxed_image_url": boxed_url,
            "detections": results
        })
    
    finally:
        # Cleanup: Delete all temporary files and directory
        import shutil
        try:
            shutil.rmtree(temp_dir)
            print(f"Cleaned up temporary directory: {temp_dir}")
        except Exception as cleanup_error:
            print(f"Warning: Could not clean up temp directory: {cleanup_error}")
