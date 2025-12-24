import { ethers } from "./ethers-6.7.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

const connectedAddress = document.getElementById("connected-address")
const getFund = document.getElementById("get-fund") 
const withdrawResult = document.getElementById("withdraw-result") 
const fundResult = document.getElementById("fund-result") 

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
      connectButton.innerHTML = "Connected"
      const accounts = await ethereum.request({ method: "eth_accounts" })
      connectedAddress.innerHTML = accounts
      console.log(accounts)
    } catch (error) {
      console.log(error)
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask"
  }
}

async function withdraw() {
  console.log(`Withdrawing...`)
  withdrawResult.innerHTML = "Withdrawing..."
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      console.log("Processing transaction...")
      withdrawResult.innerHTML = "Processing transaction..."
      const transactionResponse = await contract.withdraw()
      await transactionResponse.wait(1)
      console.log("Done!")
      withdrawResult.innerHTML = "Withdrawed."
    } catch (error) {
      console.log(error)
      withdrawResult.innerHTML = "error or You are not owner!!!"
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  fundResult.innerHTML = `Funding with ${ethAmount}...`
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      fundButton.disabled = true
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      })
      await transactionResponse.wait(1)
      fundResult.innerHTML = "Funded..."
      fundButton.disabled = false
    } catch (error) {
      fundResult.innerHTML = "Not enough \"ETH sent < $5 or ~0.003Eth\" or You have Insufficient funds !!!"
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      getFund.innerHTML = `${ethers.formatEther(balance)}ETH`
      console.log(ethers.formatEther(balance))
    } catch (error) {
      getFund.innerHTML = "Error fetching Balance"
      console.log(error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}