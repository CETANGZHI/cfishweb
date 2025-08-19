from flask import Blueprint, jsonify, request
from src.models.nft import NFT
from src.models.user import User
from src.models import db
from flask_jwt_extended import jwt_required, get_jwt_identity

cart_bp = Blueprint("cart", __name__)

# In a real application, you would have a Cart model and CartItem model
# For now, we'll use a simple in-memory structure or directly interact with NFT data

# This is a simplified example. A real cart would involve a dedicated database table
# to store cart items for each user, handling quantities, and more complex logic.

# Mock cart data (replace with database interaction in a real app)
mock_carts = {}

@cart_bp.route("/cart/items", methods=["POST"])
@jwt_required()
def add_to_cart():
    current_user_id = get_jwt_identity()
    nft_id = request.json.get("nft_id", None)

    if not nft_id:
        return jsonify({"message": "Missing nft_id parameter"}), 400

    nft = NFT.query.get_or_404(nft_id)

    if current_user_id not in mock_carts:
        mock_carts[current_user_id] = []

    # Check if NFT is already in cart
    if any(item["nft_id"] == nft_id for item in mock_carts[current_user_id]):
        return jsonify({"message": "NFT already in cart"}), 409

    mock_carts[current_user_id].append({"nft_id": nft.id, "title": nft.title, "price": nft.price, "image_url": nft.image_ipfs_cid})

    return jsonify({"message": "NFT added to cart successfully", "cart_items": mock_carts[current_user_id]}), 200

@cart_bp.route("/cart", methods=["GET"])
@jwt_required()
def get_cart():
    current_user_id = get_jwt_identity()
    cart_items = mock_carts.get(current_user_id, [])
    return jsonify({"cart_items": cart_items}), 200

@cart_bp.route("/cart/items/<string:nft_id>", methods=["DELETE"])
@jwt_required()
def remove_from_cart(nft_id):
    current_user_id = get_jwt_identity()

    if current_user_id not in mock_carts:
        return jsonify({"message": "Cart not found for user"}), 404

    initial_len = len(mock_carts[current_user_id])
    mock_carts[current_user_id] = [item for item in mock_carts[current_user_id] if item["nft_id"] != nft_id]

    if len(mock_carts[current_user_id]) == initial_len:
        return jsonify({"message": "NFT not found in cart"}), 404

    return jsonify({"message": "NFT removed from cart successfully", "cart_items": mock_carts[current_user_id]}), 200


