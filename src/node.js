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

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
  }

  // Request account access
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0]; // Get the first connected account

  // Define contract details
  const contractAddress = '0x92EA8EB987A61E517663F78EF8cf43B3986eCf50'; // Replace with your contract address
  const contractABI = [
      // Add your contract ABI here
      {
          "inputs": [
              { "internalType": "string", "name": "_id", "type": "string" },
              { "internalType": "bool", "name": "fingerprint", "type": "bool" },
              { "internalType": "bool", "name": "_valid", "type": "bool" },
              { "internalType": "bool", "name": "_eligible", "type": "bool" }
          ],
          "name": "registerVoter",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      }
  ];

  // Initialize web3 and contract instance
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  // Add event listener for the "Register Voter" button
  document.getElementById('registerVoter').addEventListener('click', async () => {
      const id = document.getElementById('voterId').value; // Get the voter ID from the input field
      if (!id) {
          alert('Please enter a Voter ID.');
          return;
      }

      try {
          document.getElementById('regbut').textContent = 'Registering voter... Please wait.';
          const regVote = await contract.methods.registerVoter(
              id,
              true, // Indicates that the voter's fingerprint is verified
              true, // Biometric data verified
              true  // Eligibility
          ).send({ from: account });

          document.getElementById('regbut').textContent = 'Voter registered successfully!';
      } catch (error) {
          console.error('Error registering voter:', error);
          document.getElementById('regbut').textContent = 'Failed to register voter.';
      }
  });
});

function setConnected(account) {
    document.getElementById('connectWallet').textContent = `Connected: ${account}`;
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);


