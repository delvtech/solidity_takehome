import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";

import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: false,
            runs: 7500,
          },
        },
      },
    ]
  },
  mocha: { timeout: 0 }
};

export default config;
