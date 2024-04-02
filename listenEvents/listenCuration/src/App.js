import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import curateAbi from "./abi/curate.json";
// import usdtAbi from "./abi/usdt.json";

function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [eventLogs, setEventLogs] = useState([]);
  const [btnHide, setBtnHide] = useState(false);
  const [listeningMessage, setListeningMessage] = useState("");


  const listenToEvents = () => {
    if (!signer) return;

    const provider = signer.provider;
    if (!provider) return;

    const contract = new ethers.Contract('0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8', curateAbi, signer);

    // Listen for new Curation events
    contract.on('Curation(address,address,address,string,uint256)', (from, to, token, uri, amount, event) => {
      console.log('Received Curation event with token');
      let data = {
        from,
        to,
        token,
        uri: uri.toString(),
        amount,
        event,
      };
      setEventLogs((oldState) => [...oldState, data]);
    });

    contract.on('Curation(address,address,string,uint256)', (from, to, uri, amount, event) => {
      console.log('Received Curation event without token');
      let data = {
        from,
        to,
        uri: uri.toString(),
        amount,
        event,
      };
      setEventLogs((oldState) => [...oldState, data]);
    });

    setListeningMessage('Listening for new Curation events...');
    setBtnHide(true);
  };

  const fetchRecentEvents = async () => {
    try {
      if (!signer) return;

      const provider = signer.provider;
      if (!provider) return;

      console.log("Provider connected:", provider);

      const contractAddress = "0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8";
      const contract = new ethers.Contract(contractAddress, curateAbi, provider);

      const filter = {
        address: contractAddress,
        fromBlock: 0, 
        toBlock: "latest", 
      };

      const events = await contract.queryFilter(filter);
      const recentEvents = events.slice(-10); 
      console.log("Recent events:", recentEvents);

      const formattedEvents = recentEvents.map((event) => ({
        from: event.args[0],
        to: event.args[1],
        token: event.args[2],
        uri: event.args[3],
        amount: event.args[4],
        event: event.event,
      }));

      setEventLogs(formattedEvents.reverse());
      setBtnHide(true);
    } catch (error) {
      console.error("Error fetching recent events:", error);
    }
  };

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        setAccount(accounts[0]);
        fetchRecentEvents();
      } catch (error) {
        console.error("Error connecting:", error);
      }
    } else {
      console.log("Please install MetaMask.");
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="page">
      <Header connect={connect} account={account} />
      <div className="main">
        <br />
        <button
         style={{ display: btnHide ? "none" : null }}
          className="button"
          onClick={() => {
            listenToEvents();
            console.log('Listening for new Curation events...');
          }}
        >
          Get Event
        </button>
        {listeningMessage && <p>{listeningMessage}</p>}
        {eventLogs.map((event, index) => (
          <div key={index} className="container">
            <p>From: {event.from}</p>
            <p>{'===>'}</p>
            <p>To: {event.to}</p>
            <p>Amount: {event.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
