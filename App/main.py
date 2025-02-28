import os
from flask import Flask, jsonify
from flask_login import LoginManager, current_user
from flask_uploads import DOCUMENTS, IMAGES, TEXT, UploadSet, configure_uploads
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from App.database import init_db
from App.config import load_config

from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)

from App.controllers import (
    setup_jwt,
    setup_flask_login,
    add_auth_context
)

from App.views import views, setup_admin

def add_views(app):
    for view in views:
        app.register_blueprint(view)

def create_app(overrides={}):
    app = Flask(__name__)
    load_config(app, overrides)
    CORS(app)
    add_auth_context(app)
    photos = UploadSet('photos', TEXT + DOCUMENTS + IMAGES)
    configure_uploads(app, photos)
    add_views(app)
    init_db(app)
    jwt = setup_jwt(app)
    setup_flask_login(app)
    setup_admin(app)
    @jwt.unauthorized_loader
    def unauthorized_response(callback):
        app.logger.error('Unauthorized request - missing or invalid token')
        return jsonify(error="Unauthorized access"), 401

    @jwt.invalid_token_loader
    def invalid_token_response(callback):
        app.logger.error('Invalid token provided')
        return jsonify(error="Invalid token"), 422
    app.app_context().push()
    return app