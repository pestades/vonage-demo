import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f7f7f7;
  height: 100vh;
`;

const Title = styled.h1`
  color: #0070f3;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 300px;
  height: 100px;
  font-size: 16px;
`;

const Select = styled.select`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 320px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 20px 0;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #005bb5;
  }
`;

function App() {
  const [environment, setEnvironment] = useState('sandbox');
  const [serviceImplementation, setServiceImplementation] = useState('pythonService');
  const [channel, setChannel] = useState('facebook');
  const [message, setMessage] = useState('');

  const services = {
    pythonService: 'http://localhost:5000/messages',
    nodeService: 'http://localhost:5001/messages'
  };

  const handleServiceChange = (event) => {
    setServiceImplementation(event.target.value);
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      sendMessage();
    }
  };

  const sendMessage = async () => {  
    try {
      const response = await axios.post(services[serviceImplementation], {
        environment: environment,
        channel: channel,
        message: message,
      });
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  return (
    <Container>
    <div className="App">
      <h1>Send Messages Using Vonage!</h1>
      <div>
        <h3>Select Environment:</h3>
        <label>
          <input
            type="radio"
            value="sandbox"
            checked={environment === 'sandbox'}
            onChange={(e) => setEnvironment(e.target.value)}
          />
          Sandbox
        </label>
        <label>
          <input
            type="radio"
            value="production"
            checked={environment === 'production'}
            onChange={(e) => setEnvironment(e.target.value)}
          />
          Production
        </label>
      </div>
      <div>
        <h3>Select Service Implementation:</h3>
        <label>
          <input
            type="radio"
            value="pythonService"
            checked={serviceImplementation === 'pythonService'}
            onChange={handleServiceChange}
          />
          Python
        </label>
        <label>
          <input
            type="radio"
            value="nodeService"
            checked={serviceImplementation === 'nodeService'}
            onChange={handleServiceChange}
          />
          Node
        </label>
      </div>
      <div>
        <h3>Select Channel:</h3>  
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="viber">Viber</option>
        </select>
      </div>
      <div>
        <h3>Message:</h3> 
        <textarea cols="60" rows="2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message here, click button or press enter to send"
          onKeyDown={handleKeyPress}
        />
      </div>  
      <button onClick={sendMessage}>Send Message</button>    
    </div>
    </Container>
  );
}

export default App;
