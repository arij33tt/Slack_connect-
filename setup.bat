@echo off
echo 🚀 Setting up Slack Connect...

echo 📁 Creating data directory...
if not exist "packages\backend\data" mkdir packages\backend\data

echo 📦 Installing dependencies...
npm install

if not exist "packages\backend\.env" (
    echo ⚙️ Creating .env file...
    (
        echo # Application URLs
        echo FRONTEND_URL=http://localhost:3000
        echo.
        echo # Database
        echo DATABASE_PATH=./data/slack_connect.db
        echo.
        echo # Server
        echo PORT=3001
        echo NODE_ENV=development
    ) > packages\backend\.env
    echo ✅ Created packages/backend/.env - No Slack credentials needed here!
) else (
    echo ✅ .env file already exists
)
echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Run 'npm run dev' to start the development server
echo 2. Open http://localhost:3000 in your browser
echo 3. Enter your Slack app credentials in the UI
echo.
echo 📖 See README.md for detailed setup instructions
pause
