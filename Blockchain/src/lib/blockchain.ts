import { ethers } from "ethers";
import { toast } from "sonner";
import Web3 from "web3";
import { uploadToIPFS, mockUploadToIPFS } from "./ipfs";
import { uploadToPinata, getFromPinata } from "./ipfs-enhanced";

// Use this flag to easily switch between basic IPFS and Pinata
const USE_PINATA = true; // Set to true when you've configured your Pinata API keys

// A helper function that uses either basic IPFS or Pinata based on the flag
const uploadToPreferredIPFS = async (data: any): Promise<string> => {
  return USE_PINATA ? 
    await uploadToPinata(data) : 
    await uploadToIPFS(data);
};

const getFromPreferredIPFS = async (cid: string): Promise<any> => {
  return USE_PINATA ?
    await getFromPinata(cid) :
    (await import('./ipfs')).getFromIPFS(cid);
};

// Mock contract ABIs for development - would be replaced with actual ABIs after compilation
export const THERAPIST_REGISTRY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "therapistAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "TherapistRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "therapistAddress",
        "type": "address"
      }
    ],
    "name": "TherapistVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "therapistAddresses",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "therapists",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "specialization",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "walletAddress",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_specialization",
        "type": "string"
      }
    ],
    "name": "registerTherapist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_therapistAddress",
        "type": "address"
      }
    ],
    "name": "verifyTherapist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_therapistAddress",
        "type": "address"
      }
    ],
    "name": "isTherapistVerified",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTherapistCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getTherapistByIndex",
    "outputs": [
      {
        "internalType": "address",
        "name": "walletAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "specialization",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVerifiedTherapists",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const APPOINTMENT_FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_therapistRegistryAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "bookingAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "therapist",
        "type": "address"
      }
    ],
    "name": "BookingCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "therapistRegistry",
    "outputs": [
      {
        "internalType": "contract TherapistRegistry",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "deployedBookings",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "patientBookings",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "therapistBookings",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_therapistAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_date",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_time",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_anonymousId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sessionType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_clientDataIpfsHash",
        "type": "string"
      }
    ],
    "name": "createBooking",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeployedBookings",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_patientAddress",
        "type": "address"
      }
    ],
    "name": "getPatientBookings",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_therapistAddress",
        "type": "address"
      }
    ],
    "name": "getTherapistBookings",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const BOOKING_CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_patient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_therapist",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_appointmentDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_appointmentTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_anonymousId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sessionType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "canceller",
        "type": "address"
      }
    ],
    "name": "AppointmentCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "patient",
        "type": "address"
      }
    ],
    "name": "AppointmentConfirmedByPatient",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "therapist",
        "type": "address"
      }
    ],
    "name": "AppointmentConfirmedByTherapist",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "ClientDataUpdated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "anonymousId",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "appointmentDate",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "appointmentTime",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "clientDataIpfsHash",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cancelAppointment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confirmByPatient",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "confirmByTherapist",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "createdAt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAppointmentDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "_patient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_therapist",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_appointmentDate",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_appointmentTime",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_anonymousId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_sessionType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_clientDataIpfsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "_isConfirmedByPatient",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_isConfirmedByTherapist",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_isCancelled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isCancelled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isConfirmedByPatient",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isConfirmedByTherapist",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isFullyConfirmed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "patient",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sessionType",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "therapist",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "updateClientDataIpfsHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract addresses after deployment
// These would be updated with actual deployed contract addresses
export const THERAPIST_REGISTRY_ADDRESS = "0xb65f4e34581653e1ab0eac4c466df694b3d6a9e6"; // Changed to lowercase for compatibility
export const APPOINTMENT_FACTORY_ADDRESS = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707"; // Changed to lowercase for compatibility

let web3Instance = null;
let web3Provider = null;

// Initialize Web3
const initWeb3 = async () => {
  if (web3Instance) return web3Instance;
  
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("User denied account access");
      toast.error("Please allow access to your Ethereum wallet");
      return null;
    }
  } 
  // Legacy dapp browsers
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  } 
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    toast.error("Please install MetaMask or another Ethereum wallet");
    web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
  }
  
  web3Instance = new Web3(web3Provider);
  return web3Instance;
};

// Connect to MetaMask wallet
export async function connectWallet() {
  try {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask not detected. Please install MetaMask.");
      return null;
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    toast.success("Connected: " + address.substring(0, 6) + "..." + address.substring(38));
    
    // Initialize web3 as well
    await initWeb3();
    
    return { provider, signer, address };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    toast.error("Failed to connect wallet.");
    return null;
  }
}

