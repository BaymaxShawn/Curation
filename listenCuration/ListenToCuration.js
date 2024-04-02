const { ethers } = require("ethers");
const curationABI = require("./curationAbi.json");
require("dotenv").config();

async function main() {
    const contractAddress = "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8";
    
    const alchemyApiKey = process.env.ALCHEMY_API_KEY;

    if (!alchemyApiKey) {
        console.error("Alchemy API key is missing.");
        return;
    }else(
        console.log("Alchemy API key is present.")
    )

    const provider = new ethers.WebSocketProvider(
        `wss://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
        
    );
    console.log("provider works");

    const latestBlockNumber = await provider.getBlockNumber();
    

    const contract = new ethers.Contract(contractAddress, curationABI, provider);
    
    // contract.on("Curation", (from, to, uri,token, amount) => {

    //     let info = {
    //         from: from,
    //         to: to,
    //         uri: uri,
    //         token: token,
    //         amount: amount,
    //     };
    //     console.log(JSON.stringify(info, null, 4));
    // });

    contract.on("*",  { fromBlock: latestBlockNumber }, (eventName, ...args)=> {
        if (eventName === "Curation") {  
            if (args.length === 5) {
                const [from, to, uri, token, amount] = args;
                console.log("Curation event with token:", { from, to, uri, token, amount });
            } else if (args.length === 4) {
                const [from, to, uri, amount] = args;
                console.log("Curation event without token:", { from, to, uri, amount });
            }
        }
    });
}

main()