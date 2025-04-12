
const TherapistRegistry = artifacts.require("TherapistRegistry");
const AppointmentFactory = artifacts.require("AppointmentFactory");

module.exports = async function (deployer) {
  // Deploy TherapistRegistry first
  await deployer.deploy(TherapistRegistry);
  const therapistRegistry = await TherapistRegistry.deployed();
  
  // Deploy AppointmentFactory with TherapistRegistry address
  await deployer.deploy(AppointmentFactory, therapistRegistry.address);
};
