from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from model.user import User, db

auth_bp = Blueprint('auth', __name__)
login_manager = LoginManager()

# Update load_user to load by username 
@login_manager.user_loader
def load_user(username):
    return User.query.get(username)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    # Check if the username already exists
    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password and create a new user
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    if len(data['user_id'])>0:
        new_user = User(username=data['username'], password=hashed_password, telegram_id=data['user_id'])
    else:
        new_user = User(username=data['username'], password=hashed_password)    
    db.session.add(new_user)
    db.session.commit()
    if new_user.telegram_id!=None:
        return jsonify({'message': 'User registered successfully', 'user_id':new_user.telegram_id}), 201
    return jsonify({'message': 'User registered successfully', 'user_id':new_user.user_id}), 201
        

@auth_bp.route('/login', methods=['POST'])
def login_user_endpoint():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login failed'}), 401
    if user.telegram_id!=None:
        return jsonify({'message': 'User registered successfully', 'user_id':user.telegram_id}), 201
    return jsonify({'message': 'Login successful', 'user_id':user.user_id}), 200

@auth_bp.route('/logout', methods=['GET'])
@login_required
def logout_user_endpoint():
    session.clear()  # Clear session data
    return jsonify({'message': 'Logged out successfully'}), 200

@auth_bp.route('/protected', methods=['GET'])
@login_required
def protected_route():  # Ensures only logged-in users can access this
    return jsonify({'message': f'Hello, {current_user.username}! This is a protected route.'})
