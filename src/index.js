// Contract details
const contractAddress = '0xEf8EA51aF4cb4e441d56Fc7938a1D4D303F6Ec1a';
const contractABI = [{"inputs":[{"internalType":"string[]","name":"candNames","type":"string[]"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"philsys_id","type":"string"},{"indexed":false,"internalType":"string","name":"candidate","type":"string"}],"name":"VoteCasted","type":"event"},{"inputs":[],"name":"COMELEC","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"Government","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_id","type":"string"},{"internalType":"string","name":"candNames","type":"string"}],"name":"Vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"candNames","type":"string"}],"name":"allVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"count","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"master_list","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_id","type":"string"},{"internalType":"bool","name":"fingerprint","type":"bool"},{"internalType":"bool","name":"_valid","type":"bool"},{"internalType":"bool","name":"_eligible","type":"bool"}],"name":"registerVoter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"voter","outputs":[{"internalType":"bool","name":"fingerprint_registered","type":"bool"},{"internalType":"bool","name":"data_valid","type":"bool"},{"internalType":"bool","name":"eligible","type":"bool"},{"internalType":"bool","name":"has_voted","type":"bool"}],"stateMutability":"view","type":"function"}];

let web3;
let contract;
let account;

// Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('registerVoter').addEventListener('click', registerVoter);
    document.getElementById('castVote').addEventListener('click', castVote);
    
    initializeWeb3();
});

async function initializeWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = (await web3.eth.getAccounts())[0];
            document.getElementById('walletAddress').textContent = `Connected: ${account}`;
            initializeContract();
            checkCOMELEC();
            loadCandidates();
            updateResults();
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

function initializeContract() {
    contract = new web3.eth.Contract(contractABI, contractAddress);
}

async function checkCOMELEC() {
    const com = await contract.methods.COMELEC().call();
    if (com.toLowerCase() === account.toLowerCase()) {
        document.getElementById('comelecSection').style.display = 'block';
    }
}

async function loadCandidates() {
    const candidates = await contract.methods.master_list().call();
    const select = document.getElementById('candidates');
    select.innerHTML = candidates.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('votingSection').style.display = 'block';
}

async function registerVoter() {
    const voterId = document.getElementById('voterId').value;
    try {
        await contract.methods.registerVoter(
            voterId,
            true,  // fingerprint registered
            true,  // data valid
            true   // eligible
        ).send({ from: account });
        alert('Voter registered successfully!');
    } catch (error) {
        console.error('Registration error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function castVote() {
    const voterId = document.getElementById('voterIdVote').value;
    const candidate = document.getElementById('candidates').value;
    
    try {
        await contract.methods.Vote(
            voterId,
            candidate
        ).send({ from: account });
        alert('Vote cast successfully!');
        updateResults();
    } catch (error) {
        console.error('Voting error:', error);
        alert(`Error: ${error.message}`);
    }
}

async function updateResults() {
    const resultsList = document.getElementById('resultsList');
    const candidates = await contract.methods.master_list().call();
    
    resultsList.innerHTML = await Promise.all(candidates.map(async (candidate) => {
        const count = await contract.methods.allVotes(candidate).call({ from: account });
        return `<li>${candidate}: ${count}</li>`;
    })).then(items => items.join(''));
}

// Periodically update results
setInterval(updateResults, 10000);