
    let userProfile = {};

    
    function switchSection(sectionId) {
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(sectionId).classList.add('active');
    }

    
    function proceedToChat() {
      userProfile = {
        topic: document.getElementById('q1').value,
        feeling: document.getElementById('q2').value,
        goal: document.getElementById('q3').value,
        mood: document.getElementById('q4').value
      };

      if (!userProfile.topic || !userProfile.feeling || !userProfile.mood) {
        alert('Please answer all questions.');
        return;
      }

      switchSection('chat-interface');
      
      
      const initialMessage = `Hello, I see you're feeling ${userProfile.feeling} and want to discuss ${userProfile.topic}. How can I help you today?`;
      addMessage('ai', initialMessage);
    }

    
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
  