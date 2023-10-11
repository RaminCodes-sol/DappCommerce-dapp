import Rating from "./Rating"



const Product = ({ item, toggleModalFunc }) => {

    return (
        <div onClick={() => toggleModalFunc(item)} className='w-full flex flex-col gap-3 cursor-pointer border border-gray-500 p-4 rounded-md group'>

            <figure className='w-full overflow-hidden'>
                <img src={item.image} alt='img' className='w-full transition-transform group-hover:scale-110 duration-200'/>
            </figure>

            <div className="flex justify-between items-center">
                <p>
                    Price: <span className='font-semibold text-xl'>{item.cost} </span> 
                    <span className='text-xs inline-block text-green-400'>ETH</span>
                </p>
                <div>
                    { <Rating rating={item.rating} /> }
                </div>
            </div>

        </div>
    )
}

export default Product
