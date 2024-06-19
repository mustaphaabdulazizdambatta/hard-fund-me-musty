const {run} = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

async function verify(contractAddress, args) {
    console.log("verifying............")
    try {
    await run("verify:verify",{
        address: contractAddress,
        constructorArguments: args,
    });

    }catch (e) {
        if(e.message.toLowerCase().includes("already ")) {
            console.log("Already Verified!")
        }else{
            console.log(e)
        }
    }
}

module.exports = {verify, networkConfig}