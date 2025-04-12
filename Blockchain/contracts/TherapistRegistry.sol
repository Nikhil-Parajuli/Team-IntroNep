
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TherapistRegistry {
    struct Therapist {
        string name;
        string specialization;
        bool isVerified;
        address walletAddress;
    }
    
    mapping(address => Therapist) public therapists;
    address[] public therapistAddresses;
    address public owner;
    
    event TherapistRegistered(address indexed therapistAddress, string name);
    event TherapistVerified(address indexed therapistAddress);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function registerTherapist(string memory _name, string memory _specialization) public {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_specialization).length > 0, "Specialization cannot be empty");
        require(therapists[msg.sender].walletAddress == address(0), "Therapist already registered");
        
        therapists[msg.sender] = Therapist({
            name: _name,
            specialization: _specialization,
            isVerified: false,
            walletAddress: msg.sender
        });
        
        therapistAddresses.push(msg.sender);
        emit TherapistRegistered(msg.sender, _name);
    }
    
    function verifyTherapist(address _therapistAddress) public onlyOwner {
        require(therapists[_therapistAddress].walletAddress != address(0), "Therapist not registered");
        require(!therapists[_therapistAddress].isVerified, "Therapist already verified");
        
        therapists[_therapistAddress].isVerified = true;
        emit TherapistVerified(_therapistAddress);
    }
    
    function isTherapistVerified(address _therapistAddress) public view returns (bool) {
        return therapists[_therapistAddress].isVerified;
    }
    
    function getTherapistCount() public view returns (uint256) {
        return therapistAddresses.length;
    }
    
    function getTherapistByIndex(uint256 _index) public view returns (
        address walletAddress,
        string memory name,
        string memory specialization,
        bool isVerified
    ) {
        require(_index < therapistAddresses.length, "Index out of bounds");
        address therapistAddress = therapistAddresses[_index];
        Therapist storage therapist = therapists[therapistAddress];
        
        return (
            therapist.walletAddress,
            therapist.name,
            therapist.specialization,
            therapist.isVerified
        );
    }
    
    function getVerifiedTherapists() public view returns (address[] memory) {
        uint256 verifiedCount = 0;
        
        // Count verified therapists
        for (uint256 i = 0; i < therapistAddresses.length; i++) {
            if (therapists[therapistAddresses[i]].isVerified) {
                verifiedCount++;
            }
        }
        
        // Create array of verified therapists
        address[] memory verifiedTherapists = new address[](verifiedCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < therapistAddresses.length; i++) {
            if (therapists[therapistAddresses[i]].isVerified) {
                verifiedTherapists[currentIndex] = therapistAddresses[i];
                currentIndex++;
            }
        }
        
        return verifiedTherapists;
    }
}
