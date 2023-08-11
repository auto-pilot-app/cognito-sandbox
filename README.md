## Set up and installation

This monorepo has two packages `/frontend` and `/backend`.

- The first step is to copy `.env.example` to `.env` and fill in the blanks.
- After, in the root of the monorepo run `npm install` to install all necessary modules
- Then, run `npm run dev` to start both the Vite React frontend and the Node Express backend simultaneously
- The frontend should start on http:localhost://3000 and the backend on http://localhost:3001. Make sure to have them available.

## Shutdown

- Use `ctrl+c` to signal the terminal to shutdown the processes
- If this doesn't work, teminate the terminal and run `npm run stop` to make sure all processes are stopped
