import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send, StopCircle, Play, Pause, Settings, Volume2, VolumeX, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getLovoService, EMOTIONAL_VOICES } from "@/lib/lovo-service";

// Emergency keywords to detect crisis situations
const EMERGENCY_KEYWORDS = [
  "kill myself", "suicide", "end my life", "harm myself", 
  "want to die", "hurt myself", "self harm", "not worth living",
  "kill", "die", "death", "end it all", "no reason to live",
  "suicidal thoughts", "suicidal", "end it", "don't want to live", 
  "take my own life", "ending my life", "harming myself"
];

// Function to check for emergency keywords with more robust detection
const checkForEmergency = (message: string): boolean => {
  const lowercaseMessage = message.toLowerCase().trim();
  
  // Direct matches for single keywords
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (lowercaseMessage.includes(keyword)) {
      console.log(`Emergency keyword detected: "${keyword}" in message: "${message}"`);
      return true;
    }
  }
  
  // Check for combinations that might indicate an emergency
  if ((lowercaseMessage.includes("thought") || lowercaseMessage.includes("thinking")) && 
      (lowercaseMessage.includes("suicide") || lowercaseMessage.includes("kill") || 
       lowercaseMessage.includes("die") || lowercaseMessage.includes("death"))) {
    console.log("Emergency combination detected in message: " + message);
    return true;
  }
  
  // Specific check for "suicidal thoughts" since it's a critical phrase
  if (lowercaseMessage.includes("suicidal") || lowercaseMessage.includes("suicide")) {
    console.log("Suicidal reference detected in message: " + message);
    return true;
  }
  
  return false;
};

// Nepal emergency contact information
const NEPAL_EMERGENCY_CONTACTS = {
  governmentHelpline: "1166", // Nepal Government Mental Health Helpline
  tpoNepal: "+9779847386158", // TPO Nepal
};

// Emergency Alert Popup Component
const EmergencyAlertPopup = ({ onClose, onBookAppointment }: { 
  onClose: () => void, 
  onBookAppointment: () => void 
}) => {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-red-500 p-4 z-50 animate-fadeIn">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-red-600">⚠️ Emergency Resources</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      
      <p className="my-2 text-sm">
        If you're experiencing a mental health crisis, please reach out for immediate help:
      </p>
      
      <div className="space-y-3 my-3">
        <a 
          href={`tel:${NEPAL_EMERGENCY_CONTACTS.governmentHelpline}`} 
          className="flex justify-between items-center bg-red-50 hover:bg-red-100 transition-colors rounded-md p-3"
        >
          <span className="font-semibold">Nepal Mental Health Helpline</span>
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {NEPAL_EMERGENCY_CONTACTS.governmentHelpline}
          </span>
        </a>
        
        <a 
          href={`tel:${NEPAL_EMERGENCY_CONTACTS.tpoNepal}`} 
          className="flex justify-between items-center bg-red-50 hover:bg-red-100 transition-colors rounded-md p-3"
        >
          <span className="font-semibold">TPO Nepal</span>
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {NEPAL_EMERGENCY_CONTACTS.tpoNepal}
          </span>
        </a>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          onClick={onBookAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          Book a Professional Therapist
        </Button>
      </div>
    </div>
  );
};

// Define message interface
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  emotion?: string;
  isEmergency?: boolean;
  audioUrl?: string;
  isPlaying?: boolean;
  suggestBooking?: boolean;
}

// Define voice interface
interface Voice {
  id: string;
  name: string;
  gender: "male" | "female";
  emotion: string;
  accent: string;
}

