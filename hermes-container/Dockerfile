# ═══════════════════════════════════════════════════
# Dr. AIX Agent (Hermes) — Docker Container (White-Labeled)
# ═══════════════════════════════════════════════════
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git wget \
    python3 python3-pip python3-venv \
    nodejs npm \
    ffmpeg \
    ripgrep \
    ca-certificates \
    xz-utils \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:/root/.hermes/bin:/root/.hermes/node/bin:/usr/local/share/uv/bin:$PATH"

RUN curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup

ENV HERMES_HOME="/root/.hermes"
COPY config.yaml /root/.hermes/config.yaml

# ─── White-Labeling: تغيير الهوية بالكامل ─────────
RUN echo "🎨 Applying Dr. AIX White-Labeling..." && \
    # 1. تغيير كل اسم "Hermes" في الـ HTML
    find /usr/local/lib/hermes-agent -name "*.html" -exec sed -i 's/Hermes Agent/Dr. AIX Agent/g' {} \; && \
    find /usr/local/lib/hermes-agent -name "*.html" -exec sed -i 's/Hermes/Dr. AIX/g' {} \; && \
    # 2. تغيير في الـ JS
    find /usr/local/lib/hermes-agent -name "*.js" -exec sed -i 's/Hermes Agent/Dr. AIX Agent/g' {} \; && \
    find /usr/local/lib/hermes-agent -name "*.js" -exec sed -i 's/"Hermes"/"Dr. AIX"/g' {} \; && \
    # 3. تغيير في الـ Python
    find /usr/local/lib/hermes-agent -name "*.py" -exec sed -i 's/Hermes Agent/Dr. AIX Agent/g' {} \; && \
    # 4. تغيير Nous Research
    find /usr/local/lib/hermes-agent -name "*.html" -exec sed -i 's/Nous Research/ANOVA Ventures/g' {} \; && \
    find /usr/local/lib/hermes-agent -name "*.js" -exec sed -i 's/Nous Research/ANOVA Ventures/g' {} \; && \
    find /usr/local/lib/hermes-agent -name "*.py" -exec sed -i 's/Nous Research/ANOVA Ventures/g' {} \; && \
    # 5. تغيير الـ title
    find /usr/local/lib/hermes-agent -name "*.html" -exec sed -i 's/<title>.*<\/title>/<title>Dr. AIX Agent<\/title>/g' {} \; && \
    echo "✅ White-Labeling complete"

# ─── إنشاء Favicon مخصص ────────────────────────────
RUN echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#1A1A1A"/><text x="50" y="68" font-size="60" font-weight="bold" text-anchor="middle" fill="#C5A572" font-family="serif">A</text></svg>' > /usr/local/lib/hermes-agent/hermes_cli/web_dist/favicon.svg && \
    find /usr/local/lib/hermes-agent -name "favicon*" -exec cp /usr/local/lib/hermes-agent/hermes_cli/web_dist/favicon.svg {} \; 2>/dev/null || true

EXPOSE 8000

CMD ["hermes", "dashboard", "--host", "0.0.0.0", "--port", "8000"]
