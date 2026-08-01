#!/data/data/com.termux/files/usr/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Hermes Agent Installer for Termux
# ═══════════════════════════════════════════════════
# بيـ install Hermes Agent على Termux (Android)
# الحد الأدنى: 4GB available RAM
#
# Usage:
#   bash install-hermes-termux.sh
# ═══════════════════════════════════════════════════

set -e

echo "☤ Hermes Agent — Termux Installer"
echo "=================================="

# Check if curl exists
if ! command -v curl &> /dev/null; then
    echo "📦 Installing curl..."
    pkg install -y curl
fi

# ─── 1. Install Hermes ─────────────────────────────
echo ""
echo "📥 [1/4] Downloading Hermes installer..."
curl -fsSL https://hermes-agent.nousresearch.com/install.sh -o /tmp/hermes-install.sh
echo "   ✅ Downloaded"

# ─── 2. Run installer ──────────────────────────────
echo ""
echo "📦 [2/4] Running Hermes installer (skip setup)..."
bash /tmp/hermes-install.sh --skip-setup 2>&1 | tail -10 || {
    echo "   ⚠️ Installer failed, trying manual install..."
    
    # Manual fallback
    echo "   📥 Cloning Hermes repo..."
    git clone --depth 1 https://github.com/NousResearch/hermes-agent.git ~/.hermes/hermes-agent 2>/dev/null || true
    
    echo "   📦 Installing via uv..."
    pip install uv 2>/dev/null || pkg install -y python-pip
    cd ~/.hermes/hermes-agent
    uv pip install -e ".[all]" 2>&1 | tail -3 || pip install -e ".[all]" 2>&1 | tail -3
}

# ─── 3. Setup environment ──────────────────────────
echo ""
echo "⚙️ [3/4] Setting up environment..."

# Add Hermes to PATH
HERMES_HOME="$HOME/.hermes"
HERMES_BIN="$HERMES_HOME/bin"

# Check if hermes binary exists
if [ -f "$HERMES_HOME/bin/hermes" ]; then
    echo "   ✅ Hermes binary found"
elif command -v hermes &> /dev/null; then
    echo "   ✅ Hermes in PATH"
else
    echo "   ⚠️ Hermes binary not found — checking alternatives..."
    find ~/.hermes -name "hermes" -type f 2>/dev/null | head -3
fi

# Add to bashrc
grep -q "HERMES_HOME" ~/.bashrc || {
    echo "" >> ~/.bashrc
    echo "# Hermes Agent" >> ~/.bashrc
    echo "export HERMES_HOME=\"\$HOME/.hermes\"" >> ~/.bashrc
    echo "export PATH=\"\$HERMES_HOME/bin:\$PATH\"" >> ~/.bashrc
    echo "   ✅ Added to ~/.bashrc"
}

# ─── 4. Setup API key ──────────────────────────────
echo ""
echo "🔑 [4/4] API Key Setup"
echo "========================"
echo ""
echo "Hermes محتاج API key عشان يشتغل."
echo ""
echo "الخيارات:"
echo "  1. OpenAI    (OPENAI_API_KEY)"
echo "  2. Anthropic (ANTHROPIC_API_KEY)"
echo "  3. OpenRouter (OPENROUTER_API_KEY) ← موصى بيه"
echo "  4. تخطى (هضبط بعدين)"
echo ""
read -p "اختار (1-4): " choice

case $choice in
    1)
        read -p "OpenAI API Key: " key
        echo "OPENAI_API_KEY=$key" >> ~/.hermes/.env
        echo "   ✅ OpenAI key added"
        ;;
    2)
        read -p "Anthropic API Key: " key
        echo "ANTHROPIC_API_KEY=$key" >> ~/.hermes/.env
        echo "   ✅ Anthropic key added"
        ;;
    3)
        read -p "OpenRouter API Key: " key
        echo "OPENROUTER_API_KEY=$key" >> ~/.hermes/.env
        echo "   ✅ OpenRouter key added"
        ;;
    4)
        echo "   ⚠️ Skipped — add key later in ~/.hermes/.env"
        ;;
    *)
        echo "   ⚠️ Invalid choice"
        ;;
esac

# ─── Verify ────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Hermes Agent Installation"
echo "═══════════════════════════════════════════════════"

export HERMES_HOME="$HOME/.hermes"
export PATH="$HERMES_HOME/bin:$PATH"

if command -v hermes &> /dev/null; then
    VERSION=$(hermes --version 2>&1 | head -1)
    echo "  ✅ Installed: $VERSION"
else
    echo "  ⚠️ Hermes not in PATH yet"
    echo "  Run: source ~/.bashrc"
    echo "  Then: hermes --version"
fi

echo ""
echo "  Hermes Home: $HERMES_HOME"
echo "  Config:      $HERMES_HOME/config.yaml"
echo "  API Keys:    $HERMES_HOME/.env"
echo ""
echo "  To test:     hermes -z 'Hello'"
echo "  To setup:    hermes setup"
echo "═══════════════════════════════════════════════════"
