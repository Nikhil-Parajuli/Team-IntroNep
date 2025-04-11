export const loadContract = async (name, provider) => {
    try {
      const res = await fetch(`/contracts/${name}.json`);
      const Artifact = await res.json();
      
      // Handle case where provider is from ethers.js
      const _provider = provider.provider ? provider.provider : provider;
      
      const _contract = contract(Artifact);
      _contract.setProvider(_provider);
      
      let deployedContract;
      try {
        deployedContract = await _contract.deployed();
      } catch (err) {
        console.error("Contract deployment check failed:", err);
        deployedContract = _contract;
      }
      
      return deployedContract;
    } catch (error) {
      console.error("Contract loading error:", error);
      throw error;
    }
  };