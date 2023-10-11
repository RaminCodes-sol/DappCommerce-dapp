const hre = require("hardhat");
const { items } = require("./products.json")


// Convert Eth To Wei
const convertToWei = (n) => {
  return hre.ethers.parseUnits(n.toString(), 'ether')
}


async function main() {

  // Accounts
  const [deployer] = await hre.ethers.getSigners()

  // Deploy Contract
  const dappCommerce = await hre.ethers.deployContract('DappCommerce');
  await dappCommerce.waitForDeployment();

  console.log(`deployed to ${dappCommerce.target}`);

  
  // Listing Products
  for (let i = 0; i < items.length; i++) {
    const responseTx = await dappCommerce.connect(deployer).listProducts(
      items[i].id, 
      items[i].name, 
      items[i].category, 
      items[i].image, 
      convertToWei(items[i].cost), 
      items[i].rating, 
      items[i].stock
    )
    await responseTx.wait()

    console.log(`Listed Item ${items[i].id}: ${items[i].name}`)
  }
}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
