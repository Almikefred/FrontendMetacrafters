import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/PaymentManager.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [mess, setMess] = useState("");
  const [bill, setBill] = useState("");
  const [genBill, setGenBill] = useState("");
  const [tip, setTip] = useState("");
  const [amount, setAmount] = useState("");
  const [id, setId] = useState("");
  const [billStatId, setBillStatId] = useState("");
  const [billMess, setBillMess] = useState("");
  const [curBill, setCurBill] = useState("");

  const contractAddress = "0x961b6Dd54942cFB672f68D0af8F0c84cb0281Aee";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  // Generating a Bill
  const handleGenerateBill = async () => {
    setMess("");
    setBillMess("");
    if (!bill && !tip) return;
    if (atm) {
      try {
        const tx = await atm.generateBill(bill, tip);
        await tx.wait();
        setBill("");
        setTip("");

        const billy = await atm.billAmount();
        const curent = await atm.billCounter();
        setGenBill(billy);
        setCurBill(curent);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  // Paying a Bill
  const handlePayBill = async () => {
    if (atm) {
      setGenBill("");
      setBillMess("");
      if (!id && !amount) return;
      try {
        const status = await atm.payBill(id, { value: amount });
        setId("");
        setAmount("");

        await status.wait();

        {
          status ? setMess("Payment Successful") : setMess("Payment Failed");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  //  Bill Status
  const gettingBillStats = async () => {
    setGenBill("");
    setMess("");
    if (!billStatId) return;
    if (atm) {
      try {
        const billStat = await atm.getBillStatus(billStatId);
        setBillStatId("");

        {
          billStat
            ? setBillMess("Bill Paid Successful")
            : setBillMess("Bill Payment Pending");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters Restaurant Payment Manager</h1>
      </header>
      <div className="user-interface">
        {!ethWallet && (
          <p className="connect-message">
            Please install MetaMask in order to use this ATM.
          </p>
        )}
        {ethWallet && !account && (
          <button className="connect-button" onClick={connectAccount}>
            Connect Metamask Wallet
          </button>
        )}
        {account && (
          <div className="con">
            <div className="c">
              <div className="message-section">
                <h2>Generate Bill</h2>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Amount"
                  value={bill}
                  onChange={(e) => setBill(Number(e.target.value))}
                />
                <br />
                <input
                  className="input-field"
                  type="text"
                  placeholder="tip"
                  value={tip}
                  onChange={(e) => setTip(Number(e.target.value))}
                />
                <br />
                <button className="action-button" onClick={handleGenerateBill}>
                  Generate
                </button>

                {genBill && (
                  <p className="message">{`Your bill is ${genBill}WEI and your bill ID is ${curBill}`}</p>
                )}
              </div>

              <div className="message-section">
                <h2>Pay Bill</h2>
                <input
                  className="input-field"
                  type="text"
                  placeholder="id"
                  value={id}
                  onChange={(e) => setId(Number(e.target.value))}
                />
                <br />
                <input
                  className="input-field"
                  type="text"
                  placeholder="bill"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <br />
                <button className="action-button" onClick={handlePayBill}>
                  Pay
                </button>
                <p className="message">{mess}</p>
              </div>
            </div>
            <div className="message-section">
              <input
                className="input-field"
                type="text"
                placeholder="id"
                value={billStatId}
                onChange={(e) => setBillStatId(Number(e.target.value))}
              />
              <br />
              <button className="action-button" onClick={gettingBillStats}>
                Get Bill Status
              </button>
              <p className="message">{billMess}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .con {
          display: flex;
          flex-direction: column;
        }

        .c {
          display: flex;
          flex-direction: row;
          gap: 100px;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        header {
          margin-bottom: 20px;
        }
        .connect-message {
          font-size: 18px;
          color: red;
          margin-bottom: 20px;
        }
        .connect-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .user-interface {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .message-section {
          margin-top: 20px;
        }
        .heading {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .input-field {
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 300px;
          font-size: 16px;
        }
        .action-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
        }
        .message {
          font-size: 18px;
          margin-top: 10px;
        }
      `}</style>
    </main>
  );
}
