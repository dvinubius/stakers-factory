import { LeftOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { useState } from "react";
import AllStakers from "../components/Factory/AllStakers";
import CreateStaker from "../components/Factory/CreateStaker";
import Staker from "../components/Staker/Staker";
import { mainColWidth, mediumButtonMinWidth } from "../styles";

const StakersUI = ({
  factoryAddress,
  injectableAbis,
  stakerContracts,
  localProvider,
  mainnetProvider,
  contractConfig,
  gasPrice,
  userSigner,
  localChainId,
  price,
  DEBUG,
}) => {
  const [openedStakerContract, setOpenedStakerContract] = useState();
  const handleOpenContract = c => setOpenedStakerContract(c);
  const handleBack = () => setOpenedStakerContract(null);

  return (
    <div
      style={{
        width: mainColWidth,
        display: "flex",
        flexDirection: "column",
        minHeight: "70vh",
        margin: "auto",
        paddingTop: "2rem",
      }}
    >
      {/* NAVI */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {!openedStakerContract && (
          <div style={{ marginLeft: "auto" }}>
            <CreateStaker
              contractConfig={contractConfig}
              gasPrice={gasPrice}
              userSigner={userSigner}
              localChainId={localChainId}
              localProvider={localProvider}
              price={price}
            />
          </div>
        )}
        {openedStakerContract && (
          <div style={{ marginRight: "auto" }}>
            <Button onClick={handleBack} style={{ minWidth: mediumButtonMinWidth }}>
              <LeftOutlined /> Back
            </Button>
          </div>
        )}
      </div>
      {!openedStakerContract && <Divider style={{ margin: "2rem 0" }}>Staker Contracts</Divider>}
      {openedStakerContract && <Divider style={{ margin: "44px 0" }} />}
      {/* CONTENT */}
      {!openedStakerContract && stakerContracts && stakerContracts.length > 0 && (
        <div style={{ alignSelf: "stretch" }}>
          <AllStakers contracts={stakerContracts} openContract={handleOpenContract} />
        </div>
      )}
      {openedStakerContract && injectableAbis && (
        <div style={{ alignSelf: "stretch" }}>
          <Staker
            contract={openedStakerContract}
            injectableAbis={injectableAbis}
            localProvider={localProvider}
            mainnetProvider={mainnetProvider}
            userSigner={userSigner}
            address={factoryAddress}
            DEBUG={DEBUG}
            localChainId={localChainId}
            gasPrice={gasPrice}
            price={price}
          />
        </div>
      )}
    </div>
  );
};

export default StakersUI;
