// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "./ERC20.sol";

contract GrantFunding {
    //The contract assumes that a receipent can only get one grants. Subsequent grants overides the value of the previous grant
    
    //copied from OpenZeppelin Reentrance guide
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    address owner;
    ERC20 token;
    mapping(address => Grant) grants;

    event GrantFunded(
        uint256 amount,
        address indexed receipent,
        uint256 timeLock
    );
    event GrantRemoved(address indexed receipent, uint256 amount);
    event GrantClaimed(
        address indexed receipent,
        uint256 amount,
        uint256 timeClaimed
    );

    struct Grant {
        uint256 amount;
        uint256 unlockTime;
        bool fundWithdrawn;
    }

    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = ERC20(_tokenAddress);
         _status = _NOT_ENTERED;
    }

    modifier onlyOwner() {
        require(msg.sender == owner );
        _;
    }

    //copied from OpenZeppellin
     modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
    /// @notice Creates a new grant
    /// @param _tokenAmount the value of the grant
    /// @param _unlockTime the time set before the grant can be claimed
    /// @param _receipent the address that can claim the grant
    /// @dev emits an event that the grant was created successfuly. Only the owner can call this function
    function createNewGrant(
        uint256 _tokenAmount,
        uint256 _unlockTime,
        address _receipent
    ) external onlyOwner {
        //transfer the token to the contract
        bool success = token.transferFrom(
            msg.sender,
            address(this),
            _tokenAmount
        );
        require(success, "transfer failed");
        grants[_receipent] = Grant({
            amount: _tokenAmount,
            unlockTime: _unlockTime + block.timestamp,
            fundWithdrawn: false
        });
        emit GrantFunded(_tokenAmount, _receipent, _unlockTime);
    }

     /// @notice Deletes a grant before expirying
    /// @param _receipient the grant to delete. Address of the receipent
    /// @dev Fuction checks if the lock has not expired and the receipent has not withdrawn the token before removing the grant.Only the owner can call this function. 
    function removeGrant(address _receipient) external onlyOwner {
        //check if the grant is still active
        Grant storage userGrant = grants[_receipient];
        if (
            userGrant.unlockTime > block.timestamp &&
            userGrant.fundWithdrawn == false
        ) {
            //grant has not expired here
            delete grants[_receipient];
            emit GrantRemoved(_receipient, userGrant.amount);
        }
    }

    /// @notice Creates a function that allows the grant to be claimed
    /// @dev Function claims a receipient grant if they have one. It performs some checks before allowing the claim
    function claimGrant() external nonReentrant {
        Grant memory userGrant = grants[msg.sender];
         require(
            userGrant.amount > 0,
            "You have no grant to claim"
        );
        //check if grant is due;
        require(
            block.timestamp > userGrant.unlockTime,
            "Time lock not expired"
        );
        require(!userGrant.fundWithdrawn, "Grant has already be claimed");

        //we have not withdrawn yet and fund is opened for retreival
        //this line prevents reentry attack by setting the state of token withdrawal to true before transferring token
        grants[msg.sender].fundWithdrawn = true;
        //transfet the amount from the contract to the receipient
       bool success = token.transfer(msg.sender, userGrant.amount);
       require(success, "transfer failed");
        emit GrantClaimed(msg.sender, userGrant.amount, block.timestamp);
    }

    function showGrant(address receiver) external view returns (Grant memory) {
        return grants[receiver];
    }
}
