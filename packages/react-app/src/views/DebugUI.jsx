import { Button, Card, Divider, Space } from "antd";
import React, { useState } from "react";
import { Contract } from "../components";
import { injectContract } from "../helpers/injectContractConfig";
import externalContracts from "../contracts/external_contracts";
// contracts
import deployedContracts from "../contracts/hardhat_contracts.json";
import StakerDebugHeader from "../components/Debug/StakerDebugHeader";
import { mediumButtonMinWidth, primaryColor } from "../styles";
import { LeftOutlined } from "@ant-design/icons";
import StakerDebug from "../components/Debug/StakerDebug";
import { getContractConfigWithInjected } from "../helpers/getContractConfigWithInjected";

const DebugUI = ({
  factoryAddress,
  stakerContracts,
  injectableAbis,
  localChainId,
  localProvider,
  blockExplorer,
  userSigner,
  contractConfig,
}) => {
  const [openedDebugStaker, setOpenedDebugStaker] = useState();
  const handleBack = () => setOpenedDebugStaker(null);

  return (
    <div
      style={{ width: "70vw", padding: "2rem 0 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Contract
        name="StakerFactory"
        signer={userSigner}
        provider={localProvider}
        address={factoryAddress}
        blockExplorer={blockExplorer}
        contractConfig={contractConfig}
        noPadding
      />
      <Divider style={{ margin: "3rem 0 0" }}>
        <span style={{ fontSize: "1.5rem" }}>Created Contracts</span>
      </Divider>
      <div style={{ alignSelf: "stretch" }}>
        {/* HEAD SECTION */}
        <div style={{ height: "14rem", display: "flex", alignItems: "center", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "6rem",
            }}
          >
            🏗
          </div>
          {openedDebugStaker && (
            <Button style={{ minWidth: mediumButtonMinWidth }} onClick={handleBack}>
              <LeftOutlined /> Back
            </Button>
          )}
        </div>
      </div>

      {stakerContracts && injectableAbis && (
        <>
          {/* OPENED ONE */}
          {openedDebugStaker && (
            <StakerDebug
              stakerContract={openedDebugStaker.staker}
              contractConfig={openedDebugStaker.contractConfig}
              localProvider={localProvider}
              blockExplorer={blockExplorer}
              userSigner={userSigner}
            />
          )}
          {/* LIST */}
          {!openedDebugStaker && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {stakerContracts.map(stakerContract => {
                /**
                 * contractConfig not from props,
                 * we create a copy in which we inject this particular contract
                 **/
                const contractCfg = getContractConfigWithInjected([
                  {
                    contractName: "Staker",
                    abi: injectableAbis.Staker,
                    contractAddress: stakerContract.address,
                    localChainId,
                  },
                  {
                    contractName: "ExampleExternalContract",
                    abi: injectableAbis.ExampleExternalContract,
                    contractAddress: stakerContract.destinationContractAddress,
                    localChainId,
                  },
                ]);
                const handleOpen = () =>
                  setOpenedDebugStaker({
                    staker: stakerContract,
                    contractConfig: contractCfg,
                  });
                return (
                  <div size="small" className="hoverableLight" key={stakerContract.address} onClick={handleOpen}>
                    <StakerDebugHeader stakerContract={stakerContract} hoverable />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DebugUI;
