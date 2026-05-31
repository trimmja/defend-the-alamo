#!/bin/bash
cd "$(dirname "$0")"

# Find the Mac's WiFi IP for mobile testing
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

echo "================================================"
echo "  DEFEND THE ALAMO — game server starting..."
echo "================================================"
echo ""
echo "  On this Mac:    http://localhost:8080"
if [ -n "$LAN_IP" ]; then
    echo "  On your phone:  http://$LAN_IP:8080"
    echo "  (phone must be on the same WiFi)"
fi
echo ""
echo "  Or just play the live version on your iPhone:"
echo "  https://trimmja.github.io/defend-the-alamo/"
echo ""
echo "  Close this window to stop the server."
echo "================================================"
echo ""

python3 -m http.server 8080 &
sleep 1
open http://localhost:8080
wait
