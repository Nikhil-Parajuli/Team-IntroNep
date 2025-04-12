
    
    function sendMessage() {
      const input = document.getElementById('user-input');
      const userText = input.value.trim();
      if (!userText) return;
      
      addMessage('user', userText);
      input.value = '';
      
     
      setTimeout(() => {
        const responses = [
          "I hear you. Would you like to share more about that?",
          "That sounds difficult. How long have you felt this way?",
          "Thank you for sharing. What do you think might help?",
          "I'm listening. Tell me more."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage('ai', randomResponse);
      }, 800);
    }
    
    function addMessage(sender, text) {
      const chatContainer = document.getElementById('chat-container');
      const message = document.createElement('div');
      message.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
      message.textContent = text;
      chatContainer.appendChild(message);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    

    document.getElementById('user-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  