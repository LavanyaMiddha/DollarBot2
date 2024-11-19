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
