// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol"; // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
import "./Staker.sol";

contract StakerFactory {
    address[] stakerContracts;
    event CreateStaker(
        uint256 indexed stakerId,
        address indexed stakerAddress,
        address indexed destinationAddress,
        address creator,
        string name,
        uint256 timestamp
    );

    constructor() {}

    /**
        @param name for better UX on the frontend
        @param duration in seconds
        @param threshold how much this Staker needs to collect
     */
    function createStakerContract(
        string memory name,
        uint256 duration,
        uint256 threshold
    ) public {
        // While collecting funds, a Staker owns its externalContract,
        // but when it calls complete() on it, ownership of the externalContract
        // is transferred to msg.sender. This is just one example of how to keep
        // access to / control over the funds after the Staker completes.
        ExampleExternalContract destinationContract = new ExampleExternalContract(
                msg.sender
            );

        uint256 id = stakerContracts.length;
        Staker stakerContract = new Staker(
            address(destinationContract),
            duration,
            threshold,
            name
        );
        destinationContract.transferOwnership(address(stakerContract));
        stakerContracts.push(address(stakerContract));
        emit CreateStaker(
            id,
            address(stakerContract),
            address(destinationContract),
            msg.sender,
            name,
            block.timestamp
        );
    }

    function numberOfCreated() public view returns (uint256) {
        return stakerContracts.length;
    }

    function stakerById(uint256 id) public view returns (address) {
        return stakerContracts[id];
    }
}
