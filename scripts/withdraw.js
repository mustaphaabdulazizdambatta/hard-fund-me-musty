const { getNamedAccounts, ethers } = require("hardhat")

async function main() {
    const {deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContract("FundMe", deployer)
    console.log("funding...")
    const transactionResponse = fundMe.withdraw()
    await transactionResponse.wait(1)
    console.log("got it back")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })