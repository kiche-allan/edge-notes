#!/usr/bin/env bash
# One-time setup for Edge Notes on an Ubuntu/Debian VPS (tested target: Contabo Cloud VPS).
#   curl -fsSL https://raw.githubusercontent.com/kiche-allan/edge-notes/main/scripts/vps-setup.sh | sudo bash
# Safe to run again: it updates the code, keeps your .env and database, and restarts the site.
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/kiche-allan/edge-notes.git}"
APP_DIR="${APP_DIR:-/opt/edge-notes}"
DEPLOY_USER="${DEPLOY_USER:-edge-deploy}"
WEB_PORT="${WEB_PORT:-8080}"

say() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this as root (or with sudo)." >&2
  exit 1
fi

say "Installing git, curl and openssl if missing"
if command -v apt-get >/dev/null; then
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq git curl openssl ca-certificates >/dev/null
fi

if ! command -v docker >/dev/null; then
  say "Installing Docker"
  curl -fsSL https://get.docker.com | sh
fi
docker compose version >/dev/null 2>&1 || { echo "Docker Compose plugin is missing. Install docker-compose-plugin and re-run." >&2; exit 1; }
systemctl enable --now docker >/dev/null 2>&1 || true

say "Creating the '$DEPLOY_USER' user that GitHub Actions deploys as"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"

say "Fetching the code into $APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git config --global --add safe.directory "$APP_DIR"
  git -C "$APP_DIR" fetch --quiet origin main
  git -C "$APP_DIR" reset --quiet --hard origin/main
else
  git clone --quiet "$REPO_URL" "$APP_DIR"
fi
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"

if [ ! -f "$APP_DIR/.env" ]; then
  say "Writing $APP_DIR/.env with a fresh database password"
  PUBLIC_IP="$(curl -fsS --max-time 5 https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')"
  cat > "$APP_DIR/.env" <<EOF
POSTGRES_USER=edge
POSTGRES_PASSWORD=$(openssl rand -hex 24)
POSTGRES_DB=edge_notes
WEB_PORT=$WEB_PORT
SITE_URL=http://$PUBLIC_IP:$WEB_PORT
USSD_SECRET=
EOF
  chown "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR/.env"
  chmod 600 "$APP_DIR/.env"
else
  say "Keeping the existing $APP_DIR/.env"
fi

if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  say "Opening port $WEB_PORT in the firewall"
  ufw allow "$WEB_PORT"/tcp >/dev/null
fi

say "Building and starting the site (first build takes a few minutes)"
su - "$DEPLOY_USER" -c "cd '$APP_DIR' && docker compose up -d --build"

say "Setting up the SSH key GitHub Actions will use to deploy"
SSH_DIR="/home/$DEPLOY_USER/.ssh"
KEY="$SSH_DIR/github_actions"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$SSH_DIR"
if [ ! -f "$KEY" ]; then
  su - "$DEPLOY_USER" -c "ssh-keygen -q -t ed25519 -N '' -C 'github-actions@edge-notes' -f '$KEY'"
  cat "$KEY.pub" >> "$SSH_DIR/authorized_keys"
  chown "$DEPLOY_USER":"$DEPLOY_USER" "$SSH_DIR/authorized_keys"
  chmod 600 "$SSH_DIR/authorized_keys"
fi

WEB_PORT="$(grep '^WEB_PORT=' "$APP_DIR/.env" | cut -d= -f2- || echo "$WEB_PORT")"
say "Waiting for the site to report healthy"
for _ in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:$WEB_PORT/api/health" >/dev/null 2>&1; then OK=1; break; fi
  sleep 3
done

SITE_URL="$(grep '^SITE_URL=' "$APP_DIR/.env" | cut -d= -f2-)"
SSH_PORT="$( (ss -tlnp 2>/dev/null || true) | awk '/sshd/ {split($4,a,":"); print a[length(a)]; exit}')"
echo
if [ "${OK:-0}" = 1 ]; then
  printf '\033[1;32mEdge Notes is live at %s\033[0m\n' "$SITE_URL"
else
  echo "The site has not reported healthy yet. Check: cd $APP_DIR && docker compose logs web"
fi
cat <<EOF

Last step: add these as repository secrets on GitHub
(Repo > Settings > Secrets and variables > Actions > New repository secret):

  VPS_HOST      $(echo "$SITE_URL" | sed -E 's#https?://([^:/]+).*#\1#')
  VPS_USER      $DEPLOY_USER
  VPS_PORT      ${SSH_PORT:-22}
  VPS_SSH_KEY   the whole private key below, including the BEGIN and END lines

----- copy from the next line -----
$(cat "$KEY")
----- copy up to the line above -----

After that, every push to main deploys itself.
EOF
