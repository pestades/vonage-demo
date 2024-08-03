import os
from dotenv import load_dotenv, find_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from requests.auth import HTTPBasicAuth
import vonage

    
"""
Service to managing messages using Vonage API

"""

load_dotenv(find_dotenv('../.env'))

app = Flask(__name__)
CORS(app)  # Enable CORS for all paths

vonageClient = vonage.Client(key=os.getenv('API_KEY'), secret=os.getenv('API_SECRET_KEY'))
vonageSms = vonage.Sms(vonageClient)

# Auth for Sandbox
myAuth = HTTPBasicAuth(os.getenv('API_KEY'), os.getenv('API_SECRET_KEY'))

@app.route('/messages', methods=['POST'])
def send_message():
    """
    Creates/sends a message.

    :param str environment: Production or Sandbox.
    :param str channel: Supperted Vonage channels.
    :param str message: Only text messages by now.
    """
    data = request.json
    environment = data.get('environment')
    channel = data.get('channel')
    message = data.get('message')
    
    match channel:
        case 'whatsapp':
            fromNumber = os.getenv('FROM_NUMBER')
            toNumber = os.getenv('TO_NUMBER')
        case 'facebook':
            fromNumber = os.getenv('FB_ID_FROM')
            toNumber = os.getenv('FB_ID_TO')
            channel = 'messenger'  # rename channel as per vonage naming conventions
        case 'instagram':
            fromNumber = os.getenv('IG_ID_FROM')
            toNumber = os.getenv('IG_ID_TO')
        case _:  # default to SMS
            fromNumber = 'Vonage'
            toNumber = os.getenv('TO_NUMBER')
        
    print(f"New message! Account balance is: {vonageClient.account.get_balance()}€, environment: {environment}, channel: {channel}, from: {fromNumber}, to: {toNumber}, message: {message} ")

    if environment == 'production':
        status, message = sendMessageProduction(channel, fromNumber, toNumber, message)
    else:
        status, message = sendMessageSandbox(channel, fromNumber, toNumber, message)

    if status == 'success':
        return jsonify({'status': 'success', 'message': 'Message sent successfully!'}), 200
    else:
        return jsonify({'status': 'error', 'message': message}), 500

def sendMessageProduction(channel, fromNumber, toNumber, message):
    """
    Uses the SDK, only supports SMS by now.
    """
    data = request.json
    message = data.get('message')

    response_data = vonageSms.send_message({
        'from': fromNumber,
        'to': toNumber,
        'text': 'python-service: ' + message,
    })

    if response_data['messages'][0]['status'] == '0':
        return 'success', 'Message sent successfully!'
    else:
        return 'error', response_data['messages'][0]['error-text']

def sendMessageSandbox(channel, fromNumber, toNumber, message):
    """
    Mimics Sandbox endpoints, don't supports SMS by now.
    """
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    payload = {
        'channel': channel,
        'message_type': 'text',
        'to': toNumber,
        'from': fromNumber,
        'text': message,
    }

    response = requests.post(url='https://messages-sandbox.nexmo.com/v1/messages', headers=headers, auth=myAuth, json=payload)
    responseData = response.json()
    if response.status_code == 202:
        return 'success', 'Message sent successfully!'
    else:
        return 'error', responseData.get('title', 'Unknown error')
    
if __name__ == '__main__':
    servicePort = os.getenv('PYTHON_SERVICE_PORT', 5000)
    app.run(port=servicePort, debug=True)