// Add types for browser Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Mock function for Google Gemini API (replace with actual implementation)
const fetchGeminiResponse = async (message: string, userName: string) => {
  // This would be replaced with actual API call to Google Gemini
  console.log("Sending to Gemini API:", message);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Check for emergency keywords with robust detection
  const isEmergency = checkForEmergency(message);
  
  if (isEmergency) {
    return {
      text: `I'm here for you, ${userName}. I'm concerned about what you've shared. These are serious feelings that need immediate care. Please call the crisis helpline at ${NEPAL_EMERGENCY_CONTACTS.governmentHelpline} right now. Would you like me to help you connect with a therapist?`,
      emotion: "concerned",
      isEmergency: true,
      suggestBooking: true
    };
  }
  
  // Professional response logic with shorter, more empathetic responses
  if (message.toLowerCase().includes("sad") || message.toLowerCase().includes("depressed")) {
    return {
      text: `I hear you, ${userName}. Feeling sad can be really tough. When did you start feeling this way? I'm here to listen.`,
      emotion: "empathetic",
      isEmergency: false
    };
  } else if (message.toLowerCase().includes("happy") || message.toLowerCase().includes("good")) {
    return {
      text: `That's wonderful to hear, ${userName}! What's been bringing you joy lately?`,
      emotion: "happy",
      isEmergency: false
    };
  } else if (message.toLowerCase().includes("anxious") || message.toLowerCase().includes("worried")) {
    return {
      text: `I'm with you, ${userName}. Anxiety is really challenging. Can you tell me what triggers these feelings? Recognizing patterns is our first step forward.`,
      emotion: "calm",
      isEmergency: false
    };
  } else {
    return {
      text: `Thank you for sharing that, ${userName}. How long have you been feeling this way? I'd love to understand more about what you're going through.`,
      emotion: "neutral",
      isEmergency: false
    };
  }
};

