import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { MockProvider } from "ethereum-waffle";

const { provider } = waffle;

async function increaseBlockTimestamp(provider: MockProvider, time: number) {
  await provider.send("evm_increaseTime", [time]);
  await provider.send("evm_mine", []);
};

describe("vault", function () {

});