import pytest
import os
from src.main import app
from src.models import db

@pytest.fixture(scope="session")
def app_context():
    os.environ["FLASK_ENV"] = "testing"
    with app.app_context():
        db.init_app(app)
        yield

@pytest.fixture(scope="function")
def client(app_context):
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

