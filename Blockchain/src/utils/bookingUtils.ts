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
    
    // Validate and format the therapistId to ensure it's a valid Ethereum address
    let formattedTherapistId = therapistId;
    
    // Check if the therapistId is not a valid Ethereum address
    if (!therapistId.startsWith('0x') || therapistId.length !== 42) {
      // Use mock therapist addresses based on the ID for development
      const mockTherapistAddresses: Record<string, string> = {
        "t1": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "t2": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        // Add more mappings as needed
      };
      
      if (mockTherapistAddresses[therapistId]) {
        formattedTherapistId = mockTherapistAddresses[therapistId];
        console.log(`Using mapped address ${formattedTherapistId} for therapist ID ${therapistId}`);
      } else {
        // If no mapping exists, use a default address
        formattedTherapistId = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Default to first mock therapist
        console.log(`No mapping found for therapist ID ${therapistId}, using default address`);
      }
    }
    
    // Call blockchain method to create booking with the formatted therapist ID
    const result = await createBookingContract(
      formattedTherapistId,
      formattedDate,
      time,
      anonymousId,
      sessionType,
      clientInfo
    );
    
    if (result.success) {
      return {
        success: true,
        contractAddress: result.contractAddress,
        transactionHash: result.transactionHash,
        networkId: result.networkId
      };
    } else {
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error: any) {
    console.error("Error creating booking:", error);
    toast.error("Error creating booking: " + error.message);
    return { success: false, error: error.message };
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
        success: true,
        transactionHash: result.transactionHash,
        networkId: result.networkId
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
    return { success: false, error: error.message };
  }
};

// Get client info from local storage
export const getClientInfo = (anonymousId: string) => {
  const storedInfo = localStorage.getItem(`clientInfo_${anonymousId}`);
  return storedInfo ? JSON.parse(storedInfo) : null;
};
