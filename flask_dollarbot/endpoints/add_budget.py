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
    expense_category = str(data['category'])

    print("User ID", chat_id)
    print("Budget Date", budget_date)
    print("Goal Type", goal_type)
    print("Expense Amount", expense_amount)
    print("Expense Currency", expense_currency)
    print("Expense Category", expense_category)

    print("Hello")
    user_list = helper.read_json()
    data_edit = helper.getUserBudgetHistory(chat_id)
    print(data_edit)
    
    date_str, category_str, goal_str, amount_str = (
        budget_date,
        str(expense_category),
        str(goal_type),
        str(expense_amount),
    )
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
    

