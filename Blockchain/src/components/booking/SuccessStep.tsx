import React, { useState } from "react";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User, Calendar, Clock, Shield, Check, Calendar as CalendarIcon, ExternalLink } from "lucide-react";

interface SuccessStepProps {
  therapistName: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  anonymousId: string;
  transactionHash?: string;
  networkId?: number | null;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  therapistName,
  selectedDate,
  selectedTime,
  anonymousId,
  transactionHash,
  networkId
}) => {
  const [calendarOption, setCalendarOption] = useState("google");

  const getTransactionExplorerUrl = () => {
    if (!transactionHash) return null;
    
    // Determine the network and return the appropriate Etherscan URL
    if (networkId === 1) return `https://etherscan.io/tx/${transactionHash}`;
    if (networkId === 5) return `https://goerli.etherscan.io/tx/${transactionHash}`;
    if (networkId === 11155111) return `https://sepolia.etherscan.io/tx/${transactionHash}`;
    
    // Default to Sepolia if unknown network but we have a hash
    return `https://sepolia.etherscan.io/tx/${transactionHash}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-green-800">Booking Confirmed!</h3>
        <p className="text-sm text-gray-600 mt-1">
          Your appointment has been successfully booked
        </p>
      </div>
      
      <div className="space-y-3 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <User className="h-5 w-5 text-therapeutic-500 mr-3" />
          <div>
            <p className="text-sm font-medium">Therapist</p>
            <p className="text-sm text-gray-600">{therapistName}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-therapeutic-500 mr-3" />
          <div>
            <p className="text-sm font-medium">Date</p>
            <p className="text-sm text-gray-600">
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-therapeutic-500 mr-3" />
          <div>
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm text-gray-600">{selectedTime}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Shield className="h-5 w-5 text-therapeutic-500 mr-3" />
          <div>
            <p className="text-sm font-medium">Anonymous ID</p>
            <p className="text-sm font-mono text-gray-600">{anonymousId}</p>
          </div>
        </div>
        
        {transactionHash && (
          <div className="border-t border-gray-200 pt-3 mt-3">
            <p className="text-xs text-gray-500 mb-2">Blockchain Transaction</p>
            <div>
              <p className="text-xs text-gray-600 font-mono truncate">
                {transactionHash}
              </p>
              <a 
                href={getTransactionExplorerUrl()} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center text-therapeutic-600 hover:text-therapeutic-800 mt-1"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                View Transaction on Etherscan
              </a>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Add to Calendar:</h4>
        <RadioGroup value={calendarOption} onValueChange={setCalendarOption} className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="google" id="google" />
            <Label htmlFor="google">Google Calendar</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="apple" id="apple" />
            <Label htmlFor="apple">Apple Calendar</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="outlook" id="outlook" />
            <Label htmlFor="outlook">Outlook</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other (iCal)</Label>
          </div>
        </RadioGroup>
        
        <Button 
          className="w-full mt-3 bg-therapeutic-500 hover:bg-therapeutic-600"
          onClick={() => toast.success("Calendar event created!")}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
};

export default SuccessStep;
