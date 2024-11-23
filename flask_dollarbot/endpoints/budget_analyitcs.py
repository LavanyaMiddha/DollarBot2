from flask import Blueprint, request, jsonify
import  endpoints.helper as helper
from datetime import datetime

def validate_display_request(user_id):
    if not user_id:
        return False
    return True

def build_budget_dictionary(budget_data):
    budget_details = budget_data.split(',')
    return {
        "budget_date" : budget_details[0],
        "budget_type" : budget_details[1],
        "budget_category" : budget_details[2],
        "budget_amount": budget_details[3],
        "expense_currency": budget_details[4]
    }
        
budget_analytics_bp = Blueprint('budget_analytics', __name__)

@budget_analytics_bp.route('/add_analytics', methods=['GET'])
def add_analytics(user_id=None):
    """
        Display all budget analytics of a given user.


    """
    if not validate_display_request(user_id):
        return jsonify({'error': 'Bad Request'}), 400
    
    helper.read_json()
    chat_id = user_id
    history = helper.getUserBudgetHistoryByGoal(chat_id, "long-term")
    print(history)
    if history is None:
        # no spending history for user
        return jsonify({"No Long Term Goals yet!"}), 200 
    else:
        result=[]
        result = [build_budget_dictionary(y) for y in history]
        return jsonify(result), 200