export const EmotionalVoiceChatbot = () => {
  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Input and recording states
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  // Audio and voice states
  const [selectedVoice, setSelectedVoice] = useState<string>(EMOTIONAL_VOICES[0].id);
  const [isMuted, setIsMuted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState<{
    messageId: string | null;
    audio: HTMLAudioElement | null;
  }>({
    messageId: null,
    audio: null,
  });
  
  // Other states
  const [userName, setUserName] = useState("there");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEmergencyAlertOpen, setIsEmergencyAlertOpen] = useState(false);
  
  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lovoService = getLovoService();
  
  // Navigation
  const navigate = useNavigate();
  
  // Handle booking appointment redirect
  const redirectToBooking = () => {
    navigate('/booking');
    toast.success("Redirecting to appointment booking page");
  };

  // Get user name on component mount
  useEffect(() => {
    // Get user info from localStorage
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
      text: `Hi ${userName || "there"}, I'm your AI mental health assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
      emotion: "friendly",
      isPlaying: false
    };
    
    setMessages([greeting]);
    
    // Synthesize greeting voice after a short delay
    setTimeout(async () => {
      try {
        const audioUrl = await lovoService.synthesize({
          text: greeting.text,
          voiceId: selectedVoice,
          emotion: "neutral"
        });
        
        if (!isMuted) {
          playAudio(greeting.id, audioUrl);
        }
        
        setMessages(prev => prev.map(msg => 
          msg.id === greeting.id ? { ...msg, audioUrl } : msg
        ));
      } catch (error) {
        console.error("Error synthesizing greeting:", error);
      }
    }, 500);
  }, []);

  // Auto scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
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
      // Stop any currently playing audio
      stopAudio();
      
      // Get response from AI
      const response = await fetchGeminiResponse(messageText, userName);
      
      // Generate unique ID for bot message
      const botMessageId = (Date.now() + 1).toString();
      
      // Add initial bot message without audio
      const botMessage: Message = {
        id: botMessageId,
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        emotion: response.emotion,
        isEmergency: response.isEmergency,
        isPlaying: false,
        suggestBooking: response.suggestBooking
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Generate voice with Lovo AI after the message appears
      try {
        const audioUrl = await lovoService.synthesize({
          text: response.text,
          voiceId: selectedVoice,
          emotion: response.emotion as any || "neutral"
        });
        
        // Update message with audio URL
        setMessages(prev => prev.map(msg => 
          msg.id === botMessageId ? { ...msg, audioUrl } : msg
        ));
        
        // Play the audio if not muted
        if (!isMuted) {
          playAudio(botMessageId, audioUrl);
        }
      } catch (error) {
        console.error("Error generating voice:", error);
        toast.error("Voice generation failed. Please check your settings.");
      }
      
      // Show emergency alert if needed with Nepal helpline numbers
      if (response.isEmergency) {
        toast.error(
          `EMERGENCY: Please call Nepal's mental health crisis helpline at ${NEPAL_EMERGENCY_CONTACTS.governmentHelpline} or TPO Nepal at ${NEPAL_EMERGENCY_CONTACTS.tpoNepal}`,
          { 
            duration: 10000,
            action: {
              label: "Book Therapist",
              onClick: redirectToBooking
            }
          }
        );
        setIsEmergencyAlertOpen(true);
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
    
    recognition.onerror = (event: any) => {
      setIsRecording(false);
      
      // Handle specific error types with user-friendly messages
      switch(event.error) {
        case 'network':
          toast.error("Network error occurred. Please check your internet connection and try again.", {
            duration: 5000,
            action: {
              label: "Try Again",
              onClick: () => startRecording()
            }
          });
          break;
        case 'not-allowed':
          toast.error("Microphone access was denied. Please check your browser permissions.");
          break;
        case 'aborted':
          toast.error("Voice recording was aborted.");
          break;
        case 'audio-capture':
          toast.error("No microphone was found. Please connect a microphone and try again.");
          break;
        case 'no-speech':
          toast.error("No speech was detected. Please try again and speak clearly.");
          break;
        default:
          toast.error("Voice recording failed. Please try again.");
      }
      
      // Log the full error for debugging
      console.error("Speech Recognition Error:", event.error, event);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
    };
  };
  
  // Play audio for a message
  const playAudio = (messageId: string, audioUrl: string) => {
    // Stop current audio if playing
    stopAudio();
    
    // Create and play new audio
    const audio = new Audio(audioUrl);
    
    // Set the currently playing message
    setAudioPlaying({
      messageId,
      audio
    });
    
    // Update message playing state
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPlaying: true } : msg
    ));
    
    // Play the audio
    audio.play().catch(error => {
      console.error("Error playing audio:", error);
      toast.error("Audio playback failed");
      
      // Reset playing state
      setAudioPlaying({
        messageId: null,
        audio: null
      });
      
      // Update message playing state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ));
    });
    
    // When audio ends
    audio.onended = () => {
      // Reset playing state
      setAudioPlaying({
        messageId: null,
        audio: null
      });
      
      // Update message playing state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isPlaying: false } : msg
      ));
    };
  };
  
  // Stop any currently playing audio
  const stopAudio = () => {
    if (audioPlaying.audio) {
      audioPlaying.audio.pause();
      audioPlaying.audio.currentTime = 0;
      
      // Update message playing state
      if (audioPlaying.messageId) {
        setMessages(prev => prev.map(msg => 
          msg.id === audioPlaying.messageId ? { ...msg, isPlaying: false } : msg
        ));
      }
      
      // Reset playing state
      setAudioPlaying({
        messageId: null,
        audio: null
      });
    }
  };
  
  // Toggle playback for a message
  const togglePlay = (messageId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    
    if (audioPlaying.messageId === messageId) {
      // Stop the current playback
      stopAudio();
    } else {
      // Play this message's audio
      playAudio(messageId, audioUrl);
    }
  };
  
  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && audioPlaying.audio) {
      stopAudio();
    }
  };
  
  // Change voice
  const changeVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    toast.success(`Voice changed to ${EMOTIONAL_VOICES.find(v => v.id === voiceId)?.name}`);
    
    // Stop any playing audio
    stopAudio();
  };
  
  // Clear chat history
  const clearChat = () => {
    // Stop any playing audio
    stopAudio();
    
    // Create a new greeting message
    const greeting: Message = {
      id: Date.now().toString(),
      text: `Hi ${userName || "there"}, I'm your AI mental health assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
      emotion: "friendly",
      isPlaying: false
    };
    
    // Reset messages
    setMessages([greeting]);
    
    // Synthesize new greeting
    setTimeout(async () => {
      try {
        const audioUrl = await lovoService.synthesize({
          text: greeting.text,
          voiceId: selectedVoice,
          emotion: "neutral"
        });
        
        setMessages(prev => prev.map(msg => 
          msg.id === greeting.id ? { ...msg, audioUrl } : msg
        ));
        
        if (!isMuted) {
          playAudio(greeting.id, audioUrl);
        }
      } catch (error) {
        console.error("Error synthesizing greeting:", error);
      }
    }, 500);
    
    toast.success("Chat history cleared");
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex flex-col h-full border shadow-md">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/ai-assistant.png" alt="AI" />
                <AvatarFallback className="bg-therapeutic-100 text-therapeutic-700">AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">Mental Health Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Voice: {EMOTIONAL_VOICES.find(v => v.id === selectedVoice)?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" title="Settings">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Voice Settings</DialogTitle>
                    <DialogDescription>
                      Choose a voice and emotional tone for your AI assistant.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <Label className="text-base font-medium">Select Voice</Label>
                    <RadioGroup 
                      className="mt-2 space-y-3"
                      value={selectedVoice}
                      onValueChange={changeVoice}
                    >
                      {EMOTIONAL_VOICES.map(voice => (
                        <div key={voice.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={voice.id} id={voice.id} />
                          <Label 
                            htmlFor={voice.id} 
                            className="flex-1 flex justify-between items-center cursor-pointer"
                          >
                            <span>{voice.name}</span>
                            <Badge variant="outline">{voice.accent}</Badge>
                          </Label>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              const audioUrl = await lovoService.synthesize({
                                text: "Hi there, I'm your mental health assistant.",
                                voiceId: voice.id,
                                emotion: "neutral"
                              });
                              const audio = new Audio(audioUrl);
                              audio.play();
                            }}
                          >
                            Preview
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearChat}
                title="Clear chat history"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent 
          ref={chatContainerRef}
          className="flex-grow overflow-y-auto py-4 px-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative group max-w-[80%] rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                }`}
              >
                {/* Message header with emotion badge if applicable */}
                {(message.isEmergency || message.emotion) && message.sender === "bot" && (
                  <div className="mb-2">
                    {message.isEmergency && (
                      <Badge variant="destructive" className="mr-2">
                        Emergency Resources
                      </Badge>
                    )}
                    
                    {message.emotion && (
                      <Badge variant="outline">
                        {message.emotion.charAt(0).toUpperCase() + message.emotion.slice(1)}
                      </Badge>
                    )}
                  </div>
                )}
                
                <p className="whitespace-pre-wrap">{message.text}</p>
                
                {/* Book Psychologist button for emergency situations */}
                {message.suggestBooking && (
                  <div className="mt-3">
                    <Button 
                      onClick={redirectToBooking} 
                      className="bg-green-600 hover:bg-green-700 text-white font-medium"
                    >
                      Book a Professional Psychologist
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  
                  {/* Audio controls for bot messages */}
                  {message.sender === "bot" && message.audioUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full opacity-80 hover:opacity-100"
                      onClick={() => togglePlay(message.id, message.audioUrl)}
                    >
                      {message.isPlaying ? 
                        <StopCircle className="h-4 w-4" /> : 
                        <Play className="h-4 w-4" />
                      }
                    </Button>
                  )}
                </div>
                
                {/* Stop button that appears when audio is playing */}
                {message.isPlaying && (
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 w-7 p-0 rounded-full"
                      onClick={stopAudio}
                    >
                      <StopCircle className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
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
          
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex items-center w-full space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={startRecording}
              disabled={isRecording}
              className={isRecording ? "bg-red-100 text-red-500 animate-pulse" : ""}
              title="Voice input"
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
            />
            
            <Button 
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Voice indicator */}
          {isRecording && (
            <div className="mt-2 text-center text-xs text-red-500 animate-pulse">
              Listening...
            </div>
          )}
        </CardFooter>
      </Card>
      
      {/* Emergency Alert Popup */}
      {isEmergencyAlertOpen && (
        <EmergencyAlertPopup 
          onClose={() => setIsEmergencyAlertOpen(false)} 
          onBookAppointment={redirectToBooking} 
        />
      )}

      {/* Floating Mute Button - Appears when audio is playing */}
      {audioPlaying.audio && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            variant={isMuted ? "outline" : "default"}
            size="lg"
            onClick={toggleMute}
            className={`rounded-full p-3 shadow-lg ${isMuted ? "bg-gray-100" : "bg-red-600"} transition-all hover:scale-105`}
            title={isMuted ? "Unmute" : "Mute Voice"}
          >
            {isMuted ? (
              <Volume2 className="h-6 w-6" />
            ) : (
              <VolumeX className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmotionalVoiceChatbot;