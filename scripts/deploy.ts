import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const tCroiletToken = await ethers.deployContract("tCroiletToken", [deployer.address]);
  await tCroiletToken.waitForDeployment();

  console.log("tCroiletToken deployed to:", await tCroiletToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });