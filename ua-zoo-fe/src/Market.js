import { util } from './utils/util';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

const nftContractName = 'ua-zoo-prj.klyve-hack.testnet';
const marketContractName = 'market.klyve-hack.testnet';

const ONE_NEAR = 1000000000000000000000000;

async function buyNft(token_id) {
  console.log(token_id)
  const amount = util.getSaleMap()[token_id]['price'].toLocaleString('fullwide', { useGrouping: false })
  await util.call(marketContractName, 'nft_buy', [{"nft_contract_id":nftContractName, "token_id": token_id}, "300000000000000", amount])
}

async function toSale(tokenId, price) {
  const amount = (5 * ONE_NEAR).toLocaleString('fullwide', { useGrouping: false })
  const args = {"token_id": tokenId,"account_id": marketContractName, "msg":"{\"market_type\":\"sale\",\"price\":\"" + amount + "\"}"};
  await util.call(nftContractName, 'nft_approve', [args, "300000000000000", amount])
}

async function connectMarket() {
  const marketViewNftMethods = ['get_sales_by_nft_token_type','get_sales_by_nft_contract_id']
  const marketChangeNftMethods = ['nft_buy']
  await util.connectContract(marketContractName, marketViewNftMethods, marketChangeNftMethods)
}

async function connectNftContract() {
  const viewNftMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeNftMethods = ['nft_approve']
  await util.connectContract(nftContractName, viewNftMethods, changeNftMethods)
}

async function listMarket(setContractNfts) {
  await connectMarket()
  const saleList = await util.call(marketContractName, 'get_sales_by_nft_contract_id', [{ "nft_contract_id": nftContractName, "from_index":"0","limit":10000 }])
  for (let s of saleList) {
    util.getSaleMap()[s.token_id] = s;
  }
  console.log('saleList', saleList)
  await connectNftContract()
  const showSales = await util.call(nftContractName, 'nft_tokens', [{"from_index":"0", "limit": 10000}])
  setContractNfts(showSales)
}

async function initPage(setContractNfts, setConnected) {
  setConnected(util.isConnected())
  listMarket(setContractNfts)
}

export default function Market() {

  const [connected, setConnected] = useState(false);
  const [contractNfts, setContractNfts] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (util.getWallet().isSignedIn()) {
      initPage(setContractNfts, setConnected)
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
                  setContractNfts([])
              }}>"Disconnect" 
            </Button>
          }
        </nav>
      </div>

      <div className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div className={connected ? "d-flex flex-row" : "d-flex flex-column"}>
          <h2 style={{color: "teal"}}>Near Hack (klyve)</h2>
          {connected ? <>&nbsp;&nbsp;</> : <></>}
          <div>
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
        <div style={{width:"60%"}} >
          <div className="border border-secondary">
            <div className="row">
              <div className="col-12" style={{fontSize:"16px", textAlign: "left"}}>
                <p> Purchase the Ukraine Zoo NFT here.</p>
                <p>70% of the first sale will go to the Ukraine-Zoo-DAO.</p>
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
          <div className="border border-secondary">
            <div>
              Market Sales
            </div>
            <div className="row">      
              { contractNfts.length > 0 && contractNfts.map((n, i) => {
                return ( 
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <div className="card d-flex justify-content-around" key={'nft-card' + i}>
                      <img className="card-img-top" alt="Card image cap" src={n.metadata.media} key={'nft' + i}></img>
                      <div className="card-body">
                        <h5 className="card-title text-primary">{n.metadata.title}</h5>
                        {/* <small className="card-text text-secondary">{n.metadata.description}</small> */}
                      </div>
                    </div>
                    {n.owner_id == util.getWallet().getAccountId() ? ( util.getSaleMap()[n.token_id] ? <p>Your sale</p> 
                        : <Button variant="alert alert-success" onClick={(e)=>{ toSale(n.token_id)}}>Sale</Button>) 
                        : util.getSaleMap()[n.token_id] && <Button variant="alert alert-success" onClick={(e)=>{ buyNft(n.token_id)}}> Buy it</Button> }
                  </div>)
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}