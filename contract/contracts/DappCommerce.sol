// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


contract DappCommerce {
    address payable public immutable owner;
    string public name;

    constructor () {
        owner = payable(msg.sender);
        name = "DappCommerce";
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }


    // Events
    event ProductListed (uint256 _productId, string _productName, uint256 _productCost, uint256 _quantity);
    event ProductPurchased (address _buyerAddress, uint256 _orderId, uint256 _productId);


    // Product Struct
    struct ProductStruct {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    
    // Order Struct
    struct OrderStruct {
        uint256 time;
        ProductStruct item;
    }


    // mappings
    mapping (uint256 => ProductStruct) public products;
    mapping (address => mapping(uint256 => OrderStruct)) public orders;
    mapping (address => uint256) public orderCount;



    // List Products
    function listProducts (uint256 _id, string memory _name, string memory _category, string memory _image, uint256 _cost, uint256 _rating, uint256 _stock) public onlyOwner {
        ProductStruct memory newProduct = ProductStruct(_id, _name, _category, _image, _cost, _rating, _stock);
        products[_id] = newProduct;

        emit ProductListed(_id, _name,_cost, _stock);
    }


    // Buy Product
    function buyProduct (uint256 _productId) public payable {
        ProductStruct memory product = products[_productId];
        require(msg.value >= product.cost, "Not enough funds to buy a product");
        require(product.stock > 0, 'The product is out of stock');

        OrderStruct memory newOrder = OrderStruct(block.timestamp, product);

        orderCount[msg.sender] += 1; // => order id
        orders[msg.sender][orderCount[msg.sender]] = newOrder; 
        
        products[product.id].stock = product.stock - 1; // == products[product.id].stock -= 1;

        emit ProductPurchased(msg.sender, orderCount[msg.sender], product.id);

    }


    // Withdraw Funds
    function withdrawFunds () external onlyOwner {
        require(address(this).balance > 0 , "The contract balance is 0");

        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Transfering Failed");
    }
}