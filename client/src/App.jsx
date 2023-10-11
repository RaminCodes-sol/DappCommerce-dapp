import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { BrowserProvider } from 'ethers/providers'
import Navbar from './components/Navbar'
import DappCommerce from './abi/DappCommerce.json'
import Product_Section from './components/Product_Section'
import Modal from './components/Modal'




const App = () => {
  const [account, setAccount] = useState([])
  const [provider, setProvider] = useState(null)
  const [dappCommerce, setDappCommerce] = useState(null)
  
  const [toys, setToys] = useState([])
  const [clothing, setClothing] = useState([])
  const [electronics, setElectronics] = useState([])

  const [toggleModal, setToggleModal] = useState(false)
  const  [selectedItem, setSelectedItem] = useState({})



  // Contract Address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"


  // Toggle Modal function
  const toggleModalFunc = (item = {}) => {
    setToggleModal(!toggleModal)
    setSelectedItem(item)
  }


  // is Wallet Connected
  const isWalletConnected = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        
        if (accounts.length > 0) {
          setAccount(accounts[0])
          console.log("accounts:", accounts)
        } else {
          console.log("Please connect to MetaMask")
        }
      } catch (error) {
        console.log("Errorr", error.message)
      }
    } else {
      alert("Please install MetaMask")
    }
  }


  // Wallet Listener
  const walletListener = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        console.log({accounts}, "hey listener")
        setAccount(accounts[0])
      })
    } else {
      setAccount('')
      alert("Please install MetaMask")
    }
  }


  // Load blockchain data(products)
  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum)
      setProvider(provider)

      // contract instance
      const contract = new ethers.Contract(contractAddress, DappCommerce.abi, provider)
      setDappCommerce(contract)

      // load products
      const products = []

      for (let i = 0; i < 9; i++) {
        const product = await contract.products(i + 1)
        products.push({
          id: product.id.toString(),
          name: product.name.toString(),
          category: product.category.toString(),
          image: product.image.toString(),
          cost: ethers.formatEther((product.cost).toString()),
          rating: product.rating.toString(),
          stock: product.stock.toString()
        })
      }
      
      // filtered products
      const toys = products.filter(product => product.category === 'toys')
      const clothing = products.filter(product => product.category === 'clothing')
      const electronics = products.filter(product => product.category === 'electronics')

      setToys(toys)
      setClothing(clothing)
      setElectronics(electronics)
    }
  }


  useEffect(() => {
    isWalletConnected()
    loadBlockchainData()
    walletListener()
  }, [])


  return (
   <main>

    {/*-----Navbar-----*/}
    <Navbar account={account} setAccount={setAccount} />


    {/*-----Products-----*/}
    {
      electronics && toys && clothing && (
        <div className='w-full max-w-[1100px] mx-auto mt-16'>
          <Product_Section title={"Toys & Gaming"} items={toys} toggleModalFunc={toggleModalFunc} />
          <Product_Section title={"Clothing & Jwelery"} items={clothing} toggleModalFunc={toggleModalFunc} />
          <Product_Section title={"Electronics & Gadgets"} items={electronics} toggleModalFunc={toggleModalFunc} />
        </div>
      )
    }

    {/*-----Popup-Modal-----*/}
    {
      toggleModal && <Modal provider={provider} dappCommerce={dappCommerce} account={account} selectedItem={selectedItem} toggleModalFunc={toggleModalFunc} />
    }

   </main>
  )
}

export default App
