import Product from './Product'




const Product_Section = ({ title, items, toggleModalFunc }) => {
  return (
    <div className='p-3 mb-10'>

      {/* Title */}
      <h1 className='text-3xl mb-3 ml-4'>{title}</h1>

      {/* Items */}
      <div className='w-full grid grid-cols-1 gap-4 sm:grid-cols-fluid'>
        { items?.map((item, indx) => <Product key={indx} item={item} toggleModalFunc={toggleModalFunc} />) }
      </div>

    </div>
  )
}

export default Product_Section