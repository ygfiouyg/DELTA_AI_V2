# ═══════════════════════════════════════════════════
# Dr. AIX Agent (Hermes) — Docker Container (Fixed)
# ═══════════════════════════════════════════════════
FROM ubuntu:22.04

# ─── System dependencies ───────────────────────────
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

# ─── Install uv (Python package manager) ──────────
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:/root/.hermes/bin:/root/.hermes/node/bin:/usr/local/share/uv/bin:$PATH"

# ─── Install Hermes Agent ──────────────────────────
RUN curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup

ENV HERMES_HOME="/root/.hermes"

# ─── Copy config ───────────────────────────────────
COPY config.yaml /root/.hermes/config.yaml

# ─── Expose port ───────────────────────────────────
EXPOSE 8000

# ─── Start Hermes Dashboard ────────────────────────
CMD ["hermes", "dashboard", "--host", "0.0.0.0", "--port", "8000"]
