const path = require("path");
const { ethers, network, run } = require("hardhat")
const {
    VERIFICATION_BLOCK_CONFIRMATIONS,
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")

async function deployW3Recicle() {
    //const chainId = network.config.chainId
    //console.log("", network)
    // ethers is available in the global scope
    //const [deployer] = await ethers.getSigners();
    //const deployerAddress = await deployer.getAddress();
    // const LEADER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("LEADER_ROLE"));
    const COLLECTPOINT_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("COLLECTPOINT_ROLE"));
    const CONSUMER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("CONSUMER_ROLE"));
    const DEFAULT_ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("DEFAULT_ADMIN_ROLE"));


    const W3Recicle = await ethers.getContractFactory("W3Recicle");
    const w3r = await W3Recicle.deploy("W3Recicle", "W3R");
    console.log("w3r contract address:", w3r.address);
    await w3r.deployed();

    await w3r.grantRole(DEFAULT_ADMIN_ROLE, "0x289d4092FE8afdB0a9d2d7994219610D208F19d9");

    await w3r.grantRole(CONSUMER_ROLE, "0x289d4092FE8afdB0a9d2d7994219610D208F19d9");
    // console.log('New role CONSUMER_ROLE to adress 0x289d4092FE8afdB0a9d2d7994219610D208F19d9', CONSUMER_ROLE);
    await w3r.grantRole(CONSUMER_ROLE, "0x608AbF4328F82Ef053EB1ee73feFA56518F73059");
    // console.log('New role CONSUMER_ROLE to adress 0x608AbF4328F82Ef053EB1ee73feFA56518F73059', CONSUMER_ROLE);
    await w3r.grantRole(COLLECTPOINT_ROLE, "0xE860C991cdbcd8cF8C5e0C59C2F0B4f2e46043D5");
    // console.log('New role COLLECTPOINT_ROLE to adress 0xE860C991cdbcd8cF8C5e0C59C2F0B4f2e46043D5', COLLECTPOINT_ROLE);
    await w3r.grantRole(COLLECTPOINT_ROLE, "0x553C28796D99B154Da50F3BFA8681f1bdfb8fa9e");
    // console.log('New role COLLECTPOINT_ROLE to adress 0x553C28796D99B154Da50F3BFA8681f1bdfb8fa9e', COLLECTPOINT_ROLE);
    

    // await w3r.registerProduct("Device", "Model", "Image", "fabricant", 10);
    // console.log('devices', _devices);

    // We also save the contract's artifacts and address in the frontends directories
    saveFrontendFiles(w3r);
    
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await run("verify:verify", {
            address: erc721.address
        })
    }

}


function saveFrontendFiles(erc, template=0) {
    const fs = require("fs");
    var contractsDir = path.join(__dirname, "../../", "frontend", "src", "contracts");
    if (template > 0){
      contractsDir = path.join(__dirname, "../../", "frontend"+template, "src", "contracts");
    }
    
    console.log('Saving frontend files...')
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }    
    
    fs.writeFileSync(
      path.join(contractsDir, "contract-W3Recicle-address.json"),
      JSON.stringify({ W3Recicle: erc.address }, undefined, 2)
    );
    
    const W3RecicleArtifact = artifacts.readArtifactSync("W3Recicle");
    
    fs.writeFileSync(
      path.join(contractsDir, "W3Recicle.json"),
      JSON.stringify(W3RecicleArtifact, null, 2)
    );
        
  }

module.exports = {
  deployW3Recicle,
}
