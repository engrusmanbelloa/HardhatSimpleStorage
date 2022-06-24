// imports
const {
  ethers,
  run,
  network
} = require("hardhat")

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory(
    "SimpleStorage"
  )
  // await hre.run('compile');

  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed()

  console.log(`deployed contract to: ${simpleStorage.address}`)
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(6)
    await verify(simpleStorage.address, [])
  }

  const curentValue = await simpleStorage.retrieve()
  console.log(`current value: ${curentValue}`)

  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`updated value: ${updatedValue}`)
}

async function verify(contractAddress, args) {
  console.log("verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("already verified");
    } else {
      console.log(e);
    }
  }
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });