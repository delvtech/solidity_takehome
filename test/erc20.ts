import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { ERC20__factory } from "../typechain/factories/ERC20__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { provider } = waffle;
const parseEther = ethers.utils.parseEther;

describe("erc20", function () {
  let token: ERC20;
  const [wallet] = provider.getWallets();
  let signers: SignerWithAddress[];

  before(async function () {
    signers = await ethers.getSigners();
    const deployer = new ERC20__factory(signers[0]);
    token = await deployer.deploy("token", "TKN");
    await token.mint(signers[0].address, parseEther("100"));
  });

  describe("transfer functionality", async () => {
    it("transfers successfully", async () => {
      await token.transfer(signers[1].address, parseEther("5"));
      expect(await token.balanceOf(signers[0].address)).to.be.eq(
        parseEther("95")
      );
      expect(await token.balanceOf(signers[1].address)).to.be.eq(
        parseEther("5")
      );
    });

    it("does not transfer more than balance", async () => {
      const tx = token.transfer(signers[1].address, parseEther("500"));
      await expect(tx).to.be.revertedWith("ERC20: insufficient-balance");
    });
  });

  describe("approve & transferFrom functionality", async () => {
    it("transfers successfully", async () => {
      await token.transferFrom(
        signers[0].address,
        signers[1].address,
        parseEther("5")
      );
      expect(await token.balanceOf(signers[0].address)).to.be.eq(
        parseEther("90")
      );
      expect(await token.balanceOf(signers[1].address)).to.be.eq(
        parseEther("10")
      );
    });

    it("does not transfer funds without allowance", async () => {
      const tx = token.transferFrom(
        signers[1].address,
        signers[2].address,
        parseEther("10")
      );
      await expect(tx).to.be.revertedWith("ERC20: insufficient-allowance");
    });

    it("approves and transfers successfully", async () => {
      await token
        .connect(signers[1])
        .approve(signers[0].address, parseEther("10"));

      await token.transferFrom(
        signers[1].address,
        signers[2].address,
        parseEther("10")
      );
      expect(await token.balanceOf(signers[1].address)).to.be.eq(
        parseEther("0")
      );
      expect(await token.balanceOf(signers[2].address)).to.be.eq(
        parseEther("10")
      );
    });
  });
});
