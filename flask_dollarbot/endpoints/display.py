from flask import Blueprint, request, jsonify
import  endpoints.helper as helper

display_bp = Blueprint('display', __name__)

def validate_display_request(user_id):
    if not user_id:
        return False
    return True

def build_dictionary(expense_record):
    expense_details = expense_record.split(',')
    expense_currency="dollar"
    if len(expense_details)>=4:
        expense_currency=expense_details[3]
    return {
        "expense_date" : expense_details[0],
        "expense_category" : expense_details[1],
        "expense_amount": expense_details[2],
        "expense_currency": expense_currency
    }

def build_budget_dictionary(budget_data):
    print("Hi")
    print(budget_data)
    budget_details = budget_data.split(',')
    return {
        "budget_date" : budget_details[0],
        "budget_type" : budget_details[1],
        "budget_category" : budget_details[2],
        "budget_amount": budget_details[3],
        "expense_currency": budget_details[4]
    }
        

@display_bp.route('/<user_id>', methods=['GET'])
def display_user_expense_history(user_id=None):
    """
        Display all expenses of a given user.


    """
    if not validate_display_request(user_id):
        return jsonify({'error': 'Bad Request'}), 400
    
    helper.read_json()
    chat_id = user_id
    history = helper.getUserHistory(chat_id)
    print(history)
    if history is None:
        # no spending history for user
        return jsonify({}), 200 
    else:
        result = [build_dictionary(expense_record) for expense_record in history]
        return jsonify(result), 200


@display_bp.route('/budget/<user_id>', methods=['GET'])
def display_user_budget_history(user_id=None):
    """
        Display all budget goals of a given user.


    """
    if not validate_display_request(user_id):
        return jsonify({'error': 'Bad Request'}), 400
    
    helper.read_json()
    chat_id = user_id
    history = helper.getUserBudgetHistory(chat_id)
    print(history)
    if history is None:
        # no spending history for user
        return jsonify({}), 200 
    else:
        result=[]
        for budget_record in history:
            temp = [build_budget_dictionary(y) for y in history[budget_record]]
            result=result+temp
        return jsonify(result), 200