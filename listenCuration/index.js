
import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "oS8WB3htonHaVZ64w006niSsdbkfZBFU",
    network: Network.OPT_MAINNET,
};

const alchemy = new Alchemy(settings);
console.log('hello world');
// Get the latest block
const latestBlock = alchemy.core.getBlockNumber();

// Get all outbound transfers for a provided address
alchemy.core
    .getTokenBalances('0x994b342dd87fc825f66e51ffa3ef71ad818b6893')
    .then(console.log);

// Get all the NFTs owned by an address
const nfts = alchemy.nft.getNftsForOwner("vitalik.eth");

// Listen to all new pending transactions
alchemy.ws.on(
    { method: "alchemy_pendingTransactions",
    fromAddress: "vitalik.eth" },
    (res) => console.log(res)
);