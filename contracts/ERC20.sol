// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

// This default erc20 library is designed for max efficiency and security
// WARNING - DO NOT USE THIS CODE IN PRODUCTION
contract ERC20 {
    // --- ERC20 Data ---
    // The name of the erc20 token
    string public name;
    // The symbol of the erc20 token
    string public  symbol;
    // The decimals of the erc20 token, should default to 18 for new tokens
    uint8 public  decimals;
    // The total supply of tokens
    uint256 public totalSupply;

    // A mapping which tracks user token balances
    mapping(address => uint256) public  balanceOf;
    // A mapping which tracks which addresses a user allows to move their tokens
    mapping(address => mapping(address => uint256)) public  allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /// @notice Initializes the erc20 contract
    /// @param name_ the value 'name' will be set to
    /// @param symbol_ the value 'symbol' will be set to
    /// @dev decimals default to 18 and must be reset by an inheriting contract for
    ///      non standard decimal values
    constructor(string memory name_, string memory symbol_) {
        // Set the state variables
        name = name_;
        symbol = symbol_;
        decimals = 18;

        // By setting these addresses to 0 attempting to execute a transfer to
        // either of them will revert. This is a gas efficient way to prevent
        // a common user mistake where they transfer to the token address.
        // These values are not considered 'real' tokens and so are not included
        // in 'total supply' which only contains minted tokens.
        balanceOf[address(0)] = type(uint256).max;
        balanceOf[address(this)] = type(uint256).max;
    }

    // --- Token ---
    /// @notice Allows a token owner to send tokens to another address
    /// @param recipient The address which will be credited with the tokens
    /// @param amount The amount user token to send
    /// @return returns true on success, reverts on failure so cannot return false.
    /// @dev transfers to this contract address or 0 will fail
    function transfer(address recipient, uint256 amount)
        public
        
        returns (bool)
    {
        // We forward this call to 'transferFrom'
        return transferFrom(msg.sender, recipient, amount);
    }

    /// @notice Transfers an amount of erc20 from a spender to a receipt
    /// @param spender The source of the ERC20 tokens
    /// @param recipient The destination of the ERC20 tokens
    /// @param amount the number of tokens to send
    /// @return returns true on success and reverts on failure
    /// @dev will fail transfers which send funds to this contract or 0
    function transferFrom(
        address spender,
        address recipient,
        uint256 amount
    ) public  returns (bool) {
        // Load balance and allowance
        uint256 balance = balanceOf[spender];
        require(balance >= amount, "ERC20: insufficient-balance");
        // We potentially have to change allowances
        if (spender != msg.sender) {
            // Loading the allowance in the if block prevents vanilla transfers
            // from paying for the sload.
            uint256 allowed = allowance[spender][msg.sender];
            // If the allowance is max we do not reduce it
            // Note - This means that max allowances will be more gas efficient
            // by not requiring a sstore on 'transferFrom'
            if (allowed != type(uint256).max) {
                require(allowed >= amount, "ERC20: insufficient-allowance");
                allowance[spender][msg.sender] = allowed - amount;
            }
        }
        // Update the balances
        balanceOf[spender] = balance - amount;
        // Note - In the constructor we initialize the 'balanceOf' of address 0 and
        //        the token address to uint256.max and so in 8.0 transfers to those
        //        addresses revert on this step.
        balanceOf[recipient] = balanceOf[recipient] + amount;
        // Emit the needed event
        emit Transfer(spender, recipient, amount);
        // Return that this call succeeded
        return true;
    }

    /// @notice this method is including for convince of testing
    ///         NOTE - Candidates do not need to test this
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    /// @notice This function s the ERC20Permit Library's _mint and causes it
    ///          to track total supply.
    /// @param account the account to addd tokens to
    /// @param amount the amount of tokens to add
    function _mint(address account, uint256 amount) internal  {
        // Increase account balance
        balanceOf[account] = balanceOf[account] + amount;
        // Increase total supply
        totalSupply += amount;
        // Emit a transfer from zero to emulate a mint
        emit Transfer(address(0), account, amount);
    }

    /// @notice This function s the ERC20Permit Library's _burn to decrement total supply
    /// @param account the account to burn from
    /// @param amount the amount of token to burn
    function _burn(address account, uint256 amount) internal  {
        // Decrease user balance
        balanceOf[account] = balanceOf[account] - amount;
        // Decrease total supply
        totalSupply -= amount;
        // Emit an event tracking the burn
        emit Transfer(account, address(0), amount);
    }

    /// @notice This function allows a user to approve an account which can transfer
    ///         tokens on their behalf.
    /// @param account The account which will be approve to transfer tokens
    /// @param amount The approval amount, if set to uint256.max the allowance does not go down on transfers.
    /// @return returns true for compatibility with the ERC20 standard
    function approve(address account, uint256 amount)
        public
        
        returns (bool)
    {
        // NOTE: Doesnt check for how much the msg.sender has, could approve infinite
        //   ultimately will not work, but interesting
        // Set the senders allowance for account to amount
        allowance[msg.sender][account] = amount;
        // Emit an event to track approvals
        emit Approval(msg.sender, account, amount);
        return true;
    }

    /// @notice Internal function which allows inheriting contract to set custom decimals
    /// @param decimals_ the new decimal value
    function _setupDecimals(uint8 decimals_) internal {
        // Set the decimals
        decimals = decimals_;
    }
}
