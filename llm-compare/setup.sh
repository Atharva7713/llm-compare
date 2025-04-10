#!/bin/bash

# Create necessary directories
mkdir -p frontend/src/{components,pages,hooks,utils,styles}
mkdir -p backend/src/{routes,controllers,services,utils,config}
mkdir -p logs

# Install root dependencies
npm install

# Setup frontend
cd frontend
npm install @headlessui/react @heroicons/react @tanstack/react-query axios react react-dom react-router-dom zustand
npm install -D @types/node @types/react @types/react-dom @typescript-eslint/eslint-plugin @typescript-eslint/parser @vitejs/plugin-react autoprefixer eslint eslint-plugin-react-hooks eslint-plugin-react-refresh postcss tailwindcss typescript vite

# Setup backend
cd ../backend
npm install cors dotenv express express-rate-limit helmet mongoose openai winston
npm install -D @types/cors @types/express @types/node @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint nodemon ts-node typescript

# Return to root
cd ..

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "Setup complete! Please update your .env file with your API keys and other configuration."
echo "To start the development servers:"
echo "  npm run dev      # Start both frontend and backend"
echo "  npm run dev:frontend  # Start frontend only"
echo "  npm run dev:backend   # Start backend only" 