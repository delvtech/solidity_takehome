// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.14;

import "./ERC20.sol";

// 2) Please create a grant funding contract which allows the account which deployed it to:
//     1) Create new grants which transfer a variable amount of ERC20 tokens into the contract and store the amount and recipient with an unlock timestamp.
//     2) Allows the funder to remove a grant before it unlocks for collection by the recipient. 
//     3) Allows the recipient to claim a grant after the unlock timestamp and transfer the funds out of the contract.

contract Grant {

    struct GrantStruct {
        address token;
        uint256 unlockTime;
        bool claimedOrRevoked;
        uint256 amount;
    }

    error ERC20TransferFailed();
    error NoGrant(address recipient);
    error RecipientHasOpenGrant(GrantStruct grant);
    error GrantRevokedOrClaimed(GrantStruct grant);
    error GrantRevokeWindowMissed(uint256 unlockTime);

    event GrantDeposited(
        address token,
        address recipient,
        uint256 amount,
        uint256 unlockTime
    );
    event GrantRevoked(GrantStruct grant);
    event GrantClaimed(GrantStruct grant);

    address private owner;

    mapping(address => GrantStruct) public grants;

    modifier isUnlocked(uint256 time){
        require(time <= block.timestamp, "Shops closed, come back soon ...");
        _;
    }

    // Quick fix instead of using openzeppelin Ownable
    modifier onlyOwner() {
        require(msg.sender == owner, "You dont own me.");
        _;
    }


    constructor() {
        owner = msg.sender;
    }

    function deposit(address token, uint256 unlockTime, address recipient, uint256 amount) onlyOwner() public {
        // Dont need to check unlock time, it is checked on claim
        if(grants[recipient].token != address(0)){
            revert RecipientHasOpenGrant(grants[recipient]);
        }

        bool success = ERC20(token).transferFrom(
            owner,
            address(this),
            amount
        );

        if(!success){
            revert ERC20TransferFailed();
        }

        grants[recipient] = GrantStruct(
            token,
            unlockTime,
            false,
            amount
        );
        emit GrantDeposited(token, recipient, amount, unlockTime);
    }

    function revoke(address recipient) onlyOwner() external {
        // require locked grant
        if(grants[recipient].unlockTime <= block.timestamp){
            revert GrantRevokeWindowMissed(grants[recipient].unlockTime);
        }


        bool success = ERC20(grants[recipient].token).transferFrom(
            address(this),
            msg.sender,
            grants[recipient].amount
        );

        if(!success){
            revert ERC20TransferFailed();
        }
        delete grants[recipient];
        emit GrantRevoked(grants[recipient]);
    }

    function claim() external isUnlocked(grants[msg.sender].unlockTime) {
        if(grants[msg.sender].token == address(0)){
            revert NoGrant(msg.sender);
        }

        if(grants[msg.sender].claimedOrRevoked == true){
            revert GrantRevokedOrClaimed(grants[msg.sender]);
        }
        
        grants[msg.sender].claimedOrRevoked = true;
        bool success = ERC20(grants[msg.sender].token).transferFrom(
            address(this),
             msg.sender,
            grants[msg.sender].amount
        );
        if(!success){
            revert ERC20TransferFailed();
        }
        emit GrantClaimed(grants[msg.sender]);
    }

    function checkGrantAmount() external view returns(uint256) {
        return grants[msg.sender].amount;
    }

    function checkGrantUnlockTime() external view returns(uint256) {
        return grants[msg.sender].unlockTime;
    }

    function checkGrantClaimedOrRevoked() external view returns(bool) {
        return grants[msg.sender].claimedOrRevoked;
    }

}
