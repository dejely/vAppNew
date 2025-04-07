const contractABI = [{"inputs":[{"internalType":"string[]","name":"candNames","type":"string[]"}],"stateMutability":"nonpayable","type":"constructor"},
{
    "anonymous": false, 
    "inputs": [{
        "indexed": false, 
        "internalType": "string", 
        "name": "philsys_id", 
        "type": "string"
    }, {
        "indexed": false, 
        "internalType": "string", 
        "name": "candidate", 
        "type": "string"
    }], 
    "name": "VoteCasted", 
    "type": "event"
}, 
{
    "inputs": [], 
    "name": "COMELEC", 
    "outputs": [{
        "internalType": "address", 
        "name": "", 
        "type": "address"
    }], 
    "stateMutability": "view", 
    "type": "function"
}];

const contractAddress = "0xEf8EA51aF4cb4e441d56Fc7938a1D4D303F6Ec1a";
let web3 = new Web3(window.ethereum);
let contract = new web3.eth.Contract(contractABI, contractAddress);

async function connectWallet() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.length > 0) {
            const account = accounts[0];
            setConnected(account);
            checkCOMELEC(account);
        }
    } else {
        console.error("No web3 provider detected");
    }
}

async function checkCOMELEC(account) {
    const com = await contract.methods.COMELEC().call();

    if (com.toLowerCase() === account.toLowerCase()) {
        document.getElementById('comelecSection').style.display = 'block';
    }
}

function setConnected(account) {
    document.getElementById('connectWallet').textContent = `Connected: ${account}`;
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
