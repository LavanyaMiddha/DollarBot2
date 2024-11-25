from flask import Blueprint, request, jsonify
import  endpoints.helper as helper
from datetime import datetime
from calendar import monthrange

add_budget_bp = Blueprint('add_budget', __name__)

def validate_add_request(chat_id, expense_amount, expense_category, goal_type, expense_currency, goal_year, goal_month):
    # validate input request 
    if not chat_id or not expense_category or not expense_amount or not goal_type or not goal_month or not expense_currency or not goal_year:
        return False
    if expense_category not in helper.getSpendCategories():
        return False
    if helper.validate_entered_amount(expense_amount) == 0:
        return False 
    return True 


@add_budget_bp.route('/add_single', methods=['POST'])
def add_single():
    """
    Add a single budget record. 
    
    Request JSON format:
    {
        "user_id" : "864914211",
        "amount" : "25.0",
        "year:   :  "2024"
        "month"  :  "1"
        "goal_type" : "Long-Term"
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
    goal_type = str(data['goal_type'])
    expense_amount = data['amount']
    expense_currency = str(data['currency'])
    expense_category = str(data['category'])
    goal_year = int(data["year"])
    goal_month = int(data["month"])

    if not validate_add_request(chat_id, expense_amount, expense_category, goal_type, expense_currency, goal_year, goal_month):
        return jsonify({'error': 'Bad Request'}), 400

    if goal_type.strip() == "Long-Term":
        goal_month=12
    last_day = monthrange(goal_year, goal_month)[1]
    budget_date = f"{goal_year:04d}-{goal_month:02d}-{last_day:02d}"
    date_str, category_str, goal_str, amount_str = (
        budget_date,
        str(expense_category),
        str(goal_type),
        str(expense_amount),
    )
    # get all user data 
    user_list = helper.read_json()
    if user_list is None :
        user_list=dict() #Placeholder value
    # add new json for new user
    if str(chat_id) not in user_list:
        user_list[str(chat_id)] = {"data": [], "budget": {"long-term": [],"short-term": []   }}
    # write data
    if goal_str.strip() == "Short-Term":
        record = "{},{},{},{},{}".format(date_str, goal_str, category_str, amount_str, expense_currency)
        user_list[str(chat_id)]["budget"]["short-term"].append(record)
        helper.write_json(user_list)
    else:
        record = "{},{},{},{},{}".format(date_str, goal_str, category_str, amount_str, expense_currency)
        user_list[str(chat_id)]["budget"]["long-term"].append(record)
        helper.write_json(user_list)
  
    return jsonify({'message': 'Budget record created successfully'}), 200
    

