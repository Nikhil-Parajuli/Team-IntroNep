import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define user credentials for local storage
const USER_CREDENTIALS = { username: 'user', password: 'user' };
const THERAPIST_CREDENTIALS = { username: 'admin', password: 'admin' };

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"user" | "therapist">("user");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userAuth = localStorage.getItem("userAuth");
    if (userAuth) {
      const { type } = JSON.parse(userAuth);
      if (type === "user") {
        navigate("/user-dashboard");
      } else if (type === "therapist") {
        navigate("/therapist-dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    let isValid = false;
    let authType = "";
    
    if (userType === "user" && 
        username === USER_CREDENTIALS.username && 
        password === USER_CREDENTIALS.password) {
      isValid = true;
      authType = "user";
    } else if (
      userType === "therapist" && 
      username === THERAPIST_CREDENTIALS.username && 
      password === THERAPIST_CREDENTIALS.password
    ) {
      isValid = true;
      authType = "therapist";
    }
    
    if (isValid) {
      // Store auth info in local storage
      localStorage.setItem(
        "userAuth",
        JSON.stringify({
          type: authType,
          username,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        })
      );
      
      toast.success(`Welcome ${username}!`);
      navigate(authType === "user" ? "/user-dashboard" : "/therapist-dashboard");
    } else {
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">MindChain Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" onValueChange={(value) => setUserType(value as "user" | "therapist")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="user">Client</TabsTrigger>
              <TabsTrigger value="therapist">Therapist</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder={userType === "user" ? "user" : "admin"}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6">
                Sign In
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <p>
            {userType === "user" ? "User: username = 'user', password = 'user'" : "Therapist: username = 'admin', password = 'admin'"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;