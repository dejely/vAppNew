function compareCredentials(scannedPCN) {
    fetch('people.json')
        .then(response => response.json())
        .then(people => {
            const found = people.find(person => String(person.philsys_id) == String(scannedPCN.replace(/-/g, '')));

            if (found) {
                document.getElementById("output").innerText +=
                    `\n\n✅ Match found: ${found.name}`;
            } else {
                document.getElementById("output").innerText +=
                    `\n\n❌ No match found for PCN: ${scannedPCN}`;
            }
        })
        .catch(error => {
            console.error("Error loading people.json:", error);
            document.getElementById("output").innerText +=
                "\n\n⚠️ Error loading people data.";
        });
}

function onScanSuccess(decodedText, decodedResult) {
    try {
        const jsonData = JSON.parse(decodedText);
        const scannedPCN = jsonData?.subject?.PCN || "N/A";

        const id = jsonData.PCN || "N/A";
        
        compareCredentials(scannedPCN);

    } catch (e) {
        console.error("Scanned data is not valid JSON:", e);
        document.getElementById("output").innerText = "Invalid JSON in QR code.";
    }

    html5QrcodeScanner.clear();
}



let html5QrcodeScanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250
});

html5QrcodeScanner.render(onScanSuccess);

const html5QrCode = new Html5Qrcode("reader");

html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    async (decodedText, decodedResult) => {
        try {
            


            const userData = JSON.parse(decodedText);
            const scannedPCN = userData?.subject?.PCN || "N/A";
            const name = userData?.subject?.fName + " " + userData?.subject?.lName;
            
            const response = await fetch("people.json");
            const people = await response.json();

            const found = people.find(person => String(person.philsys_id) == String(scannedPCN.replace(/-/g, '')));

            if (found.fingerprint_registered && found.data_valid && found.qualified_to_vote && found.has_voted) {
                await sendToBlockchain(userData);
            } 
        
            console.log("Scanned Data:", userData);
            
            html5QrCode.stop();
        } catch (e) {
            console.error("Invalid JSON or Blockchain Error:", e);
        }
    },
    (errorMessage) => { }
);

document.getElementById("stopBtn").addEventListener("click", () => {
    html5QrCode.stop()
        .then(() => {
            console.log("QR Code scanning stopped.");
            window.location.href = "index.html"; // Redirect to index.html after stopping the scanner
            // Optionally clear the scanner container
            document.getElementById("reader").innerHTML = "";
        })
        .catch((err) => {
            console.error("Failed to stop scanning:", err);
        });
});


// 👇 Place sendToBlockchain here
async function sendToBlockchain(userData) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAddress = "0xCd91A241DF810530a5DF96BE671Bb20908C199a3";
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "string[]",
                    "name": "candNames",
                    "type": "string[]"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "idHash",
                    "type": "bytes32"
                }
            ],
            "name": "Registered",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "idHash",
                    "type": "bytes32"
                }
            ],
            "name": "registerID",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "fingerprint",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "_valid",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "_eligible",
                    "type": "bool"
                }
            ],
            "name": "registerVoter",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_id",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "candNames",
                    "type": "string"
                }
            ],
            "name": "Vote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "philsys_id",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "candidate",
                    "type": "string"
                }
            ],
            "name": "VoteCasted",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "candNames",
                    "type": "string"
                }
            ],
            "name": "allVotes",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "COMELEC",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "count",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "Government",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "idHashes",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "isRegistered",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "master_list",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "voter",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "fingerprint_registered",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "data_valid",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "eligible",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "has_voted",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const jsonString = JSON.string(userData);
const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(jsonString));

    try {
        const VoterReg = await contract.registerVoter(
            userData.subject.PCN,
            true, // fingerprint registered
            true, // data valid
            true  // eligible
        );
        await VoterReg.wait();
        console.log("Voter registered successfully:", ty.hash);
       const reg = await contract.registerID(hash);
       await reg.wait();
       console.log("Transaction sent:", tx.hash);
    } catch (err) {
        console.error("Blockchain transaction failed:", err);
    }
}
