# Messaging Service implemented in Python

Currently supports SMS in Production and the rest of channels in Sandbox.

## Run service:
    python messagingService.py

## Installation:
    python -m venv venv
    source venv/bin/activate
    pip install python-dotenv flask flask-cors vonage

## Testing
    pip install requests-mock
    python -m unittest discover -s tests

