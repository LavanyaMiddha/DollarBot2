import sys
import os

cwd = os.getcwd()
sys.path.append(cwd)
import pytest
from flask import Flask
from endpoints.add_friends import add_friends_bp, validate_add_request

# Set up Flask app and register blueprint
app = Flask(__name__)
app.register_blueprint(add_friends_bp)

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

    # @staticmethod
    # def user_exists(username):
    #     return username in MOCK_USER_DATA

    @staticmethod
    def getSpendCategories():
        return ["Groceries", "Utilities", "Entertainment"]

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

# def test_add_friends_success(client, mocker):
#     mocker.patch('endpoints.helper.read_json', return_value={
#         "864914211": {"friends": []},
#         "Bryan": {}
#     })
#     mocker.patch('endpoints.helper.write_json')
#     mocker.patch('endpoints.helper.getUserFriends', return_value=[])

#     response = client.post('/add_friends', json={
#         "user_id": "864914211",
#         "friends": ["Bryan"]
#     })
#     assert response.status_code == 200
#     assert response.get_json() == {'message': 'Friends Bryan added successfully'}

def test_add_friends_already_added(client, mocker):
    mocker.patch('endpoints.helper.getUserFriends', return_value=["Alice"])

    response = client.post('/add_friends', json={
        "user_id": "864914211",
        "friends": "Alice"
    })
    assert response.status_code == 400
    assert response.get_json() == {'error': 'Friend Already Added'}

# def test_add_friends_user_not_registered(client, mocker):
#     mocker.patch('endpoints.helper.getUserFriends', return_value=[])
#     mocker.patch('model.user.User.query.filter_by').return_value.first.return_value = True

#     response = client.post('/add_friends', json={
#         "user_id": "864914211",
#         "friends": "NonExistentUser"
#     })
#     assert response.status_code == 400
#     assert response.get_json() == {'error': 'Username not registered'}

def test_validate_add_request():
    assert validate_add_request("864914211", "2023-11-25", "25.0", "Groceries") == True
    assert validate_add_request("", "2023-11-25", "25.0", "Groceries") == False
    assert validate_add_request("864914211", "2025-11-25", "25.0", "Groceries") == False
    assert validate_add_request("864914211", "2023-11-25", "25.0", "InvalidCategory") == False
    assert validate_add_request("864914211", "2023-11-25", "-25.0", "Groceries") == False