
#!/bin/bash

echo "🚀 Setting up Slack Connect..."

# Create data directory for SQLite database
echo "📁 Creating data directory..."
mkdir -p packages/backend/data

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env example if it doesn't exist
if [ ! -f "packages/backend/.env" ]; then
    echo "⚙️ Creating .env file..."
    cat > packages/backend/.env << EOF
# Application URLs
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_PATH=./data/slack_connect.db

# Server
PORT=3001
NODE_ENV=development
EOF
    echo "✅ Created packages/backend/.env - No Slack credentials needed here!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Enter your Slack app credentials in the UI"
echo ""
echo "📖 See README.md for detailed setup instructions"
