import { RollbackOutlined, SendOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, Card, List, Spin } from "antd";
import { useBalance, useContractLoader, useContractReader } from "eth-hooks";
import { useEventListener } from "eth-hooks/events/useEventListener";
import React, { useEffect, useState } from "react";
import { Address, AddressInput } from "..";
import AddStake from "./AddStake";
import CustomAddress from "../CustomKit/CustomAddress";
import CustomBalance from "../CustomKit/CustomBalance";
import TotalStaker from "./TotalStaker";
import externalContracts from "../../contracts/external_contracts";
import deployedContracts from "../../contracts/hardhat_contracts.json";
import { injectContract } from "../../helpers/injectContractConfig";
import { cardGradient, mainColWidth, primaryColor, softTextColor } from "../../styles";
import { Transactor } from "../../helpers";
import StakerBanner from "./StakerBanner";
import StakerTimer from "./StakerTimer";
import { getContractConfigWithInjected } from "../../helpers/getContractConfigWithInjected";
const { ethers } = require("ethers");

const Staker = ({
  contract,
  injectableAbis,
  localProvider,
  mainnetProvider,
  userSigner,
  address,
  DEBUG,
  localChainId,
  gasPrice,
  price,
}) => {
  const contractName = contract.name;

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  /**
   * contractConfig not from props,
   * we create a copy in which we inject this particular contract
   **/
  const contractConfig = getContractConfigWithInjected([
    { contractName: "Staker", abi: injectableAbis.Staker, contractAddress: contract.address, localChainId },
    {
      contractName: "ExampleExternalContract",
      abi: injectableAbis.ExampleExternalContract,
      contractAddress: contract.destinationContractAddress,
      localChainId,
    },
  ]);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  //keep track of contract balance to know how much has been staked total:
  const stakerContractBalance = useBalance(
    localProvider,
    readContracts && readContracts.Staker ? readContracts.Staker.address : null,
  );
  if (DEBUG) console.log("💵 stakerContractBalance", stakerContractBalance);

  // ** keep track of total 'threshold' needed of ETH
  const threshold = useContractReader(readContracts, "Staker", "threshold");
  console.log("💵 threshold:", threshold);

  // ** keep track of a variable from the contract in the local React state:
  const balanceStaked = useContractReader(readContracts, "Staker", "balances", [address]);
  console.log("💸 balanceStaked:", balanceStaked);

  // ** 📟 Listen for broadcast events
  const stakeEvents = useEventListener(readContracts, "Staker", "Stake", localProvider, 1);
  console.log("📟 stake events:", stakeEvents);

  // ** Listen for when the contract has been 'completed'
  const complete = useContractReader(readContracts, "ExampleExternalContract", "completed");
  console.log("✅ complete:", complete);

  // ** Listen for when the contract has been opened for withdraw
  const openForWithdraw = useContractReader(readContracts, "Staker", "openForWithdraw");
  console.log("✅ openForWithdraw:", openForWithdraw);

  // TIME
  const deadLine = useContractReader(readContracts, "Staker", "deadline");
  console.log("⏳ deadLine:", deadLine);
  const timeLeft = useContractReader(readContracts, "Staker", "timeLeft");
  console.log(" timeLeft: ", timeLeft);

  // ==== DERIVED STATE ===

  const stakerContractBalanceZero =
    stakerContractBalance && stakerContractBalance.toNumber && stakerContractBalance.eq("0");
  const userBalanceZero = balanceStaked && balanceStaked.toNumber && balanceStaked.eq("0");
  const isOver = timeLeft && ethers.BigNumber.from(0).eq(timeLeft);
  const belowThreshold =
    stakerContractBalance &&
    threshold &&
    stakerContractBalance.toNumber &&
    threshold.toNumber &&
    stakerContractBalance.lt(threshold);
  const exampleExternalContractBalance = useBalance(
    localProvider,
    readContracts && readContracts.ExampleExternalContract ? readContracts.ExampleExternalContract.address : null,
  );
  if (DEBUG) console.log("💵 exampleExternalContractBalance", exampleExternalContractBalance);

  const totalStakedValue = complete ? exampleExternalContractBalance : stakerContractBalance;
  const totalStakedValueZero = totalStakedValue && totalStakedValue.toNumber && totalStakedValue.eq("0");

  // === setup USER ACTIONS besed on CONTRACT state & UI state ===

  const showWithdrawAction = openForWithdraw && !totalStakedValueZero;
  const showStakeAction = !isOver && !complete;
  const showExecute = !complete && !openForWithdraw && isOver && !stakerContractBalanceZero;
  const executeText = belowThreshold ? "Unlock Funds " : "Execute ";
  const executeIcon = belowThreshold ? <UnlockOutlined /> : <SendOutlined />;

  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [pendingWithdrawal, setPendingWithdrawal] = useState(false);
  const [pendingUnlock, setPendingUnlock] = useState(false);

  useEffect(() => {
    if (!!address) {
      setWithdrawAddress(address);
    }
  }, [address]);

  const particularBalanceTitle = openForWithdraw
    ? withdrawAddress !== address
      ? "Their Balance"
      : "Your Balance"
    : "You staked";
  const particularBalanceColor = openForWithdraw ? "currentColor" : primaryColor;
  const [withdrawableBalance, setWithdrawableBalance] = useState();
  const [withdrawableBalanceError, setWithdrawableBalanceError] = useState(false);
  const withdrawableAmountZero = withdrawableBalance && withdrawableBalance.toNumber && withdrawableBalance.eq("0");
  const particularBalanceAmount = openForWithdraw ? withdrawableBalance : balanceStaked;

  useEffect(() => {
    if (!readContracts || !readContracts.Staker) return;
    const update = async () => {
      let bal;
      try {
        bal = await readContracts.Staker.balances(withdrawAddress);
        setWithdrawableBalanceError(false);
      } catch (e) {
        console.error(e);
        setWithdrawableBalanceError(true);
      }
      setWithdrawableBalance(bal);
    };
    update();
  }, [withdrawAddress, readContracts.Staker, balanceStaked]);

  // DISPLAY ONLY WHEN ALL LOADED for consistency

  const readyAll = [particularBalanceAmount, isOver, belowThreshold]
    .map(el => typeof el !== "undefined")
    .reduce((acc, el) => acc && el);

  // HACKY HACKY
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  return (
    <div>
      {!readyAll && (
        <div
          style={{
            height: "70vh",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </div>
      )}
      {readyAll && (
        <>
          <StakerBanner
            complete={complete}
            failed={isOver && belowThreshold && !complete}
            balance={stakerContractBalance}
            externalContractBalance={exampleExternalContractBalance}
          />

          {
            // CONTRACT
          }
          <Card
            style={{
              width: mainColWidth,
              margin: "0 auto",
              background: cardGradient,
            }}
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                <div style={{ fontSize: "1.25rem" }}>{contractName}</div>

                <CustomAddress
                  noBlockie={true}
                  fontSize={"1.25rem"}
                  value={readContracts && readContracts.Staker && readContracts.Staker.address}
                />
              </div>
            }
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "stretch", justifyContent: "space-between", gap: "1rem" }}>
                <div
                  style={{
                    flex: "1 1 auto",
                    alignSelf: "stretch",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {timeLeft && deadLine && <StakerTimer timeLeft={timeLeft}></StakerTimer>}
                </div>
                <TotalStaker
                  complete={complete}
                  totalStakedValue={totalStakedValue}
                  price={price}
                  isOver={isOver}
                  threshold={threshold}
                  belowThreshold={belowThreshold}
                  openForWithdraw={openForWithdraw}
                />
              </div>
            </div>
          </Card>

          {showExecute && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ margin: "2rem" }}>
                <Button
                  size="large"
                  loading={pendingUnlock}
                  style={{ width: 180 }}
                  type="primary"
                  onClick={() => {
                    setPendingUnlock(true);
                    tx(writeContracts.Staker.execute(), update => {
                      if (update && (update.error || update.reason)) {
                        setPendingUnlock(false);
                      }
                      if (update && (update.status === "confirmed" || update.status === 1)) {
                        setPendingUnlock(false);
                        forceUpdate();
                      }
                      if (update && update.code) {
                        // metamask error etc.
                        setPendingUnlock(false);
                      }
                    });
                  }}
                >
                  {executeText} {executeIcon}
                </Button>
              </div>
            </div>
          )}
          {!showExecute && <div style={{ margin: "2rem" }}></div>}

          {
            // USER
          }
          <Card
            style={{
              width: mainColWidth,
              margin: "0 auto",
              background: cardGradient,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: showWithdrawAction || showStakeAction ? "space-between" : "center",
                alignItems: "center",
              }}
            >
              {(showWithdrawAction || showStakeAction) && (
                <div
                  style={{
                    minWidth: "10rem",
                    flex: "1 1 auto",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    gap: "1rem",
                  }}
                >
                  {showWithdrawAction && (
                    <>
                      <AddressInput
                        ensProvider={mainnetProvider}
                        placeholder="Enter address"
                        value={withdrawAddress}
                        onChange={setWithdrawAddress}
                      />
                      <Button
                        size="large"
                        style={{ minWidth: "10rem" }}
                        loading={pendingWithdrawal}
                        disabled={withdrawableAmountZero || withdrawableBalanceError}
                        type={"default"}
                        onClick={() => {
                          setPendingWithdrawal(true);
                          tx(writeContracts.Staker.withdraw(withdrawAddress), update => {
                            if (update && (update.error || update.reason)) {
                              setPendingWithdrawal(false);
                            }
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              setPendingWithdrawal(false);
                              forceUpdate();
                            }
                            if (update && update.code) {
                              // metamask error etc.
                              setPendingWithdrawal(false);
                            }
                          });
                        }}
                      >
                        Withdraw <RollbackOutlined />
                      </Button>
                    </>
                  )}
                  {showStakeAction && (
                    <AddStake
                      tx={tx}
                      writeContracts={writeContracts}
                      price={price}
                      forceUpdate={forceUpdate}
                      userBalanceZero={userBalanceZero}
                    />
                  )}
                </div>
              )}

              <Card size="small" style={{ padding: 8, width: "15rem", color: primaryColor, flexShrink: 0 }}>
                <div style={{ fontSize: "1.25rem", color: particularBalanceColor }}>{particularBalanceTitle}</div>
                {withdrawableBalanceError && <span style={{ fontSize: "1.5rem" }}>...</span>}
                {!withdrawableBalanceError && (
                  <CustomBalance etherMode balance={particularBalanceAmount} fontSize={64} price={price} />
                )}
              </Card>
            </div>
          </Card>

          <div style={{ width: 500, margin: "auto", marginTop: 64 }}>
            <div style={{ color: softTextColor, fontSize: "1rem" }}>Stake Events</div>
            <List
              dataSource={stakeEvents}
              renderItem={item => {
                return (
                  <List.Item key={item.blockNumber}>
                    <Address value={item.args[0]} ensProvider={mainnetProvider} fontSize={16} /> {"=>"}
                    <CustomBalance etherMode balance={item.args[1]} />
                  </List.Item>
                );
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Staker;
