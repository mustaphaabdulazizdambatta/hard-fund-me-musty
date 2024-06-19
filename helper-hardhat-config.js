const networkConfig = {
    4: {
        name: "rinkebey",
        ethUsdPriceFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xbE23a3AA13038CfC28aFd0ECe4FdE379fE7fBfc4",

    },
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed : "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    }
}
const DECIMAL = 8;
const INITIAL_ANSWER = 20000000000;

const developmentChains = ["hardhat", "localhost"]
module.exports = {
    networkConfig,
    developmentChains,
    DECIMAL,
    INITIAL_ANSWER
};