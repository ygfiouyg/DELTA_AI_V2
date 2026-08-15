#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Dr. AIX Agent — White Labeling
# ═══════════════════════════════════════════════════════════
# بيـ تعديل Open WebUI لتغيير الهوية بالكامل
# ═══════════════════════════════════════════════════════════

echo "🎨 Dr. AIX Agent — White Labeling..."
echo "===================================="

# 1. تعديل الـ HTML titles
docker exec dr-aix-ui sh -c '
    find /app -name "*.html" -exec sed -i "s/Open WebUI/Dr. AIX Agent/g" {} \;
    find /app -name "*.html" -exec sed -i "s/OpenWebUI/Dr. AIX Agent/g" {} \;
    find /app -name "*.html" -exec sed -i "s|<title>.*</title>|<title>Dr. AIX Agent</title>|g" {} \;
'

# 2. تعديل الـ Python backend
docker exec dr-aix-ui sh -c '
    find /app/backend -name "*.py" -exec sed -i "s/Open WebUI/Dr. AIX Agent/g" {} \;
    find /app/backend -name "*.py" -exec sed -i "s/OpenWebUI/DrAixAgent/g" {} \;
'

# 3. تعديل الـ Frontend JS
docker exec dr-aix-ui sh -c '
    find /app -name "*.js" -exec sed -i "s/Open WebUI/Dr. AIX Agent/g" {} \;
    find /app -name "*.js" -exec sed -i "s/OpenWebUI/DrAixAgent/g" {} \;
'

# 4. تعديل الـ metadata
docker exec dr-aix-ui sh -c '
    # Change constants
    find /app -name "*.py" -exec sed -i "s/WEBUI_NAME.*=.*\"[^\"]*\"/WEBUI_NAME = \"Dr. AIX Agent\"/g" {} \;
    
    # Change copyright
    find /app -name "*.py" -exec sed -i "s/OPENAI.*API/HERMES API/g" {} \;
'

# 5. إنشاء favicon مخصص
docker exec dr-aix-ui sh -c '
    # Create a simple SVG favicon
    cat > /app/static/favicon.svg << "SVGEOF"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#1A1A1A"/>
  <text x="50" y="68" font-size="60" font-weight="bold" text-anchor="middle" fill="#C5A572" font-family="serif">A</text>
</svg>
SVGEOF
'

# 6. إعادة تشغيل
docker restart dr-aix-ui
sleep 5

echo ""
echo "✅ White Labeling Complete!"
echo "   - Name: Dr. AIX Agent"
echo "   - Brand: ANOVA Ventures"
echo "   - Favicon: Gold 'A' on dark background"
echo ""
echo "   Note: Some changes may require container rebuild."
echo "   Run: docker compose -f open-webui/docker-compose.yml up -d --build"
