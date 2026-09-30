Elicit Interview - Environment Smoke Test
==========================================

This app checks that your development environment is ready for the
coding interview. It runs the same services you'll use during the
interview:

  - A Next.js frontend (port 3000)
  - A backend server (port 3001)
  - A fake LLM server (port 3002)

REQUIREMENTS
------------

  - Node.js 20 or later (run: node -v)
  - For the Python variant: Python 3.10 or later (run: python3 --version)
  - On Windows, run everything inside WSL2 with a recent Ubuntu (22.04 or
    later) -- older distros ship Node/Python versions that are too old.

INSTRUCTIONS
------------

1. Run the build script:

     ./build.sh

   This installs dependencies and checks your Node/Python versions.
   If it reports any errors or warnings, please address them before
   the interview.

2. Run the start script:

     ./start.sh

   This starts all three services.

3. Open http://localhost:3000 in your browser.

4. You should see green checkmarks for all three services and the
   message: "Everything is working - you're ready for the interview!"

5. Try editing frontend/src/app/page.tsx (e.g., change the heading
   text). The browser should automatically reload with your changes.

TROUBLESHOOTING
---------------

  - If ./build.sh fails, check that you have Node.js 20+ installed.
    On Ubuntu/WSL, you may need nvm or the NodeSource repository for
    a newer version.

  - For the Python variant, you also need Python 3.10+. If creating
    the virtualenv fails on Ubuntu/WSL, you may need:
    sudo apt install python3-venv

  - If ./build.sh gives "permission denied", run: bash build.sh

  - If services fail to start, check the terminal output for error
    messages. Port conflicts are the most common issue -- make sure
    ports 3000, 3001, and 3002 are not already in use.

  - If everything looks stuck, try Ctrl+C and run ./start.sh again.

If you run into any issues you can't resolve, please let us know as
soon as possible so we can help before the interview.
