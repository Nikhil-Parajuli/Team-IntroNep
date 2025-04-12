const MentalHealthBooking = artifacts.require("MentalHealthBooking");

module.exports = function (deployer) {
  deployer.deploy(MentalHealthBooking);
};

