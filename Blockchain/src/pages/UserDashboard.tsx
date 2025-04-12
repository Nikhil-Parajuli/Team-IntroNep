import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, LogOut, Clock, LayoutDashboard, Calendar, MessageSquare, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import AIChatbotIntegration from "@/components/AIChatbotIntegration";

interface Appointment {
  id: string;
  therapistName: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: "1",
    therapistName: "Dr. Sarah Johnson",
    date: "2025-04-15",
    time: "10:00 AM",
    status: "Confirmed",
    type: "Individual"
  },
  {
    id: "2",
    therapistName: "Dr. Michael Chen",
    date: "2025-04-20",
    time: "2:30 PM",
    status: "Confirmed",
    type: "Group"
  },
  {
    id: "3",
    therapistName: "Dr. Emily Rodriguez",
    date: "2025-05-05",
    time: "11:15 AM",
    status: "Confirmed",
    type: "Individual"
  }
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [userInfo, setUserInfo] = useState<{username: string} | null>(null);
  const [activeView, setActiveView] = useState<string>("dashboard");

  useEffect(() => {
    // Check authentication
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      navigate("/login");
      return;
    }

    const auth = JSON.parse(userAuth);
    if (auth.type !== "user") {
      navigate("/login");
      return;
    }

    setUserInfo({ username: auth.username });
    
    // Load appointments from local storage or use mock data
    const storedAppointments = localStorage.getItem("userAppointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    } else {
      // Save mock data to local storage
      localStorage.setItem("userAppointments", JSON.stringify(mockAppointments));
      setAppointments(mockAppointments);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    navigate("/login");
  };

  // Find the next upcoming appointment
  const nextAppointment = appointments.length > 0 
    ? appointments.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      })[0]
    : null;

  // Render dashboard content
  const renderDashboardContent = () => (
    <>
      {/* Next appointment section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Your Next Appointment</h3>
        
        {nextAppointment ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{nextAppointment.therapistName}</CardTitle>
              <CardDescription>
                {nextAppointment.type} Session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                <CalendarDays className="h-4 w-4 mr-2 text-therapeutic-500" />
                <span>{new Date(nextAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-sm mt-1">
                <Clock className="h-4 w-4 mr-2 text-therapeutic-500" />
                <span>{nextAppointment.time}</span>
              </div>
              <Button variant="link" className="px-0 mt-2" onClick={() => {}}>
                View Details <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-4 text-center text-muted-foreground">
              No upcoming appointments
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* All confirmed appointments */}
      <div>
        <h3 className="text-lg font-medium mb-4">All Confirmed Appointments</h3>
        
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{appointment.therapistName}</h4>
                      <div className="flex items-center text-sm mt-1">
                        <CalendarDays className="h-4 w-4 mr-2 text-therapeutic-500" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm mt-1">
                        <Clock className="h-4 w-4 mr-2 text-therapeutic-500" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {appointment.status}
                      </span>
                      <div className="text-sm mt-1">{appointment.type} Session</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-4 text-center text-muted-foreground">
              No confirmed appointments found
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <Button onClick={() => navigate("/")} className="bg-therapeutic-500 hover:bg-therapeutic-600">
          Book New Appointment
        </Button>
      </div>
    </>
  );

  // Render different views based on activeView state
  const renderContent = () => {
    switch(activeView) {
      case "dashboard":
        return renderDashboardContent();
      case "appointments":
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">My Appointments</h3>
            {/* Appointments content would go here */}
            {renderDashboardContent()}
          </div>
        );
      case "ai-chatbot":
        return <AIChatbotIntegration />;
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="p-2">
              <h2 className="text-lg font-bold text-therapeutic-600">MindfulMeet</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveView("dashboard")}
                  data-active={activeView === "dashboard"}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveView("appointments")}
                  data-active={activeView === "appointments"}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveView("ai-chatbot")}
                  data-active={activeView === "ai-chatbot"}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>AI Chatbot</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1">
          <header className="bg-white p-4 border-b shadow-sm">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-therapeutic-600">
                {activeView === "dashboard" && "Dashboard"}
                {activeView === "appointments" && "My Appointments"}
                {activeView === "ai-chatbot" && "AI Mental Health Assistant"}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                  Welcome, {userInfo?.username}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

