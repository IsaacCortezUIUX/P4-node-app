import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    await axios.post('http://localhost:5000/chat/send', {
      receiver: receiverId,
      message,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setMessage('');
  };

  return (
    <div className="container">
      <h2>Chat</h2>
      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
