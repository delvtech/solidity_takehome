import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { MockProvider } from "ethereum-waffle";
import { ERC20 } from "../typechain-types/ERC20";
import { ERC20__factory } from "../typechain-types/factories/ERC20__factory";
import { Vaults } from "../typechain-types/Vaults";
import { Vaults__factory } from "../typechain-types/factories/Vaults__factory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { provider } = waffle;
const parseEther = ethers.utils.parseEther;

async function increaseBlockTimestamp(provider: MockProvider, time: number) {
  await provider.send("evm_increaseTime", [time]);
  await provider.send("evm_mine", []);
}

describe("vaults", function () {
  let token: ERC20;
  let vaults: Vaults;
  const [wallet] = provider.getWallets();
  let signers: SignerWithAddress[];

  before(async function () {
    signers = await ethers.getSigners();
    const deployer = new ERC20__factory(signers[0]);
    token = await deployer.deploy("token", "TKN");
    await token.mint(signers[0].address, parseEther("100"));

    const vaultsDeployer = new Vaults__factory(signers[0]);
    vaults = await vaultsDeployer.deploy();
  });

  describe("vault functionality", async () => {
    it("should create vault", async () => {
      await token.approve(vaults.address, parseEther("100"));

      const tommorow = Date.now() + 10_000_000;
      const cgTx = await vaults.createGrant(
        token.address,
        parseEther("50"),
        signers[1].address,
        tommorow
      );
      const cgRes = await cgTx.wait();
      const createGrantEvent = cgRes?.events?.find(
        (event) => event.event === "CreateVault"
      );

      const [grantId] = createGrantEvent?.args ?? [];

      expect(await (await vaults.vaults(grantId)).amount).to.be.eq(
        parseEther("50")
      );
    });

    it("should revert when claim before unlock", async () => {
      const claimTx = vaults.connect(signers[1]).claimVault(0);
      expect(claimTx).to.be.revertedWith("not unlocked");
    });

    it("should revert when non-recipient claim after unlock", async () => {
      increaseBlockTimestamp(provider, Date.now() + 10_000_000);
      const claimTx = vaults.connect(signers[2]).claimVault(0);
      expect(claimTx).to.be.revertedWith("not recipient");
    });

    it("should claimed funds (recipient) after unlock", async () => {
      increaseBlockTimestamp(provider, Date.now() + 10_000_000);
      await vaults.connect(signers[1]).claimVault(0);
      expect(await token.balanceOf(signers[1].address)).to.be.eq(
        parseEther("50")
      );
    });

    it("should revert when claim closed vault", async () => {
      await vaults.createGrant(
        token.address,
        parseEther("50"),
        signers[1].address,
        Date.now() - 1_000_000
      );

      await vaults.closeVault(1);

      const claimTx = vaults.connect(signers[1]).claimVault(1);
      expect(claimTx).to.be.revertedWith("closed");
    });
  });
});
