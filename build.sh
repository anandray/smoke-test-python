#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "=== Environment Check ==="

# Check Node version
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js is not installed. Please install Node.js 20 or later." >&2
  exit 1
fi
NODE_VER=$(node -v | sed 's/^v//')
NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
echo "Node.js: v$NODE_VER"
case "$NODE_MAJOR" in
  '' | *[!0-9]*)
    echo "WARNING: could not parse Node.js version '$NODE_VER'; continuing anyway." >&2
    ;;
  *)
    if [ "$NODE_MAJOR" -lt 20 ]; then
      echo "" >&2
      echo "ERROR: Node.js $NODE_VER is too old. Please install Node.js 20 or later." >&2
      echo "       On Ubuntu/WSL, use nvm or the NodeSource repository." >&2
      echo "" >&2
      exit 1
    fi
    ;;
esac

# Check Python version (only the python variant ships backend/requirements.txt)
PYTHON_CMD=""
if [ -f backend/requirements.txt ]; then
  if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
  elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
  else
    echo "ERROR: Python is not installed. Please install Python 3.10 or later." >&2
    exit 1
  fi
  PY_VER=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
  PY_MAJOR=$(echo "$PY_VER" | cut -d. -f1)
  PY_MINOR=$(echo "$PY_VER" | cut -d. -f2)
  echo "Python:  $PY_VER ($PYTHON_CMD)"
  case "$PY_MAJOR$PY_MINOR" in
    *[!0-9]* | '')
      echo "WARNING: could not parse Python version '$PY_VER'; continuing anyway." >&2
      ;;
    *)
      if [ "$PY_MAJOR" -lt 3 ] || { [ "$PY_MAJOR" -eq 3 ] && [ "$PY_MINOR" -lt 10 ]; }; then
        echo "" >&2
        echo "WARNING: Python $PY_VER may be too old. Python 3.10+ is recommended." >&2
        echo "" >&2
      fi
      ;;
  esac
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm is not installed (it normally ships with Node.js)." >&2
  exit 1
fi
echo "npm:     $(npm -v)"
echo "========================="
echo ""

echo "Installing Node dependencies..."
npm install

if [ -n "$PYTHON_CMD" ]; then
  echo ""
  echo "Installing Python dependencies (backend)..."
  cd backend
  if ! "$PYTHON_CMD" -m venv .venv; then
    echo "" >&2
    echo "ERROR: could not create a virtualenv." >&2
    echo "       On Ubuntu/WSL you may need: sudo apt install python3-venv" >&2
    exit 1
  fi
  # Use the venv's pip directly rather than `source`-ing activate (sh-safe).
  .venv/bin/pip install -r requirements.txt
  cd ..
fi

echo ""
echo "Build complete! Run ./start.sh to start the app."
