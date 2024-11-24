import unittest
import sys
import os
cwd = os.getcwd()
sys.path.append(cwd)
from flask import Flask
from endpoints.add_budget import add_budget_bp  
import json

class TestAddBudget(unittest.TestCase):
    def setUp(self):
        """Set up the Flask app and test client."""
        self.app = Flask(__name__)
        self.app.register_blueprint(add_budget_bp)
        self.client = self.app.test_client()

    def test_add_single_success(self):
        """Test adding a valid budget record."""
        payload = {
            "user_id": "864914211",
            "amount": "25.0",
            "year": "2024",
            "month": "1",
            "goal_type": "Long-Term",
            "category": "Groceries",
            "currency": "$"
        }
        response = self.client.post('/add_single', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Budget record created successfully')

    def test_add_single_missing_fields(self):
        """Test adding a budget record with missing fields."""
        payload = {
            "user_id": "864914211",
            "amount": "25.0",
            "year": "2024",
            "month": "1",
            "goal_type": "Long-Term",
            "category": "Groceries"
        }  # Missing 'currency'
        response = self.client.post('/add_single', json=payload)
        self.assertEqual(response.status_code, 500) 

    def test_add_single_invalid_amount(self):
        """Test adding a budget record with an invalid amount."""
        payload = {
            "user_id": "864914211",
            "amount": "invalid_amount",  # Invalid amount format
            "year": "2024",
            "month": "1",
            "goal_type": "Long-Term",
            "category": "Groceries",
            "currency": "$"
        }
        response = self.client.post('/add_single', json=payload)
        self.assertEqual(response.status_code, 400)  

    def test_add_single_long_term_goal(self):
        """Test adding a long-term goal budget record."""
        payload = {
            "user_id": "864914211",
            "amount": "100.0",
            "year": "2024",
            "month": "1",
            "goal_type": "Long-Term",
            "category": "Vacation",
            "currency": "$"
        }
        response = self.client.post('/add_single', json=payload)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['error'], 'Bad Request')
    
    def test_add_single_short_term_goal(self):
        """Test adding a short-term goal budget record."""
        payload = {
            "user_id": "864914211",
            "amount": "50.0",
            "year": "2024",
            "month": "2",
            "goal_type": "Short-Term",
            "category": "Groceries",
            "currency": "$"
        }
        response = self.client.post('/add_single', json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Budget record created successfully')

if __name__ == '__main__':
    unittest.main()
