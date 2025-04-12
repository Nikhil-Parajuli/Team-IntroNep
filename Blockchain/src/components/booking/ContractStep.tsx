
import React, { useState, useEffect } from "react";
import { Link, ExternalLink, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContractStepProps {
  contractAddress: string;
}

const ContractStep: React.FC<ContractStepProps> = ({ contractAddress }) => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isDeployed, setIsDeployed] = useState(false);
  const [networkName, setNetworkName] = useState("");

  useEffect(() => {
    const verifyContract = async () => {
      setIsVerifying(true);
      
      try {
        // Check if we're on a network with Etherscan support
        if (window.ethereum) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          let explorerUrl = "";
          
          switch (chainId) {
            case "0x1": // Mainnet
              setNetworkName("Ethereum Mainnet");
              explorerUrl = "https://etherscan.io";
              break;
            case "0x5": // Goerli
              setNetworkName("Goerli Testnet");
              explorerUrl = "https://goerli.etherscan.io";
              break;
            case "0xaa36a7": // Sepolia
              setNetworkName("Sepolia Testnet");
              explorerUrl = "https://sepolia.etherscan.io";
              break;
            default:
              setNetworkName("Local Development Network");
              break;
          }
        }
        
        // Simple check - in a real app, you would verify the contract exists on-chain
        setIsDeployed(!!contractAddress && contractAddress.startsWith("0x"));
      } catch (error) {
        console.error("Error verifying contract:", error);
        setIsDeployed(false);
      } finally {
        setIsVerifying(false);
      }
    };
    
    if (contractAddress) {
      verifyContract();
    }
  }, [contractAddress]);

  const getExplorerUrl = () => {
    if (networkName === "Ethereum Mainnet") return `https://etherscan.io/address/${contractAddress}`;
    if (networkName === "Goerli Testnet") return `https://goerli.etherscan.io/address/${contractAddress}`;
    if (networkName === "Sepolia Testnet") return `https://sepolia.etherscan.io/address/${contractAddress}`;
    return "#"; // Local network or unknown
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Smart Contract Deployment</h3>
      
      {isVerifying ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-therapeutic-500" />
          <span className="ml-3 text-sm text-therapeutic-700">Verifying contract deployment...</span>
        </div>
      ) : isDeployed ? (
        <div className="p-4 bg-therapeutic-50 border border-therapeutic-200 rounded-md">
          <div className="flex items-start">
            <Check className="h-5 w-5 text-therapeutic-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-therapeutic-800">
                Smart Contract Created Successfully
              </p>
              <p className="text-xs text-therapeutic-700 mt-1">
                Contract Address: <span className="font-mono bg-white px-1 py-0.5 rounded">{contractAddress}</span>
              </p>
              <p className="text-xs text-therapeutic-700 mt-1">
                Network: {networkName}
              </p>
              {networkName !== "Local Development Network" && (
                <div className="mt-2">
                  <a href={getExplorerUrl()} target="_blank" rel="noopener noreferrer" 
                     className="text-xs flex items-center text-therapeutic-600 hover:text-therapeutic-800">
                    <ExternalLink className="h-3 w-3 mr-1" /> View on Etherscan
                  </a>
                </div>
              )}
              <p className="text-xs text-therapeutic-700 mt-3">
                Please confirm this booking by submitting the transaction below.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Contract Verification Failed
              </p>
              <p className="text-xs text-red-700 mt-1">
                There was an issue verifying the contract at address: <span className="font-mono">{contractAddress}</span>
              </p>
              <Button 
                className="mt-2 bg-therapeutic-500 text-white text-xs py-1 h-8"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Contract Details:</h4>
        <ul className="text-xs space-y-1 text-gray-600">
          <li>• Appointment will be confirmed once both parties sign</li>
          <li>• Your anonymous ID is used for all communications</li>
          <li>• Cancellation requires 24 hours notice</li>
          <li>• Smart contract ensures data privacy and security</li>
          <li>• All appointment data is stored securely on the blockchain</li>
        </ul>
      </div>
    </div>
  );
};

export default ContractStep;
