import { Contract } from "..";
import StakerDebugHeader from "./StakerDebugHeader";

const StakerDebug = ({ stakerContract, blockExplorer, contractConfig, userSigner, localProvider }) => {
  return (
    <div>
      <StakerDebugHeader stakerContract={stakerContract} />
      <Contract
        name="Staker"
        key={stakerContract.address}
        signer={userSigner}
        provider={localProvider}
        address={stakerContract.address}
        blockExplorer={blockExplorer}
        contractConfig={contractConfig}
        noPadding
      />
      <Contract
        name="ExampleExternalContract"
        key={stakerContract.destinationContractAddress}
        signer={userSigner}
        provider={localProvider}
        address={stakerContract.destinationContractAddress}
        blockExplorer={blockExplorer}
        contractConfig={contractConfig}
        noPadding
      />
    </div>
  );
};

export default StakerDebug;
