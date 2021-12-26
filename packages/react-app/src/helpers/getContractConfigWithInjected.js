import deployedContracts from "../contracts/hardhat_contracts.json";
import externalContracts from "../contracts/external_contracts";

export const getContractConfigWithInjected = customContractConfigs => {
  const deployed = deployedContracts;

  const deployedCopy = deployed ? copy(deployed) : {};

  customContractConfigs.forEach(cfg => {
    const { contractName, abi, contractAddress, localChainId } = cfg;
    Object.values(deployedCopy[localChainId])[0].contracts[contractName] = {
      address: contractAddress,
      abi,
    };
  });

  return {
    deployedContracts: deployedCopy,
    externalContracts: externalContracts || {},
  };
};

const copy = obj => JSON.parse(JSON.stringify(obj));
