import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { loadContract } from './utils/contract';
import './App.css';

function App() {
  const [state, setState] = useState({
    account: '',
    contract: null,
    therapists: [],
    selectedTherapist: null,
    selectedSlot: null,
    sessionType: 'Individual',
    bookingStatus: '',
    networkError: ''
  });

  // Connect to MetaMask and load contract
  useEffect(() => {
    const init = async () => {
      try {
        if (!window.ethereum) {
          setState(prev => ({ ...prev, networkError: 'Please install MetaMask!' }));
          return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        }).catch(err => {
          if (err.code === 4001) {
            setState(prev => ({ ...prev, networkError: 'User denied account access' }));
          } else {
            console.error(err);
            setState(prev => ({ ...prev, networkError: 'Failed to connect to MetaMask' }));
          }
          return [];
        });

        if (accounts.length === 0) return;

        // Create provider
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        
        // Check network (Ganache usually 1337)
        const network = await provider.getNetwork();
        if (network.chainId !== 1337) {
          setState(prev => ({ 
            ...prev, 
            networkError: 'Please connect to Ganache (ChainID: 1337)' 
          }));
          return;
        }

        // Load contract
        const _contract = await loadContract('MentalHealthBooking', provider);
        
        // Load therapists
        const therapistCount = await _contract.nextTherapistId();
        const therapists = await Promise.all(
          [...Array(therapistCount.toNumber() - 1).keys()].map(async (i) => {
            const t = await _contract.therapists(i);
            return {
              ...t,
              availableSlots: t.availableSlots.map(s => s.toNumber())
            };
          })
        );

        setState({
          account: accounts[0],
          contract: _contract,
          therapists,
          selectedTherapist: null,
          selectedSlot: null,
          sessionType: 'Individual',
          bookingStatus: '',
          networkError: ''
        });

      } catch (error) {
        console.error("Initialization error:", error);
        setState(prev => ({ 
          ...prev, 
          networkError: 'Failed to initialize application' 
        }));
      }
    };
    
    // Add chain changed listener
    window.ethereum?.on('chainChanged', () => window.location.reload());
    
    init();

    return () => {
      window.ethereum?.removeListener('chainChanged', () => window.location.reload());
    };
  }, []);

  const handleBookAppointment = async () => {
    try {
      if (!state.selectedTherapist || !state.selectedSlot) return;
      
      setState(prev => ({ ...prev, bookingStatus: 'Processing...' }));
      
      const signer = state.contract.provider.getSigner();
      const contractWithSigner = state.contract.connect(signer);
      
      const tx = await contractWithSigner.bookAppointment(
        state.selectedTherapist.id,
        state.selectedSlot,
        state.sessionType,
        { value: ethers.utils.parseEther("0.1") } // Example: 0.1 ETH fee
      );
      
      await tx.wait();
      setState(prev => ({ 
        ...prev, 
        bookingStatus: 'Booking confirmed!',
        selectedTherapist: null,
        selectedSlot: null
      }));
      
    } catch (error) {
      console.error("Booking error:", error);
      setState(prev => ({ 
        ...prev, 
        bookingStatus: error.message.includes("denied") 
          ? "Transaction rejected" 
          : error.message.includes("revert") 
            ? "Slot no longer available" 
            : "Booking failed"
      }));
    }
  };

  return (
    <div className="container">
      <h1>Mental Health Booking dApp</h1>
      
      {state.networkError ? (
        <div className="error-message">
          <p>{state.networkError}</p>
          {state.networkError.includes('Ganache') && (
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          )}
        </div>
      ) : (
        <>
          <p>Connected Account: {state.account}</p>
          
          <h2>Available Therapists</h2>
          <div className="therapist-grid">
            {state.therapists.map((t, i) => (
              <div 
                key={i} 
                className={`therapist-card ${state.selectedTherapist?.id === t.id ? 'selected' : ''}`}
                onClick={() => setState(prev => ({ ...prev, selectedTherapist: t }))}
              >
                <h3>{t.name}</h3>
                <p>Specialization: {t.specialization}</p>
                <p>Fee: {ethers.utils.formatEther(t.fee)} ETH</p>
              </div>
            ))}
          </div>

          {state.selectedTherapist && (
            <div className="booking-section">
              <h3>Book with {state.selectedTherapist.name}</h3>
              
              <div className="time-slots">
                <h4>Available Slots:</h4>
                {state.selectedTherapist.availableSlots.map((slot, i) => (
                  <button
                    key={i}
                    className={`slot-btn ${state.selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setState(prev => ({ ...prev, selectedSlot: slot }))}
                  >
                    {new Date(slot * 1000).toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="session-type">
                <label>Session Type:</label>
                <select 
                  value={state.sessionType} 
                  onChange={(e) => setState(prev => ({ ...prev, sessionType: e.target.value }))}
                >
                  <option value="Individual">Individual</option>
                  <option value="Group">Group</option>
                  <option value="EAP">EAP</option>
                </select>
              </div>

              {state.selectedSlot && (
                <button 
                  className="book-btn"
                  onClick={handleBookAppointment}
                  disabled={state.bookingStatus === 'Processing...'}
                >
                  {state.bookingStatus === 'Processing...' ? 'Processing...' : 'Confirm Booking'}
                </button>
              )}
              
              {state.bookingStatus && (
                <p className={`status ${state.bookingStatus.includes('failed') ? 'error' : ''}`}>
                  {state.bookingStatus}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { MNEMONIC, PROJECT_ID } = process.env;
const provider = new HDWalletProvider (
  MNEMONIC
  ) 
  `https://goerli.infura.io/v3/${PROJECT_ID}`
  const web3 = new Web3(provider);
  const contract = require('@truffle/contract'
  );
  const MentalHealthBooking = contract(MentalHealthBookingArtifact);



  