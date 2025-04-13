import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { connectWallet } from "@/lib/blockchain";
import { Calendar, Clock, User } from "lucide-react";

const Header = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        setWalletAddress(window.ethereum.selectedAddress);
      }
    };
    
    checkWallet();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const walletInfo = await connectWallet();
      if (walletInfo) {
        setWalletAddress(walletInfo.address);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <div className="bg-calm-500 text-white p-2 rounded-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-therapeutic-600 to-calm-500 bg-clip-text text-transparent">
            MindChain
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-calm-600 flex items-center gap-2">
            <User size={18} />
            <span>Therapists</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-calm-600 flex items-center gap-2">
            <Calendar size={18} />
            <span>Appointments</span>
          </a>
          <a href="#" className="text-gray-600 hover:text-calm-600 flex items-center gap-2">
            <Clock size={18} />
            <span>How It Works</span>
          </a>
        </nav>
        
        <div>
          {walletAddress ? (
            <Button variant="outline" className="border-therapeutic-300 text-therapeutic-700">
              {`${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`}
            </Button>
          ) : (
            <Button 
              onClick={handleConnectWallet} 
              disabled={isConnecting}
              className="bg-gradient-to-r from-therapeutic-500 to-calm-500 hover:from-therapeutic-600 hover:to-calm-600"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
