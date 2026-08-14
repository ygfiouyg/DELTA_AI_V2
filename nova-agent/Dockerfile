# ═══════════════════════════════════════════════════
# Nova Agent (Hermes) — Standalone Docker Image
# ═══════════════════════════════════════════════════
FROM python:3.11-slim

# ─── System dependencies ───────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git wget \
    ffmpeg \
    portaudio19-dev \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── Install Hermes Agent ──────────────────────────
RUN curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup

# ─── Expose Hermes API Port ────────────────────────
EXPOSE 8000

# ─── Start Hermes API Server ───────────────────────
CMD ["/root/.hermes/bin/hermes", "serve", "--host", "0.0.0.0", "--port", "8000"]
