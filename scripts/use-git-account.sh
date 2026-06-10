#!/usr/bin/env bash
# Point THIS repo at the right GitHub account (run from repo root).
set -euo pipefail

ACCOUNT="${1:-}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

usage() {
  echo "Usage: ./scripts/use-git-account.sh <curatogift|personal>"
  echo ""
  echo "  curatogift  → curatogift-ops org repos (this project)"
  echo "  personal    → your personal GitHub account repos"
  exit 1
}

[[ -z "$ACCOUNT" ]] && usage

case "$ACCOUNT" in
  curatogift)
    HOST="github.com-curatogift"
    NAME="Curatogift Ops"
    EMAIL="integral-loans@curatogift-ops"
  ;;
  personal)
    HOST="github.com-personal"
    NAME="Adnan Shaikh"
    EMAIL="adnan@users.noreply.github.com"
  ;;
  *)
    usage
  ;;
esac

ORIGIN_URL="$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null || true)"
if [[ "$ORIGIN_URL" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
  ORG="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]%.git}"
  NEW_URL="git@${HOST}:${ORG}/${REPO}.git"
  git -C "$REPO_ROOT" remote set-url origin "$NEW_URL"
  echo "Remote → $NEW_URL"
else
  echo "Could not parse origin URL: $ORIGIN_URL"
  exit 1
fi

git -C "$REPO_ROOT" config user.name "$NAME"
git -C "$REPO_ROOT" config user.email "$EMAIL"
echo "Git user → $NAME <$EMAIL>"
echo "Done. Push with: git push origin main"
