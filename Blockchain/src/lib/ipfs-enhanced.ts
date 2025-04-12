import axios from 'axios';
import { toast } from 'sonner';
import { mockUploadToIPFS, getIPFSUrl } from './ipfs';

// Replace these with your Pinata API keys
const PINATA_API_KEY = "a95256cebfe4d9610135";
const PINATA_SECRET_API_KEY = "5f4a1c5c626b768f271bd283e4a2557cab369aa2248f1cf9b2d50bc63a1e670a";

// Upload data to IPFS via Pinata
export const uploadToPinata = async (data: any): Promise<string | null> => {
  try {
    if (!PINATA_API_KEY || PINATA_API_KEY === "a95256cebfe4d9610135") {
      console.warn("Pinata API keys not configured, falling back to mock function");
      return mockUploadToIPFS(data);
    }

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data);

    // Create JSON file for Pinata
    const formData = new FormData();
    const blob = new Blob([jsonData], { type: 'application/json' });
    formData.append('file', blob, 'client-data.json');

    // Add metadata for better organization
    const metadata = JSON.stringify({
      name: `Client-${Date.now()}`,
      keyvalues: {
        type: "client-booking-data",
        timestamp: Date.now().toString()
      }
    });
    formData.append('pinataMetadata', metadata);

    // Configure Pinata API request
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data;`,
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY
        }
      }
    );

    // Return the IPFS hash (CID)
    return res.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    toast.error("Failed to upload data to Pinata, using fallback method");
    
    // Fall back to regular IPFS upload or mock
    return mockUploadToIPFS(data);
  }
};

// Get data from IPFS via Pinata gateway
export const getFromPinata = async (cid: string): Promise<any | null> => {
  try {
    // Use Pinata gateway to retrieve the data
    const pinataGateway = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    const response = await axios.get(pinataGateway);
    return response.data;
  } catch (error) {
    console.error("Error retrieving from Pinata:", error);
    toast.error("Failed to retrieve data from Pinata");
    
    // Try the public gateway as fallback
    try {
      const publicUrl = getIPFSUrl(cid);
      const response = await axios.get(publicUrl);
      return response.data;
    } catch (fallbackError) {
      console.error("Fallback retrieval also failed:", fallbackError);
      return { error: "Failed to retrieve data", mock: true };
    }
  }
};