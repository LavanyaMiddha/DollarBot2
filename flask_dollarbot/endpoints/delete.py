from flask import Blueprint, request, jsonify
from datetime import datetime
import endpoints.helper as helper

# Create a Blueprint for delete operations
delete_bp = Blueprint('delete', __name__)

@delete_bp.route('/delete_by_date', methods=['DELETE'])
def delete_by_date():
    """
    Delete records for a specific date.
    Request JSON format:
    {
        "user_id": "864914211",
        "date": "17-May-2023"
    }
    Returns:
        JSON response indicating success or failure.
    """
    data = request.json
    user_id = data.get('user_id')
    date_str = data.get('date')

    if not user_id or not date_str:
        return jsonify({'error': 'Invalid input'}), 400

    # Get user history and filter records based on the date
    records_to_delete = helper.getUserHistoryByDate(user_id, date_str)
    if not records_to_delete:
        return jsonify({'message': f'No transactions found for {date_str}'}), 404

    user_list = helper.read_json()
    if str(user_id) in user_list:
        user_data = user_list[str(user_id)].get('data', [])
        user_data = [record for record in user_data if record not in records_to_delete]
        user_list[str(user_id)]['data'] = user_data
        helper.write_json(user_list)

    return jsonify({'message': f'Records for {date_str} deleted successfully'}), 200


@delete_bp.route('/delete_all', methods=['DELETE'])
def delete_all():
    """
    Delete all records for a user.
    Request JSON format:
    {
        "user_id": "864914211"
    }
    Returns:
        JSON response indicating success or failure.
    """
    data = request.json
    user_id = data.get('user_id')

    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400

    user_list = helper.read_json()
    if str(user_id) in user_list:
        user_list[str(user_id)]["data"] = []
        user_list[str(user_id)]["budget"]["overall"] = "0"
        user_list[str(user_id)]["budget"]["category"] = {}
        helper.write_json(user_list)

    return jsonify({'message': 'All records deleted successfully'}), 200


@delete_bp.route('/deletebyids', methods=['DELETE'])
def delete_by_ids():
    """
    Delete all records for a user based on the ids.
    Request JSON format:
    {
        "user_id": "864914211",
        "ids_to_delete":[0,1,4,6],
    }
    Returns:
        JSON response indicating success or failure.
    """
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    ids_to_delete=data.get("ids_to_delete")
    if not ids_to_delete:
        return jsonify({'error': 'Ids to delete are required'}), 400

    ids_to_delete.sort(reverse=True)

    

    user_list = helper.read_json()
    if str(user_id) in user_list:
        for i in ids_to_delete:
            del user_list[str(user_id)]["data"][i]
        helper.write_json(user_list)

    return jsonify({'message': 'All records deleted successfully'}), 200