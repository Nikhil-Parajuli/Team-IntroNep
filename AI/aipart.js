
    let userProfile = {};
    const apiKey = 'AIzaSyDzcWEbJFrR1pDGPgOyAPZ45lTIPD60R80';
    let selectedVoiceIndex = null; // New variable for voice selection
    
    //  onboarding handler
    function proceedToVoiceSelection() {
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

      switchSection('voice-selection');
      loadVoices(); // Initialize voice loading
    }
    
    // New voice loading functionality
    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        document.getElementById('voice-loading').style.display = 'none';
        document.getElementById('voice-prompt').style.display = 'block';
        document.getElementById('voice-options').style.display = 'flex';
        
        // Set up voice selection
        document.querySelectorAll('.voice-option').forEach(option => {
          option.addEventListener('click', () => {
            document.querySelectorAll('.voice-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedVoiceIndex = parseInt(option.dataset.voice);
            
            // Preview the voice
            const utterance = new SpeechSynthesisUtterance("Hello, this is a voice preview");
            utterance.voice = voices[selectedVoiceIndex % voices.length]; // Simple fallback
            window.speechSynthesis.speak(utterance);
          });
        });
      } else {
        setTimeout(loadVoices, 100); // Retry if voices aren't loaded yet
      }
    }
    
    // Initialize voice loading
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    // New function to start chat session
    function startChatSession() {
      if (selectedVoiceIndex === null) {
        alert('Please select a voice to continue.');
        return;
      }
      
      switchSection('chat-interface');
      const initialMessage = `Hello, I see you're feeling ${userProfile.feeling} and want to discuss ${userProfile.topic}. How can I help you today?`;
      addMessage('ai', initialMessage);
      
      // Speak the initial message
      const utterance = new SpeechSynthesisUtterance(initialMessage);
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices[selectedVoiceIndex % voices.length];
      window.speechSynthesis.speak(utterance);
    }
    
    // Modified sendMessage to include TTS
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
      
      try {
        const aiResponse = await getAIResponse(userText);
        document.getElementById('chat-container').removeChild(typingIndicator);
        addMessage('ai', aiResponse);
        
        // Speak the AI response
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices[selectedVoiceIndex % voices.length];
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        document.getElementById('chat-container').removeChild(typingIndicator);
        addMessage('ai', "I'm sorry, I encountered an error. Could you rephrase that?");
      }
    }
    
    