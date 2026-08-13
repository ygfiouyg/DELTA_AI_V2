#!/bin/bash
# تحديث Hermes Agent لأحدث نسخة
echo "🔄 Updating Hermes Agent to latest version..."

# تحديث Hermes
if [ -d ~/.hermes/hermes-agent ]; then
    cd ~/.hermes/hermes-agent
    git pull origin main
    echo "✅ Hermes code updated"
else
    echo "📥 Installing Hermes fresh..."
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup
fi

# التحقق من الإصدار
export PATH="$HOME/.hermes/bin:$PATH"
hermes --version

echo ""
echo "✅ Hermes updated successfully!"
echo "⚠️ Don't forget to add API key:"
echo "   echo 'OPENROUTER_API_KEY=your_key' >> ~/.hermes/.env"
