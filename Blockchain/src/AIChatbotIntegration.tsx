import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface VoiceAssignment {
  name: string;
  gender: string;
  index: number | null;
}

interface UserProfile {
  topic: string;
  feeling: string;
  goal: string;
  mood: string;
}

const AIChatbotIntegration: React.FC = () => {
  // Sections state
  const [currentSection, setCurrentSection] = useState<'onboarding' | 'voice-selection' | 'chat-interface'>('onboarding');
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    topic: '',
    feeling: '',
    goal: 'emotional',
    mood: ''
  });
  
  // Voice states
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number | null>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [voiceAssignments, setVoiceAssignments] = useState<Record<number, VoiceAssignment>>({
    0: { name: 'Sita (Female)', gender: 'female', index: null },
    1: { name: 'Gita (Female)', gender: 'female', index: null },
    2: { name: 'Ram (Male)', gender: 'male', index: null }
  });
  
  // Chat states
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [userInput, setUserInput] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Load and assign voices
  useEffect(() => {
    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
        console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));

        // Helper to find female voices
        const findFemaleVoice = (excludeIndices: number[] = []) => {
          return voices.findIndex((voice, index) => {
            const name = voice.name.toLowerCase();
            return !excludeIndices.includes(index) && (
              name.includes('female') ||
              name.includes('samantha') ||
              name.includes('zira') ||
              name.includes('tessa') ||
              name.includes('victoria') ||
              name.includes('jenny') ||
              name.includes('aria')
            );
          });
        };

        // Helper to find male voices
        const findMaleVoice = (excludeIndices: number[] = []) => {
          return voices.findIndex((voice, index) => {
            const name = voice.name.toLowerCase();
            return !excludeIndices.includes(index) && (
              name.includes('male') ||
              name.includes('daniel') ||
              name.includes('david') ||
              name.includes('mark') ||
              name.includes('guy') ||
              name.includes('benjamin')
            );
          });
        };

        // Assign voices
        let sitaVoiceIndex = findFemaleVoice();
        sitaVoiceIndex = sitaVoiceIndex !== -1 ? sitaVoiceIndex : 0;

        let gitaVoiceIndex = findFemaleVoice([sitaVoiceIndex]);
        gitaVoiceIndex = gitaVoiceIndex !== -1 ? gitaVoiceIndex : (voices.length > 1 ? 1 : 0);

        let ramVoiceIndex = findMaleVoice([sitaVoiceIndex, gitaVoiceIndex]);
        ramVoiceIndex = ramVoiceIndex !== -1 ? ramVoiceIndex : (voices.length > 2 ? 2 : 0);

        setVoiceAssignments({
          0: { ...voiceAssignments[0], index: sitaVoiceIndex },
          1: { ...voiceAssignments[1], index: gitaVoiceIndex },
          2: { ...voiceAssignments[2], index: ramVoiceIndex }
        });

        console.log('Assigned voices:', {
          0: { ...voiceAssignments[0], index: sitaVoiceIndex },
          1: { ...voiceAssignments[1], index: gitaVoiceIndex },
          2: { ...voiceAssignments[2], index: ramVoiceIndex }
        });
      }
    }

    loadVoices();

    // Set up the voices changed event listener
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Timeout fallback if voices don't load
    const voiceLoadTimeout = setTimeout(() => {
      if (!voicesLoaded) {
        console.warn('Voice loading timed out');
        setVoicesLoaded(true); // Proceed with default/fallback
      }
    }, 5000);

    return () => {
      clearTimeout(voiceLoadTimeout);
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Handle section switching
  const switchSection = (section: 'onboarding' | 'voice-selection' | 'chat-interface') => {
    console.log(`Switching to section: ${section}`);
    setCurrentSection(section);
  };

  // Onboarding: Proceed to voice selection
  const proceedToVoice = () => {
    if (!userProfile.topic || !userProfile.feeling || !userProfile.mood) {
      alert('Please answer all questions.');
      return;
    }

    console.log('Onboarding complete:', userProfile);
    switchSection('voice-selection');
  };

  // Handle voice selection
  const selectVoice = (voiceIndex: number) => {
    if (!voicesLoaded) {
      alert('Voices are still loading or unavailable. Please wait a moment.');
      return;
    }
    
    setSelectedVoiceIndex(voiceIndex);
    console.log(`Selected voice: ${voiceAssignments[voiceIndex].name} (index ${voiceAssignments[voiceIndex].index})`);

    // Preview voice
    const utterance = new SpeechSynthesisUtterance('Namaste, I am here to help you.');
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices[voiceAssignments[voiceIndex].index as number];
    utterance.voice = selectedVoice || voices[0];
    
    utterance.onstart = () => console.log('TTS preview started');
    utterance.onend = () => console.log('TTS preview ended');
    utterance.onerror = (e) => {
      console.error('TTS preview error:', e.error);
      alert('Unable to play voice preview. Your browser may not support this voice or TTS is disabled.');
    };
    
    try {
      window.speechSynthesis.cancel(); // Clear any pending speech
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('TTS speak failed:', e);
      alert('Text-to-speech failed. Please check your browser settings or try a different voice.');
    }
  };

  // Start chat session
  const startChat = () => {
    if (selectedVoiceIndex === null) {
      alert('Please select a voice to continue.');
      return;
    }
    
    console.log('Starting chat with voice:', voiceAssignments[selectedVoiceIndex].name);
    switchSection('chat-interface');

    // Initial AI message
    const initialMessage = `Hello, I'm here to listen and support you. It sounds like you're feeling ${userProfile.feeling} and want to talk about ${userProfile.topic}. Would you like to share a bit more about what's on your mind?`;
    addMessage('ai', initialMessage);
    speak(initialMessage);
  };

  // Add message to chat
  const addMessage = (sender: 'user' | 'ai', text: string) => {
    setMessages(prev => [...prev, { sender, text }]);
    
    // Scroll to bottom after a message is added
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  // Speak AI response
  const speak = (text: string) => {
    if (selectedVoiceIndex === null) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices[voiceAssignments[selectedVoiceIndex].index as number];
    utterance.voice = selectedVoice || voices[0];
    utterance.rate = 1.0; // Normalize speed
    utterance.pitch = 1.0; // Normalize pitch
    
    utterance.onstart = () => console.log('TTS speaking:', text);
    utterance.onend = () => console.log('TTS finished speaking');
    utterance.onerror = (e) => {
      console.error('TTS error:', e.error);
      alert('Unable to speak response. Your browser may not support this voice or TTS is disabled.');
    };
    
    try {
      window.speechSynthesis.cancel(); // Clear any pending speech
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('TTS speak failed:', e);
      alert('Text-to-speech failed. Please check your browser settings or try a different voice.');
    }
  };

  // Clean API response text
  const cleanText = (text: string) => {
    return text.replace(/[\*\_\#]+([^\*\_\#]+)[\*\_\#]+/g, '$1')
               .replace(/(\n\s*)+/g, '\n')
               .trim();
  };

  // Send user message and get AI response
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    addMessage('user', userInput);
    const text = userInput;
    setUserInput('');

    const response = await getAIResponse(text);
    const cleanedResponse = cleanText(response);
    addMessage('ai', cleanedResponse);
    speak(cleanedResponse);
  };

  // Gemini API call
  const getAIResponse = async (userText: string) => {
    const apiKey = 'AIzaSyDzcWEbJFrR1pDGPgOyAPZ45lTIPD60R80';
    const systemPrompt = `You are a gentle, professional, and kind virtual psychologist. Your role is to listen carefully, offer emotional support, and provide simple, clear, and compassionate guidance. The user is feeling ${userProfile.feeling}, wants to discuss ${userProfile.topic}, seeks ${userProfile.goal}, and rates their mood as ${userProfile.mood}/5. Respond in a warm, understanding tone, using plain language that is easy to follow. Always be empathetic, ask gentle follow-up questions to encourage reflection, and suggest practical, evidence-based wellness tips (like deep breathing, journaling, or reframing thoughts) when appropriate. Do not use any formatting like bold, italics, headers, or bullet points—just write in clear, simple sentences.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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
      return "I'm sorry, something went wrong. I'm still here for you—would you like to keep talking?";
    }
  };

  // Voice Recognition
  const toggleVoiceRecognition = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Sorry, your browser does not support voice recognition. Please type your message.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    if (!isRecognizing) {
      setIsRecognizing(true);

      recognition.onstart = () => {
        console.log('Voice recognition started');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice Input:', transcript);
        setUserInput(transcript);
        // Use a setTimeout to ensure the userInput is properly set before sending
        setTimeout(() => sendMessage(), 100);
      };

      recognition.onend = () => {
        setIsRecognizing(false);
        console.log('Voice recognition ended');
      };

      recognition.onerror = (event: any) => {
        setIsRecognizing(false);
        console.error('Speech Recognition Error:', event.error);
        
        let errorMessage = 'I couldn\'t hear you clearly. Would you like to try again or type instead?';
        if (event.error === 'no-speech') {
          errorMessage = 'I didn\'t hear anything. Could you speak again, please?';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'I can\'t find a microphone. Please check if one is connected.';
        }
        
        alert(errorMessage);
      };

      recognition.start();
    } else {
      recognition.stop();
      setIsRecognizing(false);
    }
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Check TTS support on page load
  useEffect(() => {
    if (!window.speechSynthesis) {
      console.warn('Speech Synthesis not supported in this browser');
      alert('Text-to-speech is not supported in your browser. You can still use text-based chat.');
    }
  }, []);

  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardHeader>
        <CardTitle className="text-center">AI Virtual Psychologist</CardTitle>
        <CardDescription className="text-center">
          {currentSection === 'onboarding' && "Tell us how you're feeling today"}
          {currentSection === 'voice-selection' && "Choose a voice for your session"}
          {currentSection === 'chat-interface' && "Your personal therapeutic session"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Onboarding Section */}
        {currentSection === 'onboarding' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-700">What would you like to talk about today?</p>
              <Input 
                type="text"
                placeholder="E.g., stress, relationships..."
                value={userProfile.topic}
                onChange={(e) => setUserProfile({...userProfile, topic: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">How have you been feeling lately?</p>
              <Input 
                type="text"
                placeholder="E.g., anxious, calm..."
                value={userProfile.feeling}
                onChange={(e) => setUserProfile({...userProfile, feeling: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Would you like emotional support, stress-relief advice, or self-reflection?</p>
              <Select 
                value={userProfile.goal}
                onValueChange={(value) => setUserProfile({...userProfile, goal: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emotional">Emotional Support</SelectItem>
                  <SelectItem value="stress">Stress-Relief Advice</SelectItem>
                  <SelectItem value="reflection">Self-Reflection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-700">On a scale of 1–5, how would you rate your current mood?</p>
              <Input 
                type="number"
                min={1}
                max={5}
                placeholder="1 (low) - 5 (high)"
                value={userProfile.mood}
                onChange={(e) => setUserProfile({...userProfile, mood: e.target.value})}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full bg-indigo-500 hover:bg-indigo-600"
                onClick={proceedToVoice}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
        
        {/* Voice Selection Section */}
        {currentSection === 'voice-selection' && (
          <div className="text-center space-y-4">
            {!voicesLoaded && <p className="text-gray-700">Loading voices...</p>}
            
            {voicesLoaded && (
              <>
                <p className="text-gray-700">Select a voice for your session:</p>
                <div className="flex flex-wrap gap-4 justify-center mb-6">
                  {Object.entries(voiceAssignments).map(([key, voice]) => (
                    <Button
                      key={key}
                      variant={selectedVoiceIndex === parseInt(key) ? "default" : "outline"}
                      className={selectedVoiceIndex === parseInt(key) ? "bg-indigo-500" : ""}
                      onClick={() => selectVoice(parseInt(key))}
                    >
                      {voice.name}
                    </Button>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                  onClick={startChat}
                >
                  Start Session
                </Button>
              </>
            )}
          </div>
        )}
        
        {/* Chat Interface Section */}
        {currentSection === 'chat-interface' && (
          <div className="space-y-4">
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="h-[400px] border rounded-lg p-4 overflow-y-auto bg-gray-50"
            >
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.sender === 'user' ? "text-right" : "text-left"}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === 'user' 
                        ? "bg-indigo-500 text-white" 
                        : "bg-white border shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Input Area */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Textarea
                  rows={3}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="resize-none min-h-[80px]"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  onClick={sendMessage}
                  className="bg-indigo-500 hover:bg-indigo-600"
                >
                  Send
                </Button>
                
                <Button
                  onClick={toggleVoiceRecognition}
                  variant={isRecognizing ? "default" : "outline"}
                  className={isRecognizing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}
                >
                  {isRecognizing ? '🎙️ Listening...' : '🎙️ Voice'}
                </Button>
              </div>
            </div>
            
            {/* Emergency note */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>
                If you're experiencing a mental health emergency, please call the Mental Health Crisis Line at 988 
                or go to your nearest emergency room.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIChatbotIntegration;