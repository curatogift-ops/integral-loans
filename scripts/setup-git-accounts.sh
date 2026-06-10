#!/usr/bin/env bash
# One-time setup: multiple GitHub accounts via SSH (no repeated browser login per repo).
set -euo pipefail

SSH_DIR="$HOME/.ssh"
mkdir -p "$SSH_DIR"
chmod 700 "$SSH_DIR"
touch "$SSH_DIR/known_hosts"
chmod 600 "$SSH_DIR/known_hosts"
if ! grep -q "github.com" "$SSH_DIR/known_hosts" 2>/dev/null; then
  ssh-keyscan -t ed25519 github.com >> "$SSH_DIR/known_hosts" 2>/dev/null || true
fi

create_key_if_missing() {
  local name="$1"
  local email="$2"
  local key="$SSH_DIR/id_ed25519_${name}"
  if [[ -f "$key" ]]; then
    echo "Key exists: $key"
    return
  fi
  ssh-keygen -t ed25519 -f "$key" -C "$email" -N ""
  echo "Created: $key"
}

create_key_if_missing "curatogift" "integral-loans@curatogift-ops"
create_key_if_missing "personal" "adnan@users.noreply.github.com"

CONFIG="$SSH_DIR/config"
touch "$CONFIG"
chmod 600 "$CONFIG"

add_host_block() {
  local host="$1"
  local keyfile="$2"
  if grep -q "Host ${host}" "$CONFIG" 2>/dev/null; then
    echo "SSH host already configured: $host"
    return
  fi
  cat >> "$CONFIG" <<EOF

Host ${host}
  HostName github.com
  User git
  IdentityFile ${keyfile}
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes
EOF
  echo "Added SSH host: $host"
}

add_host_block "github.com-curatogift" "$SSH_DIR/id_ed25519_curatogift"
add_host_block "github.com-personal" "$SSH_DIR/id_ed25519_personal"

# Add keys to macOS keychain (no passphrase re-entry after reboot)
ssh-add --apple-use-keychain "$SSH_DIR/id_ed25519_curatogift" 2>/dev/null || ssh-add "$SSH_DIR/id_ed25519_curatogift" 2>/dev/null || true
ssh-add --apple-use-keychain "$SSH_DIR/id_ed25519_personal" 2>/dev/null || ssh-add "$SSH_DIR/id_ed25519_personal" 2>/dev/null || true

echo ""
echo "=== Add these public keys to GitHub (one time per account) ==="
echo ""
echo "[curatogift-ops account] Settings → SSH keys:"
cat "$SSH_DIR/id_ed25519_curatogift.pub"
echo ""
echo "[personal account] Settings → SSH keys:"
cat "$SSH_DIR/id_ed25519_personal.pub"
echo ""
echo "Then run: ./scripts/use-git-account.sh curatogift"
