# Mental Health Support Platform with Blockchain Appointment Booking

<div align="center">
  <img src="public/ai-assistant.png" alt="Mental Health Platform Logo" width="180" />
  <h3>A secure, private mental health support platform with AI assistance and blockchain-powered appointment booking</h3>
</div>

## Problem Statement

In Nepal and many developing countries, mental health resources are limited and stigmatized. Our platform addresses several critical challenges:

- **Accessibility**: Many people lack access to mental health professionals, especially in rural areas
- **Stigma**: Social stigma prevents many from seeking help openly
- **Cost**: Traditional therapy can be prohibitively expensive
- **Privacy**: Concerns about privacy and confidentiality deter people from seeking help
- **Crisis Response**: Limited emergency resources for individuals experiencing mental health crises

Our solution combines AI chatbot support for immediate assistance with a secure blockchain-based appointment booking system that ensures privacy, transparency, and trust.

## System Architecture

<div align="center">
  <img src="public/architecture.png" alt="System Architecture" width="700" />
</div>

The platform architecture consists of:

1. **Frontend Layer**
   - React/TypeScript user interface with responsive design
   - EmotionalVoiceChatbot component with TTS capabilities
   - Integration with blockchain wallet (MetaMask)

2. **AI Services Layer**
   - Google Gemini AI integration for natural language understanding
   - Emotional detection and crisis intervention system
   - Voice synthesis for realistic TTS responses

3. **Blockchain Layer**
   - Smart contracts for appointment booking (Ethereum/Solidity)
   - TherapistRegistry contract for professional verification
   - BookingContract for secure payment and appointment management

4. **Storage Layer**
   - IPFS for decentralized data storage
   - Encrypted client information

## Instructions to Run the App

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MetaMask browser extension
- Ganache (for local blockchain testing)
- Truffle (for smart contract deployment)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/team-intronep/mental-health-blockchain.git
   cd mental-health-blockchain
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start local blockchain (if testing locally)**
   ```bash
   ganache-cli
   ```

4. **Deploy smart contracts**
   ```bash
   truffle migrate --reset
   ```

5. **Start the application**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Configuration
- Create `.env` file based on `.env.example` with your API keys
- Configure MetaMask to connect to your local blockchain or the testing network

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Vite (build tool)

### AI & Voice
- Google Gemini API
- Speech Recognition API
- Text-to-Speech synthesis
- Emotional analysis

### Blockchain
- Ethereum
- Solidity (smart contracts)
- Truffle (development framework)
- Web3.js (blockchain integration)

### Storage
- IPFS (InterPlanetary File System)
- Encrypted local storage

## Features

### AI Mental Health Assistant
- **Emotional Voice Chatbot**: Conversational AI with realistic voice responses
- **Crisis Detection**: Identifies emergency situations and provides immediate resources
- **Voice Input**: Speech-to-text functionality for natural interaction
- **Personalized Responses**: Tailors responses based on user history and emotional state

### Blockchain Appointment Booking
- **Secure Payments**: Transparent and secure payment processing
- **Smart Contracts**: Automated appointment confirmation and management
- **Therapist Verification**: Blockchain-based verification of professional credentials
- **Anonymous Bookings**: Option for privacy-preserving appointments

### User Experience
- **Responsive Design**: Works across desktop and mobile devices
- **Accessibility**: Complies with WCAG standards for universal access
- **Multiple Languages**: Support for English and Nepali
- **Dark/Light Mode**: Comfortable viewing options

## Team IntroNep

<div align="center">
  <table>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Responsibilities</th>
    </tr>
    <tr>
      <td>Nikhil Parajuli</td>
      <td>Lead Developer & Project Manager,FrontEnd, SmartContract/td>
      <td>System architecture, blockchain integration, and overall coordination</td>
    </tr>
    <tr>
      <td>Binayak Maharjan</td>
      <td>Frontend Developer</td>
      <td>UI/UX design, React components, and responsive implementation</td>
    </tr>
  </table>
</div>

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <p>© 2025 Team IntroNep. All rights reserved.</p>
  <p>
    <a href="https://github.com/team-intronep">GitHub</a> •
    <a href="https://intronep.io">Website</a> •
    <a href="nikhilparajuli99@gmail.com">Contact</a>
  </p>
</div>
