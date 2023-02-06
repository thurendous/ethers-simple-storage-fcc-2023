const ethers = require('ethers')
const fs = require('fs-extra')
require('dotenv').config()

async function main() {
    // cimpile them in our code
    // compile them separately
    // http://127.0.0.1:7545
    // connection with the blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    console.log(typeof process.env.RPC_URL, process.env.RPC_URL)
    const PRIVATE_KEY = process.env.PRIVATE_KEY
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    // console.log(wallet)
    // wallet with a private key
    const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8') // synchronously read file to wait for it tobe done
    // console.log(abi)
    const binaryCode = fs.readFileSync(
        './SimpleStorage_sol_SimpleStorage.bin',
        'utf8'
    )
    const contractFactory = new ethers.ContractFactory(abi, binaryCode, wallet)
    console.log('deploying , please wait...')
    const contract = await contractFactory.deploy() // await means: STOP here wait for the contract to be deployed
    console.log(contract)
    const transactionReceipt = await contract.deployTransaction.wait(1) // wait for 1 block to complete

    const currentFavoriteNumber = await contract.retrieve()
    console.log(`current favorite number: ${currentFavoriteNumber.toString()}`)
    const txRes2 = await contract.store(`66`)
    const transactionReceipt2 = await txRes2.wait(1) // wait for 1 block to complete
    console.log(transactionReceipt2)
    const updatedFavoriteNumber = await contract.retrieve()
    console.log(`current favorite number: ${updatedFavoriteNumber.toString()}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

// Asynchronous
// it allows you to do something at the same time
// And JavaScript is synchronous actually, so asynchronous functions are quite important.
