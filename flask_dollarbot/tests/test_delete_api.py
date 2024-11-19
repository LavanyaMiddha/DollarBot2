import pytest
from flask import Flask, jsonify
from flask.testing import FlaskClient
from unittest.mock import patch
from endpoints.delete import delete_bp 
@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(delete_bp)
    with app.test_client() as client:
        yield client

@patch("endpoints.helper.getUserHistoryByDate")
@patch("endpoints.helper.read_json")
@patch("endpoints.helper.write_json")
def test_delete_by_date_success(mock_write_json, mock_read_json, mock_getUserHistoryByDate, client: FlaskClient):
    mock_getUserHistoryByDate.return_value = [{"record": "data"}]
    mock_read_json.return_value = {"864914211": {"data": [{"record": "data"}]}}
    response = client.delete("/delete_by_date", json={"user_id": "864914211", "date": "17-May-2023"})
    assert response.status_code == 200
    assert response.json == {"message": "Records for 17-May-2023 deleted successfully"}

def test_delete_by_date_invalid_input(client: FlaskClient):
    response = client.delete("/delete_by_date", json={"user_id": "864914211"})
    assert response.status_code == 400
    assert response.json == {"error": "Invalid input"}

@patch("endpoints.helper.getUserHistoryByDate")
def test_delete_by_date_no_records_found(mock_getUserHistoryByDate, client: FlaskClient):
    mock_getUserHistoryByDate.return_value = []
    response = client.delete("/delete_by_date", json={"user_id": "864914211", "date": "17-May-2023"})
    assert response.status_code == 404
    assert response.json == {"message": "No transactions found for 17-May-2023"}

@patch("endpoints.helper.read_json")
@patch("endpoints.helper.write_json")
def test_delete_all_success(mock_write_json, mock_read_json, client: FlaskClient):
    mock_read_json.return_value = {"864914211": {"data": ["data"], "budget": {"overall": "100", "category": {"food": "50"}}}}
    response = client.delete("/delete_all", json={"user_id": "864914211"})
    assert response.status_code == 200
    assert response.json == {"message": "All records deleted successfully"}

def test_delete_all_invalid_input(client: FlaskClient):
    response = client.delete("/delete_all", json={})
    assert response.status_code == 400
    assert response.json == {"error": "User ID is required"}

@patch("endpoints.helper.read_json")
@patch("endpoints.helper.write_json")
def test_delete_by_ids_success(mock_write_json, mock_read_json, client: FlaskClient):
    mock_read_json.return_value = {"864914211": {"data": ["record0", "record1", "record2", "record3"]}}
    response = client.delete("/deletebyids", json={"user_id": "864914211", "ids_to_delete": [1, 3]})
    assert response.status_code == 200
    assert response.json == {"message": "All records deleted successfully"}

def test_delete_by_ids_invalid_input_user_id(client: FlaskClient):
    response = client.delete("/deletebyids", json={"ids_to_delete": [1, 3]})
    assert response.status_code == 400
    assert response.json == {"error": "User ID is required"}

def test_delete_by_ids_invalid_input_ids(client: FlaskClient):
    response = client.delete("/deletebyids", json={"user_id": "864914211"})
    assert response.status_code == 400
    assert response.json == {"error": "Ids to delete are required"}

@patch("endpoints.helper.read_json")
@patch("endpoints.helper.write_json")
def test_delete_all_no_records(mock_write_json, mock_read_json, client: FlaskClient):
    """Test deleting all records when user exists but has no records."""
    mock_read_json.return_value = {"864914211": {"data": [], "budget": {"overall": "0", "category": {}}}}
    response = client.delete("/delete_all", json={"user_id": "864914211"})
    assert response.status_code == 200
    assert response.json == {"message": "All records deleted successfully"}




@patch("endpoints.helper.read_json")
@patch("endpoints.helper.write_json")
def test_delete_all_ensure_budget_reset(mock_write_json, mock_read_json, client: FlaskClient):
    """Test that deleting all records resets the user's budget data."""
    mock_read_json.return_value = {"864914211": {"data": ["record1"], "budget": {"overall": "100", "category": {"food": "50"}}}}
    response = client.delete("/delete_all", json={"user_id": "864914211"})
    assert response.status_code == 200
    mock_write_json.assert_called_once()
    user_data = mock_write_json.call_args[0][0]
    assert user_data["864914211"]["budget"]["overall"] == "0"
    assert user_data["864914211"]["budget"]["category"] == {}

