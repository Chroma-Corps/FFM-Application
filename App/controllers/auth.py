from App.models.user import User
from App.controllers.user import create_user
from flask_jwt_extended import create_access_token, JWTManager, get_jwt_identity, verify_jwt_in_request

def login(email, password):
  user = User.query.filter_by(email=email).first()
  if user and user.check_password(password):
    return create_access_token(identity=email)
  return None

def signup(name, email, password):
  user = create_user(name, email, password)
  if user:
    return create_access_token(identity=email)
  return None

def setup_jwt(app):
  jwt = JWTManager(app)

  @jwt.user_identity_loader
  def user_identity_lookup(identity):
    user = User.query.filter_by(email=identity).one_or_none()
    if user:
        return user.id
    return None

  @jwt.user_lookup_loader
  def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.get(identity)
  return jwt

# Context processor to make 'is_authenticated' available to all templates
def add_auth_context(app):
  @app.context_processor
  def inject_user():
      try:
          verify_jwt_in_request()
          user_id = get_jwt_identity()
          current_user = User.query.get(user_id)
          is_authenticated = True
      except Exception as e:
          print(e)
          is_authenticated = False
          current_user = None
      return dict(is_authenticated=is_authenticated, current_user=current_user)