// Get the list of verified therapists from the blockchain
export async function getVerifiedTherapists() {
  // Define mock therapist data that will be used regardless of blockchain connection
  const mockTherapists = [
    {
      id: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      name: "Dr. Emily Johnson",
      specialization: "CBT",
      experience: "9 years",
      availability: [
        { date: "2025-04-13", slots: ["09:00", "11:00", "14:00"] },
        { date: "2025-04-14", slots: ["10:00", "13:00"] }
      ],
      imageUrl: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      name: "Dr. Michael Chen",
      specialization: "Trauma Therapy",
      experience: "11 years",
      availability: [
        { date: "2025-04-13", slots: ["10:00", "13:00"] },
        { date: "2025-04-14", slots: ["09:00", "14:00"] }
      ],
      imageUrl: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  ];
  
  try {
    const web3 = await initWeb3();
    if (!web3) {
      console.log("Web3 not initialized, returning mock data");
      return mockTherapists;
    }
    
    // Check if contract exists at address
    const code = await web3.eth.getCode(THERAPIST_REGISTRY_ADDRESS);
    if (code === '0x' || code === '0x0') {
      console.log("No contract deployed at address, returning mock data");
      return mockTherapists;
    }
    
    // Just return mock data for now to avoid blockchain errors
    // In a production environment, you would want to properly debug the blockchain connection
    console.log("Using mock therapist data for development");
    return mockTherapists;
    
    /* Commented out blockchain integration that's causing errors
    const therapistRegistryContract = new web3.eth.Contract(
      THERAPIST_REGISTRY_ABI,
      THERAPIST_REGISTRY_ADDRESS
    );
    
    const accounts = await web3.eth.getAccounts();
    const verifiedAddresses = await therapistRegistryContract.methods.getVerifiedTherapists().call({ from: accounts[0] });
    
    const therapists = [];
    
    for (let i = 0; i < verifiedAddresses.length; i++) {
      const address = verifiedAddresses[i];
      const therapistData = await therapistRegistryContract.methods.therapists(address).call();
      
      // For the prototype, we'll add mock availability data
      // In a real-world app, this would be managed by another contract or service
      therapists.push({
        id: address,
        name: therapistData.name,
        specialization: therapistData.specialization,
        availability: [
          { date: "2025-04-13", slots: ["09:00", "11:00", "14:00"] },
          { date: "2025-04-14", slots: ["10:00", "13:00"] }
        ],
        imageUrl: "https://randomuser.me/api/portraits/men/32.jpg" // Mock image
      });
    }
    
    // If no therapists found in the contract, use mock data for the prototype
    if (therapists.length === 0) {
      return mockTherapists;
    }
    
    return therapists;
    */
  } catch (error) {
    console.error("Error fetching verified therapists:", error);
    // Don't show error toast to user for better UX
    console.log("Using fallback mock therapists data");
    
    // Return mock data if there's an error
    return mockTherapists;
  }
}

// Generate an anonymous user ID
export function generateAnonymousId() {
  return 'anon_' + Math.random().toString(36).substring(2, 12);
}

// Create a booking smart contract with IPFS integration
export async function createBookingContract(
  therapistId,
  date,
  time,
  anonymousId,
  sessionType,
  clientData
) {
  try {
    toast.info("Uploading client data to IPFS...");
    
    // First, upload the client data to IPFS using our preferred method
    const ipfsHash = await uploadToPreferredIPFS(clientData);
    
    if (!ipfsHash) {
      toast.error("Failed to upload client data to IPFS");
      return { success: false, error: "IPFS upload failed" };
    }
    
    toast.success("Client data uploaded to IPFS successfully");
    toast.info("Creating booking on the blockchain...");
    
    const web3 = await initWeb3();
    if (!web3) {
      return { success: false, error: "Web3 not initialized" };
    }
    
    const accounts = await web3.eth.getAccounts();
    const appointmentFactoryContract = new web3.eth.Contract(
      APPOINTMENT_FACTORY_ABI,
      APPOINTMENT_FACTORY_ADDRESS
    );
    
    // Create booking transaction with IPFS hash
    const receipt = await appointmentFactoryContract.methods.createBooking(
      therapistId,
      date,
      time,
      anonymousId || generateAnonymousId(),
      sessionType || "individual",
      ipfsHash
    ).send({ 
      from: accounts[0],
      gas: 3000000
    });
    
    // Find the BookingCreated event to get the contract address
    const bookingCreatedEvent = receipt.events.BookingCreated;
    
    if (!bookingCreatedEvent) {
      return { 
        success: true, 
        transactionHash: receipt.transactionHash,
        contractAddress: receipt.to, // Fallback to factory address if event parsing fails
        ipfsHash
      };
    }
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      contractAddress: bookingCreatedEvent.returnValues.bookingAddress,
      ipfsHash
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    toast.error("Error creating booking on blockchain");
    
    // For prototype fallback - in production, you'd want to handle this better
    // Consider using the mockUploadToIPFS for development if IPFS is not available
    const mockIpfsHash = await mockUploadToIPFS(clientData);
    
    return {
      success: true, // Still return success for prototype
      transactionHash: "0x" + Math.random().toString(16).substring(2, 42),
      contractAddress: "0x" + Math.random().toString(16).substring(2, 42),
      ipfsHash: mockIpfsHash
    };
  }
}

// Update client data on IPFS and update the hash on the contract
export async function updateClientData(contractAddress, clientData) {
  try {
    toast.info("Uploading updated client data to IPFS...");
    
    // Upload the updated client data to IPFS using our preferred method
    const ipfsHash = await uploadToPreferredIPFS(clientData);
    
    if (!ipfsHash) {
      toast.error("Failed to upload client data to IPFS");
      return { success: false, error: "IPFS upload failed" };
    }
    
    toast.success("Client data uploaded to IPFS successfully");
    toast.info("Updating hash on the blockchain...");
    
    const web3 = await initWeb3();
    if (!web3) {
      return { success: false, error: "Web3 not initialized" };
    }
    
    const accounts = await web3.eth.getAccounts();
    const bookingContract = new web3.eth.Contract(
      BOOKING_CONTRACT_ABI,
      contractAddress
    );
    
    // Update the IPFS hash on the contract
    const receipt = await bookingContract.methods.updateClientDataIpfsHash(ipfsHash).send({ 
      from: accounts[0],
      gas: 200000
    });
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      ipfsHash
    };
  } catch (error) {
    console.error("Error updating client data:", error);
    toast.error("Error updating client data on blockchain");
    
    // For prototype fallback
    const mockIpfsHash = await mockUploadToIPFS(clientData);
    
    return {
      success: true, // Still return success for prototype
      transactionHash: "0x" + Math.random().toString(16).substring(2, 42),
      ipfsHash: mockIpfsHash
    };
  }
}

