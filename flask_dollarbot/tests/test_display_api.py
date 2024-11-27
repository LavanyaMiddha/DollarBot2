import sys
import os

cwd = os.getcwd()
sys.path.append(cwd)

import pytest
from flask import Flask, json
from endpoints import display

app = Flask(__name__)
app.register_blueprint(display.display_bp)

MOCK_USER_DATA = {
    "9799570": {
        "data": [
            "19-June-2024,Utilities,50.0,$"
        ],
        "budget": {
            "long-term": [
                "2025-12-31,Long-Term,Food,10000,dollar"
            ],
            "short-term": [
                "2024-11-30,Short-Term,Food,50,dollar"
            ]
        },
        "friends": [
            "alex@gmail.com"
        ]
    },
    "9807451": {
        "data": [
            
        ]
    }
}

class MockHelper:
    @staticmethod
    def read_json():
        return MOCK_USER_DATA
    
    @staticmethod
    def getUserHistory(user_id):
        return MOCK_USER_DATA.get(str(user_id), {}).get("data", [])
    
    @staticmethod
    def getUserBudgetHistory(user_id):
        return MOCK_USER_DATA.get(str(user_id), {}).get("budget", [])
    
    @staticmethod
    def getUserFriends(user_id):
        return MOCK_USER_DATA.get(str(user_id), {}).get("friends", [])

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_display_user_budget_history_request(client, mocker):
    mocker.patch('endpoints.helper.getUserBudgetHistory', side_effect=MockHelper.getUserBudgetHistory)
    response = client.get("/budget/9799570")
    assert response.status_code == 200

def test_display_user_budget_history_missing_userid(client, mocker):
    mocker.patch('endpoints.helper.getUserBudgetHistory', side_effect=MockHelper.getUserBudgetHistory)
    response = client.get("/budget/")
    assert response.status_code ==404

def test_display_user_friends_request(client, mocker):
    mocker.patch('endpoints.helper.getUserFriends', side_effect=MockHelper.getUserFriends)
    response = client.get("/9799570/friends")
    assert response.status_code == 200
    assert json.loads(response.data) == [ "alex@gmail.com"]

def test_validate_analytics_None_request():
    assert display.validate_display_request(None) is False
    
def test_validate_analytics_empty_request():    
    assert display.validate_display_request("") is False

def test_validate_analytics_id_request():
    assert display.validate_display_request("9799570") is True

def test_returning_user_empty_data(client, mocker):
    mocker.patch('endpoints.helper', MockHelper)

    response = client.get("/9807451")
    assert response.status_code == 200
    assert json.loads(response.data) == {}

def test_returning_user_data(client, mocker):
    mocker.patch('endpoints.helper.getUserHistory', return_value=["19-June-2024,Utilities,50.0,$"])

    response = client.get('/9799570')
    assert response.status_code == 200
    assert json.loads(response.data) == [{"expense_date": "19-June-2024", "expense_category": "Utilities", "expense_amount": "50.0", "expense_currency": "$"}]
