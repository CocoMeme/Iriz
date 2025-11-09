import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_to_cloudinary(image_path, folder="signboards"):
    try:
        upload_result = cloudinary.uploader.upload(
            image_path,
            folder=folder,
            resource_type="image"
        )
        return upload_result["secure_url"]
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None
