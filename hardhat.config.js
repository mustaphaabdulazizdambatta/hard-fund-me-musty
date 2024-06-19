require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");

// require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

const { version } = require("chai");

require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers : [
      {version: "0.8.8"},
      {version: "0.6.6"},
      
    ]
  },
  gasReporter : {
    enable : true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    current: "USD",
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  etherscan : {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  defaultNetwork: "hardhat",
  networks : {
    sepolia : {
      url : SEPOLIA_RPC_URL,
      accounts : [PRIVATE_KEY],
      ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      chainId: 11155111,
      blockComfirmation: 6,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user : {
      default: 1,
    },
  },
};

