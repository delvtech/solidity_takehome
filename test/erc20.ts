import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { ERC20__factory } from "../typechain/factories/ERC20__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { provider } = waffle;

describe("erc20", function () {
  let token: ERC20;
  const [wallet] = provider.getWallets();
  let signers: SignerWithAddress[];

  before(async function () {
    signers = await ethers.getSigners();
    const deployer = new ERC20__factory(signers[0]);
    token = await deployer.deploy("token", "TKN");
    await token.mint(signers[0].address, ethers.utils.parseEther("100"));
  });
  

  describe("transfer functionality", async () => {

    it("transfers successfully", async () => {
      await token.transfer(signers[1].address, ethers.utils.parseEther("5"));
      expect(await token.balanceOf(signers[0].address)).to.be.eq(
        ethers.utils.parseEther("95")
      );
      expect(await token.balanceOf(signers[1].address)).to.be.eq(
        ethers.utils.parseEther("5")
      );
    });

    it("does not transfer more than balance", async () => {
      const tx = token.transfer(
        signers[1].address,
        ethers.utils.parseEther("500")
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient-balance");
    });
  });

  describe("transferFrom functionality", async () => {
    // TransferFrom
    it("transfersFrom successfully", async () => {
      // Transfer back from signer[0] to signer[1]
      await token.transferFrom(signers[0].address, signers[1].address, ethers.utils.parseEther("5"));
      expect(await token.balanceOf(signers[0].address)).to.be.eq(
        ethers.utils.parseEther("90")
      );
      expect(await token.balanceOf(signers[1].address)).to.be.eq(
        ethers.utils.parseEther("10")
      );
    });

    it("fails on ammount > balance transfer", async () => {
      const tx = token.transferFrom(
        signers[1].address,
        signers[0].address,
        ethers.utils.parseEther("500")
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient-balance");
    });

    it("fails on ammount > balance transfer", async () => {
      const tx = token.transferFrom(
        signers[1].address,
        signers[0].address,
        ethers.utils.parseEther("500")
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient-balance");
    });
  });

  describe("Approval functionality", async () => {
    it("fails on not allowed spender (signers[2])", async () => {
      const tx = token.connect(signers[2]).transferFrom(
        signers[1].address,
        signers[0].address,
        ethers.utils.parseEther("10")
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient-allowance");
    });

    it("Allows for setting an approval", async () => {
      const tx = await token.connect(signers[0]).approve(
        signers[1].address,
        ethers.utils.parseEther("10")
      );
      expect(await token.allowance(signers[0].address, signers[1].address)).to.be.eq(
        ethers.utils.parseEther("10")
      );
    });

    it("Doesnt allow for transfering more than approved", async () => {
      const tx = token.connect(signers[1]).transferFrom(
        signers[0].address,
        signers[2].address,
        ethers.utils.parseEther("20")
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient-allowance");
    });

    it("Allows for transfering from an approval", async () => {
      await token.connect(signers[1]).transferFrom(
        signers[0].address,
        signers[2].address,
        ethers.utils.parseEther("10")
      );
      expect(await token.balanceOf(signers[0].address)).to.be.eq(
        ethers.utils.parseEther("80")
      );
      expect(await token.balanceOf(signers[2].address)).to.be.eq(
        ethers.utils.parseEther("10")
      );
    });

  });

});
