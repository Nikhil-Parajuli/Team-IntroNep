import React, { useState } from "react";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateBookingId, createBooking, confirmBooking } from "@/utils/bookingUtils";

// Step components
import SessionTypeStep from "./booking/SessionTypeStep";
import AnonymousIdStep from "./booking/AnonymousIdStep";
import ClientInfoStep from "./booking/ClientInfoStep";
import ConfirmationStep from "./booking/ConfirmationStep";
import ContractStep from "./booking/ContractStep";
import SuccessStep from "./booking/SuccessStep";

interface BookingStepsProps {
  therapistId: string;
  therapistName: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  onComplete: () => void;
  onCancel: () => void;
  walletInfo: { signer: ethers.Signer } | null;
}

const BookingSteps: React.FC<BookingStepsProps> = ({
  therapistId,
  therapistName,
  selectedDate,
  selectedTime,
  onComplete,
  onCancel,
  walletInfo
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionType, setSessionType] = useState("individual");
  const [anonymousId, setAnonymousId] = useState("");
  const [clientInfo, setClientInfo] = useState({
    mainConcern: "",
    prevTherapy: "",
    therapyGoals: "",
    medications: "",
    emergencyContact: "",
    preferredApproach: "unsure",
    consentToNotes: false,
    currentSymptoms: [],
    symptomDuration: "",
    copingStrategies: "",
    mentalHealthHistory: "",
    physicalHealthConditions: "",
    sleepQuality: "",
    dietaryHabits: "",
    exerciseRoutine: "",
    substanceUse: "",
    stressors: "",
    supportSystem: "",
    communicationPreference: "gentle"
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  const generateId = () => {
    const newId = generateBookingId();
    setAnonymousId(newId);
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && !sessionType) {
      toast.error("Please select a session type");
      return;
    }
    
    if (currentStep === 2 && !anonymousId) {
      toast.error("Please generate an anonymous ID");
      return;
    }
    
    if (currentStep === 3) {
      // Validate client info form
      if (!clientInfo.mainConcern) {
        toast.error("Please describe what brings you to therapy");
        return;
      }
      if (!clientInfo.therapyGoals) {
        toast.error("Please describe your therapy goals");
        return;
      }
    }
    
    if (currentStep === 4 && !termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    if (currentStep === 4) {
      // Create booking contract
      if (!walletInfo) {
        toast.error("Please connect your wallet");
        return;
      }
      
      setIsLoading(true);
      const result = await createBooking(
        therapistId,
        selectedDate,
        selectedTime,
        anonymousId,
        sessionType,
        clientInfo
      );
      
      setIsLoading(false);
      
      if (result.success) {
        setContractAddress(result.contractAddress);
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 5) {
      // Confirm booking terms
      if (!walletInfo) {
        toast.error("Please connect your wallet");
        return;
      }
      
      setIsLoading(true);
      const result = await confirmBooking(contractAddress);
      setIsLoading(false);
      
      if (result.success) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SessionTypeStep 
            sessionType={sessionType} 
            setSessionType={setSessionType} 
          />
        );
        
      case 2:
        return (
          <AnonymousIdStep 
            anonymousId={anonymousId} 
            generateId={generateId} 
          />
        );
      
      case 3:
        return (
          <ClientInfoStep 
            clientInfo={clientInfo}
            setClientInfo={setClientInfo}
          />
        );
        
      case 4:
        return (
          <ConfirmationStep 
            therapistName={therapistName}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            anonymousId={anonymousId}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
          />
        );
        
      case 5:
        return (
          <ContractStep contractAddress={contractAddress} />
        );
        
      case 6:
        return (
          <SuccessStep 
            therapistName={therapistName}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            anonymousId={anonymousId}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book Your Appointment</CardTitle>
        <CardDescription>
          Step {currentStep} of 6: {
            currentStep === 1 ? "Session Type" :
            currentStep === 2 ? "Anonymize Identity" :
            currentStep === 3 ? "Client Information" :
            currentStep === 4 ? "Confirm Details" :
            currentStep === 5 ? "Create Smart Contract" :
            "Confirmation"
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {currentStep > 1 && currentStep < 6 ? (
          <Button variant="outline" onClick={handlePreviousStep}>
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        
        {currentStep < 6 ? (
          <Button 
            onClick={handleNextStep} 
            disabled={isLoading}
            className="bg-therapeutic-500 hover:bg-therapeutic-600"
          >
            {isLoading ? "Processing..." : "Next Step"}
          </Button>
        ) : (
          <Button 
            onClick={onComplete}
            className="bg-therapeutic-500 hover:bg-therapeutic-600"
          >
            Done
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookingSteps;
