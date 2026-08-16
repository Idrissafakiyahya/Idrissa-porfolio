#!/bin/bash
# build.sh - Deployment script for Render

# Exit on error
set -e

# always run from the backend directory
cd "$(dirname "$0")"

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Create superuser if credentials provided via environment variables
if [ -n "$SUPERUSER_USERNAME" ] && [ -n "$SUPERUSER_PASSWORD" ]; then
  echo "Creating/updating superuser $SUPERUSER_USERNAME"
  python scripts/create_superuser.py
else
  echo "SUPERUSER_USERNAME or SUPERUSER_PASSWORD not set; skipping superuser creation"
fi

echo "Build completed successfully!"
