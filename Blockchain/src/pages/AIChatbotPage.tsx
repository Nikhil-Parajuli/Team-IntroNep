import { PageHeader } from "@/components/ui/page-header";
import { PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIChatbot from "@/components/AIChatbot";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Calendar, MessageSquare, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function AIChatbotPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{username: string, name?: string} | null>(null);

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

    setUserInfo({ username: auth.username, name: auth.name });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    navigate("/login");
  };

  // Main chatbot content
  const renderChatbotContent = () => (
    <div className="flex flex-col h-full">
      <PageHeader className="pb-4">
        <PageHeaderHeading>AI Mental Health Assistant</PageHeaderHeading>
        <PageHeaderDescription>
          Talk to our AI assistant for emotional support, mental health insights, and guidance.
        </PageHeaderDescription>
      </PageHeader>
      
      <Tabs defaultValue="chat" className="flex-grow flex flex-col">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="resources">Mental Health Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-grow flex flex-col mt-0 border-0 p-0">
          <AIChatbot />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">Crisis Resources</h3>
              <p className="text-sm">
                If you're in crisis, please reach out to these emergency services:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>National Suicide Prevention Lifeline: 1-800-273-8255</li>
                <li>Crisis Text Line: Text HOME to 741741</li>
                <li>Emergency Services: 911</li>
              </ul>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">Self-Care Tips</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Practice mindfulness and meditation daily</li>
                <li>Maintain a regular sleep schedule</li>
                <li>Exercise regularly - even brief walks help</li>
                <li>Stay connected with supportive friends and family</li>
                <li>Limit media consumption when feeling overwhelmed</li>
              </ul>
            </div>
            
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-2">Helpful Apps</h3>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Headspace - Guided meditation and mindfulness</li>
                <li>Calm - Sleep stories and relaxation</li>
                <li>Moodfit - Mood tracking and insights</li>
                <li>Woebot - CBT-based mental health chatbot</li>
                <li>Daylio - Mood and activity journal</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="p-2">
              <h2 className="text-lg font-bold text-therapeutic-600">MindChain</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/user-dashboard")}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Calendar className="h-4 w-4" />
                  <span>Appointments</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => navigate("/ai-chatbot")}
                  data-active={true}
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
                AI Mental Health Assistant
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                  Welcome, {userInfo?.name || userInfo?.username || "User"}
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {renderChatbotContent()}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}