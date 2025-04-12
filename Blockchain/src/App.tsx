import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import TherapistDashboard from "./pages/TherapistDashboard";

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
        <BrowserRouter>
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
