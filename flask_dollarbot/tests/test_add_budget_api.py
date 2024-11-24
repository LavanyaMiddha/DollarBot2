import sys
import os

cwd = os.getcwd()
sys.path.append(cwd)
import pytest
from flask import Flask 
from datetime import datetime, timedelta
from endpoints.add_budget import add_budget_bp, validate_add_request
from endpoints.helper import read_json

# Set up Flask app and register blueprint 
app = Flask(__name__)
app.register_blueprint(add_budget_bp)

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
    def validate_entered_amount(amount):
        return 1 if amount.isdigit() and float(amount) > 0 else 0

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# Test request validation method
def test_validate_add_request_empty_request():
    assert validate_add_request(None, None, None, None, None, None, None) == False


def test_add_single_budget(client, mocker):
    mocker.patch('endpoints.helper', MockHelper)
    response = client.post('/add_single', json={
            "user_id": "864914211",
            "amount": "50.0",
            "year": "2024",
            "month": "2",
            "goal_type": "Short-Term",
            "category": "Vaccation",
            "currency": "$"
        }
    )
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Bad Request'}

def test_add_single_budget(client, mocker):
    mocker.patch('endpoints.helper', MockHelper)
    response = client.post('/add_single', json={
            "user_id": "864914211",
            "amount": "50.0",
            "year": "2024",
            "month": "2",
            "goal_type": "Short-Term",
            "category": "Groceries",
            "currency": "$"
        }
    )
    assert response.status_code == 200
    assert response.get_json() == {'message': 'Budget record created successfully'}

def test_add_single_invalid_amount(client, mocker):
    mocker.patch('endpoints.helper', MockHelper)
    response = client.post('/add_single', json={
            "user_id": "864914211",
            "amount": "abcd",
            "year": "2024",
            "month": "2",
            "goal_type": "Short-Term",
            "category": "Groceries",
            "currency": "$"
        }
    )
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Bad Request'}


def test_add_single_missing_field(client, mocker):
    mocker.patch('endpoints.helper', MockHelper)
    request_date = datetime.today() + timedelta(days=1)
    response = client.post('/add_single', json={
            "user_id": "864914211",
            "amount": "50.0",
            "year": "2024",
            "month": "2",
            "category": "Groceries",
            "currency": "$"
        }
    )
    assert response.status_code == 500
    

def test_validate_add_request_invalid_category():
    assert validate_add_request("21837", 23, "Random", "Long-Term", "dollar", "2024", "12") == False

def test_validate_add_request_invalid_amount():
    assert validate_add_request("21837", -23, "Random", "Long-Term", "dollar", "2024", "12") == False
    assert validate_add_request("21837", "abc", "Random", "Long-Term", "dollar", "2024", "12") == False