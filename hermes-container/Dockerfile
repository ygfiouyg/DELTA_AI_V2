# ═══════════════════════════════════════════════════
# Dr. AIX Agent (Hermes) — Docker Container
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

EXPOSE 8000

# تشغيل Dashboard على localhost فقط (Nginx هيـ proxyه)
CMD ["hermes", "dashboard", "--host", "127.0.0.1", "--port", "8000"]
