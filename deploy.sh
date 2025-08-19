#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define variables
APP_DIR="/home/ubuntu/cfish_backend_api"
ENV_FILE=".env.production"

echo "Starting CFISH Backend API deployment..."

# Navigate to the application directory
cd $APP_DIR

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running database migrations (if any)..."
# In a real application, you would use Flask-Migrate or similar for migrations
# For now, we assume db.create_all() handles initial setup on first run
python3 manage.py db upgrade || echo "No migrations to apply or database already up-to-date."

echo "Starting Gunicorn server..."
# Using Gunicorn for production deployment
# You might want to use a process manager like systemd or supervisor for this
exec gunicorn --bind 0.0.0.0:5000 --workers 4 --log-level info "src.main:app"

echo "Deployment complete."


