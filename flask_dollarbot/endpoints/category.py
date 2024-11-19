from flask import Blueprint, request, jsonify
import endpoints.helper as helper

category_bp = Blueprint('category', __name__)

@category_bp.route('/', methods=['GET', 'POST','DELETE'])
def category_get_or_create_or_delete():
    if request.method == 'GET':
        # display all available categories 
        return helper.getSpendCategories(), 200
    if request.method == 'POST':
        """
            Create a new category. 
            Request JSON: 
            {
                "category_name" : "Fun"
            }
            Response JSON (all categories):
            ["Groceries", "Utility", "Fun"]
        """
        # create category 
        data = request.get_json()
        new_category = data["category_name"]
        # TODO update the budget for the new category as well, once the new budget api is created 
        helper.addSpendCategories(new_category)
        return helper.getSpendCategories(), 201
    if request.method == 'DELETE':
        """
            Delete an existing category. 
            Request JSON:
            {
                "category_name" : "Fun"
            }
            Response : 204 (success) or 404 (not found)
        """
        # TODO update this with budget deletion logic once those APIs are in place 
        data = request.get_json()
        category_to_be_deleted = data["category_name"]
        categories = helper.getSpendCategories()
        if category_to_be_deleted not in categories:
            return jsonify({"error": "Category not found"}), 404
        helper.deleteSpendCategories(category_to_be_deleted)
        return jsonify({"message": "Category deleted succesfully"}), 200

@category_bp.route('/update', methods=['POST'])
def update_category():
    """
        Update an existing category.
        Request JSON:
            {
                "existing_category_name" : "Fun",
                "new_category_name" : "Entertainment"
            }
        Response JSON (all categories):
        ["Groceries", "Utility", "Fun"]
    """
    data = request.get_json()
    selected_category = data["existing_category_name"]
    new_category = data["new_category_name"]
    # TODO update with budget logic once basic APIs are setup 
    categories = helper.getSpendCategories()
    if selected_category not in categories:
        return jsonify({"error": "Category not found"}), 404
    helper.deleteSpendCategories(selected_category)
    helper.addSpendCategories(new_category)
    return helper.getSpendCategories(), 200
    