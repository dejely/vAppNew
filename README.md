# Voter dApp

A decentralized application (dApp) for secure and transparent voting, utilizing blockchain technology.

## Table of Contents
-[Overview](#Overview)


##

### Overview

**Voter dApp** is built to provide a secure, transparent, and decentralized election system.

# Features

- **COMELEC Management**: A user with a specified address can  _Add_ candidates and  _Register_  voters
- **Decentralized voting**: Eliminates the possibility of one party Monopoly.
- **Records**: Records are stored in the chain, which is tamper-proof.
- **Live Vote-Counting**: End-users will be able to see the vote count after they vote.

### Prerequisites

Before setting up the project, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-started/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)


## Installation
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

4. Access the application at `http://localhost:5500`.

### Configuration Details

- The application runs on Node.js version `22.13.1 or later`.
- The service exposes port `5500` for external access.
- The `NODE_ENV` environment variable is set to `production`.

### Notes

- If additional environment variables are required, create a `.env` file in the project root and uncomment the `env_file` line in the `docker-compose.yml` file.
- The application uses a non-root user for enhanced security.

For further details, refer to the Dockerfiles and Compose file included in the project.
