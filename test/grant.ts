import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { ERC20 } from "../typechain/ERC20";
import { Grant } from "../typechain-types/Grant";
import { Grant__factory } from "../typechain-types/factories/Grant__factory";
import { ERC20__factory } from "../typechain/factories/ERC20__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { MockProvider } from "ethereum-waffle";
import { getArgumentForSignature } from "typechain";


const { provider } = waffle;

async function increaseBlockTimestamp(provider: MockProvider, time: number) {
  await provider.send("evm_increaseTime", [time]);
  await provider.send("evm_mine", []);
};

describe("grant", function () {
  let token: ERC20;
  const [wallet] = provider.getWallets();
  let signers: SignerWithAddress[];
  let grant: Grant;
  let reciever: SignerWithAddress;
  let owner: SignerWithAddress;

  before(async function () {
    signers = await ethers.getSigners();
    owner = signers[0]
    reciever = signers[1]
    const deployer = new ERC20__factory(owner);
    token = await deployer.deploy("token", "TKN");
    await token.mint(owner.address, ethers.utils.parseEther("100"));
    
    const grantDeployer = new Grant__factory(owner);
    grant = await grantDeployer.deploy();

    // Approve grant contract spending ERC20
    await token.approve(grant.address, ethers.utils.parseEther("100"));
  });

  /*
   *   Deposits a grant
   */

  it("deposits a grant", async () => {
    let tomorrow = new Date(); // now
    tomorrow.setDate(tomorrow.getDate() + 1); // add 1 day
    const unlockTime = Math.floor(tomorrow.getTime() / 1000); // divide for unix timestamp
    await grant.deposit(token.address, unlockTime, reciever.address, ethers.utils.parseEther("1"))

    expect(await grant.connect(reciever).checkGrantAmount()).to.be.eq(
      ethers.utils.parseEther("1")
    );
    expect(await grant.connect(reciever).checkGrantUnlockTime()).to.be.eq(
      unlockTime
    );
  });

  it("fails if a grant is already open", async () => {
    let tomorrow = new Date(); // now
    tomorrow.setDate(tomorrow.getDate() + 1); // add 1 day
    const unlockTime = Math.floor(tomorrow.getTime() / 1000); // divide for unix timestamp
    const tx = grant.deposit(
      token.address, 
      unlockTime, 
      reciever.address, 
      ethers.utils.parseEther("1"));
    await expect(tx).to.be.revertedWith("RecipientHasOpenGrant");
  });

  it("emits an event on grant creation", async () => {
    let tomorrow = new Date(); // now
    tomorrow.setDate(tomorrow.getDate() + 1); // add 1 day
    const unlockTime = Math.floor(tomorrow.getTime() / 1000); // divide for unix timestamp
    const tx = await grant.deposit(
      token.address, 
      unlockTime, 
      signers[2].address, 
      ethers.utils.parseEther("10"));
    const receipt = await tx.wait();

    let events = receipt.events?.filter((x) => {return x.event == "GrantDeposited"})
    if(events){
      expect(events[0].event).to.be.eq(
        'GrantDeposited'
      );
    } else {
      throw "ERROR: Grant not created, event not defined";
    }
  });

  /*
   *   Revokes a grant (at this point, signers2 and reciever have grants)
   */

  it("revokes a grant", async () => {
    // Expect original balance to be 100 - 1(first grant) - 10(second grant)
    expect(await token.balanceOf(owner.address)).to.be.eq(
      ethers.utils.parseEther("89")
    );
    
    const tx = await grant.revoke(signers[2].address);
    const receipt = await tx.wait();

    let events = receipt.events?.filter((x) => {return x.event == "GrantRevoked"})
    if(events){
      expect(events[0].event).to.be.eq(
        'GrantRevoked'
      );
    } else {
      throw "ERROR: Grant not revoked, event not defined";
    }

    // Expect second grant 10 erc20 is returned to owner
    expect(await token.balanceOf(owner.address)).to.be.eq(
      ethers.utils.parseEther("99")
    );
    
    // Delete the grant in the contract, amount will be 0
    expect(await grant.connect(signers[2]).checkGrantAmount()).to.be.eq(
      ethers.utils.parseEther("0")
    );
  });

  it("errors on a claimable grant", async () => {
    let datePastUnlockTime = new Date(); // now
    datePastUnlockTime.setDate(datePastUnlockTime.getDate() + 2); // add 2 days
    const datePastUnlockTimeUnix = Math.floor(datePastUnlockTime.getTime() / 1000); // divide for unix timestamp
    await increaseBlockTimestamp(provider, datePastUnlockTimeUnix);

    const tx = grant.revoke(reciever.address);
    await expect(tx).to.be.revertedWith("GrantRevokeWindowMissed");
  });

    /*
   *   Claims a grant
   */

    it("reverts on no grant", async () => {      
      const tx = grant.connect(signers[2]).claim();  
      await expect(tx).to.be.revertedWith("NoGrant");
    });

    it("claims a grant", async () => {
      
      expect(await token.balanceOf(reciever.address)).to.be.eq(
        ethers.utils.parseEther("0")
      );
      
      const tx = await grant.connect(reciever).claim();
      const receipt = await tx.wait();
  
      let events = receipt.events?.filter((x) => {return x.event == "GrantClaimed"})
      if(events){
        expect(events[0].event).to.be.eq(
          'GrantClaimed'
        );
      } else {
        throw "ERROR: Grant not claimed, event not defined";
      }
  
      // Expect second grant 10 erc20 is returned to owner
      expect(await token.balanceOf(reciever.address)).to.be.eq(
        ethers.utils.parseEther("1")
      );
      expect(await grant.connect(reciever).checkGrantClaimedOrRevoked()).to.be.true;


    });
  
    it("errors on a claimed grant", async () => {
      const tx = grant.connect(reciever).claim();  
      await expect(tx).to.be.revertedWith("GrantRevokedOrClaimed");
    });

    

});