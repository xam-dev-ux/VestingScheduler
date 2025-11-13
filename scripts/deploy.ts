import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying VestingScheduler contract to Base mainnet...");

  // Configuración inicial
  const feePercentage = 250; // 2.5% fee (250 basis points)
  const [deployer] = await ethers.getSigners();
  const feeCollector = deployer.address; // El deployer será el fee collector inicial

  console.log("Deploying with account:", deployer.address);
  console.log("Fee percentage:", feePercentage / 100, "%");
  console.log("Fee collector:", feeCollector);

  // Deploy del contrato
  const VestingScheduler = await ethers.getContractFactory("VestingScheduler");
  const vestingScheduler = await VestingScheduler.deploy(
    feePercentage,
    feeCollector
  );

  await vestingScheduler.waitForDeployment();

  const contractAddress = await vestingScheduler.getAddress();

  console.log("\n✅ VestingScheduler deployed to:", contractAddress);
  console.log("\nAdd this to your .env file:");
  console.log(`NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS=${contractAddress}`);

  console.log("\nWaiting for block confirmations...");
  const deployTx = vestingScheduler.deploymentTransaction();
  if (deployTx) {
    await deployTx.wait(5);
  }

  console.log("\nVerifying contract on Basescan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [feePercentage, feeCollector],
    });
    console.log("✅ Contract verified on Basescan");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("Contract already verified");
    } else {
      console.log("Error verifying contract:", error.message);
      console.log("You can verify manually later with:");
      console.log(`npx hardhat verify --network base ${contractAddress} ${feePercentage} ${feeCollector}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
