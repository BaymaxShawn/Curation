import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import usdtAbi from "./abi/usdt.json";

function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState(null);
  const [eventLogs, setEventLogs] = useState([]);
  const [btnHide, setBtnHide] = useState(false);

  const listenToEvents = () => {
    const contract = new ethers.Contract('0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',usdtAbi, signer);

    // Listen for all Transfer events
    contract.on("Transfer", (from, to, tokenId,event) => {
      let data = {
        from,
        to,
        tokenId: tokenId.toString(),
        event,
      };
      setEventLogs((oldState) => [...oldState, data]);
    });

    // Listen for all Approval events
    // contract.on("Approval", ( owner, spender, tokenId, event) => {
    //   let data = {
    //     owner,
    //     spender,
    //     tokenId: tokenId.toString(),
    //     event,
    //   };
    //   setEventLogs((oldState) => [...oldState, data]);
    // });

    setBtnHide(true);
  };


  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      setAccount(accounts[0]);
      listenToEvents();
    } else {
      console.log("Please install metamask.");
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
          onClick={() => listenToEvents()}
        >
          Get Event
        </button>
        {eventLogs.reverse().map((event, index) => {
          return (
            <div key={index} className="container">
              <p>From: {event.from}</p>
              <p>{'===>'}</p>
              <p>To: {event.to}</p>
              <p>TokenId: {event.tokenId}</p>
            </div>

            // <div key={index} className="container">
            //   <p>From: {event.owner}</p>
            //   <p>{'===>'}</p>
            //   <p>To: {event.spender}</p>
            //   <p>TokenId: {event.tokenId}</p>
            // </div>

          )
        }
      )}
      </div>
    </div>
  );
}

export default App;


