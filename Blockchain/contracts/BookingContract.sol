
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
    
    event AppointmentConfirmedByPatient(address indexed patient);
    event AppointmentConfirmedByTherapist(address indexed therapist);
    event AppointmentCancelled(address indexed canceller);
    
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
        string memory _sessionType
    ) {
        patient = _patient;
        therapist = _therapist;
        appointmentDate = _appointmentDate;
        appointmentTime = _appointmentTime;
        anonymousId = _anonymousId;
        sessionType = _sessionType;
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
    
    function getAppointmentDetails() public view returns (
        address _patient,
        address _therapist,
        string memory _appointmentDate,
        string memory _appointmentTime,
        string memory _anonymousId,
        string memory _sessionType,
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
            isConfirmedByPatient,
            isConfirmedByTherapist,
            isCancelled
        );
    }
    
    function isFullyConfirmed() public view returns (bool) {
        return isConfirmedByPatient && isConfirmedByTherapist && !isCancelled;
    }
}
