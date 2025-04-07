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