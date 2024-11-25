#import sys
#import os

#cwd = os.getcwd()
#sys.path.append(cwd)

import pytest
from flask import Flask 
from datetime import datetime, timedelta
from endpoints.budget_analytics import budget_analytics_bp, validate_display_request
from endpoints.helper import read_json, getUserBudgetHistory, getUserHistory

# Set up Flask app and register blueprint 
app = Flask(__name__)
app.register_blueprint(budget_analytics_bp)

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
    def getUserHistory(user_id):
        print("Hi i reached here")
        print(MOCK_USER_DATA)
        return MOCK_USER_DATA.get(str(user_id), {}).get("data", [])
    
    @staticmethod
    def getUserBudgetHistory(user_id):
        print(MOCK_USER_DATA)
        return MOCK_USER_DATA.get(str(user_id), {}).get("budget", [])

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_shorterm_budget_analytics(client, mocker):
    mocker.patch('endpoints.helper.getUserBudgetHistory', side_effect=MockHelper.getUserBudgetHistory)
    mocker.patch('endpoints.helper.getUserHistory', side_effect=MockHelper.getUserHistory)
    response = client.get('/add_analytics/Food/2024/11/864914211')
    assert response.status_code == 200

def test_longterm_budget_analytics(client, mocker):
    mocker.patch('endpoints.helper.getUserBudgetHistory', side_effect=MockHelper.getUserBudgetHistory)
    mocker.patch('endpoints.helper.getUserHistory', side_effect=MockHelper.getUserHistory)
    response = client.get('/add_analytics/Food/2025/12/864914211')
    assert response.status_code == 200

def test_validate_display_request():
    assert(validate_display_request("")== False)
    assert(validate_display_request("1234")== True)