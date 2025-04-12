
    let userProfile = {};
    const apiKey = 'AIzaSyDzcWEbJFrR1pDGPgOyAPZ45lTIPD60R80'; // Gemini API 

    // ssection switching
    function switchSection(sectionId) {
      document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
      });
      document.getElementById(sectionId).classList.add('active');
    }

    // onboard handler
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

    // AI integration
    async function getAIResponse(userText) {
      const systemPrompt = `You are a gentle, professional virtual psychologist. The user is feeling ${userProfile.feeling}, wants to discuss ${userProfile.topic}, seeks ${userProfile.goal}, and rates their mood as ${userProfile.mood}/5. Respond with empathy and simple, clear guidance.`;
      
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\nUser: ${userText}`
              }]
            }]
          })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('API Error:', error);
        return "I'm having trouble connecting. Could you try again?";
      }
    }

    //  chat functions
    async function sendMessage() {
      const input = document.getElementById('user-input');
      const userText = input.value.trim();
      if (!userText) return;
      
      addMessage('user', userText);
      input.value = '';
      
      // Show typing indicator
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'message ai-message typing-indicator';
      typingIndicator.innerHTML = '<span></span><span></span><span></span>';
      document.getElementById('chat-container').appendChild(typingIndicator);
      document.getElementById('chat-container').scrollTop = document.getElementById('chat-container').scrollHeight;
      
      try {
        const aiResponse = await getAIResponse(userText);
        // Remove typing indicator
        document.getElementById('chat-container').removeChild(typingIndicator);
        addMessage('ai', aiResponse);
      } catch (error) {
        document.getElementById('chat-container').removeChild(typingIndicator);
        addMessage('ai', "I'm sorry, I encountered an error. Could you rephrase that?");
      }
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
  