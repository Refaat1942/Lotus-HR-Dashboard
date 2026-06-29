#!/bin/bash
set -e

APP_DIR="/opt/lotus-hr-dashboard"
APP_PORT=16310
REPO_URL="https://github.com/Refaat1942/Lotus-HR-Dashboard.git"

echo "=== Lotus HR Dashboard — VPS Deploy (port $APP_PORT) ==="

# Install Docker if missing
if ! command -v docker &> /dev/null; then
  echo "Installing Docker..."
  apt-get update
  apt-get install -y ca-certificates curl
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
  systemctl enable docker
  systemctl start docker
fi

# Clone or update repo
if [ -d "$APP_DIR/.git" ]; then
  echo "Updating existing installation..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "Cloning repository..."
  rm -rf "$APP_DIR"
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

# Create .env if missing
if [ ! -f .env ]; then
  JWT_SECRET=$(openssl rand -hex 32)
  cat > .env << EOF
PORT=$APP_PORT
HOSTNAME=0.0.0.0
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
EOF
  echo "Created .env with random JWT_SECRET"
fi

# Open firewall port (ufw if active)
if command -v ufw &> /dev/null && ufw status | grep -q "Status: active"; then
  ufw allow $APP_PORT/tcp
  echo "Opened port $APP_PORT in ufw"
fi

# Build and start
echo "Building and starting container..."
docker compose down 2>/dev/null || true
docker compose up -d --build

echo ""
echo "=== Deploy complete ==="
echo "App URL: http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}'):$APP_PORT"
echo "Login: admin / admin"
echo ""
echo "IMPORTANT: Open port $APP_PORT in Hostinger Firewall (hPanel → VPS → Security → Firewall)"
echo "Logs: docker compose -f $APP_DIR/docker-compose.yml logs -f"
