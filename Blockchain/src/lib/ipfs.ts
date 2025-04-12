import { create } from 'ipfs-http-client';
import { toast } from 'sonner';

// Configure IPFS client
// We'll use a public IPFS gateway for development
const publicGateway = "https://ipfs.io/ipfs/";

// For more reliable pinning in production, you should use a dedicated service
// like Infura, Pinata, or Web3.Storage with your own API keys
const ipfsOptions = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
};

// Function to create a client using a public node
const createPublicClient = () => {
  try {
    return create({
      // Use public IPFS API endpoint (with limitations)
      url: 'https://ipfs.infura.io:5001/api/v0'
    });
  } catch (error) {
    console.error("Failed to connect to public IPFS node:", error);
    return null;
  }
};

// Function to create a fallback client using a local node (if running one)
const createLocalClient = () => {
  try {
    return create({
      host: 'localhost',
      port: 5001,
      protocol: 'http'
    });
  } catch (error) {
    console.error("Failed to connect to local IPFS node:", error);
    return null;
  }
};

// Try public client first, fall back to local if needed
let ipfs = createPublicClient() || createLocalClient();

// Function to upload data to IPFS
export const uploadToIPFS = async (data: any): Promise<string | null> => {
  try {
    if (!ipfs) {
      console.warn("IPFS client not initialized, using mock functionality");
      return mockUploadToIPFS(data);
    }

    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data);
    
    // Upload the JSON string to IPFS
    const result = await ipfs.add(jsonData);
    
    // Return the CID (Content Identifier) - this is the IPFS hash
    return result.path;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    toast.error("Failed to upload data to IPFS, using mock functionality");
    
    // Fall back to mock functionality
    return mockUploadToIPFS(data);
  }
};

// Function to retrieve data from IPFS
export const getFromIPFS = async (cid: string): Promise<any | null> => {
  try {
    if (!ipfs) {
      console.warn("IPFS client not initialized, using mock data");
      return { message: "Mock data since IPFS client is not initialized" };
    }
    
    // Get the data using the IPFS client
    const stream = await ipfs.cat(cid);
    let data = '';

    for await (const chunk of stream) {
      data += chunk.toString();
    }

    // Parse the JSON data
    return JSON.parse(data);
  } catch (error) {
    console.error("Error retrieving from IPFS:", error);
    toast.error("Failed to retrieve data from IPFS");
    
    // For development, provide a fallback
    return { error: "Failed to retrieve data", mock: true };
  }
};

// Get IPFS gateway URL for a CID
export const getIPFSUrl = (cid: string): string => {
  if (!cid) return '';
  return `${publicGateway}${cid}`;
};

// Mock function for development environments where IPFS might not be available
export const mockUploadToIPFS = async (data: any): Promise<string> => {
  console.log("Mock uploading data to IPFS:", data);
  // Return a fake CID
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return "QmRNjwu9dGMnPzTLuUYNV1rvBaHNgrQn2iSciUKsfxWkXi";
};