// AI Chatbot Component
const AIChatbot: React.FC<{ username: string }> = ({ username }) => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: "assistant", content: `Hi ${username}, how are you feeling today?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be a call to Google Gemini API
      // For now, we'll simulate a response after a delay
      setTimeout(() => {
        const isPotentialCrisis = checkForCrisisKeywords(input);
        let responseContent = "";
        
        if (isPotentialCrisis) {
          responseContent = "I notice you might be going through something difficult. If you're in crisis, please call the Mental Health Crisis Line at 988, which is available 24/7. Would you like me to connect you with a therapist right away?";
        } else {
          responseContent = generateSupportiveResponse(input);
        }
        
        setMessages(prev => [...prev, { role: "assistant", content: responseContent }]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble responding right now. Please try again later." }]);
      setIsLoading(false);
    }
  };
  
  // Function to check for crisis keywords
  const checkForCrisisKeywords = (text: string): boolean => {
    const crisisKeywords = [
      "suicide", "kill myself", "end my life", "don't want to live", 
      "harm myself", "hurt myself", "self harm", "die"
    ];
    
    return crisisKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
  };
  
  // Function to generate a supportive response (placeholder for Gemini API)
  const generateSupportiveResponse = (userInput: string): string => {
    // This would be replaced with actual API call to Google Gemini
    const responses = [
      "I understand how you feel. It's completely normal to experience these emotions.",
      "Thank you for sharing that with me. Would you like to tell me more about what's going on?",
      "I'm here to listen and support you. What else is on your mind?",
      "That sounds challenging. How have you been coping with this situation?",
      "I appreciate your openness. What would help you feel better right now?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };
  
  // Function to handle voice input (Speech-to-Text)
  const handleVoiceInput = () => {
    // Implementation would use Web Speech API for voice input
    // For now, we'll just toggle the recording state
    setIsRecording(!isRecording);
    
    if (isRecording) {
      // Simulated voice recording result
      setInput(prev => prev + " This is a simulated voice input.");
    }
  };
  
  // Function to handle voice output (Text-to-Speech with LOVO AI)
  const handlePlayVoice = () => {
    // In a real implementation, this would call LOVO AI API
    // For now, we'll just toggle the playing state
    setIsPlaying(!isPlaying);
    
    // Simulating the speech audio playback
    if (!isPlaying) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };
  
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Mental Health AI Assistant</CardTitle>
        <CardDescription>
          Chat with our AI assistant for emotional support and guidance.
          All conversations are private and secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[500px]">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg bg-gray-50">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg ${
                    msg.role === "user" 
                      ? "bg-therapeutic-600 text-white" 
                      : "bg-white border shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block p-3 rounded-lg bg-white border shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-therapeutic-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                type="button"
                size="icon"
                variant={isPlaying ? "default" : "outline"}
                onClick={handlePlayVoice}
                title="Play voice response"
                className={isPlaying ? "bg-therapeutic-600" : ""}
              >
                {isPlaying ? "🔊" : "🔈"}
              </Button>
              <Button 
                type="button"
                size="icon"
                variant={isRecording ? "default" : "outline"}
                onClick={handleVoiceInput}
                title="Voice input"
                className={isRecording ? "bg-therapeutic-600" : ""}
              >
                🎙️
              </Button>
              <Button 
                type="button"
                onClick={handleSendMessage}
                className="bg-therapeutic-600 hover:bg-therapeutic-700"
              >
                Send
              </Button>
            </div>
          </div>
          
          {/* Floating action buttons on mobile */}
          <div className="md:hidden fixed bottom-20 right-4 flex flex-col space-y-4">
            <Button 
              type="button"
              size="icon"
              className="rounded-full w-12 h-12 bg-therapeutic-600 hover:bg-therapeutic-700 shadow-lg"
              onClick={handlePlayVoice}
            >
              🔊
            </Button>
            <Button 
              type="button"
              size="icon"
              className="rounded-full w-12 h-12 bg-therapeutic-600 hover:bg-therapeutic-700 shadow-lg"
              onClick={handleVoiceInput}
            >
              🎙️
            </Button>
            <Button 
              type="button"
              size="icon"
              className="rounded-full w-12 h-12 bg-therapeutic-600 hover:bg-therapeutic-700 shadow-lg"
              onClick={() => {}}
            >
              ⌨️
            </Button>
          </div>
        </div>
        
        {/* Footer note */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            If you're experiencing a mental health emergency, please call the Mental Health Crisis Line at 988 
            or go to your nearest emergency room.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDashboard;