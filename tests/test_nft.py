import pytest
from src.models import db, NFT, User

def test_get_nfts_list(client):
    response = client.get("/api/v1/nfts")
    assert response.status_code == 200
    data = response.json
    assert "nfts" in data
    assert "total" in data

def test_get_nft_detail(client):
    # Create test user
    with client.application.app_context():
        test_user = User(
            wallet_address="test_wallet_123",
            username="testuser",
            display_name="Test User",
        )
        db.session.add(test_user)
        db.session.commit()
        # Create test NFT
        test_nft = NFT(
            title="Test NFT",
            description="Test Description",
            image_ipfs_cid="Qma123",
            price=100.0,
            category="Art",
            creator_id=test_user.id,
            current_owner_id=test_user.id,
        )
        db.session.add(test_nft)
        db.session.commit()
        nft_id = test_nft.id # Get the actual ID of the created NFT

    response = client.get(f"/api/v1/nfts/{nft_id}") # Use the actual NFT ID
    assert response.status_code == 200
    data = response.json
    assert data["title"] == "Test NFT"

def test_get_nonexistent_nft(client):
    response = client.get("/api/v1/nfts/999")
    assert response.status_code == 404

def test_search_nfts(client):
    # Create test user
    with client.application.app_context():
        test_user = User(
            wallet_address="test_wallet_456",
            username="testuser2",
            display_name="Test User 2",
        )
        db.session.add(test_user)
        db.session.commit()
        # Create test NFT
        test_nft = NFT(
            title="Searchable NFT",
            description="This is a test NFT for search",
            image_ipfs_cid="Qmb456",
            price=200.0,
            category="Photography",
            creator_id=test_user.id,
            current_owner_id=test_user.id,
        )
        db.session.add(test_nft)
        db.session.commit()

    response = client.get("/api/v1/nfts?search=Searchable")
    assert response.status_code == 200
    data = response.json
    assert len(data["nfts"]) > 0


