import React, { useState } from "react";
import { Button } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import CustomEtherInput from "../CustomKit/CustomEtherInput";
const { ethers } = require("ethers");

const AddStake = ({ tx, price, writeContracts, forceUpdate, userBalanceZero }) => {
  const [addStakeAmount, setAddStakeAmount] = useState("");
  const [pendingAddStake, setPendingAddStake] = useState(false);

  return (
    <>
      <CustomEtherInput
        autofocus
        etherMode
        price={price}
        value={addStakeAmount}
        placeholder="Enter amount"
        onChange={value => setAddStakeAmount(value)}
      />

      <Button
        size="large"
        style={{ minWidth: "10rem" }}
        loading={pendingAddStake}
        disabled={["0", ""].includes(addStakeAmount)}
        type={userBalanceZero ? "primary" : "success"}
        onClick={() => {
          setPendingAddStake(true);
          const transaction = writeContracts.Staker.stake({
            value: ethers.utils.parseEther(addStakeAmount.toString()),
          });

          tx(transaction, update => {
            if (update && update.error) {
              setPendingAddStake(false);
            }
            if (update && (update.status === "confirmed" || update.status === 1)) {
              setPendingAddStake(false);
              forceUpdate();
            }
          });

          setAddStakeAmount(0);
        }}
      >
        {userBalanceZero ? "Stake" : "Add Stake"} <PieChartOutlined />
      </Button>
    </>
  );
};

export default AddStake;
