import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";
import AIChatbotPage from "./pages/AIChatbotPage";
// Import AIChatbotIntegration from the correct path
import AIChatbotIntegration from "./AIChatbotIntegration";

const queryClient = new QueryClient();

// Auth check component to protect routes
const ProtectedRoute = ({ 
  children, 
  requiredType 
}: { 
  children: JSX.Element, 
  requiredType: 'user' | 'therapist' 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userAuth = localStorage.getItem("userAuth");
      if (userAuth) {
        const { type, isAuthenticated } = JSON.parse(userAuth);
        if (isAuthenticated && type === requiredType) {
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredType]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute requiredType="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ai-chatbot" 
              element={
                <ProtectedRoute requiredType="user">
                  <AIChatbotPage />
                </ProtectedRoute>
              } 
            />
            {/* Add a dedicated route for the AIChatbotIntegration component */}
            <Route 
              path="/ai-therapy" 
              element={
                <ProtectedRoute requiredType="user">
                  <div className="container mx-auto p-6">
                    <AIChatbotIntegration />
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/therapist-dashboard" 
              element={
                <ProtectedRoute requiredType="therapist">
                  <TherapistDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
