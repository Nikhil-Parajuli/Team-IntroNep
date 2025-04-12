import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send, Play, Pause, Trash2, Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Emergency keywords to detect crisis situations
const EMERGENCY_KEYWORDS = [
  "kill myself", "suicide", "end my life", "harm myself", 
  "want to die", "hurt myself", "self harm", "not worth living"
];

// Mock function for Google Gemini API (replace with actual implementation)
const fetchGeminiResponse = async (message: string, userName: string) => {
  // This would be replaced with actual API call to Google Gemini
  console.log("Sending to Gemini API:", message);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check for emergency keywords
  const isEmergency = EMERGENCY_KEYWORDS.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (isEmergency) {
    return {
      text: `I'm concerned about what you've shared. If you're having thoughts of harming yourself, please reach out for immediate help. The National Suicide Prevention Lifeline is available 24/7 at 1-800-273-8255. Would you like me to provide more resources that might help you right now?`,
      emotion: "concerned",
      isEmergency: true
    };
  }
  
  // Simple response logic (to be replaced with actual Gemini API)
  if (message.toLowerCase().includes("sad") || message.toLowerCase().includes("depressed")) {
    return {
      text: `I understand you're feeling down, ${userName}. It's important to acknowledge these feelings. Would you like to talk more about what's been happening?`,
      emotion: "empathetic",
      isEmergency: false
    };
  } else if (message.toLowerCase().includes("happy") || message.toLowerCase().includes("good")) {
    return {
      text: `I'm glad you're feeling positive today, ${userName}! That's wonderful to hear. What's been going well for you?`,
      emotion: "happy",
      isEmergency: false
    };
  } else if (message.toLowerCase().includes("anxious") || message.toLowerCase().includes("worried")) {
    return {
      text: `It sounds like you're experiencing some anxiety, ${userName}. That's completely normal. Let's explore what might be causing these feelings and some strategies that might help.`,
      emotion: "calm",
      isEmergency: false
    };
  } else {
    return {
      text: `Thank you for sharing that with me, ${userName}. How long have you been feeling this way?`,
      emotion: "neutral",
      isEmergency: false
    };
  }
};

// Mock function for LOVO AI voice synthesis (replace with actual implementation)
const synthesizeVoice = async (text: string, emotion: string) => {
  // This would be replaced with actual API call to LOVO AI
  console.log("Synthesizing voice with LOVO AI:", { text, emotion });
  
  // In a real implementation, this would return an audio URL or blob
  return "mock_audio_url";
};

// Message type definition
type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  emotion?: string;
  isEmergency?: boolean;
  audioUrl?: string;
};

export const AIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [userName, setUserName] = useState("there");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get user name on component mount
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");
    if (userAuth) {
      try {
        const { name } = JSON.parse(userAuth);
        if (name) {
          setUserName(name);
        }
      } catch (error) {
        console.error("Error parsing user auth data:", error);
      }
    }
    
    // Add initial greeting from bot
    const greeting: Message = {
      id: Date.now().toString(),
      text: `Hi ${userName || "there"}, how are you feeling today?`,
      sender: "bot",
      timestamp: new Date(),
      emotion: "friendly"
    };
    
    setMessages([greeting]);
    
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        sendMessage(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        toast.error("Couldn't hear you clearly. Please try again.");
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle user message submission
  const sendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Get response from AI
      const response = await fetchGeminiResponse(messageText, userName);
      
      // Generate voice with LOVO AI
      const audioUrl = await synthesizeVoice(response.text, response.emotion || "neutral");
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        emotion: response.emotion,
        isEmergency: response.isEmergency,
        audioUrl
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Auto play the audio response
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        audio.play();
        setIsPlaying(true);
        
        audio.onended = () => {
          setIsPlaying(false);
        };
      }
      
      // Show emergency alert if needed
      if (response.isEmergency) {
        toast.error(
          "EMERGENCY: If you're in crisis, please call the National Suicide Prevention Lifeline at 1-800-273-8255 immediately.",
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Sorry, I couldn't process your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Start voice recording
  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    
    recognition.start();
    setIsRecording(true);
    
    recognition.onerror = () => {
      setIsRecording(false);
      toast.error("Voice recording failed. Please try again.");
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
  };
  
  // Toggle audio playback
  const toggleAudio = () => {
    if (currentAudio) {
      if (isPlaying) {
        currentAudio.pause();
        setIsPlaying(false);
      } else {
        currentAudio.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Clear chat history
  const clearChat = () => {
    const greeting: Message = {
      id: Date.now().toString(),
      text: `Hi ${userName || "there"}, how are you feeling today?`,
      sender: "bot",
      timestamp: new Date(),
      emotion: "friendly"
    };
    
    setMessages([greeting]);
    toast.success("Chat history cleared");
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">AI Mental Health Assistant</CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Have a conversation with your AI assistant. Everything you share is private and secure.
            </p>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearChat}
              title="Clear chat history"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow overflow-y-auto pb-2">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.isEmergency && (
                    <Badge variant="destructive" className="mb-2">
                      Emergency Resources
                    </Badge>
                  )}
                  
                  {message.emotion && message.sender === "bot" && (
                    <Badge variant="outline" className="mb-2">
                      {message.emotion.charAt(0).toUpperCase() + message.emotion.slice(1)}
                    </Badge>
                  )}
                  
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <div className="flex items-center w-full space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              disabled={!currentAudio}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={startRecording}
              disabled={isRecording}
              className={isRecording ? "bg-red-100 text-red-500" : ""}
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
            >
              <Keyboard className="h-4 w-4" />
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            
            <Button 
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIChatbot;

// Add types for browser Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}