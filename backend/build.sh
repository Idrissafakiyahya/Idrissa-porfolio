#!/bin/bash
# build.sh - Deployment script for Render

# Exit on error
set -e

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

echo "Build completed successfully!"
