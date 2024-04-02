const { ethers } = require("ethers");
const transferABI = require("./transferAbi.json");
require("dotenv").config();

async function main() {
    const contractAddress = "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58";
    
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
        console.error("Alchemy API key is missing.");
        return;
    }else(
        console.log(alchemyApiKey)
    )

    const provider = new ethers.WebSocketProvider(
        `wss://opt-mainnet.g.alchemy.com/v2/oS8WB3htonHaVZ64w006niSsdbkfZBFU`
        
    );
    console.log("provider works");

    const contract = new ethers.Contract(contractAddress, transferABI, provider);
    
    contract.on("Transfer", (from, to, value,event) => {
        let info = {
            from: from,
            to: to,
            value: ethers.utils.formatUnits(value),
            data: event,
        };
        console.log('Transfer event:', info);
    });
}

main()