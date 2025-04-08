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
const contractAddress = "0x463684351D52807786da4d4746773dCB45bEEbDF";
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
async function registerVoter() {
    const voterId = document.getElementById('voterId').value;
    const fingerprint = document.getElementById('fingerprint').checked;
    const valid = document.getElementById('valid').checked;
    const eligible = document.getElementById('eligible').checked;

    try {
        await contract.methods.registerVoter(voterId, fingerprint, valid, eligible).send({ from: account });
        alert("Voter registered successfully!");
    } catch (error) {
        console.error("Error registering voter:", error);
    }
}
function setConnected(account) {
    document.getElementById('connectWallet').textContent = `Connected: ${account}`;
}
document.getElementById("connectWallet").addEventListener("click", connectWallet);