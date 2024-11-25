import sys
import os

cwd = os.getcwd()
sys.path.append(cwd)

import pytest
from flask import Flask 
from datetime import datetime, timedelta
from endpoints.add_alerts import alerts_bp, validate_display_request

# Set up Flask app and register blueprint 
app = Flask(__name__)
app.register_blueprint(alerts_bp)

MOCK_USER_DATA = {
    "864914211": {
       "data": [
            "2024-11-19,Utilities,7, dollar"
        ],
        "budget": {
            "long-term": [
                "2025-12-31,Long-Term,Food,10000,dollar"
            ],
            "short-term": [
                "2024-11-30,Short-Term,Food,50,dollar"
            ]
        }
    }
}

class MockHelper:
    @staticmethod
    def read_json():
        return MOCK_USER_DATA

    @staticmethod
    def write_json(data):
        pass

    @staticmethod
    def validate_display_request(user_id):
        if not user_id:
            return False
        return True

    @staticmethod
    def getUserHistoryByCategory(user_id, category):
        data = MOCK_USER_DATA.get(str(user_id), {}).get("data", [])
        previous_expenses = []
        for record in data:
            if f",{category}," in record:
                previous_expenses.append(record)
        return previous_expenses
    
    @staticmethod
    def getUserBudgetHistoryByCategory(user_id, category):
        data = MOCK_USER_DATA.get(str(user_id), {}).get("budget", [])
        previous_expenses = []
        for goals in data:
            for record in data[goals]:
                if f"{category}" in record:
                    previous_expenses.append(record)
        return previous_expenses

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_shorterm_budget_analytics(client, mocker):
    mocker.patch('endpoints.helper.getUserBudgetHistoryByCategory', side_effect=MockHelper.getUserBudgetHistoryByCategory)
    mocker.patch('endpoints.helper.getUserHistoryByCategory', side_effect=MockHelper.getUserHistoryByCategory)
    response = client.get('/alerts/864914211')
    assert response.status_code == 200

def test_longterm_budget_analytics(client, mocker):
    mocker.patch('endpoints.helper.getUserBudgetHistoryByCategory', side_effect=MockHelper.getUserBudgetHistoryByCategory)
    mocker.patch('endpoints.helper.getUserHistoryByCategory', side_effect=MockHelper.getUserHistoryByCategory)
    response = client.get('/alerts/864914211')
    assert response.status_code == 200

def test_validate_display_request():
    assert(validate_display_request("")== False)
    assert(validate_display_request("1234")== True)