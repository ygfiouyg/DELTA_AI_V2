#!/bin/bash
cd /home/z/my-project
while true; do
  if ! ss -tlnp 2>/dev/null | grep -q ':3000'; then
    NODE_OPTIONS="--max-old-space-size=2048" ./node_modules/.bin/next dev -p 3000 --webpack >> /home/z/my-project/dev.log 2>&1 &
    sleep 20
  fi
  sleep 5
done
