
import React from "react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Calendar, Clock, Shield } from "lucide-react";

interface ConfirmationStepProps {
  therapistName: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  anonymousId: string;
  termsAccepted: boolean;
  setTermsAccepted: (value: boolean) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  therapistName,
  selectedDate,
  selectedTime,
  anonymousId,
  termsAccepted,
  setTermsAccepted
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Confirm Booking Details</h3>
      
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
      </div>
      
      <div className="flex items-start space-x-2 mt-4">
        <Checkbox 
          id="terms" 
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
        />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms" className="text-sm cursor-pointer">
            I agree to the terms and conditions, including creating a smart contract 
            for this booking that will store appointment details on the blockchain.
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
