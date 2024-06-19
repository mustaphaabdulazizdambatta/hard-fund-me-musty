const { assert, expect } = require("chai")
const {deployments, ethers, getNamedAccounts} = require("hardhat")
const {developmentChains} = require("../../helper-hardhat-config")

describe("FundMe", async function() {
    let fundMe
    let deployer
    let mockV3Aggregator
    let sendValue = ethers.utils.parseEther("1")
    beforeEach(async function() {
        //deploy fundme contract using hardhat deploy
        // const account = await ethers.getSigner()
        // const accountsZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })
    beforeEach("constructor", async function() {
        it("sets the aggregator addresses correctly", async function() {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("fund", async function() {
        it("fails if you don't send enough ETH", async function() {
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH")
        })
        it("updated the amount funded data structure", async function (){
            await fundMe.fund({value: sendValue})
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("adds funder to array of funders", async function() {
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.funders(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdraw", async function() {
        beforeEach(async function() {
            await fundMe.fund({value: sendValue})
        })
        it("withdraw  ETH from a single founder", async function() {
            //arrange
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

            //act
            const transactionResponse = await fundMe.withdraw()
            const {gasUsed, effectGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectGasPrice)
            const transactionReceipt = await transactionReceipt.wait(1)

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            //asert
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString, endingDeployerBalance.add(gasCost).toString)
        })
        it("allow us to withdraw with multiple funders", async function() {
            //arrange
            const accounts = await ethers.getSigner()
            for(let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({value : sendValue})
            }
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance = await fundMe.provider.getBalance(deployer)

            //act
            const transactionResponse = await fundMe.withdraw()
            const {gasUsed, effectGasPrice} = transactionReceipt
            const gasCost = gasUsed.mul(effectGasPrice)
            const transactionReceipt = await transactionReceipt.wait(1)
            //assert
            
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)
            assert.equal(endingFundMeBalance, 0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString, endingDeployerBalance.add(gasCost).toString)

            //make sure the funders are reset properly
            await expect(fundMe.funders(0)).to.be.reverted

            for(i = 1; i < 6; i++) {
                assert.equal(await fundMe.addressToAmountFunded(accounts[1].address),0)
            }

        })
        it("only allows the owner to withdraw", async function() {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
        })
    })
})