
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./TherapistRegistry.sol";
import "./BookingContract.sol";

contract AppointmentFactory {
    TherapistRegistry public therapistRegistry;
    address[] public deployedBookings;
    
    mapping(address => address[]) public patientBookings;
    mapping(address => address[]) public therapistBookings;
    
    event BookingCreated(address indexed bookingAddress, address indexed patient, address indexed therapist);
    
    constructor(address _therapistRegistryAddress) {
        therapistRegistry = TherapistRegistry(_therapistRegistryAddress);
    }
    
    function createBooking(
        address _therapistAddress,
        string memory _date,
        string memory _time,
        string memory _anonymousId,
        string memory _sessionType
    ) public returns (address) {
        require(therapistRegistry.isTherapistVerified(_therapistAddress), "Therapist is not verified");
        
        BookingContract newBooking = new BookingContract(
            msg.sender,
            _therapistAddress,
            _date,
            _time,
            _anonymousId,
            _sessionType
        );
        
        address bookingAddress = address(newBooking);
        deployedBookings.push(bookingAddress);
        patientBookings[msg.sender].push(bookingAddress);
        therapistBookings[_therapistAddress].push(bookingAddress);
        
        emit BookingCreated(bookingAddress, msg.sender, _therapistAddress);
        
        return bookingAddress;
    }
    
    function getDeployedBookings() public view returns (address[] memory) {
        return deployedBookings;
    }
    
    function getPatientBookings(address _patientAddress) public view returns (address[] memory) {
        return patientBookings[_patientAddress];
    }
    
    function getTherapistBookings(address _therapistAddress) public view returns (address[] memory) {
        return therapistBookings[_therapistAddress];
    }
}
