// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MentalHealthBooking {
    // Structs (custom data types)
    struct Therapist {
        uint id;
        string name;
        string specialization;
        uint[] availableSlots; // Unix timestamps
        uint fee;
        bool isVerified;
    }

    struct Appointment {
        uint id;
        uint therapistId;
        uint slotTime;
        string sessionType; // "Individual", "Group", "EAP"
        address client; // Anonymous ID (if needed, use a hash)
        bool isConfirmed;
    }

    // State Variables (stored on blockchain)
    Therapist[] public therapists;
    Appointment[] public appointments;
    uint public nextTherapistId = 1;
    uint public nextAppointmentId = 1;

    // Events (for frontend notifications)
    event TherapistAdded(uint id, string name);
    event AppointmentBooked(uint id, uint therapistId, uint slotTime);

    // Add a new therapist (only admin in future)
    function addTherapist(
        string memory _name,
        string memory _specialization,
        uint[] memory _availableSlots,
        uint _fee
    ) public {
        therapists.push(
            Therapist({
                id: nextTherapistId,
                name: _name,
                specialization: _specialization,
                availableSlots: _availableSlots,
                fee: _fee,
                isVerified: true
            })
        );
        emit TherapistAdded(nextTherapistId, _name);
        nextTherapistId++;
    }

    // Book an appointment
    function bookAppointment(
        uint _therapistId,
        uint _slotTime,
        string memory _sessionType
    ) public {
        // Check if slot is available (simplified for now)
        bool isSlotAvailable = false;
        for (uint i = 0; i < therapists[_therapistId - 1].availableSlots.length; i++) {
            if (therapists[_therapistId - 1].availableSlots[i] == _slotTime) {
                isSlotAvailable = true;
                break;
            }
        }
        require(isSlotAvailable, "Slot not available");

        // Create appointment
        appointments.push(
            Appointment({
                id: nextAppointmentId,
                therapistId: _therapistId,
                slotTime: _slotTime,
                sessionType: _sessionType,
                client: msg.sender, // Client's wallet address (or anonymized later)
                isConfirmed: true
            })
        );

        emit AppointmentBooked(nextAppointmentId, _therapistId, _slotTime);
        nextAppointmentId++;
    }

    // Get all therapists (for frontend display)
    function getAllTherapists() public view returns (Therapist[] memory) {
        return therapists;
    }

    // Get all appointments for a client
    function getClientAppointments(address _client) public view returns (Appointment[] memory) {
        Appointment[] memory result = new Appointment[](appointments.length);
        uint counter = 0;
        for (uint i = 0; i < appointments.length; i++) {
            if (appointments[i].client == _client) {
                result[counter] = appointments[i];
                counter++;
            }
        }
        return result;
    }
}