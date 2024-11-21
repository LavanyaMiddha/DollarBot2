from flask import Blueprint, request, jsonify
import  endpoints.helper as helper
from datetime import datetime


add_budget_bp = Blueprint('add_budget', __name__)

@add_budget_bp.route('/add_single', methods=['POST'])
def add_single():
    """
    Add a single expense record. 
    
    Request JSON format:
    {
        "user_id" : "864914211",
        "amount" : "25.0",
        "date" : "2023-05-17",
        "category" : "Groceries",
        "currency" : "$"
    }

    Response  JSON format: 
    {
       "Expense record created succesfully"
    }
    """
    data = request.get_json()
    chat_id = data['user_id']
    budget_date = data['date']
    goal_type = data['goal_type']
    expense_amount = data['amount']
    expense_currency = str(data['currency'])
    print("Hello")
    user_list = helper.read_json()
    data_edit = helper.getUserHistory(chat_id)
    print(data_edit)
    return jsonify({'message': 'Expense record created successfully'}), 200
    

