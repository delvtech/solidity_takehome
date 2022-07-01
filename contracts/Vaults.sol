// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "./ERC20.sol";

contract Vaults {
    address owner;

    event CreateVault(
        uint256 indexed _id,
        address _token,
        uint256 _amount,
        address recipient,
        uint256 _unlockTimestamp
    );
    event CloseVault(uint256 indexed _id);
    event ClaimVault(
        uint256 indexed _id,
        uint256 _claimTimestamp,
        address _claimer
    );

    struct Vault {
        address token;
        uint256 amount;
        uint256 unlockTimestamp;
        address recipient;
        bool closed;
    }

    mapping(uint256 => Vault) public vaults;
    uint256 public numVaults = 0;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function createGrant(
        address token,
        uint256 amount,
        address recipient,
        uint256 unlockTimestamp
    ) public onlyOwner returns (uint256) {
        ERC20(token).transferFrom(msg.sender, address(this), amount);

        uint256 vaultId = numVaults++;
        Vault storage vault = vaults[vaultId];
        vault.token = token;
        vault.amount = amount;
        vault.recipient = recipient;
        vault.unlockTimestamp = unlockTimestamp;
        vault.closed = false;

        emit CreateVault(vaultId, token, amount, recipient, unlockTimestamp);

        return vaultId;
    }

    function closeVault(uint256 vaultId) public onlyOwner returns (bool) {
        require(vaultId < numVaults, "vault not found");
        Vault storage vault = vaults[vaultId];
        vault.closed = true;

        emit CloseVault(vaultId);

        return true;
    }

    function claimVault(uint256 vaultId) public returns (bool) {
        require(vaultId < numVaults, "grant not found");

        Vault storage vault = vaults[vaultId];
        require(!vault.closed, "closed");
        require(vault.recipient == msg.sender, "not recipient");
        require(vault.unlockTimestamp <= block.timestamp, "not unlocked");
        vault.closed = true;

        ERC20(vault.token).transferFrom(
            address(this),
            msg.sender,
            vault.amount
        );

        emit ClaimVault(vaultId, block.timestamp, msg.sender);

        return true;
    }
}
