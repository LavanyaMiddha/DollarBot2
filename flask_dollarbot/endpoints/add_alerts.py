from flask import Blueprint, request, jsonify
import  endpoints.helper as helper
from datetime import datetime
import re

def validate_display_request(user_id):
    if not user_id:
        return False
    return True
        
alerts_bp = Blueprint('alerts', __name__)

@alerts_bp.route('/alerts/<user_id>', methods=['GET'])
def add_alerts(category=None, year=None, month=None, user_id=None):
    """
        Display all budget analytics of a given user.


    """
    validate_display_request(user_id)
    data = helper.getUserBudgetHistory(user_id)
    #print(data)
    resp=dict()
    for goal_type in data:
        for goals in data[goal_type]:
            goals=goals.split(",")
            if str(goal_type).strip()=="long-term" and category in goals and int(year) == int(goals[0][:4]):
                resp["Long-Term"]=goals[3]
            elif str(goal_type).strip()=="short-term" and category in goals and int(year) == int(goals[0][:4]) and int(month) == int(goals[0][5:7]):
                print("Helooo")
                resp["Short-Term"]=goals[3]
    
    data2= helper.getUserHistory(user_id)
    total_expense=0
    for expense in data2:
        expense=expense.split(",")
        if category in expense and re.search(year, expense[0]) and re.search(month, expense[0]):
            total_expense = total_expense + int(expense[2])
    resp["Expenditure"]=total_expense
    print(resp)
    print("Hi I have reached here", category)

    long_term_budget=0
    short_term_budget=0

    for x in resp:
        if x == "Short-Term":
            short_term_budget = resp[x]
        elif x == "Long-Term":
            long_term_budget = resp[x]
        
    analytics_data = []
    labels=["Expenditure", "Short-Term", "Long-Term"]
    values = [total_expense, short_term_budget, long_term_budget]
    analytics_data = {
        "labels" : labels,
        "values" : values
    }
    #category = request.args.get('category')
    return jsonify(analytics_data)  