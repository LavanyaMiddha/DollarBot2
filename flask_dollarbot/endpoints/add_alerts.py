from flask import Blueprint, request, jsonify
import  endpoints.helper as helper
from datetime import datetime
import re
from datetime import date

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
    notifications=[]
    categories=["Food","Groceries","Utilities","Transport","Shopping","Miscellaneous","Entertainment"]
    for category in categories:
        data = helper.getUserHistoryByCategory(user_id, category)
        today = date.today()
        month = today.month
        year = today.year
        monthly_expense =0
        yearly_expense=0
        short_term_budget=0
        long_term_budget=0
        for record in data:
            record=record.split(",")
            if int(year) == int(record[0][:4]) and int(month) == int(record[0][5:7]):
                monthly_expense = monthly_expense + int(record[2])
            if int(year) == int(record[0][:4]):
                yearly_expense = yearly_expense + int(record[2])
        data2 = helper.getUserBudgetHistoryByCategory(user_id, category)
        for record in data2:
            record=record.split(",")
            if int(year) == int(record[0][:4]) and int(month) == int(record[0][5:7]) and record[1]=="Short-Term":
                short_term_budget = int(record[3])

            elif int(year) == int(record[0][:4]) and record[1]=="Long-Term":
                long_term_budget = int(record[3])
        notes=[]
        notes.append(monthly_expense)
        notes.append(short_term_budget)
        if (monthly_expense >= short_term_budget):
            notes.append("Red")
        elif (monthly_expense >= (0.9*short_term_budget)):
            notes.append("Orange")
        elif(monthly_expense !=0 and monthly_expense >= (0.8*short_term_budget)):
            notes.append("Purple")
        else:
            notes.append("Green")
        notes.append(yearly_expense)
        notes.append(long_term_budget)
        if (yearly_expense >= long_term_budget):
            notes.append("Red")
        elif (yearly_expense >= (0.9*long_term_budget)):
            notes.append("Orange")
        elif(yearly_expense!=0 and yearly_expense >= (0.65*long_term_budget)):
            notes.append("Purple")
        else:
            notes.append("Green")  



        notifications.append({
        "Category" : category,
        "Monthly Expense": notes[0],
        "Monthly Budget" : notes[1],
        "color1" : notes[2],
        "Yearly Expense" : notes[3],
        "Yearly Budget" : notes[4],
        "color2" : notes[5] 
        })
    return jsonify(notifications)