import Web3 from 'web3';
import contractABI from './contractABI.json'; // Import the contract ABI

const contractAddress = "0xEf8EA51aF4cb4e441d56Fc7938a1D4D303F6Ec1a"; // Your contract address

let web3 = new Web3(window.ethereum);
let contract = new web3.eth.Contract(contractABI, contractAddress);

// Connect to MetaMask
async function connectWallet() {
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

// Handle QR Code Scan
function onScanSuccess(decodedText, decodedResult) {
    try {
        const jsonData = JSON.parse(decodedText); // Assuming the QR code contains JSON data

        // Extract relevant data from the scanned QR code (adjust this based on your JSON structure)
        const scannedPCN = jsonData?.subject?.PCN || "N/A";
        const name = jsonData?.subject?.fName + " " + jsonData?.subject?.lName;
        const dob = jsonData?.subject?.DOB || "N/A";
        const pob = jsonData?.subject?.POB || "N/A";

        // Register the data on the blockchain
        registerVoter(scannedPCN, name, dob, pob);
    } catch (e) {
        console.error("Error parsing QR code data:", e);
    }

    // Stop scanning after a successful scan (optional)
    html5QrcodeScanner.clear();
}

// Function to register voter details in the smart contract
async function registerVoter(scannedPCN, name, dob, pob) {
    // Get the connected wallet address
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        // Call the contract's registerVoter function
        await contract.methods.registerVoter(scannedPCN, name, dob, pob).send({ from: account });
        console.log('Voter registered successfully!');
    } catch (error) {
        console.error('Error registering voter:', error);
    }
}

// Initialize the QR scanner
let html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
});

// Render the QR scanner with the success handler
html5QrcodeScanner.render(onScanSuccess);

// Connect the wallet when the button is clicked
document.getElementById("walletAddress").addEventListener("click", connectWallet);