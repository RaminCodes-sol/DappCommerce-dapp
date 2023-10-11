import { useEffect, useState } from "react"
import { ethers } from 'ethers'
import Rating from "./Rating"
import { IoClose } from "react-icons/io5"




const Modal = ({ provider, dappCommerce, account, selectedItem, toggleModalFunc }) => {
    const [order, setOrder] = useState(null)
    const [hasBought, setHasBought] = useState(false)


    // Fetch Events
    const fetchEvents = async () => {
        const events = await dappCommerce.queryFilter("ProductPurchased")

        const orders = events.filter(event => event.args._buyerAddress.toLowerCase() === account && event.args._productId.toString() === selectedItem.id.toString())

        if (orders.length == 0) return

        const order = await dappCommerce.orders(account, orders[0].args._orderId)
        setOrder(order)
    }


    // Handle Buying Product
    const handleBuying = async () => {
        const signer = await provider.getSigner()
        const responseTx = await dappCommerce.connect(signer).buyProduct(selectedItem.id, { value: ethers.parseEther(selectedItem.cost) })
        await responseTx.wait()

        setHasBought(true)
    }


    
    useEffect(() => {
        fetchEvents()
    }, [hasBought])



  return (
    <section className="w-screen h-screen top-0 left-0 bottom-0 right-0 fixed bg-black/90 flex justify-center p-5">
        <div className="w-full max-w-[1000px] mx-auto p-2">
            
            {/*------- Navbar -------*/}
            <div className="w-full flex justify-between items-center px-3 py-1">
                <h1 className="text-2xl font-semibold">DappCommerce</h1>
                <button onClick={() => toggleModalFunc()} className="bg-red-500 w-[40px] h-[40px] text-2xl transition-colors rounded-md hover:bg-red-600"><IoClose /></button>
            </div>


            {/*------- Contents -------*/}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* ---- Image-LeftSide ---- */}
                <figure className="w-full h-full p-10">
                    <img src={selectedItem.image} alt='img' className="w-full h-[200px] object-cover md:h-full" />
                </figure>

                {/* ---- Details-RightSide ---- */}
                <div className="px-5 py-8 flex flex-col gap-3">
                    {/* Item_Name */}
                    <h1 className="text-3xl font-semibold">{selectedItem.name}</h1>

                    {/* Item_Price-&-Rating */}
                    <div className="flex justify-between items-center">
                        <p>
                            Price: <span className='font-semibold text-xl'>{selectedItem.cost} </span> 
                            <span className='text-xs inline-block text-green-400'>ETH</span>
                        </p>
                        <Rating rating={selectedItem.rating}/>
                    </div>

                    {/* Item_Description*/}
                    <div className="mt-3">
                        <p>Introducing the new and improved XYZ product, designed to provide unparalleled performance and reliability with cutting-edge technology, sleek design, and advanced features for ultimate productivity and entertainment.</p>
                    </div>
                        
                    {/* Item_OrderDetails */}
                    <div className="flex flex-col gap-2 mt-4">
                        {
                            order 
                                ? (
                                    <p className="text-xl text-orange-400">Item Bought On: <strong>{ new Date(Number(order.time.toString() + '000')).toLocaleDateString(undefined, {weekday: 'long', hour: 'numeric', minute: 'numeric', second: 'numeric'}) }</strong></p>
                                )
                                : (
                                    <>
                                        <p>Free Delivery: <span className="text-pink-500">{ new Date(Date.now() + 345600000).toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'}) }</span></p>
                                        <p>{ selectedItem.stock > 0 ? <span className="text-green-500">In Stock</span> : <span className="text-red-500">Out Of Stock</span> }</p>
                                        { selectedItem.stock > 0 && <button onClick={handleBuying} className="bg-orange-500 p-3 mt-4 text-lg rounded-sm transition-colors hover:bg-orange-600">Buy Now</button>}
                                    </>
                                )
                        }
                    </div>
                </div>
            </div>

        </div>
    </section>
  )
}

export default Modal