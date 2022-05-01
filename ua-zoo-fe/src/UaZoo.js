import { util } from './utils/util';
import axiosUtil from './utils/axiosUtil';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUploader from './ImageUploader';

Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

let nfts = {}
let nftContractName = 'klyve-hack-nft2.klyve-hack.testnet';

const ONE_NEAR = 1000000000000000000000000;

async function mintByNear(amount) {
  const walletId = util.getWallet().getAccountId()
  const yoctoAmount = (amount * 1000000000000000000000000).toLocaleString('fullwide', { useGrouping: false })
  const num = Math.floor((Math.random() * 100)) % 4
  console.log('rand num', num)
  await util.call(nftContractName, 'nft_mint_pay_by_rand', [{ account_id: walletId, num: num }, "300000000000000", yoctoAmount])
}

async function connectNFtContract() {
  const viewMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeMethods = ['nft_mint_pay', 'nft_mint_by_ft', 'nft_mint_by_ft_rand', 'nft_mint_pay_by_rand']
  await util.connectContract(nftContractName, viewMethods, changeMethods)
}


async function handleLikelyNFTs(setShowNfts) {
  const nftContracts = await util.getLikelyNFTs()
  var filtered = nftContracts.filter(function(value, index, arr){ 
    return value !== nftContractName;
  });
  filtered = [nftContractName, ...filtered]
  const viewNftMethods = ['nft_total_supply', 'nft_tokens', 'nft_supply_for_owner', 'nft_tokens_for_owner']
  const changeNftMethods = []
  const walletId = util.getWallet().getAccountId()
  for (var c of filtered) {
    await util.connectContract(c, viewNftMethods, changeNftMethods)
    nfts[c] = await util.call(c, 'nft_tokens_for_owner', [{ account_id: walletId }])
  }
  let show = []
  for (var prop in nfts) {
    show = [...show, ...nfts[prop]]
  }
  setShowNfts(show)
}

async function initPage(setShowNfts, setConnected) {
  setConnected(util.isConnected())
  handleLikelyNFTs(setShowNfts)
  await connectNFtContract()
}

const onUploadToServer = (image, succResHandler)=>{
  axiosUtil.postImage('/api/uploadImage', {"image": image}, succResHandler)
}


export default function ShowNFTs() {

  const [connected, setConnected] = useState(false);
  const [showNfts, setShowNfts] = useState([]);
  const [messages, setMessages] = useState(['Please upload and mint it']);

  useEffect(() => {
    console.log(util.getWallet())
    console.log(util.isConnected())
    if (util.getWallet().isSignedIn()) {
      initPage(setShowNfts, setConnected)
    }
  }, [connected])
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <div className={connected ? "d-flex flex-row" : "d-flex flex-column"}>
        <h2 style={{color: "teal"}}>Near Hack (klyve)</h2> 
          {connected ? <>&nbsp;&nbsp;</> : <></>}
          <div>
            <Button variant="alert alert-success" id="btn" 
              onClick={()=> {
                if (!connected) {
                  util.signIn();
                } else {
                  util.signOut()
                  setConnected(false)
                  setShowNfts([])
                }
              }}>{!connected ? "Sign In": "Disconnect" }
            </Button>
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

                  {/* <div className="col-md-4 col-sm-12">
                    <Button variant="alert alert-success" id="mint" onClick={()=> {
                      mintByNear(amountToMint)
                    }}>Mint By Near</Button>
                  </div> */}
                  <div className="col-md-8 col-sm-12">
                    {/* <small style={{fontSize:"20px"}} >
                      use
                      <input style={{width: "50px", textAlign: "center"}} type="text" value={amountToMint} onChange={(e)=>{setAmountToMint(e.target.value)}}/>
                      N to mint 
                    </small>  */}
                  </div>
                  <div className="col-12" style={{fontSize:"16px", textAlign: "left"}}>
                    <small>
                     This is a website to create an NTF collection for Ukraine Zoo animals.
                     Below is the utility to upload the pic,
                     and the pic will transfer to secondary market for sale.<br/>
                     The 70 % of the price of the first sale will getting into the UA Zoo DAO Fund,
                     25 % will reward the picture provider,
                     and the rest amount will pay as the transaction fee to the contract itself.
                    </small>
                  </div>
                  <br/>
                </div>
              </div>
              <div className="border border-secondary">
                <div className="row">
                  <div className="col-12" style={{fontSize: "16px", textAlign: "left"}}>
                    {messages.map((msg, i) =>{
                      return (<><small style={{wordBreak: "break-all", fontSize: "16px", textAlign: "left"}}>{i+1}. {msg}</small><br/></>)
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
                          <p className="card-text text-secondary">{n.metadata.description}</p>
                          {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                        </div>
                      </div>
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