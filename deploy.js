const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    // cimpile them in our code
    // compile them separately
    // http://127.0.0.1:7545
    // connection with the blockchain
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.GOERLI_RPC_URL
    )
    // console.log(provider)
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.PRIVATE_KEY_PASSWORD
    )
    wallet = await wallet.connect(provider)
    console.log(wallet.address)
    // wallet with a private key
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8") // synchronously read file to wait for it tobe done
    // console.log(abi)
    const binaryCode = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binaryCode, wallet)
    console.log("deploying , please wait...")
    const contract = await contractFactory.deploy() // await means: STOP here wait for the contract to be deployed
    // const contract = await contractFactory.deploy({ gasPrice: 100000000 }) // you can write gas price like this
    const transactionReceipt = await contract.deployTransaction.wait(1)
    console.log("here is the deployment transaction: ")
    console.log(contract.deployTransaction)
    console.log("here is the transaction receipt: ")
    console.log(transactionReceipt)
    // {
    //     to: null,
    //     from: '0xd4aFC6653DE014F32D297b1027634abF634Ae211',
    //     contractAddress: '0x07A2bB122912D8A8Be4bec8D68be686D895f23A2',
    //     transactionIndex: 0,
    //     gasUsed: BigNumber { _hex: '0x071342', _isBigNumber: true },
    //     logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    //     blockHash: '0xfa0be92c74e93065c8801752e9bb9d6531698379e4dcb533dd02e8981aa1fe1e',
    //     transactionHash: '0x1d37dae0960a1744934a3c4b8b10f26409a830a2d995cc905b62bfdd608369e3',
    //     logs: [],
    //     blockNumber: 131,
    //     confirmations: 1,
    //     cumulativeGasUsed: BigNumber { _hex: '0x071342', _isBigNumber: true },
    //     status: 1,
    //     type: 0,
    //     byzantium: true
    //   }
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
