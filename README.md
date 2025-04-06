# Voter-dApp

## Running the Project with Docker

To run this project using Docker, follow the steps below:

### Prerequisites

- Ensure Docker and Docker Compose are installed on your system.
- Verify that the Docker version supports BuildKit (Docker version 18.09 or later).

### Build and Run Instructions

1. Navigate to the project root directory.
2. Build and start the services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Access the application at `http://localhost:5500`.

### Configuration Details

- The application runs on Node.js version `22.13.1`.
- The service exposes port `5500` for external access.
- The `NODE_ENV` environment variable is set to `production`.

### Notes

- If additional environment variables are required, create a `.env` file in the project root and uncomment the `env_file` line in the `docker-compose.yml` file.
- The application uses a non-root user for enhanced security.

For further details, refer to the Dockerfiles and Compose file included in the project.