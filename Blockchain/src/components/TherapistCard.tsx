
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Clock } from "lucide-react";

interface Availability {
  date: string;
  slots: string[];
}

interface TherapistCardProps {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  reviews: number;
  availability: Availability[];
  imageUrl: string;
  onSelect: (therapistId: string) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  id,
  name,
  specialization,
  experience,
  rating,
  reviews,
  availability,
  imageUrl,
  onSelect
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <Star className="absolute top-0 left-0 h-4 w-4 fill-yellow-400 text-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const getNextAvailableSlot = () => {
    if (availability && availability.length > 0) {
      const firstDate = availability[0];
      if (firstDate.slots && firstDate.slots.length > 0) {
        return {
          date: new Date(firstDate.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: firstDate.slots[0]
        };
      }
    }
    return { date: 'No availability', time: '' };
  };

  const nextSlot = getNextAvailableSlot();

  return (
    <Card className="therapist-card overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden relative w-full">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-calm-500">{specialization}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <CardDescription>{experience} experience</CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {renderStars(rating)}
          </div>
          <span className="text-sm text-gray-600">({reviews} reviews)</span>
        </div>
        <div className="flex items-start space-y-1 flex-col text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-therapeutic-500" />
            <span>{nextSlot.date}</span>
          </div>
          {nextSlot.time && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-therapeutic-500" />
              <span>{nextSlot.time}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-therapeutic-500 to-calm-500 hover:from-therapeutic-600 hover:to-calm-600" 
          onClick={() => onSelect(id)}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TherapistCard;
