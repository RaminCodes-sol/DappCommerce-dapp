import { useState } from "react"
import { ethers } from 'ethers'




const Navbar = ({ account, setAccount }) => {
  const [inputValue, setInputValue] = useState('')
  

  // Connect to wallet
  const connectToWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = ethers.getAddress(accounts[0])
        setAccount(account)
      } catch (error) {
        console.log("Error:", error.message)
      }
    } else {
      alert("please install MetaMask")
    }
  }


  return (
    <nav className="w-full  bg-black flex flex-col gap-4">

      <section className="w-full px-12 pt-6 pb-2 flex justify-between items-center">
        {/* ---- Logo ---- */}
        <div>
          <h1 className="font-semibold text-2xl">DappCommerce</h1>
        </div>

        {/* ---- Search Input ---- */}
        <div className="w-1/3"> 
          <input typ='text' placeholder="Search..." value={inputValue} onChange={e => setInputValue(e.target.value)} className="w-full px-2 py-2 border-none outline-none rounded-sm text-black" />
        </div>

        {/* ---- Connect Button ---- */}
        <div>
          {
            account 
              ? <button className="bg-red-500 px-3 py-2 rounded-md transition-colors hover:bg-red-600">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </button>
              : <button onClick={connectToWallet} className="bg-red-500 px-3 py-2 rounded-md transition-colors hover:bg-red-600">
                  Connect
                </button>
          }
        </div>
      </section>

      {/* ---- Links ---- */}
      <section className="w-full flex justify-center bg-blue-950 py-2">
        <ul className="flex gap-5">
          <li><a href="#Clothing & Jewelry" className="transition-colors hover:text-white/70">Clothing & Jewelry</a></li>
          <li><a href="#Electronics & Gadgets" className="transition-colors hover:text-white/70">Electronics & Gadgets</a></li>
          <li><a href="#Gaming & Toys" className="transition-colors hover:text-white/70">Gaming & Toys</a></li>
        </ul>
      </section>

    </nav>
  )
}

export default Navbar