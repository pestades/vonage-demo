import unittest
from unittest.mock import patch
from messagingService import app


class MessagingServiceTestCase(unittest.TestCase):

    @patch('vonage.Sms.send_message')
    def test_send_message_success(self, mock_send_message):
        # Configurar el mock para simular una respuesta exitosa de Vonage
        mock_send_message.return_value = {
            'messages': [{'status': '0'}]
        }
        
        tester = app.test_client(self)
        response = tester.post('/send-message', json={'message': 'Hello, World!'})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {'status': 'success', 'message': 'Message sent successfully!'})

    @patch('vonage.Sms.send_message')
    def test_send_message_failure(self, mock_send_message):
        # Configurar el mock para simular una respuesta de error de Vonage
        mock_send_message.return_value = {
            'messages': [{'status': '1', 'error-text': 'Insufficient balance'}]
        }

        tester = app.test_client(self)
        response = tester.post('/send-message', json={'message': 'Hello, World!'})

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {'status': 'error', 'message': 'Insufficient balance'})

if __name__ == '__main__':
    unittest.main()
