import React, { useState, useEffect } from "react";
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
  const [transactionHash, setTransactionHash] = useState("");
  const [networkId, setNetworkId] = useState<number | null>(null);
  // Add a short processing timeout for a better UX
  const [processingTimeout, setProcessingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (processingTimeout) {
        clearTimeout(processingTimeout);
      }
    };
  }, [processingTimeout]);

  const generateId = () => {
    const newId = generateBookingId();
    setAnonymousId(newId);
  };

  // Add a function to handle transition to next step with a minimum
  // "processing" indication for better UX
  const transitionToNextStep = (result: any) => {
    // Set the transaction data immediately
    if (result.contractAddress) {
      setContractAddress(result.contractAddress);
    }
    if (result.transactionHash) {
      setTransactionHash(result.transactionHash);
    }
    if (result.networkId) {
      setNetworkId(result.networkId);
    }

    // Ensure "Processing..." is shown for at least 300ms for better UX
    // This prevents the UI from flickering if MetaMask responds very quickly
    const minProcessingTime = 300; // milliseconds
    
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(prevStep => prevStep + 1);
      setProcessingTimeout(null);
    }, minProcessingTime);
    
    setProcessingTimeout(timeout);
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
      
      try {
        const result = await createBooking(
          therapistId,
          selectedDate,
          selectedTime,
          anonymousId,
          sessionType,
          clientInfo
        );
        
        if (result.success) {
          // Use the transition function instead of directly setting state
          transitionToNextStep(result);
        } else {
          setIsLoading(false);
          toast.error(result.error || "Failed to create booking");
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("An unexpected error occurred");
        console.error("Error in booking creation:", error);
      }
    } else if (currentStep === 5) {
      // Confirm booking terms
      if (!walletInfo) {
        toast.error("Please connect your wallet");
        return;
      }
      
      setIsLoading(true);
      
      try {
        const result = await confirmBooking(contractAddress);
        
        if (result.success) {
          // Use the transition function to handle state updates
          transitionToNextStep(result);
        } else {
          setIsLoading(false);
          toast.error(result.error || "Failed to confirm booking");
        }
      } catch (error) {
        setIsLoading(false);
        toast.error("An unexpected error occurred");
        console.error("Error in booking confirmation:", error);
      }
    } else {
      // Regular step transitions
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Further optimize the button rendering to make the UI more responsive
  const renderButtonText = () => {
    if (!isLoading) return "Next Step";
    
    // Show appropriate text based on current step
    if (currentStep === 4) {
      return "Creating Contract...";
    } else if (currentStep === 5) {
      return "Confirming...";
    } else {
      return "Processing...";
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
          <ContractStep 
            contractAddress={contractAddress}
            transactionHash={transactionHash}
            networkId={networkId}
          />
        );
        
      case 6:
        return (
          <SuccessStep 
            therapistName={therapistName}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            anonymousId={anonymousId}
            transactionHash={transactionHash}
            networkId={networkId}
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
          <Button 
            variant="outline" 
            onClick={handlePreviousStep}
            disabled={isLoading}
          >
            Back
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        
        {currentStep < 6 ? (
          <Button 
            onClick={handleNextStep} 
            disabled={isLoading}
            className="bg-therapeutic-500 hover:bg-therapeutic-600"
          >
            {renderButtonText()}
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
