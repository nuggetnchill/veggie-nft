import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

import './styles/App.css';
import myEpicNft from './utils/MyEpicNFT.json'

// Constants
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  //Check if Metamask is available
  const checkIfWalletIsConnect = async () => {
    const {ethereum} = window;
    if (!ethereum){
      console.log('Do you have Metamask?')
      return;
    } else {
      console.log('Ethereum obj identified', ethereum)
    }

    const accounts = await ethereum.request({ method: 'eth_accounts'});

    if (accounts.length !== 0){
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
        console.log('No authorized account found');
    }
  }
  // Connect Wallet duh!!!
  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum){
        alert('Please get Metamask bruv')
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected to account: ", accounts[0])
      setCurrentAccount(accounts[0]);

    } catch (error) {
        console.log(error)
    }
  }

  // Ask Contract to Mint NFT
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0x73f0973Baf2224248E29F6f17943188F356d73F4";
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
  
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT();
  
          console.log("Mining...please wait.")
          await nftTxn.wait();
          
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
  
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
  }

  const renderNotConnectedContainer = () => (
    <button 
      onClick={connectWallet}
      className="cta-button connect-wallet-button">
        Connect to Wallet
    </button>
  );

  // This runs when page loads
  useEffect (() => {
    checkIfWalletIsConnect();

  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? (
              renderNotConnectedContainer()
            ) : (
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button" >Mint NFT</button>
            )
          }

        </div>
      </div>
    </div>
  );
};

export default App;
