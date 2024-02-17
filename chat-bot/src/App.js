import React, { useState } from 'react';
// code comment

const Chatbot = () => {
  const [conversation, setConversation] = useState([]);

  const apiUrl = 'https://api.together.xyz/v1/chat/completions';
  const apiKey = '6b464adb78258c5f74a8b2304d6ddd9a7269fbfd29db358d4c9386b0820b3856';

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  });

  const sendRequest = async (messages) => {
    const data = {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      max_tokens: 1024,
      messages
    };

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(apiUrl, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Failed to communicate with the chatbot API');
    }
  };

  const handleUserMessage = async (userMessage) => {
    const updatedConversation = [...conversation, { role: 'user', content: userMessage }];
    setConversation(updatedConversation);

    try {
      const botResponse = await sendRequest(updatedConversation);
      const botMessage = botResponse.choices[0]?.message?.content;
      setConversation([...updatedConversation, { role: 'bot', content: botMessage }]);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px', marginBottom: '10px' }}>
        {conversation.map((message, index) => (
          <div key={index} style={{ marginBottom: '5px', color: message.role === 'bot' ? 'green' : 'black' }}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleUserMessage(e.target.value);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};

export default Chatbot;
