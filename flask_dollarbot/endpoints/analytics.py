from flask import Blueprint, request, jsonify
import endpoints.helper as helper

analytics_bp = Blueprint('analytics', __name__)

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

@analytics_bp.route('/<user_id>', methods=['GET'])
def find_data(user_id = None):
    helper.read_json()
    chat_id = user_id

    data = helper.getUserHistory(chat_id)

    result = [build_dictionary(expense_record) for expense_record in data]
    print("Result:", result)
    return jsonify(result), 200
