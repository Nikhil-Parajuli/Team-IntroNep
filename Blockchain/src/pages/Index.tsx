import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { connectWallet, getVerifiedTherapists } from "@/lib/blockchain";
import { CheckCircle, LogIn, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import BookingSteps from "@/components/BookingSteps";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface Availability {
  date: string;
  slots: string[];
}

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  availability: Availability[];
  imageUrl: string;
  isEmergency?: boolean;
  experience?: string;
}

const Index = () => {
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showBookingSteps, setShowBookingSteps] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Mock therapist data with expanded specializations and emergency therapist
    const mockTherapists: Therapist[] = [
      {
        id: "t1",
        name: "Dr. Manisha Sharma",
        specialization: "Depression & Anxiety",
        experience: "10 years",
        availability: [
          { date: "2025-04-14", slots: ["10:00", "14:00"] },
          { date: "2025-04-15", slots: ["11:00", "15:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/women/33.jpg"
      },
      {
        id: "t2",
        name: "Dr. Rajesh Pandey",
        specialization: "PTSD Specialist",
        experience: "8 years",
        availability: [
          { date: "2025-04-14", slots: ["09:00", "13:00"] },
          { date: "2025-04-15", slots: ["10:00", "14:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/men/52.jpg"
      },
      {
        id: "t3",
        name: "Dr. Anita Giri",
        specialization: "Child Psychology",
        experience: "12 years",
        availability: [
          { date: "2025-04-15", slots: ["09:00", "13:00"] },
          { date: "2025-04-16", slots: ["11:00", "15:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      {
        id: "t4",
        name: "Dr. Sanjay Thapa",
        specialization: "Addiction Recovery",
        experience: "9 years",
        availability: [
          { date: "2025-04-14", slots: ["11:00", "16:00"] },
          { date: "2025-04-15", slots: ["10:00", "15:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/men/44.jpg"
      },
      {
        id: "t5",
        name: "Dr. Priya Karki",
        specialization: "Relationship Counseling",
        experience: "7 years",
        availability: [
          { date: "2025-04-15", slots: ["09:00", "14:00"] },
          { date: "2025-04-16", slots: ["11:00", "16:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      {
        id: "t6",
        name: "Dr. Sunil Gurung",
        isEmergency: true,
        specialization: "Crisis Intervention",
        experience: "15 years",
        availability: [
          { date: "2025-04-13", slots: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
          { date: "2025-04-14", slots: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
          { date: "2025-04-15", slots: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/men/28.jpg"
      }
    ];

    // Always set the mock therapists first to ensure UI is populated
    setTherapists(mockTherapists);
    
    // DO NOT try to load from blockchain - removed to prevent overwriting mock therapists
    // The blockchain integration is causing therapists to disappear when wallet is connected
    
    // Check if user is logged in
    const userAuth = localStorage.getItem("userAuth");
    if (userAuth) {
      const authData = JSON.parse(userAuth);
      setIsLoggedIn(true);
      setUserType(authData.type);
    }
  }, []);

  const handleConnectWallet = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      setWalletInfo(wallet);
    }
  };

  const handleSelectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setSelectedDate(undefined);
    setSelectedTime("");
    setBookingConfirmed(false);
    setShowBookingSteps(false);
  };

  const handleBack = () => {
    setSelectedTherapist(null);
    setBookingConfirmed(false);
    setShowBookingSteps(false);
  };

  const handleSelectDate = (date: string) => {
    // Convert string date to Date object
    const [year, month, day] = date.split("-").map(num => parseInt(num, 10));
    setSelectedDate(new Date(year, month - 1, day));
    setSelectedTime("");
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  const handleProceedToBooking = () => {
    if (!walletInfo) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!selectedTherapist || !selectedDate || !selectedTime) {
      toast.error("Please select all booking details");
      return;
    }
    
    // Show the BookingSteps component
    setShowBookingSteps(true);
  };

  const handleBookingComplete = () => {
    setBookingConfirmed(true);
    setShowBookingSteps(false);
  };

  const handleBookingCancel = () => {
    setShowBookingSteps(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 border-b shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-therapeutic-600">MindChain</h1>
          
          <div className="flex items-center gap-4">
            {!walletInfo ? (
              <Button onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center text-sm bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Connected: {walletInfo.address.substring(0, 6)}...{walletInfo.address.substring(38)}</span>
              </div>
            )}
            
            {isLoggedIn ? (
              <Button variant="outline" size="sm" asChild>
                <Link to={userType === "user" ? "/user-dashboard" : "/therapist-dashboard"}>
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" /> Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 pt-8">
        {!selectedTherapist && (
          <>
            <h2 className="text-xl font-bold mb-4">Select a Therapist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {therapists.map((therapist) => (
                <div 
                  key={therapist.id} 
                  className={`p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all ${
                    therapist.isEmergency 
                      ? 'bg-red-50 border-2 border-red-500 relative overflow-hidden' 
                      : 'bg-white border'
                  }`} 
                  onClick={() => handleSelectTherapist(therapist)}
                >
                  {therapist.isEmergency && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-red-500 text-white px-4 py-1 transform rotate-45 translate-x-2 translate-y-4 shadow-md">
                        Emergency
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <img src={therapist.imageUrl} alt={therapist.name} className="w-14 h-14 rounded-full mr-4" />
                    <div>
                      <h3 className="font-medium">{therapist.name}</h3>
                      <p className={`text-sm ${therapist.isEmergency ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                        {therapist.specialization}
                      </p>
                      {therapist.experience && <p className="text-xs text-gray-500">{therapist.experience}</p>}
                      {therapist.isEmergency && (
                        <div className="mt-2 flex items-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="h-3 w-3 mr-1" /> 24/7 Crisis Support
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {selectedTherapist && !showBookingSteps && !bookingConfirmed && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <h2 className="text-xl font-bold">Select Appointment Time</h2>
              <div className="w-20"></div>
            </div>
            
            <div className="flex items-center mb-6">
              <img src={selectedTherapist.imageUrl} alt={selectedTherapist.name} className="w-14 h-14 rounded-full mr-4" />
              <div>
                <h3 className="font-medium">{selectedTherapist.name}</h3>
                <p className="text-sm text-gray-600">{selectedTherapist.specialization}</p>
                {selectedTherapist.experience && <p className="text-xs text-gray-500">{selectedTherapist.experience}</p>}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Date:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedTherapist.availability.map((avail) => (
                  <div 
                    key={avail.date}
                    className={`p-3 border rounded-md cursor-pointer text-center transition-colors ${selectedDate && format(selectedDate, 'yyyy-MM-dd') === avail.date ? 'bg-therapeutic-50 border-therapeutic-300' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelectDate(avail.date)}
                  >
                    {avail.date}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedDate && (
              <div className="mb-6">
                <h3 className="font-medium mb-2">Select Time:</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {selectedTherapist.availability
                    .find(a => a.date === format(selectedDate, 'yyyy-MM-dd'))?.slots.map((time) => (
                    <div 
                      key={time}
                      className={`p-3 border rounded-md cursor-pointer text-center transition-colors ${selectedTime === time ? 'bg-therapeutic-50 border-therapeutic-300' : 'hover:bg-gray-50'}`}
                      onClick={() => handleSelectTime(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedDate && selectedTime && (
              <div className="flex flex-col items-center mt-8">
                <Button 
                  onClick={handleProceedToBooking} 
                  disabled={!walletInfo}
                  className="w-full max-w-xs bg-therapeutic-500 hover:bg-therapeutic-600"
                >
                  Proceed to Booking Details
                </Button>
              </div>
            )}
          </div>
        )}
        
        {selectedTherapist && showBookingSteps && (
          <BookingSteps
            therapistId={selectedTherapist.id}
            therapistName={selectedTherapist.name}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onComplete={handleBookingComplete}
            onCancel={handleBookingCancel}
            walletInfo={walletInfo}
          />
        )}
        
        {bookingConfirmed && selectedTherapist && (
          <div className="bg-white p-6 rounded-lg shadow-sm border text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-3">Appointment Confirmed</h2>
            <p className="text-gray-600 mb-6">Your appointment has been booked successfully.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg max-w-sm mx-auto mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Therapist:</span>
                <span className="font-medium">{selectedTherapist.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedDate ? format(selectedDate, 'MMM dd, yyyy') : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button onClick={handleBack} variant="outline">
                Book Another Appointment
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
