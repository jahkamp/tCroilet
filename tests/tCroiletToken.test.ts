import { expect } from "chai";
import { ethers } from "hardhat";
import { tCroiletToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("tCroiletToken", function () {
  let token: tCroiletToken;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TokenFactory = await ethers.getContractFactory("tCroiletToken");
    token = await TokenFactory.deploy(owner.address) as unknown as tCroiletToken;
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await token.name()).to.equal("tCroilet");
      expect(await token.symbol()).to.equal("tTP");
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const totalSupply = await token.totalSupply();
      expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
      expect(totalSupply).to.equal(330000n * 10n ** 18n);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);

      await token.connect(addr1).transfer(addr2.address, 25);
      expect(await token.balanceOf(addr1.address)).to.equal(25);
      expect(await token.balanceOf(addr2.address)).to.equal(25);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");

      expect(await token.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const initialSupply = await token.totalSupply();
      await token.mint(addr1.address, 1000);
      expect(await token.balanceOf(addr1.address)).to.equal(1000);
      expect(await token.totalSupply()).to.equal(initialSupply + 1000n);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      await expect(
        token.connect(addr1).mint(addr1.address, 1000)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      await token.transfer(addr1.address, 1000);
      const initialSupply = await token.totalSupply();
      await token.connect(addr1).burn(500);
      expect(await token.balanceOf(addr1.address)).to.equal(500);
      expect(await token.totalSupply()).to.equal(initialSupply - 500n);
    });

    it("Should allow approved users to burn tokens from other accounts", async function () {
      await token.transfer(addr1.address, 1000);
      await token.connect(addr1).approve(addr2.address, 500);
      const initialSupply = await token.totalSupply();
      
      await token.connect(addr2).burnFrom(addr1.address, 500);
      
      expect(await token.balanceOf(addr1.address)).to.equal(500);
      expect(await token.totalSupply()).to.equal(initialSupply - 500n);
    });
  });
});