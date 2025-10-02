# Scan a Delegate (ScanDel)

A decentralized application (dApp) for secure and transparent voting, utilizing blockchain technology.
Specifically made for Comelec

## Live Access
[Website Link](https://dejely.github.io/vAppNew/)

## Overview

**Voter dApp** is built to provide a secure, transparent, and decentralized election system.

## Features

- **COMELEC Management**: A user with a specified address can  _Add_ candidates and  _Register_  voters
- **Decentralized voting**: Eliminates the possibility of one party Monopoly.
- **Records**: Records are stored in the chain, which is tamper-proof.
- **Live Vote-Counting**: End-users will be able to see the vote count after they vote.
- **Sepolia**: This application uses Sepolia Testnetwork.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [MetaMask](https://metamask.io/download)
- [Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
## Installation

### To set up the project locally:
**Clone the repository**
```bash
git clone https://github.com/dejely/vAppNew.git
```


### NOTE:
**Rename the file in _src/node.js_ to _src/index.js_**


### Running the Project with Docker (Locally)

To run this project using Docker, follow the steps below:

### Build and Run Instructions

1. Navigate to the project root directory.
2. Build and start the services using Docker Compose:

   #### Navigating Project Directory
   ```bash
   cd src
   ```

   #### Install dependencies
   ```bash
   npm install
   ```
   ```bash
   docker build -t [app-name] .
   docker-compose up --build
   ```

   ### NOTE:
   If problems persist, **recontainerize** the directory. 

3. Access the application at `http://localhost:5500`.

## USAGE
1. Connect to your MetaMask Wallet
2. COMELEC Only:
   - Register a Voter
   - Add a Candidate
   - Reset Voter vote weight
3. Cast a Vote
   - Select a candidate to vote via drop down
   - Type your VoteID
4. View Live Results
   - Results are displayed below
5. QR Scanning
   - Uses PhilSys with a Mock Dataset registered in the chain
  
# Smart Contract Details
The core of the application is the eVoter.sol smart contract, located in the root directory. It handles:
- Voter Verification and Registration
- Candidate addition and management
- Voting and counting of Votes

### Configuration Details

- The application runs on Node.js version `22.13.1 or later`.
- The service exposes port `5500` for external access.
- The `NODE_ENV` environment variable is set to `production`.

### Notes
- If additional environment variables are required, create a `.env` file in the project root and uncomment the `env_file` line in the `docker-compose.yml` file.
- The application uses a non-root user for enhanced security.

For further details, refer to the Dockerfiles and Compose file included in the project.
