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

    it("approve the token to be transfered", async () => {
      const amountToApprove = ethers.utils.parseEther("5.0");
      const spender = signers[1];
      await token.connect(signers[0]).approve(spender.address, amountToApprove);
      //check the value of the allowance of the receiver to spend the token
      const allowance = await token.allowance(signers[0].address, spender.address);
      expect(allowance.toString()).to.be.eq(amountToApprove.toString());
    });

    it("allows the spender to transfer the token", async () => {
      const amountToTransfer = ethers.utils.parseEther("5.0");
      const receiver = signers[2];
      //check the token balance before
      const tokenBalBefore = await token.balanceOf(receiver.address);
      expect(tokenBalBefore.toString()).to.be.eq("0");
      //transfer the token
      await token.connect(signers[1]).transferFrom(signers[0].address, receiver.address, amountToTransfer);
      //check the token balanceAfter
      const tokenBalAfter = await token.balanceOf(receiver.address);
     
      expect(tokenBalAfter.toString()).to.be.eq(amountToTransfer.toString())
    })

    it("it should revert with", async () => {
      const amountToTransfer = ethers.utils.parseEther("5.0");
      const receiver = signers[2];
      const tx = token.connect(signers[1]).transferFrom(signers[0].address, receiver.address, amountToTransfer);
      await expect(tx).to.be.revertedWith("ERC20: insufficient-allowance");
    })
    
  });

});
