export const injectContract = ({ contractConfig, contractAddress, contractName, abi, localChainId }) => {
  const deployedContracts = contractConfig.deployedContracts;
  Object.values(deployedContracts[localChainId])[0].contracts[contractName] = {
    address: contractAddress,
    abi,
  };
};
