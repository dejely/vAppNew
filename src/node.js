import contractABI from './contractABI.json';

const contractAddress = "0xEf8EA51aF4cb4e441d56Fc7938a1D4D303F6Ec1a"

let web3 = new Web3(window.ethereum);

let contract = new web3.eth.Contract(contractABI, contractAddress);

async function connectWallet(){
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            
            console.log('Connected:', account);
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
        setConnected(accounts[0]);
    }

}

document
  .getElementById("walletAddress")
  .addEventListener("click", connectWallet);