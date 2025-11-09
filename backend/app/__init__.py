from flask import Flask, send_from_directory
from flask_cors import CORS
import os

def create_app():
    # Explicitly set static folder and static URL path
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    CORS(app)  # Enable CORS for all routes

    from .routes import bp
    app.register_blueprint(bp, url_prefix='/api')

    # Explicit route to serve uploaded files
    @app.route('/static/uploads/<path:filename>')
    def uploaded_file(filename):
        uploads_dir = os.path.join(app.static_folder, 'uploads')
        return send_from_directory(uploads_dir, filename)

    return app
