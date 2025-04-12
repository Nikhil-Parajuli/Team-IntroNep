import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronRight, LogOut, Clock } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-therapeutic-600">MindfulMeet</h1>
          
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
      
      <main className="container mx-auto p-4 pt-8">
        <h2 className="text-2xl font-bold mb-6">User Dashboard</h2>
        
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
      </main>
    </div>
  );
};

export default UserDashboard;