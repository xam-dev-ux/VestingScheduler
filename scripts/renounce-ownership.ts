import { ethers } from "hardhat";

async function main() {
  console.log("🚨 RENOUNCING OWNERSHIP OF VESTING SCHEDULER CONTRACT 🚨\n");

  const contractAddress = process.env.NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS;

  if (!contractAddress) {
    throw new Error("NEXT_PUBLIC_VESTING_CONTRACT_ADDRESS not set in .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);

  const VestingScheduler = await ethers.getContractFactory("VestingScheduler");
  const contract = VestingScheduler.attach(contractAddress);

  // Check current owner
  const currentOwner = await contract.owner();
  console.log("Current owner:", currentOwner);

  if (currentOwner.toLowerCase() !== signer.address.toLowerCase()) {
    throw new Error("You are not the owner of this contract!");
  }

  if (currentOwner === ethers.ZeroAddress) {
    console.log("✅ Ownership already renounced!");
    return;
  }

  console.log("\n⚠️  WARNING: This action is IRREVERSIBLE!");
  console.log("After renouncing ownership:");
  console.log("  ❌ Cannot change fees");
  console.log("  ❌ Cannot withdraw accumulated fees");
  console.log("  ❌ Cannot pause the contract");
  console.log("  ✅ Contract becomes fully decentralized\n");

  console.log("Renouncing ownership in 3 seconds...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("\nExecuting renounceOwnership()...");
  const tx = await contract.renounceOwnership();
  console.log("Transaction hash:", tx.hash);

  console.log("Waiting for confirmation...");
  await tx.wait();

  // Verify ownership renounced
  const newOwner = await contract.owner();
  console.log("\n✅ Ownership renounced successfully!");
  console.log("New owner:", newOwner);

  if (newOwner === ethers.ZeroAddress) {
    console.log("🎉 Contract is now fully decentralized!");
    console.log(`\nVerify on BaseScan: https://basescan.org/address/${contractAddress}#readContract`);
    console.log("Check the 'owner' function - it should return 0x0000000000000000000000000000000000000000");
  } else {
    console.log("⚠️  Warning: Owner is not zero address. Something went wrong!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
