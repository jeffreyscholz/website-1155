import React, { Component } from 'react';
import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const styles = {
  width: '500px',
  backgroundColor: '#b5e900',
  height: '500px',
  alignItems: 'center',
  //backgroundColor:'#594c44',
  borderRadius: '25px',
  margin: '10px 10px 10px 10px'
};

const stylesAlreadyMinted = { 
  width: '500px',
  height: '500px',
  alignItems: 'center',
  margin: '10px 10px 10px 10px',
  borderRadius: '25px',
  backgroundColor: '#ffa3dd'

};

class NFTItem extends Component {

  intervalID;
  constructor(props) {
    super(props)
    this.state = {
      totalSupply: 'unknown',
      alreadyMinted: false,
      smartContract: this.props.smartContract,
      allocation: this.props.allocation,
      waitingForBlockchain: false,
      transactionHash: ''
    }

    this.mintButtonPressed = this.mintButtonPressed.bind(this);
    this.updateTokenSupply = this.updateTokenSupply.bind(this);
    this.buttonSection = this.buttonSection.bind(this);
  }

  componentWillUnmount() {
    /*
      stop getData() from continuing to run even
      after unmounting this component. Notice we are calling
      'clearTimeout()` here rather than `clearInterval()` as
      in the previous example.
    */
    clearTimeout(this.intervalID);
  }

  async updateTokenSupply() {
      const totalSupply = await this.props.smartContract.methods.tokenSupply(this.props.index).call();

      // returns 0,1 not bool
      const alreadyMinted = String(1) === String(await this.props.smartContract.methods.getAlreadyMintedToken(this.props.index, this.props.account).call());

      console.log(alreadyMinted)
      this.setState({totalSupply, alreadyMinted})
  }

  async mintButtonPressed(event) {

    this.setState({'waitingForBlockchain': true})
    const response = await this.state.smartContract.methods.mint(String(this.props.index)).send({
      from: this.props.account,
      value: "70000000000000000"
    });
    this.setState({'waitingForBlockchain': false})


    console.log(response);
    this.state.transactionHash = response["transactionHash"];
    console.log(this.state.transactionHash);
    this.setState({
      transactionHash: this.state.transactionHash
    })
    await this.updateTokenSupply()
  }

  async componentDidMount() {
    await this.updateTokenSupply()
    this.intervalID = setTimeout(this.updateTokenSupply.bind(this), 5000);
  }

  buttonSection() {
    if (this.state.alreadyMinted) {
      return <h4>You Already Minted This! <br/> View on OpenSea</h4>
    }

    if (String(this.state.totalSupply) === String(10)) {
      return <h4>All tokens sold out!</h4>
    }

    if (String(this.state.allocation) === String(0)) {
      console.log('hqwerqwf')
      return <h4>You don't have an allocation</h4>
    }

    if (this.state.waitingForBlockchain) {
      return <div>
        <p>waiting for the blockchain, please be patient...</p>
        <Loader type="TailSpin" color="#00BFFF" height={30} width={30}/>
      </div>
    }

    if (this.state.transactionHash !== '') {
      return <h4>Transaction Hash {this.state.transactionHash}</h4>
    }

    return <Button variant="outline-success" size="lg" onClick={this.mintButtonPressed}>Mint this for 0.07 ETH</Button>
  }
  
  render() {
    return (
      <div style={this.state.alreadyMinted ? stylesAlreadyMinted : styles}>
        <h2>{this.props.title}</h2>
        <div><img src={"https://bafybeihwsz7xdzphtbldeuclxsmjmijo7ghqm3l3sschz4r6kgxoxnvidy.ipfs.dweb.link/"+this.props.index+".png"} height='350px' width='350px'></img></div>
        <div><b>Total minted: {this.state.totalSupply} / 10</b></div>
        <div>
          {this.buttonSection()}
        </div>
      </div>
    );    
  }

}

export default NFTItem;
