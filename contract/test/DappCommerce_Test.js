const { expect } = require("chai");


// Convert Eth To Wei
const convertToWei = (n) => {
  return hre.ethers.parseUnits(n.toString(), "ether")
}

// function args
const ID = 1
const NAME = "Watch"
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/watch.jpg"
const COST = convertToWei(1)
const RATING = 4
const STOCK = 20


describe("DappCommerce", () =>{
  
  let dappCommerce, deployer, buyer;
  
  beforeEach(async () => {
    // Deploy Contract
    dappCommerce = await hre.ethers.deployContract('DappCommerce');
    await dappCommerce.waitForDeployment();

    // Accounts
    [deployer, buyer] = await hre.ethers.getSigners()
  })


  /*------- describe-Development -------*/
  describe("Development", () => {
    it("Should has a owner", async () => {
      const contractDeployer = await dappCommerce.owner()
      expect(await contractDeployer).to.equal(deployer.address)
    })

    it("Should has a name", async () => {
      const name = await dappCommerce.name()
      expect(await name).to.equal("DappCommerce")
    })
  })


  /*------- describe-Listing Products -------*/
  describe("Listing Products", () => {
    let responseTx

    beforeEach(async () => {
      responseTx = await dappCommerce.connect(deployer).listProducts(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await responseTx.wait()  
    })

    it("Returns Product Attributes", async () => {
      const product = await dappCommerce.products(1)
      
      expect(await product.id).to.equal(ID)
      expect(await product.name).to.equal(NAME)
      expect(await product.category).to.equal(CATEGORY)
      expect(await product.image).to.equal(IMAGE)
      expect(await product.cost).to.equal(COST)
      expect(await product.rating).to.equal(RATING)
      expect(await product.stock).to.equal(STOCK)
    })

    it("Emits ProductListed event", async () => {
      expect(await responseTx).to.emit(dappCommerce, 'ProductListed')
    })
  })


  /*------- describe-Buying Products -------*/
  describe("Buying Products", () => {
    let responseTx 

    beforeEach(async () => {
      // List Products
      responseTx = await dappCommerce.connect(deployer).listProducts(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await responseTx.wait()

      // Buy Products
      responseTx = await dappCommerce.connect(buyer).buyProduct(ID, { value: COST })
      await responseTx.wait()
    })

    it("Updates Buyer's Order Count", async () => {
      const orderCount = await dappCommerce.orderCount(buyer.address)
      expect(await orderCount).to.equal(1)
    })

    it("Adds Buyer's Order", async () => {
      const order = await dappCommerce.orders(buyer.address, ID)
      expect(await order.time).to.be.greaterThan(0)
      expect(await order.item.id).to.equal(1)
      expect(await order.item.name).to.equal(NAME)
    })

    it("Updates Contract Balance", async () => {
      const contractBalance = await hre.ethers.provider.getBalance(dappCommerce.target)
      expect(await contractBalance).to.equal(COST)
    })
    
    it("Emits ProductPurchased event", async () => {
      expect(await responseTx).to.emit(dappCommerce, "ProductPurchased")
    })
  })


  /*------- describe-WithdrawFunds -------*/
  describe("Withdrawing", () => {
    let responseTx 
    let deployerBalanceBefore

    beforeEach(async ()=> {
      // List Product
      responseTx = await dappCommerce.connect(deployer).listProducts(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await responseTx.wait()

      // Buy Product
      responseTx = await dappCommerce.connect(buyer).buyProduct(ID, { value: COST })
      await responseTx.wait()

      // Get Deployer Balance Before Tx
      deployerBalanceBefore = await hre.ethers.provider.getBalance(deployer.address)

      // Withdraw Funds From Contract To Deployer
      responseTx = await dappCommerce.connect(deployer).withdrawFunds()
      await responseTx.wait()
    })

    it("Updates Deployer Balance", async () => {
      const deployerBalancAfter = await hre.ethers.provider.getBalance(deployer.address)
      expect(await deployerBalancAfter).to.be.greaterThan(deployerBalanceBefore)
    })

    it("Updates Contract Balance", async () => {
      const contractBalance = await hre.ethers.provider.getBalance(dappCommerce.target)
      expect(await contractBalance).to.equal(0)
    })
  })
  
})
