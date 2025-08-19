from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import requests
import os

ipfs_bp = Blueprint("ipfs", __name__)

# Configuration for Pinata (or other IPFS pinning service)
PINATA_API_KEY = os.environ.get("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.environ.get("PINATA_SECRET_API_KEY")
PINATA_BASE_URL = "https://api.pinata.cloud/pinning/"

@ipfs_bp.route("/ipfs/pin", methods=["POST"])
@jwt_required()
def pin_ipfs_hash():
    data = request.json
    ipfs_hash = data.get("ipfs_hash", None)

    if not ipfs_hash:
        return jsonify({"message": "Missing ipfs_hash parameter"}), 400

    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        return jsonify({"message": "Pinata API keys not configured"}), 500

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "hashToPin": ipfs_hash
    }

    try:
        response = requests.post(PINATA_BASE_URL + "pinByHash", headers=headers, json=payload)
        response.raise_for_status() # Raise an exception for HTTP errors
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Failed to pin IPFS hash: {str(e)}"}), 500

@ipfs_bp.route("/ipfs/unpin", methods=["POST"])
@jwt_required()
def unpin_ipfs_hash():
    data = request.json
    ipfs_hash = data.get("ipfs_hash", None)

    if not ipfs_hash:
        return jsonify({"message": "Missing ipfs_hash parameter"}), 400

    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        return jsonify({"message": "Pinata API keys not configured"}), 500

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    }

    try:
        response = requests.delete(PINATA_BASE_URL + "unpin/pinByHash/" + ipfs_hash, headers=headers)
        response.raise_for_status() # Raise an exception for HTTP errors
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Failed to unpin IPFS hash: {str(e)}"}), 500

@ipfs_bp.route("/ipfs/upload", methods=["POST"])
@jwt_required()
def upload_file_to_ipfs():
    if "file" not in request.files:
        return jsonify({"message": "No file part in the request"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        return jsonify({"message": "Pinata API keys not configured"}), 500

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    }
    files = {
        "file": (file.filename, file.stream, file.content_type)
    }

    try:
        response = requests.post(PINATA_BASE_URL + "pinFileToIPFS", headers=headers, files=files)
        response.raise_for_status() # Raise an exception for HTTP errors
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Failed to upload file to IPFS: {str(e)}"}), 500

@ipfs_bp.route("/ipfs/pin_status/<string:ipfs_hash>", methods=["GET"])
@jwt_required()
def get_pin_status(ipfs_hash):
    if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
        return jsonify({"message": "Pinata API keys not configured"}), 500

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY,
    }

    try:
        response = requests.get(PINATA_BASE_URL + "pinJobs?ipfs_pin_hash=" + ipfs_hash, headers=headers)
        response.raise_for_status() # Raise an exception for HTTP errors
        return jsonify(response.json()), 200
    except requests.exceptions.RequestException as e:
        return jsonify({"message": f"Failed to get pin status: {str(e)}"}), 500


