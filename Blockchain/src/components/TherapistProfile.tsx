
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Star, Clock, Calendar as CalendarIcon, MapPin, Award, ThumbsUp } from "lucide-react";

interface Availability {
  date: string;
  slots: string[];
}

interface TherapistProfileProps {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
  availability: Availability[];
  imageUrl: string;
  onBookAppointment: (date: Date | undefined, time: string) => void;
}

const TherapistProfile: React.FC<TherapistProfileProps> = ({
  id,
  name,
  specialization,
  experience,
  rating,
  reviews,
  availability,
  imageUrl,
  onBookAppointment
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showTimeDialog, setShowTimeDialog] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="h-5 w-5 text-yellow-400" />
          <Star className="absolute top-0 left-0 h-5 w-5 fill-yellow-400 text-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  const getAvailableTimesForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const formattedDate = format(date, "yyyy-MM-dd");
    const dateAvailability = availability.find(a => a.date === formattedDate);
    
    return dateAvailability ? dateAvailability.slots : [];
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
    
    if (date) {
      setShowTimeDialog(true);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime) {
      onBookAppointment(selectedDate, selectedTime);
      setShowTimeDialog(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <div className="aspect-square overflow-hidden relative w-full">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-semibold">{name}</CardTitle>
                <CardDescription className="text-sm">{specialization}</CardDescription>
              </div>
              <Badge className="bg-therapeutic-500">{experience}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-600">({reviews} reviews)</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Award className="h-5 w-5 mr-3 text-therapeutic-500" />
                <span>Certified Clinical Psychologist</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-therapeutic-500" />
                <span>Virtual Appointments Available</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="h-5 w-5 mr-3 text-therapeutic-500" />
                <span>98% Positive Feedback</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <Tabs defaultValue="about">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Dr. {name.split(' ')[1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  With {experience} of experience, Dr. {name.split(' ')[1]} specializes in {specialization}. 
                  Their approach combines evidence-based techniques with compassionate care to help clients 
                  navigate life's challenges and achieve better mental health.
                </p>
                <p className="text-gray-700 mb-4">
                  Dr. {name.split(' ')[1]} creates a safe, non-judgmental space where clients can explore their
                  thoughts and feelings freely. They're committed to providing personalized treatment plans
                  that address each individual's unique needs.
                </p>
                <h3 className="font-semibold mb-2">Specialties</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-mindful-50 text-mindful-700 hover:bg-mindful-100">
                    {specialization}
                  </Badge>
                  <Badge variant="outline" className="bg-mindful-50 text-mindful-700 hover:bg-mindful-100">
                    Anxiety
                  </Badge>
                  <Badge variant="outline" className="bg-mindful-50 text-mindful-700 hover:bg-mindful-100">
                    Depression
                  </Badge>
                  <Badge variant="outline" className="bg-mindful-50 text-mindful-700 hover:bg-mindful-100">
                    Stress Management
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Patient Reviews</CardTitle>
                <CardDescription>Read what others have to say about Dr. {name.split(' ')[1]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-1">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">Anonymous Patient</span>
                      <span className="text-xs text-gray-500 ml-auto">2 weeks ago</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Dr. {name.split(' ')[1]} has been incredible in helping me manage my anxiety. Their approach is both 
                      compassionate and practical. I've seen significant improvement after just a few sessions.
                    </p>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex items-center mb-1">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">Anonymous Patient</span>
                      <span className="text-xs text-gray-500 ml-auto">1 month ago</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      I appreciate that Dr. {name.split(' ')[1]} takes the time to really listen and understand my concerns. They
                      provide thoughtful insights and practical strategies that have helped me make positive changes.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-1">
                      <div className="flex mr-2">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <span className="text-sm font-medium">Anonymous Patient</span>
                      <span className="text-xs text-gray-500 ml-auto">2 months ago</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Dr. {name.split(' ')[1]} creates a safe environment where I feel comfortable sharing my thoughts. Their
                      expertise in {specialization} has been valuable in my healing journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
                <CardDescription>Select a date to check availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md border p-3 pointer-events-auto"
                    disabled={(date) => {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      return !availability.some(a => a.date === formattedDate);
                    }}
                  />
                  
                  <div className="mt-4 text-center text-therapeutic-700">
                    <div className="flex items-center justify-center mb-1">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">Select a date to see available time slots</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Your privacy is protected with anonymous booking
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showTimeDialog} onOpenChange={setShowTimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select a Time Slot</DialogTitle>
            <DialogDescription>
              Available times for {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            {getAvailableTimesForDate(selectedDate).map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                className={selectedTime === time ? "bg-therapeutic-500" : ""}
                onClick={() => handleTimeSelect(time)}
              >
                <Clock className="h-4 w-4 mr-2" />
                {time}
              </Button>
            ))}
            
            {getAvailableTimesForDate(selectedDate).length === 0 && (
              <p className="col-span-3 text-center text-gray-500 py-4">
                No available time slots for this date.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTimeDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBookAppointment} 
              disabled={!selectedTime}
              className="bg-therapeutic-500 hover:bg-therapeutic-600"
            >
              Book this Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistProfile;
