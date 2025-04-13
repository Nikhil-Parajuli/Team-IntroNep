import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, User, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: "101",
    clientName: "John Smith",
    date: "2025-04-14",
    time: "9:00 AM",
    status: "Confirmed",
    type: "Individual"
  },
  {
    id: "102",
    clientName: "Lisa Taylor",
    date: "2025-04-14",
    time: "11:30 AM",
    status: "Confirmed",
    type: "Individual"
  },
  {
    id: "103",
    clientName: "Group Session A",
    date: "2025-04-14",
    time: "2:00 PM",
    status: "Confirmed",
    type: "Group"
  },
  {
    id: "104",
    clientName: "Alex Johnson",
    date: "2025-04-15",
    time: "10:00 AM",
    status: "Confirmed",
    type: "EAP"
  },
  {
    id: "105",
    clientName: "Maria Garcia",
    date: "2025-04-15",
    time: "3:30 PM",
    status: "Confirmed",
    type: "Individual"
  },
  {
    id: "106",
    clientName: "David Lee",
    date: "2025-04-16",
    time: "1:00 PM",
    status: "Confirmed",
    type: "Individual"
  },
  {
    id: "107",
    clientName: "Group Session B",
    date: "2025-04-17",
    time: "6:00 PM",
    status: "Confirmed",
    type: "Group"
  }
];

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [therapistInfo, setTherapistInfo] = useState<{username: string} | null>(null);
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  useEffect(() => {
    // Check authentication
    const userAuth = localStorage.getItem("userAuth");
    if (!userAuth) {
      navigate("/login");
      return;
    }

    const auth = JSON.parse(userAuth);
    if (auth.type !== "therapist") {
      navigate("/login");
      return;
    }

    setTherapistInfo({ username: auth.username });
    
    // Load appointments from local storage or use mock data
    const storedAppointments = localStorage.getItem("therapistAppointments");
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    } else {
      // Save mock data to local storage
      localStorage.setItem("therapistAppointments", JSON.stringify(mockAppointments));
      setAppointments(mockAppointments);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    navigate("/login");
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Filter appointments based on tab
  const upcomingAppointments = appointments.filter(
    (app) => app.date >= today
  ).sort((a, b) => {
    // Sort by date and time
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Group appointments by date
  const appointmentsByDate = upcomingAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Upcoming dates
  const dates = Object.keys(appointmentsByDate).sort();

  // Stats
  const todayAppointments = appointments.filter(app => app.date === today).length;
  const totalUpcoming = upcomingAppointments.length;
  const individualSessions = appointments.filter(app => app.type === "Individual").length;
  const groupSessions = appointments.filter(app => app.type === "Group").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-therapeutic-600">MindChain</h1>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              Welcome, Dr. {therapistInfo?.username}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 pt-8">
        <h2 className="text-2xl font-bold mb-6">Therapist Dashboard</h2>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Today's Sessions</div>
                <div className="text-2xl font-bold">{todayAppointments}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Upcoming Sessions</div>
                <div className="text-2xl font-bold">{totalUpcoming}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Individual Sessions</div>
                <div className="text-2xl font-bold">{individualSessions}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Group Sessions</div>
                <div className="text-2xl font-bold">{groupSessions}</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="all">All Appointments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-8">
            {dates.length > 0 ? (
              dates.map((date) => (
                <div key={date}>
                  <h3 className="text-lg font-medium mb-4">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  
                  <div className="space-y-4">
                    {appointmentsByDate[date].map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                            <div className="mb-2 md:mb-0">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-therapeutic-500" />
                                <h4 className="font-medium">{appointment.clientName}</h4>
                              </div>
                              <div className="flex items-center text-sm mt-1">
                                <Clock className="h-4 w-4 mr-2 text-therapeutic-500" />
                                <span>{appointment.time}</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:items-end gap-1">
                              <Badge variant={appointment.type === "Group" ? "secondary" : "default"}>
                                {appointment.type}
                              </Badge>
                              <span className="text-sm">{appointment.status}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="py-4 text-center text-muted-foreground">
                  No upcoming appointments
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="all">
            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-2 md:mb-0">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-therapeutic-500" />
                            <h4 className="font-medium">{appointment.clientName}</h4>
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <CalendarDays className="h-4 w-4 mr-2 text-therapeutic-500" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-sm mt-1">
                            <Clock className="h-4 w-4 mr-2 text-therapeutic-500" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end gap-1">
                          <Badge variant={appointment.type === "Group" ? "secondary" : "default"}>
                            {appointment.type}
                          </Badge>
                          <span className="text-sm">{appointment.status}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-4 text-center text-muted-foreground">
                    No appointments found
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TherapistDashboard;