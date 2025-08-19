import pytest
from src.models import db, User, NFT

def test_get_sales_trends(client):
    response = client.get("/api/v1/analytics/sales-trends")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_category_distribution(client):
    response = client.get("/api/v1/analytics/category-distribution")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_user_activity(client):
    response = client.get("/api/v1/analytics/user-activity")
    assert response.status_code == 200
    assert "total_users" in response.json # This one is correct, it returns a dict

def test_get_top_nfts(client):
    response = client.get("/api/v1/analytics/top-nfts")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_revenue_analytics(client):
    response = client.get("/api/v1/analytics/revenue") # Corrected endpoint
    assert response.status_code == 200
    assert "total_revenue" in response.json # This one is correct, it returns a dict

def test_get_popular_creators(client):
    response = client.get("/api/v1/analytics/popular-creators")
    assert response.status_code == 200
    assert isinstance(response.json, list)


