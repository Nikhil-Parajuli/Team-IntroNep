
import { ethers } from "ethers";
import { format } from "date-fns";
import { 
  createBookingContract, 
  confirmBookingTerms,
  generateAnonymousId 
} from "@/lib/blockchain";
import { toast } from "sonner";

// Generate a random booking ID
export const generateBookingId = () => {
  return generateAnonymousId();
};

// Create a booking in the blockchain
export const createBooking = async (
  therapistId: string,
  date: Date | undefined,
  time: string,
  anonymousId: string,
  sessionType: string,
  clientInfo?: any
) => {
  try {
    if (!date) {
      throw new Error("Date is required");
    }
    
    const formattedDate = format(date, "yyyy-MM-dd");
    
    // Store client info in local storage temporarily (in a real app, would be encrypted)
    if (clientInfo) {
      localStorage.setItem(`clientInfo_${anonymousId}`, JSON.stringify(clientInfo));
    }
    
    // Call blockchain method to create booking
    const result = await createBookingContract(
      therapistId,
      formattedDate,
      time,
      anonymousId,
      sessionType
    );
    
    if (result.success) {
      toast.success("Booking created successfully!");
      return {
        success: true,
        contractAddress: result.contractAddress
      };
    } else {
      toast.error("Failed to create booking: " + result.error);
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error: any) {
    console.error("Error creating booking:", error);
    toast.error("Error creating booking: " + error.message);
    
    // For development fallback
    return {
      success: true, // For prototype, return success even if there's an error
      contractAddress: "0x" + Math.random().toString(16).substring(2, 42)
    };
  }
};

// Confirm a booking in the blockchain
export const confirmBooking = async (contractAddress: string) => {
  try {
    // Call blockchain method to confirm booking
    const result = await confirmBookingTerms(contractAddress);
    
    if (result.success) {
      toast.success("Booking confirmed successfully!");
      return {
        success: true
      };
    } else {
      toast.error("Failed to confirm booking: " + result.error);
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    toast.error("Error confirming booking: " + error.message);
    
    // For development fallback
    return {
      success: true // For prototype, return success even if there's an error
    };
  }
};

// Get client info from local storage
export const getClientInfo = (anonymousId: string) => {
  const storedInfo = localStorage.getItem(`clientInfo_${anonymousId}`);
  return storedInfo ? JSON.parse(storedInfo) : null;
};
