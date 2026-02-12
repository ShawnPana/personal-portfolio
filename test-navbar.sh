#!/bin/bash
# Test each route/tab of the portfolio with a separate browser-use agent
# Routes: / (main portfolio), /Home (3D model), /tree (3D scene)

set -e

export PATH="$HOME/.local/bin:$HOME/.browser-use-env/bin:$PATH"

# Get the tunnel URL
TUNNEL_URL=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/cloudflared.log | head -1)

if [ -z "$TUNNEL_URL" ]; then
  echo "ERROR: No tunnel URL found. Make sure cloudflared is running."
  exit 1
fi

echo "=========================================="
echo "Tunnel URL: $TUNNEL_URL"
echo "=========================================="
echo ""

# Agent 1: Test the main portfolio page (/ route - Serious component)
echo ">>> AGENT 1: Testing main portfolio page (/ route)..."
browser-use run "Navigate to ${TUNNEL_URL}/ and test the main portfolio page. Verify you can see: 1) The hero section with 'Shawn Pana' heading and 'Software Engineer & Machine Learning Developer' subheading 2) The About Me section mentioning UC San Diego and Browser Use 3) The Contact Me section with email and LinkedIn links 4) The Projects section with project cards (like Resume Use, Job Use, News Use, BetterWeb, etc.) 5) The Skills section with skill tags. Scroll down to verify all sections load correctly. Take a screenshot at the top and after scrolling to the projects section." --max-steps 10 2>&1 | tee /tmp/agent1_result.txt
echo ""
echo ">>> AGENT 1 COMPLETE"
echo ""

# Agent 2: Test the Home page (/Home route - 3D model page)
echo ">>> AGENT 2: Testing Home page (/Home route)..."
browser-use run "Navigate to ${TUNNEL_URL}/Home and test the 3D model page. This page has a loading overlay that says 'loading...' while 3D models load. Verify: 1) The page loads (you may see a loading screen initially) 2) After loading, there should be a 3D scene with a model of a person (Shawn) and various interactive 3D objects including a resume, LinkedIn logo, and a heart model. 3) The page has a dark/3D environment. Take a screenshot to document the state of the page." --max-steps 10 2>&1 | tee /tmp/agent2_result.txt
echo ""
echo ">>> AGENT 2 COMPLETE"
echo ""

# Agent 3: Test the Tree page (/tree route - 3D tree/ocean scene)
echo ">>> AGENT 3: Testing tree page (/tree route)..."
browser-use run "Navigate to ${TUNNEL_URL}/tree and test the 3D tree/ocean scene page. This page has a loading overlay that says 'loading...' while 3D models load. Verify: 1) The page loads (you may see a loading screen initially) 2) After loading, there should be a 3D scene with a tree model, ocean/water with reflections, a sky with stars, and floating text that says 'organregistry.org'. 3) The scene should have a night sky atmosphere. Take a screenshot to document the state of the page." --max-steps 10 2>&1 | tee /tmp/agent3_result.txt
echo ""
echo ">>> AGENT 3 COMPLETE"
echo ""

echo "=========================================="
echo "ALL 3 AGENTS COMPLETE"
echo "=========================================="

# Cleanup
browser-use close --all 2>/dev/null || true
