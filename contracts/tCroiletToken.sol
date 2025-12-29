// SPDX-License-Identifier: MIT
pragma solidity 0.8.31;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title tCroiletToken
 * @dev ERC20 token contract with minting and burning capabilities.
 * @author Jared Kamp <jahkamp@gmail.com>
 */
contract tCroiletToken is ERC20, Ownable {
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);

    /**
     * @dev Initializes the contract with an initial supply minted to the owner.
     * @param initialOwner The address to set as the initial owner and recipient of initial tokens.
     */
     constructor(address initialOwner)
    ERC20("tCroilet", "tTP")
    Ownable(initialOwner)  // <-- Correct initialization
{   
    require(initialOwner != address(0), "Zero address not allowed");
    _mint(initialOwner, 330000 * 10 ** decimals());
}

    /**
     * @dev Mints new tokens to a specified address. Only callable by the owner.
     * @param to The recipient address.
     * @param amount The amount to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Zero address not allowed");
        require(amount > 0, "Cannot mint zero");
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /**
     * @dev Burns tokens from the sender's balance.
     * @param amount The amount to burn.
     */
    function burn(uint256 amount) public {
        require(amount > 0, "Cannot burn zero");
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from a specific account (with allowance).
     * @param account The account to burn from.
     * @param amount The amount to burn.
     */
    function burnFrom(address account, uint256 amount) public {
        require(account != address(0), "Zero address not allowed");
        require(amount > 0, "Cannot burn zero");
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);
        emit Burn(account, amount);
    }
}