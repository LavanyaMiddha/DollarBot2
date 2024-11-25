import pytest
from flask import Flask
from endpoints.add_friends import add_friends_bp, validate_add_request

# Set up Flask app and register blueprint
app = Flask(__name__)
app.register_blueprint(add_friends_bp)

MOCK_USER_DATA = {
    "864914211": {
        "data": [],
        "budget": {
            "long-term": [],
            "short-term": []
        },
        "friends": ["Charlie"]
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
    def getUserFriends(user_id):
        return MOCK_USER_DATA.get(str(user_id), {}).get("friends", [])

    @staticmethod
    def getSpendCategories():
        return ["Groceries", "Utilities", "Entertainment"]

    @staticmethod
    def validate_entered_amount(amount):
        try:
            float_amount = float(amount)
            return float_amount if float_amount > 0 else 0
        except ValueError:
            return 0

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_add_friends_success(client, mocker):
    mocker.patch('endpoints.helper.read_json', side_effect=MockHelper.read_json)
    mocker.patch('endpoints.helper.write_json', side_effect=MockHelper.write_json)
    mocker.patch('endpoints.helper.getUserFriends', side_effect=MockHelper.getUserFriends)
    mocker.patch('model.user.User.query.filter_by').return_value.first.return_value = True

    response = client.post('/add_friends', json={
        "user_id": "864914211",
        "friends": ["Alice"]
    })
    assert response.status_code == 200
    assert response.get_json() == {'message': 'Expense record created successfully'}

def test_add_friends_already_added(client, mocker):
    mocker.patch('endpoints.helper.getUserFriends', return_value=["Alice"])

    response = client.post('/add_friends', json={
        "user_id": "864914211",
        "friends": ["Alice"]
    })
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Friend Already Added'}

def test_add_friends_user_not_registered(client, mocker):
    mocker.patch('endpoints.helper.getUserFriends', return_value=[])
    mocker.patch('model.user.User.query.filter_by').return_value.first.return_value = None

    response = client.post('/add_friends', json={
        "user_id": "864914211",
        "friends": ["NonExistentUser"]
    })
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Username not registered'}

def test_validate_add_request():
    assert validate_add_request("864914211", "2023-11-25", "25.0", "Groceries") == True
    assert validate_add_request("", "2023-11-25", "25.0", "Groceries") == False
    assert validate_add_request("864914211", "2025-11-25", "25.0", "Groceries") == False
    assert validate_add_request("864914211", "2023-11-25", "25.0", "InvalidCategory") == False
    assert validate_add_request("864914211", "2023-11-25", "-25.0", "Groceries") == False