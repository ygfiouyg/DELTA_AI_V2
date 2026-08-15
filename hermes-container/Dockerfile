# ═══════════════════════════════════════════════════
# Dr. AIX Agent (Hermes) — Docker Container
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
    && rm -rf /var/lib/apt/lists/*

# ─── Install uv (Python package manager) ──────────
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

# ─── Install Hermes Agent ──────────────────────────
RUN curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup

ENV HERMES_HOME="/root/.hermes"
ENV PATH="/root/.hermes/bin:/root/.local/bin:$PATH"

# ─── Expose port ───────────────────────────────────
EXPOSE 8000

# ─── Health check ──────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:8000/ || exit 1

# ─── Start Hermes Dashboard ────────────────────────
CMD ["hermes", "dashboard", "--host", "0.0.0.0", "--port", "8000"]
