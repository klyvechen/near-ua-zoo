import { util } from './utils/util';
import { Link } from "react-router-dom";
import './App.css';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUploader from './ImageUploader';

Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

let nftContractName = 'ua-zoo-prj.klyve-hack.testnet';
let marketContractName = 'market.klyve-hack.testnet';

const ONE_NEAR = 1000000000000000000000000;

// ear call ua-zoo-prj.klyve-hack.testnet nft_approve '{"token_id":"1","account_id":"market.klyve-hack.testnet",
// "msg":"{\"token_type\":\"\",\"sale_conditions\":{}}"}' --accountId klyve-hack.testnet --deposit 1
async function toSale(tokenId, price) {
  const amount = (5 * ONE_NEAR).toLocaleString('fullwide', { useGrouping: false })
  const args = {"token_id": tokenId,"account_id": marketContractName, "msg":"{\"market_type\":\"sale\",\"price\":\"" + amount + "\"}"};
  await util.call(nftContractName, 'nft_approve', [args, "300000000000000", amount])
}

async function storageDeposit() {
  const depositStorageAmount = (0.025 * ONE_NEAR).toLocaleString('fullwide', { useGrouping: false });
  await util.call(marketContractName, 'storage_deposit', [{}, "300000000000000", depositStorageAmount])
}

async function checkNeedStorageDeposit() {
  const walletId = util.getWallet().getAccountId()
  const storageBalance = await util.call(marketContractName, 'storage_balance_of', [{ account_id: walletId }])
  const storageMinimumBalance = await util.call(marketContractName, 'storage_minimum_balance', [{}])
  return storageBalance - storageMinimumBalance < 0;
}

async function connectNftContract() {
  const viewNftMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeNftMethods = ['nft_approve']
  await util.connectContract(nftContractName, viewNftMethods, changeNftMethods)
}

async function connectMarket() {
  const marketViewNftMethods = ['get_sales_by_nft_token_type','storage_balance_of', 'storage_minimum_balance']
  const marketChangeNftMethods = ['storage_deposit']
  await util.connectContract(marketContractName, marketViewNftMethods, marketChangeNftMethods)
}


async function handleLikelyNFTs(setShowNfts) {
  const nftContracts = await util.getLikelyNFTs()
  var filtered = nftContracts.filter(function(value, index, arr){ 
    return value !== nftContractName;
  });
  filtered = [nftContractName, ...filtered]
  const walletId = util.getWallet().getAccountId()
  const nftList = await util.call(nftContractName, 'nft_tokens_for_owner', [{ account_id: walletId }])
  console.log(nftList)
  setShowNfts(nftList)
}

async function initPage(setShowNfts, setConnected, setNeedStorageDeposit) {
  await connectNftContract()
  await connectMarket()
  setConnected(util.isConnected())
  handleLikelyNFTs(setShowNfts)
  const needDS = await checkNeedStorageDeposit();
  setNeedStorageDeposit(needDS)
}

export default function ShowNFTs() {

  const [connected, setConnected] = useState(false);
  const [showNfts, setShowNfts] = useState([]);
  const [messages, setMessages] = useState(['Please upload and mint it']);
  const [needStorageDeposit, setNeedStorageDeposit] = useState(false);

  useEffect(() => {
    console.log(util.getWallet())
    console.log(util.isConnected())
    if (util.getWallet().isSignedIn()) {
      initPage(setShowNfts, setConnected, setNeedStorageDeposit)
    }
  }, [connected])
  return (
    <div className="App">
      <div className="container" style={{width:"60%"}}>
        <nav className="navbar navbar-expand-lg">
          <div className="d-flex flex-row">
            <Link className="navbar-brand" to="/market"><h4>market</h4></Link>
            <Link className="navbar-brand" to="/mint"><h4>mint</h4></Link>
          </div>
          {connected &&
            <Button variant="alert alert-success" id="btn" 
              onClick={()=> {
                  util.signOut()
                  setConnected(false)
                  setShowNfts([])
              }}>"Disconnect" 
            </Button>
          }
        </nav>
      </div>
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div className={connected ? "d-flex flex-row" : "d-flex flex-column"}>
        <h2 style={{color: "teal"}}>Near Hack (klyve)</h2> 
          <div>
            {connected ? <>&nbsp;&nbsp;</> : <></>}
            {!connected &&             
              <Button variant="alert alert-success" id="btn" 
                onClick={()=> {
                    util.signIn();    
                }}>"Sign In"  
              </Button>
            }
          </div>
        </div> 
        <div>
          {!connected ? 
            <div className="container">
              <small className="text-muted">
                Try to sign in 
              </small>
            </div>
            :
            <p>Welcome <strong style={{color: "silver"}}>{util.getWallet().getAccountId()}</strong> ! You are connected!</p>
          }
        </div>
        <h3>UA Zoo Project</h3> 
        {connected &&
          <div style={{width:"60%"}} >
            <div className="border border-secondary">
              <div className="border border-secondary">
                <div className="row">
                  <div className="col-12" style={{fontSize:"16px", textAlign: "left"}}>
                    <p>
                     This is a website to create an NTF collection for Ukraine Zoo animals.
                     Below is the utility to upload the pic,
                     and the pic will transfer to secondary market for sale.</p>
                    <p>
                     The 70 % of the price of the first sale will getting into the UA Zoo DAO Fund,
                     25 % will reward the picture provider,
                     and the rest amount will pay as the transaction fee to the contract itself.
                    </p>
                    <p>
                      If you are the first time to attend the project, you need to click the start,
                      after you mint your first nft from the site. 
                    </p>
                    <p>donation from the royolty is under processing.</p>
                    <p>
                      The ua-zoo-dao.testnet is the testing dao wallet which will received the 70% sales,
                      You can check them by using the mnemonic phrase to check the fun has been in:
                    </p>
                    <p>
                      bag swallow shed forest same useless era auto knee catalog breeze chef
                    </p>
                  </div>
                  <br/>
                </div>
              </div>
              <div className="border border-secondary">
                <div className="row">
                  <div className="col-12" style={{fontSize: "16px", textAlign: "left"}}>
                    {messages.map((msg, i) =>{
                      return (<><small key={"msg-" + i} style={{wordBreak: "break-all", fontSize: "16px", textAlign: "left"}}>{i+1}. {msg}</small><br/></>)
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ImageUploader messages={messages} setMessages={setMessages}></ImageUploader>
            </div>
            <div className="border border-secondary">
              <div>
                Your currnet NFTs
              </div>
              <div className="row">      
                { showNfts.length > 0 && showNfts.map((n, i) => {
                  return ( 
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="card d-flex justify-content-around" key={'nft-card' + i}>
                        <img className="card-img-top" alt="Card image cap" src={n.metadata.media} key={'nft' + i}></img>
                        <div className="card-body">
                          <h5 className="card-title text-primary">{n.metadata.title}</h5>
                          {/* <small className="card-text text-secondary">{n.metadata.description}</small> */}
                          {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                      </div>
                      {needStorageDeposit ? 
                        <Button variant="alert alert-success" onClick={(e)=>{ storageDeposit()}}>Start</Button> :
                        <Button variant="alert alert-success" onClick={(e)=>{ toSale(n.token_id)}}>Sale</Button>
                      }
                    </div>)
                })}
              </div>
            </div>
          </div>
        }

      </header>
    </div>
  );
}