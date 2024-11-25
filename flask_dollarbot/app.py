from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import os
from model.user import db
from dotenv import load_dotenv
from endpoints.add import add_bp
from endpoints.add_budget import add_budget_bp
from endpoints.edit import edit_bp
from endpoints.delete import delete_bp
from endpoints.display import display_bp
from endpoints.analytics import analytics_bp
from endpoints.category import category_bp
from endpoints.budget_analytics import budget_analytics_bp
from endpoints.add_alerts import alerts_bp
from sqlalchemy import inspect
from flask_cors import CORS
from auth import auth_bp, login_manager 


def database_exists():
    inspector = inspect(db.engine)
    return len(inspector.get_table_names()) > 0
class Base(DeclarativeBase):
  pass

#db = SQLAlchemy(model_class=Base)
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
load_dotenv()  # Load environment variables from .env file 
#####CREATE YOUR OWN .ENV FILE IN LOCAL ########
######                                 ########
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')  # Required for session management
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production (requires HTTPS)
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # FE and BE are different domains
# Initialize the app with the extensions

db.init_app(app)
login_manager.init_app(app)
CORS(app, supports_credentials=True)
#create tables if not created already
with app.app_context():
    if not database_exists():
            db.create_all()
  
# Register blueprints
app.register_blueprint(add_bp, url_prefix='/add')
app.register_blueprint(add_budget_bp, url_prefix='/add_budget')
app.register_blueprint(edit_bp)
app.register_blueprint(delete_bp)
app.register_blueprint(display_bp, url_prefix='/display')
app.register_blueprint(category_bp, url_prefix='/category')
app.register_blueprint(budget_analytics_bp, url_prefix='/budget_analytics')
app.register_blueprint(alerts_bp, url_prefix='/add_alerts')
app.register_blueprint(auth_bp)
app.register_blueprint(analytics_bp, url_prefix='/analytics')

       
if __name__ == '__main__':
    app.run(debug=True)
