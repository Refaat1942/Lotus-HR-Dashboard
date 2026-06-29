#!/bin/bash
# PM2 deploy (no Docker) — alternative to docker-compose
set -e

APP_DIR="/opt/lotus-hr-dashboard"
APP_PORT=16310
REPO_URL="https://github.com/Refaat1942/Lotus-HR-Dashboard.git"

echo "=== Lotus HR Dashboard — PM2 Deploy (port $APP_PORT) ==="

# Install Node.js 20 if missing
if ! command -v node &> /dev/null; then
  echo "Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Install PM2 if missing
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# Clone or update
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull origin main
else
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# Env file
if [ ! -f .env ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  cat > .env << EOF
PORT=$APP_PORT
HOSTNAME=0.0.0.0
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
EOF
fi

export $(grep -v '^#' .env | xargs)

npm ci
npm run build

mkdir -p data

pm2 delete lotus-hr 2>/dev/null || true
pm2 start npm --name "lotus-hr" -- start
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# Firewall
if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
  ufw allow $APP_PORT/tcp
fi

echo ""
echo "=== Deploy complete ==="
echo "App URL: http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}'):$APP_PORT"
echo "Login: admin / admin"
