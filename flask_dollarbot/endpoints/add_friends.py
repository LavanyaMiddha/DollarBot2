from flask import Blueprint, request, jsonify
import  endpoints.helper as helper
from datetime import datetime
from model.user import User

add_friends_bp = Blueprint('friends', __name__)

def validate_add_request(chat_id, expense_date, expense_amount, expense_category):
    # validate input request 
    if not chat_id or not expense_date or not expense_category or not expense_amount:
        return False
    if datetime.strptime(expense_date, '%Y-%m-%d').date() > datetime.today().date():
        return False 
    if expense_category not in helper.getSpendCategories():
        return False
    if helper.validate_entered_amount(expense_amount) == 0:
        return False 
    return True 

@add_friends_bp.route('/add_friends', methods=['POST'])
def add_friends():
    """
    Add a single expense record. 
    
    Request JSON format:
    {
        "user_id" : "864914211",
        "amount" : "25.0",
        "date" : "2023-05-17",
        "category" : "Groceries",
        "currency" : "$"
        "friends": ["Alice", "Bob"]
    }

    Response  JSON format: 
    {
       "Expense record created succesfully"
    }
    """
    data = request.get_json()
    chat_id = data['user_id']
    friends = data['friends']

    print(friends)
    if friends in helper.getUserFriends(chat_id):
        return jsonify({'error': 'Friend'}), 400
    
    existing_user = User.query.filter_by(username=friends.strip()).first()
    if not existing_user:
        return jsonify({'error': 'Username not registered'}), 400
   # get all user data 
    user_list = helper.read_json()
    if user_list is None :
        user_list=dict() #Placeholder value
    # add new json for new user
    if str(chat_id) not in user_list:
        user_list[str(chat_id)] = {"data": [], "budget": {"long-term": [],"short-term": []   }, "friends": []}
    # write data

    record = friends.strip()
    print(friends)
    user_list[str(chat_id)]["friends"].append(record)
    helper.write_json(user_list)
    return jsonify({'message': 'Expense record created successfully'}), 200
