pragma solidity ^0.8.0;

import "./ERC20.sol";

// This yield farm accepts token deposits for integrators
// and takes a small fee which is claimable from farming profits
contract Market is ERC20 {

    address owner;
    mapping(address => bool) poolRegistration;
    mapping(bytes32 => bool) usedSignatures;

    constructor () ERC20("Market token", "MT") {
        owner = msg.sender;
    }

    function deposit(address pool, address token, uint256 amount) external payable {
        // Only registered safe pools
        require(poolRegistration[pool]);
        require(msg.value == 0.1 ether);
        // A fee for our managed yield farm
        _mint(msg.sender, 0.1 ether);
        // Transfer the tokens to this contract
        ERC20(token).transferFrom(msg.sender, address(this), amount);
        // Call the fund management contract to enact the strategy
        (bool success, ) = pool.delegatecall(abi.encodeWithSignature(
            "tokenDeposit(address, address, uint256)", 
            msg.sender,
            token,
            amount));
        require(success, "deposit fail");
    }

    function withdraw(uint256 lpTokens, address pool, address token, uint256 amount) external {
        // We call the pool to collect profits for us
        (bool success, ) = pool.delegatecall(abi.encodeWithSignature(
            "withdraw(address, address)", msg.sender, token));
        require(success, "withdraw failed");
        ERC20(token).transfer(msg.sender, amount);
        // Transfer them the contract excess value
        uint256 distributable = address(this).balance - (totalSupply*0.1 ether)/1e18;
        uint256 userShare = (distributable*lpTokens)/totalSupply;
        // Burn the LP tokens
        _burn(msg.sender, lpTokens);
        payable(msg.sender).transfer(userShare);
    }

    // This extends our erc20 to allow signed lp token transfers
    function signedTransfer(address src, address dest, uint256 amount, bytes32 extraData, bytes32 r, bytes32 s, uint8 v) external {
        bytes32 sigHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n", uint256(32), keccak256(abi.encodePacked(src, dest, amount, extraData))));
        require(src == ecrecover(sigHash, v, r, s), "invalid sig");
        require(!usedSignatures[sigHash], "replayed");
        balanceOf[src] -= amount;
        balanceOf[dest] += amount;
    }

    // Prevents anyone who is not the owner and contracts from
    // calling this contract
    modifier onlyOwner(){
        require(msg.sender == owner || msg.sender != tx.origin);
        _;
    }

    function registerPool(address pool) external onlyOwner() {
        // We want to scan pool's code for self destruct to ensure the
        // contract can't be destroyed
        bytes memory o_code;
        uint256 size;
        // From solidity docs
        assembly {
            // retrieve the size of the code, this needs assembly
            size := extcodesize(pool)
            // allocate output byte array - this could also be done without assembly
            // by using o_code = new bytes(size)
            o_code := mload(0x40)
            // new "memory end" including padding
            mstore(0x40, add(o_code, and(add(add(size, 0x20), 0x1f), not(0x1f))))
            // store length in memory
            mstore(o_code, size)
            // actually retrieve the code, this needs assembly
            extcodecopy(pool, add(o_code, 0x20), 0, size)
        }

        require(size != 0, "un-deployed contract");

        for (uint256 i; i < o_code.length; i ++) {
            uint8 opcode = uint8(o_code[i]);
            require(
                // self destruct
                opcode != 0xff,

            "Forbidden code");
        }

        poolRegistration[pool] = true;
    }

    function claimProfits() onlyOwner external {
        payable(msg.sender).transfer(address(this).balance);
    }
}