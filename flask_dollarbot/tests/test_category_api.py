import pytest
from flask import Flask, json
from endpoints.category import category_bp
import endpoints.helper as helper

@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(category_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_get_categories(client, mocker):
    mock_categories = ["Groceries", "Utility", "Fun"]
    mocker.patch('endpoints.helper.getSpendCategories', return_value=mock_categories)
    
    response = client.get('/')
    assert response.status_code == 200
    assert json.loads(response.data) == mock_categories

def test_create_category(client, mocker):
    mock_categories = ["Groceries", "Utility", "Fun"]
    mocker.patch('endpoints.helper.addSpendCategories')
    mocker.patch('endpoints.helper.getSpendCategories', return_value=mock_categories)
    
    response = client.post('/', json={"category_name": "Entertainment"})
    assert response.status_code == 201
    assert json.loads(response.data) == mock_categories
    helper.addSpendCategories.assert_called_once_with("Entertainment")

def test_delete_category(client, mocker):
    mock_categories = ["Groceries", "Utility", "Fun"]
    mocker.patch('endpoints.helper.getSpendCategories', return_value=mock_categories)
    mocker.patch('endpoints.helper.deleteSpendCategories')
    
    response = client.delete('/', json={"category_name": "Fun"})
    assert response.status_code == 200
    assert json.loads(response.data) == {"message": "Category deleted succesfully"}
    helper.deleteSpendCategories.assert_called_once_with("Fun")

def test_update_category(client, mocker):
    # Mock getSpendCategories to return different values on successive calls
    mock_get_categories = mocker.patch('endpoints.helper.getSpendCategories')
    mock_get_categories.side_effect = [
        ["Groceries", "Utility", "Fun"],  # First call (to check if category exists)
        ["Groceries", "Utility", "Entertainment"]  # Second call (after update)
    ]

    mocker.patch('endpoints.helper.deleteSpendCategories')
    mocker.patch('endpoints.helper.addSpendCategories')

    response = client.post('/update', json={"existing_category_name": "Fun", "new_category_name": "Entertainment"})
    assert response.status_code == 200
    assert response.json == ["Groceries", "Utility", "Entertainment"]

    # Verify that deleteSpendCategories and addSpendCategories were called correctly
    helper.deleteSpendCategories.assert_called_once_with("Fun")
    helper.addSpendCategories.assert_called_once_with("Entertainment")

def test_delete_nonexistent_category(client, mocker):
    mock_categories = ["Groceries", "Utility"]
    mocker.patch('endpoints.helper.getSpendCategories', return_value=mock_categories)
    
    response = client.delete('/', json={"category_name": "Fun"})
    assert response.status_code == 404
    assert json.loads(response.data) == {"error": "Category not found"}

def test_update_nonexistent_category(client, mocker):
    mock_categories = ["Groceries", "Utility"]
    mocker.patch('endpoints.helper.getSpendCategories', return_value=mock_categories)
    
    response = client.post('/update', json={"existing_category_name": "Fun", "new_category_name": "Entertainment"})
    assert response.status_code == 404
    assert json.loads(response.data) == {"error": "Category not found"}