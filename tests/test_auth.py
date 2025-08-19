import pytest
from src.models import db, User

def test_login_missing_data(client):
    response = client.post(
        "/api/v1/auth/login", json={}
    )
    assert response.status_code == 400
    assert "message" in response.json

def test_login_with_new_wallet_address(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "wallet_address": "new_test_wallet_address",
            "signature": "test_signature",
            "message": "test_message",
        },
    )
    assert response.status_code == 200
    assert "access_token" in response.json
    assert "refresh_token" in response.json
    assert "user" in response.json
    assert response.json["user"]["wallet_address"] == "new_test_wallet_address"

def test_refresh_token_without_token(client):
    response = client.post("/api/v1/auth/refresh")
    assert response.status_code == 401
    assert "msg" in response.json


