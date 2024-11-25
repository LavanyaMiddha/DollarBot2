import pytest
from flask import Flask, json
from endpoints import analytics

app = Flask(__name__)
app.register_blueprint(analytics.analytics_bp)

MOCK_USER_DATA = {
    "9799570": {
        "data": [
            "19-June-2024,Utilities,50.0,$"
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

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_validate_analytics_None_request():
    assert analytics.validate_analytics_request(None) is False
    
def test_validate_analytics_empty_request():    
    assert analytics.validate_analytics_request("") is False

def test_validate_analytics_id_request():
    assert analytics.validate_analytics_request("9799571") is True

def test_returning_user_empty_data(client, mocker):
    mocker.patch('endpoints.helper', MockHelper)

    response = client.get('/9807451')
    assert response.status_code == 200
    assert json.loads(response.data) == {}

def test_returning_user_data(client, mocker):
    mocker.patch('endpoints.helper.getUserHistory', return_value=["19-June-2024,Utilities,50.0,$"])

    response = client.get('/9799570')
    assert response.status_code == 200
    assert json.loads(response.data) == [{"expense_date": "19-June-2024", "expense_category": "Utilities", "expense_amount": "50.0", "expense_currency": "$"}]
