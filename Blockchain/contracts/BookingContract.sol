// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BookingContract {
    address public patient;
    address public therapist;
    string public appointmentDate;
    string public appointmentTime;
    string public anonymousId;
    string public sessionType;
    bool public isConfirmedByPatient;
    bool public isConfirmedByTherapist;
    bool public isCancelled;
    uint public createdAt;
    // Added new field for IPFS hash
    string public clientDataIpfsHash;
    
    event AppointmentConfirmedByPatient(address indexed patient);
    event AppointmentConfirmedByTherapist(address indexed therapist);
    event AppointmentCancelled(address indexed canceller);
    event ClientDataUpdated(string ipfsHash);
    
    modifier onlyParticipant() {
        require(msg.sender == patient || msg.sender == therapist, "Only booking participants can perform this action");
        _;
    }
    
    modifier onlyPatient() {
        require(msg.sender == patient, "Only patient can perform this action");
        _;
    }
    
    modifier onlyTherapist() {
        require(msg.sender == therapist, "Only therapist can perform this action");
        _;
    }
    
    modifier notCancelled() {
        require(!isCancelled, "Appointment has been cancelled");
        _;
    }
    
    constructor(
        address _patient,
        address _therapist,
        string memory _appointmentDate,
        string memory _appointmentTime,
        string memory _anonymousId,
        string memory _sessionType,
        string memory _ipfsHash
    ) {
        patient = _patient;
        therapist = _therapist;
        appointmentDate = _appointmentDate;
        appointmentTime = _appointmentTime;
        anonymousId = _anonymousId;
        sessionType = _sessionType;
        clientDataIpfsHash = _ipfsHash;
        createdAt = block.timestamp;
    }
    
    function confirmByPatient() public onlyPatient notCancelled {
        isConfirmedByPatient = true;
        emit AppointmentConfirmedByPatient(patient);
    }
    
    function confirmByTherapist() public onlyTherapist notCancelled {
        isConfirmedByTherapist = true;
        emit AppointmentConfirmedByTherapist(therapist);
    }
    
    function cancelAppointment() public onlyParticipant {
        require(!isConfirmedByPatient || !isConfirmedByTherapist, "Cannot cancel confirmed appointment");
        isCancelled = true;
        emit AppointmentCancelled(msg.sender);
    }
    
    // Added new function to update client data when needed
    function updateClientDataIpfsHash(string memory _ipfsHash) public onlyParticipant notCancelled {
        clientDataIpfsHash = _ipfsHash;
        emit ClientDataUpdated(_ipfsHash);
    }
    
    function getAppointmentDetails() public view returns (
        address _patient,
        address _therapist,
        string memory _appointmentDate,
        string memory _appointmentTime,
        string memory _anonymousId,
        string memory _sessionType,
        string memory _clientDataIpfsHash,
        bool _isConfirmedByPatient,
        bool _isConfirmedByTherapist,
        bool _isCancelled
    ) {
        return (
            patient,
            therapist,
            appointmentDate,
            appointmentTime,
            anonymousId,
            sessionType,
            clientDataIpfsHash,
            isConfirmedByPatient,
            isConfirmedByTherapist,
            isCancelled
        );
    }
    
    function isFullyConfirmed() public view returns (bool) {
        return isConfirmedByPatient && isConfirmedByTherapist && !isCancelled;
    }
}
