const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;  // Extract deploy and log functions from deployments
    const { deployer } = await getNamedAccounts();  // Get the deployer account
    const chainId = network.config.chainId;  // Get the current chain ID
    const {verify} = require("../utils/verify");

    let ethUsdPriceFeedAddress;

    // Check if the current network is a development chain
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;  // Use the mock aggregator address for development
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];  // Use the real price feed address for live networks
    }

    // Deploy the FundMe contract with the determined price feed address
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 4
    });
    if(developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address, args)
    }

    log("---------------------");
};

module.exports.tags = ["all", "fundme"];  // Tag the deployment for easy reference
