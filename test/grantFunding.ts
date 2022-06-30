import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { GrantFunding } from "../typechain/GrantFunding";
import { ERC20 } from "../typechain/ERC20";
import { ERC20__factory } from "../typechain/factories/ERC20__factory";
import { GrantFunding__factory } from "../typechain/factories/GrantFunding__factory";
import { MockProvider } from "ethereum-waffle";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { provider } = waffle;

async function increaseBlockTimestamp(provider: MockProvider, time: number) {
  await provider.send("evm_increaseTime", [time]);
  await provider.send("evm_mine", []);
};

describe("Grant Fundding Test", () => {
  let token: ERC20;
  let grantFunding: GrantFunding;
  const [wallet] = provider.getWallets();
  let signers: SignerWithAddress[];


  before(async function () {
    signers = await ethers.getSigners();
    const deployer = new ERC20__factory(signers[0]);
    const grantDeployer = new GrantFunding__factory(signers[0]);
    token = await deployer.deploy("token", "TKN");
    grantFunding = await grantDeployer.deploy(token.address);
    await token.mint(signers[0].address, ethers.utils.parseEther("1000"));
  });

  it("it deploys the contracts", async() => {
    //check for the values of token annd grantFunding
    expect(token).to.not.equal(null);
    expect(grantFunding).to.not.equal(null);
  });

  it("aproves the contract address to spend token", async() => {
    const amountCanSpend = ethers.utils.parseEther("200");
    await token.connect(signers[0]).approve(grantFunding.address, amountCanSpend);
    const allowance = await token.allowance(signers[0].address, grantFunding.address);
    expect(allowance.toString()).to.be.eq(amountCanSpend.toString());
  })

  it("creates a new funding and deposit the funds", async() => {
    const receiver = signers[1];
    const grantAmount = ethers.utils.parseEther("10");
    const timeToUnlock = 7 * 3600 * 24;
    const contractBalBefore = await token.balanceOf(grantFunding.address);
    const ownerBalBefore = await token.balanceOf(signers[0].address);
    await grantFunding.connect(signers[0]).createNewGrant(grantAmount, timeToUnlock, receiver.address);
    const contractBalAfter = await token.balanceOf(grantFunding.address);
    const ownerBalAfter = await token.balanceOf(signers[0].address);
    expect((+contractBalAfter.toString() - +contractBalBefore.toString())).to.be.eq(+grantAmount.toString())
    expect((+ownerBalBefore.toString() - +ownerBalAfter.toString())).to.be.eq(+grantAmount.toString())
  });

  it("allows the funder to delete the grant before receipient withdraws", async() => {
    const receiver = signers[1];
    //get the number of grants in the system
    const receiverGrantBeforeRemoval = await grantFunding.showGrant(receiver.address);
    await grantFunding.connect(signers[0]).removeGrant(receiver.address);
    const receiverGrantAfterRemoval = await grantFunding.showGrant(receiver.address);
    expect(+receiverGrantBeforeRemoval.amount.toString()).to.not.eq(0);
    expect(+receiverGrantAfterRemoval.amount.toString()).to.be.eq(0);
  });

  it("allows the receipient to withdraw the grant", async() => {
    const receiver = signers[1];

    const grantAmount = ethers.utils.parseEther("10");
    const timeToUnlock = 7 * 3600 * 24;
    await grantFunding.connect(signers[0]).createNewGrant(grantAmount, timeToUnlock, receiver.address);
    const receiverTokenmountBefore = await token.balanceOf(receiver.address);
    const contractBalBefore = await token.balanceOf(grantFunding.address);

    await increaseBlockTimestamp(provider, 89988888888876);
    await grantFunding.connect(receiver).claimGrant();
    const receiverTokenmountAfter = await token.balanceOf(receiver.address);
    const contractBalAfter = await token.balanceOf(grantFunding.address);
    const tokenBalance = +receiverTokenmountAfter.toString() - +receiverTokenmountBefore.toString()
    expect(tokenBalance).to.be.eq(+grantAmount.toString());
    expect(+contractBalBefore.toString() - +contractBalAfter.toString()).to.be.eq(+grantAmount.toString());
  });

  it("prevents withdrawal of the grant", async() => {
    const receiver = signers[1];
    const grantAmount = ethers.utils.parseEther("10");
    const timeToUnlock = 7 * 3600 * 24;
    await grantFunding.connect(signers[0]).createNewGrant(grantAmount, timeToUnlock, receiver.address);
    const tx = grantFunding.connect(receiver).claimGrant();
    await expect(tx).to.be.revertedWith("Time lock not expired");
  });

  it("prevents double withdrawal of the grant", async() => {
    const receiver = signers[1];
    await increaseBlockTimestamp(provider, 89988888888876);
    await grantFunding.connect(receiver).claimGrant();
    const tx = grantFunding.connect(receiver).claimGrant();
    await expect(tx).to.be.revertedWith("Grant has already be claimed");
  });

  it("prevents an address without a grant from withdrawal of the grant", async() => {
    const receiver = signers[2];
    const tx = grantFunding.connect(receiver).claimGrant();
    await expect(tx).to.be.revertedWith("You have no grant to claim");
  });

  
})