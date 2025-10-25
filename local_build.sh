#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Ensure we're in the project root directory
cd "$(dirname "$0")"

# Activate virtual environment
source .venv/bin/activate

# Build and minify CSS using Tailwind standalone CLI
tailwindcss -i ./src/static/css/styles.css -o ./build/static/css/styles.css --minify

# Run the Python build script (handles directory setup, asset copying, HTML generation)
python3 main.py

# Deactivate virtual environment
deactivate

echo "Build completed successfully!"

# Start local development server
netlify dev --no-open
