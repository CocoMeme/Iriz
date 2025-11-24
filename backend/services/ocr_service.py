import easyocr
from PIL import Image
import cv2
import numpy as np
import re

# Initialize the reader once globally
reader = easyocr.Reader(['en'], gpu=False)  # English only, CPU

def extract_text_from_image(image_path):
    """
    OCR text extraction using EasyOCR optimized for frontend Text-to-Speech.
    Converts image to grayscale before recognition.
    Returns letters and numbers only, normalized to lowercase for TTS, along with confidence score.
    """
    # Load image and convert to RGB
    image = Image.open(image_path).convert('RGB')
    open_cv_image = np.array(image)

    # Convert to grayscale
    gray = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2GRAY)

    # EasyOCR expects ndarray input
    # detail=1 returns (bbox, text, confidence) for each detection
    results = reader.readtext(gray, detail=1)
    
    if not results:
        print("OCR: No text detected")
        return "", 0.0
    
    # Extract text and confidence from results
    text_parts = []
    confidences = []
    
    for (bbox, text, conf) in results:
        text_parts.append(text)
        confidences.append(conf)
    
    raw_text = ' '.join(text_parts)
    print(f"OCR Raw Text: {raw_text}")
    
    # Calculate average confidence
    avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
    # Convert to percentage (0-100)
    confidence_percentage = avg_confidence * 100
    print(f"OCR Confidence: {confidence_percentage:.2f}%")

    # Keep only letters, numbers, and spaces
    cleaned_text = re.sub(r'[^A-Za-z0-9\s]', '', raw_text).strip()

    # Replace multiple spaces with a single space
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)

    # Normalize to lowercase so TTS reads all-caps words naturally
    tts_text = cleaned_text.lower()
    print(f"OCR Cleaned Text (for TTS): {tts_text}")

    return tts_text, confidence_percentage
