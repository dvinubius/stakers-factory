import React, { useState } from "react";
import { useBalance } from "eth-hooks";

const { utils } = require("ethers");

/*
  Based on Balance component from scaffold-eth buidl kit
  Changed so that 
  - it can be initialized in etherMode via props.
  - padding is customizable
  - in etherMode it also displays the eth symbol
*/

export default function CustomBalance(props) {
  const [dollarMode, setDollarMode] = useState(!props.etherMode);

  const balance = useBalance(props.provider, props.address);
  let floatBalance = parseFloat("0.00");
  let usingBalance = balance;

  if (typeof props.balance !== "undefined") usingBalance = props.balance;
  if (typeof props.value !== "undefined") usingBalance = props.value;

  if (usingBalance) {
    const etherBalance = utils.formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  const price = props.price || props.dollarMultiplier || 1;

  if (dollarMode) {
    displayBalance = "$" + (floatBalance * price).toFixed(2);
  } else {
    displayBalance = "Ξ" + displayBalance;
  }

  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: props.size ? props.size : 24,
        padding: props.padding ?? 8,
        cursor: "pointer",
      }}
      onClick={() => {
        setDollarMode(!dollarMode);
      }}
    >
      {displayBalance}
    </span>
  );
}
