#!/bin/bash
# =============================================================================
# Browser-Use Navbar Test Script
# Tests each route/tab of the personal portfolio with separate browser-use agents
#
# Routes tested:
#   1. / (main portfolio - Serious component: hero, projects, skills)
#   2. /Home (3D interactive model page)
#   3. /tree (3D tree/ocean scene)
#
# Prerequisites:
#   - browser-use CLI installed (--remote-only)
#   - cloudflared installed
#   - npm dependencies installed
#   - BROWSER_USE_API_KEY set (for `browser-use run` agent mode)
#
# Usage:
#   ./test-navbar.sh
# =============================================================================

set -e

export PATH="$HOME/.local/bin:$HOME/.browser-use-env/bin:$PATH"

# ---- Start dev server if not running ----
if ! curl -s -o /dev/null -w "" http://localhost:3000 2>/dev/null; then
  echo "[*] Starting React dev server on port 3000..."
  cd /workspace && PORT=3000 npx react-scripts start &>/tmp/react-dev.log &
  echo "[*] Waiting for dev server to be ready..."
  for i in $(seq 1 30); do
    if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
      echo "[+] Dev server is ready!"
      break
    fi
    sleep 2
  done
fi

# ---- Start cloudflare tunnel if not running ----
TUNNEL_URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/cloudflared.log 2>/dev/null | head -1)
if [ -z "$TUNNEL_URL" ]; then
  echo "[*] Starting cloudflare tunnel..."
  cloudflared tunnel --url http://localhost:3000 &>/tmp/cloudflared.log &
  sleep 10
  TUNNEL_URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/cloudflared.log | head -1)
fi

if [ -z "$TUNNEL_URL" ]; then
  echo "ERROR: No tunnel URL found. Check /tmp/cloudflared.log"
  exit 1
fi

echo "=========================================="
echo " Portfolio Navbar Test - 3 Browser Agents"
echo " Tunnel URL: $TUNNEL_URL"
echo "=========================================="
echo ""

# ---- Helper function for testing a route ----
test_route() {
  local SESSION_NAME="$1"
  local ROUTE="$2"
  local DESCRIPTION="$3"
  local FULL_URL="${TUNNEL_URL}${ROUTE}"

  echo "============================================="
  echo "AGENT [${SESSION_NAME}]: ${DESCRIPTION}"
  echo "URL: ${FULL_URL}"
  echo "============================================="

  # Navigate to the page
  echo "[open] Navigating..."
  browser-use --session "$SESSION_NAME" open "$FULL_URL" 2>&1

  # Get initial page state (includes any errors)
  echo ""
  echo "[state] Page state:"
  browser-use --session "$SESSION_NAME" state 2>&1

  # Take screenshot with error overlay (if present)
  echo ""
  echo "[screenshot] Initial screenshot:"
  browser-use --session "$SESSION_NAME" screenshot "/tmp/${SESSION_NAME}_initial.png" 2>&1

  # Dismiss webpack dev server error overlay if present
  echo ""
  echo "[eval] Dismissing error overlay..."
  browser-use --session "$SESSION_NAME" eval "var f=document.querySelector('iframe#webpack-dev-server-client-overlay'); if(f){f.remove();'removed overlay'}else{'no overlay found'}" 2>&1

  # Evaluate page contents
  echo ""
  echo "[eval] Page evaluation:"
  browser-use --session "$SESSION_NAME" eval "JSON.stringify({
    title: document.title,
    url: location.href,
    rootHasChildren: document.querySelector('#root').childNodes.length > 0,
    hasContainer: !!document.querySelector('.container'),
    hasHeroSection: !!document.querySelector('.hero-section'),
    hasProjectsGrid: !!document.querySelector('.projects-grid'),
    hasSkillsList: !!document.querySelector('.skills-list'),
    hasLoadingOverlay: !!document.querySelector('#loadingOverlay'),
    hasCanvas: !!document.querySelector('canvas')
  }, null, 2)" 2>&1

  # Take clean screenshot
  echo ""
  echo "[screenshot] Clean screenshot:"
  browser-use --session "$SESSION_NAME" screenshot "/tmp/${SESSION_NAME}_clean.png" 2>&1

  # Get page title
  echo ""
  echo "[title] Page title:"
  browser-use --session "$SESSION_NAME" get title 2>&1

  # Close session
  echo ""
  echo "[close] Closing session..."
  browser-use --session "$SESSION_NAME" close 2>&1

  echo ""
  echo "AGENT [${SESSION_NAME}] COMPLETE"
  echo ""
}

# ---- Run 3 agents sequentially ----
test_route "agent1" "/" "Testing main portfolio page (Serious component)"
test_route "agent2" "/Home" "Testing Home page (3D model interactive)"
test_route "agent3" "/tree" "Testing tree page (3D ocean/tree scene)"

echo "=========================================="
echo " ALL 3 AGENTS COMPLETE"
echo ""
echo " Screenshots saved to /tmp/"
echo "   - agent1_initial.png, agent1_clean.png (/ route)"
echo "   - agent2_initial.png, agent2_clean.png (/Home route)"
echo "   - agent3_initial.png, agent3_clean.png (/tree route)"
echo "=========================================="