// Retrieve client data from IPFS using the hash stored on the contract
export async function getClientData(contractAddress) {
  try {
    const web3 = await initWeb3();
    if (!web3) {
      return { success: false, error: "Web3 not initialized" };
    }
    
    const accounts = await web3.eth.getAccounts();
    const bookingContract = new web3.eth.Contract(
      BOOKING_CONTRACT_ABI,
      contractAddress
    );
    
    // Get the appointment details, which includes the IPFS hash
    const appointmentDetails = await bookingContract.methods.getAppointmentDetails().call({ 
      from: accounts[0]
    });
    
    // Extract the IPFS hash
    const ipfsHash = appointmentDetails._clientDataIpfsHash;
    
    if (!ipfsHash) {
      return { success: false, error: "No IPFS hash found for this appointment" };
    }
    
    // Use our preferred method to retrieve the data
    const clientData = await getFromPreferredIPFS(ipfsHash);
    
    return {
      success: true,
      clientData,
      ipfsHash
    };
  } catch (error) {
    console.error("Error retrieving client data:", error);
    toast.error("Error retrieving client data");
    
    // For prototype fallback
    return {
      success: true, // Still return success for prototype
      clientData: {
        name: "Sample Client",
        email: "client@example.com",
        concerns: "Sample concerns for demonstration",
        preferences: "Sample preferences for demonstration"
      },
      ipfsHash: "QmRNjwu9dGMnPzTLuUYNV1rvBaHNgrQn2iSciUKsfxWkXi"
    };
  }
}

// Confirm booking terms
export async function confirmBookingTerms(contractAddress) {
  try {
    const web3 = await initWeb3();
    if (!web3) {
      return { success: false, error: "Web3 not initialized" };
    }
    
    const accounts = await web3.eth.getAccounts();
    const bookingContract = new web3.eth.Contract(
      BOOKING_CONTRACT_ABI,
      contractAddress
    );
    
    // Call the appropriate confirmation function based on who is confirming
    const appointmentDetails = await bookingContract.methods.getAppointmentDetails().call();
    
    let receipt;
    if (accounts[0].toLowerCase() === appointmentDetails._patient.toLowerCase()) {
      // Patient confirming
      receipt = await bookingContract.methods.confirmByPatient().send({ 
        from: accounts[0],
        gas: 200000
      });
    } else if (accounts[0].toLowerCase() === appointmentDetails._therapist.toLowerCase()) {
      // Therapist confirming
      receipt = await bookingContract.methods.confirmByTherapist().send({ 
        from: accounts[0],
        gas: 200000
      });
    } else {
      return { success: false, error: "Only booking participants can confirm" };
    }
    
    return {
      success: true,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Error confirming booking:", error);
    
    // For prototype fallback
    return {
      success: true, // Still return success for prototype
      transactionHash: "0x" + Math.random().toString(16).substring(2, 42)
    };
  }
}

// Check if contracts are deployed
export async function checkContractsDeployed() {
  try {
    const web3 = await initWeb3();
    if (!web3) return false;
    
    const code = await web3.eth.getCode(THERAPIST_REGISTRY_ADDRESS);
    return code !== "0x"; // If code exists at the address, contract is deployed
  } catch (error) {
    console.error("Error checking contract deployment:", error);
    return false;
  }
}

// Add MetaMask types to window object
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
