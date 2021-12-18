// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ExampleExternalContract is Ownable {
    bool public completed;
    address finalOwner;

    constructor(address _finalOwner) {
        finalOwner = _finalOwner;
    }

    function complete() public payable onlyOwner {
        completed = true;
        transferOwnership(finalOwner);
    }
}
