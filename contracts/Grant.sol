// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.14;

import "./ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/**
 * @title Grant
 * @author eucliss
 * @notice Grant is an ownable contract that allows the deployer to grant ERC20
 *         tokens to a reciever. The deployer can deposit a grant to any address as
 *         long as they have that many tokens available. The deployer can also revoke
 *         a grant as long as the grant has not been claimed or is past the date of 
 *         unlock. A reciever can claim their grany only after the time set as unlock
 *         by the deployer.
 *         A user who has an available grant can add their grant to the lucky swap. This
 *         is a blind swap where if another user with a grant calls ImFeelingLucky,
 *         the grants of the two users will be switched (the last user to add to lucky swap
 *         and the caller of ImFeelingLucky).
 */
contract Grant is ReentrancyGuard{

    /**
    * @dev GrantStructure - a Grant includes a token, unlockTime for claim, whether
    *    the grant has been claimed or revoked, an amount of ERC20 tokens, and a boolean
    *    to check whether the grant is in the lucky swap or not
    */
    struct GrantStruct {
        address token;
        uint256 unlockTime;
        bool claimedOrRevoked;
        uint256 amount;
        bool inSwap;
    }

    /**
     * @dev Revert errors for ERC transfer failed, no grant available, 
     *       grant already in lucky swap, the recipient already has an open grant,
     *       grant revoked or claimed, and grant revoke window missed
     */
    error ERC20TransferFailed();
    error NoGrant(address recipient);
    error GrantAlreadyInSwap(address recipient);
    error RecipientHasOpenGrant(GrantStruct grant);
    error GrantRevokedOrClaimed(GrantStruct grant);
    error GrantRevokeWindowMissed(uint256 unlockTime);


     /**
     * @dev Events that are emitted after executing functions.
     */
    event GrantDeposited(
        address token,
        address recipient,
        uint256 amount,
        uint256 unlockTime
    );
    event GrantRevoked(GrantStruct grant);
    event GrantClaimed(GrantStruct grant);
    event GrantAddedToSwap(address recipient);
    event SwapOccured(GrantStruct swapper, GrantStruct reciever);

    // Owner of the grants contract
    address private owner;

    // Mapping of recipient to Grants
    mapping(address => GrantStruct) public grants;

    // Private swaps array for which grants are open for swap
    address[] private swaps;

    // Swap length to track last item in swap
    uint256 public swapsLen;

    // Check if the grant is unlocked yet or not.
    modifier isUnlocked(uint256 time){
        require(time <= block.timestamp, "Shops closed, come back soon ...");
        _;
    }

    // Quick fix instead of using openzeppelin Ownable.
    // Make sure the caller is the owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "You dont own me.");
        _;
    }

    // Constructor, set owner of contract
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Public function only callable by the owner. Creates a grant for 
     *      the recipient to claim after a certain unlock time. The grant 
     *      consists of an ERC20 token and a number of tokens to grant.
     *      Note: A recipient can only have 1 available grant open at a
     *      time. Revoked grants will delete the grant for the recipient
     *      and allow for rebuilding.
     *
     * @param token         ERC20 token address to grant.
     * @param unlockTime    Unlock time of the grant, when it is accessible.
     * @param recipient     Recipient of the grant, who can claim.
     * @param amount        Amount of ERC20 tokens to grant.
     *
     */
    function deposit(
        address token, 
        uint256 unlockTime, 
        address recipient, 
        uint256 amount
    ) 
        onlyOwner() 
        public 
    {
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
            amount,
            false
        );
        emit GrantDeposited(token, recipient, amount, unlockTime);
    }

    /**
     * @dev External function only callable by the owner. Revokes a recipients
     *      grant. this will transfer the ERC20 tokens back to the owner and 
     *      delete the grant from the grants mapping. Owner can re-deposit for
     *      a new grant if needed.
     *
     * @param recipient     Recipient of the grant to revoke.
     *
     */
    function revoke(
        address recipient
    ) 
        onlyOwner() 
        external 
    {
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

    /**
     * @dev External function to claim the grant for the msg.sender. Uses the
     *      isUnlocked modifier to determine if the grant is available for 
     *      claiming or not. Will revert if the grant has already been claimed
     *      or if the ERC20 transfer hasnt gone through.
     *
     */
    function claim(
    ) 
        external
        nonReentrant()
        isUnlocked(grants[msg.sender].unlockTime) 
    {
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

    /**
     * @dev Check the amount of ERC20 your grant containts.
     */
    function checkGrantAmount() external view returns(uint256) {
        return grants[msg.sender].amount;
    }

    /**
     * @dev Check the unlock Time of your grant.
     */
    function checkGrantUnlockTime() external view returns(uint256) {
        return grants[msg.sender].unlockTime;
    }

    /**
     * @dev Check if your grant was claimed or revoked.
     */
    function checkGrantClaimedOrRevoked() external view returns(bool) {
        return grants[msg.sender].claimedOrRevoked;
    }

    /**
     * @dev Public function to add your grant to the Lucky swap. Adding
     *      to the swap means that if anyone who has a grant calls 
     *      ImFeelingLucky, your grant and their grant will be swapped - if
     *      you were the last one to call addToLuckySwap that is. If you
     *      have already claimed your grant or it already in the swap, you
     *      cannot call this function.
     *
     */
    function addToLuckySwap() public {
        if (grants[msg.sender].claimedOrRevoked){
            revert GrantRevokedOrClaimed(grants[msg.sender]);
        }
        if(grants[msg.sender].inSwap){
            revert GrantAlreadyInSwap(msg.sender);
        }
        grants[msg.sender].inSwap = true;
        swaps.push(msg.sender);
        swapsLen = swaps.length;
        emit GrantAddedToSwap(msg.sender);
    }

    /**
     * @dev Public function to swap your grant with the last person to add 
     *      their grant to the LuckySwap. If there are no grants in the lucky
     *      swap this will fail. There is no going back from the lucky swap ...
     *
     */
    function ImFeelingLucky() public {
        uint256 swapIndex = swapsLen - 1;
        require(grants[msg.sender].token != address(0), "No swap for no grant");
        require(swapsLen > 0, "No swaps, not your lucky day..");
        require(swaps[swapIndex] != msg.sender, "Try again another time, you're next to swap");

        GrantStruct memory temp = grants[swaps[swapIndex]];

        grants[swaps[swapIndex]] = grants[msg.sender];
        grants[msg.sender] = temp;

        emit SwapOccured(grants[swaps[swapIndex]], temp);
        swapsLen--;
        delete temp;
        delete swaps[swapIndex];
    }

}
