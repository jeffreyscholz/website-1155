import React, { Component } from 'react';
import './App.css';
import NFTItem from './NFTItem.js'

import Web3 from 'web3';
import {ADDRESS, CONTRACT_ABI} from './config';
import 'bootstrap/dist/css/bootstrap.min.css';


const titles = [
  "The one",
  "The two",
  "The three",
  "The four",
  "The five",
  "The six",
  "The seven",
  "The eight",
  "The nine",
  "The ten",
  "The eleven",
  "The twelve",
  "The thirteen",
  "The fourteen",
  "The fifteen"];

const styles = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  background: "linear-gradient(#730000, #ff5e00)"
};

class App extends Component {

  constructor() {
    super()
    this.state = {
      'metamask': 'checking',
      'allocation': 0,
      'mintedSoFar': 'unknown'
    }
  }

  async componentDidMount() {
    if (!window.web3) {
      console.log('no web3')
      this.setState({
        'metamask': 'none'
      })
    }
    else {

      const web3 = new Web3(Web3.givenProvider);
      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts();

      this.setState({
        'account': accounts[0],
        'metamask': 'available'
      })

      const smartContract = new web3.eth.Contract(CONTRACT_ABI, ADDRESS);

      const allocation = await smartContract.methods.getMintLimit(accounts[0]).call();
      const mintedSoFar = await smartContract.methods.getAddressToAmountMintedSoFar(accounts[0]).call();
      this.setState({allocation, mintedSoFar})


      this.setState({
        metamask: 'available',
        smartContract: smartContract
      });
      console.log(this.state.smartContract)
    }
  }

  render() {

    let indents = [];
    if (this.state.metamask === 'available' && this.state.smartContract) {
      for (let i = 0; i < 15; i++) {
        indents.push(<NFTItem key={i} 
                              smartContract={this.state.smartContract} 
                              account={this.state.account} 
                              title={titles[i]}
                              allocation={this.state.allocation}
                              index={i}/>);
      }
    }

    return (
      <div className="App">
        <div style={{textAlign: 'center'}}>
          <h1 style={{fontFamily:"Luminari", fontSize:100}}><b>The Uninvited 🎃</b></h1>
          <hr/>
          <h3 style={{fontFamily: "URW Chancery L"}}><i>Brought to you by <span>Dan Segala Macan</span></i></h3>
          {this.state.metamask !== 'none' ? 
            <div>
              <p>Your wallet address is <b style={{color: "#09ff00"}}>{this.state.account}</b></p>
              <p>You have <b style={{color: "#09ff00"}}>{this.state.allocation}</b> allocation for this collection</p>
              <p>You have minted <b style={{color: "#09ff00"}}>{this.state.mintedSoFar}</b> so far</p>

              <p>After you mint, go to your opensea page to view your NFT!</p>
            </div>
            :
            <div>
              <p>You need to install metamask!</p>
            </div>
          }
        </div>

        <div>
          <div style={styles}>{indents}</div>
        </div>
      </div>
    );    
  }
}

export default App;
