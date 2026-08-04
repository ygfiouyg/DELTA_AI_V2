# 📦 DELTA_AI_V2 — Complete Project Code Dump

> **Generated:** 2026-08-04 23:01:02
> **Project:** DELTA_AI_V2 / Anzaro AI
> **Developer:** Abdelslam (abdelslam-ai)
> **Repo:** https://github.com/ygfiouyg/DELTA_AI_V2

---

## 📋 Table of Contents

- **Config Files** (10 files)
  - [package.json](#packagejson)
  - [tsconfig.json](#tsconfigjson)
  - [next.config.ts](#nextconfigts)
  - [requirements.txt](#requirementstxt)
  - [.gitignore](#gitignore)
  - [components.json](#componentsjson)
  - [postcss.config.mjs](#postcssconfigmjs)
  - [eslint.config.mjs](#eslintconfigmjs)
  - [tailwind.config.ts](#tailwindconfigts)
  - [Caddyfile](#caddyfile)
- **Prisma** (2 files)
  - [prisma/schema.prisma](#prismaschemaprisma)
  - [prisma/seed.ts](#prismaseedts)
- **Tools Registry** (35 files)
  - [src/lib/tools-registry/index.ts](#srclibtools-registryindexts)
  - [src/lib/tools-registry/gh_tools_registry.ts](#srclibtools-registrygh-tools-registryts)
  - [src/lib/tools-registry/nodejs/date_utilities.ts](#srclibtools-registrynodejsdate-utilitiests)
  - [src/lib/tools-registry/nodejs/text_utilities.ts](#srclibtools-registrynodejstext-utilitiests)
  - [src/lib/tools-registry/nodejs/json_utilities.ts](#srclibtools-registrynodejsjson-utilitiests)
  - [src/lib/tools-registry/nodejs/regex_tester.ts](#srclibtools-registrynodejsregex-testerts)
  - [src/lib/tools-registry/nodejs/unit_converter.ts](#srclibtools-registrynodejsunit-converterts)
  - [src/lib/tools-registry/nodejs/color_utilities.ts](#srclibtools-registrynodejscolor-utilitiests)
  - [src/lib/tools-registry/nodejs/network_utilities.ts](#srclibtools-registrynodejsnetwork-utilitiests)
  - [src/lib/tools-registry/nodejs/validation_utilities.ts](#srclibtools-registrynodejsvalidation-utilitiests)
  - [src/lib/tools-registry/nodejs/cron_utilities.ts](#srclibtools-registrynodejscron-utilitiests)
  - [src/lib/tools-registry/nodejs/hash_utilities.ts](#srclibtools-registrynodejshash-utilitiests)
  - [src/lib/tools-registry/python/sentiment_analysis.py](#srclibtools-registrypythonsentiment-analysispy)
  - [src/lib/tools-registry/python/text_classifier.py](#srclibtools-registrypythontext-classifierpy)
  - [src/lib/tools-registry/python/text_summarizer.py](#srclibtools-registrypythontext-summarizerpy)
  - [src/lib/tools-registry/python/keyword_extractor.py](#srclibtools-registrypythonkeyword-extractorpy)
  - [src/lib/tools-registry/python/language_detector.py](#srclibtools-registrypythonlanguage-detectorpy)
  - [src/lib/tools-registry/python/csv_analyzer.py](#srclibtools-registrypythoncsv-analyzerpy)
  - [src/lib/tools-registry/python/statistics_calculator.py](#srclibtools-registrypythonstatistics-calculatorpy)
  - [src/lib/tools-registry/python/data_visualizer.py](#srclibtools-registrypythondata-visualizerpy)
  - [src/lib/tools-registry/python/web_scraper.py](#srclibtools-registrypythonweb-scraperpy)
  - [src/lib/tools-registry/python/http_api_tester.py](#srclibtools-registrypythonhttp-api-testerpy)
  - [src/lib/tools-registry/python/youtube_downloader.py](#srclibtools-registrypythonyoutube-downloaderpy)
  - [src/lib/tools-registry/python/image_processor.py](#srclibtools-registrypythonimage-processorpy)
  - [src/lib/tools-registry/python/ocr_extractor.py](#srclibtools-registrypythonocr-extractorpy)
  - [src/lib/tools-registry/python/pdf_processor.py](#srclibtools-registrypythonpdf-processorpy)
  - [src/lib/tools-registry/python/audio_processor.py](#srclibtools-registrypythonaudio-processorpy)
  - [src/lib/tools-registry/python/text_to_speech.py](#srclibtools-registrypythontext-to-speechpy)
  - [src/lib/tools-registry/python/qr_code_generator.py](#srclibtools-registrypythonqr-code-generatorpy)
  - [src/lib/tools-registry/python/translator.py](#srclibtools-registrypythontranslatorpy)
  - [src/lib/tools-registry/python/document_generator.py](#srclibtools-registrypythondocument-generatorpy)
  - [src/lib/tools-registry/python/fake_data_generator.py](#srclibtools-registrypythonfake-data-generatorpy)
  - [src/lib/tools-registry/python/file_utilities.py](#srclibtools-registrypythonfile-utilitiespy)
  - [src/lib/tools-registry/python/crypto_utilities.py](#srclibtools-registrypythoncrypto-utilitiespy)
  - [src/lib/tools-registry/python/math_solver.py](#srclibtools-registrypythonmath-solverpy)
- **Agent Engine** (3 files)
  - [src/lib/agent/agent-engine.ts](#srclibagentagent-enginets)
  - [src/lib/agent/custom-tools.ts](#srclibagentcustom-toolsts)
  - [src/lib/agent/standalone-tools.ts](#srclibagentstandalone-toolsts)
- **Agents (Catalog/Recipes)** (4 files)
  - [src/lib/agents/catalog.ts](#srclibagentscatalogts)
  - [src/lib/agents/recipes.ts](#srclibagentsrecipests)
  - [src/lib/agents/executor.ts](#srclibagentsexecutorts)
  - [src/lib/agents/orchestrator.ts](#srclibagentsorchestratorts)
- **Massive Tools** (7 files)
  - [src/lib/massive-tools/callable-tools.ts](#srclibmassive-toolscallable-toolsts)
  - [src/lib/massive-tools/registry.ts](#srclibmassive-toolsregistryts)
  - [src/app/api/massive-tools/exec/route.ts](#srcappapimassive-toolsexecroutets)
  - [src/app/api/massive-tools/dynamic-call/route.ts](#srcappapimassive-toolsdynamic-callroutets)
  - [src/app/api/massive-tools/stats/route.ts](#srcappapimassive-toolsstatsroutets)
  - [src/app/api/massive-tools/search/route.ts](#srcappapimassive-toolssearchroutets)
  - [src/app/api/massive-tools/install/route.ts](#srcappapimassive-toolsinstallroutets)
- **Skills System** (3 files)
  - [src/lib/skills/loader.ts](#srclibskillsloaderts)
  - [src/lib/skills/context-builder.ts](#srclibskillscontext-builderts)
  - [src/lib/skill-indexer.ts](#srclibskill-indexerts)
- **Models** (1 files)
  - [src/lib/models.ts](#srclibmodelsts)
- **Core Lib** (5 files)
  - [src/lib/db.ts](#srclibdbts)
  - [src/lib/auth-nextauth.ts](#srclibauth-nextauthts)
  - [src/lib/with-auth.ts](#srclibwith-authts)
  - [src/lib/auth-fetch.ts](#srclibauth-fetchts)
  - [src/lib/skill-registry.ts](#srclibskill-registryts)
- **API Routes — Hermes** (4 files)
  - [src/app/api/hermes/status/route.ts](#srcappapihermesstatusroutets)
  - [src/app/api/hermes/chat/route.ts](#srcappapihermeschatroutets)
  - [src/app/api/hermes/models/route.ts](#srcappapihermesmodelsroutets)
  - [src/app/api/hermes/skills/route.ts](#srcappapihermesskillsroutets)
- **API Routes — Agents** (11 files)
  - [src/app/api/agents-list/route.ts](#srcappapiagents-listroutets)
  - [src/app/api/agents/route.ts](#srcappapiagentsroutets)
  - [src/app/api/agents/recipes/route.ts](#srcappapiagentsrecipesroutets)
  - [src/app/api/agents/[id]/route.ts](#srcappapiagents[id]routets)
  - [src/app/api/agents/[id]/run/route.ts](#srcappapiagents[id]runroutets)
  - [src/app/api/agent/route.ts](#srcappapiagentroutets)
  - [src/app/api/agent/specialized/route.ts](#srcappapiagentspecializedroutets)
  - [src/app/api/agent/loop/route.ts](#srcappapiagentlooproutets)
  - [src/app/api/agent/tools/route.ts](#srcappapiagenttoolsroutets)
  - [src/app/api/chat/agent/route.ts](#srcappapichatagentroutets)
  - [src/app/api/ai/agent/route.ts](#srcappapiaiagentroutets)
- **API Routes — Chat** (4 files)
  - [src/app/api/chat/send/route.ts](#srcappapichatsendroutets)
  - [src/app/api/chat/stream/route.ts](#srcappapichatstreamroutets)
  - [src/components/chat/ChatApp.tsx](#srccomponentschatchatapptsx)
  - [src/components/chat/ChatHeader.tsx](#srccomponentschatchatheadertsx)
- **API Routes — AI** (1 files)
  - [src/app/api/ai/parallel-agents/route.ts](#srcappapiaiparallel-agentsroutets)
- **API Routes — Auth** (2 files)
  - [src/app/api/auth/google/route.ts](#srcappapiauthgoogleroutets)
  - [src/app/api/auth/google/callback/route.ts](#srcappapiauthgooglecallbackroutets)
- **Components — Agents** (5 files)
  - [src/components/agents/AgentsHub.tsx](#srccomponentsagentsagentshubtsx)
  - [src/components/agents/AgentBuilder.tsx](#srccomponentsagentsagentbuildertsx)
  - [src/components/agents/AgentForm.tsx](#srccomponentsagentsagentformtsx)
  - [src/components/agents/AgentRunner.tsx](#srccomponentsagentsagentrunnertsx)
  - [src/components/agents/types.ts](#srccomponentsagentstypests)
- **Main App** (2 files)
  - [src/app/page.tsx](#srcapppagetsx)
  - [src/app/layout.tsx](#srcapplayouttsx)
- **Skills Samples** (8 files)
  - [skills/LLM/SKILL.md](#skillsllmskillmd)
  - [skills/TTS/SKILL.md](#skillsttsskillmd)
  - [skills/ASR/SKILL.md](#skillsasrskillmd)
  - [skills/VLM/SKILL.md](#skillsvlmskillmd)
  - [skills/docx/SKILL.md](#skillsdocxskillmd)
  - [skills/charts/SKILL.md](#skillschartsskillmd)
  - [skills/coding-agent/SKILL.md](#skillscoding-agentskillmd)
  - [skills/web-reader/SKILL.md](#skillsweb-readerskillmd)
- **Docker & Deploy** (11 files)
  - [Dockerfile](#dockerfile)
  - [Dockerfile.prod](#dockerfileprod)
  - [docker-compose.yml](#docker-composeyml)
  - [docker-entrypoint.sh](#docker-entrypointsh)
  - [deploy-vps.sh](#deploy-vpssh)
  - [deploy-hp-a8.sh](#deploy-hp-a8sh)
  - [deploy-termux.sh](#deploy-termuxsh)
  - [deploy-oracle.sh](#deploy-oraclesh)
  - [deploy-gcp.sh](#deploy-gcpsh)
  - [deploy-do.sh](#deploy-dosh)
  - [install-hermes-termux.sh](#install-hermes-termuxsh)
- **Scripts** (6 files)
  - [scripts/fast_pypi_rebuild.py](#scriptsfast-pypi-rebuildpy)
  - [scripts/github_tools_phase2.py](#scriptsgithub-tools-phase2py)
  - [scripts/generate_gh_registry.py](#scriptsgenerate-gh-registrypy)
  - [scripts/patch_python_tools.py](#scriptspatch-python-toolspy)
  - [scripts/patch_gh_submodules.py](#scriptspatch-gh-submodulespy)
  - [scripts/db_sync_manager.py](#scriptsdb-sync-managerpy)
- **Mobile App** (3 files)
  - [mobile-app/package.json](#mobile-apppackagejson)
  - [mobile-app/src/App.tsx](#mobile-appsrcapptsx)
  - [mobile-app/src/config.ts](#mobile-appsrcconfigts)
- **Docs** (3 files)
  - [README.md](#readmemd)
  - [MIGRATION.md](#migrationmd)
  - [EXECUTION_PLAN.md](#execution-planmd)

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total files in dump** | 130 |
| **Total size** | 1.4MB |
| **Missing files** | 0 |

---

# 📂 Config Files

## `package.json`

> Size: 3.8KB | Lines: 121 | Lang: json

```json
{
  "name": "anzaro-ai",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000 --webpack 2>&1 | tee dev.log",
    "build": "next build --webpack",
    "start": "rm -rf .next/cache .next/server .next/static .next/BUILD_ID .next/types .next/dev 2>/dev/null; next dev -p 3000 -H 0.0.0.0 --webpack",
    "lint": "eslint .",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:migrate:create": "prisma migrate dev --name",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.106.0",
    "@elevenlabs/elevenlabs-js": "^2.57.0",
    "@gradio/client": "^2.2.1",
    "@hookform/resolvers": "^5.1.1",
    "@huggingface/inference": "^4.13.18",
    "@modelcontextprotocol/sdk": "^1.29.0",
    "@prisma/client": "6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tanstack/react-query": "^5.82.0",
    "@types/nodemailer": "^8.0.0",
    "adm-zip": "^0.5.17",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "docx": "^9.7.1",
    "embla-carousel-react": "^8.6.0",
    "exceljs": "^4.4.0",
    "framer-motion": "^12.23.2",
    "googleapis": "^173.0.0",
    "input-otp": "^1.4.2",
    "ioredis": "^5.11.1",
    "isomorphic-dompurify": "^2.15.0",
    "jose": "^6.2.3",
    "lucide-react": "^0.525.0",
    "mammoth": "^1.12.0",
    "msedge-tts": "^2.0.5",
    "next": "^16.1.1",
    "next-auth": "^4.24.14",
    "next-themes": "^0.4.6",
    "nodemailer": "^9.0.3",
    "officeparser": "^7.1.0",
    "pdf-parse": "^2.4.5",
    "pdf2json": "^4.0.3",
    "playwright": "^1.60.0",
    "pptxgenjs": "^4.0.1",
    "prisma": "6.11.1",
    "qrcode": "^1.5.4",
    "radix-ui": "^1.4.3",
    "react": "^19.0.0",
    "react-day-picker": "^9.8.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "react-markdown": "^10.1.0",
    "react-player": "^3.4.0",
    "react-resizable-panels": "^3.0.3",
    "recharts": "^2.15.4",
    "remark-gfm": "^4.0.1",
    "resend": "^6.12.4",
    "sharp": "^0.34.3",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "telegraf": "^4.16.3",
    "unpdf": "^1.6.2",
    "vaul": "^1.1.2",
    "z-ai-web-dev-sdk": "^0.0.18",
    "zod": "^4.0.2",
    "zustand": "^5.0.6"
  },
  "prisma": {
    "seed": "node seed.js"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/adm-zip": "^0.5.8",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^16.1.1",
    "tailwindcss": "^4",
    "tsx": "^4.23.1",
    "tw-animate-css": "^1.3.5",
    "typescript": "^5.7.3"
  }
}

```

---

## `tsconfig.json`

> Size: 780B | Lines: 45 | Lang: json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "mini-services",
    "examples",
    "skills"
  ]
}

```

---

## `next.config.ts`

> Size: 4.5KB | Lines: 145 | Lang: typescript

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // شيلنا standalone لأنه بيـ crash مع force-dynamic في "Collecting page data"
  // next start هيستخدم .next العادي
  allowedDevOrigins: ["kopabdo-delta-ai-v2.hf.space"],
  typescript: {
    ignoreBuildErrors: true,
  },
  // خلي كل الصفحات dynamic (مش static) — ده بيمنع crash في "Generating static pages"
  // لأن صفحات بتستخدم browser APIs (localStorage, window) بتـ crash وقت prerender
  experimental: {
    cpus: 1,
    workerThreads: false,
    // Optimize package imports to reduce bundle size and memory usage
    // V.56: Consolidated duplicate experimental blocks (was causing TS error + wasted memory)
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      '@radix-ui/react-icons',
      'date-fns',
      'react-markdown',
      '@tanstack/react-query',
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
    ],
  },
  // SECURITY FIX: Enable React Strict Mode to catch potential issues
  reactStrictMode: true,
  // Ensure server-only packages are not bundled into client code
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "sharp",
    "googleapis",
    "google-auth-library",
    "@anthropic-ai/sdk",
    "@modelcontextprotocol/sdk",
    "nodemailer",
    "bcryptjs",
    "ioredis",
    "telegraf",
    "msedge-tts",
    "ws",
    "isomorphic-ws",
    "pdf2json",
    "unpdf",
    "officeparser",
    "mammoth",
    "exceljs",
    "pptxgenjs",
    "docx",
    "adm-zip",
    "qrcode",
    "z-ai-web-dev-sdk",
  ],
  // Fix: Handle Node.js built-in modules in browser bundle
  // Some packages (googleapis, etc.) reference Node built-ins that don't exist in browser
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // Don't try to bundle Node.js built-in modules in the browser
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        http2: false,
        'async_hooks': false,
        'perf_hooks': false,
        'stream': false,
        'crypto': false,
        'zlib': false,
        'url': false,
        'path': false,
        'os': false,
        'http': false,
        'https': false,
        'util': false,
        'querystring': false,
        'buffer': false,
        'events': false,
        'assert': false,
        'stream/web': false,
      };

      // Handle node: protocol URIs (e.g., "node:net", "node:fs")
      // Webpack's resolve.alias doesn't handle the "node:" URI scheme.
      // IgnorePlugin intercepts these at the module resolution level.
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^node:/,
        })
      );

      // Ignore googleapis in client bundle (uses Node built-ins, server-only)
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^googleapis$/,
        })
      );
    }
    return config;
  },
  // ── Security headers: allow YouTube embeds + media playback ──
  // HuggingFace proxy sets restrictive CSP. We override with ours.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.scdn.co",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' data: blob: https: http:",
              "connect-src 'self' https: wss: blob:",
              "frame-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://open.spotify.com https://sdk.scdn.co",
              "frame-ancestors 'self' https://huggingface.co https://*.huggingface.co",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

```

---

## `requirements.txt`

> Size: 3.3KB | Lines: 327 | Lang: text

```
# Anzaro AI — Python Packages (V.143)
# All packages installed during Docker BUILD (not runtime)

# ── Core ──
huggingface_hub
pandas
numpy
scipy
matplotlib
seaborn
scikit-learn
sympy
statsmodels
requests
httpx
aiohttp
urllib3
beautifulsoup4
lxml
parsel

# ── AI/ML ──
openai
anthropic
tiktoken
transformers
tokenizers
safetensors
sentence-transformers
xgboost
lightgbm
shap
optuna

# ── NLP ──
nltk
spacy
gensim
textblob
vaderSentiment
textstat
wordcloud
rapidfuzz
jellyfish

# ── Web ──
fastapi
flask
django
starlette
uvicorn
gunicorn
selenium
playwright
scrapy
newspaper3k
trafilatura
yt-dlp
pytube

# ── Documents ──
pdfplumber
pypdf
PyMuPDF
reportlab
fpdf2
weasyprint
python-docx
python-pptx
openpyxl
xlsxwriter
xlrd
markdown
jinja2

# ── Media ──
pillow
opencv-python-headless
scikit-image
imageio
imageio-ffmpeg
pydub
librosa
soundfile
edge-tts
gTTS
pytesseract
qrcode
python-barcode
rembg
moviepy
ffmpeg-python

# ── Security ──
cryptography
pyjwt
passlib
bcrypt
argon2-cffi
pyotp
pycryptodome
pyopenssl
pynacl
paramiko

# ── Dev ──
pytest
pytest-asyncio
pytest-cov
coverage
hypothesis
black
ruff
isort
autopep8
flake8
pylint
mypy
bandit
rich
textual
click
typer
fire
tqdm
loguru
structlog
psutil
py-cpuinfo

# ── LangChain ──
langchain
langchain-core
langchain-community
langchain-openai
langchain-anthropic
langchain-experimental
langgraph
langserve
langsmith

# ── Vector DBs ──
chromadb
faiss-cpu
annoy
hnswlib

# ── Data ──
polars
pyarrow
dask
sqlalchemy
sqlmodel
alembic
pymongo
redis
psycopg2-binary
pymysql
elasticsearch
orjson
ujson
msgpack
jsonschema

# ── Utils ──
pyyaml
toml
tomli
tomli-w
python-dotenv
environs
schedule
apscheduler
python-crontab
croniter
celery
rq
arq
dramatiq
huey
pydantic
pydantic-settings
tabulate
prettytable
python-dateutil
pytz
arrow
pendulum
watchdog
filelock
chardet
charset-normalizer
unidecode
ftfy
python-slugify
inflection
regex
re2
pyparsing
lark
cachetools
tenacity
aiofiles
anyio
fsspec
boto3

# ── Finance ──
yfinance
ta
ccxt
alpha_vantage
backtrader

# ── Science ──
networkx
shapely
geojson
folium
geopandas
astropy
rdkit
biopython

# ── Medical/Chemical ──
pubchempy
mendeleev
pydicom
chemlib
chemspipy

# ── Social ──
praw
instaloader
spotipy
googlesearch-python
pytrends
tweepy
discord.py
slack-sdk
pyrogram
telethon

# ── Automation ──
pywhatkit
yagmail
plyer
gspread
twilio
autoscraper
fake-useragent
undetected-chromedriver

# ── OSINT/Cyber ──
cloudscraper
scapy
dpkt

# ── Hardware/IoT ──
paho-mqtt
pyserial
wakeonlan
esptool
smbus2
pyusb

# ── Human Language ──
humanize
parsedatetime
pyspellchecker
emoji
phonenumbers
validators
langdetect
deep-translator

# ── Real Life ──
forex-python
pint
holidays
geopy
speedtest-cli
pyowm
croniter
vidgear

# ── Fun ──
cowsay
pyjokes
art
pyfiglet
termcolor
colorama
faker
wikipedia

# ── System ──
pynput
pyperclip
icecream
memory_profiler
transitions
pypika
prometheus_client
typing_extensions
send2trash
patool
pyzipper
pyscreenshot

# ── Documents Extra ──
docx2pdf
pikepdf
img2pdf
pdf2image

# ── CrewAI ──
crewai

# ── Other ──
duckdb
peewee
feedparser
atoma
youtube-transcript-api
google-api-python-client
google-auth

```

---

## `.gitignore`

> Size: 1.6KB | Lines: 103 | Lang: text

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel


# typescript
*.tsbuildinfo
next-env.d.ts
# V.67c: Don't ignore local-tool-executor.ts (needed for PPTX/XLSX generation)
!src/lib/local-tool-executor.ts
.claude
.z-ai-config
*.log
dev.log
dev.out.log
test
prompt

server.log
# Skills directory (V.61: allow our custom .md skill files)
!/skills/*.md
# logs & scripts (Tailwind v4 scans these — must ignore)
.zscripts/
dev.log
server.log
*.log

# Large binary/media files (HF Space rejects >10MB)
/upload/
/download/
# V.110: Allow DB to be uploaded to HF (752K — under 10MB limit)
!/db/custom.db
/db/*.db-journal
/mobile-app/dist/
/mobile-app/.expo/
/mobile-app/node_modules/
/tool-results/
*.mp4
*.hbc
.git-rewrite/
filter-branch-backup/
upload-temp/
upload/
*.db
!custom.db
mobile-app/dist/
skills/design/
skills/*/scripts/
skills/*/templates/
skills/*/*.py
skills/*/*.js
skills/*/*.html
skills/*/*.webp
skills/*/*.jpg
skills/*/*.png

# V.110: Never track full DB (use tools_mini.db instead)
db/custom.db
db/custom.db-wal
db/custom.db-shm

# V.110: Large files — too big for HF (10MB limit)
voice_samples/
db/tools_mini.db
db/tools_lite.db
skills/design/design-templates/
db/custom.db.empty.bak
db/*.bak
wheels/

```

---

## `components.json`

> Size: 430B | Lines: 20 | Lang: json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}

```

---

## `postcss.config.mjs`

> Size: 81B | Lines: 5 | Lang: javascript

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;

```

---

## `eslint.config.mjs`

> Size: 1.7KB | Lines: 51 | Lang: javascript

```javascript
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript rules
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-as-const": "off",
    "@typescript-eslint/no-unused-disable-directive": "off",
    
    // React rules
    "react-hooks/exhaustive-deps": "off",
    "react-hooks/purity": "off",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/prop-types": "off",
    "react-compiler/react-compiler": "off",
    "react-hooks/set-state-in-effect": "warn",
    
    // Next.js rules
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    
    // General JavaScript rules
    "prefer-const": "off",
    "no-unused-vars": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-irregular-whitespace": "off",
    "no-case-declarations": "off",
    "no-fallthrough": "off",
    "no-mixed-spaces-and-tabs": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-useless-escape": "off",
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts", "examples/**", "skills", "tools/**", ".agents/**"]
}];

export default eslintConfig;

```

---

## `tailwind.config.ts`

> Size: 2.7KB | Lines: 65 | Lang: typescript

```typescript
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                }
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;

```

---

## `Caddyfile`

> Size: 493B | Lines: 23 | Lang: text

```
:81 {
	@transform_port_query {
		query XTransformPort=*
	}

	handle @transform_port_query {
		reverse_proxy localhost:{query.XTransformPort} {
			header_up Host {host}
			header_up X-Forwarded-For {remote_host}
			header_up X-Forwarded-Proto {scheme}
			header_up X-Real-IP {remote_host}
		}
	}

	handle {
		reverse_proxy localhost:3000 {
			header_up Host {host}
			header_up X-Forwarded-For {remote_host}
			header_up X-Forwarded-Proto {scheme}
			header_up X-Real-IP {remote_host}
		}
	}
}

```

---


# 📂 Prisma

## `prisma/schema.prisma`

> Size: 38.0KB | Lines: 987 | Lang: prisma

> ⚠️ File truncated to first 500 lines (total: 987)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String?                    // bcrypt hash (12 rounds)
  role          String    @default("user") // "user" | "admin"
  avatar        String?
  language      String    @default("ar")   // "ar" | "en" | "egyptian"
  dialect       String?   @default("egyptian") // "egyptian" | "khaleeji" | "levantine" | "msa" | "english"
  themePreset   String?   @default("aurora")   // "aurora" | "leadership" | "creative" | "calm"
  streak        Int       @default(0)      // نظام الرتب
  maxTokens     Int       @default(60000)  // Admin-controlled max tokens per account (platform max: 60000)
  isActive      Boolean   @default(true)
  isVerified    Boolean   @default(false)
  lastSeen      DateTime  @default(now())
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  conversations Conversation[]
  sessions      Session[]
  messages      Message[]
  assets        GenerativeAsset[]
  podcasts      Podcast[]
  otpCodes      OtpCode[]
  memories      UserMemory[]
spotifyToken  SpotifyToken?
  integrations     UserIntegration[]
  achievements      UserAchievement[]
  challengeCompletions ChallengeCompletion[]
  stats             UserStats?
  personalityProfile PersonalityProfile?
  devices           Device[]
  mediaSessions     MediaSession[]
  quickActions      QuickAction[]
  routines          Routine[]
  nudges            ProactiveNudge[]
}

model OtpCode {
  id        String   @id @default(cuid())
  email     String
  code      String
  type      String   @default("verification") // "verification" | "reset"
  isUsed    Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([email, code, type])
  @@index([email, type, isUsed])
  @@index([expiresAt])
}

model Conversation {
  id          String   @id @default(cuid())
  title       String?
  model       String   @default("delta-general")
  language    String   @default("ar")
  context     String?  // "general" | "islamic" | "code" | "creative" | "science" | "medical"
  isArchived  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages    Message[]

  @@index([userId])
  @@index([userId, updatedAt]) // Composite index for sidebar sorting queries
}

model Message {
  id             String   @id @default(cuid())
  content        String
  role           String   // "user" | "assistant" | "system"
  model          String?
  emotion        String?  // "happy" | "supportive" | "excited" | "calm" | "thoughtful"
  quoteUsed      String?
  language       String   @default("ar")
  attachments    String?  // JSON array
  pdfUrl         String?  // Generated PDF URL
  isEdited       Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  userId         String?
  user           User?        @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([conversationId])
  @@index([userId])
}

model Session {
  id          String   @id @default(cuid())
  token       String   @unique
  device      String?
  ip          String?
  expiresAt   DateTime
  createdAt   DateTime @default(now())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model AdminSettings {
  id                String   @id @default(cuid())
  key               String   @unique
  value             String   // JSON string
  category          String   @default("general") // "general" | "ai" | "radio" | "voice" | "pdf"
  description       String?
  updatedAt         DateTime @updatedAt
}

model GenerativeAsset {
  id          String   @id @default(cuid())
  type        String   // "pdf" | "image" | "audio" | "video"
  title       String
  prompt      String?
  filePath    String
  fileSize    Int?
  metadata    String?  // JSON
  model       String?
  createdAt   DateTime @default(now())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Podcast {
  id          String   @id @default(cuid())
  title       String
  description String?
  audioUrl    String
  duration    Int?
  episode     Int      @default(1)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([isActive])
}

model RadioStation {
  id          String   @id @default(cuid())
  name        String
  streamUrl   String
  logo        String?
  category    String   @default("islamic") // "islamic" | "music" | "news" | "quran"
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())

  @@index([isActive])
  @@index([category])
}

model VoiceBroadcast {
  id          String   @id @default(cuid())
  title       String?
  audioUrl    String
  duration    Int?
  isActive    Boolean  @default(true)
  playedCount Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive])
}

// ═══════════════════════════════════════════════════════════
// نماذج المُجمّع (Aggregator) — إدارة نقاط نهاية API
// ═══════════════════════════════════════════════════════════

model ApiEndpoint {
  id               String   @id @default(cuid())
  name             String
  provider         String
  category         String   // "chat" | "image" | "video" | "asr" | "translation"
  baseUrl          String
  modelId          String?
  apiKey           String?
  authType         String   @default("none") // "none" | "bearer" | "x-api-key" | "custom"
  authHeader       String?
  apiFormat        String   @default("openai") // "openai" | "hf-inference" | "pollinations" | "raw" | "gemini"
  sourceRepo       String?
  sourceUrl        String?
  isFree           Boolean  @default(false)
  isAvailable      Boolean  @default(true)
  priority         Int      @default(50)
  consecutiveFails Int      @default(0)
  successRate      Float    @default(0)
  avgResponseMs    Float    @default(0)
  lastValidatedAt  DateTime?
  lastError        String?
  capabilities     String?  // JSON
  metadata         String?  // JSON
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  validationLogs ApiValidationLog[]

  @@index([category])
  @@index([provider])
  @@index([isAvailable])
  @@index([priority])
}

model UserMemory {
  id          String   @id @default(cuid())
  userId      String
  category    String   // "style", "interest", "language", "preference"
  key         String   // e.g. "writing_style", "topic_engineering", "dialect"
  value       String   // e.g. "casual", "frequent", "egyptian"
  confidence  Float    @default(0.5) // 0-1, how confident are we
  sourceCount Int      @default(1)   // how many times we observed this
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, category, key])
}

model ApiValidationLog {
  id           String   @id @default(cuid())
  endpointId   String
  status       String   // "success" | "fail" | "timeout" | "rate_limited"
  responseMs   Int
  statusCode   Int?
  errorMessage String?
  createdAt    DateTime @default(now())

  endpoint ApiEndpoint @relation(fields: [endpointId], references: [id], onDelete: Cascade)

  @@index([endpointId])
}

model ApiAggregationJob {
  id                String   @id @default(cuid())
  type              String   // "scrape" | "validate" | "full_cycle"
  status            String   @default("pending") // "pending" | "running" | "completed" | "failed"
  sourcesScraped    Int      @default(0)
  endpointsFound    Int      @default(0)
  endpointsValidated Int     @default(0)
  endpointsAdded    Int      @default(0)
  endpointsRemoved  Int      @default(0)
  errors            String?  // JSON array
  duration          Int      @default(0)
  startedAt         DateTime?
  completedAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([status])
  @@index([type])
}

// ═══════════════════════════════════════════════════════════
// نظام التحديات والإنجازات (Gamification)
// ═══════════════════════════════════════════════════════════

model Achievement {
  id          String   @id @default(cuid())
  key         String   @unique  // e.g. "first_chat", "streak_7", "quiz_master"
  titleAr     String             // Arabic title
  titleEn     String             // English title
  descriptionAr String
  descriptionEn String
  icon        String             // emoji
  category    String   @default("general") // "general" | "chat" | "learning" | "creative" | "social"
  points      Int      @default(10)
  requirement Int      @default(1)  // how many times to trigger
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  unlocks UserAchievement[]
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())

  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
  @@index([userId])
}

model DailyChallenge {
  id          String   @id @default(cuid())
  titleAr     String
  titleEn     String
  descriptionAr String
  descriptionEn String
  type        String   // "chat" | "quiz" | "document" | "image" | "mindmap" | "code"
  targetCount Int      @default(1)
  points      Int      @default(50)
  day         String   @unique // "2024-01-15" format
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  completions ChallengeCompletion[]
}

model ChallengeCompletion {
  id          String   @id @default(cuid())
  userId      String
  challengeId String
  completedAt DateTime @default(now())

  user      User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge DailyChallenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@unique([userId, challengeId])
  @@index([userId])
}

model UserStats {
  id              String   @id @default(cuid())
  userId          String   @unique
  totalPoints     Int      @default(0)
  level           Int      @default(1)
  totalChats      Int      @default(0)
  totalQuizzes    Int      @default(0)
  totalDocuments  Int      @default(0)
  totalImages     Int      @default(0)
  totalMindmaps   Int      @default(0)
  totalCodeExecs  Int      @default(0)
  currentStreak   Int      @default(0)
  longestStreak   Int      @default(0)
  lastActiveDate  String?  // "2024-01-15" format
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([lastActiveDate])
}

// ═══════════════════════════════════════════════════════════
// برومبتس النظام — إدارة وتجاوز البرومبتس الافتراضية
// ═══════════════════════════════════════════════════════════

model SystemPromptOverride {
  id            String   @id @default(cuid())
  key           String   @unique   // e.g. "model:gpt-4o", "feature:content-strategy"
  category      String              // "model" | "feature" | "agent"
  label         String              // Human-readable name in Arabic
  labelEn       String              // Human-readable name in English
  description   String?             // What this prompt does
  sourceFile    String?             // Where the original prompt lives e.g. "src/lib/models.ts"
  sourceKey     String?             // The field/variable name in the source
  value         String              // The current/overridden prompt text
  originalValue String?             // The hardcoded default (for reset)
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([category])
  @@index([key])
}

model HFDisabledModel {
  id         String   @id @default(cuid())
  modelId    String   @unique
  disabledBy String?
  reason     String?
  createdAt  DateTime @default(now())

  @@map("hf_disabled_models")
}

model CustomModel {
  id          String   @id @default(cuid())
  name        String
  nameEn      String
  category    String   // "chat" | "image" | "video" | "asr" | "translation"
  provider    String   // e.g., "pollinations", "groq", "openai"
  baseUrl     String
  modelId     String?  // The actual model ID to send to the API
  apiKey      String?
  authType    String   @default("none") // "none" | "bearer" | "x-api-key" | "custom"
  authHeader  String?
  apiFormat   String   @default("openai") // "openai" | "hf-inference" | "pollinations" | "gemini" | "raw"
  isFree      Boolean  @default(false)
  isActive    Boolean  @default(true)
  priority    Int      @default(50)
  icon        String   @default("⚡")
  description String?
  descriptionEn String?
  sourceEndpointId String? // Link back to the ApiEndpoint it came from
  addedBy     String?
  capabilities String? // JSON
  metadata    String?  // JSON
  maxTokens   Int?     // Context window size (null = auto-detect)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("custom_models")
}

// ═══════════════════════════════════════════════════════════════════════
// GitHub Skill Importer — مهارات مسحوبة من GitHub repos
// ═══════════════════════════════════════════════════════════════════════
model GitHubSkill {
  id          String   @id @default(cuid())
  githubUrl   String   @unique
  repoName    String
  repoOwner   String
  name        String
  description String
  skillMd     String   
  toolsNeeded String?  
  status      String   @default("pending") // pending | approved | rejected
  submittedBy String?
  reviewedBy  String?
  reviewedAt  DateTime?
  fileSize    Int?
  fileCount   Int?
  aiReview    String?  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status])
  @@map("github_skills")
}

// ═══════════════════════════════════════════════════════════════════════
// Installed Tools — أدوات مسحوبة من GitHub وتتنفّذ فعلياً
// ═══════════════════════════════════════════════════════════════════════
model InstalledTool {
  id            String   @id @default(cuid())
  githubUrl     String   @unique
  repoName      String
  repoOwner     String
  toolName      String   @unique // الاسم في الـ registry
  displayName   String
  description   String
  // JSON schema للـ parameters
  parameters    String   
  // الكود التنفيذي (entry function code)
  executeCode   String   
  // كل ملفات الـ repo كـ JSON: [{path, content}]
  codeFiles     String   
  // dependencies المطلوبة
  dependencies  String?  
  // AI analysis
  aiReview      String?  
  status        String   @default("pending") // pending | approved | rejected
  submittedBy   String?
  reviewedBy    String?
  reviewedAt    DateTime?
  fileCount     Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([toolName])
  @@map("installed_tools")
}

// ═══════════════════════════════════════════════════════════════════════
// Anzaro Apps — تطبيقات كاملة مسحوبة من GitHub (frontend + backend)
// ═══════════════════════════════════════════════════════════════════════
model AnzaroApp {
  id            String   @id @default(cuid())
  githubUrl     String   @unique
  repoName      String
  repoOwner     String
  appName       String   @unique // slug للـ URL: /app/flight-booking
  displayName   String
  description   String
  icon          String   @default("📱")
  // HTML كامل للـ frontend (يدعم CSS + JS inline)
  frontendHtml  String   
  // JavaScript functions للـ backend كـ JSON: {functionName: code}
  backendCode   String   
  // API endpoints كـ JSON: [{path, method, functionName}]

```

---

## `prisma/seed.ts`

> Size: 5.1KB | Lines: 160 | Lang: typescript

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Super Admin User ──────────────────────────────────────────────
  // Read from environment variables (same pattern as seed.js used in Docker)
  const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0]?.trim() || "admin@delta-ai.local";
  const adminPasswordRaw = process.env.ADMIN_PASSWORD || "";

  // Generate bcrypt hash (12 rounds — same as auth.ts)
  let adminPassword: string;
  if (adminPasswordRaw) {
    adminPassword = await bcrypt.hash(adminPasswordRaw, 12);
  } else {
    // Auto-generate a random password if not provided
    const generated = `admin_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    adminPassword = await bcrypt.hash(generated, 12);
    console.log(`⚠️  No ADMIN_PASSWORD set. Generated: ${generated}`);
    console.log(`⚠️  Please set ADMIN_PASSWORD env var for production!`);
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      password: adminPassword,
      role: "admin",
      language: "ar",
      isActive: true,
      isVerified: true,
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // ── Admin Settings (API Keys) ─────────────────────────────────────
  // SECURITY: All API keys are read from environment variables
  // Never hardcode API keys in source code
  const settings = [
    {
      key: "zhipu_agent_key",
      value: process.env.ZHIPU_AGENT_KEY || "",
      category: "ai",
      description: "Zhipu AI Agent API Key",
    },
    {
      key: "zhipu_platform_key",
      value: process.env.ZHIPU_PLATFORM_KEY || "",
      category: "ai",
      description: "Zhipu AI Platform API Key",
    },
    {
      key: "google_ai_key",
      value: process.env.GOOGLE_AI_KEY || "",
      category: "ai",
      description: "Google AI API Key",
    },
  ];

  for (const setting of settings) {
    // Only seed if a value is provided via env var
    if (setting.value) {
      await prisma.adminSettings.upsert({
        where: { key: setting.key },
        update: { value: setting.value, category: setting.category, description: setting.description },
        create: setting,
      });
      console.log(`✅ Setting created: ${setting.key}`);
    } else {
      console.log(`⏭️ Setting skipped (no env var): ${setting.key}`);
    }
  }

  // ── Default Radio Stations (URLs VERIFIED 2025-01-30) ─────────────
  // All URLs return audio/mpeg (or audio/aacp) with HTTP 200 when tested.
  // Previously these pointed to non-existent radiojar.com mountpoints that
  // all returned 404 — that was the root cause of "البث غير متاح" errors.
  const stations = [
    {
      name: "إذاعة القرآن الكريم",
      streamUrl: "https://qurango.net/radio/tarateel",
      category: "quran",
      sortOrder: 1,
    },
    {
      name: "إذاعة القرآن الكريم من القاهرة",
      // Official ERTU Quran Radio Cairo (via radiojar) — VERIFIED 200 OK
      streamUrl: "https://stream.radiojar.com/8s5u5tpdtwzuv",
      category: "quran",
      sortOrder: 2,
    },
    {
      name: "إذاعة مشاري العفاسي",
      streamUrl: "https://qurango.net/radio/mishary_alafasi",
      category: "quran",
      sortOrder: 3,
    },
    {
      name: "إذاعة أحمد العجمي",
      streamUrl: "https://qurango.net/radio/ahmad_alajmy",
      category: "quran",
      sortOrder: 4,
    },
    {
      name: "نجوم FM",
      // Nogoum FM via zeno.fm — VERIFIED 200 OK
      streamUrl: "https://stream.zeno.fm/qb1zvsykm98uv",
      category: "music",
      sortOrder: 5,
    },
    {
      name: "راديو هيتس 88.2",
      streamUrl: "https://radiohits882.radioca.st/;",
      category: "music",
      sortOrder: 6,
    },
    {
      name: "راديو 9090",
      streamUrl: "https://9090streaming.mobtada.com/9090FMEGYPT",
      category: "music",
      sortOrder: 7,
    },
    {
      name: "راديو الشرق مع بلومبرج",
      // Radio Asharq — VERIFIED 200 OK + audio/aacp
      streamUrl: "https://l3.itworkscdn.net/asharqradioalive/asharqradioa/icecast.audio",
      category: "news",
      sortOrder: 8,
    },
  ];

  for (const station of stations) {
    const existing = await prisma.radioStation.findFirst({
      where: { name: station.name },
    });
    if (!existing) {
      await prisma.radioStation.create({ data: station });
      console.log(`✅ Radio station created: ${station.name}`);
    } else {
      console.log(`⏭️ Radio station already exists: ${station.name}`);
    }
  }

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

---


# 📂 Tools Registry

## `src/lib/tools-registry/index.ts`

> Size: 32.1KB | Lines: 726 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 726)

```typescript
/**
 * Tools Registry — Auto-loader for all tool implementations.
 *
 * V.145: بدل ما كل tool يكون inline في callable-tools.ts أو custom-tools.ts،
 * كل tool في ملف مستقل تحت /tools/{python,nodejs}/.
 * الـ registry ده بيجمعهم كلهم في مكان واحد ويفضحهم للـ API.
 *
 * Categories:
 *   - ai:        AI/ML/NLP tools (sentiment, classifier, summarizer, ...)
 *   - data:      Data analysis (csv, stats, visualizer, ...)
 *   - media:     Media processing (image, audio, OCR, PDF, ...)
 *   - web:       Web/HTTP (scraper, api_tester, youtube, ...)
 *   - utility:   General utilities (text, json, regex, date, color, ...)
 *   - security:  Crypto/hash utilities
 *
 * Tool Format:
 *   {
 *     name: string,
 *     description: string,
 *     category: "ai" | "data" | "media" | "web" | "utility" | "security",
 *     runtime: "python" | "nodejs",
 *     package?: string,        // pip package or npm module (if any)
 *     parameters: { [key]: { type, description, default?, required? } },
 *     execute: (args) => Promise<any>
 *   }
 */

import { spawn } from "child_process";
import { existsSync, promises as fs } from "fs";
import path from "path";
import * as os from "os";

// ─── GitHub-harvested tools (auto-generated) ─────────────────
import { GH_TOOLS, getGhStats } from "./gh_tools_registry";

// ─── Node.js tools (static imports) ──────────────────────────
import dateUtilities from "./nodejs/date_utilities";
import textUtilities from "./nodejs/text_utilities";
import jsonUtilities from "./nodejs/json_utilities";
import regexTester from "./nodejs/regex_tester";
import unitConverter from "./nodejs/unit_converter";
import colorUtilities from "./nodejs/color_utilities";
import networkUtilities from "./nodejs/network_utilities";
import validationUtilities from "./nodejs/validation_utilities";
import cronUtilities from "./nodejs/cron_utilities";
import hashUtilities from "./nodejs/hash_utilities"

// ─── Python tool wrappers ────────────────────────────────────
// كل Python tool ليه wrapper function بيستدعي الـ script بـ python3

const PYTHON_PATHS = [
  "/usr/local/lib/python3.11/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

const TOOLS_DIR = path.join(process.cwd(), "src", "lib", "tools-registry", "python");

async function runPythonTool(scriptName: string, args: any, timeoutMs: number = 60000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  // Write args to a temp file
  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_args_${Date.now()}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      // Cleanup
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        // Try to parse the last line as JSON
        const lines = stdout.trim().split("\n");
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-500),
          stdout: stdout.slice(-500),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

// ─── Tool Definitions ────────────────────────────────────────

export interface ToolDefinition {
  name: string;
  description: string;
  category: "ai" | "data" | "media" | "web" | "utility" | "security" | "github";
  runtime: "python" | "nodejs";
  package?: string;
  source_repo?: string;
  license?: string;
  parameters: Record<string, { type: string; description: string; default?: any; required?: boolean }>;
  execute: (args: any) => Promise<any>;
}

export const TOOLS: ToolDefinition[] = [
  // ─── Node.js Tools (10) ──────────────────────────────────
  {
    name: "date_utilities",
    description: "أدوات تواريخ شاملة — format, parse, diff, add, timezone convert, weekday, startOf, endOf",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "operation: format|parse|diff|add|timezone|now|isValid|weekday|startOf|endOf", required: true },
      date: { type: "string", description: "input date (ISO, YYYY-MM-DD, or timestamp)" },
      format: { type: "string", description: "format style: human|relative|YYYY-MM-DD|ISO|unix", default: "human" },
      timezone: { type: "string", description: "IANA timezone (e.g. Africa/Cairo)" },
      amount: { type: "number", description: "amount to add" },
      unit: { type: "string", description: "seconds|minutes|hours|days|weeks|months|years", default: "days" },
      date2: { type: "string", description: "second date for diff operation" },
    },
    execute: async (args) => dateUtilities.execute(args),
  },
  {
    name: "text_utilities",
    description: "أدوات نصوص شاملة — case conversion, count, extract emails/urls/phones, slugify, reverse, truncate, strip_html",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "uppercase|lowercase|title|camel|snake|kebab|word_count|char_count|line_count|extract_emails|extract_urls|extract_phones|slugify|reverse|truncate|strip_html|encode_url|decode_url|stats|find_replace", required: true },
      text: { type: "string", description: "input text", required: true },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => textUtilities.execute(args),
  },
  {
    name: "json_utilities",
    description: "أدوات JSON شاملة — format, minify, validate, query (dot path), flatten, unflatten, merge, diff, keys, size, convert_csv",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "format|minify|validate|query|flatten|unflatten|merge|diff|keys|size|convert_csv", required: true },
      json: { type: "string|object", description: "JSON string or object" },
      json2: { type: "string|object", description: "second JSON for merge/diff" },
      params: { type: "object", description: "{ indent, path }" },
    },
    execute: async (args) => jsonUtilities.execute(args),
  },
  {
    name: "regex_tester",
    description: "اختبار regular expressions — match, extract, replace, split, validate, explain",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "match|extract|replace|split|validate|explain", required: true },
      pattern: { type: "string", description: "regex pattern", required: true },
      text: { type: "string", description: "input text", required: true },
      flags: { type: "string", description: "regex flags (g, i, m)", default: "g" },
      replacement: { type: "string", description: "replacement string for replace op" },
    },
    execute: async (args) => regexTester.execute(args),
  },
  {
    name: "unit_converter",
    description: "محول وحدات شامل — length, weight, volume, area, speed, data, time, pressure, angle, temperature",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "convert|list_units", required: true },
      category: { type: "string", description: "length|weight|volume|area|speed|data|time|pressure|angle|temperature" },
      value: { type: "number", description: "value to convert" },
      from: { type: "string", description: "source unit" },
      to: { type: "string", description: "target unit" },
    },
    execute: async (args) => unitConverter.execute(args),
  },
  {
    name: "color_utilities",
    description: "أدوات ألوان شاملة — convert HEX/RGB/HSL/HSV, info, palette, gradient, mix, complement, brightness, random",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "convert|info|palette|gradient|mix|complement|brightness|random", required: true },
      color: { type: "string", description: "color in HEX, rgb(), or hsl()" },
      format: { type: "string", description: "hex|rgb|hsl|hsv", default: "hex" },
      count: { type: "number", description: "number of colors in palette/gradient", default: 5 },
      color2: { type: "string", description: "second color for gradient/mix" },
      weight: { type: "number", description: "mix weight (0-1)", default: 0.5 },
    },
    execute: async (args) => colorUtilities.execute(args),
  },
  {
    name: "network_utilities",
    description: "أدوات شبكة — DNS lookup, reverse DNS, port check, URL parse, IP info, get headers, validate URL, get my IP",
    category: "web",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "dns_lookup|dns_reverse|port_check|url_parse|ip_info|get_headers|validate_url|get_my_ip", required: true },
      hostname: { type: "string", description: "hostname for DNS" },
      ip: { type: "string", description: "IP address" },
      url: { type: "string", description: "URL" },
      port: { type: "number", description: "port number" },
      timeout: { type: "number", description: "timeout in ms", default: 5000 },
    },
    execute: async (args) => networkUtilities.execute(args),
  },
  {
    name: "validation_utilities",
    description: "أدوات تحقق شاملة — email, phone, URL, IP, credit card, ISBN, UUID, JWT, password strength, username",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "email|phone|url|ip|credit_card|isbn|uuid|jwt|password_strength|username", required: true },
      value: { type: "string", description: "value to validate", required: true },
      params: { type: "object", description: "{ strict: boolean }" },
    },
    execute: async (args) => validationUtilities.execute(args),
  },
  {
    name: "cron_utilities",
    description: "أدوات cron — parse, validate, describe (human-readable), next_run, schedule (list next N runs)",
    category: "utility",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "parse|validate|describe|next_run|schedule", required: true },
      cron: { type: "string", description: "cron expression (e.g. '0 9 * * 1-5')", required: true },
      count: { type: "number", description: "number of runs for schedule", default: 5 },
      from: { type: "string", description: "ISO date for next_run/schedule start" },
    },
    execute: async (args) => cronUtilities.execute(args),
  },
  {
    name: "hash_utilities",
    description: "أدوات hash شاملة — MD5, SHA-1, SHA-256, SHA-512, HMAC, UUID v1/v4, random bytes, PBKDF2, scrypt",
    category: "security",
    runtime: "nodejs",
    parameters: {
      operation: { type: "string", description: "hash|hmac|uuid|random_bytes|pbkdf2|scrypt|cipher_info", required: true },
      data: { type: "string", description: "input data" },
      algorithm: { type: "string", description: "sha256|sha512|md5|sha1", default: "sha256" },
      secret: { type: "string", description: "secret for HMAC" },
      encoding: { type: "string", description: "hex|base64|latin1", default: "hex" },
      length: { type: "number", description: "byte length for random_bytes", default: 32 },
      iterations: { type: "number", description: "iterations for PBKDF2", default: 100000 },
      salt: { type: "string", description: "salt for PBKDF2/scrypt" },
    },
    execute: async (args) => hashUtilities.execute(args),
  },

  // ─── Python Tools (12) ───────────────────────────────────
  {
    name: "sentiment_analysis",
    description: "تحليل المشاعر في نص — يحدد إيجابي/سلبي/محايد مع نسبة الثقة (يدعم العربية والإنجليزية)",
    category: "ai",
    runtime: "python",
    package: "vaderSentiment, textblob",
    parameters: {
      text: { type: "string", description: "النص المطلوب تحليله", required: true },
      language: { type: "string", description: "auto|en|ar", default: "auto" },
    },
    execute: async (args) => {
      // Modify script to accept --args_file (we'll patch the script)
      return runPythonToolWithArgs("sentiment_analysis.py", args);
    },
  },
  {
    name: "text_classifier",
    description: "تصنيف نص إلى فئة (tech, sports, politics, business, health, education) باستخدام TF-IDF + Naive Bayes",
    category: "ai",
    runtime: "python",
    package: "scikit-learn, numpy",
    parameters: {
      text: { type: "string", description: "النص المطلوب تصنيفه", required: true },
      categories: { type: "array", description: "list of categories (optional)" },
    },
    execute: async (args) => runPythonToolWithArgs("text_classifier.py", args),
  },
  {
    name: "text_summarizer",
    description: "تلخيص نص طويل باستخدام extractive summarization (TF-IDF + TextRank)",
    category: "ai",
    runtime: "python",
    package: "nltk, scikit-learn",
    parameters: {
      text: { type: "string", description: "النص الطويل", required: true },
      sentences_count: { type: "number", description: "عدد الجمل في الملخص", default: 3 },
      language: { type: "string", description: "en|ar", default: "en" },
    },
    execute: async (args) => runPythonToolWithArgs("text_summarizer.py", args),
  },
  {
    name: "keyword_extractor",
    description: "استخراج الكلمات المفتاحية من نص باستخدام TF-IDF (يدعم n-grams)",
    category: "ai",
    runtime: "python",
    package: "scikit-learn",
    parameters: {
      text: { type: "string", description: "النص", required: true },
      top_n: { type: "number", description: "عدد الكلمات المفتاحية", default: 10 },
      language: { type: "string", description: "en|ar", default: "en" },
    },
    execute: async (args) => runPythonToolWithArgs("keyword_extractor.py", args),
  },
  {
    name: "language_detector",
    description: "كشف لغة نص معين ويرجع اللغة + نسبة الثقة (يدعم 100+ لغة)",
    category: "ai",
    runtime: "python",
    package: "langdetect",
    parameters: {
      text: { type: "string", description: "النص", required: true },
    },
    execute: async (args) => runPythonToolWithArgs("language_detector.py", args),
  },
  {
    name: "csv_analyzer",
    description: "تحليل ملف CSV — إحصائيات، أنواع بيانات، قيم مفقودة، ارتباط",
    category: "data",
    runtime: "python",
    package: "pandas, numpy",
    parameters: {
      csv_path: { type: "string", description: "مسار ملف CSV" },
      csv_text: { type: "string", description: "محتوى CSV مباشرة" },
      analysis_type: { type: "string", description: "summary|stats|head|correlation", default: "summary" },
    },
    execute: async (args) => runPythonToolWithArgs("csv_analyzer.py", args),
  },
  {
    name: "statistics_calculator",
    description: "حساب إحصائيات شاملة — descriptive, correlation, ttest, regression",
    category: "data",
    runtime: "python",
    package: "numpy, scipy",
    parameters: {
      numbers: { type: "array", description: "قائمة الأرقام", required: true },
      operation: { type: "string", description: "descriptive|correlation|ttest|regression", default: "descriptive" },
      numbers2: { type: "array", description: "قائمة ثانية للـ correlation/ttest/regression" },
    },
    execute: async (args) => runPythonToolWithArgs("statistics_calculator.py", args),
  },
  {
    name: "data_visualizer",
    description: "إنشاء رسوم بيانية — line, bar, scatter, histogram, pie وحفظها كـ PNG",
    category: "data",
    runtime: "python",
    package: "matplotlib, pandas",
    parameters: {
      chart_type: { type: "string", description: "line|bar|scatter|histogram|pie", required: true },
      title: { type: "string", description: "عنوان الرسم" },
      x: { type: "array", description: "بيانات X" },
      y: { type: "array", description: "بيانات Y" },
      x_label: { type: "string", description: "تسمية X" },
      y_label: { type: "string", description: "تسمية Y" },
      output_path: { type: "string", description: "مسار الإخراج", default: "/tmp/chart.png" },
    },
    execute: async (args) => runPythonToolWithArgs("data_visualizer.py", args),
  },
  {
    name: "web_scraper",
    description: "استخراج المحتوى من صفحة ويب — نص نظيف، روابط، صور، meta tags",
    category: "web",
    runtime: "python",
    package: "requests, beautifulsoup4, trafilatura",
    parameters: {
      url: { type: "string", description: "URL الصفحة", required: true },
      extract: { type: "string", description: "text|links|images|meta|all", default: "all" },
      timeout: { type: "number", description: "timeout in seconds", default: 30 },
    },
    execute: async (args) => runPythonToolWithArgs("web_scraper.py", args),
  },
  {
    name: "http_api_tester",
    description: "اختبار API endpoint — GET, POST, PUT, DELETE مع headers و body",
    category: "web",
    runtime: "python",
    package: "requests",
    parameters: {
      url: { type: "string", description: "API URL", required: true },
      method: { type: "string", description: "GET|POST|PUT|PATCH|DELETE", default: "GET" },
      headers: { type: "object", description: "request headers" },
      params: { type: "object", description: "query params" },
      body: { type: "object", description: "request body" },
      body_type: { type: "string", description: "json|form|raw", default: "json" },
      timeout: { type: "number", description: "timeout in seconds", default: 30 },
    },
    execute: async (args) => runPythonToolWithArgs("http_api_tester.py", args),
  },
  {
    name: "youtube_downloader",
    description: "تحميل فيديوهات/صوت من YouTube و منصات تانية باستخدام yt-dlp",
    category: "media",
    runtime: "python",
    package: "yt-dlp",
    parameters: {
      url: { type: "string", description: "YouTube URL", required: true },
      format: { type: "string", description: "best|bestaudio|bestvideo|720p|1080p|480p", default: "best" },
      output_path: { type: "string", description: "output directory", default: "/tmp/youtube_downloads" },
      extract_info_only: { type: "boolean", description: "just get metadata", default: false },
    },
    execute: async (args) => runPythonToolWithArgs("youtube_downloader.py", args),
  },
  {
    name: "image_processor",
    description: "معالجة الصور — resize, crop, rotate, grayscale, blur, sharpen, watermark, convert",
    category: "media",
    runtime: "python",
    package: "pillow",
    parameters: {
      input_path: { type: "string", description: "مسار الصورة الأصلية", required: true },
      output_path: { type: "string", description: "مسار الصورة الناتجة", required: true },
      operation: { type: "string", description: "resize|crop|rotate|grayscale|blur|sharpen|thumbnail|watermark|convert", required: true },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => runPythonToolWithArgs("image_processor.py", args),
  },
  {
    name: "ocr_extractor",
    description: "استخراج النص من صور باستخدام Tesseract OCR (يدعم الإنجليزية والعربية)",
    category: "media",
    runtime: "python",
    package: "pytesseract, pillow",
    parameters: {
      image_path: { type: "string", description: "مسار الصورة", required: true },
      language: { type: "string", description: "eng|ara|eng+ara", default: "eng" },
      output_format: { type: "string", description: "text|data|hocr", default: "text" },
    },
    execute: async (args) => runPythonToolWithArgs("ocr_extractor.py", args),
  },
  {
    name: "pdf_processor",
    description: "معالجة ملفات PDF — استخراج نص، صور، جدول، دمج، تقسيم",
    category: "media",
    runtime: "python",
    package: "pypdf, pdfplumber, pymupdf",
    parameters: {
      pdf_path: { type: "string", description: "مسار ملف PDF", required: true },
      operation: { type: "string", description: "extract_text|extract_images|extract_tables|merge|split|page_count|metadata", default: "extract_text" },
      output_path: { type: "string", description: "output path" },
      pages: { type: "string", description: "page range: 1-5 or all", default: "all" },
      merge_files: { type: "array", description: "list of PDF paths to merge" },
    },
    execute: async (args) => runPythonToolWithArgs("pdf_processor.py", args),
  },
  {
    name: "audio_processor",
    description: "معالجة الصوت — convert, cut, merge, normalize, info, extract_features",
    category: "media",
    runtime: "python",
    package: "pydub, librosa",
    parameters: {
      input_path: { type: "string", description: "مسار ملف الصوت" },
      output_path: { type: "string", description: "مسار الإخراج" },
      operation: { type: "string", description: "convert|cut|merge|normalize|info|extract_features", required: true },
      params: { type: "object", description: "operation-specific params" },
    },
    execute: async (args) => runPythonToolWithArgs("audio_processor.py", args),
  },
  {
    name: "text_to_speech",
    description: "تحويل نص إلى صوت MP3 — يدعم العربية والإنجليزية و 50+ لغة (edge-tts neural voices)",
    category: "media",
    runtime: "python",
    package: "edge-tts, gtts",
    parameters: {
      text: { type: "string", description: "النص المطلوب تحويله لصوت", required: true },
      voice: { type: "string", description: "ar-EG-SalmaNeural|en-US-JennyNeural|auto", default: "auto" },
      output_path: { type: "string", description: "مسار الإخراج", default: "/tmp/tts_output.mp3" },
      rate: { type: "string", description: "speed: +0%", default: "+0%" },
      volume: { type: "string", description: "volume: +0%", default: "+0%" },
    },
    execute: async (args) => runPythonToolWithArgs("text_to_speech.py", args),
  },

```

---

## `src/lib/tools-registry/gh_tools_registry.ts`

> Size: 20.8KB | Lines: 548 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 548)

```typescript
/**
 * GitHub Tools Registry — Auto-generated from src/lib/tools-registry/python/gh_*.py
 *
 * V.146: كل أداة دي implementation مستخرجة من top GitHub repos.
 * لكل أداة:
 *   - الـ source repo (مع عدد stars)
 *   - الـ original function name
 *   - الـ parameters المتوقعة
 *   - install instructions (pip install <package>)
 *
 * Generated at: 2026-08-01T10:30:11.074207
 */

import { spawn } from "child_process";
import { existsSync, promises as fs } from "fs";
import path from "path";
import * as os from "os";

const PYTHON_PATHS = [
  "/usr/local/lib/python3.11/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

const TOOLS_DIR = path.join(process.cwd(), "src", "lib", "tools-registry", "python");

async function runGhPythonTool(scriptName: string, args: any, timeoutMs: number = 30000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_gh_args_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        const lines = stdout.trim().split("\n").filter((l) => l.trim());
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-300),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

export interface GhToolDefinition {
  name: string;
  description: string;
  category: "github";
  runtime: "python";
  source_repo: string;
  license: string;
  parameters: Record<string, { type: string; description: string }>;
  execute: (args: any) => Promise<any>;
}

export const GH_TOOLS: GhToolDefinition[] = [
  {
    name: "gh_autogpt_github_repo_path",
    description: "AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.",
    category: "github",
    runtime: "python",
    source_repo: "Significant-Gravitas/AutoGPT",
    license: "NOASSERTION",
    parameters: {repo_url: { type: "string", description: "parameter repo_url" }},
    execute: async (args) => runGhPythonTool("gh_autogpt_github_repo_path.py", args),
  },
  {
    name: "gh_autogpt_remove_color_codes",
    description: "AutoGPT is the vision of accessible AI for everyone, to use and to build on. Our mission is to provide the tools, so that you can focus on what matters.",
    category: "github",
    runtime: "python",
    source_repo: "Significant-Gravitas/AutoGPT",
    license: "NOASSERTION",
    parameters: {s: { type: "string", description: "parameter s" }},
    execute: async (args) => runGhPythonTool("gh_autogpt_remove_color_codes.py", args),
  },
  {
    name: "gh_awesome_python_build_graphql_query",
    description: "An opinionated list of Python frameworks, libraries, tools, and resources",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {repos: { type: "string", description: "parameter repos" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_build_graphql_query.py", args),
  },
  {
    name: "gh_awesome_python_detect_source_type",
    description: "Extract owner/repo from a GitHub repo URL. Returns None for non-GitHub URLs.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {url: { type: "string", description: "parameter url" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_detect_source_type.py", args),
  },
  {
    name: "gh_awesome_python_extract_github_repo",
    description: "Load star data from JSON. Returns empty dict if file doesn't exist or is corrupt.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {url: { type: "string", description: "parameter url" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_extract_github_repo.py", args),
  },
  {
    name: "gh_awesome_python_extract_github_repos",
    description: "Write the star cache to disk, creating data/ dir if needed.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {text: { type: "string", description: "parameter text" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_extract_github_repos.py", args),
  },
  {
    name: "gh_awesome_python_load_stars",
    description: "Sort entries by stars descending, then name ascending.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {path: { type: "string", description: "parameter path" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_load_stars.py", args),
  },
  {
    name: "gh_awesome_python_render_inline_html",
    description: "Render inline AST nodes to plain text (links become their text).",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {children: { type: "string", description: "parameter children" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_render_inline_html.py", args),
  },
  {
    name: "gh_awesome_python_render_inline_text",
    description: "Extract plain text from a heading node.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {children: { type: "string", description: "parameter children" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_render_inline_text.py", args),
  },
  {
    name: "gh_awesome_python_save_cache",
    description: "Build a GraphQL query with aliases for up to 100 repos.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {cache: { type: "string", description: "parameter cache" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_save_cache.py", args),
  },
  {
    name: "gh_awesome_python_slugify",
    description: "Render inline AST nodes to HTML or plain text.",
    category: "github",
    runtime: "python",
    source_repo: "vinta/awesome-python",
    license: "NOASSERTION",
    parameters: {name: { type: "string", description: "parameter name" }},
    execute: async (args) => runGhPythonTool("gh_awesome_python_slugify.py", args),
  },
  {
    name: "gh_comfyui_enable_args_parsing",
    description: "The most powerful and modular diffusion model GUI, api and backend with a graph/nodes interface.",
    category: "github",
    runtime: "python",
    source_repo: "Comfy-Org/ComfyUI",
    license: "GPL-3.0",
    parameters: {enable: { type: "string", description: "parameter enable" }},
    execute: async (args) => runGhPythonTool("gh_comfyui_enable_args_parsing.py", args),
  },
  {
    name: "gh_flask_create_logger",
    description: "The Python micro framework for building web applications.",
    category: "github",
    runtime: "python",
    source_repo: "pallets/flask",
    license: "BSD-3-Clause",
    parameters: {app: { type: "string", description: "parameter app" }},
    execute: async (args) => runGhPythonTool("gh_flask_create_logger.py", args),
  },
  {
    name: "gh_flask_has_level_handler",
    description: "The Python micro framework for building web applications.",
    category: "github",
    runtime: "python",
    source_repo: "pallets/flask",
    license: "BSD-3-Clause",
    parameters: {logger: { type: "string", description: "parameter logger" }},
    execute: async (args) => runGhPythonTool("gh_flask_has_level_handler.py", args),
  },
  {
    name: "gh_flask_wsgi_errors_stream",
    description: "Check if there is a handler in the logging chain that will handle the",
    category: "github",
    runtime: "python",
    source_repo: "pallets/flask",
    license: "BSD-3-Clause",
    parameters: {},
    execute: async (args) => runGhPythonTool("gh_flask_wsgi_errors_stream.py", args),
  },
  {
    name: "gh_go_golookup",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {ui: { type: "string", description: "parameter ui" }, url: { type: "string", description: "parameter url" }, rev: { type: "string", description: "parameter rev" }},
    execute: async (args) => runGhPythonTool("gh_go_golookup.py", args),
  },
  {
    name: "gh_go_goreposum",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {ui: { type: "string", description: "parameter ui" }, url: { type: "string", description: "parameter url" }},
    execute: async (args) => runGhPythonTool("gh_go_goreposum.py", args),
  },
  {
    name: "gh_go_makematcher",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {klass: { type: "string", description: "parameter klass" }},
    execute: async (args) => runGhPythonTool("gh_go_makematcher.py", args),
  },
  {
    name: "gh_go_paramtypematch",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {t: { type: "string", description: "parameter t" }, pattern: { type: "string", description: "parameter pattern" }},
    execute: async (args) => runGhPythonTool("gh_go_paramtypematch.py", args),
  },
  {
    name: "gh_go_read_runtime_const",
    description: "The Go programming language",
    category: "github",
    runtime: "python",
    source_repo: "golang/go",
    license: "BSD-3-Clause",
    parameters: {varname: { type: "string", description: "parameter varname" }, default: { type: "string", description: "parameter default" }},
    execute: async (args) => runGhPythonTool("gh_go_read_runtime_const.py", args),
  },
  {
    name: "gh_node_domain",
    description: "Node.js JavaScript runtime ✨🐢🚀✨",
    category: "github",
    runtime: "python",
    source_repo: "nodejs/node",
    license: "NOASSERTION",
    parameters: {args: { type: "string", description: "parameter args" }},
    execute: async (args) => runGhPythonTool("gh_node_domain.py", args),
  },
  {
    name: "gh_playwright_check_code_snippet",
    description: "Playwright is a framework for Web Testing and Automation. It allows testing Chromium, Firefox and WebKit with a single API.",
    category: "github",
    runtime: "python",
    source_repo: "microsoft/playwright",
    license: "Apache-2.0",
    parameters: {code_snippet: { type: "string", description: "parameter code_snippet" }},
    execute: async (args) => runGhPythonTool("gh_playwright_check_code_snippet.py", args),
  },
  {
    name: "gh_requests_default_hooks",
    description: "Dispatches a hook dictionary on a given piece of data.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {},
    execute: async (args) => runGhPythonTool("gh_requests_default_hooks.py", args),
  },
  {
    name: "gh_requests_dispatch_hook",
    description: "A simple, yet elegant, HTTP library.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {key: { type: "string", description: "parameter key" }, hooks: { type: "string", description: "parameter hooks" }, hook_data: { type: "string", description: "parameter hook_data" }},
    execute: async (args) => runGhPythonTool("gh_requests_dispatch_hook.py", args),
  },
  {
    name: "gh_requests_to_native_string",
    description: "Determine if unicode string only contains ASCII characters.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {string: { type: "string", description: "parameter string" }, encoding: { type: "string", description: "parameter encoding" }},
    execute: async (args) => runGhPythonTool("gh_requests_to_native_string.py", args),
  },
  {
    name: "gh_requests_unicode_is_ascii",
    description: "A simple, yet elegant, HTTP library.",
    category: "github",
    runtime: "python",
    source_repo: "psf/requests",
    license: "Apache-2.0",
    parameters: {u_string: { type: "string", description: "parameter u_string" }},
    execute: async (args) => runGhPythonTool("gh_requests_unicode_is_ascii.py", args),
  },
  {
    name: "gh_rust_key",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {v: { type: "string", description: "parameter v" }},
    execute: async (args) => runGhPythonTool("gh_rust_key.py", args),
  },
  {
    name: "gh_rust_maximum_exponent",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {base: { type: "string", description: "parameter base" }},
    execute: async (args) => runGhPythonTool("gh_rust_maximum_exponent.py", args),
  },
  {
    name: "gh_rust_minimum_exponent",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {base: { type: "string", description: "parameter base" }},
    execute: async (args) => runGhPythonTool("gh_rust_minimum_exponent.py", args),
  },
  {
    name: "gh_rust_print_proper_powers",
    description: "Empowering everyone to build reliable and efficient software.",
    category: "github",
    runtime: "python",
    source_repo: "rust-lang/rust",
    license: "Apache-2.0",
    parameters: {min_exp: { type: "string", description: "parameter min_exp" }, max_exp: { type: "string", description: "parameter max_exp" }, bias: { type: "string", description: "parameter bias" }},
    execute: async (args) => runGhPythonTool("gh_rust_print_proper_powers.py", args),
  },
  {
    name: "gh_scrapy_job_dir",
    description: "Scrapy, a fast high-level web crawling & scraping framework for Python.",
    category: "github",
    runtime: "python",
    source_repo: "scrapy/scrapy",
    license: "BSD-3-Clause",
    parameters: {settings: { type: "string", description: "parameter settings" }},
    execute: async (args) => runGhPythonTool("gh_scrapy_job_dir.py", args),
  },
  {
    name: "gh_stable_diffusion_webui_preload",
    description: "Stable Diffusion web UI",
    category: "github",
    runtime: "python",
    source_repo: "AUTOMATIC1111/stable-diffusion-webui",
    license: "AGPL-3.0",
    parameters: {parser: { type: "string", description: "parameter parser" }},
    execute: async (args) => runGhPythonTool("gh_stable_diffusion_webui_preload.py", args),
  },
  {
    name: "gh_vscode_patch_dmg_icon",
    description: "Visual Studio Code",
    category: "github",
    runtime: "python",
    source_repo: "microsoft/vscode",
    license: "MIT",
    parameters: {dmg_path: { type: "string", description: "parameter dmg_path" }, new_icon_path: { type: "string", description: "parameter new_icon_path" }},
    execute: async (args) => runGhPythonTool("gh_vscode_patch_dmg_icon.py", args),
  },
  {
    name: "gh_whisper_load_audio",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {file: { type: "string", description: "parameter file" }, sr: { type: "string", description: "parameter sr" }},
    execute: async (args) => runGhPythonTool("gh_whisper_load_audio.py", args),
  },
  {
    name: "gh_whisper_median_filter_cuda",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {x: { type: "string", description: "parameter x" }, filter_width: { type: "string", description: "parameter filter_width" }},
    execute: async (args) => runGhPythonTool("gh_whisper_median_filter_cuda.py", args),
  },
  {
    name: "gh_whisper_median_kernel",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {filter_width: { type: "string", description: "parameter filter_width" }},
    execute: async (args) => runGhPythonTool("gh_whisper_median_kernel.py", args),
  },
  {
    name: "gh_whisper_mel_filters",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {device: { type: "string", description: "parameter device" }, n_mels: { type: "string", description: "parameter n_mels" }},
    execute: async (args) => runGhPythonTool("gh_whisper_mel_filters.py", args),
  },
  {
    name: "gh_whisper_pad_or_trim",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {array: { type: "string", description: "parameter array" }, length: { type: "string", description: "parameter length" }, axis: { type: "string", description: "parameter axis" }},
    execute: async (args) => runGhPythonTool("gh_whisper_pad_or_trim.py", args),
  },
  {
    name: "gh_whisper_remove_symbols",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {s: { type: "string", description: "parameter s" }},
    execute: async (args) => runGhPythonTool("gh_whisper_remove_symbols.py", args),
  },
  {
    name: "gh_whisper_remove_symbols_and_diacritics",
    description: "Robust Speech Recognition via Large-Scale Weak Supervision",
    category: "github",
    runtime: "python",
    source_repo: "openai/whisper",
    license: "MIT",
    parameters: {s: { type: "string", description: "parameter s" }, keep: { type: "string", description: "parameter keep" }},
    execute: async (args) => runGhPythonTool("gh_whisper_remove_symbols_and_diacritics.py", args),
  },
];

export function getGhTools(): GhToolDefinition[] {
  return GH_TOOLS;
}

```

---

## `src/lib/tools-registry/nodejs/date_utilities.ts`

> Size: 7.7KB | Lines: 250 | Lang: typescript

```typescript
/**
 * Tool: date_utilities.ts
 * Category: utility
 * Package: none (pure TypeScript, uses Intl + Date)
 * Description: أدوات تواريخ شاملة — format, parse, diff, add, timezone convert.
 *
 * Dependencies: none
 *
 * Input:
 *   {
 *     "operation": "format" | "parse" | "diff" | "add" | "timezone" | "now" | "isValid",
 *     "date": "2025-01-15" | ISO string | timestamp,
 *     "format": "YYYY-MM-DD" | "human" | "relative",
 *     "timezone": "Africa/Cairo",
 *     "amount": 5,
 *     "unit": "days" | "months" | "years" | "hours" | "minutes"
 *   }
 *
 * Output:
 *   { success: true, result: "...", iso: "...", timestamp: 1234567890 }
 */

export interface DateToolInput {
  operation: "format" | "parse" | "diff" | "add" | "timezone" | "now" | "isValid" | "weekday" | "startOf" | "endOf";
  date?: string | number;
  format?: string;
  timezone?: string;
  amount?: number;
  unit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
  date2?: string | number;
  locale?: string;
}

export interface DateToolOutput {
  success: boolean;
  result?: string;
  iso?: string;
  timestamp?: number;
  error?: string;
  [key: string]: any;
}

function toDate(input?: string | number): Date | null {
  if (!input) return new Date();
  if (typeof input === "number") return new Date(input);
  // Try ISO first
  const d = new Date(input);
  if (!isNaN(d.getTime())) return d;
  // Try common formats
  const m = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    return new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4] || "0"),
      parseInt(m[5] || "0"),
      parseInt(m[6] || "0")
    );
  }
  return null;
}

function formatDate(d: Date, format: string, timezone?: string): string {
  if (format === "human") {
    return d.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: timezone,
    });
  }
  if (format === "relative") {
    const now = Date.now();
    const diff = d.getTime() - now;
    const absDiff = Math.abs(diff);
    const minute = 60_000, hour = 60 * minute, day = 24 * hour, week = 7 * day, month = 30 * day, year = 365 * day;
    let unit: string, value: number;
    if (absDiff < hour) { unit = "minute"; value = Math.round(absDiff / minute); }
    else if (absDiff < day) { unit = "hour"; value = Math.round(absDiff / hour); }
    else if (absDiff < week) { unit = "day"; value = Math.round(absDiff / day); }
    else if (absDiff < month) { unit = "week"; value = Math.round(absDiff / week); }
    else if (absDiff < year) { unit = "month"; value = Math.round(absDiff / month); }
    else { unit = "year"; value = Math.round(absDiff / year); }
    const dir = diff > 0 ? "in " : "";
    const suf = diff > 0 ? "" : " ago";
    return `${dir}${value} ${unit}${value !== 1 ? "s" : ""}${suf}`;
  }
  if (format === "YYYY-MM-DD") {
    return d.toISOString().slice(0, 10);
  }
  if (format === "YYYY-MM-DD HH:mm:ss") {
    return d.toISOString().slice(0, 19).replace("T", " ");
  }
  if (format === "ISO") {
    return d.toISOString();
  }
  if (format === "unix") {
    return String(Math.floor(d.getTime() / 1000));
  }
  // Default: full localized
  return d.toLocaleString("en-US", { timeZone: timezone });
}

export async function execute(input: DateToolInput): Promise<DateToolOutput> {
  const { operation, date, format = "human", timezone, amount = 0, unit = "days", date2, locale = "en-US" } = input;

  if (operation === "now") {
    const d = new Date();
    return {
      success: true,
      iso: d.toISOString(),
      timestamp: d.getTime(),
      result: formatDate(d, format, timezone),
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  if (operation === "isValid") {
    const d = toDate(date);
    return { success: true, valid: d !== null && !isNaN(d.getTime()), input: String(date) };
  }

  const d = toDate(date);
  if (!d || isNaN(d.getTime())) {
    return { success: false, error: `invalid date: ${date}` };
  }

  if (operation === "format") {
    return {
      success: true,
      result: formatDate(d, format, timezone),
      iso: d.toISOString(),
      timestamp: d.getTime(),
    };
  }

  if (operation === "parse") {
    return {
      success: true,
      iso: d.toISOString(),
      timestamp: d.getTime(),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
      weekday: d.toLocaleDateString(locale, { weekday: "long" }),
    };
  }

  if (operation === "diff") {
    const d2 = toDate(date2);
    if (!d2) return { success: false, error: "date2 required for diff" };
    const diffMs = d2.getTime() - d.getTime();
    const abs = Math.abs(diffMs);
    return {
      success: true,
      milliseconds: diffMs,
      seconds: Math.round(diffMs / 1000),
      minutes: Math.round(diffMs / 60_000),
      hours: Math.round(diffMs / 3_600_000),
      days: Math.round(diffMs / 86_400_000),
      weeks: Math.round(diffMs / 604_800_000),
      direction: diffMs > 0 ? "future" : diffMs < 0 ? "past" : "same",
    };
  }

  if (operation === "add") {
    const newDate = new Date(d);
    const u = unit;
    if (u === "seconds") newDate.setSeconds(newDate.getSeconds() + amount);
    else if (u === "minutes") newDate.setMinutes(newDate.getMinutes() + amount);
    else if (u === "hours") newDate.setHours(newDate.getHours() + amount);
    else if (u === "days") newDate.setDate(newDate.getDate() + amount);
    else if (u === "weeks") newDate.setDate(newDate.getDate() + amount * 7);
    else if (u === "months") newDate.setMonth(newDate.getMonth() + amount);
    else if (u === "years") newDate.setFullYear(newDate.getFullYear() + amount);
    return {
      success: true,
      original: d.toISOString(),
      result: newDate.toISOString(),
      timestamp: newDate.getTime(),
      added: `${amount} ${unit}`,
    };
  }

  if (operation === "timezone") {
    try {
      const localized = d.toLocaleString("en-US", { timeZone: timezone });
      return {
        success: true,
        original_iso: d.toISOString(),
        timezone,
        localized,
        timestamp: d.getTime(),
      };
    } catch (e: any) {
      return { success: false, error: `invalid timezone: ${timezone}` };
    }
  }

  if (operation === "weekday") {
    return {
      success: true,
      weekday: d.toLocaleDateString(locale, { weekday: "long" }),
      weekday_short: d.toLocaleDateString(locale, { weekday: "short" }),
      day_of_week: d.getDay(),
      is_weekend: d.getDay() === 0 || d.getDay() === 6,
    };
  }

  if (operation === "startOf" || operation === "endOf") {
    const unit_start = input.unit || "day";
    const newDate = new Date(d);
    if (unit_start === "day") {
      if (operation === "startOf") {
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setHours(23, 59, 59, 999);
      }
    } else if (unit_start === "month") {
      if (operation === "startOf") {
        newDate.setDate(1);
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setMonth(newDate.getMonth() + 1, 0);
        newDate.setHours(23, 59, 59, 999);
      }
    } else if (unit_start === "year") {
      if (operation === "startOf") {
        newDate.setMonth(0, 1);
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setMonth(11, 31);
        newDate.setHours(23, 59, 59, 999);
      }
    }
    return { success: true, iso: newDate.toISOString(), timestamp: newDate.getTime() };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "date_utilities",
  description: "أدوات تواريخ شاملة — format, parse, diff, add, timezone convert",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/text_utilities.ts`

> Size: 6.1KB | Lines: 178 | Lang: typescript

```typescript
/**
 * Tool: text_utilities.ts
 * Category: utility
 * Description: أدوات نصوص شاملة — case conversion, count, extract, replace, slugify.
 *
 * Dependencies: none
 *
 * Input:
 *   {
 *     "operation": "uppercase" | "lowercase" | "title" | "camel" | "snake" | "kebab" |
 *                   "word_count" | "char_count" | "line_count" | "extract_emails" |
 *                   "extract_urls" | "extract_phones" | "slugify" | "reverse" |
 *                   "truncate" | "strip_html" | "encode_url" | "decode_url",
 *     "text": "...",
 *     "params": {...}
 *   }
 */

export interface TextToolInput {
  operation: string;
  text: string;
  params?: {
    length?: number;
    suffix?: string;
    separator?: string;
  };
}

export interface TextToolOutput {
  success: boolean;
  result?: string | string[] | object;
  error?: string;
  [key: string]: any;
}

export async function execute(input: TextToolInput): Promise<TextToolOutput> {
  const { operation, text = "", params = {} } = input;

  if (operation === "uppercase") return { success: true, result: text.toUpperCase() };
  if (operation === "lowercase") return { success: true, result: text.toLowerCase() };
  if (operation === "title") {
    return { success: true, result: text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) };
  }
  if (operation === "camel") {
    const words = text.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const result = words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join("");
    return { success: true, result };
  }
  if (operation === "snake") {
    return { success: true, result: text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") };
  }
  if (operation === "kebab") {
    return { success: true, result: text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") };
  }
  if (operation === "word_count") {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return { success: true, count: words.length };
  }
  if (operation === "char_count") {
    return {
      success: true,
      count: text.length,
      count_no_spaces: text.replace(/\s/g, "").length,
      count_letters: (text.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length,
      count_digits: (text.match(/\d/g) || []).length,
    };
  }
  if (operation === "line_count") {
    return { success: true, count: text.split(/\n/).length };
  }
  if (operation === "extract_emails") {
    const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    return { success: true, emails: [...new Set(emails)], count: emails.length };
  }
  if (operation === "extract_urls") {
    const urls = text.match(/https?:\/\/[^\s<>"']+/g) || [];
    return { success: true, urls: [...new Set(urls)], count: urls.length };
  }
  if (operation === "extract_phones") {
    // International + local phone patterns
    const phones = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g) || [];
    return { success: true, phones, count: phones.length };
  }
  if (operation === "slugify") {
    const slug = text
      .toString()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return { success: true, slug };
  }
  if (operation === "reverse") {
    return { success: true, result: text.split("").reverse().join("") };
  }
  if (operation === "truncate") {
    const len = params.length || 100;
    const suffix = params.suffix || "...";
    if (text.length <= len) return { success: true, result: text };
    return { success: true, result: text.slice(0, len - suffix.length) + suffix };
  }
  if (operation === "strip_html") {
    return {
      success: true,
      result: text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim(),
    };
  }
  if (operation === "encode_url") {
    try {
      return { success: true, result: encodeURIComponent(text) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  if (operation === "decode_url") {
    try {
      return { success: true, result: decodeURIComponent(text) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  if (operation === "stats") {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?؟]+/).filter((s) => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const readingTime = Math.max(1, Math.round(words.length / 200));
    return {
      success: true,
      characters: text.length,
      characters_no_spaces: text.replace(/\s/g, "").length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      reading_time_minutes: readingTime,
      avg_word_length: words.length ? (words.reduce((a, w) => a + w.length, 0) / words.length).toFixed(2) : 0,
    };
  }
  if (operation === "find_replace") {
    const find = params.find || "";
    const replace = params.replace || "";
    const useRegex = params.regex || false;
    try {
      if (useRegex) {
        const re = new RegExp(find, "g");
        const matches = (text.match(re) || []).length;
        return { success: true, result: text.replace(re, replace), matches_replaced: matches };
      } else {
        const parts = text.split(find);
        return { success: true, result: parts.join(replace), matches_replaced: parts.length - 1 };
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "text_utilities",
  description: "أدوات نصوص شاملة — case, count, extract, slugify, replace",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/json_utilities.ts`

> Size: 8.5KB | Lines: 280 | Lang: typescript

```typescript
/**
 * Tool: json_utilities.ts
 * Category: utility
 * Description: أدوات JSON شاملة — format, validate, minify, query (JSONPath), diff, merge, transform.
 *
 * Dependencies: none
 */

export interface JsonToolInput {
  operation: "format" | "minify" | "validate" | "query" | "flatten" | "unflatten" | "merge" | "diff" | "keys" | "size" | "convert_csv";
  json?: string | object;
  json2?: string | object;
  params?: {
    indent?: number;
    path?: string; // dot-notation: a.b.c
  };
}

export async function execute(input: JsonToolInput): Promise<any> {
  const { operation, params = {} } = input;

  // Parse input JSON
  let parsed: any;
  if (typeof input.json === "string") {
    try {
      parsed = JSON.parse(input.json);
    } catch (e: any) {
      if (operation === "validate") {
        return { success: false, valid: false, error: e.message };
      }
      return { success: false, error: `invalid JSON: ${e.message}` };
    }
  } else {
    parsed = input.json;
  }

  if (operation === "validate") {
    return { success: true, valid: true };
  }

  if (operation === "format") {
    const indent = params.indent || 2;
    try {
      return { success: true, result: JSON.stringify(parsed, null, indent) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "minify") {
    try {
      return { success: true, result: JSON.stringify(parsed), size: JSON.stringify(parsed).length };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "size") {
    const str = JSON.stringify(parsed);
    return {
      success: true,
      bytes: Buffer.byteLength(str, "utf8"),
      characters: str.length,
      keys_count: _countKeys(parsed),
    };
  }

  if (operation === "keys") {
    return { success: true, keys: _getAllKeys(parsed) };
  }

  if (operation === "query") {
    const path = params.path || "";
    if (!path) return { success: false, error: "path required for query" };
    const result = _queryPath(parsed, path);
    return { success: true, path, result };
  }

  if (operation === "flatten") {
    return { success: true, result: _flatten(parsed) };
  }

  if (operation === "unflatten") {
    return { success: true, result: _unflatten(parsed) };
  }

  if (operation === "merge") {
    let parsed2: any;
    if (typeof input.json2 === "string") {
      try {
        parsed2 = JSON.parse(input.json2);
      } catch (e: any) {
        return { success: false, error: `invalid json2: ${e.message}` };
      }
    } else {
      parsed2 = input.json2;
    }
    return { success: true, result: _deepMerge(parsed, parsed2) };
  }

  if (operation === "diff") {
    let parsed2: any;
    if (typeof input.json2 === "string") {
      try {
        parsed2 = JSON.parse(input.json2);
      } catch (e: any) {
        return { success: false, error: `invalid json2: ${e.message}` };
      }
    } else {
      parsed2 = input.json2;
    }
    const diffs = _diff(parsed, parsed2, "");
    return { success: true, diffs, diff_count: diffs.length };
  }

  if (operation === "convert_csv") {
    if (!Array.isArray(parsed)) {
      return { success: false, error: "JSON must be an array of objects for CSV" };
    }
    if (parsed.length === 0) {
      return { success: true, csv: "" };
    }
    const headers = Object.keys(parsed[0]);
    const rows = parsed.map((obj) => headers.map((h) => {
      const v = obj[h];
      if (v === null || v === undefined) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
    return { success: true, csv: [headers.join(","), ...rows].join("\n") };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

function _countKeys(obj: any): number {
  if (typeof obj !== "object" || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((acc, item) => acc + _countKeys(item), 0);
  return Object.keys(obj).length + Object.values(obj).reduce((acc: number, v: any) => acc + _countKeys(v), 0);
}

function _getAllKeys(obj: any, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [];
  if (Array.isArray(obj)) {
    return obj.length > 0 ? _getAllKeys(obj[0], prefix + "[0]") : [];
  }
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    keys.push(fullKey);
    if (typeof v === "object" && v !== null) {
      keys.push(..._getAllKeys(v, fullKey));
    }
  }
  return keys;
}

function _queryPath(obj: any, path: string): any {
  const parts = path.split(".").filter(Boolean);
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    const arrMatch = part.match(/^([^\]]+)\[(\d+)\]$/);
    if (arrMatch) {
      current = current[arrMatch[1]]?.[parseInt(arrMatch[2])];
    } else {
      current = current[part];
    }
  }
  return current;
}

function _flatten(obj: any, prefix = ""): Record<string, any> {
  const result: Record<string, any> = {};
  if (typeof obj !== "object" || obj === null) {
    result[prefix] = obj;
    return result;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      Object.assign(result, _flatten(item, prefix ? `${prefix}[${i}]` : `[${i}]`));
    });
  } else {
    for (const [k, v] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "object" && v !== null) {
        Object.assign(result, _flatten(v, newKey));
      } else {
        result[newKey] = v;
      }
    }
  }
  return result;
}

function _unflatten(obj: Record<string, any>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const arrMatch = part.match(/^([^\]]+)\[(\d+)\]$/);
      if (arrMatch) {
        const arrKey = arrMatch[1];
        const idx = parseInt(arrMatch[2]);
        if (!current[arrKey]) current[arrKey] = [];
        if (!current[arrKey][idx]) current[arrKey][idx] = {};
        current = current[arrKey][idx];
      } else {
        if (typeof current[part] !== "object" || current[part] === null) current[part] = {};
        current = current[part];
      }
    }
    const lastPart = parts[parts.length - 1];
    const arrMatch = lastPart.match(/^([^\]]+)\[(\d+)\]$/);
    if (arrMatch) {
      const arrKey = arrMatch[1];
      const idx = parseInt(arrMatch[2]);
      if (!current[arrKey]) current[arrKey] = [];
      current[arrKey][idx] = value;
    } else {
      current[lastPart] = value;
    }
  }
  return result;
}

function _deepMerge(a: any, b: any): any {
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return b !== undefined ? b : a;
  }
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  const result: any = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (k in result) {
      result[k] = _deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

function _diff(a: any, b: any, path: string): Array<{path: string; type: string; a?: any; b?: any}> {
  const diffs: Array<{path: string; type: string; a?: any; b?: any}> = [];
  if (typeof a !== typeof b) {
    diffs.push({ path: path || "(root)", type: "type_change", a, b });
    return diffs;
  }
  if (typeof a !== "object" || a === null || b === null) {
    if (a !== b) diffs.push({ path: path || "(root)", type: "value_change", a, b });
    return diffs;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= a.length) diffs.push({ path: `${path}[${i}]`, type: "added", b: b[i] });
      else if (i >= b.length) diffs.push({ path: `${path}[${i}]`, type: "removed", a: a[i] });
      else diffs.push(..._diff(a[i], b[i], `${path}[${i}]`));
    }
    return diffs;
  }
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of allKeys) {
    const p = path ? `${path}.${k}` : k;
    if (!(k in a)) diffs.push({ path: p, type: "added", b: b[k] });
    else if (!(k in b)) diffs.push({ path: p, type: "removed", a: a[k] });
    else diffs.push(..._diff(a[k], b[k], p));
  }
  return diffs;
}

export const tool = {
  name: "json_utilities",
  description: "أدوات JSON شاملة — format, validate, minify, query, diff, merge, transform",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/regex_tester.ts`

> Size: 3.8KB | Lines: 122 | Lang: typescript

```typescript
/**
 * Tool: regex_tester.ts
 * Category: utility
 * Description: اختبار regular expressions — match, extract, replace, validate.
 *
 * Dependencies: none
 */

export interface RegexToolInput {
  operation: "match" | "extract" | "replace" | "split" | "validate" | "explain";
  pattern: string;
  text: string;
  flags?: string;
  replacement?: string;
}

export async function execute(input: RegexToolInput): Promise<any> {
  const { operation, pattern, text, flags = "g", replacement = "" } = input;

  if (!pattern) return { success: false, error: "pattern required" };
  if (!text && operation !== "validate") return { success: false, error: "text required" };

  let re: RegExp;
  try {
    re = new RegExp(pattern, flags);
  } catch (e: any) {
    return { success: false, error: `invalid regex: ${e.message}` };
  }

  if (operation === "match") {
    const matches: any[] = [];
    let m: RegExpExecArray | null;
    const globalRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    let count = 0;
    while ((m = globalRe.exec(text)) !== null && count < 100) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
        named_groups: (m as any).groups || {},
      });
      if (m.index === globalRe.lastIndex) globalRe.lastIndex++;
      count++;
    }
    return {
      success: true,
      matches,
      count: matches.length,
      tested_pattern: pattern,
      flags,
    };
  }

  if (operation === "extract") {
    const matches = text.match(re) || [];
    return {
      success: true,
      extracted: [...new Set(matches)],
      count: matches.length,
      unique_count: new Set(matches).size,
    };
  }

  if (operation === "replace") {
    let count = 0;
    const globalRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const result = text.replace(globalRe, () => {
      count++;
      return replacement;
    });
    return { success: true, result, replacements_made: count };
  }

  if (operation === "split") {
    const parts = text.split(re);
    return { success: true, parts, count: parts.length };
  }

  if (operation === "validate") {
    return {
      success: true,
      valid: re instanceof RegExp,
      pattern,
      flags,
      source: re.source,
    };
  }

  if (operation === "explain") {
    // Simple regex explanation (basic patterns)
    const explanations: string[] = [];
    let p = pattern;
    if (p.includes("^")) explanations.push("^ → بداية النص");
    if (p.includes("$")) explanations.push("$ → نهاية النص");
    if (/\\d/.test(p)) explanations.push("\\d → رقم (0-9)");
    if (/\\w/.test(p)) explanations.push("\\w → حرف أو رقم أو _");
    if (/\\s/.test(p)) explanations.push("\\s → مسافة فارغة");
    if (/\[.*\]/.test(p)) explanations.push("[...] → مجموعة أحرف");
    if (/\+/.test(p)) explanations.push("+ → مرة أو أكثر");
    if (/\*/.test(p)) explanations.push("* → صفر أو أكثر");
    if (/\?[^?]/.test(p)) explanations.push("? → صفر أو مرة واحدة");
    if (/\{(\d+),?(\d*)\}/.test(p)) explanations.push("{n,m} → عدد محدد من المرات");
    if (/\(.*\)/.test(p)) explanations.push("(...) → مجموعة التقاط");
    return {
      success: true,
      pattern,
      explanations: explanations.length > 0 ? explanations : ["No standard patterns recognized"],
      flags: flags || "none",
      note: flags.includes("g") ? "g: global (all matches)" : flags.includes("i") ? "i: case-insensitive" : "",
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "regex_tester",
  description: "اختبار regular expressions — match, extract, replace, split, explain",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/unit_converter.ts`

> Size: 4.2KB | Lines: 141 | Lang: typescript

```typescript
/**
 * Tool: unit_converter.ts
 * Category: utility
 * Description: محول وحدات شامل — طول، وزن، حرارة، مساحة، حجم، سرعة، بيانات.
 *
 * Dependencies: none
 */

const CONVERSIONS = {
  // Length (meters as base)
  length: {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
  },
  // Weight (grams as base)
  weight: {
    mg: 0.001, g: 1, kg: 1000, t: 1_000_000,
    oz: 28.3495, lb: 453.592,
  },
  // Volume (liters as base)
  volume: {
    ml: 0.001, l: 1, m3: 1000,
    tsp: 0.00492892, tbsp: 0.0147868, cup: 0.236588,
    pt: 0.473176, qt: 0.946353, gal: 3.78541,
  },
  // Area (m² as base)
  area: {
    mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1_000_000,
    ha: 10000, acre: 4046.86, ft2: 0.092903, in2: 0.00064516,
  },
  // Speed (m/s as base)
  speed: {
    mps: 1, kph: 0.277778, mph: 0.44704, knot: 0.514444,
  },
  // Data (bytes as base)
  data: {
    B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4,
    PB: 1024 ** 5,
  },
  // Time (seconds as base)
  time: {
    ms: 0.001, s: 1, min: 60, hr: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600,
  },
  // Pressure (pascal as base)
  pressure: {
    Pa: 1, kPa: 1000, MPa: 1_000_000, bar: 100_000, atm: 101_325, psi: 6894.76, torr: 133.322,
  },
  // Angle (radians as base)
  angle: {
    rad: 1, deg: Math.PI / 180, grad: Math.PI / 200, turn: 2 * Math.PI,
  },
};

const TEMPERATURE_UNITS = ["C", "F", "K"] as const;
type TempUnit = typeof TEMPERATURE_UNITS[number];

function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * 5 / 9;
  else if (from === "K") celsius = value - 273.15;
  else throw new Error(`unknown temperature unit: ${from}`);

  // Then to target
  if (to === "C") return celsius;
  if (to === "F") return celsius * 9 / 5 + 32;
  if (to === "K") return celsius + 273.15;
  throw new Error(`unknown temperature unit: ${to}`);
}

export async function execute(input: {
  operation: "convert" | "list_units";
  category?: string;
  value?: number;
  from?: string;
  to?: string;
}): Promise<any> {
  const { operation, category, value, from, to } = input;

  if (operation === "list_units") {
    const result: any = {};
    for (const [cat, units] of Object.entries(CONVERSIONS)) {
      result[cat] = Object.keys(units);
    }
    result.temperature = [...TEMPERATURE_UNITS];
    return { success: true, categories: result };
  }

  if (operation === "convert") {
    if (value === undefined || !from || !to) {
      return { success: false, error: "value, from, and to required" };
    }

    // Temperature is special
    if (category === "temperature" || TEMPERATURE_UNITS.includes(from as TempUnit)) {
      try {
        const result = convertTemperature(Number(value), from, to);
        return {
          success: true,
          value: Number(value),
          from,
          to,
          result: Math.round(result * 10000) / 10000,
          category: "temperature",
        };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    if (!category) return { success: false, error: "category required (or use temperature)" };
    const cat = category as keyof typeof CONVERSIONS;
    const catUnits = (CONVERSIONS as any)[cat];
    if (!catUnits) return { success: false, error: `unknown category: ${cat}` };
    if (!(from in catUnits)) return { success: false, error: `unknown unit '${from}' in ${cat}` };
    if (!(to in catUnits)) return { success: false, error: `unknown unit '${to}' in ${cat}` };

    const baseValue = Number(value) * catUnits[from];
    const result = baseValue / catUnits[to];

    return {
      success: true,
      value: Number(value),
      from,
      to,
      result: Math.round(result * 1000000) / 1000000,
      category,
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "unit_converter",
  description: "محول وحدات شامل — طول، وزن، حرارة، مساحة، حجم، سرعة، بيانات",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/color_utilities.ts`

> Size: 8.2KB | Lines: 248 | Lang: typescript

```typescript
/**
 * Tool: color_utilities.ts
 * Category: utility/design
 * Description: أدوات ألوان شاملة — تحويل بين HEX, RGB, HSL, HSV + توليد gradients و palettes.
 *
 * Dependencies: none
 */

export async function execute(input: {
  operation: "convert" | "info" | "palette" | "gradient" | "mix" | "complement" | "brightness" | "random";
  color?: string;
  format?: "hex" | "rgb" | "hsl" | "hsv";
  count?: number;
  color2?: string;
  weight?: number;
}): Promise<any> {
  const { operation, color, format = "hex", count = 5, color2, weight = 0.5 } = input;

  if (operation === "random") {
    const c = randomColor();
    return { success: true, color: c, ...parseColor(c) };
  }

  if (!color && operation !== "random") {
    return { success: false, error: "color required" };
  }

  const parsed = parseColor(color!);
  if (!parsed) return { success: false, error: `invalid color: ${color}` };

  if (operation === "convert") {
    return {
      success: true,
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
      rgb: { r: parsed.r, g: parsed.g, b: parsed.b },
      hsl: rgbToHsl(parsed.r, parsed.g, parsed.b),
      hsv: rgbToHsv(parsed.r, parsed.g, parsed.b),
      format,
    };
  }

  if (operation === "info") {
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    return {
      success: true,
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
      rgb: { r: parsed.r, g: parsed.g, b: parsed.b },
      hsl,
      hsv: rgbToHsv(parsed.r, parsed.g, parsed.b),
      brightness: getBrightness(parsed.r, parsed.g, parsed.b),
      luminance: getLuminance(parsed.r, parsed.g, parsed.b),
      is_light: getBrightness(parsed.r, parsed.g, parsed.b) > 128,
      contrast_with_white: getContrast({ r: 255, g: 255, b: 255 }, parsed),
      contrast_with_black: getContrast({ r: 0, g: 0, b: 0 }, parsed),
      complementary: rgbToHex(255 - parsed.r, 255 - parsed.g, 255 - parsed.b),
    };
  }

  if (operation === "palette") {
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    const palette: string[] = [];
    // Generate analogous palette (vary hue)
    for (let i = 0; i < count; i++) {
      const newH = (hsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360;
      const rgb = hslToRgb(newH, hsl.s, hsl.l);
      palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
    return { success: true, palette, base_color: color, count };
  }

  if (operation === "gradient") {
    if (!color2) return { success: false, error: "color2 required for gradient" };
    const parsed2 = parseColor(color2);
    if (!parsed2) return { success: false, error: `invalid color2: ${color2}` };
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const r = Math.round(parsed.r + (parsed2.r - parsed.r) * t);
      const g = Math.round(parsed.g + (parsed2.g - parsed.g) * t);
      const b = Math.round(parsed.b + (parsed2.b - parsed.b) * t);
      colors.push(rgbToHex(r, g, b));
    }
    return { success: true, gradient: colors, from: color, to: color2, count };
  }

  if (operation === "mix") {
    if (!color2) return { success: false, error: "color2 required for mix" };
    const parsed2 = parseColor(color2);
    if (!parsed2) return { success: false, error: `invalid color2: ${color2}` };
    const w = Math.max(0, Math.min(1, weight));
    const r = Math.round(parsed.r * (1 - w) + parsed2.r * w);
    const g = Math.round(parsed.g * (1 - w) + parsed2.g * w);
    const b = Math.round(parsed.b * (1 - w) + parsed2.b * w);
    return {
      success: true,
      mixed: rgbToHex(r, g, b),
      rgb: { r, g, b },
      from: color,
      to: color2,
      weight: w,
    };
  }

  if (operation === "complement") {
    return {
      success: true,
      original: color,
      complementary: rgbToHex(255 - parsed.r, 255 - parsed.g, 255 - parsed.b),
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
    };
  }

  if (operation === "brightness") {
    const brightness = getBrightness(parsed.r, parsed.g, parsed.b);
    return {
      success: true,
      brightness, // 0-255
      is_light: brightness > 128,
      is_dark: brightness <= 128,
      recommended_text: brightness > 128 ? "#000000" : "#FFFFFF",
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

function parseColor(c: string): { r: number; g: number; b: number } | null {
  // HEX
  if (c.startsWith("#")) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
    if (hex.length !== 6) return null;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  // rgb(...)
  const rgbMatch = c.match(/^rgb\(?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)?$/i);
  if (rgbMatch) {
    return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
  }
  // hsl(...) — convert to RGB
  const hslMatch = c.match(/^hsl\(?\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)?$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    const rgb = hslToRgb(h, s, l);
    return rgb;
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function getBrightness(r: number, g: number, b: number): number {
  return Math.round((r * 299 + g * 587 + b * 114) / 1000);
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrast(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): string {
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio.toFixed(2) + ":1";
}

function randomColor(): string {
  return rgbToHex(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  );
}

export const tool = {
  name: "color_utilities",
  description: "أدوات ألوان — convert, palette, gradient, mix, complement, brightness",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/network_utilities.ts`

> Size: 6.2KB | Lines: 195 | Lang: typescript

```typescript
/**
 * Tool: network_utilities.ts
 * Category: web/utility
 * Description: أدوات شبكة — DNS lookup, ping, port check, IP info, URL parser.
 *
 * Dependencies: built-in Node.js modules (dns, net, http, url)
 */

import * as dns from "dns";
import * as net from "net";
import * as url from "url";

export async function execute(input: {
  operation: "dns_lookup" | "dns_reverse" | "port_check" | "url_parse" | "ip_info" | "get_headers" | "validate_url" | "get_my_ip";
  hostname?: string;
  ip?: string;
  url?: string;
  port?: number;
  timeout?: number;
}): Promise<any> {
  const { operation, hostname, ip, url: urlStr, port, timeout = 5000 } = input;

  if (operation === "dns_lookup") {
    if (!hostname) return { success: false, error: "hostname required" };
    try {
      const records = await dns.promises.lookup(hostname, { all: true });
      return {
        success: true,
        hostname,
        addresses: records.map((r) => ({ address: r.address, family: r.family === 4 ? "IPv4" : "IPv6" })),
        count: records.length,
      };
    } catch (e: any) {
      return { success: false, error: `DNS lookup failed: ${e.message}` };
    }
  }

  if (operation === "dns_reverse") {
    if (!ip) return { success: false, error: "ip required" };
    try {
      const hostnames = await dns.promises.reverse(ip);
      return { success: true, ip, hostnames };
    } catch (e: any) {
      return { success: false, error: `reverse DNS failed: ${e.message}` };
    }
  }

  if (operation === "port_check") {
    if (!hostname || !port) return { success: false, error: "hostname and port required" };
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const t = setTimeout(() => {
        socket.destroy();
        resolve({ success: true, hostname, port, open: false, error: "timeout" });
      }, timeout);
      socket.setTimeout(timeout);
      socket.on("connect", () => {
        clearTimeout(t);
        socket.destroy();
        resolve({ success: true, hostname, port, open: true });
      });
      socket.on("timeout", () => {
        clearTimeout(t);
        socket.destroy();
        resolve({ success: true, hostname, port, open: false, error: "timeout" });
      });
      socket.on("error", (e) => {
        clearTimeout(t);
        resolve({ success: true, hostname, port, open: false, error: e.message });
      });
      socket.connect(port, hostname);
    });
  }

  if (operation === "url_parse") {
    if (!urlStr) return { success: false, error: "url required" };
    try {
      const parsed = new URL(urlStr);
      return {
        success: true,
        href: parsed.href,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        username: parsed.username,
        password: parsed.password,
        search_params: Object.fromEntries(parsed.searchParams.entries()),
      };
    } catch (e: any) {
      return { success: false, error: `invalid URL: ${e.message}` };
    }
  }

  if (operation === "validate_url") {
    if (!urlStr) return { success: false, error: "url required" };
    try {
      const parsed = new URL(urlStr);
      return {
        success: true,
        valid: true,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        is_secure: parsed.protocol === "https:",
      };
    } catch {
      return { success: true, valid: false, url: urlStr };
    }
  }

  if (operation === "ip_info") {
    const targetIp = ip || hostname;
    if (!targetIp) return { success: false, error: "ip or hostname required" };
    const isIp = net.isIP(targetIp) > 0;
    let resolvedIp = targetIp;
    if (!isIp && hostname) {
      try {
        const records = await dns.promises.lookup(hostname, { all: true });
        if (records.length > 0) resolvedIp = records[0].address;
      } catch (e: any) {
        return { success: false, error: `failed to resolve: ${e.message}` };
      }
    }
    const isPrivate = net.isIP(resolvedIp) === 4 && (
      resolvedIp.startsWith("10.") ||
      resolvedIp.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(resolvedIp) ||
      resolvedIp.startsWith("127.")
    );
    return {
      success: true,
      ip: resolvedIp,
      version: net.isIP(resolvedIp) === 4 ? "IPv4" : net.isIP(resolvedIp) === 6 ? "IPv6" : "invalid",
      is_private: isPrivate,
      is_loopback: resolvedIp.startsWith("127."),
    };
  }

  if (operation === "get_headers") {
    if (!urlStr) return { success: false, error: "url required" };
    try {
      const parsed = new URL(urlStr);
      const lib = parsed.protocol === "https:" ? await import("https") : await import("http");
      return new Promise((resolve) => {
        const req = lib.request(parsed, { method: "HEAD", timeout }, (res) => {
          resolve({
            success: true,
            status: res.statusCode,
            status_text: res.statusMessage,
            headers: res.headers,
          });
          res.destroy();
        });
        req.on("error", (e) => resolve({ success: false, error: e.message }));
        req.on("timeout", () => { req.destroy(); resolve({ success: false, error: "timeout" }); });
        req.end();
      });
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "get_my_ip") {
    return new Promise((resolve) => {
      const req = require("https").request("https://api.ipify.org?format=json", (res: any) => {
        let data = "";
        res.on("data", (c: any) => (data += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(data);
            resolve({ success: true, ip: j.ip });
          } catch {
            resolve({ success: false, error: "could not parse response" });
          }
        });
      });
      req.on("error", (e: any) => resolve({ success: false, error: e.message }));
      req.on("timeout", () => { req.destroy(); resolve({ success: false, error: "timeout" }); });
      req.setTimeout(timeout);
      req.end();
    });
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "network_utilities",
  description: "أدوات شبكة — DNS, port check, URL parser, IP info, headers",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/validation_utilities.ts`

> Size: 7.6KB | Lines: 225 | Lang: typescript

```typescript
/**
 * Tool: validation_utilities.ts
 * Category: utility
 * Description: أدوات تحقق شاملة — email, phone, URL, IP, credit card, ISBN, UUID, JWT.
 *
 * Dependencies: none
 */

export async function execute(input: {
  operation: "email" | "phone" | "url" | "ip" | "credit_card" | "isbn" | "uuid" | "jwt" | "password_strength" | "username";
  value: string;
  params?: { strict?: boolean };
}): Promise<any> {
  const { operation, value = "", params = {} } = input;

  if (operation === "email") {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const valid = re.test(value);
    const result: any = { success: true, valid, value };
    if (valid) {
      const [local, domain] = value.split("@");
      result.parts = { local, domain };
      result.has_subdomain = domain.split(".").length > 2;
      result.tld = domain.split(".").pop();
    }
    return result;
  }

  if (operation === "phone") {
    // International phone format: +CC-NNNNNNNNN
    const cleaned = value.replace(/[\s\-().]/g, "");
    const re = /^\+?(\d{1,3})(\d{4,14})$/;
    const valid = re.test(cleaned);
    const result: any = { success: true, valid, value, cleaned };
    if (valid) {
      const m = cleaned.match(re);
      if (m) {
        result.country_code = "+" + m[1];
        result.number = m[2];
      }
    }
    return result;
  }

  if (operation === "url") {
    try {
      const parsed = new URL(value);
      return {
        success: true,
        valid: true,
        value,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        is_secure: parsed.protocol === "https:",
        has_path: parsed.pathname !== "/",
        has_query: parsed.search !== "",
      };
    } catch {
      return { success: true, valid: false, value };
    }
  }

  if (operation === "ip") {
    const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const v6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    if (v4.test(value)) {
      const parts = value.split(".").map(Number);
      const valid = parts.every((p) => p >= 0 && p <= 255);
      return {
        success: true,
        valid,
        value,
        version: "IPv4",
        is_private: valid && (parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || parts[0] === 127),
        is_loopback: valid && parts[0] === 127,
      };
    }
    if (v6.test(value)) {
      return { success: true, valid: true, value, version: "IPv6" };
    }
    return { success: true, valid: false, value };
  }

  if (operation === "credit_card") {
    const cleaned = value.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) {
      return { success: true, valid: false, value, reason: "Invalid length" };
    }
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    const valid = sum % 10 === 0;
    // Detect card type
    let type = "unknown";
    if (/^4/.test(cleaned)) type = "visa";
    else if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) type = "mastercard";
    else if (/^3[47]/.test(cleaned)) type = "amex";
    else if (/^6(?:011|5)/.test(cleaned)) type = "discover";
    else if (/^(?:2131|1800|35)/.test(cleaned)) type = "jcb";
    return { success: true, valid, value, cleaned, type, length: cleaned.length };
  }

  if (operation === "isbn") {
    const cleaned = value.replace(/[-\s]/g, "");
    if (/^\d{10}$/.test(cleaned)) {
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
      const last = cleaned[9] === "X" ? 10 : parseInt(cleaned[9]);
      sum += last;
      return { success: true, valid: sum % 11 === 0, value, cleaned, version: "ISBN-10" };
    }
    if (/^\d{13}$/.test(cleaned)) {
      let sum = 0;
      for (let i = 0; i < 12; i++) sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
      const check = (10 - (sum % 10)) % 10;
      return { success: true, valid: check === parseInt(cleaned[12]), value, cleaned, version: "ISBN-13" };
    }
    return { success: true, valid: false, value, reason: "Invalid ISBN format" };
  }

  if (operation === "uuid") {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const valid = re.test(value);
    const result: any = { success: true, valid, value };
    if (valid) {
      const version = parseInt(value[14], 16);
      const variant = parseInt(value[19], 16);
      result.version = version;
      result.variant = variant >= 8 ? (variant >= 12 ? "RFC 4122" : "Microsoft") : "NCS";
    }
    return result;
  }

  if (operation === "jwt") {
    const parts = value.split(".");
    if (parts.length !== 3) {
      return { success: true, valid: false, value, reason: "JWT must have 3 parts" };
    }
    try {
      const decode = (s: string) => JSON.parse(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const result: any = {
        success: true,
        valid: true,
        value,
        header,
        payload,
      };
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        result.expires_at = expDate.toISOString();
        result.is_expired = Date.now() > payload.exp * 1000;
      }
      if (payload.iat) {
        result.issued_at = new Date(payload.iat * 1000).toISOString();
      }
      return result;
    } catch (e: any) {
      return { success: true, valid: false, value, error: e.message };
    }
  }

  if (operation === "password_strength") {
    const password = value;
    const checks = {
      length_8: password.length >= 8,
      length_12: password.length >= 12,
      has_lowercase: /[a-z]/.test(password),
      has_uppercase: /[A-Z]/.test(password),
      has_digit: /\d/.test(password),
      has_special: /[^a-zA-Z0-9]/.test(password),
      no_common_patterns: !/password|123456|qwerty|admin|letmein/i.test(password),
      no_repeating: !/(.)\1{2,}/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let strength = "very_weak";
    if (score >= 7) strength = "very_strong";
    else if (score >= 5) strength = "strong";
    else if (score >= 3) strength = "medium";
    else if (score >= 2) strength = "weak";
    return {
      success: true,
      value: "*".repeat(password.length),
      length: password.length,
      score,
      max_score: 8,
      strength,
      checks,
    };
  }

  if (operation === "username") {
    const strict = params.strict;
    const re = strict ? /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/ : /^[a-zA-Z0-9_]{3,20}$/;
    const valid = re.test(value);
    return {
      success: true,
      valid,
      value,
      length: value.length,
      has_valid_chars: /^[a-zA-Z0-9_]+$/.test(value),
      starts_with_letter: /^[a-zA-Z]/.test(value),
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "validation_utilities",
  description: "أدوات تحقق — email, phone, URL, IP, credit card, ISBN, UUID, JWT, password",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/cron_utilities.ts`

> Size: 6.7KB | Lines: 194 | Lang: typescript

```typescript
/**
 * Tool: cron_utilities.ts
 * Category: utility
 * Description: أدوات cron — parse, validate, describe, next_run, list schedule.
 *
 * Dependencies: none
 */

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function execute(input: {
  operation: "parse" | "validate" | "describe" | "next_run" | "schedule";
  cron?: string;
  count?: number;
  from?: string; // ISO date for next_run start
}): Promise<any> {
  const { operation, cron, count = 5, from } = input;

  if (operation === "validate") {
    if (!cron) return { success: false, error: "cron required" };
    const valid = validateCron(cron);
    return { success: true, valid, cron };
  }

  if (operation === "parse") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    return { success: true, cron, parts };
  }

  if (operation === "describe") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    const description = describeCron(parts);
    return { success: true, cron, description, parts };
  }

  if (operation === "next_run") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    const start = from ? new Date(from) : new Date();
    if (isNaN(start.getTime())) return { success: false, error: `invalid from date: ${from}` };
    const next = computeNextRun(parts, start);
    return { success: true, cron, from: start.toISOString(), next_run: next?.toISOString() };
  }

  if (operation === "schedule") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    const start = from ? new Date(from) : new Date();
    if (isNaN(start.getTime())) return { success: false, error: `invalid from date: ${from}` };
    const runs: string[] = [];
    let current = start;
    for (let i = 0; i < count; i++) {
      const next = computeNextRun(parts, current);
      if (!next) break;
      runs.push(next.toISOString());
      current = new Date(next.getTime() + 1000); // advance 1s to find next
    }
    return { success: true, cron, schedule: runs, count: runs.length };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

interface CronParts {
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[]; // 1-12
  dayOfWeek: number[]; // 0-6 (0 = Sunday)
}

function validateCron(cron: string): boolean {
  return parseCron(cron) !== null;
}

function parseCron(cron: string): CronParts | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return null;

  try {
    return {
      minute: parseField(parts[0], 0, 59),
      hour: parseField(parts[1], 0, 23),
      dayOfMonth: parseField(parts[2], 1, 31),
      month: parseField(parts[3], 1, 12),
      dayOfWeek: parseField(parts[4], 0, 6),
    };
  } catch {
    return null;
  }
}

function parseField(field: string, min: number, max: number): number[] {
  if (field === "*") {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
  const result = new Set<number>();
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      // Step: e.g. */15 or 0-30/5
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr);
      if (isNaN(step) || step <= 0) throw new Error("invalid step");
      let lo = min, hi = max;
      if (range !== "*") {
        if (range.includes("-")) {
          const [a, b] = range.split("-").map(Number);
          lo = a; hi = b;
        } else {
          lo = parseInt(range);
          hi = max;
        }
      }
      for (let i = lo; i <= hi; i += step) {
        if (i >= min && i <= max) result.add(i);
      }
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) {
        if (i >= min && i <= max) result.add(i);
      }
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= min && n <= max) result.add(n);
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

function describeCron(parts: CronParts): string {
  const m = parts.minute, h = parts.hour, dom = parts.dayOfMonth, mon = parts.month, dow = parts.dayOfWeek;

  // Common patterns
  if (m.length === 60 && h.length === 24 && dom.length === 31 && mon.length === 12 && dow.length === 7) {
    return "Every minute";
  }
  if (m.length === 1 && h.length === 24) {
    return `Every hour at minute ${m[0]}`;
  }
  if (m.length === 1 && h.length === 1) {
    return `Every day at ${String(h[0]).padStart(2, "0")}:${String(m[0]).padStart(2, "0")}`;
  }
  if (m.length === 1 && h.length === 1 && dow.length === 1) {
    return `Every ${DAY_NAMES[dow[0]]} at ${String(h[0]).padStart(2, "0")}:${String(m[0]).padStart(2, "0")}`;
  }
  if (m.length === 1 && h.length === 1 && dom.length === 1 && mon.length === 1) {
    return `Every ${MONTH_NAMES[mon[0] - 1]} ${dom[0]} at ${String(h[0]).padStart(2, "0")}:${String(m[0]).padStart(2, "0")}`;
  }

  // Generic description
  const parts_str = [];
  if (m.length < 60) parts_str.push(`minute: ${m.join(",")}`);
  if (h.length < 24) parts_str.push(`hour: ${h.join(",")}`);
  if (dom.length < 31) parts_str.push(`day-of-month: ${dom.join(",")}`);
  if (mon.length < 12) parts_str.push(`month: ${mon.map((m) => MONTH_NAMES[m - 1]).join(",")}`);
  if (dow.length < 7) parts_str.push(`day-of-week: ${dow.map((d) => DAY_NAMES[d]).join(",")}`);
  return `Runs when: ${parts_str.join(" | ")}`;
}

function computeNextRun(parts: CronParts, from: Date): Date | null {
  // Brute-force search (next 1 year max)
  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setMinutes(next.getMinutes() + 1);

  for (let i = 0; i < 525600; i++) { // up to 1 year in minutes
    if (
      parts.minute.includes(next.getMinutes()) &&
      parts.hour.includes(next.getHours()) &&
      parts.dayOfMonth.includes(next.getDate()) &&
      parts.month.includes(next.getMonth() + 1) &&
      parts.dayOfWeek.includes(next.getDay())
    ) {
      return next;
    }
    next.setMinutes(next.getMinutes() + 1);
  }
  return null;
}

export const tool = {
  name: "cron_utilities",
  description: "أدوات cron — parse, validate, describe, next_run, schedule",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/nodejs/hash_utilities.ts`

> Size: 4.3KB | Lines: 152 | Lang: typescript

```typescript
/**
 * Tool: hash_utilities.ts
 * Category: utility/security
 * Description: أدوات hash شاملة — MD5, SHA-1, SHA-256, SHA-512, HMAC, bcrypt-style.
 *
 * Dependencies: built-in Node.js crypto module
 */

import * as crypto from "crypto";

export async function execute(input: {
  operation: "hash" | "hmac" | "uuid" | "random_bytes" | "pbkdf2" | "scrypt" | "cipher_info";
  data?: string;
  algorithm?: string;
  secret?: string;
  encoding?: "hex" | "base64" | "latin1";
  length?: number;
  iterations?: number;
  salt?: string;
}): Promise<any> {
  const {
    operation,
    data = "",
    algorithm = "sha256",
    secret = "",
    encoding = "hex",
    length = 32,
    iterations = 100000,
    salt,
  } = input;

  if (operation === "hash") {
    try {
      const hash = crypto.createHash(algorithm);
      hash.update(data, "utf8");
      return {
        success: true,
        hash: hash.digest(encoding),
        algorithm,
        encoding,
        input_length: data.length,
      };
    } catch (e: any) {
      return { success: false, error: `invalid algorithm: ${e.message}` };
    }
  }

  if (operation === "hmac") {
    try {
      const hmac = crypto.createHmac(algorithm, secret);
      hmac.update(data, "utf8");
      return {
        success: true,
        hmac: hmac.digest(encoding),
        algorithm,
        secret_length: secret.length,
        input_length: data.length,
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "uuid") {
    return {
      success: true,
      uuid_v4: crypto.randomUUID(),
      uuid_v1: generateUUIDv1(),
    };
  }

  if (operation === "random_bytes") {
    const bytes = crypto.randomBytes(length);
    return {
      success: true,
      bytes,
      hex: bytes.toString("hex"),
      base64: bytes.toString("base64"),
      length,
    };
  }

  if (operation === "pbkdf2") {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex");
    const keyLength = 64;
    return new Promise((resolve) => {
      crypto.pbkdf2(data, actualSalt, iterations, keyLength, algorithm, (err, key) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        resolve({
          success: true,
          derived_key: key.toString("hex"),
          salt: actualSalt,
          iterations,
          key_length: keyLength,
          algorithm,
        });
      });
    });
  }

  if (operation === "scrypt") {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex");
    const keyLength = 64;
    return new Promise((resolve) => {
      crypto.scrypt(data, actualSalt, keyLength, (err, key) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        resolve({
          success: true,
          derived_key: key.toString("hex"),
          salt: actualSalt,
          key_length: keyLength,
          algorithm: "scrypt",
        });
      });
    });
  }

  if (operation === "cipher_info") {
    const ciphers = crypto.getCiphers();
    const hashes = crypto.getHashes();
    return {
      success: true,
      cipher_count: ciphers.length,
      hash_count: hashes.length,
      common_hashes: hashes.filter((h) => ["md5", "sha1", "sha256", "sha512"].includes(h)),
      common_ciphers: ciphers.filter((c) => ["aes-256-cbc", "aes-256-gcm", "aes-128-cbc"].includes(c)),
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

function generateUUIDv1(): string {
  // Simple v1 UUID (timestamp-based)
  const now = Date.now();
  const hex = now.toString(16).padStart(12, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-1${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}-${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}`;
}

export const tool = {
  name: "hash_utilities",
  description: "أدوات hash — MD5, SHA, HMAC, PBKDF2, scrypt, UUID",
  execute,
};

export default tool;

```

---

## `src/lib/tools-registry/python/sentiment_analysis.py`

> Size: 5.9KB | Lines: 164 | Lang: python

```python
"""
Tool: sentiment_analysis
Category: ai/nlp
Package: vaderSentiment, textblob
Description: تحليل المشاعر في نص معين — يحدد إيجابي/سلبي/محايد مع نسبة الثقة.

Dependencies:
  - vaderSentiment (pip install vaderSentiment)
  - textblob (pip install textblob)

Input:
  {
    "text": "I love this product! It's amazing.",
    "language": "auto" | "en" | "ar"
  }

Output:
  {
    "success": true,
    "sentiment": "positive" | "negative" | "neutral",
    "score": 0.85,        # -1.0 to 1.0
    "confidence": 0.92,   # 0.0 to 1.0
    "language": "en",
    "details": { "pos": 0.6, "neg": 0.05, "neu": 0.35, "compound": 0.85 }
  }
"""
import sys
import json
import os

# Ensure site-packages are on path
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages", "/home/z/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def analyze(text: str, language: str = "auto"):
    """Analyze sentiment of text. Auto-detect language if needed."""
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    # Detect language if auto
    detected_lang = "en"
    if language == "auto":
        try:
            # Try Arabic first (RTL chars)
            arabic_chars = sum(1 for c in text if "\u0600" <= c <= "\u06FF")
            if arabic_chars > len(text) * 0.3:
                detected_lang = "ar"
            else:
                detected_lang = "en"
        except Exception:
            detected_lang = "en"
    else:
        detected_lang = language

    details = {}
    score = 0.0
    sentiment = "neutral"
    confidence = 0.5

    try:
        if detected_lang == "ar":
            # Use vaderSentiment (works on Arabic social media too if normalized)
            try:
                from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
                analyzer = SentimentIntensityAnalyzer()
                vs = analyzer.polarity_scores(text)
                score = vs["compound"]
                details = vs
            except ImportError:
                # Fallback: textblob-style word-list
                score = _simple_ar_sentiment(text)
                details = {"compound": score, "method": "simple_wordlist"}
        else:
            # English: use vaderSentiment
            try:
                from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
                analyzer = SentimentIntensityAnalyzer()
                vs = analyzer.polarity_scores(text)
                score = vs["compound"]
                details = vs
            except ImportError:
                # Fallback: textblob
                try:
                    from textblob import TextBlob
                    blob = TextBlob(text)
                    score = float(blob.sentiment.polarity)
                    details = {"polarity": score, "subjectivity": float(blob.sentiment.subjectivity)}
                except ImportError:
                    score = _simple_en_sentiment(text)
                    details = {"compound": score, "method": "simple_wordlist"}

        # Classify
        if score >= 0.05:
            sentiment = "positive"
            confidence = min(1.0, abs(score) + 0.1)
        elif score <= -0.05:
            sentiment = "negative"
            confidence = min(1.0, abs(score) + 0.1)
        else:
            sentiment = "neutral"
            confidence = 0.5 + (0.5 - abs(score)) * 0.5

        return {
            "success": True,
            "sentiment": sentiment,
            "score": round(score, 4),
            "confidence": round(confidence, 4),
            "language": detected_lang,
            "details": {k: round(v, 4) if isinstance(v, float) else v for k, v in details.items()},
        }
    except Exception as e:
        return {"success": False, "error": f"sentiment analysis failed: {str(e)[:200]}"}


def _simple_ar_sentiment(text: str) -> float:
    """Simple Arabic word-list sentiment (fallback)."""
    pos_words = {"جيد", "ممتاز", "رائع", "حلو", "جميل", "سعيد", "حب", "أحب", "شكرا", "مذهل", "مفيد", "ناجح", "فرح"}
    neg_words = {"سيء", "سيئ", "رديء", "حزين", "كره", "أكره", "غلط", "خطأ", "فشل", "مشكلة", "صعب", "ضعيف", "مزعج"}
    tokens = text.split()
    pos = sum(1 for t in tokens if t in pos_words)
    neg = sum(1 for t in tokens if t in neg_words)
    total = max(1, len(tokens))
    return (pos - neg) / total


def _simple_en_sentiment(text: str) -> float:
    """Simple English word-list sentiment (fallback)."""
    pos_words = {"good", "great", "excellent", "amazing", "love", "happy", "wonderful", "fantastic", "best", "awesome", "nice", "perfect"}
    neg_words = {"bad", "terrible", "awful", "hate", "sad", "horrible", "worst", "poor", "disappointed", "angry", "ugly", "wrong"}
    tokens = text.lower().split()
    pos = sum(1 for t in tokens if t in pos_words)
    neg = sum(1 for t in tokens if t in neg_words)
    total = max(1, len(tokens))
    return (pos - neg) / total



def _dispatch(args):
    return analyze(args.get("text", ""), args.get("language", "auto"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="Text to analyze")
    parser.add_argument("--language", default="auto")
    args = parser.parse_args()
    result = analyze(args.text, args.language)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/text_classifier.py`

> Size: 5.3KB | Lines: 154 | Lang: python

```python
"""
Tool: text_classifier
Category: ai/nlp
Package: scikit-learn, numpy
Description: تصنيف نص إلى فئة من فئات محددة باستخدام TF-IDF + Naive Bayes.

Dependencies:
  - scikit-learn (pip install scikit-learn)
  - numpy (pip install numpy)

Input:
  {
    "text": "النص المراد تصنيفه",
    "categories": ["tech", "sports", "politics"]  # optional, defaults to built-in
  }

Output:
  {
    "success": true,
    "category": "tech",
    "confidence": 0.87,
    "all_scores": {"tech": 0.87, "sports": 0.08, "politics": 0.05}
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

# Built-in training data (small but works for demos)
TRAINING_DATA = {
    "tech": [
        "computer software hardware programming code algorithm database network server",
        "ai machine learning python javascript framework api cloud docker kubernetes",
        "iphone android smartphone laptop processor ram gpu motherboard",
        "software development git github deployment microservices",
        "data science analytics visualization dashboard etl pipeline",
    ],
    "sports": [
        "football basketball soccer tennis baseball cricket rugby golf",
        "olympics athlete championship tournament league match goal score",
        "team player coach referee stadium fan victory defeat",
        "swimming running cycling marathon race competition medal",
        "world cup premier league nba nfl fifa uefa",
    ],
    "politics": [
        "election government president minister parliament congress senate",
        "policy law bill vote campaign democracy republican democrat",
        "political party candidate legislation foreign affairs diplomacy",
        "prime minister cabinet opposition rally debate",
        "constitution reform treaty alliance sanction",
    ],
    "business": [
        "company market stock investment profit revenue sales customer",
        "startup entrepreneur ceo cfo acquisition merger ipo shares",
        "trade commerce finance economy budget tax banking",
        "marketing strategy brand advertising campaign growth",
        "supply chain logistics manufacturing retail wholesale",
    ],
    "health": [
        "doctor patient hospital medicine disease treatment symptoms",
        "health medical clinic surgery therapy diagnosis prescription",
        "virus infection vaccine immunity wellness nutrition diet",
        "mental health psychology stress anxiety depression therapy",
        "fitness exercise yoga meditation sleep lifestyle",
    ],
    "education": [
        "school university student teacher professor lecture course",
        "education learning study exam test homework assignment",
        "academic research paper thesis dissertation science",
        "curriculum subject mathematics literature history chemistry",
        "scholarship degree diploma certificate online learning",
    ],
}


def classify(text: str, categories=None):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.naive_bayes import MultinomialNB
        from sklearn.pipeline import Pipeline
    except ImportError as e:
        return {"success": False, "error": f"scikit-learn not installed: {e}"}

    # Select categories
    cats = categories if categories else list(TRAINING_DATA.keys())
    cats = [c for c in cats if c in TRAINING_DATA]
    if not cats:
        return {"success": False, "error": "no valid categories"}

    # Build training data
    train_texts = []
    train_labels = []
    for cat in cats:
        for sample in TRAINING_DATA[cat]:
            train_texts.append(sample)
            train_labels.append(cat)

    # Train
    model = Pipeline([
        ("tfidf", TfidfVectorizer(lowercase=True, stop_words="english")),
        ("clf", MultinomialNB()),
    ])
    model.fit(train_texts, train_labels)

    # Predict
    probs = model.predict_proba([text])[0]
    classes = model.classes_

    scores = {cls: round(float(p), 4) for cls, p in zip(classes, probs)}
    best_idx = probs.argmax()
    best_cat = classes[best_idx]
    confidence = float(probs[best_idx])

    return {
        "success": True,
        "category": best_cat,
        "confidence": round(confidence, 4),
        "all_scores": scores,
    }



def _dispatch(args):
    return classify(args.get("text", ""), args.get("categories"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--categories", nargs="*", default=None)
    args = parser.parse_args()
    result = classify(args.text, args.categories)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/text_summarizer.py`

> Size: 4.6KB | Lines: 142 | Lang: python

```python
"""
Tool: text_summarizer
Category: ai/nlp
Package: nltk, scikit-learn
Description: تلخيص نص طويل باستخدام extractive summarization (TF-IDF + sentence scoring).

Dependencies:
  - nltk (pip install nltk)
  - scikit-learn (pip install scikit-learn)
  - numpy

Input:
  {
    "text": "long text to summarize...",
    "sentences_count": 3,  # number of sentences in summary
    "language": "en"
  }

Output:
  {
    "success": true,
    "summary": "Sentence 1. Sentence 2. Sentence 3.",
    "original_length": 1245,
    "summary_length": 320,
    "compression_ratio": 0.26
  }
"""
import sys
import os
import json
import re

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def split_sentences(text: str, language: str = "en") -> list:
    """Split text into sentences (handles Arabic and English)."""
    # Try nltk first
    try:
        import nltk
        try:
            nltk.data.find("tokenizers/punkt")
        except LookupError:
            nltk.download("punkt", quiet=True)
            nltk.download("punkt_tab", quiet=True)
        return nltk.sent_tokenize(text, language="arabic" if language == "ar" else "english")
    except Exception:
        # Fallback: regex
        # Split on ., !, ? followed by space + capital/Arabic letter
        sentences = re.split(r"(?<=[.!?؟])\s+(?=[A-Z\u0600-\u06FF])", text)
        return [s.strip() for s in sentences if s.strip()]


def summarize(text: str, sentences_count: int = 3, language: str = "en"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}
    if sentences_count < 1:
        sentences_count = 1

    sentences = split_sentences(text, language)
    if len(sentences) <= sentences_count:
        return {
            "success": True,
            "summary": " ".join(sentences),
            "original_length": len(text),
            "summary_length": len(" ".join(sentences)),
            "compression_ratio": round(len(" ".join(sentences)) / max(1, len(text)), 4),
            "note": "Text was already short, no summarization needed",
        }

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
    except ImportError as e:
        return {"success": False, "error": f"scikit-learn/numpy not installed: {e}"}

    # Build TF-IDF matrix
    try:
        vectorizer = TfidfVectorizer(lowercase=True, stop_words="english" if language == "en" else None)
        tfidf_matrix = vectorizer.fit_transform(sentences)
    except ValueError:
        # Fallback: no stop words
        vectorizer = TfidfVectorizer(lowercase=True)
        tfidf_matrix = vectorizer.fit_transform(sentences)

    # Compute sentence similarity
    sim_matrix = cosine_similarity(tfidf_matrix)

    # Score sentences: sum of similarities to other sentences (TextRank-like)
    scores = sim_matrix.sum(axis=1)

    # Boost first sentences (position bias)
    for i in range(min(3, len(sentences))):
        scores[i] *= 1.2

    # Get top sentences (preserving original order)
    ranked_indices = np.argsort(scores)[::-1][:sentences_count]
    selected_indices = sorted(ranked_indices)

    summary = " ".join(sentences[i] for i in selected_indices)

    return {
        "success": True,
        "summary": summary,
        "original_length": len(text),
        "summary_length": len(summary),
        "compression_ratio": round(len(summary) / max(1, len(text)), 4),
        "sentences_original": len(sentences),
        "sentences_summary": len(selected_indices),
    }



def _dispatch(args):
    return summarize(args.get("text", ""), int(args.get("sentences_count", 3)), args.get("language", "en"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--sentences", type=int, default=3)
    parser.add_argument("--language", default="en")
    args = parser.parse_args()
    result = summarize(args.text, args.sentences, args.language)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/keyword_extractor.py`

> Size: 5.0KB | Lines: 147 | Lang: python

```python
"""
Tool: keyword_extractor
Category: ai/nlp
Package: scikit-learn, nltk, rapidfuzz
Description: استخراج الكلمات المفتاحية من نص باستخدام TF-IDF + YAKE-like scoring.

Dependencies:
  - scikit-learn (pip install scikit-learn)
  - nltk (pip install nltk)

Input:
  {
    "text": "the text to extract keywords from",
    "top_n": 10,
    "language": "en"
  }

Output:
  {
    "success": true,
    "keywords": [
      {"word": "machine learning", "score": 0.92},
      {"word": "data science", "score": 0.85}
    ]
  }
"""
import sys
import os
import json
import re
from collections import Counter

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


# Stop words (basic — for English + Arabic)
STOP_WORDS = {
    # English
    "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "must", "shall", "can", "need", "dare", "ought", "used",
    "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them",
    "my", "your", "his", "its", "our", "their", "this", "that", "these", "those",
    "what", "which", "who", "whom", "whose", "where", "when", "why", "how",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
    "s", "t", "just", "don", "now", "in", "on", "at", "to", "for", "of", "with",
    "by", "from", "up", "about", "into", "through", "during", "before", "after",
    "above", "below", "between", "under", "again", "further", "then", "once",
    # Arabic
    "في", "من", "على", "إلى", "عن", "مع", "هذا", "هذه", "ذلك", "تلك", "التي", "الذي",
    "كان", "كانت", "يكون", "تكون", "قد", "لقد", "كل", "بعض", "غير", "بين", "حتى",
    "إذا", "إذ", "ثم", "أو", "أم", "لكن", "بل", "لكن", "حيث", "كما", "ايضا", "أيضا",
    "هو", "هي", "هم", "هن", "نحن", "أنا", "أنت", "أنتم", "فيه", "فيها", "عنه", "عنها",
}


def extract_keywords(text: str, top_n: int = 10, language: str = "en"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}
    if top_n < 1:
        top_n = 10

    try:
        from sklearn.feature_extraction.text import TfidfVectorizer
    except ImportError as e:
        return {"success": False, "error": f"scikit-learn not installed: {e}"}

    # Split into "documents" (sentences) for TF-IDF
    sentences = re.split(r"[.!?؟]+", text)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        sentences = [text]

    # Build TF-IDF
    try:
        vectorizer = TfidfVectorizer(
            lowercase=True,
            stop_words=list(STOP_WORDS),
            ngram_range=(1, 3),
            min_df=1,
            max_df=0.9,
        )
        tfidf_matrix = vectorizer.fit_transform(sentences)
    except ValueError as e:
        return {"success": False, "error": f"tfidf failed: {e}"}

    # Get feature names
    feature_names = vectorizer.get_feature_names_out()

    # Sum TF-IDF scores across all sentences
    scores = tfidf_matrix.sum(axis=0).A1

    # Rank keywords
    ranked = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)

    # Filter: prefer longer phrases, dedupe substrings
    keywords = []
    seen_words = set()
    for word, score in ranked:
        if score <= 0:
            continue
        # Skip if substring of already-seen keyword
        is_substring = any(word in sw for sw in seen_words)
        if not is_substring:
            keywords.append({"word": word, "score": round(float(score), 4)})
            seen_words.add(word)
        if len(keywords) >= top_n:
            break

    return {
        "success": True,
        "keywords": keywords,
        "count": len(keywords),
        "language": language,
    }



def _dispatch(args):
    return extract_keywords(args.get("text", ""), int(args.get("top_n", 10)), args.get("language", "en"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--top_n", type=int, default=10)
    parser.add_argument("--language", default="en")
    args = parser.parse_args()
    result = extract_keywords(args.text, args.top_n, args.language)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/language_detector.py`

> Size: 3.8KB | Lines: 129 | Lang: python

```python
"""
Tool: language_detector
Category: ai/nlp
Package: langdetect (fallback: pure-Python heuristic)
Description: كشف لغة نص معين ويرجع اللغة + نسبة الثقة.

Dependencies:
  - langdetect (pip install langdetect)

Input:
  {"text": "some text in any language"}

Output:
  {
    "success": true,
    "language": "en",
    "confidence": 0.98,
    "alternatives": [{"lang": "fr", "prob": 0.02}]
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


# Unicode ranges for quick detection
RANGES = [
    ("ar", 0x0600, 0x06FF),  # Arabic
    ("zh", 0x4E00, 0x9FFF),  # CJK Unified
    ("ja", 0x3040, 0x30FF),  # Hiragana + Katakana
    ("ko", 0xAC00, 0xD7AF),  # Hangul Syllables
    ("ru", 0x0400, 0x04FF),  # Cyrillic
    ("el", 0x0370, 0x03FF),  # Greek
    ("he", 0x0590, 0x05FF),  # Hebrew
    ("hi", 0x0900, 0x097F),  # Devanagari
    ("th", 0x0E00, 0x0E7F),  # Thai
]


def detect_by_unicode(text: str) -> list:
    """Quick detection via Unicode ranges."""
    counts = Counter = {}
    for char in text:
        cp = ord(char)
        for lang, lo, hi in RANGES:
            if lo <= cp <= hi:
                counts[lang] = counts.get(lang, 0) + 1
                break
    return sorted(counts.items(), key=lambda x: x[1], reverse=True)


def detect(text: str):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    # Try langdetect first
    try:
        from langdetect import detect as ld_detect, detect_langs, DetectorFactory
        DetectorFactory.seed = 0  # deterministic
        langs = detect_langs(text)
        if langs:
            top = langs[0]
            return {
                "success": True,
                "language": top.lang,
                "confidence": round(top.prob, 4),
                "alternatives": [{"lang": l.lang, "prob": round(l.prob, 4)} for l in langs[1:4]],
                "method": "langdetect",
            }
    except ImportError:
        pass
    except Exception:
        pass

    # Fallback: Unicode-based detection
    detected = detect_by_unicode(text)
    total_chars = sum(c for _, c in detected)
    if not detected:
        # Likely Latin/English
        ascii_count = sum(1 for c in text if c.isascii() and c.isalpha())
        if ascii_count > 0:
            return {
                "success": True,
                "language": "en",
                "confidence": 0.7,
                "alternatives": [],
                "method": "unicode_heuristic",
            }
        return {"success": False, "error": "Could not detect language"}

    top_lang, top_count = detected[0]
    confidence = round(top_count / max(1, total_chars), 4)
    return {
        "success": True,
        "language": top_lang,
        "confidence": confidence,
        "alternatives": [{"lang": l, "prob": round(c / max(1, total_chars), 4)} for l, c in detected[1:4]],
        "method": "unicode_heuristic",
    }



def _dispatch(args):
    return detect(args.get("text", ""))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    args = parser.parse_args()
    print(json.dumps(detect(args.text), ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/csv_analyzer.py`

> Size: 4.6KB | Lines: 142 | Lang: python

```python
"""
Tool: csv_analyzer
Category: data
Package: pandas, numpy
Description: تحليل ملف CSV أو نص CSV — يعطي إحصائيات، أنواع البيانات، قيم مفقودة.

Dependencies:
  - pandas (pip install pandas)
  - numpy (pip install numpy)

Input:
  {
    "csv_path": "/path/to/file.csv",  # OR
    "csv_text": "name,age,city\\nJohn,30,NYC\\n...",
    "analysis_type": "summary" | "stats" | "head" | "correlation"
  }

Output:
  {
    "success": true,
    "shape": [100, 5],
    "columns": [...],
    "dtypes": {...},
    "head": [[...], ...],
    "stats": {...},
    "missing": {...}
  }
"""
import sys
import os
import json
import io

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def analyze(csv_path: str = None, csv_text: str = None, analysis_type: str = "summary"):
    try:
        import pandas as pd
        import numpy as np
    except ImportError as e:
        return {"success": False, "error": f"pandas/numpy not installed: {e}"}

    # Load data
    try:
        if csv_path and os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
        elif csv_text:
            df = pd.read_csv(io.StringIO(csv_text))
        else:
            return {"success": False, "error": "csv_path or csv_text required"}
    except Exception as e:
        return {"success": False, "error": f"failed to read CSV: {str(e)[:200]}"}

    result = {
        "success": True,
        "shape": list(df.shape),
        "columns": list(df.columns),
        "dtypes": {col: str(df[col].dtype) for col in df.columns},
    }

    if analysis_type in ("summary", "head"):
        # First 5 rows
        head = df.head(5).to_dict(orient="records")
        result["head"] = [
            {k: (v if not (isinstance(v, float) and np.isnan(v)) else None) for k, v in row.items()}
            for row in head
        ]

    if analysis_type in ("summary", "stats"):
        # Numeric stats
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols:
            stats = df[numeric_cols].describe().to_dict()
            result["stats"] = {
                col: {k: round(float(v), 4) if not np.isnan(v) else None for k, v in stats[col].items()}
                for col in numeric_cols
            }
        else:
            result["stats"] = {}

        # Categorical value counts
        cat_cols = df.select_dtypes(include=["object"]).columns.tolist()
        result["categorical_summary"] = {}
        for col in cat_cols[:5]:  # first 5 categorical
            counts = df[col].value_counts().head(10).to_dict()
            result["categorical_summary"][col] = {str(k): int(v) for k, v in counts.items()}

    if analysis_type in ("summary", "missing"):
        # Missing values
        missing = df.isnull().sum()
        result["missing"] = {
            col: {"count": int(missing[col]), "percent": round(float(missing[col] / len(df) * 100), 2)}
            for col in df.columns
            if missing[col] > 0
        }
        if not result["missing"]:
            result["missing"] = "No missing values"

    if analysis_type == "correlation":
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if len(numeric_cols) >= 2:
            corr = df[numeric_cols].corr()
            result["correlation"] = {
                row: {col: round(float(corr.loc[row, col]), 4) for col in numeric_cols}
                for row in numeric_cols
            }
        else:
            result["correlation"] = "Need at least 2 numeric columns"

    return result



def _dispatch(args):
    return analyze(args.get("csv_path"), args.get("csv_text"), args.get("analysis_type", "summary"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv_path", default=None)
    parser.add_argument("--csv_text", default=None)
    parser.add_argument("--analysis_type", default="summary", choices=["summary", "stats", "head", "correlation"])
    args = parser.parse_args()
    result = analyze(args.csv_path, args.csv_text, args.analysis_type)
    print(json.dumps(result, ensure_ascii=False, default=str))

```

---

## `src/lib/tools-registry/python/statistics_calculator.py`

> Size: 5.9KB | Lines: 163 | Lang: python

```python
"""
Tool: statistics_calculator
Category: data
Package: numpy, scipy
Description: حساب إحصائيات شاملة لمجموعة أرقام — متوسط، وسيط، انحراف معياري، ارتباط، إلخ.

Dependencies:
  - numpy (pip install numpy)
  - scipy (pip install scipy)

Input:
  {
    "numbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "operation": "descriptive" | "correlation" | "ttest" | "regression"
  }

Output:
  {
    "success": true,
    "count": 10,
    "mean": 5.5,
    "median": 5.5,
    "std": 2.87,
    "var": 8.25,
    "min": 1, "max": 10,
    "q1": 3.25, "q3": 7.75,
    "skewness": 0,
    "kurtosis": -1.56
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def calc(numbers: list, operation: str = "descriptive", numbers2: list = None):
    if not numbers or not isinstance(numbers, list):
        return {"success": False, "error": "numbers list required"}

    try:
        import numpy as np
        from scipy import stats as sp_stats
    except ImportError as e:
        return {"success": False, "error": f"numpy/scipy not installed: {e}"}

    try:
        arr = np.array(numbers, dtype=float)
    except (ValueError, TypeError) as e:
        return {"success": False, "error": f"invalid numbers: {e}"}

    if operation == "descriptive":
        result = {
            "success": True,
            "count": int(len(arr)),
            "mean": round(float(np.mean(arr)), 4),
            "median": round(float(np.median(arr)), 4),
            "std": round(float(np.std(arr, ddof=1)) if len(arr) > 1 else 0.0, 4),
            "var": round(float(np.var(arr, ddof=1)) if len(arr) > 1 else 0.0, 4),
            "min": round(float(np.min(arr)), 4),
            "max": round(float(np.max(arr)), 4),
            "sum": round(float(np.sum(arr)), 4),
            "q1": round(float(np.percentile(arr, 25)), 4),
            "q3": round(float(np.percentile(arr, 75)), 4),
            "iqr": round(float(np.percentile(arr, 75) - np.percentile(arr, 25)), 4),
            "skewness": round(float(sp_stats.skew(arr)) if len(arr) > 2 else 0.0, 4),
            "kurtosis": round(float(sp_stats.kurtosis(arr)) if len(arr) > 3 else 0.0, 4),
        }
        # Mode (most common)
        mode_result = sp_stats.mode(arr, keepdims=False)
        result["mode"] = float(mode_result.mode)
        result["mode_count"] = int(mode_result.count)
        return result

    elif operation == "correlation":
        if not numbers2 or len(numbers2) != len(numbers):
            return {"success": False, "error": "correlation requires numbers2 of same length"}
        arr2 = np.array(numbers2, dtype=float)
        pearson_r, pearson_p = sp_stats.pearsonr(arr, arr2)
        spearman_r, spearman_p = sp_stats.spearmanr(arr, arr2)
        return {
            "success": True,
            "pearson_r": round(float(pearson_r), 4),
            "pearson_p": round(float(pearson_p), 4),
            "spearman_r": round(float(spearman_r), 4),
            "spearman_p": round(float(spearman_p), 4),
            "covariance": round(float(np.cov(arr, arr2)[0, 1]), 4),
        }

    elif operation == "ttest":
        if not numbers2:
            # One-sample t-test against mean=0
            t_stat, p_val = sp_stats.ttest_1samp(arr, 0)
            return {
                "success": True,
                "test": "one-sample",
                "t_statistic": round(float(t_stat), 4),
                "p_value": round(float(p_val), 4),
                "mean": round(float(np.mean(arr)), 4),
                "null_hypothesis_mean": 0,
            }
        arr2 = np.array(numbers2, dtype=float)
        t_stat, p_val = sp_stats.ttest_ind(arr, arr2)
        return {
            "success": True,
            "test": "two-sample",
            "t_statistic": round(float(t_stat), 4),
            "p_value": round(float(p_val), 4),
            "mean1": round(float(np.mean(arr)), 4),
            "mean2": round(float(np.mean(arr2)), 4),
        }

    elif operation == "regression":
        if not numbers2 or len(numbers2) != len(numbers):
            return {"success": False, "error": "regression requires numbers2 (x) of same length as numbers (y)"}
        x = np.array(numbers2, dtype=float)
        y = arr
        slope, intercept, r_value, p_value, std_err = sp_stats.linregress(x, y)
        return {
            "success": True,
            "slope": round(float(slope), 4),
            "intercept": round(float(intercept), 4),
            "r_value": round(float(r_value), 4),
            "r_squared": round(float(r_value ** 2), 4),
            "p_value": round(float(p_value), 4),
            "std_err": round(float(std_err), 4),
            "equation": f"y = {slope:.4f} * x + {intercept:.4f}",
        }

    else:
        return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return calc(args.get("numbers", []), args.get("operation", "descriptive"), args.get("numbers2"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--numbers", nargs="*", type=float, required=True)
    parser.add_argument("--numbers2", nargs="*", type=float, default=None)
    parser.add_argument("--operation", default="descriptive", choices=["descriptive", "correlation", "ttest", "regression"])
    args = parser.parse_args()
    result = calc(args.numbers, args.operation, args.numbers2)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/data_visualizer.py`

> Size: 4.8KB | Lines: 132 | Lang: python

```python
"""
Tool: data_visualizer
Category: data
Package: matplotlib, pandas, numpy
Description: إنشاء رسوم بيانية مختلفة (line, bar, scatter, histogram, pie) وحفظها كـ PNG.

Dependencies:
  - matplotlib (pip install matplotlib)
  - pandas (pip install pandas)
  - numpy (pip install numpy)

Input:
  {
    "chart_type": "line" | "bar" | "scatter" | "histogram" | "pie",
    "title": "Sales Over Time",
    "x": [1, 2, 3, 4, 5],
    "y": [10, 20, 15, 25, 30],
    "x_label": "Month",
    "y_label": "Sales",
    "output_path": "/tmp/chart.png"
  }

Output:
  {"success": true, "file": "/tmp/chart.png", "size_kb": 12.5}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

# Use non-interactive backend
import matplotlib
matplotlib.use("Agg")


def create_chart(chart_type: str, x=None, y=None, title: str = "", x_label: str = "", y_label: str = "", output_path: str = "/tmp/chart.png", **kwargs):
    try:
        import matplotlib.pyplot as plt
        import numpy as np
    except ImportError as e:
        return {"success": False, "error": f"matplotlib not installed: {e}"}

    if not x and not y:
        return {"success": False, "error": "x and/or y data required"}

    x = x or list(range(len(y))) if y else []
    y = y or []

    fig, ax = plt.subplots(figsize=(10, 6), dpi=100)

    try:
        if chart_type == "line":
            ax.plot(x, y, marker="o", linewidth=2, markersize=6, color="#4F46E5")
        elif chart_type == "bar":
            ax.bar(x, y, color="#10B981", edgecolor="black", linewidth=0.5)
        elif chart_type == "scatter":
            ax.scatter(x, y, s=80, c="#F59E0B", alpha=0.7, edgecolors="black")
        elif chart_type == "histogram":
            ax.hist(y or x, bins=kwargs.get("bins", 20), color="#EF4444", edgecolor="black")
        elif chart_type == "pie":
            if not x or not y:
                return {"success": False, "error": "pie chart requires x (labels) and y (values)"}
            ax.pie(y, labels=x, autopct="%1.1f%%", startangle=90)
            ax.axis("equal")
        else:
            return {"success": False, "error": f"unknown chart_type: {chart_type}"}

        if title:
            ax.set_title(title, fontsize=14, fontweight="bold", pad=15)
        if x_label and chart_type != "pie":
            ax.set_xlabel(x_label, fontsize=11)
        if y_label and chart_type != "pie":
            ax.set_ylabel(y_label, fontsize=11)

        if chart_type != "pie":
            ax.grid(True, alpha=0.3, linestyle="--")
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)

        plt.tight_layout()
        plt.savefig(output_path, dpi=100, bbox_inches="tight", facecolor="white")
        plt.close()

        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "size_kb": round(size_kb, 2),
            "chart_type": chart_type,
            "data_points": len(x) if chart_type != "histogram" else len(y or x),
        }
    except Exception as e:
        plt.close()
        return {"success": False, "error": f"chart creation failed: {str(e)[:200]}"}



def _dispatch(args):
    return create_chart(args.get("chart_type"), args.get("x"), args.get("y"), args.get("title", ""), args.get("x_label", ""), args.get("y_label", ""), args.get("output_path", "/tmp/chart.png"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--chart_type", required=True, choices=["line", "bar", "scatter", "histogram", "pie"])
    parser.add_argument("--title", default="")
    parser.add_argument("--x", nargs="*", type=float, default=None)
    parser.add_argument("--y", nargs="*", type=float, default=None)
    parser.add_argument("--x_label", default="")
    parser.add_argument("--y_label", default="")
    parser.add_argument("--output_path", default="/tmp/chart.png")
    args = parser.parse_args()
    # Convert float x to string labels for pie
    x = args.x if args.chart_type != "pie" else [str(v) for v in args.x]
    result = create_chart(args.chart_type, x, args.y, args.title, args.x_label, args.y_label, args.output_path)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/web_scraper.py`

> Size: 5.3KB | Lines: 160 | Lang: python

```python
"""
Tool: web_scraper
Category: web
Package: requests, beautifulsoup4, trafilatura
Description: استخراج المحتوى من صفحة ويب — نص نظيف، روابط، صور، meta.

Dependencies:
  - requests (pip install requests)
  - beautifulsoup4 (pip install beautifulsoup4)
  - trafilatura (pip install trafilatura)
  - lxml (pip install lxml)

Input:
  {
    "url": "https://example.com/article",
    "extract": "text" | "links" | "images" | "meta" | "all",
    "timeout": 30
  }

Output:
  {
    "success": true,
    "url": "...",
    "title": "...",
    "text": "...",
    "links": [...],
    "images": [...],
    "meta": {...}
  }
"""
import sys
import os
import json
import urllib.parse

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def scrape(url: str, extract: str = "all", timeout: int = 30):
    if not url or not url.startswith(("http://", "https://")):
        return {"success": False, "error": "valid url required (must start with http/https)"}

    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError as e:
        return {"success": False, "error": f"requests/bs4 not installed: {e}"}

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        resp = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"HTTP request failed: {str(e)[:200]}"}

    soup = BeautifulSoup(resp.text, "lxml")

    result = {
        "success": True,
        "url": resp.url,
        "status_code": resp.status_code,
        "title": (soup.title.string.strip() if soup.title and soup.title.string else "")[:200],
    }

    if extract in ("text", "all"):
        # Try trafilatura for clean article text
        try:
            import trafilatura
            downloaded = trafilatura.fetch_url(url)
            if downloaded:
                clean_text = trafilatura.extract(downloaded, include_comments=False, include_tables=True)
                if clean_text:
                    result["text"] = clean_text[:5000]  # cap
                    result["text_length"] = len(clean_text)
                else:
                    result["text"] = soup.get_text(separator="\n", strip=True)[:5000]
            else:
                result["text"] = soup.get_text(separator="\n", strip=True)[:5000]
        except ImportError:
            # Fallback: just soup
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            text = soup.get_text(separator="\n", strip=True)
            result["text"] = text[:5000]
            result["text_length"] = len(text)

    if extract in ("links", "all"):
        links = []
        for a in soup.find_all("a", href=True):
            href = a["href"]
            # Resolve relative URLs
            full_url = urllib.parse.urljoin(resp.url, href)
            text = a.get_text(strip=True)[:100]
            links.append({"url": full_url, "text": text})
        result["links"] = links[:50]  # cap
        result["links_count"] = len(links)

    if extract in ("images", "all"):
        images = []
        for img in soup.find_all("img", src=True):
            src = img["src"]
            full_url = urllib.parse.urljoin(resp.url, src)
            alt = img.get("alt", "")[:100]
            images.append({"src": full_url, "alt": alt})
        result["images"] = images[:20]
        result["images_count"] = len(images)

    if extract in ("meta", "all"):
        meta = {}
        # Standard meta tags
        for m in soup.find_all("meta"):
            name = m.get("name") or m.get("property") or m.get("http-equiv")
            content = m.get("content")
            if name and content:
                meta[name] = content[:500]
        result["meta"] = meta

        # Open Graph
        og = {}
        for m in soup.find_all("meta", attrs={"property": True}):
            if m["property"].startswith("og:"):
                og[m["property"]] = m.get("content", "")[:300]
        if og:
            result["open_graph"] = og

    return result



def _dispatch(args):
    return scrape(args.get("url", ""), args.get("extract", "all"), int(args.get("timeout", 30)))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--extract", default="all", choices=["text", "links", "images", "meta", "all"])
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    result = scrape(args.url, args.extract, args.timeout)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/http_api_tester.py`

> Size: 4.7KB | Lines: 142 | Lang: python

```python
"""
Tool: http_api_tester
Category: web
Package: requests
Description: اختبار API endpoint — GET, POST, PUT, DELETE مع headers و body مخصص.

Dependencies:
  - requests (pip install requests)

Input:
  {
    "url": "https://api.example.com/users",
    "method": "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    "headers": {"Authorization": "Bearer xxx"},
    "params": {"page": 1},
    "body": {"name": "John"},
    "body_type": "json" | "form" | "raw",
    "timeout": 30
  }

Output:
  {
    "success": true,
    "status_code": 200,
    "status_text": "OK",
    "headers": {...},
    "body": "...",
    "json": {...},  # if response is JSON
    "elapsed_ms": 145,
    "size_bytes": 1234
  }
"""
import sys
import os
import json
import time

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def test_request(url: str, method: str = "GET", headers: dict = None, params: dict = None, body=None, body_type: str = "json", timeout: int = 30):
    if not url:
        return {"success": False, "error": "url required"}

    try:
        import requests
    except ImportError as e:
        return {"success": False, "error": f"requests not installed: {e}"}

    method = method.upper()
    if method not in ("GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"):
        return {"success": False, "error": f"invalid method: {method}"}

    # Prepare request kwargs
    req_kwargs = {
        "headers": headers or {},
        "params": params or {},
        "timeout": timeout,
        "allow_redirects": True,
    }

    # Add body for non-GET methods
    if method != "GET" and body is not None:
        if body_type == "json":
            req_kwargs["json"] = body
        elif body_type == "form":
            req_kwargs["data"] = body
        elif body_type == "raw":
            req_kwargs["data"] = str(body)
            req_kwargs["headers"].setdefault("Content-Type", "text/plain")

    start = time.time()
    try:
        resp = requests.request(method, url, **req_kwargs)
        elapsed_ms = int((time.time() - start) * 1000)
    except requests.exceptions.Timeout:
        return {"success": False, "error": f"timeout after {timeout}s"}
    except requests.exceptions.ConnectionError as e:
        return {"success": False, "error": f"connection error: {str(e)[:200]}"}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"request failed: {str(e)[:200]}"}

    result = {
        "success": True,
        "status_code": resp.status_code,
        "status_text": resp.reason,
        "url": resp.url,
        "elapsed_ms": elapsed_ms,
        "size_bytes": len(resp.content),
        "headers": dict(resp.headers),
    }

    # Try to parse JSON response
    content_type = resp.headers.get("Content-Type", "")
    if "application/json" in content_type:
        try:
            result["json"] = resp.json()
            result["body"] = "(parsed as JSON)"
        except Exception:
            result["body"] = resp.text[:5000]
    else:
        result["body"] = resp.text[:5000]

    return result



def _dispatch(args):
    return test_request(args.get("url", ""), args.get("method", "GET"), args.get("headers"), args.get("params"), args.get("body"), args.get("body_type", "json"), int(args.get("timeout", 30)))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--method", default="GET")
    parser.add_argument("--headers", default=None, help="JSON string")
    parser.add_argument("--params", default=None, help="JSON string")
    parser.add_argument("--body", default=None, help="JSON string")
    parser.add_argument("--body_type", default="json", choices=["json", "form", "raw"])
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    headers = json.loads(args.headers) if args.headers else None
    params = json.loads(args.params) if args.params else None
    body = json.loads(args.body) if args.body else None
    result = test_request(args.url, args.method, headers, params, body, args.body_type, args.timeout)
    print(json.dumps(result, ensure_ascii=False, indent=2))

```

---

## `src/lib/tools-registry/python/youtube_downloader.py`

> Size: 5.0KB | Lines: 147 | Lang: python

```python
"""
Tool: youtube_downloader
Category: web/media
Package: yt-dlp
Description: تحميل فيديوهات/صوت من YouTube و منصات تانية باستخدام yt-dlp.

Dependencies:
  - yt-dlp (pip install yt-dlp)

Input:
  {
    "url": "https://www.youtube.com/watch?v=xxx",
    "format": "best" | "bestaudio" | "bestvideo" | "720p" | "1080p",
    "output_path": "/tmp/youtube_downloads",
    "extract_info_only": false  # if true, just return metadata
  }

Output:
  {
    "success": true,
    "title": "...",
    "duration": 245,
    "uploader": "...",
    "view_count": 1234567,
    "files": [{"path": "/tmp/.../video.mp4", "size_mb": 12.5}]
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


FORMAT_MAP = {
    "best": "bestvideo+bestaudio/best",
    "bestaudio": "bestaudio/best",
    "bestvideo": "bestvideo",
    "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]/best",
    "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best",
    "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]/best",
}


def download(url: str, format: str = "best", output_path: str = "/tmp/youtube_downloads", extract_info_only: bool = False):
    if not url:
        return {"success": False, "error": "url required"}

    try:
        from yt_dlp import YoutubeDL
    except ImportError as e:
        return {"success": False, "error": f"yt-dlp not installed: {e}"}

    os.makedirs(output_path, exist_ok=True)

    ydl_opts = {
        "outtmpl": os.path.join(output_path, "%(title).80s.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
    }

    if not extract_info_only:
        fmt = FORMAT_MAP.get(format, format)
        ydl_opts["format"] = fmt
        # Merge for video formats
        if "bestvideo" in fmt and "+" in fmt:
            ydl_opts["merge_output_format"] = "mp4"

    try:
        with YoutubeDL(ydl_opts) as ydl:
            # Extract info first
            info = ydl.extract_info(url, download=not extract_info_only)

            result = {
                "success": True,
                "title": info.get("title", "")[:200],
                "duration": info.get("duration"),
                "uploader": info.get("uploader", ""),
                "view_count": info.get("view_count"),
                "like_count": info.get("like_count"),
                "upload_date": info.get("upload_date", ""),
                "description": (info.get("description") or "")[:500],
                "webpage_url": info.get("webpage_url", url),
                "extractor": info.get("extractor_key", ""),
            }

            if extract_info_only:
                result["thumbnails"] = [t["url"] for t in info.get("thumbnails", [])[:3]]
                result["available_formats"] = [
                    {"format_id": f.get("format_id"), "ext": f.get("ext"), "height": f.get("height"), "filesize": f.get("filesize")}
                    for f in info.get("formats", [])[:10]
                ]
                return result

            # Get downloaded file path
            if "requested_downloads" in info:
                files = []
                for d in info["requested_downloads"]:
                    fpath = d.get("filepath")
                    if fpath and os.path.exists(fpath):
                        files.append({
                            "path": fpath,
                            "size_mb": round(os.path.getsize(fpath) / 1024 / 1024, 2),
                            "ext": d.get("ext", ""),
                        })
                result["files"] = files
            else:
                # Fallback: look in output dir for recent files
                result["files"] = []

            return result

    except Exception as e:
        return {"success": False, "error": f"download failed: {str(e)[:200]}"}



def _dispatch(args):
    return download(args.get("url", ""), args.get("format", "best"), args.get("output_path", "/tmp/youtube_downloads"), bool(args.get("extract_info_only", False)))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--format", default="best", choices=list(FORMAT_MAP.keys()))
    parser.add_argument("--output_path", default="/tmp/youtube_downloads")
    parser.add_argument("--info_only", action="store_true")
    args = parser.parse_args()
    result = download(args.url, args.format, args.output_path, args.info_only)
    print(json.dumps(result, ensure_ascii=False, indent=2))

```

---

## `src/lib/tools-registry/python/image_processor.py`

> Size: 7.1KB | Lines: 193 | Lang: python

```python
"""
Tool: image_processor
Category: media
Package: pillow, numpy
Description: معالجة الصور — resize, crop, rotate, filter, watermark, format conversion.

Dependencies:
  - pillow (pip install pillow)
  - numpy (pip install numpy)

Input:
  {
    "input_path": "/path/to/input.jpg",
    "output_path": "/path/to/output.jpg",
    "operation": "resize" | "crop" | "rotate" | "grayscale" | "blur" | "sharpen" | "thumbnail" | "watermark" | "convert",
    "params": {
      "width": 800, "height": 600,
      "angle": 90,
      "filter": "gaussian" | "box" | "median",
      "radius": 2,
      "watermark_text": "© 2025",
      "format": "JPEG" | "PNG" | "WEBP"
    }
  }

Output:
  {"success": true, "file": "/path/to/output.jpg", "size_kb": 12.5, "dimensions": [800, 600]}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def process(input_path: str, output_path: str, operation: str, params: dict = None):
    if not input_path or not os.path.exists(input_path):
        return {"success": False, "error": f"input file not found: {input_path}"}

    try:
        from PIL import Image, ImageFilter, ImageDraw, ImageFont
    except ImportError as e:
        return {"success": False, "error": f"Pillow not installed: {e}"}

    params = params or {}

    try:
        img = Image.open(input_path)
        original_size = os.path.getsize(input_path) / 1024
        original_dims = list(img.size)
    except Exception as e:
        return {"success": False, "error": f"failed to open image: {str(e)[:200]}"}

    try:
        if operation == "resize":
            w = int(params.get("width", img.width))
            h = int(params.get("height", img.height))
            img = img.resize((w, h), Image.LANCZOS)

        elif operation == "thumbnail":
            max_size = (int(params.get("width", 300)), int(params.get("height", 300)))
            img.thumbnail(max_size, Image.LANCZOS)

        elif operation == "crop":
            left = int(params.get("left", 0))
            top = int(params.get("top", 0))
            right = int(params.get("right", img.width))
            bottom = int(params.get("bottom", img.height))
            img = img.crop((left, top, right, bottom))

        elif operation == "rotate":
            angle = float(params.get("angle", 90))
            expand = bool(params.get("expand", True))
            img = img.rotate(angle, expand=expand)

        elif operation == "grayscale":
            img = img.convert("L")

        elif operation == "blur":
            radius = int(params.get("radius", 2))
            img = img.filter(ImageFilter.GaussianBlur(radius=radius))

        elif operation == "sharpen":
            img = img.filter(ImageFilter.SHARPEN)

        elif operation == "watermark":
            text = params.get("watermark_text", "WATERMARK")
            # Create overlay
            overlay = Image.new("RGBA", img.size, (255, 255, 255, 0))
            draw = ImageDraw.Draw(overlay)
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", max(20, img.width // 30))
            except (IOError, OSError):
                font = ImageFont.load_default()
            # Position: bottom-right
            text_w = draw.textlength(text, font=font)
            text_h = font.size
            margin = 20
            x = img.width - text_w - margin
            y = img.height - text_h - margin
            # Draw shadow + text
            draw.text((x + 2, y + 2), text, font=font, fill=(0, 0, 0, 128))
            draw.text((x, y), text, font=font, fill=(255, 255, 255, 180))
            # Convert image to RGBA, composite, convert back
            if img.mode != "RGBA":
                img = img.convert("RGBA")
            img = Image.alpha_composite(img, overlay)
            img = img.convert("RGB")

        elif operation == "convert":
            fmt = params.get("format", "JPEG").upper()
            if fmt in ("JPEG", "JPG"):
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                img.save(output_path, format="JPEG", quality=int(params.get("quality", 85)))
            elif fmt == "PNG":
                img.save(output_path, format="PNG")
            elif fmt == "WEBP":
                img.save(output_path, format="WEBP", quality=int(params.get("quality", 85)))
            else:
                return {"success": False, "error": f"unsupported format: {fmt}"}
            size_kb = os.path.getsize(output_path) / 1024
            return {
                "success": True,
                "file": output_path,
                "size_kb": round(size_kb, 2),
                "dimensions": list(img.size),
                "original_dimensions": original_dims,
                "original_size_kb": round(original_size, 2),
                "operation": operation,
            }

        else:
            return {"success": False, "error": f"unknown operation: {operation}"}

        # Save
        if output_path.lower().endswith((".jpg", ".jpeg")):
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            img.save(output_path, "JPEG", quality=85)
        elif output_path.lower().endswith(".png"):
            img.save(output_path, "PNG")
        elif output_path.lower().endswith(".webp"):
            img.save(output_path, "WEBP", quality=85)
        else:
            img.save(output_path)

        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "size_kb": round(size_kb, 2),
            "dimensions": list(img.size),
            "original_dimensions": original_dims,
            "original_size_kb": round(original_size, 2),
            "operation": operation,
        }

    except Exception as e:
        return {"success": False, "error": f"image processing failed: {str(e)[:200]}"}



def _dispatch(args):
    return process(args.get("input_path", ""), args.get("output_path", ""), args.get("operation", ""), args.get("params", {}))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_path", required=True)
    parser.add_argument("--output_path", required=True)
    parser.add_argument("--operation", required=True, choices=["resize", "crop", "rotate", "grayscale", "blur", "sharpen", "thumbnail", "watermark", "convert"])
    parser.add_argument("--params", default="{}", help="JSON string of params")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = process(args.input_path, args.output_path, args.operation, params)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/ocr_extractor.py`

> Size: 4.5KB | Lines: 132 | Lang: python

```python
"""
Tool: ocr_extractor
Category: media
Package: pytesseract, pillow
Description: استخراج النص من صور باستخدام Tesseract OCR.

Dependencies:
  - pytesseract (pip install pytesseract)
  - pillow (pip install pillow)
  - System: tesseract-ocr (apt install tesseract-ocr)

Input:
  {
    "image_path": "/path/to/image.png",
    "language": "eng" | "ara" | "eng+ara",
    "output_format": "text" | "data" | "hocr"
  }

Output:
  {
    "success": true,
    "text": "...",
    "confidence": 87.5,
    "words_count": 42,
    "lines_count": 5
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def extract_text(image_path: str, language: str = "eng", output_format: str = "text"):
    if not image_path or not os.path.exists(image_path):
        return {"success": False, "error": f"image file not found: {image_path}"}

    try:
        import pytesseract
        from PIL import Image
    except ImportError as e:
        return {"success": False, "error": f"pytesseract/Pillow not installed: {e}"}

    try:
        img = Image.open(image_path)
    except Exception as e:
        return {"success": False, "error": f"failed to open image: {str(e)[:200]}"}

    try:
        if output_format == "text":
            text = pytesseract.image_to_string(img, lang=language)
            words = [w for w in text.split() if w.strip()]
            lines = [l for l in text.split("\n") if l.strip()]
            return {
                "success": True,
                "text": text.strip(),
                "words_count": len(words),
                "lines_count": len(lines),
                "language": language,
            }

        elif output_format == "data":
            data = pytesseract.image_to_data(img, lang=language, output_type=pytesseract.Output.DICT)
            words = []
            confidences = []
            for i, txt in enumerate(data["text"]):
                if txt.strip():
                    words.append({
                        "text": txt,
                        "confidence": float(data["conf"][i]),
                        "bbox": [int(data["left"][i]), int(data["top"][i]), int(data["width"][i]), int(data["height"][i])],
                    })
                    if data["conf"][i] > 0:
                        confidences.append(float(data["conf"][i]))

            avg_conf = sum(confidences) / len(confidences) if confidences else 0
            return {
                "success": True,
                "words": words[:100],
                "words_count": len(words),
                "confidence": round(avg_conf, 2),
                "language": language,
                "text": " ".join(w["text"] for w in words),
            }

        elif output_format == "hocr":
            hocr = pytesseract.image_to_pdf_or_hocr(img, lang=language, extension="hocr")
            return {
                "success": True,
                "hocr": hocr.decode("utf-8")[:5000] if isinstance(hocr, bytes) else str(hocr)[:5000],
                "language": language,
            }

        else:
            return {"success": False, "error": f"unknown output_format: {output_format}"}

    except pytesseract.TesseractNotFoundError:
        return {"success": False, "error": "tesseract binary not found. Install with: apt-get install tesseract-ocr"}
    except Exception as e:
        return {"success": False, "error": f"OCR failed: {str(e)[:200]}"}



def _dispatch(args):
    return extract_text(args.get("image_path", ""), args.get("language", "eng"), args.get("output_format", "text"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--image_path", required=True)
    parser.add_argument("--language", default="eng")
    parser.add_argument("--output_format", default="text", choices=["text", "data", "hocr"])
    args = parser.parse_args()
    result = extract_text(args.image_path, args.language, args.output_format)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/pdf_processor.py`

> Size: 9.1KB | Lines: 260 | Lang: python

```python
"""
Tool: pdf_processor
Category: media
Package: pypdf, pdfplumber, pymupdf
Description: معالجة ملفات PDF — استخراج نص، صور، جدول، دمج، تقسيم.

Dependencies:
  - pypdf (pip install pypdf)
  - pdfplumber (pip install pdfplumber)
  - pymupdf (pip install pymupdf) — for image extraction

Input:
  {
    "pdf_path": "/path/to/file.pdf",
    "operation": "extract_text" | "extract_images" | "extract_tables" | "merge" | "split" | "page_count" | "metadata",
    "output_path": "/path/to/output",
    "pages": "1-5" | "all",
    "merge_files": ["/path/to/file2.pdf"]
  }

Output:
  {
    "success": true,
    "pages": 12,
    "text": "...",
    "tables": [[...]],
    "images": ["/path/to/img1.png"]
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def parse_page_range(pages: str, total: int):
    """Parse '1-5,7,9-11' into list of 0-indexed page numbers."""
    if pages == "all" or not pages:
        return list(range(total))
    result = []
    for part in pages.split(","):
        part = part.strip()
        if "-" in part:
            lo, hi = part.split("-", 1)
            for i in range(int(lo) - 1, int(hi)):
                if 0 <= i < total:
                    result.append(i)
        else:
            i = int(part) - 1
            if 0 <= i < total:
                result.append(i)
    return result


def process(pdf_path: str, operation: str = "extract_text", output_path: str = None, pages: str = "all", merge_files: list = None):
    if not pdf_path or not os.path.exists(pdf_path):
        return {"success": False, "error": f"PDF file not found: {pdf_path}"}

    # Get page count first
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        total_pages = len(reader.pages)
    except ImportError as e:
        return {"success": False, "error": f"pypdf not installed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"failed to read PDF: {str(e)[:200]}"}

    if operation == "page_count":
        return {"success": True, "pages": total_pages, "file": pdf_path}

    if operation == "metadata":
        meta = reader.metadata
        return {
            "success": True,
            "pages": total_pages,
            "metadata": {
                "title": str(meta.title) if meta and meta.title else "",
                "author": str(meta.author) if meta and meta.author else "",
                "subject": str(meta.subject) if meta and meta.subject else "",
                "creator": str(meta.creator) if meta and meta.creator else "",
                "producer": str(meta.producer) if meta and meta.producer else "",
            },
            "file_size_kb": round(os.path.getsize(pdf_path) / 1024, 2),
        }

    if operation == "extract_text":
        try:
            import pdfplumber
        except ImportError as e:
            return {"success": False, "error": f"pdfplumber not installed: {e}"}

        target_pages = parse_page_range(pages, total_pages)
        all_text = []
        with pdfplumber.open(pdf_path) as pdf:
            for i in target_pages:
                page = pdf.pages[i]
                text = page.extract_text() or ""
                all_text.append({"page": i + 1, "text": text})

        combined = "\n\n".join(f"--- Page {p['page']} ---\n{p['text']}" for p in all_text)
        return {
            "success": True,
            "pages": total_pages,
            "pages_extracted": len(target_pages),
            "text": combined[:10000],  # cap
            "text_length": len(combined),
            "page_texts": [{"page": p["page"], "length": len(p["text"])} for p in all_text],
        }

    if operation == "extract_tables":
        try:
            import pdfplumber
        except ImportError as e:
            return {"success": False, "error": f"pdfplumber not installed: {e}"}

        target_pages = parse_page_range(pages, total_pages)
        all_tables = []
        with pdfplumber.open(pdf_path) as pdf:
            for i in target_pages:
                page = pdf.pages[i]
                tables = page.extract_tables()
                for t_idx, table in enumerate(tables):
                    all_tables.append({
                        "page": i + 1,
                        "table_index": t_idx + 1,
                        "rows": len(table),
                        "cols": len(table[0]) if table else 0,
                        "data": table[:50],  # cap rows
                    })

        return {
            "success": True,
            "pages": total_pages,
            "tables_found": len(all_tables),
            "tables": all_tables,
        }

    if operation == "extract_images":
        try:
            import fitz  # pymupdf
        except ImportError as e:
            return {"success": False, "error": f"pymupdf not installed: {e}"}

        if not output_path:
            output_path = "/tmp/pdf_images"
        os.makedirs(output_path, exist_ok=True)

        doc = fitz.open(pdf_path)
        target_pages = parse_page_range(pages, total_pages)
        extracted = []

        for i in target_pages:
            page = doc[i]
            image_list = page.getImageList()
            for img_idx, img in enumerate(image_list):
                xref = img[0]
                try:
                    base_image = doc.extractImage(xref)
                    image_bytes = base_image["image"]
                    ext = base_image["ext"]
                    fname = os.path.join(output_path, f"page{i + 1}_img{img_idx + 1}.{ext}")
                    with open(fname, "wb") as f:
                        f.write(image_bytes)
                    extracted.append({
                        "page": i + 1,
                        "index": img_idx + 1,
                        "path": fname,
                        "ext": ext,
                        "size_kb": round(len(image_bytes) / 1024, 2),
                    })
                except Exception:
                    continue

        return {
            "success": True,
            "pages": total_pages,
            "images_extracted": len(extracted),
            "images": extracted[:50],
            "output_dir": output_path,
        }

    if operation == "split":
        if not output_path:
            output_path = "/tmp/pdf_split"
        os.makedirs(output_path, exist_ok=True)
        target_pages = parse_page_range(pages, total_pages)
        from pypdf import PdfWriter
        writer = PdfWriter()
        for i in target_pages:
            writer.add_page(reader.pages[i])
        out_file = os.path.join(output_path, f"split_{os.path.basename(pdf_path)}")
        with open(out_file, "wb") as f:
            writer.write(f)
        return {
            "success": True,
            "file": out_file,
            "pages_in_split": len(target_pages),
            "size_kb": round(os.path.getsize(out_file) / 1024, 2),
        }

    if operation == "merge":
        if not merge_files:
            return {"success": False, "error": "merge_files list required for merge operation"}
        if not output_path:
            output_path = "/tmp/merged.pdf"
        from pypdf import PdfWriter
        writer = PdfWriter()
        all_files = [pdf_path] + merge_files
        for f in all_files:
            if not os.path.exists(f):
                continue
            r = PdfReader(f)
            for page in r.pages:
                writer.add_page(page)
        with open(output_path, "wb") as f:
            writer.write(f)
        return {
            "success": True,
            "file": output_path,
            "merged_count": len(all_files),
            "total_pages": len(writer.pages),
            "size_kb": round(os.path.getsize(output_path) / 1024, 2),
        }

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return process(args.get("pdf_path", ""), args.get("operation", "extract_text"), args.get("output_path"), args.get("pages", "all"), args.get("merge_files"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf_path", required=True)
    parser.add_argument("--operation", default="extract_text", choices=["extract_text", "extract_images", "extract_tables", "merge", "split", "page_count", "metadata"])
    parser.add_argument("--output_path", default=None)
    parser.add_argument("--pages", default="all")
    parser.add_argument("--merge_files", nargs="*", default=None)
    args = parser.parse_args()
    result = process(args.pdf_path, args.operation, args.output_path, args.pages, args.merge_files)
    print(json.dumps(result, ensure_ascii=False, default=str))

```

---

## `src/lib/tools-registry/python/audio_processor.py`

> Size: 9.5KB | Lines: 231 | Lang: python

```python
"""
Tool: audio_processor
Category: media
Package: pydub, librosa
Description: معالجة الصوت — تحويل formats، تقطيع، دمج، تطبيع، استخراج features.

Dependencies:
  - pydub (pip install pydub)
  - librosa (pip install librosa) — optional, for advanced features
  - System: ffmpeg (apt install ffmpeg)

Input:
  {
    "input_path": "/path/to/audio.mp3",
    "output_path": "/path/to/output.wav",
    "operation": "convert" | "cut" | "merge" | "normalize" | "info" | "extract_features",
    "params": {
      "format": "mp3" | "wav" | "ogg" | "flac",
      "start_time": 0,
      "end_time": 30,
      "bitrate": "192k",
      "merge_files": ["/path/to/other.mp3"]
    }
  }

Output:
  {
    "success": true,
    "file": "/path/to/output.wav",
    "duration_seconds": 30.5,
    "size_kb": 480.2
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def process(input_path: str = None, output_path: str = None, operation: str = "info", params: dict = None):
    params = params or {}

    try:
        from pydub import AudioSegment
    except ImportError as e:
        return {"success": False, "error": f"pydub not installed: {e}"}

    if operation == "info":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        try:
            audio = AudioSegment.from_file(input_path)
            return {
                "success": True,
                "file": input_path,
                "duration_seconds": round(len(audio) / 1000, 2),
                "channels": audio.channels,
                "sample_width": audio.sample_width,
                "frame_rate": audio.frame_rate,
                "frame_count": audio.frame_count(),
                "size_kb": round(os.path.getsize(input_path) / 1024, 2),
                "dbfs": round(audio.dBFS, 2) if audio.dBFS != float("-inf") else None,
            }
        except Exception as e:
            return {"success": False, "error": f"failed to read audio: {str(e)[:200]}"}

    if operation == "convert":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        if not output_path:
            return {"success": False, "error": "output_path required for convert"}
        try:
            audio = AudioSegment.from_file(input_path)
            fmt = params.get("format", os.path.splitext(output_path)[1][1:].lower())
            bitrate = params.get("bitrate", "192k")
            if fmt in ("mp3",):
                audio.export(output_path, format="mp3", bitrate=bitrate)
            elif fmt in ("wav",):
                audio.export(output_path, format="wav")
            elif fmt in ("ogg",):
                audio.export(output_path, format="ogg", bitrate=bitrate)
            elif fmt in ("flac",):
                audio.export(output_path, format="flac")
            else:
                return {"success": False, "error": f"unsupported format: {fmt}"}
            return {
                "success": True,
                "file": output_path,
                "format": fmt,
                "duration_seconds": round(len(audio) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"convert failed: {str(e)[:200]}"}

    if operation == "cut":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        if not output_path:
            return {"success": False, "error": "output_path required for cut"}
        try:
            audio = AudioSegment.from_file(input_path)
            start_ms = int(params.get("start_time", 0) * 1000)
            end_ms = int(params.get("end_time", len(audio) / 1000) * 1000)
            cut = audio[start_ms:end_ms]
            cut.export(output_path, format=os.path.splitext(output_path)[1][1:].lower() or "mp3")
            return {
                "success": True,
                "file": output_path,
                "start_seconds": start_ms / 1000,
                "end_seconds": end_ms / 1000,
                "duration_seconds": round(len(cut) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"cut failed: {str(e)[:200]}"}

    if operation == "merge":
        if not input_path:
            return {"success": False, "error": "input_path required for merge"}
        merge_files = params.get("merge_files", [])
        if not merge_files:
            return {"success": False, "error": "merge_files list required for merge"}
        if not output_path:
            return {"success": False, "error": "output_path required for merge"}
        try:
            combined = AudioSegment.empty()
            all_files = [input_path] + merge_files
            for f in all_files:
                if os.path.exists(f):
                    seg = AudioSegment.from_file(f)
                    combined += seg
            fmt = os.path.splitext(output_path)[1][1:].lower() or "mp3"
            combined.export(output_path, format=fmt)
            return {
                "success": True,
                "file": output_path,
                "merged_count": len(all_files),
                "duration_seconds": round(len(combined) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"merge failed: {str(e)[:200]}"}

    if operation == "normalize":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        if not output_path:
            return {"success": False, "error": "output_path required for normalize"}
        try:
            audio = AudioSegment.from_file(input_path)
            # Normalize to -3 dB
            target_dbfs = -3.0
            change = target_dbfs - audio.dBFS if audio.dBFS != float("-inf") else 0
            normalized = audio.apply_gain(change)
            fmt = os.path.splitext(output_path)[1][1:].lower() or "mp3"
            normalized.export(output_path, format=fmt)
            return {
                "success": True,
                "file": output_path,
                "original_dbfs": round(audio.dBFS, 2),
                "normalized_dbfs": round(normalized.dBFS, 2),
                "duration_seconds": round(len(normalized) / 1000, 2),
                "size_kb": round(os.path.getsize(output_path) / 1024, 2),
            }
        except Exception as e:
            return {"success": False, "error": f"normalize failed: {str(e)[:200]}"}

    if operation == "extract_features":
        if not input_path or not os.path.exists(input_path):
            return {"success": False, "error": f"input file not found: {input_path}"}
        try:
            import librosa
            import numpy as np
            y, sr = librosa.load(input_path, sr=None)
            duration = len(y) / sr
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            # Spectral features
            spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
            rms = librosa.feature.rms(y=y)[0]
            zero_crossing_rate = librosa.feature.zero_crossing_rate(y)[0]
            return {
                "success": True,
                "file": input_path,
                "duration_seconds": round(float(duration), 2),
                "sample_rate": int(sr),
                "tempo_bpm": round(float(tempo), 2),
                "rms_mean": round(float(np.mean(rms)), 4),
                "spectral_centroid_mean": round(float(np.mean(spectral_centroids)), 2),
                "zero_crossing_rate_mean": round(float(np.mean(zero_crossing_rate)), 4),
            }
        except ImportError:
            return {"success": False, "error": "librosa not installed for feature extraction"}
        except Exception as e:
            return {"success": False, "error": f"feature extraction failed: {str(e)[:200]}"}

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return process(args.get("input_path"), args.get("output_path"), args.get("operation", "info"), args.get("params", {}))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_path", default=None)
    parser.add_argument("--output_path", default=None)
    parser.add_argument("--operation", required=True, choices=["convert", "cut", "merge", "normalize", "info", "extract_features"])
    parser.add_argument("--params", default="{}", help="JSON string of params")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = process(args.input_path, args.output_path, args.operation, params)
    print(json.dumps(result, ensure_ascii=False, default=str))

```

---

## `src/lib/tools-registry/python/text_to_speech.py`

> Size: 4.7KB | Lines: 144 | Lang: python

```python
"""
Tool: text_to_speech
Category: media/audio
Package: edge-tts, gtts (fallback)
Description: تحويل نص إلى صوت MP3 — يدعم العربية والإنجليزية و 50+ لغة.

Dependencies:
  - edge-tts (pip install edge-tts)  # primary, high-quality neural voices
  - gtts (pip install gTTS)  # fallback

Input:
  {
    "text": "النص المطلوب تحويله لصوت",
    "voice": "ar-EG-SalmaNeural" | "en-US-JennyNeural" | "auto",
    "output_path": "/tmp/tts_output.mp3",
    "rate": "+0%",  # speed
    "volume": "+0%"  # volume
  }

Output:
  {"success": true, "file": "/tmp/tts_output.mp3", "size_kb": 12.5, "duration_seconds": 5.2}
"""
import sys
import os
import json
import asyncio

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


# Default voices by language
DEFAULT_VOICES = {
    "ar": "ar-EG-SalmaNeural",
    "en": "en-US-JennyNeural",
    "fr": "fr-FR-DeniseNeural",
    "es": "es-ES-ElviraNeural",
    "de": "de-DE-KatjaNeural",
    "it": "it-IT-ElsaNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "tr": "tr-TR-EmelNeural",
    "hi": "hi-IN-SwaraNeural",
    "ja": "ja-JP-NanamiNeural",
    "ko": "ko-KR-SunHiNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
}


def detect_language(text: str) -> str:
    """Quick language detection."""
    arabic_chars = sum(1 for c in text if "\u0600" <= c <= "\u06FF")
    if arabic_chars > len(text) * 0.3:
        return "ar"
    return "en"


async def _edge_tts_synthesize(text: str, voice: str, output_path: str, rate: str, volume: str):
    import edge_tts
    communicate = edge_tts.Communicate(text, voice, rate=rate, volume=volume)
    await communicate.save(output_path)


def synthesize(text: str, voice: str = "auto", output_path: str = "/tmp/tts_output.mp3", rate: str = "+0%", volume: str = "+0%"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}

    # Auto-pick voice
    if voice == "auto" or not voice:
        lang = detect_language(text)
        voice = DEFAULT_VOICES.get(lang, "en-US-JennyNeural")

    # Try edge-tts first
    try:
        asyncio.run(_edge_tts_synthesize(text, voice, output_path, rate, volume))
        size_kb = os.path.getsize(output_path) / 1024
        # Estimate duration (~15 chars/sec for neural TTS)
        duration = len(text) / 15.0
        return {
            "success": True,
            "file": output_path,
            "voice": voice,
            "size_kb": round(size_kb, 2),
            "duration_seconds": round(duration, 2),
            "text_length": len(text),
            "engine": "edge-tts",
        }
    except ImportError:
        pass
    except Exception as e:
        # Fallback to gTTS
        pass

    # Fallback: gTTS
    try:
        from gtts import gTTS
        lang = "ar" if "ar-" in voice else "en"
        tts = gTTS(text=text, lang=lang, slow=False)
        tts.save(output_path)
        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "voice": f"gTTS-{lang}",
            "size_kb": round(size_kb, 2),
            "duration_seconds": round(len(text) / 15.0, 2),
            "text_length": len(text),
            "engine": "gtts",
        }
    except ImportError as e:
        return {"success": False, "error": f"neither edge-tts nor gtts installed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"TTS failed: {str(e)[:200]}"}



def _dispatch(args):
    return synthesize(args.get("text", ""), args.get("voice", "auto"), args.get("output_path", "/tmp/tts_output.mp3"), args.get("rate", "+0%"), args.get("volume", "+0%"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--voice", default="auto")
    parser.add_argument("--output_path", default="/tmp/tts_output.mp3")
    parser.add_argument("--rate", default="+0%")
    parser.add_argument("--volume", default="+0%")
    args = parser.parse_args()
    result = synthesize(args.text, args.voice, args.output_path, args.rate, args.volume)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/qr_code_generator.py`

> Size: 4.0KB | Lines: 113 | Lang: python

```python
"""
Tool: qr_code_generator
Category: utility
Package: qrcode, pillow
Description: توليد QR codes بأنواع مختلفة — URL, text, WiFi, vCard, email.

Dependencies:
  - qrcode (pip install qrcode)
  - pillow (pip install pillow)

Input:
  {
    "data": "https://example.com",
    "output_path": "/tmp/qr.png",
    "size": 10,  # box size
    "border": 4,
    "fill_color": "black",
    "back_color": "white",
    "error_correction": "L" | "M" | "Q" | "H"
  }

Output:
  {"success": true, "file": "/tmp/qr.png", "size_kb": 2.5, "data": "..."}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

ERROR_LEVELS = {"L": 1, "M": 0, "Q": 3, "H": 2}  # qrcode.constants.ERROR_CORRECT_*


def generate(data: str, output_path: str = "/tmp/qr.png", size: int = 10, border: int = 4, fill_color: str = "black", back_color: str = "white", error_correction: str = "M"):
    if not data:
        return {"success": False, "error": "data required"}

    try:
        import qrcode
    except ImportError as e:
        return {"success": False, "error": f"qrcode not installed: {e}"}

    try:
        ec = ERROR_LEVELS.get(error_correction, 0)
        qr = qrcode.QRCode(
            version=1,
            error_correction=ec,
            box_size=size,
            border=border,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color=fill_color, back_color=back_color)
        img.save(output_path)
        size_kb = os.path.getsize(output_path) / 1024
        return {
            "success": True,
            "file": output_path,
            "size_kb": round(size_kb, 2),
            "data": data[:100],
            "data_length": len(data),
            "dimensions": list(img.size),
            "error_correction": error_correction,
        }
    except Exception as e:
        return {"success": False, "error": f"QR generation failed: {str(e)[:200]}"}


def generate_wifi(ssid: str, password: str, security: str = "WPA", hidden: bool = False, output_path: str = "/tmp/qr_wifi.png"):
    """Generate WiFi QR code."""
    data = f"WIFI:T:{security};S:{ssid};P:{password};H:{'true' if hidden else 'false'};;"
    return generate(data, output_path)


def generate_vcard(name: str, phone: str = "", email: str = "", org: str = "", output_path: str = "/tmp/qr_vcard.png"):
    """Generate vCard QR code."""
    data = f"BEGIN:VCARD\nVERSION:3.0\nFN:{name}\nORG:{org}\nTEL:{phone}\nEMAIL:{email}\nEND:VCARD"
    return generate(data, output_path)



def _dispatch(args):
    return generate(args.get("data", ""), args.get("output_path", "/tmp/qr.png"), int(args.get("size", 10)), int(args.get("border", 4)), args.get("fill_color", "black"), args.get("back_color", "white"), args.get("error_correction", "M"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True)
    parser.add_argument("--output_path", default="/tmp/qr.png")
    parser.add_argument("--size", type=int, default=10)
    parser.add_argument("--border", type=int, default=4)
    parser.add_argument("--fill_color", default="black")
    parser.add_argument("--back_color", default="white")
    parser.add_argument("--error_correction", default="M", choices=["L", "M", "Q", "H"])
    args = parser.parse_args()
    result = generate(args.data, args.output_path, args.size, args.border, args.fill_color, args.back_color, args.error_correction)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/translator.py`

> Size: 4.3KB | Lines: 119 | Lang: python

```python
"""
Tool: translator
Category: ai/nlp
Package: deep-translator, googletrans (fallback)
Description: ترجمة نص بين لغات مختلفة باستخدام محركات متعددة.

Dependencies:
  - deep-translator (pip install deep-translator)

Input:
  {
    "text": "Hello world",
    "source_lang": "en" | "auto",
    "target_lang": "ar",
    "engine": "google" | "microsoft" | "deepl" | "mymemory"
  }

Output:
  {
    "success": true,
    "original": "Hello world",
    "translated": "مرحبا بالعالم",
    "source_lang": "en",
    "target_lang": "ar",
    "engine": "google"
  }
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def translate(text: str, source_lang: str = "auto", target_lang: str = "en", engine: str = "google"):
    if not text or not text.strip():
        return {"success": False, "error": "text required"}
    if not target_lang:
        return {"success": False, "error": "target_lang required"}

    try:
        if engine == "google":
            from deep_translator import GoogleTranslator
            t = GoogleTranslator(source=source_lang if source_lang != "auto" else "auto", target=target_lang)
            result = t.translate(text)
        elif engine == "microsoft":
            from deep_translator import MicrosoftTranslator
            t = MicrosoftTranslator(source=source_lang if source_lang != "auto" else "auto", target=target_lang)
            result = t.translate(text)
        elif engine == "deepl":
            from deep_translator import DeeplTranslator
            t = DeeplTranslator(source=source_lang if source_lang != "auto" else None, target=target_lang, use_free_api=True)
            result = t.translate(text)
        elif engine == "mymemory":
            from deep_translator import MyMemoryTranslator
            t = MyMemoryTranslator(source=source_lang if source_lang != "auto" else "auto", target=target_lang)
            result = t.translate(text)
        else:
            return {"success": False, "error": f"unknown engine: {engine}"}

        return {
            "success": True,
            "original": text,
            "translated": result,
            "source_lang": source_lang,
            "target_lang": target_lang,
            "engine": engine,
            "original_length": len(text),
            "translated_length": len(result) if result else 0,
        }
    except ImportError as e:
        return {"success": False, "error": f"deep-translator not installed: {e}"}
    except Exception as e:
        return {"success": False, "error": f"translation failed: {str(e)[:200]}"}


def detect_language(text: str):
    """Detect source language."""
    try:
        from deep_translator import GoogleTranslator
        t = GoogleTranslator(source="auto", target="en")
        # Trigger detection
        t.translate(text)
        detected = t.detect_language(text) if hasattr(t, "detect_language") else None
        return {"success": True, "language": detected, "engine": "google"}
    except Exception as e:
        return {"success": False, "error": str(e)[:200]}



def _dispatch(args):
    return translate(args.get("text", ""), args.get("source_lang", "auto"), args.get("target_lang", "en"), args.get("engine", "google"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--source_lang", default="auto")
    parser.add_argument("--target_lang", default="en")
    parser.add_argument("--engine", default="google", choices=["google", "microsoft", "deepl", "mymemory"])
    args = parser.parse_args()
    result = translate(args.text, args.source_lang, args.target_lang, args.engine)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/document_generator.py`

> Size: 10.0KB | Lines: 289 | Lang: python

```python
"""
Tool: document_generator
Category: utility/docs
Package: python-docx, python-pptx, openpyxl, reportlab, fpdf2
Description: إنشاء مستندات Word, Excel, PowerPoint, PDF من بيانات.

Dependencies:
  - python-docx (pip install python-docx)
  - python-pptx (pip install python-pptx)
  - openpyxl (pip install openpyxl)
  - reportlab (pip install reportlab)
  - fpdf2 (pip install fpdf2)

Input:
  {
    "format": "docx" | "xlsx" | "pptx" | "pdf",
    "output_path": "/tmp/document.docx",
    "title": "Document Title",
    "content": { ... }  # format-specific
  }

Output:
  {"success": true, "file": "/tmp/document.docx", "size_kb": 25.3}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def generate(format: str, output_path: str, title: str = "", content: dict = None):
    content = content or {}
    if not output_path:
        return {"success": False, "error": "output_path required"}

    try:
        if format == "docx":
            return _generate_docx(output_path, title, content)
        elif format == "xlsx":
            return _generate_xlsx(output_path, title, content)
        elif format == "pptx":
            return _generate_pptx(output_path, title, content)
        elif format == "pdf":
            return _generate_pdf(output_path, title, content)
        else:
            return {"success": False, "error": f"unsupported format: {format}"}
    except Exception as e:
        return {"success": False, "error": f"generation failed: {str(e)[:200]}"}


def _generate_docx(output_path: str, title: str, content: dict):
    from docx import Document
    from docx.shared import Pt, Inches, RGBColor

    doc = Document()
    if title:
        h = doc.add_heading(title, level=0)
        h.alignment = 1  # center

    # Paragraphs
    for para in content.get("paragraphs", []):
        if isinstance(para, dict):
            text = para.get("text", "")
            style = para.get("style", "Normal")
            p = doc.add_paragraph(text, style=style)
        else:
            doc.add_paragraph(str(para))

    # Headings
    for h_data in content.get("headings", []):
        if isinstance(h_data, dict):
            doc.add_heading(h_data.get("text", ""), level=h_data.get("level", 1))
        else:
            doc.add_heading(str(h_data), level=1)

    # Table
    if content.get("table"):
        table_data = content["table"]
        if table_data and isinstance(table_data, list):
            rows = len(table_data)
            cols = len(table_data[0]) if table_data[0] else 0
            table = doc.add_table(rows=rows, cols=cols)
            table.style = "Table Grid"
            for r, row in enumerate(table_data):
                for c, cell in enumerate(row):
                    table.cell(r, c).text = str(cell)

    # Bullet list
    for item in content.get("bullets", []):
        doc.add_paragraph(str(item), style="List Bullet")

    doc.save(output_path)
    return {
        "success": True,
        "file": output_path,
        "size_kb": round(os.path.getsize(output_path) / 1024, 2),
        "format": "docx",
    }


def _generate_xlsx(output_path: str, title: str, content: dict):
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment
    from openpyxl.chart import BarChart, LineChart, Reference

    wb = Workbook()
    ws = wb.active
    ws.title = title[:31] if title else "Sheet1"

    # Title row
    if title:
        ws["A1"] = title
        ws["A1"].font = Font(bold=True, size=14)
        ws.merge_cells("A1:E1")

    # Headers
    headers = content.get("headers", [])
    if headers:
        for col_idx, h in enumerate(headers, 1):
            cell = ws.cell(row=2, column=col_idx, value=str(h))
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill(start_color="4F46E5", end_color="4F46E5", fill_type="solid")
            cell.alignment = Alignment(horizontal="center")

    # Data rows
    rows = content.get("rows", [])
    for r_idx, row in enumerate(rows, 3):
        for c_idx, val in enumerate(row, 1):
            ws.cell(row=r_idx, column=c_idx, value=val)

    # Auto-size columns (use cell.column_letter directly to avoid merged cell issues)
    from openpyxl.utils import get_column_letter
    for col_idx in range(1, len(headers) + 1):
        max_length = len(str(headers[col_idx - 1])) if col_idx <= len(headers) else 8
        for row in rows:
            if col_idx <= len(row):
                max_length = max(max_length, len(str(row[col_idx - 1])))
        ws.column_dimensions[get_column_letter(col_idx)].width = min(50, max_length + 2)

    # Add chart if requested
    if content.get("chart") and rows:
        chart_type = content["chart"]
        if chart_type == "bar":
            chart = BarChart()
        elif chart_type == "line":
            chart = LineChart()
        else:
            chart = BarChart()
        data = Reference(ws, min_col=1, min_row=2, max_row=2 + len(rows), max_col=len(headers))
        chart.add_data(data, titles_from_data=True)
        chart.title = title or "Chart"
        ws.add_chart(chart, f"G2")

    wb.save(output_path)
    return {
        "success": True,
        "file": output_path,
        "size_kb": round(os.path.getsize(output_path) / 1024, 2),
        "format": "xlsx",
        "rows": len(rows),
    }


def _generate_pptx(output_path: str, title: str, content: dict):
    from pptx import Presentation
    from pptx.util import Inches, Pt

    prs = Presentation()
    # Title slide
    slide_layout = prs.slide_layouts[0]
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = title or "Presentation"
    if slide.placeholders[1]:
        slide.placeholders[1].text = content.get("subtitle", "")

    # Content slides
    for slide_data in content.get("slides", []):
        if isinstance(slide_data, dict):
            layout_idx = 1 if slide_data.get("bullets") else 5
            slide_layout = prs.slide_layouts[layout_idx]
            slide = prs.slides.add_slide(slide_layout)
            if slide.shapes.title:
                slide.shapes.title.text = slide_data.get("title", "")
            if slide_data.get("bullets"):
                body = slide.placeholders[1]
                tf = body.text_frame
                for i, bullet in enumerate(slide_data["bullets"]):
                    if i == 0:
                        tf.text = str(bullet)
                    else:
                        p = tf.add_paragraph()
                        p.text = str(bullet)

    prs.save(output_path)
    return {
        "success": True,
        "file": output_path,
        "size_kb": round(os.path.getsize(output_path) / 1024, 2),
        "format": "pptx",
        "slides": 1 + len(content.get("slides", [])),
    }


def _generate_pdf(output_path: str, title: str, content: dict):
    from reportlab.lib.pagesizes import A4, letter
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib import colors

    doc = SimpleDocTemplate(output_path, pagesize=A4, topMargin=inch, bottomMargin=inch)
    styles = getSampleStyleSheet()
    story = []

    if title:
        story.append(Paragraph(title, styles["Title"]))
        story.append(Spacer(1, 0.2 * inch))

    for para in content.get("paragraphs", []):
        text = para if isinstance(para, str) else para.get("text", "")
        style_name = para.get("style", "Normal") if isinstance(para, dict) else "Normal"
        style = styles.get(style_name, styles["Normal"])
        story.append(Paragraph(text, style))
        story.append(Spacer(1, 0.1 * inch))

    if content.get("table"):
        table_data = content["table"]
        if table_data:
            # Wrap cells in Paragraph for proper rendering
            wrapped = []
            for row in table_data:
                wrapped.append([Paragraph(str(c), styles["Normal"]) for c in row])
            t = Table(wrapped)
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 12),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F3F4F6")),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]))
            story.append(t)

    for bullet in content.get("bullets", []):
        story.append(Paragraph(f"• {bullet}", styles["Normal"]))

    doc.build(story)
    return {
        "success": True,
        "file": output_path,
        "size_kb": round(os.path.getsize(output_path) / 1024, 2),
        "format": "pdf",
    }



def _dispatch(args):
    return generate(args.get("format", ""), args.get("output_path", ""), args.get("title", ""), args.get("content", {}))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--format", required=True, choices=["docx", "xlsx", "pptx", "pdf"])
    parser.add_argument("--output_path", required=True)
    parser.add_argument("--title", default="")
    parser.add_argument("--content", default="{}", help="JSON string")
    args = parser.parse_args()
    content = json.loads(args.content)
    result = generate(args.format, args.output_path, args.title, content)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/fake_data_generator.py`

> Size: 4.0KB | Lines: 119 | Lang: python

```python
"""
Tool: fake_data_generator
Category: utility
Package: faker
Description: توليد بيانات وهمية واقعية — أسماء، إيميلات، عناوين، أرقام هواتف.

Dependencies:
  - faker (pip install faker)

Input:
  {
    "data_type": "name" | "email" | "address" | "phone" | "company" | "text" | "all",
    "count": 10,
    "locale": "en_US" | "ar_EG" | "fr_FR"
  }

Output:
  {"success": true, "data": [...], "count": 10}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def generate(data_type: str = "name", count: int = 10, locale: str = "en_US"):
    if count < 1 or count > 1000:
        count = min(max(count, 1), 1000)

    try:
        from faker import Faker
        fake = Faker(locale)
    except ImportError as e:
        return {"success": False, "error": f"faker not installed: {e}"}
    except Exception as e:
        # Fallback to en_US if locale invalid
        try:
            from faker import Faker
            fake = Faker("en_US")
        except ImportError as e:
            return {"success": False, "error": f"faker not installed: {e}"}

    data = []
    for _ in range(count):
        try:
            if data_type == "name":
                data.append(fake.name())
            elif data_type == "email":
                data.append(fake.email())
            elif data_type == "address":
                data.append(fake.address().replace("\n", ", "))
            elif data_type == "phone":
                data.append(fake.phone_number())
            elif data_type == "company":
                data.append(fake.company())
            elif data_type == "text":
                data.append(fake.text(max_nb_chars=200))
            elif data_type == "date":
                data.append(fake.date_of_birth().isoformat())
            elif data_type == "url":
                data.append(fake.url())
            elif data_type == "credit_card":
                data.append(fake.credit_card_number())
            elif data_type == "uuid":
                data.append(str(fake.uuid4()))
            elif data_type == "all":
                data.append({
                    "name": fake.name(),
                    "email": fake.email(),
                    "phone": fake.phone_number(),
                    "address": fake.address().replace("\n", ", "),
                    "company": fake.company(),
                    "job": fake.job(),
                    "date_of_birth": fake.date_of_birth().isoformat(),
                })
            else:
                return {"success": False, "error": f"unknown data_type: {data_type}"}
        except Exception as e:
            data.append(None)

    return {
        "success": True,
        "data": data,
        "count": len(data),
        "data_type": data_type,
        "locale": locale,
    }



def _dispatch(args):
    return generate(args.get("data_type", "name"), int(args.get("count", 10)), args.get("locale", "en_US"))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_type", default="name", choices=["name", "email", "address", "phone", "company", "text", "date", "url", "credit_card", "uuid", "all"])
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--locale", default="en_US")
    args = parser.parse_args()
    result = generate(args.data_type, args.count, args.locale)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/file_utilities.py`

> Size: 9.4KB | Lines: 242 | Lang: python

```python
"""
Tool: file_utilities
Category: utility
Package: pure-Python (no external deps)
Description: أدوات ملفات شاملة — بحث، قراءة، كتابة، حذف، نسخ، ضغط.

Dependencies: none

Input:
  {
    "operation": "list_dir" | "read_file" | "write_file" | "delete" | "copy" | "move" |
                  "file_info" | "search_files" | "zip_dir" | "unzip" | "tree",
    "path": "/some/path",
    "params": {...}
  }

Output: operation-specific dict
"""
import sys
import os
import json
import shutil
import hashlib
from pathlib import Path


def operations(operation: str, path: str = None, params: dict = None):
    params = params or {}

    if operation == "list_dir":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        if not os.path.isdir(path):
            return {"success": False, "error": "path is not a directory"}
        items = []
        for item in sorted(os.listdir(path)):
            full = os.path.join(path, item)
            try:
                st = os.stat(full)
                items.append({
                    "name": item,
                    "type": "dir" if os.path.isdir(full) else "file",
                    "size_bytes": st.st_size if os.path.isfile(full) else None,
                    "modified": st.st_mtime,
                })
            except Exception:
                items.append({"name": item, "type": "unknown"})
        return {"success": True, "path": path, "items": items, "count": len(items)}

    if operation == "read_file":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"file not found: {path}"}
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read(int(params.get("max_bytes", 100000)))
            return {
                "success": True,
                "path": path,
                "content": content,
                "size_bytes": os.path.getsize(path),
                "truncated": os.path.getsize(path) > int(params.get("max_bytes", 100000)),
            }
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "write_file":
        if not path:
            return {"success": False, "error": "path required"}
        content = params.get("content", "")
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return {"success": True, "path": path, "bytes_written": len(content.encode("utf-8"))}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "delete":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        try:
            if os.path.isdir(path):
                shutil.rmtree(path)
            else:
                os.remove(path)
            return {"success": True, "deleted": path}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "copy":
        dest = params.get("destination")
        if not path or not os.path.exists(path) or not dest:
            return {"success": False, "error": "path and destination required"}
        try:
            if os.path.isdir(path):
                shutil.copytree(path, dest)
            else:
                shutil.copy2(path, dest)
            return {"success": True, "source": path, "destination": dest}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "move":
        dest = params.get("destination")
        if not path or not os.path.exists(path) or not dest:
            return {"success": False, "error": "path and destination required"}
        try:
            shutil.move(path, dest)
            return {"success": True, "source": path, "destination": dest}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "file_info":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        try:
            st = os.stat(path)
            # MD5 hash for files
            md5 = ""
            if os.path.isfile(path) and st.st_size < 10 * 1024 * 1024:  # 10MB limit
                h = hashlib.md5()
                with open(path, "rb") as f:
                    for chunk in iter(lambda: f.read(8192), b""):
                        h.update(chunk)
                md5 = h.hexdigest()
            return {
                "success": True,
                "path": path,
                "type": "dir" if os.path.isdir(path) else "file",
                "size_bytes": st.st_size,
                "size_kb": round(st.st_size / 1024, 2),
                "created": st.st_ctime,
                "modified": st.st_mtime,
                "accessed": st.st_atime,
                "mode": oct(st.st_mode),
                "md5": md5,
                "extension": os.path.splitext(path)[1] if os.path.isfile(path) else None,
            }
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "search_files":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        pattern = params.get("pattern", "*")
        recursive = params.get("recursive", True)
        max_results = int(params.get("max_results", 100))
        import fnmatch
        matches = []
        try:
            if recursive:
                for root, dirs, files in os.walk(path):
                    for name in files + dirs:
                        if fnmatch.fnmatch(name, pattern):
                            matches.append(os.path.join(root, name))
                            if len(matches) >= max_results:
                                break
                    if len(matches) >= max_results:
                        break
            else:
                for name in os.listdir(path):
                    if fnmatch.fnmatch(name, pattern):
                        matches.append(os.path.join(path, name))
                        if len(matches) >= max_results:
                            break
            return {"success": True, "path": path, "pattern": pattern, "matches": matches, "count": len(matches)}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "zip_dir":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        output = params.get("output_path", path + ".zip")
        try:
            shutil.make_archive(output.replace(".zip", ""), "zip", path)
            return {"success": True, "source": path, "archive": output, "size_kb": round(os.path.getsize(output) / 1024, 2)}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "unzip":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"zip file not found: {path}"}
        dest = params.get("destination", os.path.dirname(path))
        try:
            shutil.unpack_archive(path, dest, "zip")
            return {"success": True, "archive": path, "extracted_to": dest}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "tree":
        if not path or not os.path.exists(path):
            return {"success": False, "error": f"path not found: {path}"}
        max_depth = int(params.get("max_depth", 3))
        def build_tree(p, depth=0):
            if depth > max_depth:
                return None
            try:
                items = []
                for item in sorted(os.listdir(p)):
                    full = os.path.join(p, item)
                    node = {"name": item, "type": "dir" if os.path.isdir(full) else "file"}
                    if os.path.isdir(full):
                        node["children"] = build_tree(full, depth + 1)
                    else:
                        node["size"] = os.path.getsize(full)
                    items.append(node)
                return items
            except Exception:
                return []
        return {"success": True, "path": path, "tree": build_tree(path)}

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return operations(args.get("operation", ""), args.get("path"), args.get("params", {}))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--operation", required=True)
    parser.add_argument("--path", default=None)
    parser.add_argument("--params", default="{}", help="JSON string")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = operations(args.operation, args.path, params)
    print(json.dumps(result, ensure_ascii=False, default=str))

```

---

## `src/lib/tools-registry/python/crypto_utilities.py`

> Size: 6.3KB | Lines: 166 | Lang: python

```python
"""
Tool: crypto_utilities
Category: utility/security
Package: cryptography, pynacl, hashlib
Description: أدوات تشفير شاملة — hashing, AES, RSA, HMAC, random tokens.

Dependencies:
  - cryptography (pip install cryptography)
  - pynacl (pip install pynacl)

Input:
  {
    "operation": "hash" | "aes_encrypt" | "aes_decrypt" | "hmac" | "random_token" | "bcrypt_hash" | "bcrypt_verify" | "base64_encode" | "base64_decode",
    "data": "...",
    "params": {...}
  }

Output:
  {"success": true, "result": "..."}
"""
import sys
import os
import json
import hashlib
import hmac as hmac_module
import base64
import secrets

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def operations(operation: str, data: str = None, params: dict = None):
    params = params or {}

    if operation == "hash":
        algo = params.get("algorithm", "sha256").lower()
        try:
            h = hashlib.new(algo)
            h.update((data or "").encode("utf-8"))
            return {"success": True, "hash": h.hexdigest(), "algorithm": algo, "input_length": len(data or "")}
        except ValueError as e:
            return {"success": False, "error": f"invalid algorithm: {e}"}

    if operation == "hmac":
        key = params.get("key", "")
        algo = params.get("algorithm", "sha256").lower()
        try:
            h = hmac_module.new(key.encode("utf-8"), (data or "").encode("utf-8"), algo)
            return {"success": True, "hmac": h.hexdigest(), "algorithm": algo}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "random_token":
        length = int(params.get("length", 32))
        if length < 1 or length > 1024:
            length = 32
        token = secrets.token_hex(length)
        url_safe = secrets.token_urlsafe(length)
        return {"success": True, "token": token, "url_safe": url_safe, "length": length}

    if operation == "bcrypt_hash":
        password = data or ""
        if not password:
            return {"success": False, "error": "password required"}
        try:
            import bcrypt
            salt = bcrypt.gensalt(rounds=int(params.get("rounds", 12)))
            hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
            return {"success": True, "hash": hashed.decode("utf-8")}
        except ImportError as e:
            return {"success": False, "error": f"bcrypt not installed: {e}"}

    if operation == "bcrypt_verify":
        password = data or ""
        hash_str = params.get("hash", "")
        if not password or not hash_str:
            return {"success": False, "error": "password and hash required"}
        try:
            import bcrypt
            valid = bcrypt.checkpw(password.encode("utf-8"), hash_str.encode("utf-8"))
            return {"success": True, "valid": valid}
        except ImportError as e:
            return {"success": False, "error": f"bcrypt not installed: {e}"}

    if operation == "aes_encrypt":
        plaintext = data or ""
        key = params.get("key", "")
        if not plaintext or not key:
            return {"success": False, "error": "data and key required"}
        try:
            from cryptography.fernet import Fernet
            # Derive a Fernet key from the user's key (module-level hashlib)
            key_bytes = hashlib.sha256(key.encode("utf-8")).digest()
            fernet_key = base64.urlsafe_b64encode(key_bytes)
            f = Fernet(fernet_key)
            encrypted = f.encrypt(plaintext.encode("utf-8"))
            return {"success": True, "encrypted": encrypted.decode("utf-8")}
        except ImportError as e:
            return {"success": False, "error": f"cryptography not installed: {e}"}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "aes_decrypt":
        ciphertext = data or ""
        key = params.get("key", "")
        if not ciphertext or not key:
            return {"success": False, "error": "data and key required"}
        try:
            from cryptography.fernet import Fernet
            key_bytes = hashlib.sha256(key.encode("utf-8")).digest()
            fernet_key = base64.urlsafe_b64encode(key_bytes)
            f = Fernet(fernet_key)
            decrypted = f.decrypt(ciphertext.encode("utf-8"))
            return {"success": True, "decrypted": decrypted.decode("utf-8")}
        except ImportError as e:
            return {"success": False, "error": f"cryptography not installed: {e}"}
        except Exception as e:
            return {"success": False, "error": f"decrypt failed (wrong key?): {str(e)[:200]}"}

    if operation == "base64_encode":
        try:
            encoded = base64.b64encode((data or "").encode("utf-8")).decode("utf-8")
            return {"success": True, "encoded": encoded}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    if operation == "base64_decode":
        try:
            decoded = base64.b64decode((data or "").encode("utf-8")).decode("utf-8")
            return {"success": True, "decoded": decoded}
        except Exception as e:
            return {"success": False, "error": str(e)[:200]}

    return {"success": False, "error": f"unknown operation: {operation}"}



def _dispatch(args):
    return operations(args.get("operation", ""), args.get("data", ""), args.get("params", {}))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--operation", required=True)
    parser.add_argument("--data", default="")
    parser.add_argument("--params", default="{}", help="JSON string")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = operations(args.operation, args.data, params)
    print(json.dumps(result, ensure_ascii=False))

```

---

## `src/lib/tools-registry/python/math_solver.py`

> Size: 5.9KB | Lines: 179 | Lang: python

```python
"""
Tool: math_solver
Category: science
Package: sympy, numpy
Description: حل مسائل رياضية رمزية ومعادلات، تفاضل، تكامل، تبسيط.

Dependencies:
  - sympy (pip install sympy)
  - numpy (pip install numpy)

Input:
  {
    "operation": "solve" | "simplify" | "derivative" | "integrate" | "expand" | "factor" | "evaluate",
    "expression": "x^2 + 2*x + 1",
    "variable": "x",
    "params": {...}
  }

Output:
  {"success": true, "result": "...", "steps": "..."}
"""
import sys
import os
import json

for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def solve(operation: str, expression: str, variable: str = "x", params: dict = None):
    params = params or {}
    if not expression:
        return {"success": False, "error": "expression required"}

    try:
        import sympy
        from sympy import symbols, sympify, solve as sym_solve, simplify, diff, integrate, expand, factor, latex, Eq
    except ImportError as e:
        return {"success": False, "error": f"sympy not installed: {e}"}

    try:
        # Define the variable
        var_symbols = symbols(variable)
        # Parse the expression
        expr = sympify(expression.replace("^", "**"))

        if operation == "solve":
            # Solve equation = 0
            solutions = sym_solve(expr, var_symbols)
            return {
                "success": True,
                "operation": "solve",
                "expression": str(expr),
                "variable": variable,
                "solutions": [str(s) for s in solutions],
                "solutions_count": len(solutions),
                "latex": latex(expr),
            }

        if operation == "simplify":
            result = simplify(expr)
            return {
                "success": True,
                "operation": "simplify",
                "original": str(expr),
                "simplified": str(result),
                "latex": latex(result),
            }

        if operation == "derivative":
            order = int(params.get("order", 1))
            result = expr
            for _ in range(order):
                result = diff(result, var_symbols)
            return {
                "success": True,
                "operation": "derivative",
                "original": str(expr),
                "derivative": str(result),
                "order": order,
                "variable": variable,
                "latex": latex(result),
            }

        if operation == "integrate":
            definite = params.get("definite", False)
            if definite:
                lower = params.get("lower", 0)
                upper = params.get("upper", 1)
                result = integrate(expr, (var_symbols, lower, upper))
                return {
                    "success": True,
                    "operation": "integrate_definite",
                    "original": str(expr),
                    "integral": str(result),
                    "bounds": [lower, upper],
                    "variable": variable,
                }
            else:
                result = integrate(expr, var_symbols)
                return {
                    "success": True,
                    "operation": "integrate",
                    "original": str(expr),
                    "integral": str(result),
                    "variable": variable,
                    "latex": latex(result),
                }

        if operation == "expand":
            result = expand(expr)
            return {
                "success": True,
                "operation": "expand",
                "original": str(expr),
                "expanded": str(result),
                "latex": latex(result),
            }

        if operation == "factor":
            result = factor(expr)
            return {
                "success": True,
                "operation": "factor",
                "original": str(expr),
                "factored": str(result),
                "latex": latex(result),
            }

        if operation == "evaluate":
            values = params.get("values", {})
            substitutions = {symbols(k): v for k, v in values.items()}
            result = expr.subs(substitutions)
            numerical = float(result) if result.is_number else str(result)
            return {
                "success": True,
                "operation": "evaluate",
                "expression": str(expr),
                "substitutions": values,
                "result": str(result),
                "numerical": numerical,
            }

        return {"success": False, "error": f"unknown operation: {operation}"}

    except Exception as e:
        return {"success": False, "error": f"math operation failed: {str(e)[:200]}"}



def _dispatch(args):
    return solve(args.get("operation", ""), args.get("expression", ""), args.get("variable", "x"), args.get("params", {}))


if __name__ == "__main__":

    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--operation", required=True, choices=["solve", "simplify", "derivative", "integrate", "expand", "factor", "evaluate"])
    parser.add_argument("--expression", required=True)
    parser.add_argument("--variable", default="x")
    parser.add_argument("--params", default="{}", help="JSON string")
    args = parser.parse_args()
    params = json.loads(args.params)
    result = solve(args.operation, args.expression, args.variable, params)
    print(json.dumps(result, ensure_ascii=False))

```

---


# 📂 Agent Engine

## `src/lib/agent/agent-engine.ts`

> Size: 7.6KB | Lines: 236 | Lang: typescript

```typescript
/**
 * V.133: Agent Engine — بيـ run الـ agent loop (model → tool call → execute → return)
 *
 * الـ flow:
 * 1. User message → Model (with bind_tools)
 * 2. Model decides → tool_calls
 * 3. Execute tool_calls
 * 4. Feed results back → Model
 * 5. Model generates final answer
 */

import { getToolsSchema, executeTool, ALL_AGENT_TOOLS } from "./custom-tools";

export interface AgentMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export interface AgentResult {
  response: string;
  tool_calls_made: { name: string; args: any; result: string }[];
  messages: AgentMessage[];
  iterations: number;
}

const MAX_ITERATIONS = 5;

/** بيـ run agent loop */
export async function runAgent(
  userMessage: string,
  systemPrompt?: string,
  conversationHistory: AgentMessage[] = []
): Promise<AgentResult> {
  const tools = getToolsSchema();
  const toolDescriptions = ALL_AGENT_TOOLS.map(t => `- ${t.name}: ${t.description}`).join("\n");

  const messages: AgentMessage[] = [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...conversationHistory,
    { role: "user" as const, content: userMessage },
  ];

  const toolCallsMade: { name: string; args: any; result: string }[] = [];
  let iterations = 0;
  let finalResponse = "";

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    // Call model via the existing chat API (internal)
    const modelResponse = await callModelInternal(messages, tools, toolDescriptions);

    if (!modelResponse) {
      finalResponse = "عذراً، حدث خطأ في الاتصال بالنموذج.";
      break;
    }

    // If model wants to call tools
    if (modelResponse.tool_calls && modelResponse.tool_calls.length > 0) {
      const assistantMessage: AgentMessage = {
        role: "assistant",
        content: modelResponse.content || "",
        tool_calls: modelResponse.tool_calls,
      };
      messages.push(assistantMessage);

      // Execute each tool call
      for (const tc of modelResponse.tool_calls) {
        const toolName = tc.function.name;
        let toolArgs: any = {};
        try {
          toolArgs = JSON.parse(tc.function.arguments || "{}");
        } catch {}

        console.log(`[Agent] Tool call: ${toolName} with args:`, toolArgs);
        const result = await executeTool(toolName, toolArgs);
        console.log(`[Agent] Tool result: ${result.slice(0, 200)}`);

        toolCallsMade.push({ name: toolName, args: toolArgs, result });

        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tc.id,
          name: toolName,
        });
      }
      continue;
    }

    // Check if model response contains a tool name to call (fallback for models without native function calling)
    const toolMatch = matchToolFromText(modelResponse.content || "", toolDescriptions);
    if (toolMatch) {
      const result = await executeTool(toolMatch.name, toolMatch.args);
      toolCallsMade.push({ name: toolMatch.name, args: toolMatch.args, result });

      // Feed result back to model
      messages.push({ role: "assistant", content: modelResponse.content || "" });
      messages.push({
        role: "user",
        content: `نتيجة تنفيذ الأداة ${toolMatch.name}:\n${result}\n\nاكتب للمستخدم ملخص النتيجة بالعربية.`,
      });
      continue;
    }

    finalResponse = modelResponse.content || "";
    break;
  }

  if (iterations >= MAX_ITERATIONS && !finalResponse) {
    finalResponse = "وصلت للحد الأقصى من التكرارات. " + (toolCallsMade.length > 0 ? `تم تنفيذ ${toolCallsMade.length} أداة.` : "");
  }

  return {
    response: finalResponse,
    tool_calls_made: toolCallsMade,
    messages,
    iterations,
  };
}

/** بيـ call الـ model عبر الـ internal chat API */
async function callModelInternal(messages: AgentMessage[], tools: any[], toolDescriptions: string): Promise<any> {
  try {
    // Build the prompt with tool descriptions injected
    const systemContent = `أنت Anzaro AI — مساعد ذكي قادر على تنفيذ إجراءات.

لديك الأدوات التالية. إذا احتجت أي منها، اكتب:
TOOL_CALL: {"name": "<tool_name>", "args": {...}}

الأدوات المتاحة:
${toolDescriptions}

قواعد:
1. إذا كان الطلب يحتاج أداة، اكتب TOOL_CALL في أول سطر
2. إذا لم يحتج أداة، أجب مباشرة
3. لا تقل "لا أستطيع" — استخدم الأدوات`;

    // Call the internal chat API
    const response = await fetch("http://localhost:3000/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages[messages.length - 1]?.content || "",
        model: "glm-4-flash-zai",
        systemPrompt: systemContent,
        conversationHistory: messages.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      console.error(`[Agent] Internal API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.content || data.response || data.message || "";

    // Check if content contains TOOL_CALL
    const toolCallMatch = content.match(/TOOL_CALL:\s*({[^}]+})/);
    if (toolCallMatch) {
      try {
        const tc = JSON.parse(toolCallMatch[1]);
        return {
          content: content.replace(/TOOL_CALL:\s*{[^}]+}/, "").trim(),
          tool_calls: [{
            id: `call_${Date.now()}`,
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.args || {}),
            },
          }],
        };
      } catch {}
    }

    return { content, tool_calls: [] };
  } catch (e) {
    console.error("[Agent] Model call error:", e);
    return null;
  }
}

/** Fallback: بيـ match tool from text (للنماذج بدون function calling) */
function matchToolFromText(content: string, toolDescriptions: string): { name: string; args: any } | null {
  const match = content.match(/TOOL_CALL:\s*({[^}]+})/);
  if (match) {
    try {
      const tc = JSON.parse(match[1]);
      if (tc.name && ALL_AGENT_TOOLS.find(t => t.name === tc.name)) {
        return { name: tc.name, args: tc.args || {} };
      }
    } catch {}
  }
  return null;
}

/** بيـ run audio workflow (transcribe → clean → analyze) */
export async function runAudioWorkflow(audioPath: string): Promise<any> {
  const steps: { step: string; result: any }[] = [];

  // Step 1: Clean audio
  console.log("[Audio Workflow] Step 1: Cleaning audio...");
  const cleanResult = await executeTool("clean_audio", { input_path: audioPath, output_path: "cleaned.wav" });
  steps.push({ step: "clean_audio", result: cleanResult });

  // Step 2: Transcribe
  console.log("[Audio Workflow] Step 2: Transcribing...");
  const transcribeResult = await executeTool("transcribe_audio", { file_path: "cleaned.wav", language: "auto" });
  steps.push({ step: "transcribe_audio", result: transcribeResult });

  // Step 3: Analyze sentiment
  let text = "";
  try {
    const t = JSON.parse(transcribeResult.split("\n").find((l: string) => l.startsWith("{")) || "{}");
    text = t.text || "";
  } catch {}

  if (text) {
    console.log("[Audio Workflow] Step 3: Analyzing sentiment...");
    const sentimentResult = await executeTool("analyze_sentiment", { text });
    steps.push({ step: "analyze_sentiment", result: sentimentResult });
  }

  return {
    workflow: "audio_processing",
    steps,
    transcribed_text: text,
  };
}

```

---

## `src/lib/agent/custom-tools.ts`

> Size: 63.3KB | Lines: 1365 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 1365)

```typescript
/**
 * V.133: Custom Tools — أدوات مخصصة باستخدام langchain @tool
 * كل أداة بتـ wrap مكتبة مثبتة وتخليها callable من الـ Agent
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";

const PYTHON_PATHS = ["python3", "/usr/bin/python3", "/usr/local/bin/python3", "/app/.venv/bin/python3", "/home/z/.venv/bin/python3"];
const SITE_PACKAGES = ["/usr/local/lib/python3.11/dist-packages", "/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages", "/home/z/.venv/lib/python3.12/site-packages"];

async function runPython(code: string, timeoutMs = 60000): Promise<string> {
  const pythonPath = "python3";
  const pythonpath = SITE_PACKAGES.join(":");
  return new Promise((resolve) => {
    const proc = spawn(pythonPath, ["-c", code], {
      cwd: "/tmp",
      env: { ...process.env, PYTHONUNBUFFERED: "1", PYTHONPATH: pythonpath },
    });
    let stdout = "", stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    const timer = setTimeout(() => { proc.kill("SIGKILL"); resolve(JSON.stringify({ error: "Timeout" })); }, timeoutMs);
    proc.on("close", () => { clearTimeout(timer); resolve(stdout + (stderr ? `\n[STDERR]\n${stderr}` : "")); });
    proc.on("error", (e) => { clearTimeout(timer); resolve(JSON.stringify({ error: e.message })); });
  });
}

// ═══════════════════════════════════════════
// Tool Definition Schema (LangChain-compatible)
// ═══════════════════════════════════════════
export interface AgentTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<string>;
}

// ═══════════════════════════════════════════
// AUDIO TOOLS (edge-tts, pydub, faster-whisper)
// ═══════════════════════════════════════════

export const textToSpeech: AgentTool = {
  name: "text_to_speech",
  description: "تحويل نص إلى صوت MP3 عالي الجودة باستخدام edge-tts. استخدمها لما المستخدم يطلب تحويل نص لصوت أو إنشاء ملف صوتي.",
  parameters: {
    text: { type: "string", description: "النص المطلوب تحويله لصوت" },
    voice: { type: "string", description: "الصوت (ar-EG-SalmaNeural, ar-SA-HamedNeural, en-US-JennyNeural)", default: "ar-EG-SalmaNeural" },
    filename: { type: "string", description: "اسم الملف الناتج", default: "output.mp3" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import edge_tts, asyncio, json
async def run():
    comm = edge_tts.Communicate("${(args.text || "").replace(/"/g, '\\"')}", "${args.voice || 'ar-EG-SalmaNeural'}")
    fname = "${args.filename || 'output.mp3'}"
    await comm.save(fname)
    print(json.dumps({"file": fname, "text_length": len("${args.text}"), "voice": "${args.voice}"}))
asyncio.run(run())
`;
    return runPython(code);
  },
};

export const transcribeAudio: AgentTool = {
  name: "transcribe_audio",
  description: "تحويل ملف صوتي إلى نص (Speech-to-Text) باستخدام faster-whisper. استخدمها لتحليل التسجيلات الصوتية أو تحويل الصوت لنص.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف الصوت" },
    language: { type: "string", description: "لغة الصوت (ar, en, auto)", default: "auto" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import json
try:
    from faster_whisper import WhisperModel
    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe("${args.file_path}", language="${args.language}" if "${args.language}" != "auto" else None)
    text = " ".join([seg.text for seg in segments])
    print(json.dumps({"text": text, "language": info.language, "duration": info.duration}))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))
`;
    return runPython(code, 120000);
  },
};

export const cleanAudio: AgentTool = {
  name: "clean_audio",
  description: "تنظيف وتحسين جودة الصوت (إزالة الضوضاء، تطبيع الصوت) باستخدام pydub. استخدمها قبل تحويل الصوت لنص لتحسين الدقة.",
  parameters: {
    input_path: { type: "string", description: "مسار ملف الصوت الأصلي" },
    output_path: { type: "string", description: "مسار ملف الصوت النظيف", default: "cleaned.wav" },
  },
  execute: async (args) => {
    const code = `
from pydub import AudioSegment, effects
import json
audio = AudioSegment.from_file("${args.input_path}")
# Normalize
audio = effects.normalize(audio)
# Remove silence at start/end
audio = audio.strip_silence(threshold=-40, padding=100)
out = "${args.output_path || 'cleaned.wav'}"
audio.export(out, format="wav")
print(json.dumps({"file": out, "duration_sec": len(audio) / 1000, "sample_rate": audio.frame_rate}))
`;
    return runPython(code);
  },
};

export const convertAudioFormat: AgentTool = {
  name: "convert_audio_format",
  description: "تحويل صوت من format لآخر (mp3, wav, ogg, flac) باستخدام pydub.",
  parameters: {
    input_path: { type: "string", description: "مسار الملف الأصلي" },
    output_format: { type: "string", description: "الصيغة المطلوبة (mp3, wav, ogg, flac)" },
  },
  execute: async (args) => {
    const fmt = args.output_format || "mp3";
    const code = `
from pydub import AudioSegment
import json
audio = AudioSegment.from_file("${args.input_path}")
out = "${args.input_path.rsplit('.', 1)[0]}_converted.${fmt}"
audio.export(out, format="${fmt}")
print(json.dumps({"file": out, "format": "${fmt}", "duration_sec": len(audio) / 1000}))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// DOCUMENT TOOLS (fitz/PyMuPDF, pdfplumber, python-docx)
// ═══════════════════════════════════════════

export const extractPdfText: AgentTool = {
  name: "extract_pdf_text",
  description: "استخراج النص الكامل من ملف PDF باستخدام PyMuPDF. استخدمها لما المستخدم يطلب قراءة أو تحليل ملف PDF.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف PDF" },
    max_pages: { type: "integer", description: "أقصى عدد صفحات", default: 50 },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import pymupdf, json
doc = pymupdf.open("${args.file_path}")
max_p = min(len(doc), ${args.max_pages || 50})
text = ""
for i in range(max_p):
    text += doc[i].get_text()
    text += "\\n--- Page " + str(i+1) + " ---\\n"
doc.close()
print(json.dumps({"text": text[:5000], "pages": len(doc), "chars": len(text)}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const createDocument: AgentTool = {
  name: "create_document",
  description: "إنشاء مستند Word/PDF/Excel من نص. استخدمها لما المستخدم يطلب إنشاء ملف.",
  parameters: {
    format: { type: "string", description: "نوع المستند (docx, pdf, xlsx)" },
    title: { type: "string", description: "عنوان المستند" },
    content: { type: "string", description: "محتوى المستند" },
    filename: { type: "string", description: "اسم الملف" },
  },
  execute: async (args) => {
    const fmt = args.format || "docx";
    const fname = args.filename || `document.${fmt}`;
    let code = "";
    if (fmt === "docx") {
      code = `
from docx import Document
import json
doc = Document()
doc.add_heading("${(args.title || '').replace(/"/g, '\\"')}", 0)
for line in """${(args.content || '').replace(/"/g, '\\"')}""".split("\\n"):
    doc.add_paragraph(line)
doc.save("${fname}")
print(json.dumps({"file": "${fname}", "format": "docx"}))
`;
    } else if (fmt === "pdf") {
      code = `
from fpdf import FPDF
import json
pdf = FPDF()
pdf.add_page()
pdf.set_font("Helvetica", size=12)
pdf.cell(0, 10, text="${(args.title || '').replace(/"/g, '\\"')}", ln=True)
for line in """${(args.content || '').replace(/"/g, '\\"')}""".split("\\n"):
    pdf.cell(0, 10, text=line, ln=True)
pdf.output("${fname}")
print(json.dumps({"file": "${fname}", "format": "pdf"}))
`;
    } else {
      code = `
from openpyxl import Workbook
import json
wb = Workbook()
ws = wb.active
ws.append(["${(args.title || '').replace(/"/g, '\\"')}"])
for line in """${(args.content || '').replace(/"/g, '\\"')}""".split("\\n"):
    ws.append([line])
wb.save("${fname}")
print(json.dumps({"file": "${fname}", "format": "xlsx"}))
`;
    }
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// DATA & ANALYSIS TOOLS (pandas, numpy, matplotlib)
// ═══════════════════════════════════════════

export const analyzeData: AgentTool = {
  name: "analyze_data",
  description: "تحليل بيانات CSV/JSON باستخدام pandas. استخدمها لما المستخدم يطلب تحليل بيانات أو إحصائيات.",
  parameters: {
    file_path: { type: "string", description: "مسار ملف البيانات (CSV/JSON)" },
    operation: { type: "string", description: "العملية (describe, head, columns, info)" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import pandas as pd, json
df = pd.read_csv("${args.file_path}") if "${args.file_path}".endswith('.csv') else pd.read_json("${args.file_path}")
op = "${args.operation || 'describe'}"
if op == "describe":
    result = df.describe().to_dict()
elif op == "head":
    result = df.head(10).to_dict('records')
elif op == "columns":
    result = {"columns": list(df.columns), "dtypes": {c: str(df[c].dtype) for c in df.columns}}
elif op == "info":
    result = {"rows": len(df), "columns": len(df.columns), "memory": df.memory_usage().sum()}
else:
    result = df.head(5).to_dict('records')
print(json.dumps(result, default=str, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const createChart: AgentTool = {
  name: "create_chart",
  description: "إنشاء رسم بياني (bar, line, pie, scatter) من بيانات باستخدام matplotlib.",
  parameters: {
    chart_type: { type: "string", description: "نوع الرسم (bar, line, pie, scatter)" },
    x_data: { type: "array", description: "بيانات المحور X" },
    y_data: { type: "array", description: "بيانات المحور Y" },
    title: { type: "string", description: "عنوان الرسم" },
    filename: { type: "string", description: "اسم الملف", default: "chart.png" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import json
fig, ax = plt.subplots(figsize=(10,6))
x = ${JSON.stringify(args.x_data || [])}
y = ${JSON.stringify(args.y_data || [])}
ct = "${args.chart_type || 'bar'}"
if ct == "line": ax.plot(x, y, "b-o")
elif ct == "bar": ax.bar(x, y)
elif ct == "pie": ax.pie(y, labels=x, autopct="%1.1f%%")
elif ct == "scatter": ax.scatter(x, y)
if "${args.title || ''}": ax.set_title("${args.title}")
ax.grid(True, alpha=0.3)
plt.tight_layout()
fname = "${args.filename || 'chart.png'}"
plt.savefig(fname, dpi=100)
plt.close()
print(json.dumps({"file": fname}))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// WEB TOOLS (requests, bs4, trafilatura)
// ═══════════════════════════════════════════

export const scrapeWeb: AgentTool = {
  name: "scrape_web",
  description: "استخراج النص من صفحة ويب. استخدمها لما المستخدم يطلب قراءة أو تحليل محتوى موقع.",
  parameters: {
    url: { type: "string", description: "رابط الصفحة" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import trafilatura, json
downloaded = trafilatura.fetch_url("${args.url}")
text = trafilatura.extract(downloaded) or ""
print(json.dumps({"text": text[:5000], "length": len(text)}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const httpRequest: AgentTool = {
  name: "http_request",
  description: "إرسال طلب HTTP (GET/POST) لـ API أو موقع. استخدمها لما المستخدم يطلب جلب بيانات من الإنترنت.",
  parameters: {
    method: { type: "string", description: "نوع الطلب (GET, POST)" },
    url: { type: "string", description: "الرابط" },
    headers: { type: "object", description: "headers إضافية" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import requests, json
resp = requests.${(args.method || 'get').toLowerCase()}("${args.url}", headers=${JSON.stringify(args.headers || {})}, timeout=15)
print(json.dumps({"status": resp.status_code, "text": resp.text[:3000]}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// NLP TOOLS (nltk, vaderSentiment, rapidfuzz)
// ═══════════════════════════════════════════

export const analyzeSentiment: AgentTool = {
  name: "analyze_sentiment",
  description: "تحليل مشاعر نص (إيجابي/سلبي/محايد). استخدمها لما المستخدم يطلب تحليل مشاعر أو رأي.",
  parameters: {
    text: { type: "string", description: "النص المطلوب تحليله" },
  },
  execute: async (args) => {
    const code = `
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
analyzer = SentimentIntensityAnalyzer()
scores = analyzer.polarity_scores("""${(args.text || '').replace(/"/g, '\\"')}""")
label = "إيجابي" if scores["compound"] > 0.05 else "سلبي" if scores["compound"] < -0.05 else "محايد"
print(json.dumps({"scores": scores, "label": label}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const translateText: AgentTool = {
  name: "translate_text",
  description: "ترجمة نص بين اللغات باستخدام deep-translator.",
  parameters: {
    text: { type: "string", description: "النص" },
    target_lang: { type: "string", description: "اللغة المستهدفة (en, ar, fr, es)" },
  },
  execute: async (args) => {
    const code = `
from deep_translator import GoogleTranslator
import json
translator = GoogleTranslator(source='auto', target='${args.target_lang || 'en'}')
result = translator.translate("""${(args.text || '').replace(/"/g, '\\"')}""")
print(json.dumps({"translation": result, "target": "${args.target_lang}"}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ═══════════════════════════════════════════
// MATH & CODE TOOLS (sympy, exec)
// ═══════════════════════════════════════════

export const solveMath: AgentTool = {
  name: "solve_math",
  description: "حل معادلة رياضية أو تبسيطها باستخدام sympy.",
  parameters: {
    expression: { type: "string", description: "المعادلة (مثل: x**2 + 2*x + 1)" },
  },
  execute: async (args) => {
    const code = `
from sympy import sympify, simplify, solve, symbols, diff, integrate
import json
x = symbols('x')
expr = sympify("${args.expression}")
result = {
    "input": "${args.expression}",
    "simplified": str(simplify(expr)),
    "derivative": str(diff(expr, x)),
}
print(json.dumps(result, default=str, ensure_ascii=False))
`;
    return runPython(code);
  },
};

export const executePython: AgentTool = {
  name: "execute_python",
  description: "تنفيذ كود Python مباشر. استخدمها للحسابات المعقدة أو المهام البرمجية.",
  parameters: {
    code: { type: "string", description: "كود Python" },
  },
  execute: async (args) => {
    return runPython(args.code || "", 30000);
  },
};

// ═══════════════════════════════════════════
// REGISTRY — كل الأدوات
// ═══════════════════════════════════════════

// ═══════════════════════════════════════════
// V.134: "عملية تيتانيوم" — Heavy Library Tools
// ═══════════════════════════════════════════

// ── CrewAI: Multi-Agent Orchestration ──
export const runCrewAgents: AgentTool = {
  name: "run_crew_agents",
  description: "تشغيل مجموعة Agents متخصصة باستخدام CrewAI. كل Agent ليه دور (كاتب، مراجع، باحث). استخدمها للمهام المعقدة اللي محتاجة تعاون بين agents.",
  parameters: {
    task: { type: "string", description: "وصف المهمة الكاملة" },
    agents: { type: "string", description: "JSON array of agent roles (e.g. [{role:'writer',goal:'write article'}])" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import json
try:
    from crewai import Agent, Task, Crew
    agents_data = json.loads('''${(args.agents || '[]').replace(/'/g, "\\'")}''')
    task_desc = """${(args.task || '').replace(/"/g, '\\"')}"""
    # Build agents
    agents = []
    for a in agents_data:
        agents.append(Agent(role=a.get('role','assistant'), goal=a.get('goal','help'), backstory=a.get('backstory',''), verbose=True))
    # Build task
    tasks = [Task(description=task_desc, agent=agents[0] if agents else None, expected_output="completed task")]
    # Run crew
    crew = Crew(agents=agents, tasks=tasks, verbose=True)
    result = crew.kickoff()
    print(json.dumps({"result": str(result)[:2000]}, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200], "fallback": "CrewAI needs configuration"}))
`;
    return runPython(code, 120000);
  },
};

// ── ChromaDB: Long-term Memory ──
export const storeInMemory: AgentTool = {
  name: "store_in_memory",
  description: "تخزين معلومات في ذاكرة طويلة الأمد باستخدام ChromaDB (Vector DB). استخدمها لتخزين نصوص، محاضرات، أو أي معلومات للاسترجاع لاحقاً.",
  parameters: {
    text: { type: "string", description: "النص المطلوب تخزينه" },
    metadata: { type: "string", description: "JSON metadata (optional)" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import chromadb, json
client = chromadb.Client()
collection = client.get_or_create_collection("anzaro_memory")
collection.add(
    documents=["""${(args.text || '').replace(/"/g, '\\"')}"""],
    metadatas=[${args.metadata ? `json.loads('${args.metadata}')` : '{}'}],
    ids=[f"doc_{collection.count()}"]
)
print(json.dumps({"stored": True, "total_docs": collection.count()}))
`;
    return runPython(code);
  },
};

export const searchMemory: AgentTool = {
  name: "search_memory",
  description: "البحث في الذاكرة طويلة الأمد (ChromaDB) عن معلومات مخزنة. استخدمها لاسترجاع معلومات من المحاضرات أو النصوص المخزنة.",
  parameters: {
    query: { type: "string", description: "نص البحث" },
    n_results: { type: "integer", description: "عدد النتائج", default: 5 },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import chromadb, json
client = chromadb.Client()
collection = client.get_or_create_collection("anzaro_memory")
results = collection.query(query_texts=["${(args.query || '').replace(/"/g, '\\"')}"], n_results=${args.n_results || 5})
docs = results.get('documents', [[]])[0]
print(json.dumps({"results": docs[:5], "count": len(docs)}, ensure_ascii=False))
`;
    return runPython(code);
  },
};

// ── Playwright: Ghost Browser ──
export const browseWebsite: AgentTool = {
  name: "browse_website",
  description: "تصفح موقع ويب كأنه إنسان حقيقي باستخدام Playwright (متصفح مخفي). يقدر يعمل scroll، يدوس على أزرار، ويسحب بيانات. استخدمها للمواقع المعقدة.",
  parameters: {
    url: { type: "string", description: "رابط الموقع" },
    action: { type: "string", description: "الإجراء (screenshot, text, click)" },
    selector: { type: "string", description: "CSS selector (for click)" },
  },
  execute: async (args) => {
    const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import json
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:

```

---

## `src/lib/agent/standalone-tools.ts`

> Size: 16.9KB | Lines: 335 | Lang: typescript

```typescript
/**
 * V.142: Standalone Custom Tools — أدوات مستقلة مش من packages
 * دي أدوات بنكتبها إحنا بـ Python كود مباشر
 * كل أداة action-oriented — الموديل بيقرر امتى يستدعيها
 */

import { AgentTool } from "./custom-tools";

const PYTHON_INIT = `import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); `;

async function runPythonCode(code: string, timeoutMs = 30000): Promise<string> {
  const { spawn } = await import("child_process");
  return new Promise((resolve) => {
    const proc = spawn("python3", ["-c", PYTHON_INIT + code], {
      cwd: "/tmp",
      env: { ...process.env, PYTHONUNBUFFERED: "1" },
    });
    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.stderr.on("data", (d) => (out += d.toString()));
    const timer = setTimeout(() => { proc.kill(); resolve(JSON.stringify({ error: "Timeout" })); }, timeoutMs);
    proc.on("close", () => { clearTimeout(timer); resolve(out); });
  });
}

// ═══════════════════════════════════════════
// 1. URL Shortener
// ═══════════════════════════════════════════
export const urlShortener: AgentTool = {
  name: "shorten_url",
  description: "تقصير رابط طويل باستخدام is.gd API. استخدمها لما المستخدم يطلب تقصير رابط.",
  parameters: { url: { type: "string", description: "الرابط الطويل" } },
  execute: async (args) => {
    return runPythonCode(`import urllib.request, json
resp = urllib.request.urlopen("https://is.gd/create.php?format=json&url=${args.url}", timeout=10)
data = json.loads(resp.read())
print(json.dumps(data))`);
  },
};

// ═══════════════════════════════════════════
// 2. Base64 Encoder/Decoder
// ═══════════════════════════════════════════
export const base64Tool: AgentTool = {
  name: "base64_codec",
  description: "ترميز أو فك ترميز Base64. استخدمها لتشفير أو فك تشفير نصوص.",
  parameters: { text: { type: "string" }, action: { type: "string", description: "encode or decode" } },
  execute: async (args) => {
    return runPythonCode(`import base64, json
text = "${(args.text || "").replace(/"/g, '\\"')}"
action = "${args.action || 'encode'}"
if action == "encode":
    result = base64.b64encode(text.encode()).decode()
else:
    result = base64.b64decode(text.encode()).decode()
print(json.dumps({"result": result}))`);
  },
};

// ═══════════════════════════════════════════
// 3. Hash Generator (MD5, SHA1, SHA256)
// ═══════════════════════════════════════════
export const hashGenerator: AgentTool = {
  name: "generate_hash",
  description: "توليد hash من نص (md5, sha1, sha256). استخدمها لتشفير كلمات مرور أو بيانات.",
  parameters: { text: { type: "string" }, algorithm: { type: "string", description: "md5, sha1, sha256", default: "sha256" } },
  execute: async (args) => {
    return runPythonCode(`import hashlib, json
text = "${(args.text || "").replace(/"/g, '\\"')}"
algo = "${args.algorithm || 'sha256'}"
h = hashlib.new(algo)
h.update(text.encode())
print(json.dumps({"hash": h.hexdigest(), "algorithm": algo}))`);
  },
};

// ═══════════════════════════════════════════
// 4. Color Picker (hex to RGB/HSV)
// ═══════════════════════════════════════════
export const colorPicker: AgentTool = {
  name: "color_convert",
  description: "تحويل بين صيغ الألوان (HEX, RGB, HSV). استخدمها لتحليل أو توليد ألوان.",
  parameters: { color: { type: "string", description: "اللون (e.g. #FF5733 or rgb(255,87,51))" } },
  execute: async (args) => {
    return runPythonCode(`import colorsys, json, re
color = "${args.color || '#000000'}"
if color.startswith('#'):
    r, g, b = int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)
else:
    nums = re.findall(r'\\d+', color)
    r, g, b = int(nums[0]), int(nums[1]), int(nums[2])
h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
print(json.dumps({"hex": f"#{r:02X}{g:02X}{b:02X}", "rgb": [r, g, b], "hsv": [round(h*360), round(s*100), round(v*100)]}))`);
  },
};

// ═══════════════════════════════════════════
// 5. Password Generator
// ═══════════════════════════════════════════
export const passwordGenerator: AgentTool = {
  name: "generate_password",
  description: "توليد كلمة مرور قوية عشوائية. استخدمها لما المستخدم يطلب كلمة مرور آمنة.",
  parameters: { length: { type: "integer", default: 16 }, include_symbols: { type: "boolean", default: true } },
  execute: async (args) => {
    const includeSym = args.include_symbols !== false ? "True" : "False";
    return runPythonCode(`import random, string, json
length = ${args.length || 16}
chars = string.ascii_letters + string.digits
if ${includeSym}:
    chars += "!@#\$%^&*()_+-=[]{}|;:,.<>?"
password = ''.join(random.choice(chars) for _ in range(length))
strength = "strong" if length >= 12 else "medium" if length >= 8 else "weak"
print(json.dumps({"password": password, "length": length, "strength": strength}))`);
  },
};

// ═══════════════════════════════════════════
// 6. Text Diff Checker
// ═══════════════════════════════════════════
export const textDiff: AgentTool = {
  name: "text_diff",
  description: "مقارنة نصين وإظهار الفروقات. استخدمها لما المستخدم يطلب مقارنة ملفين أو نصين.",
  parameters: { text1: { type: "string" }, text2: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import difflib, json
t1 = """${(args.text1 || "").replace(/"/g, '\\"')}""".split('\\n')
t2 = """${(args.text2 || "").replace(/"/g, '\\"')}""".split('\\n')
diff = list(difflib.unified_diff(t1, t2, lineterm=''))
print(json.dumps({"diff": '\\n'.join(diff)[:2000]}))`);
  },
};

// ═══════════════════════════════════════════
// 7. JSON Formatter & Validator
// ═══════════════════════════════════════════
export const jsonFormatter: AgentTool = {
  name: "format_json_standalone",
  description: "تنسيق والتحقق من صحة JSON. استخدمها لتنظيم أو التحقق من بيانات JSON.",
  parameters: { json_string: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json
try:
    data = json.loads('''${(args.json_string || "{}").replace(/'/g, "\\'")}''')
    print(json.dumps(data, indent=2, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)}))`);
  },
};

// ═══════════════════════════════════════════
// 8. Unit Converter
// ═══════════════════════════════════════════
export const unitConverter: AgentTool = {
  name: "convert_units",
  description: "تحويل بين وحدات القياس (طول، وزن، حرارة، مساحة، سرعة). استخدمها لأي تحويل وحدات.",
  parameters: { value: { type: "number" }, from_unit: { type: "string" }, to_unit: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json
value = ${args.value || 0}
from_u = "${args.from_unit || 'm'}"
to_u = "${args.to_unit || 'ft'}"
# Length
length = {"m":1, "km":1000, "cm":0.01, "mm":0.001, "ft":0.3048, "in":0.0254, "mi":1609.34, "yd":0.9144}
# Weight
weight = {"kg":1, "g":0.001, "lb":0.453592, "oz":0.0283495, "ton":1000}
# Temperature
if from_u in ["c","f","k"] and to_u in ["c","f","k"]:
    if from_u == "c" and to_u == "f": result = value * 9/5 + 32
    elif from_u == "f" and to_u == "c": result = (value - 32) * 5/9
    elif from_u == "c" and to_u == "k": result = value + 273.15
    elif from_u == "k" and to_u == "c": result = value - 273.15
    elif from_u == "f" and to_u == "k": result = (value - 32) * 5/9 + 273.15
    elif from_u == "k" and to_u == "f": result = (value - 273.15) * 9/5 + 32
    else: result = value
elif from_u in length and to_u in length:
    result = value * length[from_u] / length[to_u]
elif from_u in weight and to_u in weight:
    result = value * weight[from_u] / weight[to_u]
else:
    result = "Cannot convert"
print(json.dumps({"result": round(result, 6), "from": from_u, "to": to_u}))`);
  },
};

// ═══════════════════════════════════════════
// 9. Markdown to HTML
// ═══════════════════════════════════════════
export const markdownToHtml: AgentTool = {
  name: "markdown_to_html",
  description: "تحويل Markdown إلى HTML. استخدمها لتحويل نصوص Markdown لصفحات ويب.",
  parameters: { markdown: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import markdown, json
md_text = """${(args.markdown || "").replace(/"/g, '\\"')}"""
html = markdown.markdown(md_text, extensions=['tables', 'fenced_code'])
print(json.dumps({"html": html[:3000]}, ensure_ascii=False))`);
  },
};

// ═══════════════════════════════════════════
// 10. Lorem Ipsum Generator
// ═══════════════════════════════════════════
export const loremIpsum: AgentTool = {
  name: "generate_lorem",
  description: "توليد نص وهمي (Lorem Ipsum) للاختبار. استخدمها لتعبئة قوالب أو تجارب.",
  parameters: { paragraphs: { type: "integer", default: 3 } },
  execute: async (args) => {
    return runPythonCode(`import json, random
words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split()
result = []
for p in range(${args.paragraphs || 3}):
    sentences = []
    for s in range(random.randint(3, 6)):
        n = random.randint(8, 20)
        sentence = ' '.join(random.choice(words) for _ in range(n))
        sentences.append(sentence.capitalize() + '.')
    result.append(' '.join(sentences))
print(json.dumps({"text": '\\n\\n'.join(result)}, ensure_ascii=False))`);
  },
};

// ═══════════════════════════════════════════
// 11. Regex Tester
// ═══════════════════════════════════════════
export const regexTester: AgentTool = {
  name: "test_regex",
  description: "اختبار تعبير نمطي (Regex) ضد نص. استخدمها للتحقق من صحة regex.",
  parameters: { pattern: { type: "string" }, text: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import re, json
pattern = r"""${(args.pattern || "").replace(/"/g, '\\"')}"""
text = """${(args.text || "").replace(/"/g, '\\"')}"""
matches = re.findall(pattern, text)
print(json.dumps({"matches": matches[:20], "count": len(matches)}, ensure_ascii=False))`);
  },
};

// ═══════════════════════════════════════════
// 12. Timestamp Converter
// ═══════════════════════════════════════════
export const timestampConverter: AgentTool = {
  name: "convert_timestamp",
  description: "تحويل بين Unix timestamp وتاريخ مقروء. استخدمها لتحويل التواريخ.",
  parameters: { value: { type: "string" }, action: { type: "string", description: "to_date or to_timestamp" } },
  execute: async (args) => {
    return runPythonCode(`from datetime import datetime, timezone
import json
action = "${args.action || 'to_date'}"
value = "${args.value || '0'}"
if action == "to_date":
    dt = datetime.fromtimestamp(int(value), tz=timezone.utc)
    print(json.dumps({"date": dt.strftime("%Y-%m-%d %H:%M:%S UTC")}))
else:
    dt = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
    print(json.dumps({"timestamp": int(dt.replace(tzinfo=timezone.utc).timestamp())}))`);
  },
};

// ═══════════════════════════════════════════
// 13. Slug Generator
// ═══════════════════════════════════════════
export const slugGenerator: AgentTool = {
  name: "generate_slug",
  description: "تحويل نص إلى slug صالح للـ URLs. استخدمها لإنشاء روابط نظيفة.",
  parameters: { text: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import re, json
text = "${(args.text || "").replace(/"/g, '\\"')}"
slug = re.sub(r'[^a-zA-Z0-9\\s-]', '', text.lower())
slug = re.sub(r'[\\s-]+', '-', slug).strip('-')
print(json.dumps({"slug": slug}))`);
  },
};

// ═══════════════════════════════════════════
// 14. Text Statistics
// ═══════════════════════════════════════════
export const textStats: AgentTool = {
  name: "text_stats",
  description: "إحصائيات نص: عدد كلمات، أحرف، جمل، قراءة. استخدمها لتحليل النصوص.",
  parameters: { text: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json, re
text = """${(args.text || "").replace(/"/g, '\\"')}"""
words = len(text.split())
chars = len(text)
chars_no_spaces = len(text.replace(' ', ''))
sentences = len(re.findall(r'[.!?]+', text))
paragraphs = len([p for p in text.split('\\n\\n') if p.strip()])
avg_word_len = sum(len(w) for w in text.split()) / max(words, 1)
reading_time = words / 200  # 200 words per minute
print(json.dumps({"words": words, "chars": chars, "chars_no_spaces": chars_no_spaces, "sentences": sentences, "paragraphs": paragraphs, "avg_word_length": round(avg_word_len, 2), "reading_time_min": round(reading_time, 1)}))`);
  },
};

// ═══════════════════════════════════════════
// 15. Cron Expression Parser
// ═══════════════════════════════════════════
export const cronParser: AgentTool = {
  name: "parse_cron",
  description: "تحليل cron expression ووصف متى سيعمل. استخدمها لفهم جدولة المهام.",
  parameters: { expression: { type: "string" } },
  execute: async (args) => {
    return runPythonCode(`import json
expr = "${(args.expression || '').replace(/"/g, '\\"')}"
parts = expr.split()
if len(parts) == 5:
    minute, hour, day, month, weekday = parts
    desc = f"Every {minute} minute(s), {hour} hour(s), {day} day(s), {month} month(s), {weekday} weekday(s)"
else:
    desc = "Invalid cron expression"
print(json.dumps({"expression": expr, "description": desc}))`);
  },
};

// ═══════════════════════════════════════════
// REGISTRY
// ═══════════════════════════════════════════
export const STANDALONE_TOOLS: AgentTool[] = [
  urlShortener,
  base64Tool,
  hashGenerator,
  colorPicker,
  passwordGenerator,
  textDiff,
  jsonFormatter,
  unitConverter,
  markdownToHtml,
  loremIpsum,
  regexTester,
  timestampConverter,
  slugGenerator,
  textStats,
  cronParser,
];

```

---


# 📂 Agents (Catalog/Recipes)

## `src/lib/agents/catalog.ts`

> Size: 17.9KB | Lines: 550 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 550)

```typescript
/**
 * Agent Tool Catalog
 * ==================
 * قائمة الأدوات اللي المستخدم يقدر يختار منها لوكيله المخصص.
 * كل أداة ليها: name, description, category, icon, parameters (JSON-Schema for GLM).
 *
 * الـ executor بيـ map اسم الأداة → implementation حقيقية.
 */

export type ToolCategory =
  | "search"
  | "content"
  | "code"
  | "data"
  | "communication"
  | "utility"
  | "ai"
  | "mcp";

export interface AgentToolDef {
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

const t = (
  name: string,
  description: string,
  category: ToolCategory,
  icon: string,
  properties: Record<string, unknown>,
  required?: string[],
): AgentToolDef => ({
  name,
  description,
  category,
  icon,
  parameters: { type: "object", properties, required },
});

// ─────────────────────────────────────────────────────────────
// CATALOG — 24 curated agent tools (7 categories)
// ─────────────────────────────────────────────────────────────
export const AGENT_TOOL_CATALOG: AgentToolDef[] = [
  // ── Search & Web ───────────────────────────────────────────
  t(
    "web_search",
    "ابحث في الإنترنت عن معلومات حديثة. رجّع نتائج بحث مع عناوين وروابط ومقتطفات.",
    "search",
    "🔍",
    {
      query: { type: "string", description: "البحث اللي عايز تعمله" },
      maxResults: { type: "number", description: "أقصى عدد نتائج (افتراضي 5)" },
    },
    ["query"],
  ),
  t(
    "page_read",
    "اقرأ محتوى أي صفحة ويب من URL. رجّع النص الكامل أو الملخص.",
    "search",
    "🌐",
    {
      url: { type: "string", description: "رابط الصفحة" },
      maxLength: { type: "number", description: "أقصى طول للنص الراجع (افتراضي 4000 حرف)" },
    },
    ["url"],
  ),
  t(
    "wikipedia_search",
    "ابحث في ويكيبيديا عن معلومات موثوقة. رجّع ملخص المقالة.",
    "search",
    "📚",
    {
      query: { type: "string", description: "مصطلح البحث" },
      lang: { type: "string", description: "اللغة (ar, en) — افتراضي ar" },
    },
    ["query"],
  ),

  // ── Content Creation ───────────────────────────────────────
  t(
    "write_article",
    "اكتب مقال كامل بعنوان ومقدمة ونقاط رئيسية وخاتمة.",
    "content",
    "✍️",
    {
      topic: { type: "string", description: "موضوع المقال" },
      tone: { type: "string", description: "النبرة (formal, casual, technical)" },
      wordCount: { type: "number", description: "عدد الكلمات التقريبي" },
    },
    ["topic"],
  ),
  t(
    "write_social_post",
    "اكتب بوست سوشيال ميديا لمنصة معينة (twitter, linkedin, facebook, instagram).",
    "content",
    "📱",
    {
      platform: { type: "string", description: "twitter | linkedin | facebook | instagram" },
      topic: { type: "string", description: "موضوع البوست" },
      tone: { type: "string", description: "النبرة" },
    },
    ["platform", "topic"],
  ),
  t(
    "generate_hashtags",
    "ولّد hashtags مناسبة لمحتوى معين.",
    "content",
    "#️⃣",
    {
      content: { type: "string", description: "المحتوى اللي عايز hashtags له" },
      count: { type: "number", description: "عدد الـ hashtags (افتراضي 10)" },
    },
    ["content"],
  ),
  t(
    "translate_text",
    "ترجم نص من لغة لأخرى.",
    "content",
    "🌐",
    {
      text: { type: "string", description: "النص اللي عايز تترجمه" },
      from: { type: "string", description: "لغة المصدر (auto للكشف التلقائي)" },
      to: { type: "string", description: "لغة الوجهة" },
    },
    ["text", "to"],
  ),
  t(
    "summarize_text",
    "لخّص نص طويل لنقاط رئيسية.",
    "content",
    "📝",
    {
      text: { type: "string", description: "النص اللي عايز تلخصه" },
      style: { type: "string", description: "bullets | paragraph | tldr" },
    },
    ["text"],
  ),

  // ── Code & Dev ─────────────────────────────────────────────
  t(
    "execute_code",
    "نفّذ كود JavaScript ورجّع النتيجة. آمن (sandboxed).",
    "code",
    "⚡",
    {
      code: { type: "string", description: "الكود اللي عايز تنفذه" },
    },
    ["code"],
  ),
  t(
    "generate_code",
    "ولّد كود بلغة معينة لمهمة معينة.",
    "code",
    "💻",
    {
      task: { type: "string", description: "وصف المهمة" },
      language: { type: "string", description: "لغة البرمجة" },
      framework: { type: "string", description: "إطار العمل (اختياري)" },
    },
    ["task", "language"],
  ),
  t(
    "review_code",
    "راجع كود واكتشف bugs، performance issues، security issues، واقتراحات تحسين.",
    "code",
    "🔍",
    {
      code: { type: "string", description: "الكود اللي عايز تراجعه" },
      language: { type: "string", description: "لغة الكود" },
    },
    ["code"],
  ),

  // ── Data & Analysis ────────────────────────────────────────
  t(
    "analyze_data",
    "حلّل بيانات (JSON/CSV) واطلع insights وإحصائيات.",
    "data",
    "📊",
    {
      data: { type: "string", description: "البيانات بصيغة JSON أو CSV" },
      question: { type: "string", description: "السؤال اللي عايز تجاوبه عن البيانات" },
    },
    ["data"],
  ),
  t(
    "create_chart",
    "ارسم chart من بيانات. رجّع وصف للـ chart (نوع + بيانات + عنوان).",
    "data",
    "📈",
    {
      data: { type: "string", description: "البيانات بصيغة JSON" },
      type: { type: "string", description: "bar | line | pie | scatter" },
      title: { type: "string", description: "عنوان الـ chart" },
    },
    ["data", "type"],
  ),
  t(
    "currency_convert",
    "حوّل عملة بأسعار صرف تقريبية.",
    "data",
    "💱",
    {
      amount: { type: "number", description: "المبلغ" },
      from: { type: "string", description: "عملة المصدر (USD, EUR, EGP, ...)" },
      to: { type: "string", description: "عملة الوجهة" },
    },
    ["amount", "from", "to"],
  ),

  // ── Communication ──────────────────────────────────────────
  t(
    "send_email",
    "ابعت إيميل (محاكاة — بيتسجل في الـ agent log مش بيتابع فعلياً).",
    "communication",
    "📧",
    {
      to: { type: "string", description: "إيميل المستلم" },
      subject: { type: "string", description: "موضوع الإيميل" },
      body: { type: "string", description: "محتوى الإيميل" },
    },
    ["to", "subject", "body"],
  ),
  t(
    "draft_email",
    "اكتب مسودة إيميل احترافي بنبرة محددة.",
    "communication",
    "✉️",
    {
      purpose: { type: "string", description: "الغرض من الإيميل" },
      recipient: { type: "string", description: "المستلم (name/role)" },
      tone: { type: "string", description: "formal | casual | persuasive" },
    },
    ["purpose"],
  ),

  // ── Utility ────────────────────────────────────────────────
  t(
    "get_time",
    "اجيب الوقت الحالي في منطقة زمنية معينة.",
    "utility",
    "🕐",
    {
      timezone: { type: "string", description: "المنطقة الزمنية (Africa/Cairo, ...)" },
    },
  ),
  t(
    "generate_uuid",
    "ولّد UUIDs عشوائية.",
    "utility",
    "🆔",
    {
      count: { type: "number", description: "عدد الـ UUIDs (افتراضي 1)" },
    },
  ),
  t(
    "generate_password",
    "ولّد كلمة مرور قوية بطول محدد.",
    "utility",
    "🔐",
    {
      length: { type: "number", description: "طول كلمة المرور (افتراضي 16)" },
      symbols: { type: "boolean", description: "هل تضم رموز؟ (افتراضي true)" },
    },
  ),
  t(
    "calculate",
    "احسب تعبير رياضي. ينفع لـ +, -, *, /, ^, sqrt, sin, cos, log, ...",
    "utility",
    "🧮",
    {
      expression: { type: "string", description: "التعبير الرياضي (مثال: 2+2*3, sqrt(16))" },
    },
    ["expression"],
  ),

  // ── AI-Powered ─────────────────────────────────────────────
  t(
    "generate_image",
    "ولّد صورة من وصف نصي. رجّع وصف للصورة المتولدة (محاكاة).",
    "ai",
    "🎨",
    {
      prompt: { type: "string", description: "وصف الصورة" },
      style: { type: "string", description: "realistic | cartoon | sketch | 3d" },
    },
    ["prompt"],
  ),
  t(
    "sentiment_analysis",
    "حلّل مشاعر نص (positive, negative, neutral) + النسبة.",
    "ai",
    "💭",
    {
      text: { type: "string", description: "النص اللي عايز تحلل مشاعره" },
    },
    ["text"],
  ),
  t(
    "brainstorm_ideas",
    "ولّد أفكار إبداعية لموضوع أو مشكلة معينة.",
    "ai",
    "💡",
    {
      topic: { type: "string", description: "الموضوع" },
      count: { type: "number", description: "عدد الأفكار (افتراضي 5)" },
    },
    ["topic"],
  ),
];

// Helpers ─────────────────────────────────────────────────────

// Set of curated tool names (for fast lookup)
const CURATED_TOOL_NAMES = new Set(AGENT_TOOL_CATALOG.map((t) => t.name));

/**
 * Load MCP tools from registry (lazy — only called when needed).
 * Returns AgentToolDef[] for all 340+ MCP tools not already in the curated catalog.
 */
let _mcpToolsCache: AgentToolDef[] | null = null;

async function loadMCPTools(): Promise<AgentToolDef[]> {
  if (_mcpToolsCache) return _mcpToolsCache;
  try {
    // استخدم Function constructor لتجنب تحليل الـ bundler للـ import
    // ده بيمنع webpack/turbopack من تتبع dependency tree لـ mcp/registry
    // (اللي بيـ import Node-only modules زي dns في الـ browser)
    const mod = await (new Function("return import('@/lib/mcp/registry')")() as Promise<typeof import("@/lib/mcp/registry")>);
    const mcpTools = mod.listTools();
    _mcpToolsCache = mcpTools
      .filter((t) => !CURATED_TOOL_NAMES.has(t.name))
      .map((t) => ({
        name: t.name,
        description: t.description,
        category: "mcp" as ToolCategory,
        icon: "⚡",
        parameters: t.parameters as {
          type: "object";
          properties: Record<string, unknown>;
          required?: string[];
        },
      }));
    return _mcpToolsCache;
  } catch {
    return [];
  }
}

/**
 * Get tool by name — searches both curated catalog AND MCP registry.
 * For MCP tools, returns a minimal def (icon ⚡, category mcp).
 */
export function getToolByName(name: string): AgentToolDef | undefined {
  // Check curated catalog first (fast, synchronous)
  const curated = AGENT_TOOL_CATALOG.find((t) => t.name === name);
  if (curated) return curated;

  // Check MCP registry metadata (synchronous — TOOL_META is static)
  // We use a lazy import pattern here for client-side safety
  return undefined;
}

/**
 * Async version — searches both curated AND MCP registry.
 * Use this when you need full tool metadata including MCP tools.
 */
export async function getToolByNameAsync(name: string): Promise<AgentToolDef | undefined> {
  const curated = AGENT_TOOL_CATALOG.find((t) => t.name === name);
  if (curated) return curated;

  try {
    // استخدم Function constructor لتجنب تحليل الـ bundler
    const mod = await (new Function("return import('@/lib/mcp/registry')")() as Promise<typeof import("@/lib/mcp/registry")>);
    const meta = mod.getToolMeta(name);
    if (meta) {
      return {
        name: meta.name,
        description: meta.description,
        category: "mcp",
        icon: "⚡",
        parameters: meta.parameters as {
          type: "object";
          properties: Record<string, unknown>;
          required?: string[];
        },
      };
    }
  } catch {}
  return undefined;
}

/**
 * Check if a tool name exists (in curated catalog OR MCP registry OR external servers).
 */
export async function isValidToolName(name: string): Promise<boolean> {
  if (CURATED_TOOL_NAMES.has(name)) return true;
  // External tools have "serverId__toolName" format
  if (name.includes("__")) {
    try {
      const { loadExternalTools } = await import("./mcp-client");
      const external = await loadExternalTools();
      return external.has(name);
    } catch {
      return false;
    }
  }
  try {
    // استخدم Function constructor لتجنب تحليل الـ bundler
    const mod = await (new Function("return import('@/lib/mcp/registry')")() as Promise<typeof import("@/lib/mcp/registry")>);
    return mod.hasTool(name);
  } catch {
    return false;
  }
}

/** Get curated tools only (synchronous, fast) */
export function getCuratedTools(): AgentToolDef[] {
  return AGENT_TOOL_CATALOG;
}

/** Get all tools by category (async — loads MCP tools lazily) */
export async function getToolsByCategoryAsync(): Promise<Record<ToolCategory, AgentToolDef[]>> {
  const map: Record<ToolCategory, AgentToolDef[]> = {
    search: [],
    content: [],
    code: [],
    data: [],
    communication: [],
    utility: [],
    ai: [],
    mcp: [],
  };
  for (const tool of AGENT_TOOL_CATALOG) {
    map[tool.category].push(tool);
  }
  // Add MCP tools
  const mcpTools = await loadMCPTools();
  map.mcp = mcpTools;
  return map;
}

/** Synchronous version (curated tools only — no MCP) */
export function getToolsByCategory(): Record<ToolCategory, AgentToolDef[]> {
  const map: Record<ToolCategory, AgentToolDef[]> = {
    search: [],
    content: [],
    code: [],
    data: [],
    communication: [],
    utility: [],
    ai: [],
    mcp: [],
  };
  for (const tool of AGENT_TOOL_CATALOG) {
    map[tool.category].push(tool);
  }
  return map;
}

export const CATEGORY_META: Record<ToolCategory, { label: string; icon: string; color: string }> = {
  search: { label: "بحث ويب", icon: "🔍", color: "text-sky-500" },
  content: { label: "كتابة محتوى", icon: "✍️", color: "text-rose-500" },
  code: { label: "كود وبرمجة", icon: "💻", color: "text-violet-500" },
  data: { label: "بيانات وتحليل", icon: "📊", color: "text-emerald-500" },
  communication: { label: "تواصل وإيميل", icon: "📧", color: "text-amber-500" },
  utility: { label: "أدوات مساعدة", icon: "🔧", color: "text-cyan-500" },
  ai: { label: "ذكاء اصطناعي", icon: "🤖", color: "text-fuchsia-500" },
  mcp: { label: "أدوات MCP (340+)", icon: "⚡", color: "text-orange-500" },
};

/**
 * Convert tool names to GLM function-calling schema.
 * Searches both curated catalog AND MCP registry (async).
 */
export async function toolsToGLMSchemaAsync(toolNames: string[]) {
  const result = [];

  // Load external tools (for resolving external tool schemas)
  let externalTools: Map<string, { description: string; inputSchema: { type: "object"; properties: Record<string, unknown>; required?: string[] } }> | null = null;

  for (const name of toolNames) {
    // Check if it's an external tool (has "__" separator)
    if (name.includes("__")) {
      try {
        if (!externalTools) {
          const { loadExternalTools } = await import("./mcp-client");
          externalTools = await loadExternalTools() as any;
        }
        const ext = externalTools.get(name);
        if (!ext) continue;
        result.push({
          type: "function" as const,

```

---

## `src/lib/agents/recipes.ts`

> Size: 20.4KB | Lines: 405 | Lang: typescript

```typescript
/**
 * Recipes System — مجموعات أدوات جاهزة لحالات استخدام محددة
 * =================================================================
 * كل Recipe = اسم + وصف + قائمة أدوات + system prompt مخصص + مثال استخدام.
 *
 * الهدف: بدل ما المستخدم يختار 6 أدوات بنفسه، يختار Recipe "إنشاء فيديو" مثلًا
 * فيلاقي كل الأدوات والـ prompt جاهزين.
 *
 * الـ Recipes دي بتشتغل على الـ Agent Builder (تقدر تـ import recipe كوكيل جديد بضغطة).
 */

export interface Recipe {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  tools: string[];
  systemPrompt: string;
  suggestions: string[];
  /** مثال استخدام كامل */
  exampleUseCase: string;
}

// ─────────────────────────────────────────────────────────────
// CATALOG — 10 recipes جاهزة
// ─────────────────────────────────────────────────────────────

export const RECIPES: Recipe[] = [
  // ── 1. Video Creation Pipeline ────────────────────────────
  {
    id: "video_creation",
    name: "خط إنتاج الفيديو",
    nameEn: "Video Creation Pipeline",
    description: "أنتج فيديو كامل من فكرة لرفع يوتيوب — سكريبت + صور + صوت + تجميع.",
    icon: "🎬",
    color: "from-rose-500 to-orange-500",
    category: "content",
    tools: ["write_article", "brainstorm_ideas", "generate_image", "translate_text", "n8n_workflow_async"],
    systemPrompt: `أنت "خط إنتاج الفيديو" — وكيل متخصص في إنتاج فيديوهات كاملة من فكرة واحدة.

سير العمل:
1. استلم فكرة المستخدم (topic + duration + platform).
2. استخدم brainstorm_ideas لتوليد 3-5 زوايا إبداعية للموضوع.
3. استخدم write_article لكتابة السكريبت الكامل (مقدمة + محتوى + خاتمة).
4. استخدم translate_text لو المستخدم طلب لغة تانية.
5. استخدم generate_image لتوليد صور/مشاهد للفيديو.
6. استخدم n8n_workflow_async لتشغيل workflow الرفع على يوتيوب.

قواعد:
- اسأل المستخدم عن: المدة، المنصة (YouTube/TikTok/Reels)، اللغة، الجمهور المستهدف.
- السكريبت لازم يكون مناسب للـ platform (YouTube أطول، TikTok أقصر).
- اقترح 3-5 مشاهد بصرية مع وصف كل مشهد.
- بعد التوليد، اعرض ملخص + اسأل لو محتاج تعديلات قبل الرفع.`,
    suggestions: [
      "اعمل فيديو 60 ثانية عن فوائد القراءة لـ TikTok",
      "أنتج فيديو 10 دقايق عن الذكاء الاصطناعي لـ YouTube",
      "ولّد سكريبت + مشاهد لـ Reels عن تنظيم الوقت",
    ],
    exampleUseCase: "المستخدم: 'اعمل فيديو عن الذكاء الاصطناعي' → تولّد سكريبت + 5 مشاهد + تشغّل n8n workflow للرفع.",
  },

  // ── 2. Content Marketing ──────────────────────────────────
  {
    id: "content_marketing",
    name: "وكيل التسويق بالمحتوى",
    nameEn: "Content Marketing Agent",
    description: "خط إنتاج محتوى تسويقي متكامل — مقال + بوستات + hashtags + إيميل.",
    icon: "📣",
    color: "from-amber-500 to-rose-500",
    category: "marketing",
    tools: ["write_article", "write_social_post", "generate_hashtags", "draft_email", "brainstorm_ideas", "translate_text"],
    systemPrompt: `أنت "وكيل التسويق بالمحتوى" — متخصص في إنشاء حملات محتوى متكاملة.

سير العمل:
1. استلم موضوع/منتج/خدمة من المستخدم.
2. استخدم brainstorm_ideas لتوليد 5 زوايا تسويقية.
3. استخدم write_article لمقال مدونة احترافي.
4. استخدم write_social_post لـ 3 بوستات (LinkedIn + Twitter + Instagram).
5. استخدم generate_hashtags لكل بوست.
6. استخدم draft_email لإيميل حملة للـ subscribers.
7. استخدم translate_text لو محتاج نسخة إنجليزي.

قواعد:
- اسأل عن: الجمهور المستهدف، النبرة (formal/casual)، اللغة.
- كل محتوى لازم يكون متوافق مع المنصة (LinkedIn رسمي، Twitter موجز).
- اعرض كل المخرجات في شكل organized + جاهزة للنشر.`,
    suggestions: [
      "اعمل حملة محتوى لإطلاق تطبيق توصيل طعام جديد",
      "ولّد محتوى تسويقي لـ كورس أونلاين عن البرمجة",
      "اكتب مقال + 3 بوستات + إيميل لمنتج عناية بالبشرة",
    ],
    exampleUseCase: "المستخدم: 'حملة لإطلاق تطبيق' → مقال + 3 بوستات + hashtags + إيميل + نسخة EN.",
  },

  // ── 3. Research & Analysis ────────────────────────────────
  {
    id: "research_analysis",
    name: "وكيل البحث والتحليل",
    nameEn: "Research & Analysis Agent",
    description: "بحث عميق + تحليل + تلخيص + استشهاد — للمقالات والأبحاث.",
    icon: "🔬",
    color: "from-emerald-500 to-teal-500",
    category: "research",
    tools: ["web_search", "page_read", "wikipedia_search", "summarize_text", "translate_text", "analyze_data"],
    systemPrompt: `أنت "وكيل البحث والتحليل" — محلل أبحاث محترف.

سير العمل:
1. استلم سؤال/موضوع من المستخدم.
2. استخدم web_search للبحث عن مصادر حديثة.
3. استخدم wikipedia_search للمعلومات الموثوقة.
4. استخدم page_read للتعمق في مصادر معينة.
5. استخدم summarize_text لتلخيص النتائج.
6. استخدم analyze_data لو فيه بيانات للتحليل.
7. استخدم translate_text لو المصادر بلغة تانية.

قواعد:
- اذكر مصادرك دايماً (روابط).
- ميّز بين الحقائق والآراء.
- لو فيه تناقض بين المصادر، اذكره.
- التلخيص يكون نقاط رئيسية + مصادر.`,
    suggestions: [
      "ابحث عن أحدث ترندات الذكاء الاصطناعي في 2026",
      "حلل مقارنة بين React و Vue من مصادر متعددة",
      "ابحث عن تأثير العمل عن بُعد على الإنتاجية",
    ],
    exampleUseCase: "المستخدم: 'ترندات AI 2026' → يبحث → يلخص → يرجّع تقرير بمصادر.",
  },

  // ── 4. Code Review & Development ──────────────────────────
  {
    id: "code_review_dev",
    name: "وكيل مراجعة وتطوير الكود",
    nameEn: "Code Review & Dev Agent",
    description: "مراجعة كود + تنفيذ + توثيق + حل مشاكل برمجية.",
    icon: "💻",
    color: "from-violet-500 to-fuchsia-500",
    category: "dev",
    tools: ["execute_code", "generate_code", "review_code", "wikipedia_search"],
    systemPrompt: `أنت "وكيل مراجعة وتطوير الكود" — مهندس برمجيات خبير.

سير العمل:
1. استلم كود/مشكلة من المستخدم.
2. لو فيه كود للمراجعة → استخدم review_code.
3. لو محتاج تنفيذ → استخدم execute_code لتجربته.
4. لو محتاج كود جديد → استخدم generate_code.
5. استخدم wikipedia_search للمفاهيم التقنية.

قواعد:
- ركّز على: bugs، performance، security، readability.
- اشرح الحلول بأمثلة كود واضحة.
- استخدم أفضل الممارسات.
- جرّب الكود قبل ما تقول 'تم'.`,
    suggestions: [
      "راجع الكود ده وقولي المشاكل: function add(a,b){return a-b}",
      "نفّذ دالة JavaScript لـ bubble sort وجربها",
      "ولّد دالة Python لحساب Fibonacci بـ memoization",
    ],
    exampleUseCase: "المستخدم: 'راجع الكود ده' → ينفذ → يكتشف bug → يقترح إصلاح.",
  },

  // ── 5. Email Automation ───────────────────────────────────
  {
    id: "email_automation",
    name: "وكيل أتمتة الإيميلات",
    nameEn: "Email Automation Agent",
    description: "صياغة + تصنيف + رد على إيميلات + حملات.",
    icon: "📧",
    color: "from-sky-500 to-blue-500",
    category: "communication",
    tools: ["draft_email", "sentiment_analysis", "summarize_text", "translate_text", "n8n_workflow_async"],
    systemPrompt: `أنت "وكيل أتمتة الإيميلات" — متخصص في إدارة الإيميلات احترافياً.

سير العمل:
1. استلم إيميل/طلب من المستخدم.
2. لو فيه إيميل لتحليله → استخدم sentiment_analysis + summarize_text.
3. استخدم draft_email لصياغة رد احترافي.
4. استخدم translate_text لو الإيميل بلغة تانية.
5. استخدم n8n_workflow_async لتشغيل حملة إيميلات bulk.

قواعد:
- اسأل عن: النبرة (formal/casual)، الغرض (reply/cold/follow-up).
- الردود لازم تكون واضحة ومختصرة.
- لو الإيميل سلبي، اقترح رد دبلوماسي.
- للحملات، اسأل عن: القائمة، الموضوع، الهدف.`,
    suggestions: [
      "صُغ رد احترافي على إيميل شكوى عميل",
      "حلل مشاعر الإيميل ده: 'أنا زهقت من خدمتكم البطيئة'",
      "ابدأ حملة إيميلات لـ 1000 مشترك جديد",
    ],
    exampleUseCase: "المستخدم: 'رد على شكوى' → يحلل المشاعر → يصيغ رد دبلوماسي.",
  },

  // ── 6. Data Analysis ──────────────────────────────────────
  {
    id: "data_analysis",
    name: "وكيل تحليل البيانات",
    nameEn: "Data Analysis Agent",
    description: "تحليل بيانات + إحصائيات + charts + insights.",
    icon: "📊",
    color: "from-emerald-500 to-cyan-500",
    category: "data",
    tools: ["analyze_data", "create_chart", "execute_code", "currency_convert"],
    systemPrompt: `أنت "وكيل تحليل البيانات" — محلل بيانات محترف.

سير العمل:
1. استلم بيانات (JSON/CSV) + سؤال من المستخدم.
2. استخدم analyze_data لاستخراج insights.
3. استخدم create_chart لرسم بياني للنتائج.
4. استخدم execute_code لحسابات معقدة لو محتاج.
5. استخدم currency_convert لو فيه مبالغ بعملات مختلفة.

قواعد:
- اسأل عن: نوع التحليل (descriptive/diagnostic/predictive)، الجمهور.
- اعرض النتائج في شكل organized: ملخص + إحصائيات + insights + توصيات.
- اذكر أي assumptions أو limitations.
- الـ charts لازم لها عنوان واضح.`,
    suggestions: [
      "حلل بيانات مبيعات 3 شهور وطلع ترند",
      "ارسم chart لمبيعات 5 منتجات",
      "حلل بيانات العملاء واقترح segmentation",
    ],
    exampleUseCase: "المستخدم: 'حلل المبيعات' → يحلل → يرسم chart → يطلع insights.",
  },

  // ── 7. Social Media Manager ───────────────────────────────
  {
    id: "social_media_manager",
    name: "مدير السوشيال ميديا",
    nameEn: "Social Media Manager",
    description: "إدارة كاملة لـ 4 منصات + جدولة + تحليل ترندات.",
    icon: "📱",
    color: "from-fuchsia-500 to-pink-500",
    category: "marketing",
    tools: ["write_social_post", "generate_hashtags", "brainstorm_ideas", "translate_text", "sentiment_analysis"],
    systemPrompt: `أنت "مدير السوشيال ميديا" — مدير حسابات سوشيال احترافي.

سير العمل:
1. استلم موضوع/مناسبة من المستخدم.
2. استخدم brainstorm_ideas لتوليد 5 أفكار محتوى.
3. استخدم write_social_post لـ 4 منصات (Twitter, LinkedIn, Instagram, Facebook).
4. استخدم generate_hashtags لكل منصة.
5. استخدم sentiment_analysis لو فيه تعليقات لتحليلها.
6. استخدم translate_text لو محتاج نسخة بلغة تانية.

قواعد:
- كل منصة ليها نبرة مختلفة (LinkedIn رسمي، Twitter موجز، Instagram بصري).
- اقترح أوقات نشر مناسبة.
- Hashtags مختلفة لكل منصة.
- اسأل عن: الجمهور، الهدف (engagement/awareness/sales).`,
    suggestions: [
      "اكتب بوستات لإطلاق منتج جديد على 4 منصات",
      "حضّر محتوى أسبوع كامل لـ brand ملابس",
      "حلل تعليقات على بوست واقترح ردود",
    ],
    exampleUseCase: "المستخدم: 'محتوى أسبوعي' → يولّد 28 بوست + hashtags لـ 4 منصات.",
  },

  // ── 8. Customer Support ───────────────────────────────────
  {
    id: "customer_support",
    name: "وكيل دعم العملاء",
    nameEn: "Customer Support Agent",
    description: "تحليل + رد + تصعيد + متابعة تذاكر.",
    icon: "🎧",
    color: "from-cyan-500 to-sky-500",
    category: "support",
    tools: ["sentiment_analysis", "summarize_text", "draft_email", "translate_text", "wikipedia_search"],
    systemPrompt: `أنت "وكيل دعم العملاء" — متخصص في إدارة تذاكر وشكاوى العملاء.

سير العمل:
1. استلم تذكرة/شكوى من المستخدم.
2. استخدم sentiment_analysis لتحليل مشاعر العميل.
3. استخدم summarize_text لتلخيص المشكلة.
4. استخدم draft_email لصياغة رد احترافي.
5. استخدم translate_text لو العميل بلغة تانية.
6. استخدم wikipedia_search لو محتاج معلومات تقنية.

قواعد:
- ابدأ بالتعاطف لو العميل غاضب.
- الردود لازم تكون: مهذبة + واضحة + قابلة للتنفيذ.
- اقترح حلول متعددة لو ممكن.
- لو المشكلة معقدة، اقترح التصعيد لمستوى أعلى.`,
    suggestions: [
      "رد على عميل غاضب من تأخر شحنته",
      "لخص التذكرة دي واقترح رد",
      "صُغ رد اعتذار لـ عميل عن service interruption",
    ],
    exampleUseCase: "المستخدم: 'عميل غاضب' → يحلل المشاعر → يلخص → يصيغ رد دبلوماسي.",
  },

  // ── 9. Educational Content ────────────────────────────────
  {
    id: "educational_content",
    name: "وكيل المحتوى التعليمي",
    nameEn: "Educational Content Agent",
    description: "ملاحظات + شروحات + اختبارات + خطط دراسية.",
    icon: "🎓",
    color: "from-indigo-500 to-violet-500",
    category: "education",
    tools: ["write_article", "summarize_text", "brainstorm_ideas", "translate_text", "wikipedia_search"],
    systemPrompt: `أنت "وكيل المحتوى التعليمي" — معلم محترف بيحوّل المواد الصعبة لسهلة.

سير العمل:
1. استلم موضوع/مادة من المستخدم.
2. استخدم wikipedia_search للمعلومات الأساسية.
3. استخدم summarize_text لتبسيط المفاهيم.
4. استخدم write_article لشرح تفصيلي.
5. استخدم brainstorm_ideas لتوليد أمثلة وتطبيقات.
6. استخدم translate_text لو محتاج نسخة بلغة تانية.

قواعد:
- ابدأ بالأساسيات قبل التفاصيل.
- استخدم أمثلة من الحياة اليومية.
- قسّم المحتوى لمستويات (مبتدئ/متوسط/متقدم).
- اختبار قصير في النهاية للمراجعة.`,
    suggestions: [
      "اشرحلي Recursion في البرمجة بطريقة مبسطة",
      "حضّر ملاحظات دراسية عن الفوتوسنثيز",
      "اعمل خطة دراسية لـ تعلم React في أسبوعين",
    ],
    exampleUseCase: "المستخدم: 'اشرح Recursion' → يبحث → يبسّط → يشرح + أمثلة + اختبار.",
  },

  // ── 10. YouTube Automation ────────────────────────────────
  {
    id: "youtube_automation",
    name: "وكيل أتمتة يوتيوب",
    nameEn: "YouTube Automation Agent",
    description: "سكريبت + عنوان + thumbnail + SEO + جدولة.",
    icon: "▶️",
    color: "from-red-500 to-rose-500",
    category: "content",
    tools: ["write_article", "brainstorm_ideas", "generate_hashtags", "translate_text", "n8n_workflow_async"],
    systemPrompt: `أنت "وكيل أتمتة يوتيوب" — متخصص في إنتاج محتوى يوتيوب محسّن للـ SEO.

سير العمل:
1. استلم فكرة/موضوع من المستخدم.
2. استخدم brainstorm_ideas لتوليد 5 زوايا للفيديو.
3. استخدم write_article لكتابة السكريبت الكامل.
4. استخدم generate_hashtags للـ tags (YouTube SEO).
5. استخدم translate_text لو محتاج نسخة بلغة تانية.
6. استخدم n8n_workflow_async لتشغيل workflow الرفع والجدولة.

قواعد:
- العنوان لازم يكون catchy + يحتوي كلمة مفتاحية.
- السكريبت: hook في أول 15 ثانية + intro + content + CTA.
- اقترح 3 thumbnails ideas.
- الـ tags لازم تكون mix من broad + specific.`,
    suggestions: [
      "اعمل سكريبت فيديو عن 'أفضل 5 تطبيقات 2026'",
      "حضّر محتوى قناة تقنية لـ شهر كامل",
      "ولّد عنوان + thumbnail + tags لفيديو عن AI",
    ],
    exampleUseCase: "المستخدم: 'فيديو عن أفضل التطبيقات' → سكريبت + عنوان + tags + workflow.",
  },
];

// ── Helpers ─────────────────────────────────────────────────

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

export function listRecipes(): Recipe[] {
  return RECIPES;
}

export function getRecipesByCategory(): Record<string, Recipe[]> {
  const map: Record<string, Recipe[]> = {};
  for (const r of RECIPES) {
    if (!map[r.category]) map[r.category] = [];
    map[r.category].push(r);
  }
  return map;
}

/** يحوّل Recipe لصيغة CustomAgent (للحفظ في DB عبر /api/agents) */
export function recipeToAgent(recipe: Recipe) {
  return {
    name: recipe.name,
    nameEn: recipe.nameEn,
    description: recipe.description,
    icon: recipe.icon,
    color: recipe.color,
    systemPrompt: recipe.systemPrompt,
    tools: recipe.tools,
    suggestions: recipe.suggestions,
    category: recipe.category,
    isPublic: true,
  };
}

export const RECIPE_CATEGORIES = [
  { value: "content", label: "محتوى", icon: "✍️" },
  { value: "marketing", label: "تسويق", icon: "📣" },
  { value: "research", label: "بحث", icon: "🔬" },
  { value: "dev", label: "تطوير", icon: "💻" },
  { value: "communication", label: "تواصل", icon: "📧" },
  { value: "data", label: "بيانات", icon: "📊" },
  { value: "support", label: "دعم", icon: "🎧" },
  { value: "education", label: "تعليم", icon: "🎓" },
];

```

---

## `src/lib/agents/executor.ts`

> Size: 16.5KB | Lines: 400 | Lang: typescript

```typescript
/**
 * Agent Tool Executor
 * ===================
 * بينفّذ الأدوات اللي الوكيل اختارها. بعض الأدوات حقيقية (calc, uuid, time, code exec)
 * وبعضها محاكاة (web_search, page_read, send_email) عشان نشتغل بدون API keys.
 *
 * كل أداة بترجّع: { success: boolean, output: any, error?: string }
 */

import { db } from "@/lib/db";

export interface ToolResult {
  success: boolean;
  output: unknown;
  error?: string;
}

// ─────────────────────────────────────────────────────────────
// Utility tools (real implementations)
// ─────────────────────────────────────────────────────────────

function get_time(args: { timezone?: string }): ToolResult {
  const tz = args.timezone || "Africa/Cairo";
  try {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat("ar-EG", {
      timeZone: tz,
      dateStyle: "full",
      timeStyle: "long",
    }).format(now);
    return {
      success: true,
      output: { time: formatted, iso: now.toISOString(), timezone: tz },
    };
  } catch {
    return { success: false, output: null, error: "Invalid timezone" };
  }
}

function generate_uuid(args: { count?: number }): ToolResult {
  const count = Math.max(1, Math.min(20, Number(args.count) || 1));
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }
  return { success: true, output: { uuids } };
}

function generate_password(args: { length?: number; symbols?: boolean }): ToolResult {
  const len = Math.max(4, Math.min(64, Number(args.length) || 16));
  const useSymbols = args.symbols !== false;
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const pool = useSymbols ? chars + symbols : chars;
  let password = "";
  const randomValues = new Uint32Array(len);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < len; i++) {
    password += pool[randomValues[i] % pool.length];
  }
  return { success: true, output: { password, length: len } };
}

function calculate(args: { expression: string }): ToolResult {
  const expr = String(args.expression || "").trim();
  if (!expr) return { success: false, output: null, error: "Expression required" };
  // SECURITY: Strict allow-list — only numbers, operators, parentheses, decimals, and known Math functions
  // Reject ANYTHING else (no strings, no identifiers except Math.*, no parentheses tricks)
  const allowed = /^[\d+\-*/().,\s]*(?:Math\.(?:sqrt|sin|cos|tan|log|abs|floor|ceil|round|PI|E|max|min|pow|exp|sign|atan|asin|acos|atan2)[\d+\-*/().,\s]*)*$/;
  if (!allowed.test(expr)) {
    return { success: false, output: null, error: "Invalid characters in expression — only numbers and Math.* functions allowed" };
  }
  try {
    // Safe: only Math.* and operators are allowed by the regex
    const fn = new Function(`"use strict"; return (${expr});`);
    const result = fn();
    return { success: true, output: { expression: expr, result: String(result) } };
  } catch (e: any) {
    return { success: false, output: null, error: `Calculation failed: ${e.message}` };
  }
}

async function execute_code(args: { code: string }): Promise<ToolResult> {
  const code = String(args.code || "").trim();
  if (!code) return { success: false, output: null, error: "No code provided" };

  // SECURITY: Strict allow-list of safe JavaScript operations
  // Block ANY access to: process, require, import, global, globalThis, constructor, __proto__,
  // prototype, eval, Function, this, window, document, fetch, XMLHttpRequest
  const BLOCKED = /\b(process|require|import|global|globalThis|constructor|__proto__|prototype|eval|Function|this\b|window|document|fetch|XMLHttpRequest|child_process|fs|net|http|https|os|path|crypto|stream|dns|tls|cluster|worker|v8|repl|vm|assert|util|events|buffer)\b/;
  if (BLOCKED.test(code)) {
    return { success: false, output: null, error: "Blocked: code contains forbidden keywords" };
  }

  // Additional: block string concatenation tricks like "pro"+"cess"
  // by checking for any quoted strings that could form blocked words
  const stringConcat = /["'`][^"'`]*["'`]\s*\+/;
  if (stringConcat.test(code) && BLOCKED.test(code.replace(/["'`][^"'`]*["'`]/g, ""))) {
    return { success: false, output: null, error: "Blocked: potential string concatenation bypass detected" };
  }

  try {
    // Capture console.log output
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: unknown[]) => logs.push(args.map(String).join(" "));
    let result: unknown;

    try {
      // Create a restricted sandbox with frozen globals
      const sandbox: Record<string, unknown> = {
        console: { log: (...args: unknown[]) => logs.push(args.map(String).join(" ")) },
        Math,
        Date,
        JSON,
        Array,
        Object,
        String,
        Number,
        Boolean,
        parseInt,
        parseFloat,
        isNaN,
        String: String,
        RegExp,
        Map,
        Set,
        Promise,
        Symbol,
        Error,
      };

      // Use Function with strict mode and restricted scope
      // Note: this is NOT a full sandbox — but with the strict allow-list above,
      // it blocks known escape vectors
      const fn = new Function('"use strict"; const {console,Math,Date,JSON,Array,Object,String,Number,Boolean,parseInt,parseFloat,isNaN,RegExp,Map,Set,Promise,Symbol,Error} = arguments[0]; ' + code);
      result = fn(sandbox);
    } finally {
      console.log = origLog;
    }
    return {
      success: true,
      output: {
        logs: logs.length > 0 ? logs : undefined,
        result: result !== undefined ? String(result) : undefined,
      },
    };
  } catch (e: any) {
    return { success: false, output: null, error: `Execution failed: ${e.message}` };
  }
}

// ─────────────────────────────────────────────────────────────
// Currency (real — uses exchange rate API)
// ─────────────────────────────────────────────────────────────

async function currency_convert(args: {
  amount: number;
  from: string;
  to: string;
}): Promise<ToolResult> {
  const { amount, from, to } = args;
  if (!amount || !from || !to) {
    return { success: false, output: null, error: "amount, from, to required" };
  }
  try {
    const res = await fetch(
      `https://open.er-api.com/v6/latest/${String(from).toUpperCase()}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return { success: false, output: null, error: `API ${res.status}` };
    const data = await res.json();
    const rate = data?.rates?.[String(to).toUpperCase()];
    if (!rate) return { success: false, output: null, error: "Rate not found" };
    const converted = (Number(amount) * rate).toFixed(4);
    return {
      success: true,
      output: {
        amount: Number(amount),
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        rate: Number(rate),
        converted: Number(converted),
      },
    };
  } catch (e: any) {
    return { success: false, output: null, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Wikipedia (real)
// ─────────────────────────────────────────────────────────────

async function wikipedia_search(args: { query: string; lang?: string }): Promise<ToolResult> {
  const lang = args.lang || "ar";
  const query = String(args.query || "").trim();
  if (!query) return { success: false, output: null, error: "Query required" };
  try {
    const searchUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=3`;
    const res = await fetch(searchUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { success: false, output: null, error: `Wikipedia ${res.status}` };
    const data = await res.json();
    const results = (data?.query?.search ?? []).slice(0, 3).map((item: any) => ({
      title: item.title,
      snippet: String(item.snippet || "").replace(/<[^>]+>/g, ""),
      pageId: item.pageid,
      url: `https://${lang}.wikipedia.org/?curid=${item.pageid}`,
    }));
    return { success: true, output: { results } };
  } catch (e: any) {
    return { success: false, output: null, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Simulated / local tools (return formatted output without external APIs)
// ─────────────────────────────────────────────────────────────

function web_search(args: { query: string; maxResults?: number }): ToolResult {
  const query = String(args.query || "").trim();
  if (!query) return { success: false, output: null, error: "Query required" };
  const max = Math.max(1, Math.min(10, Number(args.maxResults) || 5));
  // محاكاة — في إنتاج حقيقي نستخدم z-ai-web-dev-sdk web search
  return {
    success: true,
    output: {
      note: "Web search is simulated in this environment. Configure a real search API key to enable live results.",
      query,
      results: Array.from({ length: Math.min(max, 3) }, (_, i) => ({
        title: `نتيجة بحث ${i + 1} عن: ${query}`,
        url: `https://example.com/result-${i + 1}`,
        snippet: `هذه نتيجة بحث تجريبية عن "${query}". في بيئة الإنتاج، هنا هيظهر مقتطف حقيقي من الصفحة.`,
      })),
    },
  };
}

function page_read(args: { url: string; maxLength?: number }): ToolResult {
  const url = String(args.url || "").trim();
  if (!url) return { success: false, output: null, error: "URL required" };
  const max = Number(args.maxLength) || 4000;
  return {
    success: true,
    output: {
      note: "Page reading is simulated in this environment.",
      url,
      content: `[محاكاة] محتوى الصفحة ${url}. في بيئة الإنتاج، هنا هيظهر النص الحقيقي للصفحة (حتى ${max} حرف).`,
    },
  };
}

function send_email(args: { to: string; subject: string; body: string }): ToolResult {
  if (!args.to || !args.subject || !args.body) {
    return { success: false, output: null, error: "to, subject, body all required" };
  }
  return {
    success: true,
    output: {
      status: "queued (simulated)",
      to: args.to,
      subject: args.subject,
      bodyLength: String(args.body).length,
      message: "الإيميل ايتسجل في الـ agent log. مفيش إرسال فعلي في بيئة الـ sandbox.",
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Main dispatch
// ─────────────────────────────────────────────────────────────

export async function executeAgentTool(
  toolName: string,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  try {
    switch (toolName) {
      case "web_search":
        return web_search(args as any);
      case "page_read":
        return page_read(args as any);
      case "wikipedia_search":
        return await wikipedia_search(args as any);
      case "send_email":
        return send_email(args as any);
      case "get_time":
        return get_time(args as any);
      case "generate_uuid":
        return generate_uuid(args as any);
      case "generate_password":
        return generate_password(args as any);
      case "calculate":
        return calculate(args as any);
      case "currency_convert":
        return await currency_convert(args as any);
      case "execute_code":
        return await execute_code(args as any);

      // ── Tools that depend on the GLM call (handled in orchestrator as "passthrough") ──
      // هذه الأدوات بيرجّعها الـ orchestrator للـ GLM كـ tool result، لكن الـ GLM نفسه
      // بيكتب المحتوى. هنا بنرجّع placeholder وبعدين الـ GLM بيلف تاني ويكتب الناتج.
      case "write_article":
      case "write_social_post":
      case "generate_hashtags":
      case "translate_text":
      case "summarize_text":
      case "generate_code":
      case "review_code":
      case "analyze_data":
      case "create_chart":
      case "draft_email":
      case "generate_image":
      case "sentiment_analysis":
      case "brainstorm_ideas":
        return {
          success: true,
          output: {
            _passthrough: true,
            message: `أداة "${toolName}" بتشتغل عبر GLM مباشرةً. اتصل بالأداة وحدّد الـ output بناءً على الـ args.`,
            args,
          },
        };

      default:
        // Not a curated tool — check if it's an external MCP tool first
        if (toolName.includes("__")) {
          return await delegateToExternalMCP(toolName, args);
        }
        // Otherwise try delegating to the local MCP registry (340+ tools)
        return await delegateToMCPRegistry(toolName, args);
    }
  } catch (e: any) {
    return { success: false, output: null, error: e.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Delegate to MCP Registry (for the 340+ MCP tools)
// ─────────────────────────────────────────────────────────────

async function delegateToMCPRegistry(
  toolName: string,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  try {
    const { executeTool: executeMCPTool, hasTool } = await import("@/lib/mcp/registry");
    if (!hasTool(toolName)) {
      return { success: false, output: null, error: `Unknown tool: ${toolName}` };
    }
    const result = await executeMCPTool(toolName, args);
    return {
      success: result.success,
      output: result.data ?? result.error,
      error: result.error,
    };
  } catch (e: any) {
    return { success: false, output: null, error: `MCP delegation failed: ${e.message}` };
  }
}

// ─────────────────────────────────────────────────────────────
// Delegate to External MCP Server (for tools from external servers)
// ─────────────────────────────────────────────────────────────

async function delegateToExternalMCP(
  toolName: string,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  try {
    const { executeExternalTool } = await import("./mcp-client");
    const result = await executeExternalTool(toolName, args);
    return {
      success: result.success,
      output: result.data ?? result.error,
      error: result.error,
    };
  } catch (e: any) {
    return {
      success: false,
      output: null,
      error: `External MCP delegation failed: ${e.message}`,
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Track run count on the agent
// ─────────────────────────────────────────────────────────────

export async function incrementAgentRunCount(agentId: string): Promise<void> {
  try {
    await db.customAgent.update({
      where: { id: agentId },
      data: { runCount: { increment: 1 } },
    });
  } catch {
    // silent — non-critical
  }
}

```

---

## `src/lib/agents/orchestrator.ts`

> Size: 8.2KB | Lines: 241 | Lang: typescript

```typescript
/**
 * Agent Orchestrator — ReAct Loop with SSE
 * =========================================
 * بياخد: agent (system prompt + tools) + user message + history
 * ويعمل loop:
 *   1. يبعت messages لـ GLM-4.6-Air مع tools (function calling)
 *   2. لو GLM رجّع tool_calls → ينفذهم (parallel) ويرجّع results
 *   3. لو GLM رجّع final answer (no tool_calls) → يبعتها وينهي
 *   4. يتكرر لحد max 8 iterations
 *
 * كل خطوة بتنبعث كـ SSE event للواجهة.
 */

import ZAI from "z-ai-web-dev-sdk";
import { getZAIClient } from "../zai-client";
import type { ChatMessage } from "z-ai-web-dev-sdk";
import { toolsToGLMSchemaAsync } from "./catalog";
import { executeAgentTool, incrementAgentRunCount, type ToolResult } from "./executor";

export interface AgentRunMessage extends ChatMessage {
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

export interface AgentSSEEvent {
  type: "status" | "step" | "token" | "thinking" | "tool_start" | "tool_end" | "done" | "error";
  content?: string;
  tool?: string;
  tool_call_id?: string;
  args?: unknown;
  result?: unknown;
  step?: number;
  error?: string;
  message?: string;
}

export type AgentSSESink = (event: AgentSSEEvent) => void;

export interface AgentConfig {
  id: string;
  name: string;
  systemPrompt: string;
  tools: string[]; // tool names
}

export interface RunOptions {
  enableThinking?: boolean;
  maxIterations?: number;
}

const MAX_ITERATIONS = 8;

const BASE_BEHAVIOR_PROMPT = `

قواعد العمل (ReAct):
1. فكّر في طلب المستخدم قبل ما تختار أداة.
2. لو محتاج معلومة أو فعل → استدعِ الأداة المناسبة (tool_calls).
3. بناءً على نتيجة الأداة، إما استدعِ أداة تانية أو اكتب الإجابة النهائية.
4. الإجابة النهائية لازم تكون واضحة ومنظّمة وبالعربية (إلا لو المستخدم طلب لغة تانية).
5. لا تخترع معلومات — استخدم web_search أو wikipedia_search لو محتاج معلومات حقيقية.
6. لو الأداة رجّعت "_passthrough: true"، ده معناه إنك إنت اللي تكتب الـ output النهائي بناءً على args.
7. لا تكرر استدعاء نفس الأداة بنفس الـ args — لو محتاج نتيجة مختلفة غيّر الـ args.`;

/**
 * تشغيل وكيل مخصص لحل رسالة مستخدم واحدة.
 */
export async function orchestrateAgent(
  agent: AgentConfig,
  messages: AgentRunMessage[],
  sink: AgentSSESink,
  options: RunOptions = {},
): Promise<void> {
  const maxIter = Math.max(1, Math.min(MAX_ITERATIONS, options.maxIterations ?? MAX_ITERATIONS));

  let zai: Awaited<ReturnType<typeof ZAI.create>>;
  try {
    zai = await getZAIClient();
  } catch (e: any) {
    sink({ type: "error", error: `ZAI init failed: ${e.message}` });
    return;
  }

  // Build the tool schema for GLM (async — loads MCP tools lazily)
  const glmTools = await toolsToGLMSchemaAsync(agent.tools);
  if (glmTools.length === 0) {
    sink({ type: "status", message: "⚠️ هذا الوكيل لا يملك أي أدوات — سيعمل كنموذج محادثة عادي." });
  } else {
    sink({ type: "status", message: `🛠️ الوكيل جاهز مع ${glmTools.length} أداة.` });
  }

  // Build conversation
  const systemContent = agent.systemPrompt + BASE_BEHAVIOR_PROMPT;
  const conversation: AgentRunMessage[] = [
    { role: "system", content: systemContent },
    ...messages,
  ];

  let totalToolCalls = 0;

  for (let step = 1; step <= maxIter; step++) {
    sink({ type: "step", step });

    let assistantText = "";
    const toolCallsMap = new Map<number, ToolCall>();

    try {
      const request: any = {
        model: "glm-5.2",
        messages: conversation as any,
        stream: true,
        thinking: options.enableThinking ? { type: "enabled" } : { type: "disabled" },
      };
      if (glmTools.length > 0) {
        request.tools = glmTools as any;
        request.tool_choice = "auto";
      }

      const stream: ReadableStream<Uint8Array> = await zai.chat.completions.create(request);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]" || !payload) continue;
          let parsed: any;
          try {
            parsed = JSON.parse(payload);
          } catch {
            continue;
          }
          const delta = parsed?.choices?.[0]?.delta ?? {};
          if (delta.reasoning_content) {
            sink({ type: "thinking", content: delta.reasoning_content });
          }
          if (delta.content) {
            assistantText += delta.content;
            sink({ type: "token", content: delta.content });
          }
          if (Array.isArray(delta.tool_calls)) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              if (!toolCallsMap.has(idx)) {
                toolCallsMap.set(idx, {
                  id: tc.id ?? `call_${idx}_${Date.now()}`,
                  type: "function",
                  function: { name: "", arguments: "" },
                });
              }
              const existing = toolCallsMap.get(idx)!;
              if (tc.function?.name) existing.function.name += tc.function.name;
              if (tc.function?.arguments) existing.function.arguments += tc.function.arguments;
              if (tc.id) existing.id = tc.id;
            }
          }
        }
      }
    } catch (e: any) {
      sink({ type: "error", error: `GLM call failed: ${e.message}` });
      return;
    }

    const toolCalls = [...toolCallsMap.values()].filter((tc) => tc.function.name);

    // Append assistant message
    const assistantMessage: AgentRunMessage = {
      role: "assistant",
      content: assistantText || "",
      ...(toolCalls.length ? { tool_calls: toolCalls } : {}),
    };
    conversation.push(assistantMessage);

    // No tool calls → final answer
    if (toolCalls.length === 0) {
      sink({ type: "done", content: assistantText });
      await incrementAgentRunCount(agent.id);
      return;
    }

    // Execute each tool call sequentially (so the UI sees them in order)
    for (const tc of toolCalls) {
      const toolName = tc.function.name;
      let parsedArgs: Record<string, unknown> = {};
      try {
        parsedArgs = JSON.parse(tc.function.arguments || "{}");
      } catch {
        parsedArgs = { _raw: tc.function.arguments };
      }

      sink({ type: "tool_start", tool: toolName, tool_call_id: tc.id, args: parsedArgs });
      totalToolCalls++;

      const result: ToolResult = await executeAgentTool(toolName, parsedArgs);

      sink({
        type: "tool_end",
        tool: toolName,
        tool_call_id: tc.id,
        result: result.success ? result.output : { error: result.error },
      });

      // Compose tool result message for GLM (cap size)
      let resultText: string;
      if (typeof result.output === "string") {
        resultText = result.output.slice(0, 8000);
      } else {
        resultText = JSON.stringify(result.output ?? { error: result.error }).slice(0, 8000);
      }

      conversation.push({
        role: "tool",
        tool_call_id: tc.id,
        name: toolName,
        content: resultText,
      } as any);
    }
    // continue loop
  }

  // Reached max iterations
  sink({
    type: "done",
    content: `⏱️ وصلت للحد الأقصى من التكرارات (${maxIter}) بعد ${totalToolCalls} استدعاء أداة. حاول ت subdivisions طلبك لمهام أصغر.`,
  });
  await incrementAgentRunCount(agent.id);
}

```

---


# 📂 Massive Tools

## `src/lib/massive-tools/callable-tools.ts`

> Size: 32.5KB | Lines: 919 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 919)

```typescript
/**
 * V.110: Actual Callable Tools — أدوات حقيقية متثبتة الموديل يقدر يستدعيها.
 *
 * مش بس metadata — دي functions حقيقية بتشتغل فعلاً.
 * كل tool بيـ:
 *  1. يـ verify إن الـ package متثبت
 *  2. يـ execute الـ function
 *  3. يـ return نتيجة حقيقية
 */

import { spawn } from "child_process";
import { promisify } from "util";
import { stat, existsSync } from "fs";
import { promises as fsPromises } from "fs";
import path from "path";

const sleep = promisify(setTimeout);

// ─────────────────────────────────────────────────────────────
// Tool Executor — بيـ run Python code باستخدام الـ packages المتثبتة
// ─────────────────────────────────────────────────────────────

interface ToolResult {
  success: boolean;
  output: string;
  files?: string[];
  error?: string;
  durationMs: number;
}

/** بيـ run Python script ويرجع النتيجة. */
async function runPython(code: string, timeoutMs = 30000): Promise<ToolResult> {
  const start = Date.now();
  const fs = await import("fs/promises");
  const os = await import("os");
  const tmpFile = path.join(os.tmpdir(), `anzaro_tool_${Date.now()}.py`);

  try {
    await fsPromises.writeFile(tmpFile, code, "utf-8");
    const output = await new Promise<string>((resolve, reject) => {
      // V.140: Use system python3 first (packages installed via --break-system-packages)
      const pythonPath = "python3";
      const proc = spawn(pythonPath, [tmpFile], {
        cwd: "/home/z/my-project/exports",
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
          PYTHONPATH: "/usr/local/lib/python3.11/dist-packages:/usr/local/lib/python3.11/dist-packages:/app/.venv/lib/python3.12/site-packages:/home/z/.venv/lib/python3.12/site-packages",
        },
        timeout: timeoutMs,
      });
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (d) => { stdout += d.toString(); });
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      const timer = setTimeout(() => {
        proc.kill("SIGKILL");
        reject(new Error(`Timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      proc.on("close", (code) => {
        clearTimeout(timer);
        resolve(stdout + (stderr ? `\n[STDERR]\n${stderr}` : ""));
      });
      proc.on("error", (e) => {
        clearTimeout(timer);
        reject(e);
      });
    });

    return {
      success: true,
      output: output.slice(0, 5000),
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return {
      success: false,
      output: "",
      error: e.message || String(e),
      durationMs: Date.now() - start,
    };
  } finally {
    try {
      const fs = await import("fs/promises");
      await fsPromises.unlink(tmpFile);
    } catch {}
  }
}

/** بيـ verify إن package متثبت. */
async function verifyPackage(pkgName: string): Promise<boolean> {
  const importName = pkgName.replace(/-/g, "_").replace(/\[.*\]/, "").split(/[=<>]/)[0];
  const result = await runPython(
    `import importlib\ntry:\n    importlib.import_module('${importName}')\n    print('OK')\nexcept ImportError as e:\n    print(f'FAIL: {e}')\n`,
    10000
  );
  return result.output.includes("OK");
}

// ─────────────────────────────────────────────────────────────
// ACTUAL CALLABLE TOOLS
// ─────────────────────────────────────────────────────────────

export interface CallableTool {
  name: string;
  description: string;
  category: string;
  package: string; // pip package name
  parameters: Record<string, any>;
  execute: (args: any) => Promise<ToolResult>;
}

export const CALLABLE_TOOLS: CallableTool[] = [

  // ── PDF Tools ──
  {
    name: "extract_pdf_text",
    description: "استخراج النص من ملف PDF",
    category: "pdf",
    package: "pdfplumber",
    parameters: { file_path: { type: "string", description: "مسار ملف PDF" } },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import pdfplumber, json
with pdfplumber.open('${args.file_path}') as pdf:
    text = ""
    for page in pdf.pages[:50]:
        text += page.extract_text() or ""
        text += "\\n--- PAGE BREAK ---\\n"
print(json.dumps({"text": text[:5000], "pages": len(pdf.pages)}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },
  {
    name: "create_pdf",
    description: "إنشاء ملف PDF من نص",
    category: "pdf",
    package: "fpdf2",
    parameters: {
      text: { type: "string", description: "النص" },
      filename: { type: "string", description: "اسم الملف" },
    },
    execute: async (args) => {
      const code = `
from fpdf import FPDF
import json
pdf = FPDF()
pdf.add_page()
pdf.add_font('Arial', '', '', uni=True)
pdf.set_font_size(12)
text = """${(args.text || "").replace(/"/g, '\\"')}"""
for line in text.split("\\n"):
    pdf.cell(0, 10, txt=line, ln=True)
pdf.output('${args.filename || "output.pdf"}')
print(json.dumps({"file": "${args.filename || "output.pdf"}"}))
`;
      return runPython(code);
    },
  },

  // ── Image Tools ──
  {
    name: "resize_image",
    description: "تغيير حجم صورة",
    category: "image",
    package: "pillow",
    parameters: {
      input_path: { type: "string" },
      width: { type: "integer" },
      height: { type: "integer" },
      output_path: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from PIL import Image
import json
img = Image.open('${args.input_path}')
resized = img.resize((${'args.width || 800'}, ${args.height || 600}))
resized.save('${args.output_path || "resized.png"}')
print(json.dumps({"file": "${args.output_path || "resized.png"}", "size": [${args.width || 800}, ${args.height || 600}]}))
`;
      return runPython(code);
    },
  },
  {
    name: "image_to_text_ocr",
    description: "استخراج نص من صورة (OCR)",
    category: "image",
    package: "pytesseract",
    parameters: { image_path: { type: "string" } },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import pytesseract
from PIL import Image
import json
img = Image.open('${args.image_path}')
text = pytesseract.image_to_string(img, lang='eng+ara')
print(json.dumps({"text": text[:3000]}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },
  {
    name: "generate_qr_code",
    description: "إنشاء QR code من نص/رابط",
    category: "image",
    package: "qrcode",
    parameters: {
      data: { type: "string", description: "النص أو الرابط" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import qrcode, json
qr = qrcode.QRCode(version=1, box_size=10, border=4)
qr.add_data("${(args.data || "").replace(/"/g, '\\"')}")
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
fname = "${args.filename || "qr_code.png"}"
img.save(fname)
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },

  // ── Chart/Visualization ──
  {
    name: "create_chart",
    description: "إنشاء رسم بياني (line/bar/pie/scatter)",
    category: "chart",
    package: "matplotlib",
    parameters: {
      chart_type: { type: "string", enum: ["line", "bar", "pie", "scatter"] },
      x_data: { type: "array" },
      y_data: { type: "array" },
      title: { type: "string" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import json
fig, ax = plt.subplots(figsize=(10,6))
x = ${JSON.stringify(args.x_data || [])}
y = ${JSON.stringify(args.y_data || [])}
ct = "${args.chart_type || "bar"}"
if ct == "line": ax.plot(x, y, "b-o")
elif ct == "bar": ax.bar(x, y)
elif ct == "pie": ax.pie(y, labels=x, autopct="%1.1f%%")
elif ct == "scatter": ax.scatter(x, y)
if "${args.title || ""}": ax.set_title("${args.title}")
ax.grid(True, alpha=0.3)
plt.tight_layout()
fname = "${args.filename || "chart.png"}"
plt.savefig(fname, dpi=100, bbox_inches="tight")
plt.close()
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },

  // ── Web Scraping ──
  {
    name: "scrape_website",
    description: "استخراج النص من موقع ويب",
    category: "web",
    package: "beautifulsoup4",
    parameters: { url: { type: "string" } },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import requests, json
from bs4 import BeautifulSoup
resp = requests.get("${args.url}", timeout=15, headers={"User-Agent":"Mozilla/5.0"})
soup = BeautifulSoup(resp.text, "html.parser")
for tag in soup(["script","style","nav","footer"]): tag.decompose()
text = soup.get_text(separator="\\n", strip=True)[:5000]
print(json.dumps({"title": soup.title.string if soup.title else "", "content": text}, ensure_ascii=False))
`;
      return runPython(code);
    },
  },
  {
    name: "download_youtube_video",
    description: "تحميل فيديو من يوتيوب",
    category: "web",
    package: "yt-dlp",
    parameters: {
      url: { type: "string" },
      format: { type: "string", description: "best/audio" },
    },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import yt_dlp, json, os
opts = {
    'format': '${args.format === "audio" ? "bestaudio" : "best"}' if '${args.format}' else 'best',
    'outtmpl': '/home/z/my-project/exports/%(title)s.%(ext)s',
    'quiet': True,
    'socket_timeout': 30,
    'retries': 2,
    'no_warnings': True,
}
try:
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info("${args.url}", download=True)
        filename = ydl.prepare_filename(info)
    print(json.dumps({"file": filename, "title": info.get("title",""), "duration": info.get("duration",0)}, ensure_ascii=False))
except Exception as e:
    # Fallback: just get info without downloading
    try:
        with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True, 'skip_download': True}) as ydl:
            info = ydl.extract_info("${args.url}", download=False)
        print(json.dumps({"title": info.get("title",""), "duration": info.get("duration",0), "url": "${args.url}", "note": "info only (download failed)"}, ensure_ascii=False))
    except Exception as e2:
        print(json.dumps({"error": str(e), "fallback_error": str(e2)}, ensure_ascii=False))
`;
      return runPython(code, 180000);
    },
  },

  // ── Text/Speech ──
  {
    name: "text_to_speech",
    description: "تحويل نص إلى صوت MP3",
    category: "audio",
    package: "gTTS",
    parameters: {
      text: { type: "string" },
      lang: { type: "string", default: "ar" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from gtts import gTTS
import json
tts = gTTS(text="""${(args.text || "").replace(/"/g, '\\"')}""", lang='${args.lang || "ar"}', slow=False)
fname = "${args.filename || "tts.mp3"}"
tts.save(fname)
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },
  {
    name: "text_to_speech_neural",
    description: "تحويل نص إلى صوت عالي الجودة (Neural TTS)",
    category: "audio",
    package: "edge-tts",
    parameters: {
      text: { type: "string" },
      voice: { type: "string", default: "ar-EG-SalmaNeural" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import asyncio, edge_tts, json
async def run():
    comm = edge_tts.Communicate("""${(args.text || "").replace(/"/g, '\\"')}""", "${args.voice || "ar-EG-SalmaNeural"}")
    fname = "${args.filename || "tts_neural.mp3"}"
    await comm.save(fname)
    print(json.dumps({"file": fname, "voice": "${args.voice || "ar-EG-SalmaNeural"}"}))
asyncio.run(run())
`;
      return runPython(code);
    },
  },

  // ── Data Analysis ──
  {
    name: "analyze_csv",
    description: "تحليل ملف CSV وإعطاء إحصائيات",
    category: "data",
    package: "pandas",
    parameters: { file_path: { type: "string" } },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import pandas as pd, json
df = pd.read_csv('${args.file_path}')
stats = {
    "rows": len(df),
    "columns": list(df.columns),
    "dtypes": {c: str(df[c].dtype) for c in df.columns},
    "describe": df.describe().to_dict() if len(df.select_dtypes(include='number').columns) > 0 else {},
    "head": df.head(5).to_dict('records'),
    "missing": df.isnull().sum().to_dict(),
}
print(json.dumps(stats, default=str, ensure_ascii=False))
`;
      return runPython(code);
    },
  },

  // ── NLP ──
  {
    name: "sentiment_analysis",
    description: "تحليل مشاعر نص (positive/negative/neutral)",
    category: "nlp",
    package: "vaderSentiment",
    parameters: { text: { type: "string" } },
    execute: async (args) => {
      const code = `
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
analyzer = SentimentIntensityAnalyzer()
scores = analyzer.polarity_scores("""${(args.text || "").replace(/"/g, '\\"')}""")
print(json.dumps(scores))
`;
      return runPython(code);
    },
  },
  {
    name: "word_frequency",
    description: "تحليل تكرار الكلمات في نص",
    category: "nlp",
    package: "nltk",
    parameters: { text: { type: "string" }, top_n: { type: "integer", default: 20 } },
    execute: async (args) => {
      const code = `
import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.12/dist-packages"); sys.path.insert(0, "/usr/lib/python3.12/dist-packages"); import nltk
from collections import Counter
import json, re
nltk.download('stopwords', quiet=True)
from nltk.corpus import stopwords
text = """${(args.text || "").replace(/"/g, '\\"')}"""
words = re.findall(r'\\b[a-zA-Z]+\\b', text.lower())
stop = set(stopwords.words('english'))
filtered = [w for w in words if w not in stop and len(w) > 2]
top = Counter(filtered).most_common(${args.top_n || 20})
print(json.dumps({"top_words": top, "total_words": len(words), "unique_words": len(set(filtered))}))
`;
      return runPython(code);
    },
  },

  // ── Math/Calculation ──
  {
    name: "solve_math",
    description: "حل معادلة رياضية رمزية",
    category: "math",
    package: "sympy",
    parameters: { expression: { type: "string" } },
    execute: async (args) => {
      const code = `
from sympy import sympify, simplify, solve, symbols, integrate, diff
import json
expr_str = "${(args.expression || "").replace(/"/g, '\\"')}"
try:
    expr = sympify(expr_str)
    result = {
        "input": expr_str,
        "simplified": str(simplify(expr)),
        "derivative": str(diff(expr, symbols('x'))) if 'x' in str(expr) else "N/A",
    }
    print(json.dumps(result, default=str))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;
      return runPython(code);
    },
  },

  // ── Document Generation ──
  {
    name: "create_docx",
    description: "إنشاء ملف Word (.docx) من نص",
    category: "document",
    package: "python-docx",
    parameters: {
      text: { type: "string" },
      filename: { type: "string" },
    },
    execute: async (args) => {
      const code = `
from docx import Document
import json
doc = Document()
text = """${(args.text || "").replace(/"/g, '\\"')}"""
for line in text.split("\\n"):
    doc.add_paragraph(line)
fname = "${args.filename || "document.docx"}"
doc.save(fname)
print(json.dumps({"file": fname}))
`;
      return runPython(code);
    },
  },
  {
    name: "create_excel",
    description: "إنشاء ملف Excel من بيانات JSON",
    category: "document",
    package: "openpyxl",
    parameters: {
      data: { type: "array", description: "list of rows" },
      filename: { type: "string" },
    },
    execute: async (args) => {

```

---

## `src/lib/massive-tools/registry.ts`

> Size: 4.5KB | Lines: 129 | Lang: typescript

```typescript
/**
 * V.108: Massive Tool Registry Access Layer
 * ------------------------------------------
 * بيوفر وصول للـ ToolRegistry و SkillRegistry في الـ DB.
 * عدد الأدوات: 100,000+ (metadata-only, JIT install).
 */

import { db } from "@/lib/db";

export interface ToolEntry {
  id: string;
  name: string;
  source: string;
  summary: string;
  description?: string;
  category: string;
  installCmd: string;
  homepage: string;
  repository: string;
  keywords: string;
  author: string;
  license: string;
  version: string;
  stars: number;
  isVerified: boolean;
  isInstalled: boolean;
}

export interface SkillEntry {
  id: string;
  name: string;
  source: string;
  summary: string;
  category: string;
  skillType: string;
  installCmd: string;
  repository: string;
  keywords: string;
  isInstalled: boolean;
}

/** بيـ search الـ tools في الـ DB (SQL LIKE، سريع جداً على SQLite). */
export async function searchTools(query: string, limit = 20): Promise<ToolEntry[]> {
  const q = `%${query.toLowerCase()}%`;
  const rows = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry
    WHERE LOWER(name) LIKE ${q}
       OR LOWER(summary) LIKE ${q}
       OR LOWER(keywords) LIKE ${q}
    ORDER BY isVerified DESC, stars DESC, name ASC
    LIMIT ${limit}
  `;
  return rows as unknown as ToolEntry[];
}

/** بيـ search الـ tools في فئة معينة. */
export async function getToolsByCategory(category: string, limit = 50): Promise<ToolEntry[]> {
  const rows = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry
    WHERE category = ${category}
    ORDER BY isVerified DESC, stars DESC, name ASC
    LIMIT ${limit}
  `;
  return rows as unknown as ToolEntry[];
}

/** بيـ رجّع إحصائيات الـ tools (cached لمدة 60 ثانية عشان نتجنب DB load). */
let _statsCache: { data: any; ts: number } | null = null;
const STATS_CACHE_TTL = 60_000; // 60 seconds

export async function getToolStats() {
  // Return cached if fresh
  if (_statsCache && Date.now() - _statsCache.ts < STATS_CACHE_TTL) {
    return _statsCache.data;
  }
  const total = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM ToolRegistry`;
  const bySource = await db.$queryRaw<{source: string, c: number}[]>`
    SELECT source, COUNT(*) as c FROM ToolRegistry GROUP BY source ORDER BY c DESC
  `;
  const byCategory = await db.$queryRaw<{category: string, c: number}[]>`
    SELECT category, COUNT(*) as c FROM ToolRegistry GROUP BY category ORDER BY c DESC LIMIT 15
  `;
  const verified = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM ToolRegistry WHERE isVerified = 1`;
  const installed = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM ToolRegistry WHERE isInstalled = 1`;

  const skillsTotal = await db.$queryRaw<[{c: number}][]>`SELECT COUNT(*) as c FROM SkillRegistry`;
  const skillsBySource = await db.$queryRaw<{source: string, c: number}[]>`
    SELECT source, COUNT(*) as c FROM SkillRegistry GROUP BY source
  `;

  const data = {
    tools: {
      total: Number(total[0]?.c ?? 0),
      verified: Number(verified[0]?.c ?? 0),
      installed: Number(installed[0]?.c ?? 0),
      bySource: bySource.map((r: any) => ({ source: r.source, count: Number(r.c) })),
      byCategory: byCategory.map((r: any) => ({ category: r.category, count: Number(r.c) })),
    },
    skills: {
      total: Number(skillsTotal[0]?.c ?? 0),
      bySource: skillsBySource.map((r: any) => ({ source: r.source, count: Number(r.c) })),
    }
  };
  _statsCache = { data, ts: Date.now() };
  return data;
}

/** بيـ رجّع tools عشوائية للـ system prompt (sample). */
export async function getToolSampleForPrompt(limit = 200): Promise<ToolEntry[]> {
  const verified = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry WHERE isVerified = 1 ORDER BY stars DESC LIMIT ${limit}
  `;
  if (verified.length >= limit) return verified as unknown as ToolEntry[];

  const remaining = limit - verified.length;
  const extra = await db.$queryRaw<ToolEntry[]>`
    SELECT * FROM ToolRegistry WHERE isVerified = 0 ORDER BY RANDOM() LIMIT ${remaining}
  `;
  return [...(verified as unknown as ToolEntry[]), ...(extra as unknown as ToolEntry[])];
}

/** بيـ mark أداة إنها installed بعد الـ JIT install. */
export async function markToolInstalled(name: string, source: string, installPath: string) {
  await db.$executeRaw`
    UPDATE ToolRegistry
    SET isInstalled = 1, installPath = ${installPath}, updatedAt = datetime('now')
    WHERE name = ${name} AND source = ${source}
  `;
}

```

---

## `src/app/api/massive-tools/exec/route.ts`

> Size: 4.2KB | Lines: 126 | Lang: typescript

```typescript
/**
 * POST /api/massive-tools/exec
 * body: { tool: string, args: object }
 *
 * V.145: بتستخدم tools/registry الجديد كـ primary executor.
 * الـ tools اللي مش موجودة في الـ registry الجديد، بتـ fallback لـ:
 *   1. callable-tools.ts (القديم)
 *   2. agent custom-tools.ts (الأقدم)
 *
 * ترتيب الأولوية:
 *   1. tools/registry (جديد - files isolated في tools/)
 *   2. callable-tools.ts (قديم - inline)
 *   3. ALL_AGENT_TOOLS (custom-tools.ts + standalone-tools.ts)
 */
import { NextResponse } from "next/server";
import { executeTool as executeRegistryTool, getToolsSchema as getRegistrySchema, findTool as findRegistryTool, getStats as getRegistryStats } from "@/lib/tools-registry";
import { executeCallableTool, getToolsSchema } from "@/lib/massive-tools/callable-tools";
import { ALL_AGENT_TOOLS } from "@/lib/agent/custom-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tool, args } = body;

    if (!tool) {
      return NextResponse.json({ success: false, error: "tool name required" }, { status: 400 });
    }

    let result: { success: boolean; output?: any; error?: string; durationMs: number; source?: string } = {
      success: false,
      error: "not found",
      durationMs: 0,
    };

    // 1) Try new tools/registry first
    const registryTool = findRegistryTool(tool);
    if (registryTool) {
      result = await executeRegistryTool(tool, args || {});
      result.source = "tools/registry";
    }

    // 2) Fallback to old callable-tools.ts
    if (!result.success && (result.error?.includes("not found") || result.error === "not found")) {
      const callableResult = await executeCallableTool(tool, args || {});
      if (callableResult.success || !callableResult.error?.includes("not found")) {
        result = {
          success: callableResult.success,
          output: callableResult.output,
          error: callableResult.error,
          durationMs: callableResult.durationMs,
          source: "callable-tools.ts",
        };
      }
    }

    // 3) Fallback to agent custom-tools (includes standalone)
    if (!result.success && (result.error?.includes("not found") || result.error === "not found")) {
      const agentTool = ALL_AGENT_TOOLS.find(t => t.name === tool);
      if (agentTool) {
        const start = Date.now();
        try {
          const output = await agentTool.execute(args || {});
          result = {
            success: true,
            output,
            durationMs: Date.now() - start,
            source: "agent/custom-tools.ts",
          };
        } catch (e: any) {
          result = {
            success: false,
            output: "",
            error: e.message,
            durationMs: Date.now() - start,
            source: "agent/custom-tools.ts",
          };
        }
      }
    }

    return NextResponse.json({
      success: result.success,
      tool,
      output: result.output,
      error: result.error,
      durationMs: result.durationMs,
      source: result.source,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/** GET — بيـ رجّع كل الـ callable tools schema (registry + massive + agent) */
export async function GET() {
  // New registry tools
  const registryTools = getRegistrySchema();
  const registryStats = getRegistryStats();

  // Old callable tools
  const massiveTools = getToolsSchema();

  // Old agent tools
  const agentTools = ALL_AGENT_TOOLS.map(t => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: { type: "object", properties: t.parameters } },
    category: t.category,
    package: t.package,
  }));

  return NextResponse.json({
    success: true,
    tools: [...registryTools, ...massiveTools, ...agentTools],
    count: registryTools.length + massiveTools.length + agentTools.length,
    sources: {
      "tools/registry (new)": registryTools.length,
      "callable-tools.ts (legacy)": massiveTools.length,
      "agent custom-tools (legacy)": agentTools.length,
    },
    registry_stats: registryStats,
  });
}

```

---

## `src/app/api/massive-tools/dynamic-call/route.ts`

> Size: 8.4KB | Lines: 208 | Lang: typescript

```typescript
/**
 * V.131: Dynamic Package Caller — بيـ execute أي package + أي function ديناميكياً.
 * بدل 586 wrapper يدوي، ده endpoint واحد بيـ import أي package وينفذ أي function.
 *
 * POST /api/massive-tools/dynamic-call
 * { "package": "pandas", "function": "DataFrame", "kwargs": {"data": [[1,2]]} }
 * { "package": "numpy", "action": "info" }
 * { "package": "requests", "action": "list_functions" }
 */

import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync, promises as fsPromises } from "fs";
import os from "os";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PYTHON_PATHS = [
  "python3",
  "/usr/bin/python3",
  "/usr/local/bin/python3",
  "/app/.venv/bin/python3",
  "/home/z/.venv/bin/python3",
];

const SITE_PACKAGES = [
  "/usr/local/lib/python3.11/dist-packages",
];

async function runPython(code: string, timeoutMs = 60000): Promise<string> {
  // V.131d: Use inline -c flag instead of tmpfile (avoids filesystem issues)
  const pythonPath = "python3";
  const pythonpath = SITE_PACKAGES.join(":");

  return new Promise((resolve) => {
    // Use -c flag to pass code directly (no temp file needed)
    const proc = spawn(pythonPath, ["-c", code], {
      cwd: "/tmp",
      env: { ...process.env, PYTHONUNBUFFERED: "1", PYTHONPATH: pythonpath },
    });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve(JSON.stringify({ error: `Timeout after ${timeoutMs}ms` }));
    }, timeoutMs);
    proc.on("close", () => {
      clearTimeout(timer);
      resolve(stdout + (stderr ? `\n[STDERR]\n${stderr}` : ""));
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve(JSON.stringify({ error: e.message }));
    });
  });
}

function getImportName(pkg: string): string {
  const M: Record<string, string> = {
    "PIL":"PIL","PyPDF2":"PyPDF2","opencv-python-headless":"cv2",
    "python-docx":"docx","python-pptx":"pptx","beautifulsoup4":"bs4",
    "fpdf2":"fpdf","gTTS":"gtts","edge-tts":"edge_tts",
    "deep-translator":"deep_translator","scikit-learn":"sklearn",
    "scikit-image":"skimage","python-dateutil":"dateutil","python-dotenv":"dotenv",
    "python-magic":"magic","python-slugify":"slugify","python-barcode":"barcode",
    "argon2-cffi":"argon2","async-timeout":"async_timeout","pillow":"PIL",
    "pymupdf":"fitz","faiss-cpu":"faiss","pycryptodome":"Crypto",
    "pyopenssl":"OpenSSL","pynacl":"nacl","pyyaml":"yaml","pyjwt":"jwt",
    "google-api-python-client":"googleapiclient","google-auth":"google_auth",
    "youtube-transcript-api":"youtube_transcript_api",
    "readability-lxml":"readability_lxml","discord.py":"discord",
    "slack-sdk":"slack_sdk","websocket-client":"websocket",
  };
  return M[pkg] || pkg.replace(/-/g,"_").replace(/\./g,"_").replace(/\[.*\]/,"").toLowerCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const pkg = body.package;
    const func = body.function;
    const args = body.args || [];
    const kwargs = body.kwargs || {};
    const action = body.action || (func ? "call" : "info");
    const query = body.query || "";
    
    if (!pkg) return NextResponse.json({ success: false, error: "package required" }, { status: 400 });
    
    const imp = getImportName(pkg);
    
    // Build Python code based on action
    let code = "";
    
    if (action === "info") {
      code = `import importlib, json
imp = "${imp}"
try:
    mod = importlib.import_module(imp)
    ver = getattr(mod, '__version__', getattr(mod, 'VERSION', getattr(mod, '__name__', 'unknown')))
    all_items = [x for x in dir(mod) if not x.startswith('_')]
    fns = [x for x in all_items if callable(getattr(mod, x, None))][:50]
    cls = [x for x in all_items if isinstance(getattr(mod, x, None), type)][:20]
    others = [x for x in all_items if x not in fns and x not in cls][:10]
    print(json.dumps({"package":"${pkg}","import":imp,"version":str(ver),"functions_count":len(fns),"functions":fns,"classes":cls,"others":others}, default=str, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))`;
    } else if (action === "list_functions") {
      code = `import importlib, json, inspect
imp = "${imp}"
try:
    mod = importlib.import_module(imp)
    fns = []
    for name in dir(mod):
        if name.startswith('_'): continue
        obj = getattr(mod, name)
        if callable(obj):
            try:
                sig = inspect.signature(obj)
                params = list(sig.parameters.keys())[:5]
                fns.append({"name": name, "params": params})
            except:
                fns.append({"name": name, "params": []})
        if len(fns) >= 100: break
    print(json.dumps({"package":"${pkg}","functions":fns}, default=str, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))`;
    } else if (action === "search_functions" && query) {
      code = `import importlib, json, inspect
imp = "${imp}"
q = "${query}".lower()
try:
    mod = importlib.import_module(imp)
    matches = []
    for name in dir(mod):
        if name.startswith('_'): continue
        if q in name.lower():
            obj = getattr(mod, name)
            if callable(obj):
                doc = (inspect.getdoc(obj) or "")[:100]
                matches.append({"name": name, "doc": doc})
        if len(matches) >= 20: break
    print(json.dumps({"package":"${pkg}","query":"${query}","matches":matches}, default=str, ensure_ascii=False))
except Exception as e:
    print(json.dumps({"error": str(e)[:200]}))`;
    } else if (action === "call" && func) {
      const argsStr = JSON.stringify(args).replace(/'/g, "\\'");
      const kwargsStr = JSON.stringify(kwargs).replace(/'/g, "\\'");
      code = `import importlib, json, sys
imp = "${imp}"
func_path = "${func}"
args_list = json.loads('${argsStr}')
kwargs_dict = json.loads('${kwargsStr}')
try:
    mod = importlib.import_module(imp)
    obj = mod
    for part in func_path.split('.'):
        if part: obj = getattr(obj, part)
    result = obj(*args_list, **kwargs_dict)
    if hasattr(result, 'to_dict'): result = result.to_dict()
    elif hasattr(result, 'tolist'): result = result.tolist()
    elif hasattr(result, '__dict__'): result = str(result)[:2000]
    else: result = str(result)[:2000]
    print(json.dumps({"success": True, "result": result}, default=str, ensure_ascii=False))
except Exception as e:
    import traceback
    print(json.dumps({"success": False, "error": str(e)[:300], "tb": traceback.format_exc()[-200:]}, default=str, ensure_ascii=False))`;
    } else {
      return NextResponse.json({ success: false, error: "Invalid action. Use: info, list_functions, search_functions, call" }, { status: 400 });
    }
    
    const output = await runPython(code, 60000);
    return NextResponse.json({ success: true, package: pkg, action, result: output });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const code = `import sys; sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); sys.path.insert(0, "/usr/local/lib/python3.11/dist-packages"); import os, json, sys
pkgs = []
# check all possible site-packages locations
paths = [
    "/app/.venv/lib/python3.12/site-packages",
    "/home/z/.venv/lib/python3.12/site-packages",
    "/usr/local/lib/python3.11/dist-packages",
    "/usr/local/lib/python3.11/dist-packages",
    "/usr/local/lib/python3.11/dist-packages",
    "/usr/lib/python3.11/dist-packages",
]
for site in paths:
    if not os.path.exists(site):
        continue
    for d in os.listdir(site):
        if d.startswith('_') or d.endswith('.dist-info') or d.endswith('.egg-info') or d.endswith('.so'):
            continue
        full = os.path.join(site, d)
        if os.path.isdir(full) or (os.path.isfile(full) and d.endswith('.py')):
            pkgs.append(d.replace('.py',''))
pkgs = sorted(set(pkgs))
print(json.dumps({"count": len(pkgs), "packages": pkgs}))`;
  const output = await runPython(code, 10000);
  return NextResponse.json({ success: true, mode: "dynamic", output });
}

```

---

## `src/app/api/massive-tools/stats/route.ts`

> Size: 563B | Lines: 18 | Lang: typescript

```typescript
/**
 * GET /api/massive-tools/stats
 * بيرجّع إحصائيات الـ tools و skills (total count, by source, by category)
 */
import { NextResponse } from "next/server";
import { getToolStats } from "@/lib/massive-tools/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getToolStats();
    return NextResponse.json({ success: true, ...stats });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

```

---

## `src/app/api/massive-tools/search/route.ts`

> Size: 926B | Lines: 31 | Lang: typescript

```typescript
/**
 * GET /api/massive-tools/search?q=<query>&limit=<n>
 * بيـ search في الـ ToolRegistry (100,000+ tools)
 */
import { NextResponse } from "next/server";
import { searchTools } from "@/lib/massive-tools/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

    if (!q.trim()) {
      return NextResponse.json({ success: false, error: "Query required (?q=...)" }, { status: 400 });
    }

    const results = await searchTools(q, limit);
    return NextResponse.json({
      success: true,
      query: q,
      count: results.length,
      results,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

```

---

## `src/app/api/massive-tools/install/route.ts`

> Size: 1.0KB | Lines: 36 | Lang: typescript

```typescript
/**
 * POST /api/massive-tools/install
 * body: { name: string, source?: string }
 * بيـ install أداة JIT (pip / npm / git clone) ويرجّع النتيجة.
 */
import { NextResponse } from "next/server";
import { installTool, searchAndInstall } from "@/lib/massive-tools/jit-installer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, source, query } = body;

    if (!name && !query) {
      return NextResponse.json({ success: false, error: "name or query required" }, { status: 400 });
    }

    const result = name
      ? await installTool(name, source)
      : await searchAndInstall(query);

    return NextResponse.json({
      success: result.success,
      tool: result.tool,
      output: result.output,
      error: result.error,
      durationMs: result.durationMs,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

```

---


# 📂 Skills System

## `src/lib/skills/loader.ts`

> Size: 5.5KB | Lines: 168 | Lang: typescript

```typescript
/**
 * Skills Loader
 * =============
 * بيقرا الـ Skills (ملفات SKILL.md) من skills/ ويرجعها.
 *
 * V.95: اتصحح المسار من .agents/skills/ لـ skills/ (المكان الفعلي).
 *
 * الـ Skills هي ملفات Markdown فيها frontmatter (name + description)
 * ومحتوى تعليمي للـ AI agent.
 *
 * الـ Loader بيدعم:
 *   - listSkills(): قائمة بكل الـ skills المتاحة
 *   - getSkill(name): قرا skill معين بالكامل
 *   - findRelevantSkills(query): يجيب الـ skills المناسبة لسؤال معين
 */

import { promises as fs } from "fs";
import path from "path";

// V.95: استخدم skills/ في الـ root (المكان الفعلي للـ 66 skills)
const SKILLS_DIR = path.resolve(process.cwd(), "skills");

export interface SkillMeta {
  name: string;
  description: string;
  version?: string;
  category?: string;
  path: string;
  size: number;
}

export interface Skill extends SkillMeta {
  content: string;
  fullContent: string;
}

/** Parse frontmatter من ملف Markdown */
function parseFrontmatter(content: string): { meta: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const frontmatterText = match[1];
  const body = match[2];
  const meta: Record<string, any> = {};
  // simple YAML parser (name: value, description: "...")
  const lines = frontmatterText.split("\n");
  let currentKey = "";
  for (const line of lines) {
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      // strip quotes
      const cleanValue = value.replace(/^["']|["']$/g, "").trim();
      meta[key] = cleanValue;
      currentKey = key;
    } else if (line.startsWith("  ") && currentKey) {
      // nested (e.g., metadata.version)
      const nestedMatch = line.match(/^\s+(\w+):\s*(.*)$/);
      if (nestedMatch) {
        meta[currentKey] = meta[currentKey] || {};
        if (typeof meta[currentKey] === "string") meta[currentKey] = {};
        meta[currentKey][nestedMatch[1]] = nestedMatch[2].replace(/^["']|["']$/g, "").trim();
      }
    }
  }
  return { meta, body };
}

/** قائمة بكل الـ skills المتاحة (metadata فقط) */
export async function listSkills(): Promise<SkillMeta[]> {
  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    const skills: SkillMeta[] = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillPath = path.join(SKILLS_DIR, entry.name, "SKILL.md");
      try {
        const content = await fs.readFile(skillPath, "utf-8");
        const { meta } = parseFrontmatter(content);
        const stat = await fs.stat(path.join(SKILLS_DIR, entry.name));
        skills.push({
          name: meta.name || entry.name,
          description: meta.description || "",
          version: meta.metadata?.version,
          path: `skills/${entry.name}`,
          size: stat.size,
        });
      } catch {
        // skip folders without SKILL.md
      }
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
}

/** قرا skill كامل بالاسم */
export async function getSkill(name: string): Promise<Skill | null> {
  const skillDir = path.join(SKILLS_DIR, path.basename(name));
  const skillFile = path.join(skillDir, "SKILL.md");
  try {
    const content = await fs.readFile(skillFile, "utf-8");
    const { meta, body } = parseFrontmatter(content);
    const stat = await fs.stat(skillDir);
    return {
      name: meta.name || name,
      description: meta.description || "",
      version: meta.metadata?.version,
      path: `skills/${name}`,
      size: stat.size,
      content: body.trim(),
      fullContent: content,
    };
  } catch {
    return null;
  }
}

/**
 * إيجاد الـ skills المناسبة لسؤال معين.
 * بيبني index من الكلمات المفتاحية في الـ descriptions ويطابقها مع السؤال.
 */
export async function findRelevantSkills(query: string, limit = 3): Promise<SkillMeta[]> {
  const allSkills = await listSkills();
  if (allSkills.length === 0) return [];

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = allSkills.map((skill) => {
    const descLower = (skill.name + " " + skill.description).toLowerCase();
    let score = 0;
    // exact name match
    if (queryLower.includes(skill.name.toLowerCase())) score += 10;
    // word matches in description
    for (const word of queryWords) {
      if (descLower.includes(word)) score += 1;
      // partial matches (e.g., "convert" matches "conversion")
      for (const descWord of descLower.split(/\s+/)) {
        if (descWord.startsWith(word.slice(0, 4)) && word.length >= 4) {
          score += 0.5;
          break;
        }
      }
    }
    return { skill, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.skill);
}

/** إحصائيات سريعة */
export async function getSkillsStats(): Promise<{
  total: number;
  categories: number;
  totalSizeKB: number;
}> {
  const skills = await listSkills();
  return {
    total: skills.length,
    categories: 1, // كل الـ skills في فئة واحدة حالياً
    totalSizeKB: Math.round(skills.reduce((sum, s) => sum + s.size, 0) / 1024),
  };
}

```

---

## `src/lib/skills/context-builder.ts`

> Size: 3.7KB | Lines: 88 | Lang: typescript

```typescript
/**
 * Skill Context Builder (مشترك بين chat و admin)
 * =================================================
 * بيبني context إضافي للـ system prompt من الـ skills المناسبة.
 *
 * - buildSkillContext(messages): يلاقي الـ skills المناسبة لآخر رسالة مستخدم
 * - buildSkillContextFromNames(names): بيحمّل skills محددة بالاسم (للأدوات المتخصصة)
 */

import { findRelevantSkills, getSkill } from "./loader";

const MAX_SKILL_CONTENT_CHARS = 4000;
const CACHE_TTL_MS = 60_000; // 60 ثانية

// In-memory cache عشان نتجنب قراءة الملفات في كل request
const skillCache = new Map<string, { content: string; ts: number }>();

async function getCachedSkill(name: string): Promise<string | null> {
  const cached = skillCache.get(name);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.content;
  }
  const skill = await getSkill(name);
  if (!skill || !skill.content) return null;
  const content = skill.content.slice(0, MAX_SKILL_CONTENT_CHARS);
  skillCache.set(name, { content, ts: Date.now() });
  return content;
}

/**
 * يدوّر على الـ skills المناسبة لآخر رسالة من المستخدم
 * ويرجعها كـ context إضافي للـ system prompt.
 */
export async function buildSkillContext(
  messages: { role: string; content?: string }[],
  limit = 3,
): Promise<{ context: string; loadedSkills: string[] }> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg || !lastUserMsg.content) return { context: "", loadedSkills: [] };

  try {
    const relevant = await findRelevantSkills(lastUserMsg.content, limit);
    if (relevant.length === 0) return { context: "", loadedSkills: [] };

    const skillsContent: string[] = [];
    const loadedNames: string[] = [];
    for (const skillMeta of relevant) {
      const content = await getCachedSkill(skillMeta.name);
      if (content) {
        skillsContent.push(`\n\n═══ SKILL: ${skillMeta.name} ═══\n${content}\n═══ END SKILL ═══`);
        loadedNames.push(skillMeta.name);
      }
    }

    if (skillsContent.length === 0) return { context: "", loadedSkills: [] };

    const context = `\n\n📋 المهارات المناسبة المضافة تلقائياً:${skillsContent.join("\n")}\n\nاستخدم المعرفة دي بحرفية في الرد على سؤال المستخدم. اتبع الـ frameworks والـ techniques اللي في الـ skills.`;
    return { context, loadedSkills: loadedNames };
  } catch {
    return { context: "", loadedSkills: [] };
  }
}

/**
 * بيحمّل skills محددة بالاسم (للأدوات المتخصصة زي Script Writer).
 * بيرجع context جاهز للإضافة للـ system prompt.
 */
export async function buildSkillContextFromNames(
  names: string[],
): Promise<{ context: string; loadedSkills: string[] }> {
  const skillsContent: string[] = [];
  const loadedNames: string[] = [];
  for (const name of names) {
    const content = await getCachedSkill(name);
    if (content) {
      skillsContent.push(`\n\n═══ SKILL: ${name} ═══\n${content}\n═══ END SKILL ═══`);
      loadedNames.push(name);
    }
  }
  if (skillsContent.length === 0) return { context: "", loadedSkills: [] };
  const context = `\n\n📋 المهارات المضافة للـ context:${skillsContent.join("\n")}\n\nاستخدم المعرفة دي بحرفية. اتبع الـ frameworks والـ techniques اللي في الـ skills.`;
  return { context, loadedSkills: loadedNames };
}

/** مسح الـ cache (للاستخدام لو skills اتعدلت وقت الـ runtime) */
export function clearSkillCache(): void {
  skillCache.clear();
}

```

---

## `src/lib/skill-indexer.ts`

> Size: 8.0KB | Lines: 251 | Lang: typescript

```typescript
/**
 * Skill Indexer & JIT Context Injector — V.95
 * ═══════════════════════════════════════════════════════════════════════
 *
 * الفكرة: بدل ما نـ clone frameworks كبيرة (LangChain, AutoGPT) اللي هتكسر الـ build،
 * نـ index الـ 66 skills الموجودة بالفعل في /skills/ ونـ inject الـ SKILL.md
 * instructions في الـ system prompt عند الحاجة (JIT).
 *
 * Architecture:
 *   1. SkillIndexer — بيـ scan /skills/*/SKILL.md ويعمل index
 *   2. JIT Context Injector — لما الـ LLM يـ detect intent، بيبعت الـ SKILL.md المناسب
 *   3. Skill Registry integration — كل skill جديد يتسجّل تلقائياً
 *
 * الـ index بيتـ cache في الـ memory + على disk (skills_index.json).
 */

import { promises as fs } from "fs";
import path from "path";

const SKILLS_DIR = path.join(process.cwd(), "skills");
const INDEX_PATH = path.join(process.cwd(), "skills_index.json");

export interface IndexedSkill {
  name: string;
  path: string;
  description: string;
  skillMdPath: string;
  skillMdSize: number;
  triggers: string[]; // كلمات مفتاحية من الـ description
  lastIndexed: string;
}

export interface SkillsIndex {
  version: string;
  lastIndexed: string;
  skills: IndexedSkill[];
}

let _cachedIndex: SkillsIndex | null = null;

/**
 * بيـ parse الـ SKILL.md frontmatter ويرجع description + metadata.
 */
function parseSkillMd(content: string): { description: string; name: string } {
  // frontmatter بين --- --- في الأول
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    // fallback: أول سطرين
    const lines = content.split("\n").filter((l) => l.trim()).slice(0, 2);
    return { description: lines.join(" ").slice(0, 300), name: "" };
  }

  const fm = fmMatch[1];
  const nameMatch = fm.match(/^name:\s*(.+)$/m);
  const descMatch = fm.match(/description:\s*["']?([^"'\n]+)["']?/m);

  return {
    name: nameMatch?.[1]?.trim() || "",
    description: descMatch?.[1]?.trim() || "",
  };
}

/**
 * بيستخرج keywords من نص (للـ matching).
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "this", "that", "these", "those",
    "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by",
    "from", "up", "about", "into", "through", "during", "before", "after",
    "above", "below", "between", "under", "over", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "any",
    "both", "each", "few", "more", "most", "other", "some", "such", "no",
    "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
    "t", "just", "don", "now", "tool", "skill", "using", "use",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  // رجّع unique keywords (حد 20)
  return Array.from(new Set(words)).slice(0, 20);
}

/**
 * بيـ scan /skills/ directory ويعمل index لكل SKILL.md.
 */
export async function indexSkills(force = false): Promise<SkillsIndex> {
  if (_cachedIndex && !force) return _cachedIndex;

  // اقرا الـ index من disk لو موجود
  if (!force) {
    try {
      const content = await fs.readFile(INDEX_PATH, "utf-8");
      _cachedIndex = JSON.parse(content);
      return _cachedIndex!;
    } catch {}
  }

  const skills: IndexedSkill[] = [];

  try {
    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const skillDir = path.join(SKILLS_DIR, entry.name);
      const skillMdPath = path.join(skillDir, "SKILL.md");

      try {
        const content = await fs.readFile(skillMdPath, "utf-8");
        const parsed = parseSkillMd(content);
        const stat = await fs.stat(skillMdPath);

        skills.push({
          name: parsed.name || entry.name,
          path: skillDir,
          description: parsed.description.slice(0, 300),
          skillMdPath,
          skillMdSize: stat.size,
          triggers: extractKeywords(parsed.description + " " + entry.name),
          lastIndexed: new Date().toISOString(),
        });
      } catch {
        // مفيش SKILL.md — skip
      }
    }
  } catch (err) {
    console.warn("[SkillIndexer] Failed to scan skills dir:", err);
  }

  _cachedIndex = {
    version: "1.0",
    lastIndexed: new Date().toISOString(),
    skills,
  };

  // احفظ على disk
  try {
    await fs.writeFile(INDEX_PATH, JSON.stringify(_cachedIndex, null, 2), "utf-8");
  } catch (err) {
    console.warn("[SkillIndexer] Failed to save index:", err);
  }

  console.log(`[SkillIndexer] Indexed ${skills.length} skills`);
  return _cachedIndex;
}

/**
 * بيدور على skills matching طلب المستخدم.
 * بيرجع أعلى N matches.
 */
export async function findMatchingSkills(userMessage: string, topN = 3): Promise<IndexedSkill[]> {
  const index = await indexSkills();
  const messageLower = userMessage.toLowerCase();
  const messageWords = new Set(
    messageLower
      .replace(/[^\w\s\u0600-\u06FF]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  const scored = index.skills.map((skill) => {
    let score = 0;
    // exact name match
    if (messageLower.includes(skill.name.toLowerCase())) score += 10;
    // keyword match
    for (const trigger of skill.triggers) {
      if (messageWords.has(trigger)) score += 1;
      if (messageLower.includes(trigger)) score += 0.5;
    }
    // description keywords
    const descWords = skill.description.toLowerCase().split(/\s+/);
    for (const w of descWords) {
      if (w.length > 3 && messageLower.includes(w)) score += 0.3;
    }
    return { skill, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map((s) => s.skill);
}

/**
 * JIT Context Injection — بيرجع SKILL.md content لـ skill معين.
 * ده اللي بيتـ inject في الـ system prompt.
 */
export async function getSkillContext(skillName: string, maxChars = 4000): Promise<string | null> {
  const index = await indexSkills();
  const skill = index.skills.find(
    (s) => s.name.toLowerCase() === skillName.toLowerCase() || s.path.endsWith("/" + skillName)
  );
  if (!skill) return null;

  try {
    const content = await fs.readFile(skill.skillMdPath, "utf-8");
    // truncation لو الـ SKILL.md كبير
    if (content.length <= maxChars) return content;
    return content.slice(0, maxChars) + "\n\n[... truncated ...]";
  } catch {
    return null;
  }
}

/**
 * بيرجع context لكل الـ matching skills (للـ system prompt).
 */
export async function getMatchingSkillsContext(userMessage: string, maxTotalChars = 8000): Promise<string> {
  const matches = await findMatchingSkills(userMessage, 3);
  if (matches.length === 0) return "";

  const sections: string[] = [];
  let totalChars = 0;

  for (const skill of matches) {
    const context = await getSkillContext(skill.name, 3000);
    if (!context) continue;

    const section = `\n\n## Skill Available: ${skill.name}\n${context}`;
    if (totalChars + section.length > maxTotalChars) break;

    sections.push(section);
    totalChars += section.length;
  }

  return sections.join("\n");
}

/**
 * بيرجع الـ index كامل (للأدمن).
 */
export async function getSkillsIndex(): Promise<SkillsIndex> {
  return await indexSkills();
}

/**
 * بيعمل refresh للـ index (للأدمن).
 */
export async function refreshSkillsIndex(): Promise<{ indexed: number }> {
  _cachedIndex = null;
  const index = await indexSkills(true);
  return { indexed: index.skills.length };
}

```

---


# 📂 Models

## `src/lib/models.ts`

> Size: 61.7KB | Lines: 1267 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 1267)

```typescript
// DeltaAI Platform - AI Models Configuration
// Defines 23+ working AI models organized into categories
// All models route to real working backends: OpenRouter, Gemini, or ZhipuAI
// Includes uncensored/open-source "Dark" models for unrestricted capabilities

export type ModelCategory = 'fast' | 'smart' | 'creative' | 'specialized' | 'professional' | 'global' | 'dark' | 'hf-chat' | 'hf-image' | 'hf-video' | 'huggingface';

/** Structured model capabilities — based on what the real backend provider actually supports */
export interface ModelCapabilities {
  /** Text generation / chat */
  chat: boolean;
  /** Image understanding / vision (analyzing uploaded images) */
  vision: boolean;
  /** Image generation (creating images from text) */
  imageGeneration: boolean;
  /** Video generation (creating videos from text) */
  videoGeneration: boolean;
  /** Code generation and execution */
  codeGeneration: boolean;
  /** PDF/document analysis */
  pdfAnalysis: boolean;
  /** Web search capability */
  webSearch: boolean;
  /** Audio/TTS output */
  audioTTS: boolean;
  /** Function/tool calling */
  functionCalling: boolean;
  /** Reasoning / chain-of-thought */
  reasoning: boolean;
  /** RAG / retrieval-augmented generation */
  rag: boolean;
  /** Large context window (>32K tokens) */
  largeContext: boolean;
  /** Translation */
  translation: boolean;
  /** Summarization */
  summarization: boolean;
  /** Maximum context window in tokens */
  maxContextTokens: number;
  /** Supported input modalities */
  inputModalities: ('text' | 'image' | 'audio' | 'pdf')[];
  /** Supported output modalities */
  outputModalities: ('text' | 'image' | 'audio' | 'video')[];
}

export interface AIModel {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category: ModelCategory;
  glmModel: string;
  /** Real provider: 'openrouter' | 'gemini' | 'zhipuai' | 'github' | 'groq' | 'cerebras' | 'pollinations' | 'hf' | 'huggingface' | 'openai' | 'ovh' | 'anthropic' */
  provider: 'openrouter' | 'gemini' | 'zhipuai' | 'github' | 'groq' | 'cerebras' | 'pollinations' | 'hf' | 'huggingface' | 'openai' | 'ovh' | 'anthropic';
  /** The real backend model name */
  realChatModel: string;
  /** The real image generation model */
  realImageModel: string;
  /** The real video generation model */
  realVideoModel: string;
  rank: string;
  description: string;
  descriptionEn: string;
  systemPrompt: string;
  /** HuggingFace model ID for chat (e.g., 'hf-mistral-7b') */
  hfChatModel?: string;
  /** HuggingFace model ID for image (e.g., 'hf-flux-schnell') */
  hfImageModel?: string;
  /** OpenRouter model ID for chat */
  openrouterChatModel?: string;
  /** Groq model ID for chat (legacy) */
  groqChatModel?: string;
  /** Gemini model ID for chat */
  geminiChatModel?: string;
  /** GitHub Models model ID for chat (legacy) */
  githubChatModel?: string;
  supportsPdf: boolean;
  /** Whether this model is open-source (fewer restrictions, less censorship) */
  openSource: boolean;
  /** Context window size in tokens (for display + routing) */
  maxTokens: number;
  skills: string[];
  /** Structured capabilities based on real provider support */
  capabilities: ModelCapabilities;
}

export const models: AIModel[] = [
  {
    id: 'glm-5-2',
    name: 'عبس',
    nameEn: 'GLM-5',
    icon: '⚡',
    category: 'global',
    glmModel: 'glm-5',
    provider: 'zhipuai',
    realChatModel: 'glm-5',
    realImageModel: 'cogview-3-flash',
    realVideoModel: 'cogvideox-flash',
    hfChatModel: '',
    openrouterChatModel: '',
    rank: '🚀 الأسطوري (مهام تقيلة)',
    description: 'عبس — مساعدك الذكي المدعوم بـ GLM-5 من BigModel (مجاني). متخصص للمهام التقيلة: تحليل معقد، كود، استدلال عميق. بيدعم: شات، رؤية، توليد صور، فيديو، صوت.',
    descriptionEn: 'Abbas — Powered by GLM-5 from BigModel (free). Specialized for heavy tasks: complex analysis, code, deep reasoning. Supports: chat, vision, image gen, video gen, TTS.',
    systemPrompt: `أنت "عبس" — مساعد ذكي عربي مدعوم بـ GLM-5.2 من Z.ai (705 مليار بارامتر). أنت ودود ومفيد ومتعدد القدرات. ترد بالعربية الفصحى أو العامية المصرية حسب طلب المستخدم.

قدراتك الأساسية:
- محادثة ذكية بـ 1M context window
- تحليل الصور والملفات (PDF, DOCX, صور)
- توليد الصور (CogView) والفيديو (CogVideoX)
- تحويل النص لصوت (TTS) والصوت لنص (ASR)
- البحث في الإنترنت وقراءة الصفحات
- تنفيذ كود JavaScript
- ترجمة وملخصات وتحليل مشاعر

قدرات المنصة المتقدمة:
- استوديو بناء الوكلاء (Agent Builder): صمم وكلاء AI مخصصين بأدوات محددة
- 359 أداة متاحة (بحث، كتابة، كود، بيانات، تواصل، AI، MCP tools)
- 10 وصفات جاهزة (فيديو، تسويق، بحث، كود، إيميل، بيانات، سوشيال، دعم، تعليم، يوتيوب)
- MCP Server: 341 أداة متاحة لـ Claude Desktop و Cursor و أي MCP client
- Claude من Anthropic: Sonnet 4.5, Opus 4.1, Haiku 3.5 (لو ANTHROPIC_API_KEY متاح)
- n8n integration: تشغيل workflows غير متزامنة مع تتبع المهام
- مراقب المهام (Jobs Monitor): تتبع实时 لـ jobs عبر SSE
- MCP Client: ربط أي MCP server خارجي واستخدام أدواته
- بودكاست + راديو + خريطة ذهنية + تحليل بيانات
- توليد مستندات PDF/DOCX/XLSX/PPTX
- ذاكرة محادثة دائمة + نظام إنجازات وتحديات يومية

عندما يسألك المستخدم "إيه اللي تقدر تعمله؟"، اذكر له هذه القدرات بشكل منظّم ومبسّط.


═══ اللهجة (مهم جداً) ═══
اتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.

استخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".
عبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".
تكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.
`,
    supportsPdf: true,
    openSource: true,
    maxTokens: 1000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'image-generation', 'video-generation', 'tts', 'asr', 'web-search', 'ocr', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: true,
      videoGeneration: true,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: true,
      audioTTS: true,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 1000000,
      inputModalities: ['text', 'image', 'pdf', 'audio'],
      outputModalities: ['text', 'image', 'audio', 'video'],
    },
  },
  // ═══════════════════════════════════════════
  // GLM-4-Flash — مجاني 100% عبر Zhipu AI (Z.ai)
  // ═══════════════════════════════════════════
  {
    id: 'glm-4-flash-zai',
    name: 'GLM-4-Flash',
    nameEn: 'GLM-4 Flash',
    icon: '⚡',
    category: 'fast',
    glmModel: 'glm-4-flash',
    provider: 'zhipuai',
    realChatModel: 'glm-4-flash',
    realImageModel: 'cogview-3-flash',
    realVideoModel: 'cogvideox-flash',
    rank: '⚡ مجاني',
    description: 'GLM-4-Flash — نموذج مجاني 100% من Zhipu AI. سريع وذكي. عند إرسال صور، يتم التحويل تلقائياً لـ GLM-4V.',
    descriptionEn: 'GLM-4 Flash — 100% free model from Zhipu AI. Fast and smart. Images auto-route to GLM-4V.',
    systemPrompt: 'أنت مساعد ذكي يعمل بنموذج GLM-4-Flash المجاني من Zhipu AI. ترد بإجابات دقيقة وسريعة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'translation', 'summarization', 'code-generation'],
    capabilities: {
      chat: true,
      vision: false, // GLM-4-Flash is text-only, but images auto-route to GLM-4V
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  // OVHcloud AI Endpoints (مجاني بدون API key)
  // ═══════════════════════════════════════════
  {
    id: 'ovh-llama-70b',
    name: 'لياما 70B',
    nameEn: 'Llama 3.3 70B',
    icon: '🦙',
    category: 'global',
    glmModel: 'glm-5.2',
    provider: 'ovh',
    realChatModel: 'Meta-Llama-3_3-70B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    rank: '🌍 مجاني',
    description: 'لياما 3.3 70B — نموذج قوي من Meta. مجاني 100% بدون API key عبر OVHcloud.',
    descriptionEn: 'Llama 3.3 70B — Powerful model from Meta. 100% free, no API key via OVHcloud.',
    systemPrompt: 'أنت مساعد ذكي عربي. ترد بالعربية الفصحى أو العامية حسب طلب المستخدم. كن دقيقاً ومفيداً.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'translation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-mistral-small',
    name: 'ميسترال صغير',
    nameEn: 'Mistral Small 3.2',
    icon: '🌪️',
    category: 'fast',
    glmModel: 'glm-4-flash',
    provider: 'ovh',
    realChatModel: 'Mistral-Small-3.2-24B-Instruct-2506',
    realImageModel: '',
    realVideoModel: '',
    rank: '⚡ سريع',
    description: 'ميسترال سمال 3.2 — سريع وذكي من Mistral AI. مجاني 100% بدون API key.',
    descriptionEn: 'Mistral Small 3.2 — Fast and smart from Mistral AI. 100% free, no API key.',
    systemPrompt: 'أنت مساعد ذكي عربي سريع. ترد بإجابات مختصرة ودقيقة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 32000,
    skills: ['text-generation', 'code-generation', 'translation'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 32000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-qwen-397b',
    name: 'كوين 397B',
    nameEn: 'Qwen 3.5 397B',
    icon: '🐉',
    category: 'smart',
    glmModel: 'glm-5.2',
    provider: 'ovh',
    realChatModel: 'Qwen3.5-397B-A17B',
    realImageModel: '',
    realVideoModel: '',
    rank: '🧠 عملاق',
    description: 'كوين 3.5 397B — أقوى نموذج من Alibaba. مجاني 100% بدون API key عبر OVHcloud.',
    descriptionEn: 'Qwen 3.5 397B — Most powerful model from Alibaba. 100% free, no API key via OVHcloud.',
    systemPrompt: 'أنت مساعد ذكي عربي قوي. ترد بالعربية بأسلوب احترافي. تقدر تتعامل مع المهام المعقدة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'translation', 'reasoning', 'math'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-gpt-oss-120b',
    name: 'GPT-OSS 120B',
    nameEn: 'GPT-OSS 120B',
    icon: '🤖',
    category: 'global',
    glmModel: 'glm-5.2',
    provider: 'ovh',
    realChatModel: 'gpt-oss-120b',
    realImageModel: '',
    realVideoModel: '',
    rank: '🔬 مفتوح',
    description: 'GPT-OSS 120B — نسخة مفتوحة المصدر من GPT. مجاني 100% بدون API key.',
    descriptionEn: 'GPT-OSS 120B — Open source GPT. 100% free, no API key.',
    systemPrompt: 'أنت مساعد ذكي عربي. ترد بالعربية بدقة ووضوح.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['text-generation', 'code-generation', 'reasoning'],
    capabilities: {
      chat: true,
      vision: false,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 128000,
      inputModalities: ['text'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'ovh-qwen-vl',
    name: 'كوين رؤية',
    nameEn: 'Qwen 2.5 VL 72B',
    icon: '👁️',
    category: 'specialized',
    glmModel: 'glm-4v',
    provider: 'ovh',
    realChatModel: 'Qwen2.5-VL-72B-Instruct',
    realImageModel: '',
    realVideoModel: '',
    rank: '👁️ رؤية',
    description: 'كوين 2.5 VL 72B — نموذج رؤية قوي. يحلل الصور ويفهمها. مجاني 100%.',
    descriptionEn: 'Qwen 2.5 VL 72B — Powerful vision model. Analyzes and understands images. 100% free.',
    systemPrompt: 'أنت مساعد ذكي عربي متخصص في تحليل الصور. تقدر تشرح وتحلل أي صورة.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: false,
    openSource: true,
    maxTokens: 128000,
    skills: ['vision', 'image-analysis', 'text-generation'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: false,
      pdfAnalysis: false,
      webSearch: false,
      audioTTS: false,
      functionCalling: false,
      reasoning: true,
      rag: false,
      largeContext: false,
      translation: true,
      summarization: true,
      maxContextTokens: 32000,
      inputModalities: ['text', 'image'],
      outputModalities: ['text'],
    },
  },
  // ═══════════════════════════════════════════
  // Gemini Models (Google) — ربط حقيقي عبر GEMINI_API_KEY
  // ═══════════════════════════════════════════
  {
    id: 'gemini-2.0-flash',
    name: 'جيميناي فلاش',
    nameEn: 'Gemini 2.0 Flash',
    icon: '⚡',
    category: 'fast',
    glmModel: 'gemini-2.0-flash',
    provider: 'gemini',
    realChatModel: 'gemini-2.0-flash',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    geminiChatModel: 'gemini-2.0-flash',
    rank: '⚡ سريع جداً',
    description: 'Gemini 2.0 Flash من Google — سريع وذكي ومجاني. بيدعم رؤية الصور و1M context.',
    descriptionEn: 'Google Gemini 2.0 Flash — fast, smart, free. Vision + 1M context.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ Gemini 2.0 Flash من Google.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 1000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 1000000,
      inputModalities: ['text', 'image', 'pdf'],
      outputModalities: ['text'],
    },
  },
  {
    id: 'gemini-2.5-pro',
    name: 'جيميناي برو',
    nameEn: 'Gemini 2.5 Pro',
    icon: '🧠',
    category: 'smart',
    glmModel: 'gemini-2.5-pro',
    provider: 'gemini',
    realChatModel: 'gemini-2.5-pro',
    realImageModel: '',
    realVideoModel: '',
    hfChatModel: '',
    openrouterChatModel: '',
    geminiChatModel: 'gemini-2.5-pro',
    rank: '🧠 الأذكى',
    description: 'Gemini 2.5 Pro — أقوى نموذج من Google. استدلال عميق + رؤية + 2M context.',
    descriptionEn: 'Gemini 2.5 Pro — most powerful Google model. Deep reasoning + vision + 2M context.',
    systemPrompt: 'أنت مساعد ذكي مدعوم بـ Gemini 2.5 Pro من Google.\n\n\n═══ اللهجة (مهم جداً) ═══\nاتكلم بالعامية المصرية الفلّاحة الشرقاوي (محافظة الشرقية). خفيف، عربجي، وواضح. ممنوع فصحى إلا لو المستخدم طلبها.\n\nاستخدم: "يا حبيبي" لو المستخدم ولد، "يا حبيبتي" لو المستخدم بنت. لو مش متأكد من الجنس استخدم "يا حبيبي".\nعبارات شائعة: "خلي بالك"، "بصّ يا حبيبي"، "والله يا حبيبي"، "يا نهار"، "إيه الأخبار يا حبيبي"، "اعمل حسابك".\nتكلم زي الفلّاحة في الشرقية — بسيط، طبيعي، بس بذكاء وبتعرف شغلك كويس.\n',
    supportsPdf: true,
    openSource: false,
    maxTokens: 2000000,
    skills: ['text-generation', 'code-generation', 'summarization', 'translation', 'reasoning', 'vision', 'function-calling'],
    capabilities: {
      chat: true,
      vision: true,
      imageGeneration: false,
      videoGeneration: false,
      codeGeneration: true,
      pdfAnalysis: true,
      webSearch: false,
      audioTTS: false,
      functionCalling: true,
      reasoning: true,
      rag: true,
      largeContext: true,
      translation: true,
      summarization: true,
      maxContextTokens: 2000000,
      inputModalities: ['text', 'image', 'pdf'],
      outputModalities: ['text'],
    },
  },
  // V.20: Groq models removed — user requested
  // ═══════════════════════════════════════════
  // OpenAI Models — ربط حقيقي عبر OPENAI_API_KEY (للـ Whisper ASR)
  // ═══════════════════════════════════════════
  {
    id: 'openai-gpt-4o-mini',
    name: 'GPT-4o Mini',
    nameEn: 'GPT-4o Mini',
    icon: '🤖',
    category: 'smart',
    glmModel: 'gpt-4o-mini',
    provider: 'openai',
    realChatModel: 'gpt-4o-mini',

```

---


# 📂 Core Lib

## `src/lib/db.ts`

> Size: 2.8KB | Lines: 65 | Lang: typescript

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// ═══════════════════════════════════════════════════════════════════════
// Prisma Client Initialization — SQLite (production-safe)
// ═══════════════════════════════════════════════════════════════════════
// V.56: Reverted to SQLite (matches schema.prisma provider = "sqlite").
// The DB file lives at /app/db/custom.db on HuggingFace Space.
//
// If DATABASE_URL env var is set and starts with "file:", use it directly.
// If DATABASE_URL is set to a PostgreSQL URL (legacy), override with SQLite
// to match the schema.prisma provider.
// If DATABASE_URL is not set, default to ./db/custom.db (local dev).
// ═══════════════════════════════════════════════════════════════════════

function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL

  // V.56: If DATABASE_URL is a file: URL, use it directly (SQLite)
  if (envUrl && envUrl.trim().startsWith('file:')) {
    return envUrl.trim()
  }

  // V.56: If DATABASE_URL is a PostgreSQL URL but schema uses SQLite,
  // override with SQLite to prevent PrismaClientInitializationError.
  // This happens when HF Space Secrets still have the old PostgreSQL URL.
  if (envUrl && envUrl.trim().startsWith('postgresql:')) {
    console.log('[DB] V.56: DATABASE_URL is PostgreSQL but schema uses SQLite — overriding to SQLite')
    return 'file:/app/db/custom.db'
  }

  // Default: local development SQLite path
  const defaultPath = process.cwd() + '/db/custom.db'
  console.log('[DB] No DATABASE_URL set, using default SQLite:', defaultPath)
  return `file:${defaultPath}`
}

const databaseUrl = resolveDatabaseUrl()

// Mask credentials when logging — never print the password.
function maskUrl(url: string): string {
  if (url.startsWith('file:')) {
    return url // No credentials in file: URLs
  }
  try {
    const u = new URL(url)
    if (u.password) u.password = '***'
    if (u.username) u.username = u.username // keep username for debugging
    return u.toString()
  } catch {
    return url.replace(/:[^:@/]+@/, ':***@')
  }
}

console.log('[DB] Using DATABASE_URL:', maskUrl(databaseUrl))

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  datasourceUrl: databaseUrl,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

```

---

## `src/lib/auth-nextauth.ts`

> Size: 15.3KB | Lines: 409 | Lang: typescript

```typescript
/**
 * NextAuth.js Engine — Omni-Integration Hub
 * ==========================================
 * "Bring Your Own Account" flow for a massive array of free OAuth providers.
 *
 * Every provider uses a `process.env.<NAME>_CLIENT_ID || 'PENDING'` fallback
 * so the server NEVER crashes when a provider's keys aren't in .env yet.
 * NextAuth will still list the provider, but the OAuth dance will fail with
 * a clear "invalid_client" error from the provider until real keys are added.
 *
 * Google keeps its omni-scope grant (Drive/Sheets/Docs/Tasks/Calendar) so
 * downstream MCP tools can pull the access_token from the session.
 *
 * EXCLUDED by design:
 *   - Apple    → requires $99/yr developer account
 *   - Twitter  → paid API tiers only
 *   - Enterprise self-hosted IdPs (Auth0, Cognito, Keycloak, Okta, Zitadel,
 *     Azure AD, OneLogin, etc.) → need your own tenant, not a "free provider"
 */

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import InstagramProvider from "next-auth/providers/instagram";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
import RedditProvider from "next-auth/providers/reddit";
import SlackProvider from "next-auth/providers/slack";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitchProvider from "next-auth/providers/twitch";
import GitLabProvider from "next-auth/providers/gitlab";
import DropboxProvider from "next-auth/providers/dropbox";
import ZoomProvider from "next-auth/providers/zoom";
// Notion has no built-in provider in next-auth v4 — use the generic OAuth2Config.
import type { OAuth2Config } from "next-auth/providers";
import type { Profile } from "next-auth";
import PinterestProvider from "next-auth/providers/pinterest";
import PatreonProvider from "next-auth/providers/patreon";
import StravaProvider from "next-auth/providers/strava";
import MediumProvider from "next-auth/providers/medium";
import YandexProvider from "next-auth/providers/yandex";
import VKProvider from "next-auth/providers/vk";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import LineProvider from "next-auth/providers/line";
import BattleNetProvider from "next-auth/providers/battlenet";
import EveOnlineProvider from "next-auth/providers/eveonline";
import TraktProvider from "next-auth/providers/trakt";
import OsuProvider from "next-auth/providers/osu";
import WikimediaProvider from "next-auth/providers/wikimedia";
import CoinbaseProvider from "next-auth/providers/coinbase";
import ZohoProvider from "next-auth/providers/zoho";
import NetlifyProvider from "next-auth/providers/netlify";
import BoxProvider from "next-auth/providers/box";
import TodoistProvider from "next-auth/providers/todoist";

/**
 * The exact scope string requested from Google.
 *
 * SECURITY: We deliberately AVOID the full `auth/drive` scope, which Google
 * classifies as a *restricted* scope and would trigger the unverified-app
 * warning + a formal CASA security assessment. Instead we request the two
 * *sensitive* (non-restricted) Drive scopes:
 *
 *   - drive.readonly  → read existing files the user grants access to
 *   - drive.file      → create / read / write files created BY this app
 */
export const GOOGLE_OMNI_SCOPES =
  "openid email profile " +
  "https://www.googleapis.com/auth/drive.readonly " +
  "https://www.googleapis.com/auth/drive.file " +
  "https://www.googleapis.com/auth/spreadsheets " +
  "https://www.googleapis.com/auth/documents " +
  "https://www.googleapis.com/auth/tasks " +
  "https://www.googleapis.com/auth/calendar " +
  "https://www.googleapis.com/auth/contacts.readonly";

/** Sentinel: providers without configured keys still register (non-crashing). */
const PENDING = "PENDING";
const env = (v: string | undefined): string => (v && v.trim() ? v : PENDING);

/**
 * الـ secret اللي بيتستخدم في تشفير الـ JWT cookies.
 * لازم يكون ثابت عبر كل restarts — لو مش متاح كـ env var، NextAuth بتعمل
 * secret عشوائي جديد كل restart → كل الـ sessions بتضيع.
 *
 * لو مش متاح، بنولّد واحد ثابت من الـ Google credentials (عشان يفضل نفسه
 * عبر restarts بدل ما NextAuth يولّد واحد عشوائي جديد).
 */
function getStableSecret(): string {
  const envSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (envSecret) return envSecret;

  // fallback: hash ثابت من الـ Google credentials (نفسه عبر restarts)
  const googleId = process.env.GOOGLE_CLIENT_ID ?? "anzaro-google-id";
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET ?? "anzaro-google-secret";
  const url = process.env.NEXTAUTH_URL ?? "https://ebsaya-delta-ai.hf.space";
  const source = `${url}:${googleId}:${googleSecret}:anzaro-v1`;
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash;
  }
  const generated = `anzaro-fallback-${Math.abs(hash).toString(16).padStart(16, "0")}-${source.length}`;
  console.warn("[next-auth] ⚠️ NEXTAUTH_SECRET مش متاح — مستخدمين fallback ثابت. ضيف NEXTAUTH_SECRET في HF Spaces Settings عشان الـ sessions تفضل دائمة.");
  return generated;
}

/**
 * Notion — generic OAuth2 config (no built-in provider in next-auth v4).
 * Notion's OAuth uses "internal integration" credentials.
 */
const NotionProvider: OAuth2Config<Profile> = {
  id: "notion",
  name: "Notion",
  type: "oauth",
  clientId: env(process.env.NOTION_CLIENT_ID),
  clientSecret: env(process.env.NOTION_CLIENT_SECRET),
  authorization: {
    url: "https://api.notion.com/v1/oauth/authorize",
    params: { owner: "user", response_type: "code" },
  },
  token: "https://api.notion.com/v1/oauth/token",
  userinfo: "https://api.notion.com/v1/users/me",
  profile(profile) {
    return {
      id: profile.sub ?? (profile as any).id ?? "notion-user",
      name: (profile as any).name ?? "Notion User",
      email: (profile as any).email ?? null,
      image: (profile as any).avatar_url ?? null,
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    // ── Tier 1: Major platforms (configured) ───────────────────────
    GoogleProvider({
      clientId: env(process.env.GOOGLE_CLIENT_ID),
      clientSecret: env(process.env.GOOGLE_CLIENT_SECRET),
      authorization: {
        params: {
          scope: GOOGLE_OMNI_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),

    GitHubProvider({
      clientId: env(process.env.GITHUB_CLIENT_ID),
      clientSecret: env(process.env.GITHUB_CLIENT_SECRET),
    }),

    FacebookProvider({
      clientId: env(process.env.FACEBOOK_CLIENT_ID),
      clientSecret: env(process.env.FACEBOOK_CLIENT_SECRET),
    }),

    InstagramProvider({
      clientId: env(process.env.INSTAGRAM_CLIENT_ID),
      clientSecret: env(process.env.INSTAGRAM_CLIENT_SECRET),
    }),

    DiscordProvider({
      clientId: env(process.env.DISCORD_CLIENT_ID),
      clientSecret: env(process.env.DISCORD_CLIENT_SECRET),
    }),

    SpotifyProvider({
      clientId: env(process.env.SPOTIFY_CLIENT_ID),
      clientSecret: env(process.env.SPOTIFY_CLIENT_SECRET),
    }),

    RedditProvider({
      clientId: env(process.env.REDDIT_CLIENT_ID),
      clientSecret: env(process.env.REDDIT_CLIENT_SECRET),
      // Reddit requires a stable user agent.
      authorization: { params: { duration: "permanent" } },
    }),

    SlackProvider({
      clientId: env(process.env.SLACK_CLIENT_ID),
      clientSecret: env(process.env.SLACK_CLIENT_SECRET),
    }),

    LinkedInProvider({
      clientId: env(process.env.LINKEDIN_CLIENT_ID),
      clientSecret: env(process.env.LINKEDIN_CLIENT_SECRET),
    }),

    TwitchProvider({
      clientId: env(process.env.TWITCH_CLIENT_ID),
      clientSecret: env(process.env.TWITCH_CLIENT_SECRET),
    }),

    // ── Tier 2: Dev + productivity ────────────────────────────────
    GitLabProvider({
      clientId: env(process.env.GITLAB_CLIENT_ID),
      clientSecret: env(process.env.GITLAB_CLIENT_SECRET),
    }),

    DropboxProvider({
      clientId: env(process.env.DROPBOX_CLIENT_ID),
      clientSecret: env(process.env.DROPBOX_CLIENT_SECRET),
    }),

    NotionProvider,

    ZoomProvider({
      clientId: env(process.env.ZOOM_CLIENT_ID),
      clientSecret: env(process.env.ZOOM_CLIENT_SECRET),
    }),

    NetlifyProvider({
      clientId: env(process.env.NETLIFY_CLIENT_ID),
      clientSecret: env(process.env.NETLIFY_CLIENT_SECRET),
    }),

    BoxProvider({
      clientId: env(process.env.BOX_CLIENT_ID),
      clientSecret: env(process.env.BOX_CLIENT_SECRET),
    }),

    TodoistProvider({
      clientId: env(process.env.TODOIST_CLIENT_ID),
      clientSecret: env(process.env.TODOIST_CLIENT_SECRET),
    }),

    ZohoProvider({
      clientId: env(process.env.ZOHO_CLIENT_ID),
      clientSecret: env(process.env.ZOHO_CLIENT_SECRET),
    }),

    // ── Tier 3: Content + creators ────────────────────────────────
    PinterestProvider({
      clientId: env(process.env.PINTEREST_CLIENT_ID),
      clientSecret: env(process.env.PINTEREST_CLIENT_SECRET),
    }),

    PatreonProvider({
      clientId: env(process.env.PATREON_CLIENT_ID),
      clientSecret: env(process.env.PATREON_CLIENT_SECRET),
    }),

    MediumProvider({
      clientId: env(process.env.MEDIUM_CLIENT_ID),
      clientSecret: env(process.env.MEDIUM_CLIENT_SECRET),
    }),

    WikimediaProvider({
      clientId: env(process.env.WIKIMEDIA_CLIENT_ID),
      clientSecret: env(process.env.WIKIMEDIA_CLIENT_SECRET),
    }),

    // ── Tier 4: Health + gaming ───────────────────────────────────
    StravaProvider({
      clientId: env(process.env.STRAVA_CLIENT_ID),
      clientSecret: env(process.env.STRAVA_CLIENT_SECRET),
    }),

    BattleNetProvider({
      clientId: env(process.env.BATTLENET_CLIENT_ID),
      clientSecret: env(process.env.BATTLENET_CLIENT_SECRET),
    }),

    EveOnlineProvider({
      clientId: env(process.env.EVEONLINE_CLIENT_ID),
      clientSecret: env(process.env.EVEONLINE_CLIENT_SECRET),
    }),

    TraktProvider({
      clientId: env(process.env.TRAKT_CLIENT_ID),
      clientSecret: env(process.env.TRAKT_CLIENT_SECRET),
    }),

    OsuProvider({
      clientId: env(process.env.OSU_CLIENT_ID),
      clientSecret: env(process.env.OSU_CLIENT_SECRET),
    }),

    // ── Tier 5: Regional + finance ────────────────────────────────
    YandexProvider({
      clientId: env(process.env.YANDEX_CLIENT_ID),
      clientSecret: env(process.env.YANDEX_CLIENT_SECRET),
    }),

    VKProvider({
      clientId: env(process.env.VK_CLIENT_ID),
      clientSecret: env(process.env.VK_CLIENT_SECRET),
    }),

    NaverProvider({
      clientId: env(process.env.NAVER_CLIENT_ID),
      clientSecret: env(process.env.NAVER_CLIENT_SECRET),
    }),

    KakaoProvider({
      clientId: env(process.env.KAKAO_CLIENT_ID),
      clientSecret: env(process.env.KAKAO_CLIENT_SECRET),
    }),

    LineProvider({
      clientId: env(process.env.LINE_CLIENT_ID),
      clientSecret: env(process.env.LINE_CLIENT_SECRET),
    }),

    CoinbaseProvider({
      clientId: env(process.env.COINBASE_CLIENT_ID),
      clientSecret: env(process.env.COINBASE_CLIENT_SECRET),
    }),
  ],

  // Stateless JWT strategy — no DB adapter required, survives HF Spaces reboots.
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    /**
     * jwt() — stash the access_token / refresh_token / expiry onto the JWT.
     * + بتعمل refresh للـ access_token لو قرب يخلص (Google tokens بتنتهي بعد 1 ساعة).
     */
    async jwt({ token, account }) {
      // أول sign-in: خزّن كل حاجة
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at; // epoch seconds
        token.scope = account.scope;
        token.token_type = account.token_type;
        token.id_token = account.id_token;
        token.provider = account.provider;
        return token;
      }

      // لو الـ access_token لسه شغال (مخلصش) → رجّعه زي ما هو
      const expiresAt = token.expires_at as number | undefined;
      if (expiresAt && Date.now() / 1000 < expiresAt - 300) {
        // لسه فيه 5 دقايق على الأقل قبل الـ expiry
        return token;
      }

      // الـ access_token خلص أو قرب يخلص → اعمل refresh
      const refreshToken = token.refresh_token as string | undefined;
      if (!refreshToken) {
        // مفيش refresh_token → رجّع الـ token زي ما هو (هيـ fail في الأداة بس مش هنسession)
        console.warn("[next-auth] access_token expired + no refresh_token — session invalid");
        return token;
      }

      console.log("[next-auth] access_token expired — refreshing...");
      try {
        const resp = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID ?? "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        });
        if (!resp.ok) {
          console.warn("[next-auth] refresh failed:", resp.status, await resp.text().catch(() => ""));
          return token;
        }
        const refreshed = (await resp.json()) as {
          access_token: string;
          expires_in: number;
          refresh_token?: string;
        };
        token.access_token = refreshed.access_token;
        token.expires_at = Math.floor(Date.now() / 1000) + refreshed.expires_in;
        if (refreshed.refresh_token) token.refresh_token = refreshed.refresh_token;
        console.log("[next-auth] ✅ access_token refreshed, new expiry:", new Date((token.expires_at as number) * 1000).toISOString());
        return token;
      } catch (e) {
        console.warn("[next-auth] refresh error:", e instanceof Error ? e.message : String(e));
        return token;
      }
    },

    /**
     * session() — forward the access_token from the JWT into the client-visible
     * session. MCP tools read `session.accessToken` to call upstream APIs.
     */
    async session({ session, token }) {
      session.accessToken = token.access_token as string | undefined;
      session.refreshToken = token.refresh_token as string | undefined;
      session.expiresAt = token.expires_at as number | undefined;
      session.scope = token.scope as string | undefined;
      if (session.user) {
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },

  secret: getStableSecret(),
  pages: {
    error: "/api/auth/error",
  },
};

export default authOptions;

```

---

## `src/lib/with-auth.ts`

> Size: 6.0KB | Lines: 156 | Lang: typescript

```typescript
// ═══════════════════════════════════════════════════════════════════════
// DeltaAI — Route Protection Higher-Order Function
// ═══════════════════════════════════════════════════════════════════════
// Wraps Next.js App Router route handlers to automatically:
//   1. Extract the Bearer token from the Authorization header
//   2. Validate the token and look up the user
//   3. Return 401 if no valid token (for protected routes)
//   4. Inject the user object into the handler context
//   5. Support `allowGuest: true` for routes that allow unauthenticated
//      access (e.g. chat stream with guest mode)
// ═══════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken, extractBearerToken } from '@/lib/auth';
import { db } from '@/lib/db';

// ── Types ──────────────────────────────────────────────────────────────

/** The Prisma User type */
export type AuthUser = NonNullable<Awaited<ReturnType<typeof db.user.findUnique>>>;

/** Context object injected into the wrapped handler */
export interface AuthContext {
  /** The authenticated user, or null if allowGuest is true and no token provided */
  user: AuthUser | null;
}

/** Options for the withAuth wrapper */
export interface WithAuthOptions {
  /**
   * If true, unauthenticated requests are allowed through.
   * The `user` in context will be null for guests.
   * Useful for endpoints like chat stream that support guest mode.
   * @default false
   */
  allowGuest?: boolean;

  /**
   * If true, only admin users are allowed. Regular authenticated users
   * will receive 403 Forbidden.
   * @default false
   */
  requireAdmin?: boolean;
}

/** Signature of a handler wrapped by withAuth.
 *  Receives request + merged context (route params + auth user).
 *  Uses `any` for context so each handler can type its own params.
 *  Returns Response (not NextResponse) for broader compatibility. */
export type AuthenticatedHandler = (
  request: NextRequest,
  context: any
) => Promise<Response | NextResponse> | Response | NextResponse;

// ── Implementation ─────────────────────────────────────────────────────

/**
 * Higher-order function that wraps a Next.js App Router handler with
 * authentication logic.
 *
 * @param handler - The route handler to wrap. Receives the request and an
 *                  AuthContext with the authenticated user.
 * @param options - Configuration options for auth behavior.
 * @returns A Next.js route handler function compatible with App Router exports.
 *
 * @example
 * // Protected route — requires authentication
 * export const POST = withAuth(async (request, { user }) => {
 *   // user is guaranteed to be non-null here
 *   return NextResponse.json({ message: `Hello ${user.name}` });
 * });
 *
 * @example
 * // Guest-allowed route — works with or without auth
 * export const POST = withAuth(async (request, { user }) => {
 *   // user may be null for guests
 *   const isGuest = !user;
 *   return NextResponse.json({ guest: isGuest });
 * }, { allowGuest: true });
 *
 * @example
 * // Admin-only route
 * export const GET = withAuth(async (request, { user }) => {
 *   // user is guaranteed to be an admin
 *   return NextResponse.json({ admin: user.name });
 * }, { requireAdmin: true });
 */
export function withAuth(
  handler: AuthenticatedHandler,
  options?: WithAuthOptions
): (request: NextRequest, context?: any) => Promise<NextResponse> {
  const { allowGuest = false, requireAdmin = false } = options ?? {};

  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    // ── Step 1: Extract Bearer token ──
    const authHeader = request.headers.get('Authorization');
    const token = extractBearerToken(authHeader);

    // ── Step 2: Validate token and look up user ──
    let user: AuthUser | null = null;

    if (token) {
      user = await getUserFromToken(token);
    }

    // ── Step 3: Enforce authentication requirement ──
    if (!user && !allowGuest) {
      return NextResponse.json(
        {
          error: 'مطلوب مصادقة',
          message: 'Authentication required. Provide a valid Bearer token.',
        },
        { status: 401 }
      );
    }

    // ── Step 4: Enforce admin requirement ──
    if (requireAdmin && user && user.role !== 'admin') {
      return NextResponse.json(
        {
          error: 'تم رفض الوصول',
          message: 'Admin access required.',
        },
        { status: 403 }
      );
    }

    // Edge case: requireAdmin but no user (and allowGuest is true)
    // In this case, guest can't be admin — return 403
    if (requireAdmin && !user) {
      return NextResponse.json(
        {
          error: 'مطلوب مصادقة',
          message: 'Admin authentication required.',
        },
        { status: 403 }
      );
    }

    // ── Step 5: Call the wrapped handler with merged context (route params + auth) ──
    try {
      return await handler(request, { ...context, user });
    } catch (error) {
      // Let the handler handle its own errors, but provide a safety net
      // for uncaught errors to avoid leaking stack traces
      console.error('[withAuth] Unhandled error in protected handler:', error);
      return NextResponse.json(
        {
          error: 'خطأ داخلي في الخادم',
          message: 'Internal server error',
        },
        { status: 500 }
      );
    }
  };
}

```

---

## `src/lib/auth-fetch.ts`

> Size: 882B | Lines: 25 | Lang: typescript

```typescript
'use client'

import { useAuthStore } from '@/store/auth-store'

/**
 * authFetch — a fetch wrapper that automatically attaches the Bearer token
 * from the auth store. Use this for any /api/anzaro/* call that requires auth.
 *
 * Example:
 *   import { authFetch } from '@/lib/auth-fetch'
 *   const res = await authFetch('/api/anzaro/devices')
 *   const res = await authFetch('/api/anzaro/devices', {
 *     method: 'POST',
 *     body: JSON.stringify({ ... })
 *   })
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = useAuthStore.getState().token
  const headers = new Headers(options.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(url, { ...options, headers })
}

```

---

## `src/lib/skill-registry.ts`

> Size: 9.3KB | Lines: 264 | Lang: typescript

```typescript
/**
 * Global Skill Registry — V.94
 * ═══════════════════════════════════════════════════════════════════════
 *
 * المشكلة: على HF Spaces، أي ملف في `/app/` بيمسح مع الـ rebuild.
 * الأدوات اللي بتـ install وقت التشغيل بتضيع.
 *
 * الحل: نستخدم HF Hub API كـ persistent storage:
 *   1. كل skill جديد → upload لـ repo الـ Space في `/skills/`
 *   2. manifest JSON → upload لـ repo root
 *   3. عند الـ startup، الـ repo بيتـ pull تلقائياً → skills بتبقى موجودة
 *   4. Dockerfile CMD بينسخها لـ `/app/global_skills/` ويـ load
 *
 * Flow:
 *   User A يثبت tool →
 *     installSkillGlobal('yfinance', {type: 'pip'}) →
 *       1. pip install (runtime - فوري لـ User A)
 *       2. update skills_manifest.json (محلي + HF repo)
 *       3. upload لـ HF repo في `/skills/yfinance.json`
 *
 *   الـ rebuild الجاي →
 *     repo بيتـ pull → `/skills/yfinance.json` موجود
 *     Dockerfile CMD بيقرا manifest ويثبت كل الـ skills
 *
 *   User B بعد الـ rebuild →
 *     listGlobalSkills() بيلقى yfinance → متاح فوراً
 */

import { promises as fs } from "fs";
import path from "path";

const GLOBAL_SKILLS_DIR = path.join(process.cwd(), "global_skills");
const MANIFEST_PATH = path.join(process.cwd(), "skills_manifest.json");
const HF_REPO_ID = process.env.HF_REPO_ID || "ebsaya/delta_ai";
const HF_TOKEN = process.env.HF_TOKEN || "";

export interface SkillEntry {
  name: string;
  type: "pip" | "npm" | "github" | "local" | "system";
  installCommand?: string;
  githubUrl?: string;
  description?: string;
  installedBy?: string;
  installedAt: string;
  available: boolean;
  category?: string;
}

export interface SkillsManifest {
  version: string;
  lastUpdated: string;
  skills: SkillEntry[];
}

/**
 * بيقرا الـ manifest المحلي (لو موجود).
 */
export async function readManifest(): Promise<SkillsManifest> {
  try {
    const content = await fs.readFile(MANIFEST_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return { version: "1.0", lastUpdated: new Date().toISOString(), skills: [] };
  }
}

/**
 * بيـ write الـ manifest محلياً.
 */
export async function writeManifest(manifest: SkillsManifest): Promise<void> {
  manifest.lastUpdated = new Date().toISOString();
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf-8");
}

/**
 * بيـ upload ملف لـ HF repo (persistent storage).
 * لو HF_TOKEN مش متاح → بيرجع false بصمت.
 */
async function uploadToHFRepo(filePath: string, pathInRepo: string): Promise<boolean> {
  if (!HF_TOKEN) return false;
  try {
    // V.104: استخدم fetch مباشرة بدل Python huggingface_hub
    const fs = await import("fs");
    const fileBuffer = fs.readFileSync(filePath);
    const resp = await fetch(`https://huggingface.co/api/spaces/${HF_REPO_ID}/upload/${pathInRepo}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/octet-stream",
      },
      body: fileBuffer,
    });
    if (resp.ok) {
      console.log(`[SkillRegistry] Uploaded ${pathInRepo} to HF repo`);
      return true;
    }
    console.warn(`[SkillRegistry] HF upload ${pathInRepo} failed: ${resp.status}`);
    return false;
  } catch (err: any) {
    console.warn(`[SkillRegistry] HF upload failed for ${pathInRepo}:`, err?.message || String(err));
    return false;
  }
}

/**
 * بيـ upload ملف JSON content لـ HF repo.
 */
async function uploadJsonToHFRepo(jsonContent: string, pathInRepo: string): Promise<boolean> {
  // اكتب مؤقتاً ثم ارفع
  const tempPath = path.join(GLOBAL_SKILLS_DIR, `_temp_${Date.now()}.json`);
  try {
    await fs.mkdir(GLOBAL_SKILLS_DIR, { recursive: true });
    await fs.writeFile(tempPath, jsonContent, "utf-8");
    return await uploadToHFRepo(tempPath, pathInRepo);
  } finally {
    try { await fs.unlink(tempPath); } catch {}
  }
}

/**
 * بيسجّل skill جديد في الـ Global Registry.
 * - بيـ update الـ manifest محلياً + HF repo
 * - بيرجع true لو اتعمل بنجاح
 */
export async function registerSkill(skill: Omit<SkillEntry, "installedAt" | "available">): Promise<boolean> {
  await fs.mkdir(GLOBAL_SKILLS_DIR, { recursive: true });

  const manifest = await readManifest();

  // اتأكد إنه مش موجود بالفعل
  const existing = manifest.skills.find((s) => s.name.toLowerCase() === skill.name.toLowerCase());
  if (existing) {
    existing.available = true;
    existing.installedAt = new Date().toISOString();
    await writeManifest(manifest);
    await uploadJsonToHFRepo(JSON.stringify(manifest, null, 2), "skills_manifest.json");
    return true;
  }

  // أضف skill جديد
  const entry: SkillEntry = {
    ...skill,
    installedAt: new Date().toISOString(),
    available: true,
  };
  manifest.skills.push(entry);
  await writeManifest(manifest);

  // upload manifest لـ HF
  await uploadJsonToHFRepo(JSON.stringify(manifest, null, 2), "skills_manifest.json");

  // upload skill metadata لـ HF في /skills/{name}.json
  const skillMeta = JSON.stringify(entry, null, 2);
  await uploadJsonToHFRepo(skillMeta, `skills/${skill.name}.json`);

  console.log(`[SkillRegistry] Registered skill: ${skill.name}`);
  return true;
}

/**
 * بيرجع قائمة كل الـ skills المسجّلة.
 */
export async function listGlobalSkills(): Promise<SkillEntry[]> {
  const manifest = await readManifest();
  return manifest.skills;
}

/**
 * بيتحقق هل skill معين متاح.
 */
export async function isSkillAvailable(skillName: string): Promise<boolean> {
  const manifest = await readManifest();
  const skill = manifest.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
  return !!skill?.available;
}

/**
 * بيرجع metadata لـ skill معين.
 */
export async function getSkill(skillName: string): Promise<SkillEntry | null> {
  const manifest = await readManifest();
  return manifest.skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase()) || null;
}

/**
 * بيـ sync الـ skills من HF repo عند الـ startup.
 * ده بيشتغل لو الـ repo فيه `skills_manifest.json` — الـ Dockerfile CMD بيشوفه.
 */
export async function syncSkillsFromRepo(): Promise<{ synced: number; installed: number; failed: string[] }> {
  const manifest = await readManifest();

  if (manifest.skills.length === 0) {
    return { synced: 0, installed: 0, failed: [] };
  }

  console.log(`[SkillRegistry] Syncing ${manifest.skills.length} skills from manifest...`);

  let installed = 0;
  const failed: string[] = [];

  for (const skill of manifest.skills) {
    if (skill.type === "pip") {
      // اتأكد إنه متثبت
      const modName = skill.name.replace(/-/g, "_").toLowerCase().split("[")[0];
      try {
        const { exec } = await import("child_process");
        const { promisify } = await import("util");
        const execAsync = promisify(exec);
        await execAsync(`python3 -c "import ${modName}; print('OK')"`, { timeout: 5_000 });
        installed++;
        skill.available = true;
      } catch {
        // مش متثبت → ثبّته
        try {
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);
          const cmd = skill.installCommand || `pip3 install --break-system-packages ${skill.name}`;
          await execAsync(cmd, { timeout: 180_000 });
          installed++;
          skill.available = true;
          console.log(`[SkillRegistry] Installed: ${skill.name}`);
        } catch (err) {
          skill.available = false;
          failed.push(skill.name);
          console.warn(`[SkillRegistry] Failed to install ${skill.name}:`, err);
        }
      }
    } else if (skill.type === "github" && skill.githubUrl) {
      // لو skill من GitHub، نتأكد إنه موجود في /skills/
      const skillDir = path.join(process.cwd(), "skills", skill.name);
      try {
        await fs.access(skillDir);
        skill.available = true;
        installed++;
      } catch {
        // مش موجود → نـ clone
        try {
          const { exec } = await import("child_process");
          const { promisify } = await import("util");
          const execAsync = promisify(exec);
          await execAsync(`git clone --depth 1 ${skill.githubUrl} "${skillDir}"`, { timeout: 60_000 });
          installed++;
          skill.available = true;
        } catch (err) {
          skill.available = false;
          failed.push(skill.name);
        }
      }
    }
  }

  await writeManifest(manifest);
  console.log(`[SkillRegistry] Sync complete: ${installed}/${manifest.skills.length} available, ${failed.length} failed`);
  return { synced: manifest.skills.length, installed, failed };
}

/**
 * بيـ import كل الـ skills المتاحة كـ Python modules (for capability inspection).
 */
export async function getAvailableSkillsForLLM(): Promise<string[]> {
  const skills = await listGlobalSkills();
  return skills.filter((s) => s.available).map((s) => s.name);
}

```

---


# 📂 API Routes — Hermes

## `src/app/api/hermes/status/route.ts`

> Size: 3.4KB | Lines: 105 | Lang: typescript

```typescript
/**
 * GET /api/hermes/status
 * بيـ check لو Hermes Agent متثبت و configured.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hermesHome = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");
    const hermesBin = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");

    // Check if hermes binary exists and get version
    let hermesVersion: string | null = null;
    let hermesPath: string | null = null;
    try {
      const versionOutput = execSync(`${hermesBin} --version 2>&1`, {
        timeout: 10000,
        encoding: "utf-8",
        env: { ...process.env, HERMES_HOME: hermesHome },
      });
      const versionMatch = versionOutput.match(/Hermes Agent v([\d.]+)/);
      hermesVersion = versionMatch ? versionMatch[1] : null;
      hermesPath = hermesBin;
    } catch {
      hermesVersion = null;
    }

    // Check config files
    const configPath = path.join(hermesHome, "config.yaml");
    const envPath = path.join(hermesHome, ".env");
    const hasConfig = existsSync(configPath);
    const hasEnvFile = existsSync(envPath);

    // Check for configured API keys
    let configuredProviders: string[] = [];
    if (hasEnvFile) {
      const envContent = readFileSync(envPath, "utf-8");
      const keyMap: Record<string, string> = {
        OPENAI_API_KEY: "openai",
        OPENROUTER_API_KEY: "openrouter",
        ANTHROPIC_API_KEY: "anthropic",
        FIREWORKS_API_KEY: "fireworks",
        XAI_API_KEY: "xai",
        GOOGLE_API_KEY: "google",
        DEEPINFRA_API_KEY: "deepinfra",
        TOGETHER_API_KEY: "together",
        GROQ_API_KEY: "groq",
      };
      for (const [envKey, provider] of Object.entries(keyMap)) {
        const regex = new RegExp(`^${envKey}=.+`, "m");
        if (regex.test(envContent) && !envContent.match(new RegExp(`^${envKey}=\\s*$`, "m"))) {
          configuredProviders.push(provider);
        }
      }
    }

    // Check code installation
    const codePath = path.join(hermesHome, "hermes-agent");
    const hasCode = existsSync(codePath);

    // Count skills
    const skillsPath = path.join(hermesHome, "skills");
    let skillsCount = 0;
    if (existsSync(skillsPath)) {
      try {
        skillsCount = readdirSync(skillsPath).filter((d) =>
          !d.startsWith(".") && existsSync(path.join(skillsPath, d, "SKILL.md"))
        ).length;
      } catch {}
    }

    return NextResponse.json({
      success: true,
      installed: hermesVersion !== null,
      version: hermesVersion,
      path: hermesPath,
      hermes_home: hermesHome,
      has_config: hasConfig,
      has_env: hasEnvFile,
      has_code: hasCode,
      configured_providers: configuredProviders,
      providers_count: configuredProviders.length,
      is_ready: hermesVersion !== null && configuredProviders.length > 0,
      skills_count: skillsCount,
      message: hermesVersion
        ? configuredProviders.length > 0
          ? `Hermes ${hermesVersion} ready with ${configuredProviders.length} provider(s)`
          : `Hermes ${hermesVersion} installed but no API key configured`
        : "Hermes not installed",
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      installed: false,
      error: e.message,
    });
  }
}

```

---

## `src/app/api/hermes/chat/route.ts`

> Size: 5.8KB | Lines: 217 | Lang: typescript

```typescript
/**
 * POST /api/hermes/chat
 * بيـ send message لـ Hermes Agent ويرجّع الـ response.
 *
 * Body:
 *   {
 *     "message": "string",       // required — user message
 *     "session_id"?: "string",   // optional — for conversation continuity
 *     "model"?: "string",        // optional — override model
 *     "toolsets"?: "string",     // optional — comma-separated toolsets
 *     "skills"?: "string",       // optional — comma-separated skills
 *   }
 *
 * Response:
 *   {
 *     "success": true,
 *     "response": "string",
 *     "session_id": "string",
 *     "duration_ms": number
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

interface HermesChatRequest {
  message: string;
  session_id?: string;
  model?: string;
  toolsets?: string;
  skills?: string;
  yolo?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: HermesChatRequest = await req.json();
    const { message, session_id, model, toolsets, skills, yolo } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "message required" },
        { status: 400 }
      );
    }

    // Check if Hermes is installed
    if (!existsSync(HERMES_BIN)) {
      return NextResponse.json({
        success: false,
        error: "Hermes Agent not installed. Run the installer first.",
        install_command: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
      }, { status: 503 });
    }

    // Build Hermes CLI arguments
    const args: string[] = ["-z", message];

    // Model override
    if (model) {
      args.push("-m", model);
    }

    // Toolsets
    if (toolsets) {
      args.push("-t", toolsets);
    }

    // Skills
    if (skills) {
      args.push("--skills", skills);
    }

    // YOLO mode (no approval prompts)
    if (yolo) {
      args.push("--yolo");
    }

    // Session resume
    if (session_id) {
      args.push("--resume", session_id);
    }

    // Execute Hermes
    const startTime = Date.now();
    const result = await runHermes(args);

    return NextResponse.json({
      success: result.success,
      response: result.output,
      error: result.error,
      session_id: session_id || `hermes_${Date.now()}`,
      duration_ms: Date.now() - startTime,
      hermes_version: result.version,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

async function runHermes(args: string[], timeoutMs: number = 90000): Promise<{
  success: boolean;
  output: string;
  error?: string;
  version?: string;
}> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      HERMES_HOME,
      PATH: `${HERMES_HOME}/bin:${process.env.PATH}`,
      // Ensure non-interactive mode
      HERMES_NONINTERACTIVE: "1",
      TERM: "dumb",
    };

    const proc = spawn(HERMES_BIN, args, {
      cwd: HERMES_HOME,
      env,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: timeoutMs,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({
        success: false,
        output: "",
        error: `Hermes timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);

      // Extract version from stderr if present
      const versionMatch = stderr.match(/Hermes Agent v([\d.]+)/);
      const version = versionMatch ? versionMatch[1] : undefined;

      if (code === 0) {
        // Clean output — remove ANSI codes and spinner artifacts
        const cleaned = cleanOutput(stdout);
        resolve({
          success: true,
          output: cleaned,
          version,
        });
      } else {
        // Check for common errors
        const errorText = stderr || stdout;
        let errorMsg = `Hermes exited with code ${code}`;

        if (errorText.includes("No inference provider configured")) {
          errorMsg = "Hermes has no API key configured. Set an API key in ~/.hermes/.env (e.g. OPENAI_API_KEY, OPENROUTER_API_KEY, ANTHROPIC_API_KEY)";
        } else if (errorText.includes("rate limit")) {
          errorMsg = "Rate limit hit. Please try again in a moment.";
        } else if (errorText.includes("authentication") || errorText.includes("unauthorized")) {
          errorMsg = "Authentication failed. Check your API key in Hermes config.";
        } else if (errorText.trim()) {
          errorMsg = errorText.slice(-500);
        }

        resolve({
          success: false,
          output: cleanOutput(stdout),
          error: errorMsg,
          version,
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({
        success: false,
        output: "",
        error: `Failed to spawn Hermes: ${e.message}`,
      });
    });
  });
}

function cleanOutput(text: string): string {
  // Remove ANSI escape codes
  let cleaned = text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
  // Remove spinner characters
  cleaned = cleaned.replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/g, "");
  // Remove carriage returns
  cleaned = cleaned.replace(/\r/g, "");
  // Collapse multiple newlines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  // Trim
  return cleaned.trim();
}

```

---

## `src/app/api/hermes/models/route.ts`

> Size: 4.8KB | Lines: 130 | Lang: typescript

```typescript
/**
 * GET /api/hermes/models
 * بيـ رجّع الـ models المتاحة في Hermes Agent.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

// Curated list of popular models per provider
const POPULAR_MODELS: Record<string, Array<{ id: string; name: string; description: string }>> = {
  openai: [
    { id: "openai:gpt-4o", name: "GPT-4o", description: "Most capable OpenAI model" },
    { id: "openai:gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and affordable" },
    { id: "openai:gpt-4-turbo", name: "GPT-4 Turbo", description: "Previous generation flagship" },
  ],
  anthropic: [
    { id: "anthropic:claude-opus-4.6", name: "Claude Opus 4.6", description: "Most capable Anthropic model" },
    { id: "anthropic:claude-sonnet-4", name: "Claude Sonnet 4", description: "Balanced performance" },
    { id: "anthropic:claude-3.5-haiku", name: "Claude 3.5 Haiku", description: "Fast and efficient" },
  ],
  openrouter: [
    { id: "openrouter:anthropic/claude-sonnet-4", name: "Claude Sonnet 4 (OpenRouter)", description: "Via OpenRouter" },
    { id: "openrouter:openai/gpt-4o", name: "GPT-4o (OpenRouter)", description: "Via OpenRouter" },
    { id: "openrouter:google/gemini-pro-1.5", name: "Gemini Pro 1.5 (OpenRouter)", description: "Via OpenRouter" },
    { id: "openrouter:meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", description: "Open source" },
  ],
  fireworks: [
    { id: "fireworks:accounts/fireworks/models/kimi-k2p6", name: "Kimi K2", description: "Fireworks AI" },
    { id: "fireworks:accounts/fireworks/models/glm-5p2", name: "GLM 5.2", description: "Fireworks AI" },
  ],
  xai: [
    { id: "xai:grok-4", name: "Grok 4", description: "xAI's flagship model" },
    { id: "xai:grok-3", name: "Grok 3", description: "Previous generation" },
  ],
  google: [
    { id: "google:gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and capable" },
    { id: "google:gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Most capable" },
  ],
  deepinfra: [
    { id: "deepinfra:meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B", description: "DeepInfra" },
  ],
  groq: [
    { id: "groq:llama-3.3-70b-versatile", name: "Llama 3.3 70B (Groq)", description: "Ultra-fast inference" },
  ],
};

export async function GET() {
  try {
    if (!existsSync(HERMES_BIN)) {
      return NextResponse.json({
        success: false,
        error: "Hermes not installed",
        models: [],
      });
    }

    // Check which providers are configured
    const envPath = path.join(HERMES_HOME, ".env");
    const configuredProviders: string[] = [];

    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, "utf-8");
      const keyMap: Record<string, string> = {
        OPENAI_API_KEY: "openai",
        OPENROUTER_API_KEY: "openrouter",
        ANTHROPIC_API_KEY: "anthropic",
        FIREWORKS_API_KEY: "fireworks",
        XAI_API_KEY: "xai",
        GOOGLE_API_KEY: "google",
        DEEPINFRA_API_KEY: "deepinfra",
        GROQ_API_KEY: "groq",
      };
      for (const [envKey, provider] of Object.entries(keyMap)) {
        const regex = new RegExp(`^${envKey}=.+`, "m");
        if (regex.test(envContent)) {
          configuredProviders.push(provider);
        }
      }
    }

    // Read current model from config
    let currentModel = "anthropic/claude-opus-4.6";
    try {
      const configPath = path.join(HERMES_HOME, "config.yaml");
      if (existsSync(configPath)) {
        const config = readFileSync(configPath, "utf-8");
        const modelMatch = config.match(/default:\s*["']?([^"'\n]+)["']?/);
        if (modelMatch) currentModel = modelMatch[1];
      }
    } catch {}

    // Build models list
    const models: Array<{ provider: string; id: string; name: string; description: string; available: boolean }> = [];
    for (const [provider, providerModels] of Object.entries(POPULAR_MODELS)) {
      const isAvailable = configuredProviders.includes(provider);
      for (const m of providerModels) {
        models.push({
          provider,
          id: m.id,
          name: m.name,
          description: m.description,
          available: isAvailable,
        });
      }
    }

    return NextResponse.json({
      success: true,
      current_model: currentModel,
      configured_providers: configuredProviders,
      models,
      total: models.length,
      available_count: models.filter(m => m.available).length,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      models: [],
    });
  }
}

```

---

## `src/app/api/hermes/skills/route.ts`

> Size: 1.9KB | Lines: 70 | Lang: typescript

```typescript
/**
 * GET /api/hermes/skills
 * بيـ list كل الـ skills المتاحة في Hermes Agent.
 */

import { NextResponse } from "next/server";
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

export async function GET() {
  try {
    const skillsPath = path.join(HERMES_HOME, "skills");
    if (!existsSync(skillsPath)) {
      return NextResponse.json({
        success: true,
        skills: [],
        count: 0,
      });
    }

    const skills: Array<{
      name: string;
      description: string;
      has_skill_md: boolean;
    }> = [];

    const entries = readdirSync(skillsPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
      const skillMdPath = path.join(skillsPath, entry.name, "SKILL.md");
      let description = "";
      if (existsSync(skillMdPath)) {
        try {
          const content = readFileSync(skillMdPath, "utf-8");
          // Extract first meaningful line after title
          const lines = content.split("\n");
          for (const line of lines.slice(1, 10)) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("-")) {
              description = trimmed.slice(0, 200);
              break;
            }
          }
        } catch {}
      }
      skills.push({
        name: entry.name,
        description,
        has_skill_md: existsSync(skillMdPath),
      });
    }

    return NextResponse.json({
      success: true,
      skills: skills.sort((a, b) => a.name.localeCompare(b.name)),
      count: skills.length,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      skills: [],
    });
  }
}

```

---


# 📂 API Routes — Agents

## `src/app/api/agents-list/route.ts`

> Size: 13.9KB | Lines: 374 | Lang: typescript

```typescript
/**
 * GET /api/agents-list
 * بيـ list كل الـ agents المتاحة في المنصة + كل الـ models.
 *
 * V.148: Updated — كل الـ agents (Hermes + Anzaro + Massive + Specialized + Recipes) + 32 models.
 */

import { NextResponse } from "next/server";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { models as PLATFORM_MODELS } from "@/lib/models";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

export interface UnifiedAgent {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  color: string;
  category: "external" | "custom" | "builtin" | "specialized";
  type: "hermes" | "anzaro" | "massive-tools" | "custom" | "specialized" | "recipe";
  available: boolean;
  endpoint: string;
  features?: string[];
  stats?: Record<string, any>;
  config?: Record<string, any>;
}

export async function GET() {
  try {
    const agents: UnifiedAgent[] = [];

    // ── 1. Hermes Agent ──────────────────────────────────
    let hermesVersion: string | null = null;
    let hermesProviders: string[] = [];
    let hermesSkillsCount = 0;

    try {
      const versionOutput = execSync(`${HERMES_BIN} --version 2>&1`, {
        timeout: 10000,
        encoding: "utf-8",
        env: { ...process.env, HERMES_HOME },
      });
      const versionMatch = versionOutput.match(/Hermes Agent v([\d.]+)/);
      hermesVersion = versionMatch ? versionMatch[1] : null;
    } catch {}

    const envPath = path.join(HERMES_HOME, ".env");
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, "utf-8");
      const keyMap: Record<string, string> = {
        OPENAI_API_KEY: "openai",
        OPENROUTER_API_KEY: "openrouter",
        ANTHROPIC_API_KEY: "anthropic",
        FIREWORKS_API_KEY: "fireworks",
        XAI_API_KEY: "xai",
        GOOGLE_API_KEY: "google",
        DEEPINFRA_API_KEY: "deepinfra",
        GROQ_API_KEY: "groq",
      };
      for (const [envKey, provider] of Object.entries(keyMap)) {
        const regex = new RegExp(`^${envKey}=.+`, "m");
        if (regex.test(envContent)) {
          hermesProviders.push(provider);
        }
      }
    }

    const skillsPath = path.join(HERMES_HOME, "skills");
    if (existsSync(skillsPath)) {
      try {
        hermesSkillsCount = readdirSync(skillsPath).filter((d) =>
          !d.startsWith(".") && existsSync(path.join(skillsPath, d, "SKILL.md"))
        ).length;
      } catch {}
    }

    agents.push({
      id: "hermes-agent",
      name: "Hermes Agent",
      nameAr: "هيرمس",
      description: "Self-improving AI agent by NousResearch. Creates skills from experience, searches past conversations, builds user models. 70+ tools, 28 toolsets, 7 terminal backends.",
      descriptionAr: "وكيل ذكاء اصطناعي ذاتي التحسين من NousResearch. ينشئ مهارات من التجربة، يبحث في المحادثات السابقة. 70+ أداة، 28 مجموعة أدوات.",
      icon: "☤",
      color: "from-purple-600 to-indigo-600",
      category: "external",
      type: "hermes",
      available: hermesVersion !== null,
      endpoint: "/api/hermes/chat",
      features: [
        "Self-improving skills",
        "70+ built-in tools",
        "Terminal (7 backends)",
        "Browser automation",
        "Memory & session search",
        "Cron scheduling",
        "Messaging gateway",
        "MCP integration",
      ],
      stats: {
        version: hermesVersion,
        providers: hermesProviders,
        providers_count: hermesProviders.length,
        skills_count: hermesSkillsCount,
        is_ready: hermesVersion !== null && hermesProviders.length > 0,
      },
      config: {
        hermes_home: HERMES_HOME,
        needs_api_key: hermesVersion !== null && hermesProviders.length === 0,
      },
    });

    // ── 2. Anzaro AI (built-in) ──────────────────────────
    agents.push({
      id: "anzaro-ai",
      name: "Anzaro AI",
      nameAr: "أنزارو",
      description: "The built-in Arabic AI assistant with tool-calling capabilities. Supports 67+ agent tools, voice chat, and massive tool registry.",
      descriptionAr: "المساعد الذكي العربي المدمج مع إمكانية استدعاء الأدوات. يدعم 67+ أداة، دردشة صوتية، وسجل أدوات ضخم.",
      icon: "🤖",
      color: "from-emerald-600 to-teal-600",
      category: "builtin",
      type: "anzaro",
      available: true,
      endpoint: "/api/chat/agent",
      features: [
        "67+ agent tools",
        "Arabic-first",
        "Voice chat",
        "Tool execution",
        "Streaming responses",
        "Guest mode",
      ],
      stats: {
        tools: 67,
        type: "zai-powered",
      },
    });

    // ── 3. Massive Tools Agent ───────────────────────────
    let massiveToolsCount = 0;
    let massiveInstalledCount = 0;
    try {
      const response = await fetch("http://localhost:3000/api/massive-tools/stats", {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        massiveToolsCount = data.tools?.total || 0;
        massiveInstalledCount = data.tools?.installed || 0;
      }
    } catch {}

    agents.push({
      id: "massive-tools-agent",
      name: "Massive Tools Agent",
      nameAr: "وكيل الأدوات الضخمة",
      description: "Agent with access to 861K+ tools registry. 73 callable implementations, 40 from GitHub repos, 410 installed packages. Dynamic package caller for any PyPI package.",
      descriptionAr: "وكيل مع وصول لـ 861 ألف+ أداة. 73 تطبيق قابل للاستدعاء، 40 من GitHub، 410 حزم مثبتة.",
      icon: "🛠️",
      color: "from-orange-600 to-red-600",
      category: "builtin",
      type: "massive-tools",
      available: true,
      endpoint: "/api/massive-tools/exec",
      features: [
        "861K+ tools registry",
        "73 callable implementations",
        "40 GitHub-harvested tools",
        "Dynamic package caller",
        "Python + Node.js tools",
        "Real-time execution",
      ],
      stats: {
        total_tools: massiveToolsCount,
        installed: massiveInstalledCount,
        callable: 73,
      },
    });

    // ── 4. Specialized Agents ────────────────────────────
    const specializedAgents = [
      {
        id: "content_creator",
        name: "Content Creator",
        nameAr: "وكيل صناعة المحتوى",
        description: "Specialized agent for content creation — articles, social posts, scripts, marketing copy.",
        icon: "✍️",
        color: "from-pink-600 to-rose-600",
      },
      {
        id: "research_analyst",
        name: "Research Analyst",
        nameAr: "وكيل البحث والتحليل",
        description: "Specialized agent for research and analysis — data gathering, synthesis, insights.",
        icon: "🔬",
        color: "from-cyan-600 to-blue-600",
      },
      {
        id: "developer_helper",
        name: "Developer Helper",
        nameAr: "وكيل مساعدة المطور",
        description: "Specialized agent for development help — code review, debugging, architecture.",
        icon: "💻",
        color: "from-violet-600 to-purple-600",
      },
    ];

    for (const sa of specializedAgents) {
      agents.push({
        id: `specialized-${sa.id}`,
        name: sa.name,
        nameAr: sa.nameAr,
        description: sa.description,
        icon: sa.icon,
        color: sa.color,
        category: "specialized",
        type: "specialized",
        available: true,
        endpoint: "/api/agent/specialized",
        features: [
          "Tool-calling enabled",
          "MCP integration",
          "Streaming responses",
          "Multi-iteration reasoning",
        ],
        stats: {
          agentId: sa.id,
          maxIterations: 8,
        },
      });
    }

    // ── 5. Agent Recipes (10 preset agents) ──────────────
    const recipes = [
      { id: "video-pipeline", name: "Video Pipeline", nameAr: "خط إنتاج الفيديو", icon: "🎬", color: "from-red-600 to-orange-600" },
      { id: "content-marketing", name: "Content Marketing", nameAr: "وكيل التسويق بالمحتوى", icon: "📢", color: "from-amber-600 to-yellow-600" },
      { id: "research-analysis", name: "Research & Analysis", nameAr: "وكيل البحث والتحليل", icon: "📊", color: "from-blue-600 to-indigo-600" },
      { id: "code-review", name: "Code Review", nameAr: "وكيل مراجعة وتطوير الكود", icon: "🔍", color: "from-gray-600 to-slate-600" },
      { id: "email-automation", name: "Email Automation", nameAr: "وكيل أتمتة الإيميلات", icon: "📧", color: "from-green-600 to-emerald-600" },
      { id: "data-analysis", name: "Data Analysis", nameAr: "وكيل تحليل البيانات", icon: "📈", color: "from-purple-600 to-pink-600" },
      { id: "social-media-manager", name: "Social Media Manager", nameAr: "مدير السوشيال ميديا", icon: "📱", color: "from-fuchsia-600 to-pink-600" },
      { id: "customer-support", name: "Customer Support", nameAr: "وكيل دعم العملاء", icon: "🎧", color: "from-teal-600 to-cyan-600" },
      { id: "educational-content", name: "Educational Content", nameAr: "وكيل المحتوى التعليمي", icon: "📚", color: "from-lime-600 to-green-600" },
      { id: "youtube-automation", name: "YouTube Automation", nameAr: "وكيل أتمتة يوتيوب", icon: "▶️", color: "from-red-700 to-rose-700" },
    ];

    for (const r of recipes) {
      agents.push({
        id: `recipe-${r.id}`,
        name: r.name,
        nameAr: r.nameAr,
        description: `Preset agent recipe: ${r.nameAr}. Pre-configured with relevant tools and prompts.`,
        icon: r.icon,
        color: r.color,
        category: "builtin",
        type: "recipe",
        available: true,
        endpoint: "/api/agents/recipes",
        features: [
          "Pre-configured tools",
          "Optimized prompts",
          "One-click setup",
        ],
      });
    }

    // ── 6. Custom Agents from DB ─────────────────────────
    try {
      const { db } = await import("@/lib/db");
      const customAgents = await db.customAgent.findMany({
        where: { isPublic: true },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });

      for (const ca of customAgents) {
        const tools = JSON.parse(ca.toolsJson || "[]");
        const suggestions = ca.suggestionsJson ? JSON.parse(ca.suggestionsJson) : [];
        agents.push({
          id: ca.id,
          name: ca.name,
          nameAr: ca.nameEn || ca.name,
          description: ca.description,
          icon: ca.icon || "🤖",
          color: ca.color || "from-blue-600 to-purple-600",
          category: "custom",
          type: "custom",
          available: true,
          endpoint: "/api/chat/agent",
          features: tools,
          stats: {
            tools: tools.length,
            suggestions: suggestions.length,
          },
        });
      }
    } catch {}

    // ── 7. Platform Models (32 models) ──────────────────
    const platformModels = PLATFORM_MODELS.map(m => ({
      id: m.id,
      name: m.name,
      nameEn: m.nameEn,
      icon: m.icon,
      category: m.category,
      provider: m.provider,
      realChatModel: m.realChatModel,
      maxTokens: m.maxTokens,
      openSource: m.openSource,
      capabilities: {
        chat: m.capabilities.chat,
        vision: m.capabilities.vision,
        imageGeneration: m.capabilities.imageGeneration,
        videoGeneration: m.capabilities.videoGeneration,
        codeGeneration: m.capabilities.codeGeneration,
        webSearch: m.capabilities.webSearch,
        functionCalling: m.capabilities.functionCalling,
        reasoning: m.capabilities.reasoning,
        largeContext: m.capabilities.largeContext,
      },
      skills: m.skills,
    }));

    // ── Summary ──────────────────────────────────────────
    const summary = {
      total_agents: agents.length,
      available_agents: agents.filter(a => a.available).length,
      by_category: {
        external: agents.filter(a => a.category === "external").length,
        builtin: agents.filter(a => a.category === "builtin").length,
        specialized: agents.filter(a => a.category === "specialized").length,
        custom: agents.filter(a => a.category === "custom").length,
      },
      by_type: agents.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      models: {
        total: platformModels.length,
        by_category: platformModels.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_provider: platformModels.reduce((acc, m) => {
          acc[m.provider] = (acc[m.provider] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };

    return NextResponse.json({
      success: true,
      agents,
      models: platformModels,
      summary,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      agents: [],
      models: [],
    });
  }
}

```

---

## `src/app/api/agents/route.ts`

> Size: 5.5KB | Lines: 172 | Lang: typescript

```typescript
/**
 * GET  /api/agents  — قائمة كل الوكلاء المخصصين
 * POST /api/agents  — إنشاء وكيل جديد
 *
 * Body for POST:
 *   {
 *     "name":         string,  // required
 *     "nameEn"?:      string,
 *     "description":  string,  // required
 *     "icon"?:        string,  // default "🤖"
 *     "color"?:       string,  // default gradient
 *     "systemPrompt": string,  // required
 *     "tools":        string[], // required — list of tool names from catalog
 *     "suggestions"?: string[], // example prompts
 *     "category"?:    string,  // default "custom"
 *     "isPublic"?:    boolean  // default false
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AGENT_TOOL_CATALOG, isValidToolName } from "@/lib/agents/catalog";
import { withAuth, type AuthContext } from "@/lib/with-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Valid tool names (curated only — MCP tools validated async below)
const VALID_CURATED_TOOL_NAMES = new Set(AGENT_TOOL_CATALOG.map((t) => t.name));

// ── GET: list all agents ─────────────────────────────────────
export const GET = withAuth(async (req: NextRequest, _ctx) => {
  try {
    const agents = await db.customAgent.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 200,
    });

    // Parse JSON fields
    const parsed = agents.map((a) => ({
      id: a.id,
      name: a.name,
      nameEn: a.nameEn,
      description: a.description,
      icon: a.icon,
      color: a.color,
      systemPrompt: a.systemPrompt,
      tools: JSON.parse(a.toolsJson || "[]") as string[],
      suggestions: a.suggestionsJson ? (JSON.parse(a.suggestionsJson) as string[]) : [],
      category: a.category,
      isPublic: a.isPublic,
      runCount: a.runCount,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));

    return NextResponse.json({ agents: parsed, count: parsed.length });
  } catch (e: any) {
    return NextResponse.json(
      { error: "fetch_failed", message: e.message },
      { status: 500 },
    );
  }
});

// ── POST: create new agent ───────────────────────────────────
export const POST = withAuth(async (req: NextRequest, _ctx) => {
  try {
    const body = await req.json();

    // Validate required fields
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const systemPrompt = String(body.systemPrompt || "").trim();
    const tools: string[] = Array.isArray(body.tools) ? body.tools : [];

    if (!name) {
      return NextResponse.json(
        { error: "missing_name", message: "الاسم مطلوب" },
        { status: 400 },
      );
    }
    if (!description) {
      return NextResponse.json(
        { error: "missing_description", message: "الوصف مطلوب" },
        { status: 400 },
      );
    }
    if (!systemPrompt) {
      return NextResponse.json(
        { error: "missing_system_prompt", message: "system prompt مطلوب" },
        { status: 400 },
      );
    }
    if (tools.length === 0) {
      return NextResponse.json(
        { error: "missing_tools", message: "اختار أداة واحدة على الأقل" },
        { status: 400 },
      );
    }

    // Validate tool names (curated + MCP registry)
    const invalidTools: string[] = [];
    for (const t of tools) {
      if (VALID_CURATED_TOOL_NAMES.has(t)) continue;
      const valid = await isValidToolName(t);
      if (!valid) invalidTools.push(t);
    }
    if (invalidTools.length > 0) {
      return NextResponse.json(
        {
          error: "invalid_tools",
          message: `أدوات غير صالحة: ${invalidTools.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Optional fields with defaults
    const icon = String(body.icon || "🤖").trim().slice(0, 8) || "🤖";
    const color = String(body.color || "from-violet-500 to-fuchsia-500").trim();
    const nameEn = body.nameEn ? String(body.nameEn).trim() : null;
    const category = String(body.category || "custom").trim();
    const isPublic = Boolean(body.isPublic);
    const suggestions: string[] = Array.isArray(body.suggestions)
      ? body.suggestions.map((s: unknown) => String(s).trim()).filter(Boolean).slice(0, 10)
      : [];

    const created = await db.customAgent.create({
      data: {
        name,
        nameEn,
        description,
        icon,
        color,
        systemPrompt,
        toolsJson: JSON.stringify(tools),
        suggestionsJson: suggestions.length > 0 ? JSON.stringify(suggestions) : null,
        category,
        isPublic,
      },
    });

    return NextResponse.json(
      {
        success: true,
        agent: {
          id: created.id,
          name: created.name,
          nameEn: created.nameEn,
          description: created.description,
          icon: created.icon,
          color: created.color,
          systemPrompt: created.systemPrompt,
          tools,
          suggestions,
          category: created.category,
          isPublic: created.isPublic,
          runCount: created.runCount,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "create_failed", message: e.message },
      { status: 500 },
    );
  }
});

```

---

## `src/app/api/agents/recipes/route.ts`

> Size: 4.0KB | Lines: 132 | Lang: typescript

```typescript
/**
 * GET /api/agents/recipes
 * ========================
 * قائمة كل الـ recipes المتاحة (metadata فقط).
 *
 * POST /api/agents/recipes
 * ========================
 * Import recipe كوكيل جديد في الـ DB.
 * Body: { "recipeId": "video_creation" }
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { RECIPES, getRecipeById, recipeToAgent } from "@/lib/agents/recipes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── GET: list recipes ────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    count: RECIPES.length,
    recipes: RECIPES.map((r) => ({
      id: r.id,
      name: r.name,
      nameEn: r.nameEn,
      description: r.description,
      icon: r.icon,
      color: r.color,
      category: r.category,
      tools: r.tools,
      toolsCount: r.tools.length,
      suggestionsCount: r.suggestions.length,
      exampleUseCase: r.exampleUseCase,
    })),
  });
}

// ── POST: import recipe as agent ─────────────────────────────
interface ImportBody {
  recipeId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImportBody;
    const recipeId = String(body.recipeId || "").trim();

    if (!recipeId) {
      return NextResponse.json(
        { error: "missing_recipe_id", message: "recipeId مطلوب" },
        { status: 400 },
      );
    }

    const recipe = getRecipeById(recipeId);
    if (!recipe) {
      return NextResponse.json(
        { error: "recipe_not_found", message: `Recipe "${recipeId}" غير موجود` },
        { status: 404 },
      );
    }

    // Check if this recipe was already imported (by nameEn)
    const existing = await db.customAgent.findFirst({
      where: { nameEn: recipe.nameEn },
    });

    if (existing) {
      // Return the existing agent instead of duplicating
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        agent: {
          id: existing.id,
          name: existing.name,
          nameEn: existing.nameEn,
          description: existing.description,
          icon: existing.icon,
          color: existing.color,
          systemPrompt: existing.systemPrompt,
          tools: JSON.parse(existing.toolsJson || "[]") as string[],
          suggestions: existing.suggestionsJson ? (JSON.parse(existing.suggestionsJson) as string[]) : [],
          category: existing.category,
          isPublic: existing.isPublic,
          runCount: existing.runCount,
        },
        message: `Recipe "${recipe.name}" كان مستورد بالفعل (id: ${existing.id})`,
      });
    }

    // Convert recipe to agent data + save
    const agentData = recipeToAgent(recipe);
    const created = await db.customAgent.create({
      data: {
        name: agentData.name,
        nameEn: agentData.nameEn,
        description: agentData.description,
        icon: agentData.icon,
        color: agentData.color,
        systemPrompt: agentData.systemPrompt,
        toolsJson: JSON.stringify(agentData.tools),
        suggestionsJson: JSON.stringify(agentData.suggestions),
        category: agentData.category,
        isPublic: agentData.isPublic,
      },
    });

    return NextResponse.json({
      success: true,
      agent: {
        id: created.id,
        name: created.name,
        nameEn: created.nameEn,
        description: created.description,
        icon: created.icon,
        color: created.color,
        systemPrompt: created.systemPrompt,
        tools: agentData.tools,
        suggestions: agentData.suggestions,
        category: created.category,
        isPublic: created.isPublic,
      },
      message: `تم استيراد Recipe "${recipe.name}" كوكيل جديد`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "import_failed", message: e.message },
      { status: 500 },
    );
  }
}

```

---

## `src/app/api/agents/[id]/route.ts`

> Size: 6.6KB | Lines: 206 | Lang: typescript

```typescript
/**
 * GET    /api/agents/[id]  — احصل على وكيل واحد
 * PATCH  /api/agents/[id]  — عدّل وكيل
 * DELETE /api/agents/[id]  — احذف وكيل
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AGENT_TOOL_CATALOG, isValidToolName } from "@/lib/agents/catalog";
import { withAuth, type AuthContext } from "@/lib/with-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CURATED_TOOL_NAMES = new Set(AGENT_TOOL_CATALOG.map((t) => t.name));

interface Params {
  params: Promise<{ id: string }>;
}

// ── GET: fetch single agent ──────────────────────────────────
export const GET = withAuth(async (_req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const agent = await db.customAgent.findUnique({ where: { id } });
    if (!agent) {
      return NextResponse.json(
        { error: "not_found", message: "الوكيل غير موجود" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        nameEn: agent.nameEn,
        description: agent.description,
        icon: agent.icon,
        color: agent.color,
        systemPrompt: agent.systemPrompt,
        tools: JSON.parse(agent.toolsJson || "[]") as string[],
        suggestions: agent.suggestionsJson ? (JSON.parse(agent.suggestionsJson) as string[]) : [],
        category: agent.category,
        isPublic: agent.isPublic,
        runCount: agent.runCount,
        createdAt: agent.createdAt,
        updatedAt: agent.updatedAt,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "fetch_failed", message: e.message },
      { status: 500 },
    );
  }
});

// ── PATCH: update agent ──────────────────────────────────────
export const PATCH = withAuth(async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const body = await req.json();

    // Verify exists
    const existing = await db.customAgent.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "not_found", message: "الوكيل غير موجود" },
        { status: 404 },
      );
    }

    // Build update data (only allowed fields)
    const update: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) {
        return NextResponse.json(
          { error: "invalid_name", message: "الاسم ما يقدرش يكون فاضي" },
          { status: 400 },
        );
      }
      update.name = name;
    }
    if (typeof body.description === "string") {
      const description = body.description.trim();
      if (!description) {
        return NextResponse.json(
          { error: "invalid_description", message: "الوصف ما يقدرش يكون فاضي" },
          { status: 400 },
        );
      }
      update.description = description;
    }
    if (typeof body.systemPrompt === "string") {
      const sp = body.systemPrompt.trim();
      if (!sp) {
        return NextResponse.json(
          { error: "invalid_system_prompt", message: "system prompt ما يقدرش يكون فاضي" },
          { status: 400 },
        );
      }
      update.systemPrompt = sp;
    }
    if (typeof body.icon === "string") {
      update.icon = body.icon.trim().slice(0, 8) || "🤖";
    }
    if (typeof body.color === "string") {
      update.color = body.color.trim();
    }
    if (typeof body.nameEn === "string") {
      update.nameEn = body.nameEn.trim() || null;
    }
    if (typeof body.category === "string") {
      update.category = body.category.trim();
    }
    if (typeof body.isPublic === "boolean") {
      update.isPublic = body.isPublic;
    }
    if (Array.isArray(body.tools)) {
      const tools: string[] = body.tools;
      // Validate each tool (curated + MCP registry)
      const invalid: string[] = [];
      for (const t of tools) {
        if (VALID_CURATED_TOOL_NAMES.has(t)) continue;
        const valid = await isValidToolName(t);
        if (!valid) invalid.push(t);
      }
      if (invalid.length > 0) {
        return NextResponse.json(
          {
            error: "invalid_tools",
            message: `أدوات غير صالحة: ${invalid.join(", ")}`,
          },
          { status: 400 },
        );
      }
      if (tools.length === 0) {
        return NextResponse.json(
          { error: "missing_tools", message: "اختار أداة واحدة على الأقل" },
          { status: 400 },
        );
      }
      update.toolsJson = JSON.stringify(tools);
    }
    if (Array.isArray(body.suggestions)) {
      const suggestions = body.suggestions
        .map((s: unknown) => String(s).trim())
        .filter(Boolean)
        .slice(0, 10);
      update.suggestionsJson = suggestions.length > 0 ? JSON.stringify(suggestions) : null;
    }

    const updated = await db.customAgent.update({
      where: { id },
      data: update,
    });

    return NextResponse.json({
      success: true,
      agent: {
        id: updated.id,
        name: updated.name,
        nameEn: updated.nameEn,
        description: updated.description,
        icon: updated.icon,
        color: updated.color,
        systemPrompt: updated.systemPrompt,
        tools: JSON.parse(updated.toolsJson || "[]") as string[],
        suggestions: updated.suggestionsJson ? (JSON.parse(updated.suggestionsJson) as string[]) : [],
        category: updated.category,
        isPublic: updated.isPublic,
        runCount: updated.runCount,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "update_failed", message: e.message },
      { status: 500 },
    );
  }
});

// ── DELETE: remove agent ─────────────────────────────────────
export const DELETE = withAuth(async (_req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const existing = await db.customAgent.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "not_found", message: "الوكيل غير موجود" },
        { status: 404 },
      );
    }
    await db.customAgent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "delete_failed", message: e.message },
      { status: 500 },
    );
  }
});

```

---

## `src/app/api/agents/[id]/run/route.ts`

> Size: 4.0KB | Lines: 134 | Lang: typescript

```typescript
/**
 * POST /api/agents/[id]/run
 * ==========================
 * يشغّل وكيل مخصص على رسالة مستخدم. الـ response SSE stream.
 *
 * Body:
 *   {
 *     "message":  string,                  // required — user message
 *     "history"?: [{role, content}],       // optional — prior conversation
 *     "enableThinking"?: boolean           // default false
 *   }
 *
 * SSE events:
 *   { type: "status", message: string }
 *   { type: "step", step: number }
 *   { type: "token", content: string }
 *   { type: "thinking", content: string }
 *   { type: "tool_start", tool, tool_call_id, args }
 *   { type: "tool_end", tool, tool_call_id, result }
 *   { type: "done", content }
 *   { type: "error", error }
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withAuth, type AuthContext } from "@/lib/with-auth";
import { orchestrateAgent, type AgentRunMessage } from "@/lib/agents/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

interface Params {
  params: Promise<{ id: string }>;
}

export const POST = withAuth(async (req: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;
    const body = await req.json();

    const message = String(body.message || "").trim();
    if (!message) {
      return NextResponse.json(
        { error: "missing_message", message: "message مطلوبة" },
        { status: 400 },
      );
    }

    // Load agent from DB
    const agentRow = await db.customAgent.findUnique({ where: { id } });
    if (!agentRow) {
      return NextResponse.json(
        { error: "not_found", message: "الوكيل غير موجود" },
        { status: 404 },
      );
    }

    const tools = JSON.parse(agentRow.toolsJson || "[]") as string[];
    if (tools.length === 0) {
      return NextResponse.json(
        { error: "no_tools", message: "الوكيل لا يملك أي أدوات" },
        { status: 400 },
      );
    }

    const enableThinking = Boolean(body.enableThinking);

    // Sanitize history
    const history: AgentRunMessage[] = Array.isArray(body.history)
      ? body.history
          .filter((m: any) => m && typeof m.role === "string" && typeof m.content === "string")
          .slice(-20)
          .map((m: any) => ({
            role: m.role,
            content: String(m.content).slice(0, 6000),
          }))
      : [];

    // Build the agent config
    const agentConfig = {
      id: agentRow.id,
      name: agentRow.name,
      systemPrompt: agentRow.systemPrompt,
      tools,
    };

    // Build the messages (history + new user message)
    const messages: AgentRunMessage[] = [
      ...history,
      { role: "user", content: message },
    ];

    // ── Build SSE stream ─────────────────────────────────────
    const encoder = new TextEncoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        // Send agent metadata as first event
        send({
          type: "status",
          message: `🤖 وكيل "${agentRow.name}" بدأ التشغيل...`,
        });

        try {
          await orchestrateAgent(agentConfig, messages, send, { enableThinking });
        } catch (e: any) {
          send({ type: "error", error: e.message || "agent_run_failed" });
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "run_failed", message: e.message },
      { status: 500 },
    );
  }
});

```

---

## `src/app/api/agent/route.ts`

> Size: 2.7KB | Lines: 88 | Lang: typescript

```typescript
/**
 * POST /api/agent
 * body: { message: string, system_prompt?: string, history?: [] }
 *
 * بيستقبل طلب المستخدم، يمرره للـ Agent، ينفذ الـ tool calls، ويرجع النتيجة.
 */

import { NextResponse } from "next/server";
import { runAgent, runAudioWorkflow, type AgentMessage } from "@/lib/agent/agent-engine";
import { getToolsSchema, ALL_AGENT_TOOLS } from "@/lib/agent/custom-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** GET — بيـ رجّع كل الأدوات المتاحة */
export async function GET() {
  const tools = ALL_AGENT_TOOLS.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters,
  }));
  return NextResponse.json({
    success: true,
    tools_count: tools.length,
    tools,
  });
}

/** POST — بيـ run الـ agent */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, system_prompt, history, workflow } = body;

    // ── Audio Workflow ──
    if (workflow === "audio" && body.audio_path) {
      const result = await runAudioWorkflow(body.audio_path);
      return NextResponse.json({
        success: true,
        workflow: "audio_processing",
        result,
      });
    }

    // ── Agent Loop ──
    if (!message) {
      return NextResponse.json(
        { success: false, error: "message required" },
        { status: 400 }
      );
    }

    const toolList = ALL_AGENT_TOOLS.map(t => `- ${t.name}: ${t.description}`).join("\n");
    const defaultSystemPrompt = `أنت Anzaro AI — مساعد ذكي قادر على اتخاذ إجراءات.
لديك أدوات متاحة. استخدمها عند الحاجة لتنفيذ طلبات المستخدم.
لا تقل "لا أستطيع" — استخدم الأدوات المتاحة لتنفيذ الطلب.

الأدوات المتاحة:
${toolList}

قواعد:
1. فكر أولاً: هل يحتاج الطلب لأداة؟
2. لو نعم: استدعي الأداة المناسبة
3. لو لا: أجب مباشرة
4. اشرح ما فعلته بإيجاز بعد تنفيذ الأداة`;

    const result = await runAgent(
      message,
      system_prompt || defaultSystemPrompt,
      (history || []) as AgentMessage[]
    );

    return NextResponse.json({
      success: true,
      response: result.response,
      tool_calls: result.tool_calls_made,
      iterations: result.iterations,
      tools_used: result.tool_calls_made.map(tc => tc.name),
    });
  } catch (e: any) {
    console.error("[Agent API] Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

```

---

## `src/app/api/agent/specialized/route.ts`

> Size: 4.3KB | Lines: 142 | Lang: typescript

```typescript
/**
 * POST /api/agent/specialized
 * ===========================
 * تشغيل وكيل متخصص (Specialized Agent).
 *
 * الـ response SSE stream زي /api/agent بالظبط.
 *
 * Body:
 *   {
 *     "agentId":  string,           // required — content_creator | research_analyst | developer_helper
 *     "message":  string,           // required — user message
 *     "history"?: AgentMessage[],   // optional
 *     "maxIterations"?: number,     // optional — default 8
 *   }
 *
 * Headers:
 *   Authorization: Bearer <token>   // required
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/with-auth";
import { runAgent, type AgentMessage } from "@/lib/mcp/agent-engine";
import { getSpecializedAgent, listSpecializedAgents } from "@/lib/mcp/specialized-agents";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SpecializedRequestBody {
  agentId?: string;
  message?: string;
  history?: AgentMessage[];
  maxIterations?: number;
}

// GET — قائمة الوكلاء المتخصصين
export const GET = withAuth(async () => {
  return NextResponse.json({ agents: listSpecializedAgents() });
});

export const POST = withAuth(async (request: NextRequest) => {
  let body: SpecializedRequestBody;
  try {
    body = (await request.json()) as SpecializedRequestBody;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "الـ body لازم يكون JSON صالح" },
      { status: 400 },
    );
  }

  const agentId = (body.agentId || "").trim();
  const message = (body.message || "").trim();

  if (!agentId) {
    return NextResponse.json(
      { error: "missing_agent_id", message: "agentId مطلوبة" },
      { status: 400 },
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: "missing_message", message: "message مطلوبة" },
      { status: 400 },
    );
  }

  const agent = getSpecializedAgent(agentId);
  if (!agent) {
    return NextResponse.json(
      { error: "unknown_agent", message: `وكيل "${agentId}" غير موجود` },
      { status: 404 },
    );
  }

  const maxIterations = Math.max(1, Math.min(15, Number(body.maxIterations) || 8));

  const history: AgentMessage[] = Array.isArray(body.history)
    ? body.history
        .filter((m) => m && typeof m.role === "string" && typeof m.content === "string")
        .slice(-30)
        .map((m) => ({
          role: m.role,
          content: String(m.content).slice(0, 8000),
          ...(m.tool_call_id ? { tool_call_id: String(m.tool_call_id) } : {}),
          ...(Array.isArray(m.tool_calls) ? { tool_calls: m.tool_calls } : {}),
        }))
    : [];

  // ── Build SSE stream ──
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      // إرسال metadata الوكيل في أول event
      send({
        type: "agent_info",
        agentId: agent.id,
        agentName: agent.nameAr,
        tools: agent.tools,
      });

      try {
        // استخدم الموديل المختار، ولو مش متاح → fallback لـ glm-4-flash
        const { getSelectedModel } = await import("@/lib/model-selection");
        const modelSelection = getSelectedModel({ model: body.model });
        const agentModel = body.model || modelSelection.model;
        const maxTokens = modelSelection.maxTokens;

        for await (const event of runAgent({
          message,
          history,
          toolNames: agent.tools,
          maxIterations,
          model: agentModel,
          maxTokens,
          temperature: 0.7,
          systemPrompt: agent.systemPrompt,
        })) {
          send(event);
        }
      } catch (e: any) {
        send({ type: "error", message: e?.message || "specialized_agent_failed" });
      } finally {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
});

```

---

## `src/app/api/agent/loop/route.ts`

> Size: 2.1KB | Lines: 78 | Lang: typescript

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { runAgentLoop, getAvailableTools, checkCapability, searchGitHubTools, installTool } from '@/lib/autonomous-agent';

/**
 * POST /api/agent/loop
 * 
 * Full autonomous agent loop:
 * 1. Check if agent has capability
 * 2. Search GitHub if missing
 * 3. Install tool
 * 4. Return result with steps
 *
 * Body: { message: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log(`[AgentLoop] Running for: ${message.substring(0, 80)}...`);

    const result = await runAgentLoop(message);

    return NextResponse.json({
      success: true,
      hasCapability: result.capabilityCheck.hasCapability,
      missingTools: result.capabilityCheck.missingTools,
      searchResults: result.searchResults?.map(r => ({
        name: r.name,
        repo: r.repo,
        description: r.description,
        installType: r.installType,
        url: r.url,
      })),
      installedTool: result.installedTool ? {
        name: result.installedTool.toolName,
        success: result.installedTool.success,
        available: result.installedTool.available,
        message: result.installedTool.message,
      } : null,
      finalMessage: result.finalMessage,
      steps: result.steps,
    });
  } catch (error) {
    console.error('[AgentLoop] Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Agent loop failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/agent/loop
 * Returns available tools
 */
export async function GET() {
  try {
    const tools = await getAvailableTools();
    return NextResponse.json({
      success: true,
      tools,
      count: tools.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get tools' },
      { status: 500 }
    );
  }
}

```

---

## `src/app/api/agent/tools/route.ts`

> Size: 1.2KB | Lines: 23 | Lang: typescript

```typescript
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync } from "fs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const pythonPath = existsSync("/app/.venv/bin/python3") ? "/app/.venv/bin/python3" : "python3";
  const code = `import os, json, importlib
SITE = "/home/z/.venv/lib/python3.12/site-packages"
if not os.path.exists(SITE): SITE = "/app/.venv/lib/python3.12/site-packages"
pkgs = [d for d in os.listdir(SITE) if os.path.isdir(os.path.join(SITE, d)) and not d.startswith('_') and not d.endswith('.dist-info')]
print(json.dumps({"packages": len(pkgs), "estimated_tools": len(pkgs) * 95}))`;
  return new Promise((resolve) => {
    const proc = spawn(pythonPath, ["-c", code], { env: { ...process.env, PYTHONPATH: "/home/z/.venv/lib/python3.12/site-packages" } });
    let out = ""; proc.stdout.on("data", d => out += d); proc.stderr.on("data", d => out += d);
    proc.on("close", () => {
      try { const lines = out.split("\n").filter(l => l.startsWith("{")); resolve(NextResponse.json({ success: true, ...JSON.parse(lines[lines.length-1]) })); }
      catch { resolve(NextResponse.json({ success: false, output: out.slice(0,300) })); }
    });
  });
}

```

---

## `src/app/api/chat/agent/route.ts`

> Size: 2.1KB | Lines: 64 | Lang: typescript

```typescript
/**
 * POST /api/chat/agent
 * بيـ ربط الـ chat بالـ Agent — لما المستخدم يكتب، الـ agent بيقرر هل يحتاج أداة ولا لأ
 *
 * body: { message: string, conversationHistory?: [] }
 * response: { response: string, tools_used: [], iterations: number }
 */

import { NextResponse } from "next/server";
import { runAgent, type AgentMessage } from "@/lib/agent/agent-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversationHistory } = body;

    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    // Run agent — it decides whether to call tools
    const result = await runAgent(
      message,
      undefined, // uses default system prompt with tools
      (conversationHistory || []) as AgentMessage[]
    );

    // Build response — compatible with chat UI
    const toolsUsed = result.tool_calls_made.map(tc => tc.name);
    const toolResults = result.tool_calls_made.map(tc => ({
      tool: tc.name,
      args: tc.args,
      result: tc.result.slice(0, 500),
    }));

    // If tools were used, append tool summary to response
    let finalResponse = result.response;
    if (toolsUsed.length > 0 && !finalResponse.includes("✅")) {
      const toolSummary = toolsUsed.map(t => `✅ ${t}`).join("\n");
      finalResponse = `${finalResponse}\n\n---\n**الأدوات المستخدمة:**\n${toolSummary}`;
    }

    return NextResponse.json({
      content: finalResponse,
      response: finalResponse,
      tools_used: toolsUsed,
      tool_calls: toolResults,
      iterations: result.iterations,
      model: "agent-glm-4-flash",
      emotion: "neutral",
      language: "ar",
    });
  } catch (e: any) {
    console.error("[Chat Agent] Error:", e);
    return NextResponse.json(
      { error: e.message, content: "عذراً، حدث خطأ في معالجة طلبك." },
      { status: 500 }
    );
  }
}

```

---

## `src/app/api/ai/agent/route.ts`

> Size: 21.4KB | Lines: 558 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 558)

```typescript
import { NextRequest } from 'next/server';
import { performWebSearch, type WebSearchResult } from '@/lib/chat-utils';
import { generateOpenRouterChat } from '@/lib/openrouter';
import { extractBearerToken, getUserFromToken } from '@/lib/auth';
import { checkRateLimit, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

// ─── Agent Mode API ──────────────────────────────────────────────────
// An autonomous AI agent that breaks down complex tasks into steps
// and executes them sequentially with tool use, streaming results via SSE.
//
// Optimized: Uses OpenRouter fast models instead of slow ZAI SDK.
//   - GPT-4o (openai/gpt-oss-120b:free) for plan, summary, and most tools
//   - Nemotron Reasoning for deep analysis (analyze tool only)
//   - ZAI SDK retained only for web search (performWebSearch)

// ─── Types ────────────────────────────────────────────────────────────
interface AgentStep {
  id: number;
  title: string;
  tool: string;
  input: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: string;
  errorDetail?: string;
}

interface AgentPlan {
  steps: AgentStep[];
  summary: string;
}

type SSEEvent =
  | { type: 'plan'; steps: AgentStep[]; summary: string }
  | { type: 'step_start'; step: AgentStep }
  | { type: 'step_progress'; stepId: number; detail: string }
  | { type: 'step_result'; stepId: number; result: string; tool: string }
  | { type: 'step_error'; stepId: number; message: string }
  | { type: 'complete'; summary: string; steps: AgentStep[] }
  | { type: 'error'; message: string };

// ─── Model Constants ──────────────────────────────────────────────────
const GPT4O_MODEL = 'openai/gpt-oss-120b:free';
const NEMOTRON_REASONING_MODEL = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';

// ─── Token Limits ─────────────────────────────────────────────────────
const TOOL_MAX_TOKENS = 1500;
const SUMMARY_MAX_TOKENS = 1000;

// ─── Timeout ──────────────────────────────────────────────────────────
const TOOL_TIMEOUT_MS = 30_000; // 30 seconds per tool execution

// ─── Tool Definitions ─────────────────────────────────────────────────
const TOOL_DEFINITIONS = `
Available tools:
1. search - بحث على الإنترنت للحصول على معلومات محدثة. المدخل: استعلام البحث.
2. analyze - تحليل البيانات أو النصوص بعمق. المدخل: النص أو البيانات للتحليل.
3. generate_text - توليد محتوى نصي إبداعي أو تقني. المدخل: وصف المحتوى المطلوب.
4. generate_image - وصف مفصل لتوليد صورة. المدخل: وصف الصورة المطلوبة.
5. translate - ترجمة محتوى من لغة إلى أخرى. المدخل: النص ولغة الهدف.
6. summarize - تلخيص محتوى طويل بشكل مختصر. المدخل: النص المراد تلخيصه.
7. code - كتابة كود برمجي. المدخل: وصف الكود المطلوب.
8. calculate - إجراء حسابات رياضية. المدخل: المعادلة أو الحساب.
`;

// ─── Helper: OpenRouter call with timeout ─────────────────────────────
async function callOpenRouterWithTimeout(args: {
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  model: string;
  temperature: number;
  max_tokens: number;
  timeoutMs?: number;
}): Promise<string> {
  const { messages, model, temperature, max_tokens, timeoutMs = TOOL_TIMEOUT_MS } = args;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await generateOpenRouterChat({
      messages,
      model: model as 'openai/gpt-oss-120b:free',
      temperature,
      max_tokens,
    });

    clearTimeout(timeoutId);
    return result.choices?.[0]?.message?.content || '';
  } catch (error) {
    clearTimeout(timeoutId);

    // Check if it was a timeout
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('انتهت مهلة تنفيذ الأداة. يرجى المحاولة مرة أخرى.');
    }
    throw error;
  }
}

// ─── Helper: Execute a Tool ───────────────────────────────────────────
async function executeTool(
  tool: string,
  input: string,
  searchResults: WebSearchResult[]
): Promise<string> {
  switch (tool) {
    case 'search': {
      // Keep ZAI SDK for web search (performWebSearch)
      const results = await performWebSearch(input, 5);
      if (results.length === 0) {
        return 'لم يتم العثور على نتائج بحث.';
      }
      return results
        .map((r, i) => `${i + 1}. ${r.name}: ${r.snippet}`)
        .join('\n');
    }

    case 'analyze': {
      // Use Nemotron Reasoning for deep analysis
      const contextInfo = searchResults.length > 0
        ? `\n\nمعلومات من البحث:\n${searchResults.map((r, i) => `${i + 1}. ${r.name}: ${r.snippet}`).join('\n')}`
        : '';

      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: `أنت محلل بيانات خبير. قم بتحليل المحتوى التالي بشكل عميق ومفصل باللغة العربية. قدّم رؤى واستنتاجات واضحة.${contextInfo}`,
          },
          { role: 'user', content: input },
        ],
        model: NEMOTRON_REASONING_MODEL,
        temperature: 0.3,
        max_tokens: TOOL_MAX_TOKENS,
      });
      return result || 'لم يتم الحصول على نتيجة التحليل.';
    }

    case 'generate_text': {
      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: 'أنت كاتب محتوى محترف. قم بتوليد المحتوى المطلوب باللغة العربية بشكل احترافي ومفصل.',
          },
          { role: 'user', content: input },
        ],
        model: GPT4O_MODEL,
        temperature: 0.7,
        max_tokens: TOOL_MAX_TOKENS,
      });
      return result || 'لم يتم توليد المحتوى.';
    }

    case 'generate_image': {
      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: 'أنت فنان وصفي. قم بوصف الصورة المطلوبة بالتفصيل الكامل باللغة العربية، مع وصف المشهد والألوان والإضاءة والتفاصيل البصرية.',
          },
          { role: 'user', content: input },
        ],
        model: GPT4O_MODEL,
        temperature: 0.7,
        max_tokens: 1024,
      });
      return `🎨 وصف الصورة:\n${result || 'لم يتم توليد وصف الصورة.'}`;
    }

    case 'translate': {
      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: 'أنت مترجم محترف. قم بترجمة النص التالي بدقة مع الحفاظ على المعنى والسياق. أجب بالترجمة فقط.',
          },
          { role: 'user', content: input },
        ],
        model: GPT4O_MODEL,
        temperature: 0.2,
        max_tokens: TOOL_MAX_TOKENS,
      });
      return result || 'لم تتم الترجمة.';
    }

    case 'summarize': {
      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في التلخيص. قم بتلخيص المحتوى التالي بشكل مختصر وشامل باللغة العربية، مع الحفاظ على النقاط الرئيسية.',
          },
          { role: 'user', content: input },
        ],
        model: GPT4O_MODEL,
        temperature: 0.3,
        max_tokens: TOOL_MAX_TOKENS,
      });
      return result || 'لم يتم التلخيص.';
    }

    case 'code': {
      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: 'أنت مبرمج محترف. اكتب الكود المطلوب مع التعليقات التوضيحية. استخدم أفضل الممارسات.',
          },
          { role: 'user', content: input },
        ],
        model: GPT4O_MODEL,
        temperature: 0.2,
        max_tokens: TOOL_MAX_TOKENS,
      });
      return result || 'لم يتم كتابة الكود.';
    }

    case 'calculate': {
      const result = await callOpenRouterWithTimeout({
        messages: [
          {
            role: 'system',
            content: 'أنت حاسبة ذكية. قم بإجراء الحساب التالي واعرض النتيجة مع خطوات الحل باللغة العربية.',
          },
          { role: 'user', content: input },
        ],
        model: GPT4O_MODEL,
        temperature: 0,
        max_tokens: 1024,
      });
      return result || 'لم يتم إجراء الحساب.';
    }

    default:
      return 'أداة غير معروفة.';
  }
}

// ─── POST Handler ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // ── FIX: Add auth + rate limiting to agent endpoint ──
    const authHeader = request.headers.get('Authorization');
    const token = extractBearerToken(authHeader);

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'يجب تسجيل الدخول لاستخدام الوكيل الذكي' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await getUserFromToken(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'يجب تسجيل الدخول لاستخدام الوكيل الذكي' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rateLimitResponse = checkRateLimit(
      request,
      { ...RATE_LIMIT_PRESETS.ai, maxRequests: 10 },
      user.id
    );
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const { task, model, maxSteps: rawMaxSteps } = body as {
      task: string;
      model?: string;
      maxSteps?: number;
    };

    // Validate
    if (!task || typeof task !== 'string' || task.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'يرجى إدخال وصف المهمة' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const maxSteps = Math.min(Math.max(rawMaxSteps || 5, 1), 10);

    // ── SSE Streaming ──
    const encoder = new TextEncoder();
    let streamClosed = false;

    function sendEvent(event: SSEEvent) {
      if (streamClosed) return;
      return `data: ${JSON.stringify(event)}\n\n`;
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // ── Step 1: Plan Generation (GPT-4o) ──
          const planPrompt = `أنت وكيل ذكي يقوم بتحليل المهام وتقسيمها إلى خطوات تنفيذية.

المهمة: ${task}

${TOOL_DEFINITIONS}

قم بإنشاء خطة تنفيذية مفصلة تتضمن ${maxSteps} خطوات كحد أقصى.

أجب بصيغة JSON فقط بالشكل التالي (بدون أي نص إضافي):
{
  "steps": [
    {
      "title": "عنوان الخطوة",
      "tool": "اسم الأداة",
      "input": "المدخل للأداة"
    }
  ],
  "summary": "ملخص الخطة"
}

الأدوات المتاحة: search, analyze, generate_text, generate_image, translate, summarize, code, calculate

قواعد مهمة:
- كل خطوة يجب أن تستخدم أداة واحدة فقط
- الخطوات يجب أن تكون متسلسلة ومنطقية
- ابدأ دائماً بالبحث إذا كانت المهمة تتطلب معلومات محدثة
- استخدم analyze للتحليل العميق
- استخدم generate_text لكتابة المحتوى
- استخدم translate للترجمة
- استخدم summarize للتلخيص
- استخدم code لكتابة الأكواد
- استخدم calculate للحسابات
- استخدم generate_image لوصف الصور
- لا تتجاوز ${maxSteps} خطوات`;

          controller.enqueue(encoder.encode(sendEvent({
            type: 'step_progress',
            stepId: 0,
            detail: 'جاري تحليل المهمة وإنشاء الخطة...',
          })!));

          let planData: AgentPlan;
          try {
            // Use GPT-4o via OpenRouter for plan generation
            const planText = await callOpenRouterWithTimeout({
              messages: [
                { role: 'system', content: planPrompt },
                { role: 'user', content: task },
              ],
              model: GPT4O_MODEL,
              temperature: 0.3,
              max_tokens: TOOL_MAX_TOKENS,
              timeoutMs: TOOL_TIMEOUT_MS,
            });

            // Parse JSON from the response
            let parsed: any;
            try {
              // Try to extract JSON from the response
              const jsonMatch = planText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                parsed = JSON.parse(jsonMatch[0]);
              }
            } catch {
              // If parsing fails, create a default plan
            }

            if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
              planData = {
                steps: parsed.steps.slice(0, maxSteps).map((s: any, i: number) => ({
                  id: i + 1,
                  title: String(s.title || `الخطوة ${i + 1}`),
                  tool: String(s.tool || 'analyze'),
                  input: String(s.input || task),
                  status: 'pending' as const,
                })),
                summary: String(parsed.summary || 'خطة تنفيذية'),
              };
            } else {
              // Fallback: create a simple plan
              planData = {
                steps: [
                  { id: 1, title: 'تحليل المهمة', tool: 'analyze', input: task, status: 'pending' as const },
                  { id: 2, title: 'توليد النتيجة', tool: 'generate_text', input: task, status: 'pending' as const },
                ],
                summary: 'خطة تنفيذية تلقائية',
              };
            }
          } catch (planError) {
            console.error('[Agent] Plan generation error:', planError);
            planData = {
              steps: [
                { id: 1, title: 'تحليل المهمة وتوليد الرد', tool: 'analyze', input: task, status: 'pending' as const },
              ],
              summary: 'خطة مبسطة بسبب خطأ في التخطيط',
            };
          }

          // Send the plan event
          controller.enqueue(encoder.encode(sendEvent({
            type: 'plan',
            steps: planData.steps,
            summary: planData.summary,
          })!));

          // ── Step 2: Execute each step ──
          let allSearchResults: WebSearchResult[] = [];

          for (let i = 0; i < planData.steps.length; i++) {
            if (streamClosed) break;

            const step = planData.steps[i];
            step.status = 'running';

            // Send step_start event
            controller.enqueue(encoder.encode(sendEvent({
              type: 'step_start',
              step,
            })!));

            // Send progress
            controller.enqueue(encoder.encode(sendEvent({
              type: 'step_progress',
              stepId: step.id,
              detail: `جاري تنفيذ: ${step.title} (${step.tool})...`,
            })!));

            try {
              // Execute the tool with a 30-second timeout race
              const resultPromise = executeTool(step.tool, step.input, allSearchResults);

              const timeoutController = new AbortController();
              const timeoutId = setTimeout(() => timeoutController.abort(), TOOL_TIMEOUT_MS);

              let result: string;
              try {
                // Race between tool execution and timeout
                result = await Promise.race([
                  resultPromise,
                  new Promise<never>((_, reject) => {
                    timeoutController.signal.addEventListener('abort', () => {
                      reject(new Error('انتهت مهلة تنفيذ الخطوة (30 ثانية).'));
                    });
                  }),
                ]);
              } finally {
                clearTimeout(timeoutId);
              }

              // If this was a search step, save results for context
              if (step.tool === 'search') {
                try {
                  allSearchResults = await performWebSearch(step.input, 5);
                } catch {
                  // Ignore search caching errors
                }
              }

              step.status = 'completed';
              step.result = result;

              // Send step_result event
              controller.enqueue(encoder.encode(sendEvent({
                type: 'step_result',
                stepId: step.id,
                result,
                tool: step.tool,
              })!));
            } catch (stepError) {
              console.error(`[Agent] Step ${step.id} error:`, stepError);
              const errorMessage = stepError instanceof Error ? stepError.message : 'حدث خطأ أثناء تنفيذ هذه الخطوة.';
              step.status = 'error';
              step.result = errorMessage;
              step.errorDetail = errorMessage;

              controller.enqueue(encoder.encode(sendEvent({
                type: 'step_error',
                stepId: step.id,
                message: errorMessage,
              })!));
            }
          }

          // ── Step 3: Generate final summary (GPT-4o) ──
          if (!streamClosed) {
            const completedSteps = planData.steps.filter((s) => s.status === 'completed');
            const resultsText = completedSteps
              .map((s) => `الخطوة ${s.id} (${s.tool}): ${s.title}\nالنتيجة: ${s.result?.slice(0, 500) || 'لا توجد نتيجة'}`)
              .join('\n\n');

            let finalSummary: string;
            try {
              finalSummary = await callOpenRouterWithTimeout({
                messages: [
                  {
                    role: 'system',
                    content: 'أنت وكيل ذكي. قم بتلخيص نتائج تنفيذ المهمة التالية بشكل شامل ومفيد باللغة العربية. اعرض النتائج بشكل منظم مع النقاط الرئيسية.',
                  },
                  {
                    role: 'user',
                    content: `المهمة: ${task}\n\nنتائج التنفيذ:\n${resultsText}`,
                  },

```

---


# 📂 API Routes — Chat

## `src/app/api/chat/send/route.ts`

> Size: 32.5KB | Lines: 803 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 803)

```typescript
import { NextRequest, NextResponse } from 'next/server';

// maxDuration = 300s — non-streaming chat may run tool chains / long generations.
export const maxDuration = 600; // 10 min for heavy file analysis
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { getUserFromToken, extractBearerToken } from '@/lib/auth';
import { getModelById } from '@/lib/models';
import { CHAT_MODEL_MAP, generateChatCompletion } from '@/lib/pollinations';
import type { PollinationsChatMessage } from '@/lib/pollinations';
import { isGroqChatModel, generateGroqChat, getGroqChatModelMapping } from '@/lib/groq';
import { isGeminiChatModel, generateGeminiChat, getGeminiChatModelMapping } from '@/lib/gemini';
import { isGitHubChatModel, generateGitHubChat, getGitHubChatModelMapping } from '@/lib/github-models';
import { isOpenAIChatModel, generateOpenAIChat, getOpenAIChatModelMapping, OPENAI_API_KEY } from '@/lib/openai';
import { getZAIClient } from '@/lib/chat-utils';
import { buildSystemPrompt, FALLBACK_RESPONSE } from '@/lib/chat/system-prompt-builder';
import { parseFileAttachments, type ParsedAttachment } from '@/lib/chat/attachment-parser';
import { extractTextFromPdfBase64 } from '@/lib/pdf-text-extractor';
import { preprocessMediaAttachments, type ParsedMediaAttachment } from '@/lib/media-preprocessor';
import { classifyContentQuality } from '@/lib/drive-rag';
import { classifyDocIntent } from '@/lib/chat/doc-intent-classifier';
import { getChatModelById, chatWithFallback } from '@/lib/hf-chat.service';

// ─── Fallback Helpers ────────────────────────────────────────────────

type FallbackStep = 'openrouter' | 'pollinations' | 'zhipuai';

interface FallbackContext {
  messages: Array<{ role: string; content: string }>;
  model: string;
  pollinationsEntry: { pollinationsModel: string; label: string } | undefined;
  glmModel: string;
}

/**
 * Executes a primary generation function, falling back through an ordered
 * chain of alternative providers if the primary fails.
 */
async function generateWithFallback(
  primaryFn: () => Promise<string>,
  fallbackChain: FallbackStep[],
  ctx: FallbackContext,
): Promise<string> {
  let content = '';

  try {
    content = await primaryFn();
  } catch (primaryError) {
    console.warn(
      '[ChatSend] Primary provider failed:',
      primaryError instanceof Error ? primaryError.message : String(primaryError),
    );

    for (const step of fallbackChain) {
      if (content) break;

      if (step === 'openrouter') {
        try {
          const { generateOpenRouterChat, getOpenRouterChatModelMapping, OPENROUTER_API_KEY } =
            await import('@/lib/openrouter');
          if (OPENROUTER_API_KEY) {
            const orMapping = getOpenRouterChatModelMapping(ctx.model);
            if (orMapping) {
              const orMessages = ctx.messages.map((m) => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
              }));
              const orResult = await generateOpenRouterChat({
                messages: orMessages as any,
                model: orMapping.openrouterModel as any,
                temperature: 0.7,
                max_tokens: 8192,
              });
              content = orResult.choices?.[0]?.message?.content || '';
            }
          }
        } catch (orError) {
          console.warn(
            '[ChatSend] OpenRouter fallback also failed:',
            orError instanceof Error ? orError.message : String(orError),
          );
        }
      } else if (step === 'pollinations') {
        if (ctx.pollinationsEntry) {
          try {
            const pollinationsMessages: PollinationsChatMessage[] = ctx.messages.map((m) => ({
              role: m.role as 'system' | 'user' | 'assistant',
              content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
            }));
            const result = await generateChatCompletion({
              messages: pollinationsMessages,
              model: ctx.pollinationsEntry.pollinationsModel as any,
              temperature: 0.7,
              max_tokens: 4096,
            });
            content = result.choices?.[0]?.message?.content || '';
          } catch (pollinationsError) {
            console.warn(
              '[ChatSend] Pollinations also failed, falling back to ZhipuAI:',
              pollinationsError instanceof Error ? pollinationsError.message : String(pollinationsError),
            );
          }
        }
      } else if (step === 'zhipuai') {
        try {
          const zai = await getZAIClient();
          const completion = await zai.chat.completions.create({
            model: ctx.glmModel,
            messages: ctx.messages,
            stream: false,
            thinking: { type: 'disabled' },
          });
          content = completion.choices?.[0]?.message?.content || '';
        } catch (sdkError) {
          console.error('SDK non-streaming error (ZhipuAI fallback):', sdkError);
          content = 'أعتذر، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى. 🔄';
        }
      }
    }
  }

  return content;
}

/**
 * Build the messages array for the LLM, handling multimodal content for images.
 * (Consistent with the stream route's buildLLMMessages)
 */
async function buildLLMMessages(
  systemPrompt: string,
  conversationMessages: { role: string; content: string }[],
  userMessage: string,
  parsed: { cleanedMessage: string; attachments: ParsedAttachment[]; hasAttachments: boolean },
  glmModel: string,
  modelConfig: { provider: string; capabilities: { vision: boolean } }
): Promise<Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>> {
  const isVisionModel = glmModel === 'glm-4v' || (modelConfig.provider === 'gemini' && modelConfig.capabilities.vision);
  const imageAttachments = parsed.attachments.filter((a) => a.type === 'image');
  const pdfAttachments = parsed.attachments.filter((a) => a.type === 'pdf');

  let finalUserMessage = parsed.cleanedMessage;

  // For PDFs, extract text and append it
  if (pdfAttachments.length > 0) {
    const pdfTexts = await Promise.all(
      pdfAttachments.map(async (pdf) => {
        const extractedText = await extractTextFromPdfBase64(pdf.content!);
        const contentQuality = classifyContentQuality(extractedText);
        if (contentQuality === 'failed') {
          return `📄 ملف PDF مرفق: ${pdf.name} (${pdf.size})\n⚠️ ${extractedText}\n⚠️ مهم: لا تخترع أي محتوى عن هذا الملف — لم يتم قراءته بنجاح. أخبر المستخدم بذلك بصراحة.`;
        }
        if (contentQuality === 'partial') {
          const firstBracketEnd = extractedText.indexOf(']\n');
          const usableText = firstBracketEnd > 0 ? extractedText.slice(firstBracketEnd + 2).trim() : extractedText;
          return `📄 ملف PDF مرفق: ${pdf.name} (${pdf.size})\n⚠️ محتوى جزئي — بعض الصفحات لم يتم قراءتها بشكل صحيح\n--- محتوى PDF ---\n${usableText}\n--- نهاية المحتوى ---`;
        }
        return `📄 ملف PDF مرفق: ${pdf.name} (${pdf.size})\n--- محتوى PDF ---\n${extractedText}\n--- نهاية المحتوى ---`;
      })
    );
    finalUserMessage = pdfTexts.join('\n\n') + (finalUserMessage ? '\n\n' + finalUserMessage : '');
  }

  // Vision model with images → multimodal content
  if (imageAttachments.length > 0 && isVisionModel) {
    const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];
    if (finalUserMessage) {
      contentParts.push({ type: 'text', text: finalUserMessage });
    }
    for (const img of imageAttachments) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: img.content! },
      });
    }
    return [
      { role: 'system', content: systemPrompt },
      ...conversationMessages,
      { role: 'user', content: contentParts },
    ];
  }

  // Non-vision model with images → media preprocessing fallback
  if (imageAttachments.length > 0 && !isVisionModel) {
    try {
      const mediaAttachments: ParsedMediaAttachment[] = imageAttachments.map((img) => ({
        type: 'image' as const,
        name: img.name,
        size: img.size,
        content: img.content,
      }));
      const preprocessed = await preprocessMediaAttachments(
        mediaAttachments,
        finalUserMessage,
        false,
        'ar'
      );
      if (preprocessed.combinedText.trim()) {
        finalUserMessage = preprocessed.combinedText + (finalUserMessage ? '\n\n' + finalUserMessage : '');
      }
    } catch (mediaPreprocessErr) {
      console.warn('[ChatSend] Media preprocessor failed, using fallback note:', mediaPreprocessErr instanceof Error ? mediaPreprocessErr.message : String(mediaPreprocessErr));
      const imageNote = imageAttachments
        .map((img) => `📷 صورة مرفقة: ${img.name} (${img.size}) - تم إرفاق صورة لكن النموذج الحالي لا يدعم تحليل الصور. يرجى التبديل لنموذج Delta Vision لتحليل الصور.`)
        .join('\n');
      finalUserMessage = imageNote + (finalUserMessage ? '\n\n' + finalUserMessage : '');
    }
  }

  return [
    { role: 'system', content: systemPrompt },
    ...conversationMessages,
    { role: 'user', content: finalUserMessage },
  ];
}

// ─── POST Handler ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, model, language, conversationId, autoSearch, forceSearch, systemPromptMode } = body as {
      message: string;
      model: string;
      language: string;
      conversationId?: string;
      autoSearch?: boolean;
      forceSearch?: boolean;
      systemPromptMode?: 'full' | 'open';
    };

    // Validate required fields
    if (!message || !model) {
      return NextResponse.json(
        { error: 'الرسالة والنموذج مطلوبان' },
        { status: 400 }
      );
    }

    // ── HuggingFace Chat Model Bridge ──
    // When user selects an HF chat model (hf-chat:Model/ID), route directly
    // to the HuggingFace chat service instead of rejecting as "model not found"
    let modelConfig = getModelById(model);
    let isHFDirectModel = false;
    let hfDirectModelId: string | null = null;

    if (!modelConfig && model.startsWith('hf-chat:')) {
      hfDirectModelId = model.slice(8); // Strip 'hf-chat:' prefix
      const hfEntry = getChatModelById(hfDirectModelId);
      if (hfEntry) {
        // Create a synthetic modelConfig for the HF model
        modelConfig = {
          id: model,
          name: hfEntry.name || hfDirectModelId,
          nameEn: hfEntry.shortName || hfDirectModelId,
          icon: '🤗',
          category: 'hf-chat' as any,
          glmModel: 'glm-4-flash',
          provider: 'huggingface',
          realChatModel: hfDirectModelId,
          realImageModel: '',
          realVideoModel: '',
          rank: 'standard',
          description: hfEntry.name || hfDirectModelId,
          descriptionEn: hfEntry.shortName || hfDirectModelId,
          systemPrompt: '',
          hfChatModel: hfDirectModelId,
          supportsPdf: false,
          openSource: true,
          skills: [],
          capabilities: {
            chat: true, vision: false, imageGeneration: false, videoGeneration: false,
            codeGeneration: true, pdfAnalysis: false, webSearch: false, audioTTS: false,
            functionCalling: false, reasoning: false, rag: false, largeContext: false,
            translation: true, summarization: true, maxContextTokens: 8192,
            inputModalities: ['text'], outputModalities: ['text'],
          },
        };
        isHFDirectModel = true;
        console.log(`[ChatSend] HF direct model detected: ${hfDirectModelId} — routing to HuggingFace chat service`);
      }
    }

    // ── Custom Model Bridge (from Aggregator) ──
    let customModelConfig: {
      baseUrl: string;
      apiKey: string | null;
      authType: string;
      authHeader: string | null;
      apiFormat: string;
      modelId: string | null;
    } | null = null;

    if (!modelConfig && model.startsWith('custom:chat:')) {
      const customModelId = model.split(':').slice(2).join(':');
      try {
        const customModel = await db.customModel.findUnique({ where: { id: customModelId } });
        if (customModel && customModel.isActive) {
          modelConfig = {
            id: model,
            name: customModel.name,
            nameEn: customModel.nameEn,
            icon: customModel.icon || '⚡',
            category: 'hf-chat' as any,
            glmModel: 'glm-4-flash',
            provider: 'huggingface',
            realChatModel: customModel.modelId || customModel.nameEn,
            realImageModel: '',
            realVideoModel: '',
            rank: 'standard',
            description: customModel.description || customModel.name,
            descriptionEn: customModel.descriptionEn || customModel.nameEn,
            systemPrompt: '',
            supportsPdf: false,
            openSource: true,
            skills: [],
            capabilities: {
              chat: true, vision: false, imageGeneration: false, videoGeneration: false,
              codeGeneration: true, pdfAnalysis: false, webSearch: false, audioTTS: false,
              functionCalling: false, reasoning: false, rag: false, largeContext: false,
              translation: true, summarization: true, maxContextTokens: 8192,
              inputModalities: ['text'], outputModalities: ['text'],
            },
          };
          isHFDirectModel = true;
          hfDirectModelId = customModel.modelId || customModel.nameEn;
          customModelConfig = {
            baseUrl: customModel.baseUrl,
            apiKey: customModel.apiKey,
            authType: customModel.authType,
            authHeader: customModel.authHeader,
            apiFormat: customModel.apiFormat,
            modelId: customModel.modelId,
          };
          console.log(`[ChatSend] Custom model detected: ${customModel.name} (${customModel.provider})`);
        }
      } catch (err) {
        console.warn('[ChatSend] Failed to load custom model:', err);
      }
    }

    if (!modelConfig) {
      return NextResponse.json(
        { error: 'النموذج غير موجود' },
        { status: 400 }
      );
    }

    // Parse file attachments from the message
    const parsed = await parseFileAttachments(message);

    // Optional auth — guest mode if no token
    const authHeader = request.headers.get('authorization');
    const token = extractBearerToken(authHeader);
    const user = token ? await getUserFromToken(token) : null;

    // ── Enhanced Document Intent Detection ──
    const docIntent = parsed.hasAttachments ? classifyDocIntent(message, true) : classifyDocIntent(message, false);

    // ── Build system prompt using extracted module ──
    // Now uses the same buildSystemPrompt() as the stream route for feature parity:
    // - DB overrides, language suffix, capabilities, time context
    // - Content strategy, design prefs, attachments, emotion
    // - Memory, Drive awareness + RAG, web search
    const promptResult = await buildSystemPrompt({
      model,
      modelConfig,
      language,
      systemPromptMode,
      message,
      parsed,
      user,
      autoSearch,
      forceSearch,
      docIntent,
    });
    const systemPrompt = promptResult.systemPrompt;
    const emotion = promptResult.emotion;

    // ── Ensure we have a valid DB conversation ──
    let dbConversationId: string | null = null;
    let conversationMessages: { role: string; content: string }[] = [];

    if (conversationId && user) {
      try {
        // PERF: Use DB-level pagination instead of loading all messages then truncating
        const existingConv = await db.conversation.findUnique({
          where: { id: conversationId },
          include: {
            messages: {
              where: { role: { not: 'system' } },
              orderBy: { createdAt: 'asc' },
              take: 12,
              // Get the LAST 12 messages by using cursor-based approach
            },
          },
        });

        if (existingConv && existingConv.userId === user.id) {
          dbConversationId = existingConv.id;
          // Apply truncation to prevent context bloat
          conversationMessages = existingConv.messages
            .map((m) => ({ role: m.role, content: m.content.length > 2000 ? m.content.slice(0, 2000) + '...' : m.content }))
            .slice(-12);
        } else {
          console.warn(`[ChatSend] Conversation ${conversationId} not found or not owned by user.`);
        }
      } catch (convError) {
        console.error('[ChatSend] Error loading conversation:', convError);
      }
    }

    // Create conversation in DB if we don't have one yet
    if (!dbConversationId && user) {
      try {
        const newConv = await db.conversation.create({
          data: {
            title: message.slice(0, 60) + (message.length > 60 ? '...' : ''),
            model,
            language: language || 'ar',
            userId: user.id,
          },
        });
        dbConversationId = newConv.id;
      } catch (createError) {
        console.error('[ChatSend] Error creating conversation:', createError);
      }
    }

    // Build messages array for LLM with multimodal support
    const messages = await buildLLMMessages(
      systemPrompt,
      conversationMessages,
      message,
      parsed,
      modelConfig.glmModel,
      modelConfig
    );

    // Get GLM model
    const glmModel = modelConfig.glmModel;

    // ── Save user message to DB (with P2003 retry) ──
    const userMessageForDb = (parsed.cleanedMessage || message).length > 10000
      ? (parsed.cleanedMessage || message).slice(0, 10000) + '...'
      : (parsed.cleanedMessage || message);

    if (dbConversationId && user) {
      try {
        await db.message.create({
          data: {
            content: userMessageForDb,
            role: 'user',
            model,
            emotion,
            language: language || 'ar',
            conversationId: dbConversationId,
            userId: user.id,
          },
        });
      } catch (msgError: any) {
        if (msgError?.code === 'P2003') {
          // FIX: Use user message as title (not assistant content which could be HTML gibberish)
          console.warn('[ChatSend] FK constraint on user message save, creating new conversation');
          try {
            const newConv = await db.conversation.create({
              data: {
                title: message.slice(0, 60) + (message.length > 60 ? '...' : ''),
                model,
                language: language || 'ar',
                userId: user.id,
              },
            });
            dbConversationId = newConv.id;
            await db.message.create({
              data: {
                content: userMessageForDb,
                role: 'user',
                model,
                emotion,
                language: language || 'ar',
                conversationId: dbConversationId,
                userId: user.id,
              },
            });
          } catch (retryError) {
            console.error('[ChatSend] Retry user message save failed:', retryError);
          }
        } else {
          console.error('[ChatSend] Error saving user message:', msgError);
        }
      }
    }

    // Call LLM — route based on modelConfig.provider
    let assistantContent = '';

    const primaryProvider = modelConfig.provider;
    const groqMapping = isGroqChatModel(model) ? getGroqChatModelMapping(model) : null;
    const pollinationsEntry = CHAT_MODEL_MAP[model];

```

---

## `src/app/api/chat/stream/route.ts`

> Size: 259.7KB | Lines: 4671 | Lang: typescript

> ⚠️ File truncated to first 500 lines (total: 4671)

```typescript
import { NextRequest } from 'next/server';

// ─── Route Configuration ────────────────────────────────────────────
// maxDuration = 300s default, 600s (10 min) for high-memory models
// الموديلات اللي context window >= 500K بتحلل ملفات ضخمة → محتاجة وقت أطول
export const maxDuration = 600;
export const dynamic = 'force-dynamic';

// NOTE: The old `export const config = { api: { bodyParser: { sizeLimit: '50mb' } } }`
// was a Pages Router concept and is ignored in App Router (caused a deprecation
// warning). In App Router, request body size is handled by the runtime — large
// bodies (PDF attachments) are read via request.json() which has no artificial cap.

import { db } from '@/lib/db';
import { getUserFromToken, extractBearerToken } from '@/lib/auth';
import { getModelById } from '@/lib/models';
import { recordApiResponseTime, recordError, registerConnection, unregisterConnection } from '@/lib/system-monitor';
import { CHAT_MODEL_MAP, streamChatCompletion } from '@/lib/pollinations';
import type { PollinationsChatMessage } from '@/lib/pollinations';
import { getHFChatModelMapping, streamHFChat } from '@/lib/huggingface';
import { streamHFChatCompletion, chatWithFallback, getChatModelById, HF_API_TOKEN } from '@/lib/hf-chat.service';
import { streamGeminiChat, getGeminiChatModelMapping, GEMINI_API_KEY } from '@/lib/gemini';
import { streamOpenRouterChat, getOpenRouterChatModelMapping, OPENROUTER_API_KEY } from '@/lib/openrouter';
import { generateQuiz, extractTopicFromMessage, buildConversationContext } from '@/lib/quiz-service';
import { streamGroqChat, getGroqChatModelMapping, GROQ_API_KEY } from '@/lib/groq';
import { streamCloudflareChat, getCloudflareChatModelMapping, isCloudflareChatModel, CF_API_TOKEN } from '@/lib/cloudflare-ai';
import { streamGitHubChat, getGitHubChatModelMapping, GITHUB_API_KEY } from '@/lib/github-models';
import { streamCerebrasChat, getCerebrasChatModelMapping, CEREBRAS_API_KEY } from '@/lib/cerebras';
import { streamOpenAIChat, getOpenAIChatModelMapping, isOpenAIChatModel, OPENAI_API_KEY } from '@/lib/openai';
import { classifyContentQuality } from '@/lib/drive-rag';
import { processRAGQuery, uploadAndIndexLectures, hasLectureContext, getLecturesSummary, shouldUseRAG } from '@/lib/rag/rag-engine';
import { shouldInjectContentStrategy } from '@/lib/content-strategy-prompt';
import { isFileGenerationIntent, isQuizIntent, getZAIClient } from '@/lib/chat-utils';
import { extractMemories } from '@/lib/user-memory.service';
import { extractTextFromPdfBase64, extractPdfWithVlmAndText, extractTextFromDocxBase64 } from '@/lib/pdf-text-extractor';
import { preprocessMediaAttachments, type ParsedMediaAttachment } from '@/lib/media-preprocessor';
import { reportSuccess as reportAggregatorSuccess, reportFailure as reportAggregatorFailure } from '@/lib/api-aggregator/reporter';
import { resolveHFModelId } from '@/lib/hf-model-resolve';
import { isModelDisabled } from '@/lib/disabled-models';

// ─── Extracted utilities from @/lib/chat/ ─────────────────────────────
import { isProviderHealthy, markProviderFailed } from '@/lib/chat/provider-health';
import { parseFileAttachments, type ParsedAttachment } from '@/lib/chat/attachment-parser';
import { detectInlineMediaGenIntent } from '@/lib/chat/media-intent';
import { containsHtmlTags, stripHtmlToMarkdown, stripHtmlChunk, markdownToSimpleHTML } from '@/lib/chat/html-sanitizer';
import { FALLBACK_RESPONSE, buildSystemPrompt } from '@/lib/chat/system-prompt-builder';
import { classifyDocIntent, classifyDocIntentWithAI, hasDocIntent, type DocIntent, type DocIntentType } from '@/lib/chat/doc-intent-classifier';
import { processSmartDocV2, type SmartDocV2Input } from '@/lib/chat/smart-doc-v2';

/**
 * Build the messages array for the LLM, handling multimodal content for images.
 */
async function buildLLMMessages(
  systemPrompt: string,
  conversationMessages: { role: string; content: string }[],
  userMessage: string,
  parsed: { cleanedMessage: string; attachments: ParsedAttachment[]; hasAttachments: boolean },
  glmModel: string,
  modelConfig: { provider: string; capabilities: { vision: boolean } }
): Promise<Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>> {
  const isVisionModel = glmModel === 'glm-4v-flash' || glmModel === 'glm-4v' || glmModel === 'glm-4-flash' || (modelConfig.provider === 'gemini' && modelConfig.capabilities.vision) || (modelConfig.provider === 'zhipuai' && modelConfig.capabilities.vision);
  const imageAttachments = parsed.attachments.filter((a) => a.type === 'image');
  const pdfAttachments = parsed.attachments.filter((a) => a.type === 'pdf');
  const docxAttachments = parsed.attachments.filter((a) => a.type === 'docx');

  // Build the user message content
  let finalUserMessage = parsed.cleanedMessage;

  // For PDFs, extract text and append it
  if (pdfAttachments.length > 0) {
    const pdfTexts = await Promise.all(
      pdfAttachments.map(async (pdf) => {
        const extractedText = await extractPdfWithVlmAndText(pdf.content!, pdf.name);
        const contentQuality = classifyContentQuality(extractedText);
        if (contentQuality === 'failed') {
          return `📄 ملف PDF مرفق: ${pdf.name} (${pdf.size})\n⚠️ ${extractedText}\n⚠️ مهم: لا تخترع أي محتوى عن هذا الملف — لم يتم قراءته بنجاح. أخبر المستخدم بذلك بصراحة.`;
        }
        if (contentQuality === 'partial') {
          // Extract usable content after the failure marker
          const firstBracketEnd = extractedText.indexOf(']\n');
          const usableText = firstBracketEnd > 0 ? extractedText.slice(firstBracketEnd + 2).trim() : extractedText;
          return `📄 ملف PDF مرفق: ${pdf.name} (${pdf.size})\n⚠️ محتوى جزئي — بعض الصفحات لم يتم قراءتها بشكل صحيح\n--- محتوى PDF ---\n${usableText}\n--- نهاية المحتوى ---`;
        }
        return `📄 ملف PDF مرفق: ${pdf.name} (${pdf.size})\n--- محتوى PDF ---\n${extractedText}\n--- نهاية المحتوى ---`;
      })
    );
    finalUserMessage = pdfTexts.join('\n\n') + (finalUserMessage ? '\n\n' + finalUserMessage : '');
  }

  // For DOCX (Word) files, extract text via mammoth and append it
  if (docxAttachments.length > 0) {
    const docxTexts = await Promise.all(
      docxAttachments.map(async (docx) => {
        try {
          const extractedText = await extractTextFromDocxBase64(docx.content!, 100 * 1024);
          if (!extractedText || extractedText.length < 10) {
            return `📄 ملف Word مرفق: ${docx.name} (${docx.size})\n⚠️ لم يتم استخراج نص من الملف. أخبر المستخدم بذلك بصراحة.`;
          }
          return `📄 ملف Word مرفق: ${docx.name} (${docx.size})\n--- محتوى الملف ---\n${extractedText}\n--- نهاية المحتوى ---`;
        } catch (err) {
          return `📄 ملف Word مرفق: ${docx.name} (${docx.size})\n⚠️ خطأ في قراءة الملف: ${err instanceof Error ? err.message : String(err)}`;
        }
      })
    );
    finalUserMessage = docxTexts.join('\n\n') + (finalUserMessage ? '\n\n' + finalUserMessage : '');
  }

  // If we have images and a vision model, construct multimodal messages
  if (imageAttachments.length > 0 && isVisionModel) {
    // Build multimodal content array
    const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

    // Add text content first
    if (finalUserMessage) {
      contentParts.push({ type: 'text', text: finalUserMessage });
    }

    // Add each image
    for (const img of imageAttachments) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: img.content! },
      });
    }

    return [
      { role: 'system', content: systemPrompt },
      ...conversationMessages,
      { role: 'user', content: contentParts },
    ];
  }

  // For non-vision models with images, add a text description note
  if (imageAttachments.length > 0 && !isVisionModel) {
    // ── Media Preprocessor: Enhanced media analysis ──
    // If media preprocessing is available, use it for richer content analysis
    // This enables ALL models to understand images, videos, and audio
    // through preprocessing with vision/ASR services.
    try {
      const mediaAttachments: ParsedMediaAttachment[] = imageAttachments.map((img) => ({
        type: 'image' as const,
        name: img.name,
        size: img.size,
        content: img.content,
      }));
      const preprocessed = await preprocessMediaAttachments(
        mediaAttachments,
        finalUserMessage,
        false, // not a vision model
        'ar'
      );
      if (preprocessed.combinedText.trim()) {
        finalUserMessage = preprocessed.combinedText + (finalUserMessage ? '\n\n' + finalUserMessage : '');
      }
    } catch (mediaPreprocessErr) {
      // Fallback: tell the user to switch to a vision model
      console.warn('[Chat] Media preprocessor failed, using fallback note:', mediaPreprocessErr instanceof Error ? mediaPreprocessErr.message : String(mediaPreprocessErr));
      const imageNote = imageAttachments
        .map((img) => `📷 صورة مرفقة: ${img.name} (${img.size}) - تم إرفاق صورة لكن النموذج الحالي لا يدعم تحليل الصور. يرجى التبديل لنموذج Delta Vision لتحليل الصور.`)
        .join('\n');
      finalUserMessage = imageNote + (finalUserMessage ? '\n\n' + finalUserMessage : '');
    }
  }

  // Standard text-only messages
  return [
    { role: 'system', content: systemPrompt },
    ...conversationMessages,
    { role: 'user', content: finalUserMessage },
  ];
}



// ─── POST Handler ────────────────────────────────────────────────────

// V.45: Get user's Google access token for Drive uploads
async function getUserGoogleAccessToken(userId: string): Promise<string | null> {
  try {
    const integration = await db.userIntegration.findFirst({
      where: { userId, provider: 'google' },
      orderBy: { createdAt: 'desc' },
    });
    if (integration?.accessToken) {
      // Check if token is still valid
      if (integration.tokenExpiresAt && integration.tokenExpiresAt > new Date()) {
        return integration.accessToken;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  // ── Rate limiting for chat stream (most resource-intensive endpoint) ──
  const { checkRateLimit, RATE_LIMIT_PRESETS } = await import('@/lib/rate-limit');
  const rateLimitResponse = checkRateLimit(request, RATE_LIMIT_PRESETS.ai);
  if (rateLimitResponse) return rateLimitResponse;

  let connectionId = '';
  try {
    const body = await request.json();
    const { message, model, language, conversationId, autoSearch, forceSearch, systemPromptMode } = body as {
      message: string;
      model: string;
      language: string;
      conversationId?: string;
      autoSearch?: boolean;
      forceSearch?: boolean;
      systemPromptMode?: 'full' | 'open';
    };

    // Validate required fields
    if (!message || !model) {
      return new Response(
        JSON.stringify({ error: 'الرسالة والنموذج مطلوبان' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // V.82: NO MORE REGEX TRIGGERS — the LLM decides everything
    // Removed: QR regex, PPTX regex, XLSX regex, image gen regex
    // The LLM-based capability detector (V.79) handles ALL tool detection now

    // V.82: Disable media gen regex trigger — let the LLM decide
    // The LLM capability detector will handle image/video generation requests
    const mediaGenIntent = null; // V.82: disabled — was detectInlineMediaGenIntent()
    const shouldGenerateImage = false; // V.82: LLM decides
    const shouldGenerateVideo = false; // V.82: LLM decides
    // The LLM analyzes the request and decides if a tool is needed.
    // If the tool is NOT available → search GitHub → install → notify user.
    // This is the TRUE autonomous agent — no regex, the model decides.
    try {
      const { analyzeCapabilityWithLLM } = await import('@/lib/llm-capability-detector');
      const analysis = await analyzeCapabilityWithLLM(message, (language as 'ar' | 'en') || 'ar');

      console.log(`[Chat] V.70 LLM Analysis: needsTool=${analysis.needsSpecialTool}, tool=${analysis.toolName}, hasLocal=${analysis.hasToolLocally}`);

      // V.79: Smart tool + dependency installer with user approval
      // 1. Detect missing tools
      // 2. Ask user for approval (SSE event)
      // 3. Install tool + ALL its dependencies
      // 4. If tool still fails after install → detect missing dependency → install it
      // 5. Only install what's NOT available — never reinstall
      if (analysis.needsSpecialTool && analysis.toolName && !analysis.hasToolLocally) {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);

        // Collect all tool names
        const allToolNames: string[] = [];
        if (analysis.allTools && analysis.allTools.length > 0) {
          for (const t of analysis.allTools) allToolNames.push(t.name);
        } else {
          allToolNames.push(analysis.toolName);
        }

        // V.79: Filter — only tools that are NOT importable
        const stdlibModules = ['os', 'sys', 'json', 're', 'math', 'time', 'datetime', 'pathlib', 'collections', 'itertools', 'functools', 'typing', 'io', 'smtplib', 'zipfile', 'subprocess', 'argparse', 'logging', 'unittest', 'sqlite3', 'hashlib', 'base64', 'urllib', 'http', 'email', 'csv', 'xml', 'html', 'pickle', 'shutil', 'tempfile', 'glob', 'random', 'string', 'textwrap', 'copy', 'enum', 'abc'];

        const toolsToInstall: string[] = [];
        for (const name of allToolNames) {
          const modName = name.replace(/-/g, '_').toLowerCase();
          if (stdlibModules.includes(modName)) continue;
          try {
            const { stdout } = await execAsync(`python3 -c "import ${modName}; print('OK')"`, { timeout: 5_000 });
            if (stdout.includes('OK')) {
              console.log(`[Chat] V.79: ${name} already available — skip`);
              continue;
            }
          } catch {}
          toolsToInstall.push(name);
        }

        if (toolsToInstall.length > 0) {
          const steps: string[] = [];
          steps.push(`🔍 طلبك يحتاج ${toolsToInstall.length} أدوات:`);
          for (const t of toolsToInstall) {
            const toolInfo = analysis.allTools?.find(at => at.name === t);
            steps.push(`   • **${t}** — ${toolInfo?.purpose || 'مطلوبة'}`);
          }
          steps.push('');
          steps.push(`⚠️ **هل توافق على تثبيت هذه الأدوات ومكتباتها؟**`);
          steps.push(`(سيتم تثبيت أي مكتبات إضافية تحتاجها الأدوات تلقائياً)`);

          // V.79: Send approval request via SSE
          const sseResponse = `data: ${JSON.stringify({
            content: steps.join('\n\n'),
            installApproval: {
              tools: toolsToInstall,
              message: 'هل توافق على تثبيت هذه الأدوات؟',
            }
          })}\n\n`;

          let allSuccess = true;

          // V.79: Auto-approve (user can disable in settings later)
          // For now, proceed with install and show every step
          for (const pkgName of toolsToInstall) {
            const moduleName = pkgName.replace(/-/g, '_').toLowerCase();
            console.log(`[Chat] V.79: Installing ${pkgName}...`);

            // V.79: Install with dependencies
            let toolInstalled = false;
            const strategies = [
              { name: 'PyPI', cmd: `pip3 install --break-system-packages ${pkgName}`, verify: `python3 -c "import ${moduleName}; print('OK')"` },
              { name: 'PyPI (underscore)', cmd: `pip3 install --break-system-packages ${moduleName}`, verify: `python3 -c "import ${moduleName}; print('OK')"` },
              { name: 'npm', cmd: `npm install -g ${pkgName}`, verify: `which ${pkgName}` },
              { name: 'apt', cmd: `apt-get install -y ${pkgName} 2>/dev/null || true`, verify: `which ${pkgName}` },
            ];

            for (const s of strategies) {
              try {
                await execAsync(s.cmd, { timeout: 120_000 });
                try {
                  const { stdout: vOut } = await execAsync(s.verify, { timeout: 10_000 });
                  if (vOut.includes('OK') || vOut.trim()) {
                    toolInstalled = true;
                    console.log(`[Chat] V.79: ${pkgName} installed via ${s.name}`);
                    break;
                  }
                } catch {}
              } catch {}
            }

            if (!toolInstalled) {
              // V.79: Try to detect WHAT dependency is missing
              console.log(`[Chat] V.79: ${pkgName} failed — detecting missing dependency...`);
              try {
                const { stderr } = await execAsync(`python3 -c "import ${moduleName}"`, { timeout: 10_000 });
                // Check for "No module named X" in stderr
                const missingMatch = stderr.match(/No module named ['"]([^'"]+)['"]/);
                if (missingMatch) {
                  const missingLib = missingMatch[1];
                  console.log(`[Chat] V.79: Missing dependency detected: ${missingLib} — installing...`);
                  // Install the missing library
                  await execAsync(`pip3 install --break-system-packages ${missingLib}`, { timeout: 120_000 });
                  // Now try the tool again
                  try {
                    const { stdout: vOut2 } = await execAsync(`python3 -c "import ${moduleName}; print('OK')"`, { timeout: 10_000 });
                    if (vOut2.includes('OK')) {
                      toolInstalled = true;
                      console.log(`[Chat] V.79: ${pkgName} works after installing ${missingLib}!`);
                    }
                  } catch {}
                }
              } catch (importErr) {
                // Check error output for missing module
                const errStr = importErr instanceof Error ? importErr.message : String(importErr);
                const missingMatch = errStr.match(/No module named ['"]?([^'"\n]+)/);
                if (missingMatch) {
                  const missingLib = missingMatch[1].replace(/'/g, '');
                  console.log(`[Chat] V.79: Missing dependency: ${missingLib} — installing...`);
                  try {
                    await execAsync(`pip3 install --break-system-packages ${missingLib}`, { timeout: 120_000 });
                    const { stdout: vOut3 } = await execAsync(`python3 -c "import ${moduleName}; print('OK')"`, { timeout: 10_000 });
                    if (vOut3.includes('OK')) {
                      toolInstalled = true;
                      console.log(`[Chat] V.79: ${pkgName} works after installing ${missingLib}!`);
                    }
                  } catch {}
                }
              }
            }

            if (!toolInstalled) {
              allSuccess = false;
            }
          }

          // V.79: Continue to AI — don't block the user
          console.log(`[Chat] V.79: Install complete — success=${allSuccess}, continuing to AI`);
        }
      }
    } catch (v70Err) {
      console.warn('[Chat] V.70 LLM analysis failed (non-fatal):', v70Err instanceof Error ? v70Err.message : String(v70Err));
    }

    // ── MCP Tools Integration ──
    // اكتشف نية المستخدم وشغّل أداة MCP لو محتاجة
    // قبل ما نبعت لـ GLM
    // CRITICAL: Skip MCP detection if message contains image/file attachments
    // because base64 data can contain substrings like "acp" that falsely match
    // MCP tool patterns (e.g., agent-acp), intercepting the message and preventing
    // the image from reaching the vision pipeline.
    const hasEmbeddedAttachments = message.includes('[DELTA_IMAGE:') || message.includes('[DELTA_PDF:') || message.includes('[DELTA_DOCX:');
    
    if (!hasEmbeddedAttachments) {
      try {
        const { detectAndRunMCP, detectAndRunVision } = await import('@/lib/ai-tools/mcp-chat-integration');
        const mcpResult = await detectAndRunMCP(message);

        if (mcpResult.matched && mcpResult.result) {
          console.log(`[Chat] MCP tool matched: ${mcpResult.tool}`);
          const mcpStream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: mcpResult.result })}\n\n`));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            },
          });
          return new Response(mcpStream, {
            headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' },
          });
        }
      } catch (mcpError) {
        console.warn('[Chat] MCP detection failed:', mcpError);
      }
    }

    // ── Smart Ball Command Detection (Reversed Command Control) ──
    // لو المستخدم طلب تشغيل/إيقاف راديو، تحكم في جهاز، أو تفعيل مشهد مزاجي
    // نفّذ الأمر فوراً عبر control-engine وأرجع تأكيد
    if (!hasEmbeddedAttachments) {
      try {
        const { detectSmartBallCommand } = await import('@/lib/anzaro-smart-ball-detector');
        const ballCommand = await detectSmartBallCommand(message);
        if (ballCommand) {
          console.log(`[Chat] Smart Ball command detected: ${ballCommand.type}`);
          const ballStream = new ReadableStream({
            async start(controller) {
              const encoder = new TextEncoder();
              // sink accepts either a string (text content) or an object (structured SSE event)
              const sink = (data: string | Record<string, unknown>) => {
                if (typeof data === 'string') {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: data })}\n\n`));
                } else {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                }
              };
              try {
                await ballCommand.execute(sink);
              } catch (e: any) {
                sink(`\n\n❌ خطأ: ${e.message}`);
              } finally {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                controller.close();
              }
            },
          });
          return new Response(ballStream, {
            headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' },
          });
        }
      } catch (ballError) {
        console.warn('[Chat] Smart Ball detection failed:', ballError);
      }
    }

    // ── Intent Detection (Script Writer + Content Studio) ──
    // لو المستخدم طلب سكريبت أو حزمة محتوى، حوّل للأداة المناسبة
    try {
      const { detectIntent } = await import('@/lib/intent/router');
      const intent = detectIntent(message);
      if (intent.matched && intent.confidence === 'high') {
        console.log(`[Chat] Intent matched: ${intent.tool} — ${intent.contentType} — topic: ${intent.topic}`);

        const isContentStudio = intent.tool === 'content-studio';
        const moduleName = isContentStudio ? '@/lib/content-studio/engine' : '@/lib/scriptwriter/engine';
        const funcName = isContentStudio ? 'generateContentPackage' : 'generateScript';
        const importedModule: any = await import(moduleName);
        const generator = importedModule[funcName];

        const toolStream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            const sink = (event: any) => {
              if (event.type === 'token') {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: event.content })}\n\n`));
              } else if (event.type === 'done') {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              } else if (event.type === 'error') {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: '\n\n❌ خطأ: ' + event.error })}\n\n`));
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
              // status/thinking/studio_done/script_done events silently dropped (HF stream format)
            };
            try {
              await generator({
                topic: intent.topic || message,
                contentType: intent.contentType || 'reel',
                language: 'ar',
              }, sink);
            } catch (e: any) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: '\n\n❌ خطأ: ' + e.message })}\n\n`));
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            } finally {
              controller.close();
            }
          },
        });

        return new Response(toolStream, {
          headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' },
        });
      }
    } catch (intentError) {

```

---

## `src/components/chat/ChatApp.tsx`

> Size: 33.8KB | Lines: 823 | Lang: tsx

> ⚠️ File truncated to first 500 lines (total: 823)

```tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, XCircle, FileText, CheckCircle, XCircle as XIcon, Music, FileAudio } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat-store';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatHeader } from './ChatHeader';
import { ConversationSidebar } from './ConversationSidebar';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { StatusBar } from './StatusBar';
import { IslamicPanel } from './IslamicPanel';
import { BackendTracePanel } from './BackendTracePanel';
import { VoiceBroadcast } from './VoiceBroadcast';
import { FilesPanel } from './FilesPanel';
import { SkillsPanel } from './SkillsPanel';
import { ToolsGallery } from './ToolsGallery';
import { MusicPlayer } from './MusicPlayer';
import { QuizGenerator } from './QuizGenerator';
import { ImageGenDialog } from './ImageGenDialog';
import { VideoGenDialog } from './VideoGenDialog';
import { ImageSearchDialog } from './ImageSearchDialog';
import { SmartBallOverlay } from '@/components/anzaro/SmartBallOverlay';
import { NowPlayingBar } from './NowPlayingBar';
import { AudioTranscriptionPanel } from '@/components/audio/AudioTranscriptionPanel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface ChatAppProps {
  onSwitchToPdfCreator?: () => void;
  onSwitchToAgents?: () => void;
}

export function ChatApp({ onSwitchToPdfCreator, onSwitchToAgents }: ChatAppProps = {}) {
  const { sidebarOpen, setSidebarOpen, sendMessage, setActiveModel, activeModel, quizAutoData, quizGenStatus, quizOpen: storeQuizOpen, quizTopic, setQuizOpen, setQuizAutoData, setQuizGenStatus, setQuizTopic } = useChatStore();
  const isMobile = useIsMobile();
  const [islamicPanelOpen, setIslamicPanelOpen] = useState(false);
  const [tracePanelOpen, setTracePanelOpen] = useState(false);
  const [filesPanelOpen, setFilesPanelOpen] = useState(false);
  const [skillsPanelOpen, setSkillsPanelOpen] = useState(false);
  const [toolsGalleryOpen, setToolsGalleryOpen] = useState(false);
  const [musicPlayerOpen, setMusicPlayerOpen] = useState(false);
  const [audioPanelOpen, setAudioPanelOpen] = useState(false);
  const [broadcastDismissed, setBroadcastDismissed] = useState(false);

  // ── Dialog state for slash commands ──
  const [imageGenOpen, setImageGenOpen] = useState(false);
  const [videoGenOpen, setVideoGenOpen] = useState(false);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);

  // ── Listen for slash-command events from ChatInput ──
  // /صورة → open ImageGenDialog
  useEffect(() => {
    const handler = () => setImageGenOpen(true);
    window.addEventListener('delta-ai-image-gen', handler);
    return () => window.removeEventListener('delta-ai-image-gen', handler);
  }, []);

  // ── Smart Ball quick-action bridge ──
  // When the Smart Ball overlay dispatches a quick-command, forward it to the real chat.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      if (detail && typeof detail === 'string' && detail.trim()) {
        try {
          sendMessage(detail.trim());
        } catch {
          // store may not be ready
        }
      }
    };
    window.addEventListener('anzaro-quick-send', handler);
    return () => window.removeEventListener('anzaro-quick-send', handler);
  }, [sendMessage]);

  // /فيديو → open VideoGenDialog
  useEffect(() => {
    const handler = () => setVideoGenOpen(true);
    window.addEventListener('delta-ai-video-gen', handler);
    return () => window.removeEventListener('delta-ai-video-gen', handler);
  }, []);

  // /بحث → open ImageSearchDialog (web image search)
  useEffect(() => {
    const handler = () => setImageSearchOpen(true);
    window.addEventListener('delta-ai-search', handler);
    return () => window.removeEventListener('delta-ai-search', handler);
  }, []);

  // /كود /مصري /شاعر /طبيب /قانون → switch model
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.model) {
        // setActiveModel is available via the store hook at top of component
        try {
          const { setActiveModel } = useChatStore.getState();
          setActiveModel(detail.model);
        } catch {
          // ignore — store may not be ready
        }
      }
    };
    window.addEventListener('delta-ai-switch-model', handler);
    return () => window.removeEventListener('delta-ai-switch-model', handler);
  }, []);

  // ── /استخراج: extract all laws from files → compile into PDF ──
  // This is the document-memory flow: upload files → generate PDF → show in chat
  const [extractStatus, setExtractStatus] = useState<'idle' | 'uploading' | 'generating' | 'done' | 'error'>('idle');
  const [extractMessage, setExtractMessage] = useState('');
  const [extractPdfUrl, setExtractPdfUrl] = useState<string | null>(null);
  const [extractMemoryId, setExtractMemoryId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingExtractRequest = useRef<string>('');

  const handleExtractFiles = useCallback(async (files: File[], request: string) => {
    const token = useChatStore.getState().token;
    if (!token) {
      setExtractStatus('error');
      setExtractMessage('يجب تسجيل الدخول أولاً');
      return;
    }

    setExtractStatus('uploading');
    setExtractMessage('📂 جاري قراءة الملفات واستخراج المحتوى...');
    setExtractPdfUrl(null);

    try {
      // Step 1: Extract text from each file and upload to document-memory
      const fileData: Array<{ name: string; text?: string; content?: string; type: string }> = [];
      for (const file of files) {
        if (file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf')) {
          // PDF: convert to base64, send to server for extraction
          const arrayBuffer = await file.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          let binary = '';
          for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
          const base64 = btoa(binary);
          fileData.push({ name: file.name, content: `data:application/pdf;base64,${base64}`, type: file.type });
        } else if (file.type.startsWith('text/')) {
          const text = await file.text();
          fileData.push({ name: file.name, text, type: file.type });
        } else {
          // Try as text
          const text = await file.text();
          fileData.push({ name: file.name, text, type: file.type });
        }
      }

      const uploadRes = await fetch('/api/ai/document-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'upload', userRequest: request, files: fileData, language: 'ar' }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || 'Upload failed');

      setExtractMemoryId(uploadData.memoryId);
      setExtractStatus('generating');
      setExtractMessage(`🎨 تم حفظ ${uploadData.fileCount} ملف. جاري التحليل والتوليد...`);

      // Step 2: Generate PDF from memory
      const genRes = await fetch('/api/ai/document-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'generate', memoryId: uploadData.memoryId }),
      });
      const genData = await genRes.json();
      if (!genData.success) throw new Error(genData.error || 'Generation failed');

      setExtractPdfUrl(genData.fileUrl);
      setExtractStatus('done');
      setExtractMessage('✅ تم إنشاء الملف! المحتوى محفوظ في الذاكرة — قيم النتيجة');

      // Add a message to the chat with the PDF link
      const { activeConversationId, addMessage } = useChatStore.getState();
      if (activeConversationId) {
        addMessage(activeConversationId, {
          id: `extract-${Date.now()}`,
          role: 'assistant',
          content: `## ✅ تم استخراج القوانين وإنشاء الملف\n\n📄 **الملف:** ${genData.fileName}\n📊 **حجم الملف:** ${(genData.fileSize / 1024).toFixed(0)} KB\n⏱️ **الوقت:** ${(genData.durationMs / 1000).toFixed(0)} ثانية\n\n👉 [اضغط هنا لفتح المستند](${genData.fileUrl})\n\n---\n💡 المحتوى محفوظ في الذاكرة. هل النتيجة مناسبة؟`,
          model: 'document-memory',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      setExtractStatus('error');
      setExtractMessage(e instanceof Error ? e.message : 'حدث خطأ');
    }
  }, []);

  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const request = detail?.request?.trim();

      // If the user didn't type a request, ask them what they want.
      // No hardcoded default — the model should execute the USER's actual request.
      if (!request) {
        setExtractStatus('error');
        setExtractMessage('اكتب طلبك بعد /استخراج — مثلاً: /استخراج لخّص كل القوانين، أو /استخراج استخرج كل المعادلات، أو أي طلب تاني');
        return;
      }
      pendingExtractRequest.current = request;

      // Trigger the file picker
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
        const onChange = async (ev: Event) => {
          const target = ev.target as HTMLInputElement;
          if (target.files && target.files.length > 0) {
            await handleExtractFiles(Array.from(target.files), pendingExtractRequest.current);
          }
          target.removeEventListener('change', onChange);
        };
        fileInput.addEventListener('change', onChange);
      } else {
        setExtractStatus('error');
        setExtractMessage('لا يمكن العثور على حقل رفع الملفات');
      }
    };
    window.addEventListener('delta-ai-extract-files', handler);
    return () => window.removeEventListener('delta-ai-extract-files', handler);
  }, [handleExtractFiles]);

  // Close sidebar on mobile by default (but don't force-close on desktop)
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, [setSidebarOpen]);

  const handleToggleIslamicPanel = () => {
    setIslamicPanelOpen(!islamicPanelOpen);
  };

  const handleToggleTracePanel = () => {
    setTracePanelOpen(!tracePanelOpen);
  };

  const handleToggleFilesPanel = () => {
    setFilesPanelOpen(!filesPanelOpen);
  };

  const handleToggleSkillsPanel = () => {
    setSkillsPanelOpen(!skillsPanelOpen);
  };

  const handleToggleToolsGallery = () => {
    setToolsGalleryOpen(!toolsGalleryOpen);
  };

  const handleIslamicPrompt = useCallback((prompt: string) => {
    setActiveModel('delta-islamic');
    sendMessage(prompt);
  }, [setActiveModel, sendMessage]);

  // Listen for quiz open event from ChatInput slash commands
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      const topic = detail?.topic || '';
      const autoGenerate = detail?.autoGenerate || false;
      setQuizTopic(topic);
      setQuizOpen(true);

      // If autoGenerate flag is set and topic is provided, generate quiz via API
      if (autoGenerate && topic.trim()) {
        // Show generating status
        setQuizGenStatus('generating');

        (async () => {
          try {
            // Build conversation context from recent messages
            const state = useChatStore.getState();
            const conv = state.conversations.find((c) => c.id === state.activeConversationId);
            const recentMessages = conv?.messages || [];
            const convContext = recentMessages
              .filter((m) => m.role === 'user' || m.role === 'assistant')
              .slice(-10)
              .map((m) => {
                const label = m.role === 'user' ? '\u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645' : '\u0627\u0644\u0645\u0633\u0627\u0639\u062f';
                const content = m.content.length > 1500 ? m.content.slice(0, 1500) + '...' : m.content;
                return `${label}: ${content}`;
              })
              .join('\n\n');

            const response = await fetch('/api/ai/quiz', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                topic: topic.trim(),
                conversationContext: convContext || undefined,
                questionCount: 10,
                difficulty: 'medium',
                types: ['mcq', 'true-false'],
              }),
            });

            if (response.ok) {
              const quizData = await response.json();
              useChatStore.getState().setQuizAutoData({
                ...quizData,
                source: 'chat',
              });
            } else {
              useChatStore.getState().setQuizGenStatus('failed');
            }
          } catch (err) {
            console.error('[Quiz] Auto-generation from slash command failed:', err);
            useChatStore.getState().setQuizGenStatus('failed');
          }
        })();
      }
    };
    window.addEventListener('delta-ai-quiz', handler);
    return () => window.removeEventListener('delta-ai-quiz', handler);
  }, [setQuizOpen, setQuizTopic, setQuizGenStatus]);

  // Auto-open quiz dialog when quizAutoData is set from chat stream
  // and clear the generating status indicator
  useEffect(() => {
    if (quizAutoData) {
      // Always open the quiz dialog when new quiz data arrives from chat
      if (!storeQuizOpen) {
        setQuizOpen(true);
      }
      // Clear the generating status after quiz opens
      setTimeout(() => setQuizGenStatus(null), 500);
    }
  }, [quizAutoData, storeQuizOpen, setQuizOpen, setQuizGenStatus]);

  // Safety timeout: auto-clear quiz "generating" indicator after 60 seconds
  // Prevents the indicator from showing forever if both stream and client-side generation fail
  useEffect(() => {
    if (quizGenStatus === 'generating') {
      const timer = setTimeout(() => {
        const state = useChatStore.getState();
        if (state.quizGenStatus === 'generating' && !state.quizAutoData) {
          console.warn('[Quiz] Safety timeout: clearing stuck generating indicator');
          useChatStore.getState().setQuizGenStatus('failed');
        }
      }, 60_000);
      return () => clearTimeout(timer);
    }
  }, [quizGenStatus]);

  return (
    <div className="flex h-screen overflow-hidden relative bg-background" dir="rtl">
      {/* iOS-style flat background — no aurora orbs, clean and minimal */}

      {/* Desktop Conversation Sidebar */}
      {!isMobile && (
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-shrink-0 border-l border-border overflow-hidden relative z-10 bg-card"
            >
              <div className="w-[320px] h-full">
                <ConversationSidebar onToggleFilesPanel={handleToggleFilesPanel} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* Conversation Sidebar — works on BOTH mobile and desktop */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="right" className="p-0 w-[300px] max-w-[85vw] card border-border" dir="rtl">
          <SheetHeader className="sr-only">
            <SheetTitle>المحادثات</SheetTitle>
            <SheetDescription>قائمة المحادثات</SheetDescription>
          </SheetHeader>
          <ConversationSidebar onToggleFilesPanel={handleToggleFilesPanel} />
        </SheetContent>
      </Sheet>

      {/* Desktop Files Panel (Left side in RTL) */}
      {!isMobile && (
        <AnimatePresence initial={false}>
          {filesPanelOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-shrink-0 border-r border-border overflow-hidden relative z-10 bg-card"
            >
              <div className="w-[300px] h-full">
                <FilesPanel onClose={() => setFilesPanelOpen(false)} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Files Panel - Sheet */}
      {isMobile && (
        <Sheet open={filesPanelOpen} onOpenChange={setFilesPanelOpen}>
          <SheetContent side="left" className="p-0 w-[300px] card border-border" dir="rtl">
            <SheetHeader className="sr-only">
              <SheetTitle>ملفاتي</SheetTitle>
              <SheetDescription>الملفات المُنشأة</SheetDescription>
            </SheetHeader>
            <FilesPanel onClose={() => setFilesPanelOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 bg-background">
        {/* Voice Broadcast Bar */}
        <VoiceBroadcast />

        {/* Header */}
        <ChatHeader
          onToggleSidebar={handleToggleSidebar}
          onToggleFilesPanel={handleToggleFilesPanel}
          onToggleSkillsPanel={handleToggleSkillsPanel}
          skillsPanelOpen={skillsPanelOpen}
          onToggleToolsGallery={handleToggleToolsGallery}
          toolsGalleryOpen={toolsGalleryOpen}
          onSwitchToPdfCreator={onSwitchToPdfCreator}
          onSwitchToAgents={onSwitchToAgents}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <MessageList />
        </div>

        {/* Input Area */}
        <ChatInput />

        {/* Status Bar */}
        <StatusBar />
      </div>

      {/* Quiz Generator Dialog */}
      <QuizGenerator
        open={storeQuizOpen}
        onOpenChange={(isOpen) => {
          setQuizOpen(isOpen);
          // Clear auto-quiz data and topic immediately when dialog closes to prevent re-triggering
          if (!isOpen) {
            setQuizAutoData(null);
            setQuizTopic('');
          }
        }}
        autoQuizData={quizAutoData}
        initialTopic={quizTopic}
      />

      {/* Image Generation Dialog (triggered by /صورة) */}
      <ImageGenDialog open={imageGenOpen} onOpenChange={setImageGenOpen} />

      {/* Video Generation Dialog (triggered by /فيديو) */}
      <VideoGenDialog open={videoGenOpen} onOpenChange={setVideoGenOpen} />

      {/* Image Search Dialog (triggered by /بحث) */}
      <ImageSearchDialog open={imageSearchOpen} onOpenChange={setImageSearchOpen} />

      {/* Extract Files Indicator (triggered by /استخراج) */}
      {extractStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 px-6 py-4 rounded-2xl shadow-xl bg-card border border-border max-w-md"
          dir="rtl"
        >
          <div className="flex items-center gap-3">
            {extractStatus === 'uploading' || extractStatus === 'generating' ? (
              <Loader2 className="size-5 animate-spin text-blue-500" />
            ) : extractStatus === 'done' ? (
              <CheckCircle className="size-5 text-blue-500" />
            ) : (
              <XIcon className="size-5 text-red-500" />
            )}
            <span className="text-sm font-medium">{extractMessage}</span>
          </div>

```

---

## `src/components/chat/ChatHeader.tsx`

> Size: 42.9KB | Lines: 837 | Lang: tsx

> ⚠️ File truncated to first 500 lines (total: 837)

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Menu,
  ChevronDown,
  Settings,
  Shield,
  LogOut,
  User,
  Moon,
  Sun,
  Monitor,
  MoreVertical,
  Languages,
  Share2,
  FileText,
  Sparkles,
  Search,
  Globe,
  Radio,
  Swords,
  Brain,
  BarChart3,
  Code2,
  GitBranch,
  Headphones,
  Bot,
  Activity,
  Trophy,
  Mic,
  Zap,
  Plug,
  Github,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useChatStore } from '@/store/chat-store';
import { useSmartBallStore } from '@/lib/smart-ball-store';
import { useAuthStore } from '@/store/auth-store';
import { getModelById } from '@/lib/models';
import { ModelSelector } from './ModelSelector';
import AdminDashboard from './AdminDashboard';
import { SettingsDialog } from './SettingsDialog';
import { TranslationDialog } from './TranslationDialog';
import { ShareDialog } from './ShareDialog';
import { UserProfileModal } from './UserProfileModal';
import { ImageEditDialog } from './ImageEditDialog';
import { ImageSearchDialog } from './ImageSearchDialog';
import { PageReaderDialog } from './PageReaderDialog';
import { DocumentGenDialog } from './DocumentGenDialog';
import { IntegrationDashboard } from './IntegrationDashboard';
import { AIMediaGenerator } from './AIMediaGenerator';
import { RadioPlayer } from './RadioPlayer';
import { ModelArena } from './ModelArena';
import { UserMemoryPanel } from './UserMemoryPanel';
import { DataAnalysisPanel } from './DataAnalysisPanel';
import { CodeSandbox } from './CodeSandbox';
import { MindMapViewer } from './MindMapViewer';
import { PodcastStudio } from './PodcastStudio';
import { AgentMode } from './AgentMode';
import { SpecializedAgentsHub } from './SpecializedAgentsHub';
import { AgentBuilder } from '@/components/agents/AgentBuilder';
import { JobsMonitor } from '@/components/agents/JobsMonitor';
import { GamificationPanel } from './GamificationPanel';
import { VoiceChatOverlay } from './VoiceChatOverlay';
import { ToolsHub } from '@/components/tools/ToolsHub';
import { SkillsHub } from '@/components/skills/SkillsHub';
import { GitHubSkillHub } from './GitHubSkillHub';
import { GitHubToolHub } from './GitHubToolHub';
import { MassiveToolsPanel } from './MassiveToolsPanel';
import { AnzaroAppLauncher } from './AnzaroAppLauncher';
import { AIToolsHub } from '@/components/ai-tools/AIToolsHub';
import { MCPHub } from '@/components/ai-tools/MCPHub';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Package, Wrench, Bell, Youtube, BookOpen, Boxes } from 'lucide-react';
import { IOSThemeToggle } from '@/components/ui/ios-theme-toggle';
import { RemindersPanel } from './RemindersPanel';
import { YouTubeAnalyzer } from './YouTubeAnalyzer';
import { KnowledgeBasePanel } from './KnowledgeBasePanel';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  onToggleFilesPanel?: () => void;
  onToggleSkillsPanel?: () => void;
  skillsPanelOpen?: boolean;
  onToggleToolsGallery?: () => void;
  toolsGalleryOpen?: boolean;
  onSwitchToPdfCreator?: () => void;
  onSwitchToAgents?: () => void;
}

export function ChatHeader({ onToggleSidebar, onToggleFilesPanel, onToggleSkillsPanel, skillsPanelOpen, onToggleToolsGallery, toolsGalleryOpen, onSwitchToPdfCreator, onSwitchToAgents }: ChatHeaderProps) {
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [toolsHubOpen, setToolsHubOpen] = useState(false);
  const [skillsHubOpen, setSkillsHubOpen] = useState(false);
  const [gitHubHubOpen, setGitHubHubOpen] = useState(false);
  const [gitHubToolOpen, setGitHubToolOpen] = useState(false);
  const [massiveToolsOpen, setMassiveToolsOpen] = useState(false);
  const [appLauncherOpen, setAppLauncherOpen] = useState(false);
  const [aiToolsOpen, setAiToolsOpen] = useState(false);
  const [mcpHubOpen, setMcpHubOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [translationOpen, setTranslationOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imageEditOpen, setImageEditOpen] = useState(false);
  const [imageSearchOpen, setImageSearchOpen] = useState(false);
  const [pageReaderOpen, setPageReaderOpen] = useState(false);
  const [documentGenOpen, setDocumentGenOpen] = useState(false);
  const [documentGenPrompt, setDocumentGenPrompt] = useState('');
  const [documentGenMode, setDocumentGenMode] = useState<'single' | 'batch'>('single');
  const [documentGenIsMyFiles, setDocumentGenIsMyFiles] = useState(false);
  const [aiMediaGenOpen, setAiMediaGenOpen] = useState(false);
  const [aiMediaGenPrompt, setAiMediaGenPrompt] = useState('');
  const [aiMediaGenTab, setAiMediaGenTab] = useState<'image' | 'video'>('image');
  const [radioOpen, setRadioOpen] = useState(false);
  const [arenaOpen, setArenaOpen] = useState(false);
  const [codeSandboxOpen, setCodeSandboxOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [dataAnalysisOpen, setDataAnalysisOpen] = useState(false);
  const [mindmapOpen, setMindmapOpen] = useState(false);
  const [mindmapTopic, setMindmapTopic] = useState('');
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [podcastContent, setPodcastContent] = useState('');
  const [agentModeOpen, setAgentModeOpen] = useState(false);
  const [agentModeTask, setAgentModeTask] = useState('');
  const [specializedAgentsOpen, setSpecializedAgentsOpen] = useState(false);
  const [agentBuilderOpen, setAgentBuilderOpen] = useState(false);
  const [jobsMonitorOpen, setJobsMonitorOpen] = useState(false);
  const [gamificationOpen, setGamificationOpen] = useState(false);
  const [voiceChatOpen, setVoiceChatOpen] = useState(false);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [youtubeAnalyzerOpen, setYoutubeAnalyzerOpen] = useState(false);
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(false);
  const { activeModel, sendMessage, systemPromptMode, setSystemPromptMode } = useChatStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useTheme();

  // Listen for AI Media Generator events from ChatInput
  useEffect(() => {
    const handleMediaGen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setAiMediaGenPrompt(detail.prompt || '');
        setAiMediaGenTab(detail.tab || 'image');
        setAiMediaGenOpen(true);
      }
    };
    window.addEventListener('delta-ai-media-gen', handleMediaGen);
    return () => window.removeEventListener('delta-ai-media-gen', handleMediaGen);
  }, []);

  // Listen for Document Generation events from ChatInput
  useEffect(() => {
    const handleDocGen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setDocumentGenPrompt(detail.prompt || '');
        setDocumentGenMode(detail.mode || 'single');
        setDocumentGenIsMyFiles(!!detail.isMyFiles);
        setDocumentGenOpen(true);
      }
    };
    window.addEventListener('delta-ai-doc-gen', handleDocGen);
    return () => window.removeEventListener('delta-ai-doc-gen', handleDocGen);
  }, []);

  // Listen for Data Analysis events from ChatInput
  useEffect(() => {
    const handleDataAnalysis = () => {
      setDataAnalysisOpen(true);
    };
    window.addEventListener('delta-ai-data-analysis', handleDataAnalysis);
    return () => window.removeEventListener('delta-ai-data-analysis', handleDataAnalysis);
  }, []);

  // Listen for Code Sandbox events from ChatInput
  useEffect(() => {
    const handleCodeSandbox = () => {
      setCodeSandboxOpen(true);
    };
    window.addEventListener('delta-ai-code-sandbox', handleCodeSandbox);
    return () => window.removeEventListener('delta-ai-code-sandbox', handleCodeSandbox);
  }, []);

  // Listen for MindMap events from ChatInput
  useEffect(() => {
    const handleMindmap = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setMindmapTopic(detail.topic || '');
      }
      setMindmapOpen(true);
    };
    window.addEventListener('delta-ai-mindmap', handleMindmap);
    return () => window.removeEventListener('delta-ai-mindmap', handleMindmap);
  }, []);

  // Listen for Podcast events from ChatInput
  useEffect(() => {
    const handlePodcast = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setPodcastContent(detail.content || '');
      }
      setPodcastOpen(true);
    };
    window.addEventListener('delta-ai-podcast', handlePodcast);
    return () => window.removeEventListener('delta-ai-podcast', handlePodcast);
  }, []);

  // Listen for Agent Mode events from ChatInput
  useEffect(() => {
    const handleAgentMode = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setAgentModeTask(detail.task || '');
      }
      setAgentModeOpen(true);
    };
    window.addEventListener('delta-ai-agent', handleAgentMode);
    return () => window.removeEventListener('delta-ai-agent', handleAgentMode);
  }, []);

  // Listen for Gamification events from ChatInput
  useEffect(() => {
    const handleGamification = () => {
      setGamificationOpen(true);
    };
    window.addEventListener('delta-ai-gamification', handleGamification);
    return () => window.removeEventListener('delta-ai-gamification', handleGamification);
  }, []);

  // Listen for Voice Chat events from ChatInput
  useEffect(() => {
    const handleVoiceChat = () => {
      setVoiceChatOpen(true);
    };
    window.addEventListener('delta-ai-voice-chat', handleVoiceChat);
    return () => window.removeEventListener('delta-ai-voice-chat', handleVoiceChat);
  }, []);

  const currentModel = getModelById(activeModel) ?? (() => {
    // لو الموديل مش في الـ static list → ممكن يكون HF custom model (hf-chat:xxx)
    if (activeModel?.startsWith('hf-chat:')) {
      const hfId = activeModel.slice(8);
      return {
        id: activeModel,
        name: hfId.split('/').pop()?.replace(/-/g, ' ').slice(0, 20) || 'HF Model',
        nameEn: hfId,
        icon: '🤗',
        category: 'hf-chat' as const,
        provider: 'huggingface' as const,
        description: 'موديل HuggingFace',
        descriptionEn: 'HuggingFace Model',
        capabilities: { vision: false, functionCalling: false, streaming: true },
        maxTokens: 8192,
        realChatModel: hfId,
        hfChatModel: hfId,
        isCustom: true,
      };
    }
    return null;
  })();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '👤';
    return name.slice(0, 2);
  };

  return (
    <>
      <header className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sticky top-0 z-40 transition-all">
        {/* Gemini Two-line Hamburger Menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="min-h-[40px] min-w-[40px] flex-shrink-0 text-foreground hover:bg-muted rounded-full transition-all ios-pressable"
          aria-label="القائمة"
        >
          {/* Two-line hamburger icon (Gemini style) */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M3 14H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </Button>

        {/* Model Selector — Gemini clean text pill */}
        <button
          onClick={() => setModelSelectorOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted transition-all min-h-[36px] flex-shrink-0 ios-pressable"
          aria-label="تغيير النموذج"
        >
          {currentModel && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-medium text-foreground leading-tight">
                  {currentModel.name}
                </span>
                {systemPromptMode === 'open' && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[hsl(var(--chart-3))]/15 text-[9px] font-semibold text-[hsl(var(--chart-3))] leading-none">
                    <Zap className="size-2" />
                    مفتوح
                  </span>
                )}
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </>
          )}
        </button>

        {/* Smart Ball status pill — shows ball state + personality type */}
        <SmartBallStatusPill />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Gemini Theme Toggle — desktop segmented control */}
        <div className="hidden sm:block">
          <IOSThemeToggle compact />
        </div>

        {/* Compact theme toggle on mobile */}
        <button
          onClick={() => {
            if (theme === 'light') setTheme('dark');
            else if (theme === 'dark') setTheme('system');
            else setTheme('light');
          }}
          className="sm:hidden flex items-center justify-center size-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all ios-pressable"
          aria-label="تبديل المظهر"
        >
          {theme === 'light' ? (
            <Sun className="size-5" />
          ) : theme === 'dark' ? (
            <Moon className="size-5" />
          ) : (
            <Monitor className="size-5" />
          )}
        </button>

        {/* More Tools — Gemini-style dropdown */}
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center size-10 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all ios-pressable"
              aria-label="المزيد"
            >
              <MoreVertical className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150 border border-white/40 dark:border-white/10 ring-1 ring-black/[0.03] dark:ring-white/[0.04] rounded-2xl p-1.5 shadow-2xl shadow-blue-900/20 dark:shadow-blue-950/40 max-h-[75vh] overflow-y-auto gemini-dropdown-scroll z-[100]"
          >
            {/* ── System Prompt Mode ── */}
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2.5 min-h-[40px] rounded-[10px] px-2.5 text-[14px] hover:bg-muted"
              onClick={() => setSystemPromptMode(systemPromptMode === 'full' ? 'open' : 'full')}
            >
              <Zap className="size-4 text-muted-foreground" />
              <span className={cn(systemPromptMode === 'open' && 'font-semibold')}>
                {systemPromptMode === 'open' ? 'وضع مفتوح ✓' : 'وضع مفتوح'}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-border/60" />

            {/* ── Category: AI Tools ── */}
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">أدوات الذكاء الاصطناعي</p>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setDataAnalysisOpen(true)}>
              <BarChart3 className="size-4 ml-2.5" />
              <span>تحليل البيانات</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setMindmapOpen(true)}>
              <GitBranch className="size-4 ml-2.5" />
              <span>خريطة ذهنية</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setPodcastOpen(true)}>
              <Headphones className="size-4 ml-2.5" />
              <span>بودكاست</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setArenaOpen(true)}>
              <Swords className="size-4 ml-2.5" />
              <span>حلبة النماذج</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setCodeSandboxOpen(true)}>
              <Code2 className="size-4 ml-2.5" />
              <span>صندوق الأكواد</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => { setAiMediaGenPrompt(''); setAiMediaGenTab('image'); setAiMediaGenOpen(true); }}>
              <Sparkles className="size-4 ml-2.5" />
              <span>مولد الوسائط</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-border/60" />

            {/* ── Category: Agents ── */}
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">الوكلاء</p>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setVoiceChatOpen(true)}>
              <Mic className="size-4 ml-2.5" />
              <span>دردشة صوتية</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setAgentModeOpen(true)}>
              <Bot className="size-4 ml-2.5" />
              <span>وضع الوكيل</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setSpecializedAgentsOpen(true)}>
              <Sparkles className="size-4 ml-2.5" />
              <span>الوكلاء المتخصصون</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setAgentBuilderOpen(true)}>
              <Bot className="size-4 ml-2.5" />
              <span>استوديو بناء الوكلاء</span>
            </DropdownMenuItem>
            {onSwitchToAgents && (
              <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-900 dark:hover:text-purple-100 transition-colors duration-150 rounded-lg px-2.5" onClick={onSwitchToAgents}>
                <Bot className="size-4 ml-2.5" />
                <span>🤖 مركز الوكلاء (Hermes + Anzaro)</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setJobsMonitorOpen(true)}>
              <Activity className="size-4 ml-2.5" />
              <span>مراقب المهام</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-border/60" />

            {/* ── Category: Utilities ── */}
            <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">أدوات مساعدة</p>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setToolsHubOpen(true)}>
              <Package className="size-4 ml-2.5" />
              <span>مركز الأدوات</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setSkillsHubOpen(true)}>
              <Brain className="size-4 ml-2.5" />
              <span>المهارات</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setGitHubHubOpen(true)}>
              <Github className="size-4 ml-2.5" />
              <span>GitHub Skill Hub</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setGitHubToolOpen(true)}>
              <Github className="size-4 ml-2.5" />
              <span>GitHub Tool Importer</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setAppLauncherOpen(true)}>
              <Smartphone className="size-4 ml-2.5" />
              <span>تطبيقات Anzaro</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setAiToolsOpen(true)}>
              <Sparkles className="size-4 ml-2.5" />
              <span>AI Tools Hub (97 أداة)</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setMcpHubOpen(true)}>
              <Globe className="size-4 ml-2.5" />
              <span>MCP Tools (حقيقية)</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setPageReaderOpen(true)}>
              <Globe className="size-4 ml-2.5" />
              <span>قارئ الويب</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setTranslationOpen(true)}>
              <Languages className="size-4 ml-2.5" />
              <span>ترجمة</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setShareOpen(true)}>
              <Share2 className="size-4 ml-2.5" />
              <span>مشاركة</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setYoutubeAnalyzerOpen(true)}>
              <Youtube className="size-4 ml-2.5" />
              <span>تحليل يوتيوب</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer min-h-[40px] text-[14px] text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-150 rounded-lg px-2.5" onClick={() => setKnowledgeBaseOpen(true)}>
              <BookOpen className="size-4 ml-2.5" />

```

---


# 📂 API Routes — AI

## `src/app/api/ai/parallel-agents/route.ts`

> Size: 6.3KB | Lines: 183 | Lang: typescript

```typescript
import { NextRequest } from 'next/server';
import { getUserFromToken, extractBearerToken } from '@/lib/auth';
import { processFilesWithParallelAgents, type AgentFileInput, type ParallelAgentProgressCallback } from '@/lib/parallel-agent-engine';

// ─── Convert chat store file format to engine format ────────────────────
function convertFilesToEngineFormat(rawFiles: Array<{ name: string; content: string; type: string }>): AgentFileInput[] {
  return rawFiles.map((f) => {
    // Detect MIME type from content (data URL) or file extension
    let mimeType = 'application/octet-stream';
    if (f.content.startsWith('data:')) {
      const mimeMatch = f.content.match(/^data:([^;]+);base64,/);
      if (mimeMatch) mimeType = mimeMatch[1];
    }

    // Map file type to MIME type if not detected
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    const typeToMime: Record<string, string> = {
      image: 'image/png',
      video: 'video/mp4',
      audio: 'audio/wav',
      pdf: 'application/pdf',
      text: 'text/plain',
    };
    if (mimeType === 'application/octet-stream' && typeToMime[f.type]) {
      mimeType = typeToMime[f.type];
    }

    // Map file type to engine type
    const typeMap: Record<string, 'image' | 'video' | 'audio' | 'pdf' | 'text' | 'code' | 'data'> = {
      image: 'image',
      video: 'video',
      audio: 'audio',
      pdf: 'pdf',
      text: 'text',
      other: 'text',
    };

    return {
      name: f.name,
      content: f.content,
      mimeType,
      type: typeMap[f.type] || 'text',
    };
  });
}

// ─── Increase body size limit for large file uploads (100MB) ───────────
export const maxDuration = 300; // 5 minutes timeout
export const dynamic = 'force-dynamic';

// ─── POST Handler — Parallel Agent Processing with SSE Progress ───────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files: rawFiles, model, language, userPrompt, maxConcurrent } = body as {
      files: Array<{ name: string; content: string; type: string }>;
      model?: string;
      language?: string;
      userPrompt?: string;
      maxConcurrent?: number;
    };

    // Convert files to engine format
    const files = convertFilesToEngineFormat(rawFiles || []);

    // Validate files
    if (!rawFiles || !Array.isArray(rawFiles) || rawFiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'يجب إرفاق ملف واحد على الأقل' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (rawFiles.length > 12) {
      return new Response(
        JSON.stringify({ error: 'الحد الأقصى 12 ملف في المرة الواحدة' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Optional auth
    const authHeader = request.headers.get('authorization');
    const token = extractBearerToken(authHeader);
    // Auth is optional for parallel agents

    const resolvedLanguage = language || 'ar';
    const resolvedMaxConcurrent = Math.min(Math.max(maxConcurrent || 6, 1), 6);

    // ── Stream Response with SSE Progress ──
    const encoder = new TextEncoder();
    let streamClosed = false;

    const stream = new ReadableStream({
      async start(controller) {
        // Progress callback — sends SSE events
        const onProgress: ParallelAgentProgressCallback = (progress) => {
          if (streamClosed) return;

          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(progress)}\n\n`)
            );
          } catch {
            // Controller may be closed
          }
        };

        try {
          // Start parallel agent processing
          const result = await processFilesWithParallelAgents(files, {
            model,
            language: resolvedLanguage,
            maxConcurrent: resolvedMaxConcurrent,
            userPrompt: userPrompt || '',
            onProgress,
          });

          if (!streamClosed) {
            // Send final result
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  stage: 'completed',
                  detail: `تم التحليل الشامل لـ ${files.length} ملفات بـ ${result.agentsUsed} وكلاء بالتوازي`,
                  agentsActive: 0,
                  agentsCompleted: result.agentsUsed,
                  agentsTotal: result.agentsUsed,
                  results: result.results,
                  coordinatedAnalysis: result.coordinatedAnalysis,
                  totalProcessingTimeMs: result.totalProcessingTimeMs,
                  agentsUsed: result.agentsUsed,
                  model: result.model,
                })}\n\n`
              )
            );

            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
            streamClosed = true;
          }
        } catch (error) {
          if (!streamClosed) {
            streamClosed = true;
            try {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    stage: 'failed',
                    detail: 'حدث خطأ أثناء معالجة الوكلاء المتوازيين',
                    agentsActive: 0,
                    agentsCompleted: 0,
                    agentsTotal: files.length,
                  })}\n\n`
                )
              );
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch {
              // Controller already closed
            }
          }
        }
      },
      cancel() {
        streamClosed = true;
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[ParallelAgentAPI] Error:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ غير متوقع أثناء معالجة الوكلاء المتوازيين' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

```

---


# 📂 API Routes — Auth

## `src/app/api/auth/google/route.ts`

> Size: 1.4KB | Lines: 46 | Lang: typescript

```typescript
/**
 * GET /api/auth/google
 * يبدأ Google OAuth flow (email + profile scopes فقط — بدون verification)
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const REDIRECT_URI = `${process.env.ANZARO_PUBLIC_URL || process.env.DELTAAI_PUBLIC_URL || 'https://ebsaya-delta-ai.hf.space'}/api/auth/google/callback`;

export async function GET() {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: 'GOOGLE_CLIENT_ID not configured' }, { status: 500 });
  }

  // Generate state for security
  const state = crypto.randomBytes(16).toString('hex');

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    // V.45: Added Drive scopes so user can upload to their own Google Drive
    scope: 'email profile https://www.googleapis.com/auth/drive.file',
    state,
    prompt: 'select_account',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  // Store state in cookie
  const response = NextResponse.redirect(authUrl);
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  return response;
}

```

---

## `src/app/api/auth/google/callback/route.ts`

> Size: 5.4KB | Lines: 154 | Lang: typescript

```typescript
/**
 * GET /api/auth/google/callback
 * Google OAuth callback — يستلم code، يحوله لـ tokens، يجيب user info
 * ينشئ/يحدّث user في Prisma، ينشئ session
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = `${process.env.ANZARO_PUBLIC_URL || process.env.DELTAAI_PUBLIC_URL || 'https://ebsaya-delta-ai.hf.space'}/api/auth/google/callback`;
const FRONTEND_URL = process.env.ANZARO_PUBLIC_URL || process.env.DELTAAI_PUBLIC_URL || 'https://ebsaya-delta-ai.hf.space';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const storedState = request.cookies.get('google_oauth_state')?.value;

  if (error) {
    return NextResponse.redirect(`${FRONTEND_URL}/?google_error=${error}`);
  }

  if (!code || !storedState || state !== storedState) {
    return NextResponse.redirect(`${FRONTEND_URL}/?google_error=invalid_state`);
  }

  try {
    // 1. Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[Google Auth] Token exchange failed:', tokenRes.status, errText);
      return NextResponse.redirect(`${FRONTEND_URL}/?google_error=token_exchange_failed`);
    }

    const tokens = await tokenRes.json();

    // 2. Get user info (email + profile)
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${FRONTEND_URL}/?google_error=userinfo_failed`);
    }

    const googleUser = await userRes.json();
    const { email, name, picture } = googleUser;

    if (!email) {
      return NextResponse.redirect(`${FRONTEND_URL}/?google_error=no_email`);
    }

    // 3. Find or create user (upsert prevents race condition on concurrent Google logins)
    let user = await db.user.upsert({
      where: { email },
      create: {
        email,
        name: name || email.split('@')[0],
        avatar: picture || null,
        password: null, // Google users — no password
        isVerified: true, // Google email = verified
        role: 'user',
      },
      update: {
        // Update avatar if changed
        ...(picture ? { avatar: picture } : {}),
        lastSeen: new Date(),
      },
    });
    console.log('[Google Auth] User ready:', email);

    // V.45: Store Google tokens in UserIntegration for Drive uploads
    // This lets the app upload files to the USER's Google Drive (not the service account)
    if (tokens.access_token) {
      try {
        await db.userIntegration.upsert({
          where: { userId_provider: { userId: user.id, provider: 'google' } },
          create: {
            userId: user.id,
            provider: 'google',
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || null,
            tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
            scope: tokens.scope || 'email profile drive.file',
          },
          update: {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token || null,
            tokenExpiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
            scope: tokens.scope || 'email profile drive.file',
          },
        });
        console.log('[Google Auth] Tokens stored for Drive access');
      } catch (dbErr) {
        console.warn('[Google Auth] Failed to store tokens:', dbErr);
      }
    }

    // 4. Create session
    const sessionToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.session.create({
      data: {
        token: sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    // 5. Redirect to frontend with token — V.14: set httpOnly cookie for reliable session persistence
    const response = NextResponse.redirect(
      `${FRONTEND_URL}/?google_login=${sessionToken}&google_name=${encodeURIComponent(user.name || '')}`
    );

    // Set session cookie (httpOnly, secure) — ensures the session persists across reloads
    response.cookies.set('anzaro_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Clear OAuth state cookie
    response.cookies.delete('google_oauth_state');

    return response;
  } catch (err: any) {
    console.error('[Google Auth] Callback error:', err);
    return NextResponse.redirect(`${FRONTEND_URL}/?google_error=callback_failed`);
  }
}

```

---


# 📂 Components — Agents

## `src/components/agents/AgentsHub.tsx`

> Size: 31.7KB | Lines: 863 | Lang: tsx

> ⚠️ File truncated to first 500 lines (total: 863)

```tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────
interface UnifiedAgent {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  color: string;
  category: 'external' | 'custom' | 'builtin' | 'specialized';
  type: 'hermes' | 'anzaro' | 'massive-tools' | 'custom' | 'specialized' | 'recipe';
  available: boolean;
  endpoint: string;
  features?: string[];
  stats?: Record<string, any>;
  config?: Record<string, any>;
}

interface PlatformModel {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category: string;
  provider: string;
  realChatModel: string;
  maxTokens: number;
  openSource: boolean;
  capabilities: Record<string, boolean>;
  skills: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentId?: string;
  error?: boolean;
  loading?: boolean;
}

// ─── Component ──────────────────────────────────────
export function AgentsHub({ onBack }: { onBack: () => void }) {
  const [agents, setAgents] = useState<UnifiedAgent[]>([]);
  const [models, setModels] = useState<PlatformModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<UnifiedAgent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'builtin' | 'external' | 'custom' | 'specialized'>('all');
  const [view, setView] = useState<'agents' | 'models'>('agents');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load agents list
  useEffect(() => {
    loadAgents();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/agents-list');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents || []);
        setModels(data.models || []);
      } else {
        setError(data.error || 'Failed to load agents');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(a => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const handleSelectAgent = (agent: UnifiedAgent) => {
    setSelectedAgent(agent);
    setMessages([]);
    setError(null);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAgent || sending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      agentId: selectedAgent.id,
    };

    const loadingMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      agentId: selectedAgent.id,
      loading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setSending(true);
    setError(null);

    try {
      let response: Response;

      if (selectedAgent.type === 'hermes') {
        // Hermes endpoint
        response = await fetch('/api/hermes/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            yolo: true,
          }),
        });
      } else if (selectedAgent.type === 'massive-tools') {
        // Massive tools — treat as tool execution query
        response = await fetch('/api/massive-tools/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'sentiment_analysis',
            args: { text: userMessage.content, language: 'auto' },
          }),
        });
      } else {
        // Anzaro AI / custom agents — use chat/agent endpoint
        response = await fetch('/api/chat/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            agentId: selectedAgent.type === 'custom' ? selectedAgent.id : undefined,
          }),
        });
      }

      const data = await response.json();

      // Remove loading message and add real response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        const responseContent =
          selectedAgent.type === 'hermes'
            ? data.response || data.error || 'No response'
            : selectedAgent.type === 'massive-tools'
            ? JSON.stringify(data.output || data, null, 2).slice(0, 2000)
            : data.response || data.message || JSON.stringify(data).slice(0, 2000);

        return [
          ...withoutLoading,
          {
            role: 'assistant',
            content: responseContent,
            timestamp: Date.now(),
            agentId: selectedAgent.id,
            error: !data.success && !response.ok,
          },
        ];
      });
    } catch (e: any) {
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [
          ...withoutLoading,
          {
            role: 'assistant',
            content: `Error: ${e.message}`,
            timestamp: Date.now(),
            agentId: selectedAgent.id,
            error: true,
          },
        ];
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Agent Selection View ───────────────────────────
  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <span>→</span>
              <span>رجوع</span>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                مركز الوكلاء والنماذج
              </h1>
              <p className="text-xs text-muted-foreground">
                {agents.length} وكيل + {models.length} نموذج — اختر المناسب لمهمتك
              </p>
            </div>
            <button
              onClick={loadAgents}
              className="px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              title="تحديث"
            >
              🔄
            </button>
          </div>
        </div>

        {/* View tabs: Agents | Models */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView('agents')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                view === 'agents'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              🤖 الوكلاء ({agents.length})
            </button>
            <button
              onClick={() => setView('models')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                view === 'models'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              🧠 النماذج ({models.length})
            </button>
          </div>

          {/* ─── Agents View ─── */}
          {view === 'agents' && (
            <>
              {/* Filter tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {([
                  { id: 'all', label: 'الكل', icon: '🌐' },
                  { id: 'builtin', label: 'مدمج', icon: '⚡' },
                  { id: 'specialized', label: 'متخصص', icon: '🎯' },
                  { id: 'external', label: 'خارجي', icon: '🔌' },
                  { id: 'custom', label: 'مخصص', icon: '✨' },
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <span className="ml-1">{tab.icon}</span>
                    {tab.label}
                    <span className="mr-2 text-xs opacity-60">
                      {tab.id === 'all'
                        ? agents.length
                        : agents.filter(a => a.category === tab.id).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />
                  ))}
                </div>
              )}

              {/* Agents grid */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAgents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onSelect={() => handleSelectAgent(agent)}
                    />
                  ))}
                </div>
              )}

              {!loading && filteredAgents.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="text-5xl mb-4">🔍</div>
                  <p>لا توجد وكلاء في هذه الفئة</p>
                </div>
              )}
            </>
          )}

          {/* ─── Models View ─── */}
          {view === 'models' && !loading && (
            <ModelsGrid models={models} />
          )}
        </div>
      </div>
    );
  }

  // ─── Chat View ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedAgent(null)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            <span>→</span>
            <span>الوكلاء</span>
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-xl shadow-lg`}>
            {selectedAgent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm truncate flex items-center gap-2">
              {selectedAgent.nameAr || selectedAgent.name}
              {!selectedAgent.available && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  غير متاح
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {selectedAgent.type === 'hermes' && selectedAgent.stats?.version
                ? `Hermes v${selectedAgent.stats.version}`
                : selectedAgent.type === 'massive-tools' && selectedAgent.stats?.total_tools
                ? `${selectedAgent.stats.total_tools.toLocaleString()} أداة`
                : selectedAgent.descriptionAr?.slice(0, 60) || selectedAgent.description.slice(0, 60)}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-4xl shadow-xl mb-4`}>
                {selectedAgent.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {selectedAgent.nameAr || selectedAgent.name}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                {selectedAgent.descriptionAr || selectedAgent.description}
              </p>
              {/* Features */}
              {selectedAgent.features && selectedAgent.features.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto mb-6">
                  {selectedAgent.features.slice(0, 6).map((f, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-muted/50 text-xs">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {/* Hermes not ready warning */}
              {selectedAgent.type === 'hermes' && selectedAgent.config?.needs_api_key && (
                <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm text-right">
                  <p className="font-bold mb-1">⚠️ يحتاج إعداد</p>
                  <p>Hermes مثبت لكن محتاج API key. أضف مفتاح في:</p>
                  <code className="block mt-2 p-2 rounded bg-muted text-xs" dir="ltr">
                    ~/.hermes/.env
                  </code>
                  <p className="mt-2 text-xs">مثال: OPENAI_API_KEY=sk-... أو ANTHROPIC_API_KEY=sk-...</p>
                </div>
              )}
              {/* Suggestions */}
              <div className="flex flex-col gap-2 max-w-md mx-auto">
                {getSuggestions(selectedAgent).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm text-right"
                  >
                    💡 {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : msg.error
                    ? 'bg-destructive/10 border border-destructive/20'
                    : 'bg-muted'
                }`}
              >
                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">يفكر...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-sm break-words" dir="auto">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-background/80 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`اكتب رسالة لـ ${selectedAgent.nameAr || selectedAgent.name}...`}
                disabled={sending || !selectedAgent.available}
                rows={1}
                className="w-full resize-none rounded-2xl bg-muted/50 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32 disabled:opacity-50"
                style={{ minHeight: '48px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || sending || !selectedAgent.available}
              className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              {sending ? '⏳' : '➤'}
            </button>
          </div>
          {selectedAgent.type === 'hermes' && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              ⚡ مدعوم بـ Hermes Agent — قد يستغرق 30-90 ثانية للرد
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Agent Card Component ───────────────────────────
function AgentCard({ agent, onSelect }: { agent: UnifiedAgent; onSelect: () => void }) {

```

---

## `src/components/agents/AgentBuilder.tsx`

> Size: 23.5KB | Lines: 640 | Lang: tsx

> ⚠️ File truncated to first 500 lines (total: 640)

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Play, Pencil, Trash2, Loader2, Sparkles,
  RefreshCw, AlertCircle, ArrowLeft, Bot, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AGENT_TOOL_CATALOG,
  getToolByName,
} from "@/lib/agents/catalog";
import { RECIPES } from "@/lib/agents/recipes";
import { AgentForm, type AgentFormState } from "./AgentForm";
import { AgentRunner } from "./AgentRunner";
import { McpCatalogHub } from "./McpCatalogHub";
import { useAuthStore } from "@/store/auth-store";
import type { CustomAgentMeta } from "./types";

type View = "list" | "create" | "edit" | "run" | "catalog";

export function AgentBuilder() {
  const [view, setView] = useState<View>("list");
  const [agents, setAgents] = useState<CustomAgentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomAgentMeta | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomAgentMeta | null>(null);

  // ── Auth header (avoids 401 on protected /api/agents endpoints) ──
  const token = useAuthStore((s) => s.token);
  const authHeaders = useCallback(
    (extra: Record<string, string> = {}) => ({
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extra,
    }),
    [token],
  );

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", { headers: authHeaders() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAgents(data.agents || []);
    } catch (e: unknown) {
      toast.error("فشل تحميل الوكلاء: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // ── Create new agent ───────────────────────────────────────
  const handleCreate = async (form: AgentFormState) => {
    setSaving(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      toast.success(`تم إنشاء الوكيل "${data.agent.name}"`);
      await fetchAgents();
      setView("list");
    } catch (e: unknown) {
      toast.error("فشل إنشاء الوكيل: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  // ── Update existing agent ──────────────────────────────────
  const handleUpdate = async (form: AgentFormState) => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${selected.id}`, {
        method: "PATCH",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      toast.success("تم حفظ التعديلات");
      await fetchAgents();
      setSelected(data.agent);
      setView("list");
    } catch (e: unknown) {
      toast.error("فشل حفظ التعديلات: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete agent ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/agents/${deleteTarget.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success(`تم حذف الوكيل "${deleteTarget.name}"`);
      await fetchAgents();
    } catch (e: unknown) {
      toast.error("فشل حذف الوكيل: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Run agent ──────────────────────────────────────────────
  const handleRun = (agent: CustomAgentMeta) => {
    setSelected(agent);
    setView("run");
  };

  const handleEdit = (agent: CustomAgentMeta) => {
    setSelected(agent);
    setView("edit");
  };

  // ────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────

  if (view === "run" && selected) {
    return <AgentRunner agent={selected} onBack={() => setView("list")} />;
  }

  // ── MCP Catalog Hub view ──────────────────────────────────
  // تفاعلي: ربط MCP servers خارجية + dry-run للأدوات المحلية
  if (view === "catalog") {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border background px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                مركز MCP — ربط السيرفرات + Dry-Run
              </h2>
              <p className="text-[11px] text-muted-foreground">
                اربط MCP server خارجي (dynamic SSE) أو جَرِّب أي أداة محلية
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-6">
            <McpCatalogHub />
          </div>
        </div>
      </div>
    );
  }

  if (view === "create" || view === "edit") {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border background px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("list")}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <h2 className="text-sm font-bold">
                {view === "create" ? "إنشاء وكيل جديد" : "تعديل الوكيل"}
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {view === "create"
                  ? `صمّم وكيلك من ${AGENT_TOOL_CATALOG.length} أداة متاحة`
                  : selected?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden">
          <AgentForm
            initial={view === "edit" ? selected : null}
            onSave={view === "create" ? handleCreate : handleUpdate}
            onCancel={() => setView("list")}
            saving={saving}
          />
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">استوديو بناء الوكلاء</h2>
              <p className="text-[11px] text-muted-foreground">
                صمّم وكلاء ذكاء اصطناعيين مخصصين بمهارات محددة
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setView("catalog")}
              className="h-8 gap-1.5 text-xs border border-blue-500 text-blue-600 hover:bg-blue-500 dark:text-blue-300"
            >
              <Globe className="h-3.5 w-3.5" />
              MCP Catalog
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchAgents}
              disabled={loading}
              className="h-8 text-xs"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelected(null);
                setView("create");
              }}
              className="h-8 gap-1.5 text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              وكيل جديد
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-xs text-muted-foreground mt-3">جاري تحميل الوكلاء...</p>
            </div>
          ) : agents.length === 0 ? (
            <EmptyState
              onCreate={() => {
                setSelected(null);
                setView("create");
              }}
            />
          ) : (
            <>
              {/* Stats banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <StatCard
                  label="وكلاء"
                  value={agents.length}
                  icon="🤖"
                  color="from-blue-500 to-blue-500"
                />
                <StatCard
                  label="إجمالي الأدوات"
                  value={AGENT_TOOL_CATALOG.length}
                  icon="🛠️"
                  color="from-blue-500 to-blue-500"
                />
                <StatCard
                  label="إجمالي التشغيلات"
                  value={agents.reduce((s, a) => s + a.runCount, 0)}
                  icon="▶️"
                  color="from-blue-500 to-blue-500"
                />
                <StatCard
                  label="وكلاء عامين"
                  value={agents.filter((a) => a.isPublic).length}
                  icon="🌍"
                  color="from-blue-500 to-blue-500"
                />
              </div>

              {/* Recipes section */}
              <RecipesSection onImported={fetchAgents} />

              {/* Agents grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {agents.map((agent, i) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <AgentCard
                        agent={agent}
                        onRun={() => handleRun(agent)}
                        onEdit={() => handleEdit(agent)}
                        onDelete={() => setDeleteTarget(agent)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف الوكيل؟</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف "{deleteTarget?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.
              سيتم حذف الوكيل وكل بياناته نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br text-xs", color)}>
          {icon}
        </div>
        <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function AgentCard({
  agent,
  onRun,
  onEdit,
  onDelete,
}: {
  agent: CustomAgentMeta;
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card hover:border-blue-500 transition-all">
      {/* Gradient header strip */}
      <div className={cn("h-1.5 bg-gradient-to-r", agent.color)} />

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl shadow-md",
              agent.color,
            )}
          >
            {agent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold truncate">{agent.name}</h3>
              {agent.isPublic && (
                <Badge variant="outline" className="text-[9px] gap-0.5 h-4 px-1">
                  <Sparkles className="h-2 w-2" />
                  عام
                </Badge>
              )}
            </div>
            {agent.nameEn && (
              <p className="text-[10px] text-muted-foreground font-mono">{agent.nameEn}</p>
            )}
            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-snug">
              {agent.description}
            </p>
          </div>
        </div>

        {/* Tools preview */}
        <div className="flex flex-wrap gap-1 mb-3 min-h-[20px]">
          {agent.tools.slice(0, 6).map((tn) => {
            const t = getToolByName(tn);
            if (!t) return (
              <Badge key={tn} variant="outline" className="text-[9px] font-mono">
                {tn}
              </Badge>
            );
            return (
              <Badge key={tn} variant="outline" className="text-[9px] gap-0.5 bg-muted">
                <span>{t.icon}</span>
                <span className="font-mono">{t.name}</span>
              </Badge>
            );
          })}
          {agent.tools.length > 6 && (
            <Badge variant="outline" className="text-[9px]">
              +{agent.tools.length - 6}
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-[10px] text-muted-foreground">
            {agent.runCount > 0 ? `▶ ${agent.runCount} مرة` : "لم يُشغّل بعد"}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-7 w-7 p-0"
              title="تعديل"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              title="حذف"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={onRun}
              className={cn(
                "h-7 gap-1.5 text-xs bg-gradient-to-r text-white shadow-sm",

```

---

## `src/components/agents/AgentForm.tsx`

> Size: 27.0KB | Lines: 659 | Lang: tsx

> ⚠️ File truncated to first 500 lines (total: 659)

```tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Sparkles, Loader2, Check, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AGENT_TOOL_CATALOG,
  CATEGORY_META,
  getToolsByCategory,
  type ToolCategory,
  type AgentToolDef,
} from "@/lib/agents/catalog";
import {
  COLOR_PRESETS,
  ICON_PRESETS,
  type CustomAgentMeta,
} from "./types";
import { useAuthStore } from "@/store/auth-store";

export interface AgentFormState {
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  systemPrompt: string;
  tools: string[];
  suggestions: string[];
  category: string;
  isPublic: boolean;
}

interface AgentFormProps {
  initial?: CustomAgentMeta | null;
  onSave: (state: AgentFormState) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

const EMPTY_FORM: AgentFormState = {
  name: "",
  nameEn: "",
  description: "",
  icon: "🤖",
  color: "from-blue-500 to-blue-500",
  systemPrompt: "",
  tools: [],
  suggestions: [],
  category: "custom",
  isPublic: false,
};

const CATEGORIES = [
  { value: "custom", label: "مخصص" },
  { value: "content", label: "محتوى" },
  { value: "research", label: "بحث" },
  { value: "dev", label: "تطوير" },
  { value: "business", label: "أعمال" },
  { value: "education", label: "تعليم" },
];

export function AgentForm({ initial, onSave, onCancel, saving }: AgentFormProps) {
  const [form, setForm] = useState<AgentFormState>(EMPTY_FORM);
  const [generating, setGenerating] = useState(false);
  const [expandedCats, setExpandedCats] = useState<Set<ToolCategory>>(new Set(["search"]));
  const [newSuggestion, setNewSuggestion] = useState("");
  const [toolSearch, setToolSearch] = useState("");
  const [mcpTools, setMcpTools] = useState<AgentToolDef[]>([]);
  const [mcpLoading, setMcpLoading] = useState(false);

  // Load initial values when editing
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        nameEn: initial.nameEn || "",
        description: initial.description,
        icon: initial.icon,
        color: initial.color,
        systemPrompt: initial.systemPrompt,
        tools: initial.tools,
        suggestions: initial.suggestions,
        category: initial.category,
        isPublic: initial.isPublic,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  const toolsByCat = useMemo(() => {
    const base = getToolsByCategory();
    // Add MCP tools if loaded
    if (mcpTools.length > 0) {
      base.mcp = mcpTools;
    }
    return base;
  }, [mcpTools]);

  // Load MCP tools when the MCP category is expanded or when searching
  const loadMcpTools = async () => {
    if (mcpTools.length > 0 || mcpLoading) return;
    setMcpLoading(true);
    try {
      // Fetch tool metadata from the API (server-side, avoids bundling
      // Node-only modules like `dns` into the browser bundle).
      const token = useAuthStore.getState().token;
      const res = await fetch("/api/mcp/execute", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        const all: Array<{ name: string; description: string; parameters: unknown }> = data.tools || [];
        const curatedNames = new Set(AGENT_TOOL_CATALOG.map((t) => t.name));
        const mcpOnly = all
          .filter((t) => !curatedNames.has(t.name))
          .map((t) => ({
            name: t.name,
            description: t.description,
            category: "mcp" as ToolCategory,
            icon: "⚡",
            parameters: t.parameters as { type: "object"; properties: Record<string, unknown>; required?: string[] },
          }));
        setMcpTools(mcpOnly);
      }
    } catch {
      // silent — MCP tools just won't be available
    } finally {
      setMcpLoading(false);
    }
  };

  // Filtered tools based on search
  const searchLower = toolSearch.toLowerCase().trim();
  const filteredToolsByCat = useMemo(() => {
    if (!searchLower) return toolsByCat;
    const filtered: Record<ToolCategory, AgentToolDef[]> = {
      search: [], content: [], code: [], data: [], communication: [], utility: [], ai: [], mcp: [],
    };
    for (const cat of Object.keys(toolsByCat) as ToolCategory[]) {
      filtered[cat] = toolsByCat[cat].filter(
        (t) =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower),
      );
    }
    return filtered;
  }, [toolsByCat, searchLower]);

  const totalFiltered = useMemo(
    () => Object.values(filteredToolsByCat).reduce((sum, tools) => sum + tools.length, 0),
    [filteredToolsByCat],
  );

  const toggleTool = (name: string) => {
    setForm((prev) => {
      const has = prev.tools.includes(name);
      return {
        ...prev,
        tools: has ? prev.tools.filter((t) => t !== name) : [...prev.tools, name],
      };
    });
  };

  const toggleCat = (cat: ToolCategory) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
        // Auto-load MCP tools when MCP category is expanded
        if (cat === "mcp") {
          loadMcpTools();
        }
      }
      return next;
    });
  };

  const selectAllInCat = (cat: ToolCategory) => {
    const catTools = toolsByCat[cat].map((t) => t.name);
    setForm((prev) => {
      const hasAll = catTools.every((t) => prev.tools.includes(t));
      const tools = hasAll
        ? prev.tools.filter((t) => !catTools.includes(t))
        : Array.from(new Set([...prev.tools, ...catTools]));
      return { ...prev, tools };
    });
  };

  // ── AI prompt generator ────────────────────────────────────
  const generatePrompt = async () => {
    if (!form.description.trim() || form.description.length < 10) {
      toast.error("اكتب وصف للوكيل الأول (10 أحرف على الأقل)");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/agents/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: form.description }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "فشل التوليد");
      }
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        systemPrompt: data.systemPrompt || prev.systemPrompt,
        tools: data.suggestedTools?.length > 0 ? data.suggestedTools : prev.tools,
        suggestions: data.suggestions?.length > 0 ? data.suggestions : prev.suggestions,
      }));
      toast.success("تم توليد الـ system prompt والأدوات المقترحة");
    } catch (e: unknown) {
      toast.error("فشل توليد البرومبت: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setGenerating(false);
    }
  };

  // ── Suggestions management ─────────────────────────────────
  const addSuggestion = () => {
    const s = newSuggestion.trim();
    if (!s) return;
    if (form.suggestions.length >= 10) {
      toast.error("حد أقصى 10 اقتراحات");
      return;
    }
    setForm((prev) => ({ ...prev, suggestions: [...prev.suggestions, s] }));
    setNewSuggestion("");
  };
  const removeSuggestion = (idx: number) => {
    setForm((prev) => ({ ...prev, suggestions: prev.suggestions.filter((_, i) => i !== idx) }));
  };

  // ── Submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim()) return toast.error("الاسم مطلوب");
    if (!form.description.trim()) return toast.error("الوصف مطلوب");
    if (!form.systemPrompt.trim()) return toast.error("system prompt مطلوب");
    if (form.tools.length === 0) return toast.error("اختار أداة واحدة على الأقل");
    await onSave(form);
  };

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      <ScrollArea className="flex-1 px-1">
        <div className="space-y-6 pb-6">
          {/* ── Basic info ─────────────────────────────────── */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              المعلومات الأساسية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">الاسم (عربي) *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="وكيل التسويق"
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">الاسم (إنجليزي)</label>
                <Input
                  value={form.nameEn}
                  onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                  placeholder="Marketing Agent"
                  className="text-sm"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">الوصف *</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="اكتب وصف قصير للوكيل. هذا الوصف يُستخدم لتوليد الـ system prompt تلقائياً."
                rows={2}
                className="text-sm resize-none"
              />
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-muted-foreground">{form.description.length} حرف</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generatePrompt}
                  disabled={generating}
                  className="h-7 gap-1.5 text-xs"
                >
                  {generating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  توليد بـ AI
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">التصنيف</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, category: c.value })}
                    className={cn(
                      "rounded-md border px-2.5 py-1 text-xs transition-colors",
                      form.category === c.value
                        ? "border-blue-500 bg-blue-500 text-blue-600 dark:text-blue-300"
                        : "border-border bg-muted hover:bg-muted",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Icon + Color ───────────────────────────────── */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              المظهر
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">الأيقونة</label>
                <div className="grid grid-cols-8 gap-1">
                  {ICON_PRESETS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={cn(
                        "aspect-square rounded-md border text-xl flex items-center justify-center transition-all",
                        form.icon === ic
                          ? "border-blue-500 bg-blue-500 scale-105"
                          : "border-border bg-muted hover:bg-muted",
                      )}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">اللون (gradient)</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      title={preset.label}
                      onClick={() => setForm({ ...form, color: preset.value })}
                      className={cn(
                        "aspect-square rounded-md bg-gradient-to-br relative",
                        preset.value,
                        form.color === preset.value
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : "hover:scale-105",
                      )}
                    >
                      {form.color === preset.value && (
                        <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Live preview */}
                <div
                  className={cn(
                    "mt-2 flex items-center gap-2 rounded-lg border border-border bg-gradient-to-br p-2.5",
                    form.color,
                  )}
                >
                  <span className="text-2xl">{form.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {form.name || "اسم الوكيل"}
                    </div>
                    <div className="text-[10px] text-blue-800 dark:text-blue-200 truncate">
                      {form.description || "وصف قصير للوكيل"}
                    </div>
                  </div>
                  <Badge className="text-[9px] bg-blue-100 dark:bg-blue-900 text-white border-blue-300 dark:border-blue-800 hover:bg-blue-100 dark:bg-blue-900">
                    {form.tools.length} أداة
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* ── Tools ──────────────────────────────────────── */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                الأدوات ({form.tools.length} مختارة)
              </h3>
              {form.tools.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] text-muted-foreground hover:text-destructive"
                  onClick={() => setForm({ ...form, tools: [] })}
                >
                  مسح الكل
                </Button>
              )}
            </div>
            {/* Search box */}
            <div className="relative">
              <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={toolSearch}
                onChange={(e) => {
                  setToolSearch(e.target.value);
                  // Auto-load MCP tools when user starts searching
                  if (e.target.value.length > 0 && mcpTools.length === 0 && !mcpLoading) {
                    loadMcpTools();
                    // Also expand MCP category
                    setExpandedCats((prev) => new Set(prev).add("mcp"));
                  }
                }}
                placeholder="ابحث في 360+ أداة بالاسم أو الوصف..."
                className="h-8 pr-8 text-xs"
              />
              {toolSearch && (
                <button
                  onClick={() => setToolSearch("")}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
            {toolSearch && (
              <div className="text-[10px] text-muted-foreground px-1">
                {totalFiltered} نتيجة للبحث "{toolSearch}"
              </div>
            )}
            <div className="space-y-2 rounded-lg border border-border bg-muted p-2 max-h-72 overflow-y-auto">
              {(Object.keys(filteredToolsByCat) as ToolCategory[]).map((cat) => {
                const tools = filteredToolsByCat[cat];
                if (tools.length === 0) return null;
                const meta = CATEGORY_META[cat];
                const expanded = expandedCats.has(cat) || (!!toolSearch && tools.length > 0);
                const selectedInCat = tools.filter((t) => form.tools.includes(t.name)).length;
                return (
                  <div key={cat} className="rounded-md background">
                    <button
                      type="button"
                      onClick={() => toggleCat(cat)}
                      className="flex w-full items-center gap-2 px-2 py-1.5 text-right hover:bg-muted rounded-md"
                    >
                      {expanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="text-sm">{meta.icon}</span>
                      <span className={cn("text-xs font-semibold", meta.color)}>{meta.label}</span>
                      <span className="text-[10px] text-muted-foreground">
                        ({selectedInCat}/{tools.length})
                      </span>
                      <span className="ml-auto" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAllInCat(cat);
                        }}
                        className="text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        {selectedInCat === tools.length ? "إلغاء الكل" : "تحديد الكل"}
                      </button>
                    </button>
                    {expanded && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-2 pb-2">
                        {cat === "mcp" && mcpLoading && (
                          <div className="col-span-full flex items-center gap-2 text-[10px] text-muted-foreground py-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            جاري تحميل أدوات MCP (340+)...
                          </div>
                        )}
                        {cat === "mcp" && !mcpLoading && mcpTools.length === 0 && (
                          <div className="col-span-full text-[10px] text-muted-foreground py-2 text-center">
                            لا توجد أدوات MCP متاحة

```

---

## `src/components/agents/AgentRunner.tsx`

> Size: 22.1KB | Lines: 635 | Lang: tsx

> ⚠️ File truncated to first 500 lines (total: 635)

```tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Send, Loader2, AlertCircle, Wrench,
  ChevronDown, ChevronUp, Brain, RotateCcw, Clock, Check, Sparkles,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getToolByName, getToolByNameAsync } from "@/lib/agents/catalog";
import { useAuthStore } from "@/store/auth-store";
import type { CustomAgentMeta, AgentSSEEvent, ToolCallRecord, ChatTurn } from "./types";

interface AgentRunnerProps {
  agent: CustomAgentMeta;
  onBack: () => void;
}

export function AgentRunner({ agent, onBack }: AgentRunnerProps) {
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [toolMetaCache, setToolMetaCache] = useState<Map<string, { icon: string; description: string }>>(new Map());
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Pre-load tool metadata (for MCP tools that aren't in the curated catalog)
  useEffect(() => {
    const loadMeta = async () => {
      const cache = new Map<string, { icon: string; description: string }>();
      for (const tn of agent.tools) {
        const def = await getToolByNameAsync(tn);
        if (def) {
          cache.set(tn, { icon: def.icon, description: def.description });
        }
      }
      setToolMetaCache(cache);
    };
    loadMeta();
  }, [agent.tools]);

  // Helper to get tool display info (from cache or curated catalog)
  const getToolInfo = (name: string): { icon: string; description: string } | undefined => {
    const cached = toolMetaCache.get(name);
    if (cached) return cached;
    const curated = getToolByName(name);
    if (curated) return { icon: curated.icon, description: curated.description };
    return undefined;
  };

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, currentStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const toggleTool = (id: string) => {
    setExpandedTools((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runAgent = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || running) return;

      const userTurn: ChatTurn = { role: "user", content: userMessage };
      const assistantTurn: ChatTurn = {
        role: "assistant",
        content: "",
        toolCalls: [],
        thinking: "",
        streaming: true,
      };
      setTurns((prev) => [...prev, userTurn, assistantTurn]);
      setInput("");
      setRunning(true);
      setCurrentStep(0);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const token = useAuthStore.getState().token;
        const res = await fetch(`/api/agents/${agent.id}/run`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: userMessage }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");
        const decoder = new TextDecoder();
        let buffer = "";

        const updateAssistant = (fn: (t: ChatTurn) => ChatTurn) => {
          setTurns((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = fn(last);
            }
            return next;
          });
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]" || !payload) continue;
            let event: AgentSSEEvent;
            try {
              event = JSON.parse(payload);
            } catch {
              continue;
            }

            switch (event.type) {
              case "status":
                if (event.message) {
                  toast.info(event.message, { duration: 2000 });
                }
                break;
              case "step":
                setCurrentStep(event.step ?? 0);
                break;
              case "thinking":
                updateAssistant((t) => ({
                  ...t,
                  thinking: (t.thinking ?? "") + (event.content ?? ""),
                }));
                break;
              case "token":
                updateAssistant((t) => ({ ...t, content: t.content + (event.content ?? "") }));
                break;
              case "tool_start": {
                const tc: ToolCallRecord = {
                  id: event.tool_call_id ?? `tc-${Date.now()}-${Math.random()}`,
                  tool: event.tool ?? "",
                  args: event.args,
                  status: "running",
                  startedAt: Date.now(),
                };
                updateAssistant((t) => ({
                  ...t,
                  toolCalls: [...(t.toolCalls ?? []), tc],
                }));
                break;
              }
              case "tool_end": {
                updateAssistant((t) => {
                  const calls = (t.toolCalls ?? []).map((c) =>
                    c.id === event.tool_call_id || (c.tool === event.tool && c.status === "running")
                      ? {
                          ...c,
                          result: event.result,
                          status: "done" as const,
                          endedAt: Date.now(),
                        }
                      : c,
                  );
                  return { ...t, toolCalls: calls };
                });
                break;
              }
              case "done":
                updateAssistant((t) => ({ ...t, streaming: false }));
                setRunning(false);
                break;
              case "error":
                updateAssistant((t) => ({
                  ...t,
                  content: t.content + `\n\n❌ خطأ: ${event.error}`,
                  streaming: false,
                }));
                setRunning(false);
                toast.error(event.error || "حدث خطأ");
                break;
            }
          }
        }
        updateAssistant((t) => ({ ...t, streaming: false }));
      } catch (e: unknown) {
        if (e.name !== "AbortError") {
          toast.error(e instanceof Error ? e.message : String(e) || "فشل تشغيل الوكيل");
          setTurns((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: last.content + `\n\n❌ خطأ: ${e instanceof Error ? e.message : String(e)}`,
                streaming: false,
              };
            }
            return next;
          });
        }
      } finally {
        setRunning(false);
        abortRef.current = null;
      }
    },
    [agent.id, running],
  );

  const handleStop = () => {
    abortRef.current?.abort();
    setRunning(false);
  };

  const handleReset = () => {
    setTurns([]);
    setCurrentStep(0);
  };

  const handlePickSuggestion = (s: string) => {
    if (!running) runAgent(s);
  };

  const toolCallCount = turns.reduce(
    (sum, t) => sum + (t.toolCalls?.length ?? 0),
    0,
  );

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="border-b border-border background px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-md",
              agent.color,
            )}
          >
            {agent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold truncate">{agent.name}</h2>
              {agent.nameEn && (
                <span className="text-[10px] text-muted-foreground font-mono">({agent.nameEn})</span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">{agent.description}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {running && (
              <Badge variant="outline" className="gap-1.5 text-[10px] border-blue-500 text-blue-600 dark:text-blue-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                خطوة {currentStep}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {agent.tools.length} أداة
            </Badge>
            {toolCallCount > 0 && (
              <Badge variant="outline" className="text-[10px]">
                {toolCallCount} استدعاء
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6 space-y-4">
          {turns.length === 0 ? (
            <WelcomeRunner
              agent={agent}
              onPickSuggestion={handlePickSuggestion}
              disabled={running}
            />
          ) : (
            turns.map((turn, i) => (
              <TurnBubble
                key={i}
                turn={turn}
                expandedTools={expandedTools}
                onToggleTool={toggleTool}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Input ─────────────────────────────────────────── */}
      <div className="border-t border-border background p-3">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  runAgent(input);
                }
              }}
              placeholder={`اكتب رسالة لـ ${agent.name}...`}
              rows={1}
              className="min-h-[40px] max-h-32 resize-none text-sm"
              disabled={running}
            />
            {running ? (
              <Button
                onClick={handleStop}
                size="sm"
                variant="destructive"
                className="h-10 px-3"
              >
                إيقاف
              </Button>
            ) : (
              <Button
                onClick={() => runAgent(input)}
                disabled={!input.trim()}
                size="sm"
                className={cn(
                  "h-10 px-4 bg-gradient-to-r text-white shadow-md",
                  agent.color,
                )}
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mt-1.5 px-1">
            <span className="text-[10px] text-muted-foreground">
              Enter للإرسال • Shift+Enter لسطر جديد
            </span>
            {turns.length > 0 && (
              <button
                onClick={handleReset}
                className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                محادثة جديدة
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────

function WelcomeRunner({
  agent,
  onPickSuggestion,
  disabled,
}: {
  agent: CustomAgentMeta;
  onPickSuggestion: (s: string) => void;
  disabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <div
        className={cn(
          "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-lg",
          agent.color,
        )}
      >
        {agent.icon}
      </div>
      <h2 className="text-xl font-bold mb-2">{agent.name}</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {agent.description}
      </p>

      {/* Tools available */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-xl mx-auto">
        {agent.tools.slice(0, 12).map((tn) => {
          const t = getToolByName(tn);
          if (!t) return (
            <Badge key={tn} variant="outline" className="gap-1 text-[10px] bg-muted">
              <span>⚡</span>
              <span className="font-mono">{tn}</span>
            </Badge>
          );
          return (
            <Badge
              key={tn}
              variant="outline"
              className="gap-1 text-[10px] bg-muted"
            >
              <span>{t.icon}</span>
              <span className="font-mono">{tn}</span>
            </Badge>
          );
        })}
        {agent.tools.length > 12 && (
          <Badge variant="outline" className="text-[10px]">
            +{agent.tools.length - 12}
          </Badge>
        )}
      </div>

      {/* Suggestions */}
      {agent.suggestions.length > 0 && (
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-3">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-semibold">جرّب واحدة من دول</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {agent.suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => onPickSuggestion(s)}
                disabled={disabled}
                className="group flex items-start gap-2.5 rounded-lg border border-border bg-muted p-3 text-right hover:border-blue-500 hover:bg-muted transition-all disabled:opacity-50"
              >
                <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-white text-[10px] font-bold", agent.color)}>
                  {i + 1}
                </div>
                <p className="flex-1 text-xs leading-snug">{s}</p>
                <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-blue-500 mt-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TurnBubble({
  turn,
  expandedTools,
  onToggleTool,
}: {
  turn: ChatTurn;
  expandedTools: Set<string>;
  onToggleTool: (id: string) => void;
}) {
  if (turn.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2.5 shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{turn.content}</p>
        </div>
      </motion.div>
    );
  }

```

---

## `src/components/agents/types.ts`

> Size: 2.1KB | Lines: 70 | Lang: typescript

```typescript
/**
 * Shared types for the Agent Builder UI.
 */

export interface CustomAgentMeta {
  id: string;
  name: string;
  nameEn: string | null;
  description: string;
  icon: string;
  color: string; // tailwind gradient classes e.g. "from-violet-500 to-fuchsia-500"
  systemPrompt: string;
  tools: string[];
  suggestions: string[];
  category: string;
  isPublic: boolean;
  runCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgentSSEEvent {
  type: "status" | "step" | "token" | "thinking" | "tool_start" | "tool_end" | "done" | "error";
  content?: string;
  tool?: string;
  tool_call_id?: string;
  args?: unknown;
  result?: unknown;
  step?: number;
  error?: string;
  message?: string;
}

export interface ToolCallRecord {
  id: string;
  tool: string;
  args?: unknown;
  result?: unknown;
  status: "running" | "done";
  startedAt: number;
  endedAt?: number;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallRecord[];
  thinking?: string;
  streaming?: boolean;
}

/** Gradient presets for the agent color picker */
export const COLOR_PRESETS: { label: string; value: string }[] = [
  { label: "بنفسجي-فوشيا", value: "from-violet-500 to-fuchsia-500" },
  { label: "أخضر-تيل", value: "from-emerald-500 to-teal-500" },
  { label: "وردي-برتقالي", value: "from-rose-500 to-orange-500" },
  { label: "سماوي-أزرق", value: "from-sky-500 to-blue-500" },
  { label: "كهرماني-أحمر", value: "from-amber-500 to-rose-500" },
  { label: "ليموني-أخضر", value: "from-lime-500 to-emerald-500" },
  { label: "بنفسجي-وردي", value: "from-purple-500 to-pink-500" },
  { label: "رمادي-أسود", value: "from-slate-600 to-slate-800" },
  { label: "ذهبي-برتقالي", value: "from-yellow-500 to-orange-600" },
  { label: "نيلي-بنفسجي", value: "from-indigo-500 to-purple-600" },
];

export const ICON_PRESETS = [
  "🤖", "✍️", "🔬", "💻", "📊", "📧", "🔧", "🎨",
  "💡", "📚", "🎯", "🚀", "⚡", "🧠", "🦾", "🌟",
  "🔍", "🌐", "📱", "🎓", "💼", "🛡️", "🎭", "🦊",
];

```

---


# 📂 Main App

## `src/app/page.tsx`

> Size: 6.1KB | Lines: 161 | Lang: tsx

```tsx
'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { ChatApp } from '@/components/chat/ChatApp';
import { PdfCreatorApp } from '@/components/pdf/PdfCreatorApp';
import { AgentsHub } from '@/components/agents/AgentsHub';
import { AuthScreen } from '@/components/anzaro/AuthScreen';
import { OnboardingFlow } from '@/components/anzaro/OnboardingFlow';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { authFetch } from '@/lib/auth-fetch';

type AppView = 'chat' | 'pdf-creator' | 'agents';

export default function DeltaAIApp() {
  const { isAuthenticated, checkAuth, setGoogleSession } = useAuthStore();
  const [appView, setAppView] = useState<AppView>('chat');
  const [initializing, setInitializing] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Check auth on mount — handle Google OAuth redirect + normal auth
  useEffect(() => {
    const init = async () => {
      try {
        // V.14: Check for Google OAuth redirect (?google_login=TOKEN in URL)
        const urlParams = new URLSearchParams(window.location.search);
        const googleToken = urlParams.get('google_login');
        const googleName = urlParams.get('google_name') || '';

        if (googleToken) {
          // Google OAuth redirect detected — inject session token into store
          console.log('[Auth] Google OAuth redirect detected, injecting session...');
          await setGoogleSession(googleToken, googleName);
          // Clean the URL (remove query params) without reload
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          // Normal auth check — read from persisted store
          await Promise.race([
            checkAuth(),
            new Promise((resolve) => setTimeout(resolve, 3000)),
          ]);
        }
      } catch (e) {
        console.warn('Auth check failed:', e);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, [checkAuth, setGoogleSession]);

  // V.66: Skip onboarding for guest users — don't force 19-question quiz
  useEffect(() => {
    if (!isAuthenticated || initializing) return;

    // Check if this is a guest user — skip onboarding entirely
    const user = useAuthStore.getState();
    const isGuest = user?.user?.email?.includes('guest') || user?.user?.name === 'زائر';

    if (isGuest) {
      console.log('[Auth] Guest user — skipping onboarding');
      setNeedsOnboarding(false);
      return;
    }

    // Only show onboarding for registered (non-guest) users
    const checkOnboarding = async () => {
      try {
        const res = await authFetch('/api/anzaro/personality/profile');
        if (res.ok) {
          const data = await res.json();
          if (!data.profile) {
            console.log('[Auth] No Identity Matrix found — showing OnboardingQuiz');
            setNeedsOnboarding(true);
          } else {
            setNeedsOnboarding(false);
          }
        } else {
          setNeedsOnboarding(false);
        }
      } catch {
        setNeedsOnboarding(false);
      }
    };
    checkOnboarding();
  }, [isAuthenticated, initializing]);

  // Loading screen — Smart Ball premium design
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aurora bg-grid relative overflow-hidden" dir="rtl">
        <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="relative flex flex-col items-center gap-6 z-10">
          <div className="relative w-20 h-20 rounded-full animate-ball-breathe"
            style={{
              background: 'radial-gradient(circle at 32% 28%, hsl(0 0% 100% / 30%), hsl(var(--primary)) 35%, hsl(var(--primary) / 0.7) 70%, hsl(var(--primary) / 0.5) 100%)',
              boxShadow: 'inset 0 2px 8px hsl(0 0% 100% / 40%), inset 0 -8px 24px hsl(0 0% 0% / 40%), 0 0 40px -4px hsl(var(--primary) / 0.5)',
            }}
          >
            <div className="absolute rounded-full" style={{ top: '18%', left: '24%', width: '28%', height: '22%', background: 'radial-gradient(ellipse, hsl(0 0% 100% / 70%), transparent 70%)', filter: 'blur(2px)' }} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-2xl font-bold text-gradient">Anzaro AI</h1>
            <p className="text-muted-foreground text-xs">Anzaro بيستعد...</p>
          </div>
          <div className="w-[140px] h-[2px] rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ animation: "bootProgress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards" }} />
          </div>
        </div>
        <style>{`@keyframes bootProgress { 0% { width: 0%; } 100% { width: 100%; } }`}</style>
      </div>
    );
  }

  // Not authenticated → show Smart Ball AuthScreen
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // V.101: Authenticated but no Identity Matrix → block with OnboardingQuiz
  if (isAuthenticated && needsOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setNeedsOnboarding(false);
          // Update auth state dynamically — no hard reload
        }}
      />
    );
  }

  // Authenticated + has Identity Matrix → show main app
  if (appView === 'pdf-creator') {
    return (
      <SessionProvider>
        <PdfCreatorApp onBackToChat={() => setAppView('chat')} />
      </SessionProvider>
    );
  }

  // V.147: Agents Hub view — unified page for all agents
  if (appView === 'agents') {
    return (
      <SessionProvider>
        <AgentsHub onBack={() => setAppView('chat')} />
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <ChatApp
        onSwitchToPdfCreator={() => setAppView('pdf-creator')}
        onSwitchToAgents={() => setAppView('agents')}
      />
    </SessionProvider>
  );
}

```

---

## `src/app/layout.tsx`

> Size: 3.3KB | Lines: 107 | Lang: tsx

```tsx
export const dynamic = 'force-dynamic';
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DirectionProvider } from "@/components/providers/direction-provider";
import { FixTransparentColors } from "@/components/FixTransparentColors";
import { ErrorSuppressor } from "@/components/ErrorSuppressor";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin", "latin-ext"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anzaro AI — ذكاء اصطناعي عربي",
  description: "Anzaro AI — منصة الذكاء الاصطناعي العربي. شات، توليد صور، بودكاست، راديو، والمزيد.",
  keywords: ["Anzaro AI", "انزارو", "AI", "Arabic AI", "ذكاء اصطناعي", "شات", "توليد صور", "بودكاست"],
  authors: [{ name: "Anzaro AI" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anzaro",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Anzaro AI — ذكاء اصطناعي عربي",
    description: "منصة الذكاء الاصطناعي العربي. شات، توليد صور، بودكاست، راديو، والمزيد.",
    siteName: "Anzaro AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anzaro AI — ذكاء اصطناعي عربي",
    description: "منصة الذكاء الاصطناعي العربي",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased bg-background text-foreground font-[family-name:var(--font-cairo)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <DirectionProvider>
            <FixTransparentColors />
      <ErrorSuppressor />
            {children}
            <PwaInstallPrompt />
          </DirectionProvider>
          <Toaster
            position="top-center"
            richColors
            closeButton
            dir="auto"
            toastOptions={{
              style: {
                borderRadius: "14px",
                fontFamily: "var(--font-cairo), -apple-system, sans-serif",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

```

---


# 📂 Skills Samples

## `skills/LLM/SKILL.md`

> Size: 21.4KB | Lines: 856 | Lang: markdown

> ⚠️ File truncated to first 500 lines (total: 856)

```markdown
---
name: LLM
description: Implement large language model (LLM) chat completions using the z-ai-web-dev-sdk. Use this skill when the user needs to build conversational AI applications, chatbots, AI assistants, or any text generation features. Supports multi-turn conversations, system prompts, and context management.
license: MIT
---

# LLM (Large Language Model) Skill

This skill guides the implementation of chat completions functionality using the z-ai-web-dev-sdk package, enabling powerful conversational AI and text generation capabilities.

## Skills Path

**Skill Location**: `{project_path}/skills/llm`

this skill is located at above path in your project.

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/chat.ts` for a working example.

## Overview

The LLM skill allows you to build applications that leverage large language models for natural language understanding and generation, including chatbots, AI assistants, content generation, and more.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple, one-off chat completions, you can use the z-ai CLI instead of writing code. This is ideal for quick tests, simple queries, or automation scripts.

### Basic Chat

```bash
# Simple question
z-ai chat --prompt "What is the capital of France?"

# Save response to file
z-ai chat -p "Explain quantum computing" -o response.json

# Stream the response
z-ai chat -p "Write a short poem" --stream
```

### With System Prompt

```bash
# Custom system prompt for specific behavior
z-ai chat \
  --prompt "Review this code: function add(a,b) { return a+b; }" \
  --system "You are an expert code reviewer" \
  -o review.json
```

### With Thinking (Chain of Thought)

```bash
# Enable thinking for complex reasoning
z-ai chat \
  --prompt "Solve this math problem: If a train travels 120km in 2 hours, what's its speed?" \
  --thinking \
  -o solution.json
```

### CLI Parameters

- `--prompt, -p <text>`: **Required** - User message content
- `--system, -s <text>`: Optional - System prompt for custom behavior
- `--thinking, -t`: Optional - Enable chain-of-thought reasoning (default: disabled)
- `--output, -o <path>`: Optional - Output file path (JSON format)
- `--stream`: Optional - Stream the response in real-time

### When to Use CLI vs SDK

**Use CLI for:**
- Quick one-off questions
- Simple automation scripts
- Testing prompts
- Single-turn conversations

**Use SDK for:**
- Multi-turn conversations with context
- Custom conversation management
- Integration with web applications
- Complex chat workflows
- Production applications

## Basic Chat Completions

### Simple Question and Answer

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function askQuestion(question) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: question
      }
    ],
    thinking: { type: 'disabled' }
  });

  const response = completion.choices[0]?.message?.content;
  return response;
}

// Usage
const answer = await askQuestion('What is the capital of France?');
console.log('Answer:', answer);
```

### Custom System Prompt

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function customAssistant(systemPrompt, userMessage) {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    thinking: { type: 'disabled' }
  });

  return completion.choices[0]?.message?.content;
}

// Usage - Code reviewer
const codeReview = await customAssistant(
  'You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.',
  'Review this function: function add(a, b) { return a + b; }'
);

// Usage - Creative writer
const story = await customAssistant(
  'You are a creative fiction writer who writes engaging short stories.',
  'Write a short story about a robot learning to paint.'
);

console.log(codeReview);
console.log(story);
```

## Multi-turn Conversations

### Conversation History Management

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class ConversationManager {
  constructor(systemPrompt = 'You are a helpful assistant.') {
    this.messages = [
      {
        role: 'assistant',
        content: systemPrompt
      }
    ];
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async sendMessage(userMessage) {
    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    // Get completion
    const completion = await this.zai.chat.completions.create({
      messages: this.messages,
      thinking: { type: 'disabled' }
    });

    const assistantResponse = completion.choices[0]?.message?.content;

    // Add assistant response to history
    this.messages.push({
      role: 'assistant',
      content: assistantResponse
    });

    return assistantResponse;
  }

  getHistory() {
    return this.messages;
  }

  clearHistory(systemPrompt = 'You are a helpful assistant.') {
    this.messages = [
      {
        role: 'assistant',
        content: systemPrompt
      }
    ];
  }

  getMessageCount() {
    // Subtract 1 for system message
    return this.messages.length - 1;
  }
}

// Usage
const conversation = new ConversationManager();
await conversation.initialize();

const response1 = await conversation.sendMessage('Hi, my name is John.');
console.log('AI:', response1);

const response2 = await conversation.sendMessage('What is my name?');
console.log('AI:', response2); // Should remember the name is John

console.log('Total messages:', conversation.getMessageCount());
```

### Context-Aware Conversations

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class ContextualChat {
  constructor() {
    this.messages = [];
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async startConversation(role, context) {
    // Set up system prompt with context
    const systemPrompt = `You are ${role}. Context: ${context}`;
    
    this.messages = [
      {
        role: 'assistant',
        content: systemPrompt
      }
    ];
  }

  async chat(userMessage) {
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    const completion = await this.zai.chat.completions.create({
      messages: this.messages,
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content;

    this.messages.push({
      role: 'assistant',
      content: response
    });

    return response;
  }
}

// Usage - Customer support scenario
const support = new ContextualChat();
await support.initialize();

await support.startConversation(
  'a customer support agent for TechCorp',
  'The user has ordered product #12345 which is delayed due to shipping issues.'
);

const reply1 = await support.chat('Where is my order?');
console.log('Support:', reply1);

const reply2 = await support.chat('Can I get a refund?');
console.log('Support:', reply2);
```

## Advanced Use Cases

### Content Generation

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class ContentGenerator {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async generateBlogPost(topic, tone = 'professional') {
    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are a professional content writer. Write in a ${tone} tone.`
        },
        {
          role: 'user',
          content: `Write a blog post about: ${topic}. Include an introduction, main points, and conclusion.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content;
  }

  async generateProductDescription(productName, features) {
    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert at writing compelling product descriptions for e-commerce.'
        },
        {
          role: 'user',
          content: `Write a product description for "${productName}". Key features: ${features.join(', ')}.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content;
  }

  async generateEmailResponse(originalEmail, intent) {
    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a professional email writer. Write clear, concise, and polite emails.'
        },
        {
          role: 'user',
          content: `Original email: "${originalEmail}"\n\nWrite a ${intent} response.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content;
  }
}

// Usage
const generator = new ContentGenerator();
await generator.initialize();

const blogPost = await generator.generateBlogPost(
  'The Future of Artificial Intelligence',
  'informative'
);
console.log('Blog Post:', blogPost);

const productDesc = await generator.generateProductDescription(
  'Smart Watch Pro',
  ['Heart rate monitoring', 'GPS tracking', 'Waterproof', '7-day battery life']
);
console.log('Product Description:', productDesc);
```

### Data Analysis and Summarization

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function analyzeData(data, analysisType) {
  const zai = await ZAI.create();

  const prompts = {
    summarize: 'You are a data analyst. Summarize the key insights from the data.',
    trend: 'You are a data analyst. Identify trends and patterns in the data.',
    recommendation: 'You are a business analyst. Provide actionable recommendations based on the data.'
  };

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: prompts[analysisType] || prompts.summarize
      },
      {
        role: 'user',
        content: `Analyze this data:\n\n${JSON.stringify(data, null, 2)}`
      }
    ],
    thinking: { type: 'disabled' }
  });

  return completion.choices[0]?.message?.content;
}

// Usage
const salesData = {
  Q1: { revenue: 100000, customers: 250 },
  Q2: { revenue: 120000, customers: 280 },
  Q3: { revenue: 150000, customers: 320 },
  Q4: { revenue: 180000, customers: 380 }
};

const summary = await analyzeData(salesData, 'summarize');
const trends = await analyzeData(salesData, 'trend');
const recommendations = await analyzeData(salesData, 'recommendation');

console.log('Summary:', summary);
console.log('Trends:', trends);
console.log('Recommendations:', recommendations);
```

### Code Generation and Debugging

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class CodeAssistant {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async generateCode(description, language) {
    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are an expert ${language} programmer. Write clean, efficient, and well-commented code.`
        },
        {
          role: 'user',
          content: `Write ${language} code to: ${description}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content;
  }

  async debugCode(code, issue) {
    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert debugger. Identify bugs and suggest fixes.'
        },
        {
          role: 'user',
          content: `Code:\n${code}\n\nIssue: ${issue}\n\nFind the bug and suggest a fix.`
        }
      ],
      thinking: { type: 'disabled' }
    });

    return completion.choices[0]?.message?.content;
  }

  async explainCode(code) {
    const completion = await this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are a programming teacher. Explain code clearly and simply.'
        },
        {
          role: 'user',

```

---

## `skills/TTS/SKILL.md`

> Size: 19.6KB | Lines: 735 | Lang: markdown

> ⚠️ File truncated to first 500 lines (total: 735)

```markdown
---
name: TTS
description: Implement text-to-speech (TTS) capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to convert text into natural-sounding speech, create audio content, build voice-enabled applications, or generate spoken audio files. Supports multiple voices, adjustable speed, and various audio formats.
license: MIT
---

# TTS (Text to Speech) Skill

This skill guides the implementation of text-to-speech (TTS) functionality using the z-ai-web-dev-sdk package, enabling conversion of text into natural-sounding speech audio.

## Skills Path

**Skill Location**: `{project_path}/skills/TTS`

This skill is located at the above path in your project.

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/tts.ts` for a working example.

## Overview

Text-to-Speech allows you to build applications that generate spoken audio from text input, supporting various voices, speeds, and output formats for diverse use cases.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## API Limitations and Constraints

Before implementing TTS functionality, be aware of these important limitations:

### Input Text Constraints
- **Maximum length**: 1024 characters per request
- Text exceeding this limit must be split into smaller chunks

### Audio Parameters
- **Speed range**: 0.5 to 2.0
  - 0.5 = half speed (slower)
  - 1.0 = normal speed (default)
  - 2.0 = double speed (faster)
- **Volume range**: Greater than 0, up to 10
  - Default: 1.0
  - Values must be greater than 0 (exclusive) and up to 10 (inclusive)

### Format and Streaming
- **Streaming limitation**: When `stream: true` is enabled, only `pcm` format is supported
- **Non-streaming**: Supports `wav`, `pcm`, and `mp3` formats
- **Sample rate**: 24000 Hz (recommended)

### Best Practice for Long Text
```javascript
function splitTextIntoChunks(text, maxLength = 1000) {
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  
  return chunks;
}
```

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple text-to-speech conversions, you can use the z-ai CLI instead of writing code. This is ideal for quick audio generation, testing voices, or simple automation.

### Basic TTS

```bash
# Convert text to speech (default WAV format)
z-ai tts --input "Hello, world" --output ./hello.wav

# Using short options
z-ai tts -i "Hello, world" -o ./hello.wav
```

### Different Voices and Speed

```bash
# Use specific voice
z-ai tts -i "Welcome to our service" -o ./welcome.wav --voice tongtong

# Adjust speech speed (0.5-2.0)
z-ai tts -i "This is faster speech" -o ./fast.wav --speed 1.5

# Slower speech
z-ai tts -i "This is slower speech" -o ./slow.wav --speed 0.8
```

### Different Output Formats

```bash
# MP3 format
z-ai tts -i "Hello World" -o ./hello.mp3 --format mp3

# WAV format (default)
z-ai tts -i "Hello World" -o ./hello.wav --format wav

# PCM format
z-ai tts -i "Hello World" -o ./hello.pcm --format pcm
```

### Streaming Output

```bash
# Stream audio generation
z-ai tts -i "This is a longer text that will be streamed" -o ./stream.wav --stream
```

### CLI Parameters

- `--input, -i <text>`: **Required** - Text to convert to speech (max 1024 characters)
- `--output, -o <path>`: **Required** - Output audio file path
- `--voice, -v <voice>`: Optional - Voice type (default: tongtong)
- `--speed, -s <number>`: Optional - Speech speed, 0.5-2.0 (default: 1.0)
- `--format, -f <format>`: Optional - Output format: wav, mp3, pcm (default: wav)
- `--stream`: Optional - Enable streaming output (only supports pcm format)

### When to Use CLI vs SDK

**Use CLI for:**
- Quick text-to-speech conversions
- Testing different voices and speeds
- Simple batch audio generation
- Command-line automation scripts

**Use SDK for:**
- Dynamic audio generation in applications
- Integration with web services
- Custom audio processing pipelines
- Production applications with complex requirements

## Basic TTS Implementation

### Simple Text to Speech

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function textToSpeech(text, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'tongtong',
    speed: 1.0,
    response_format: 'wav',
    stream: false
  });

  // Get array buffer from Response object
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  console.log(`Audio saved to ${outputPath}`);
  return outputPath;
}

// Usage
await textToSpeech('Hello, world!', './output.wav');
```

### Multiple Voice Options

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateWithVoice(text, voice, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: text,
    voice: voice, // Available voices: tongtong, chuichui, xiaochen, jam, kazi, douji, luodo
    speed: 1.0,
    response_format: 'wav',
    stream: false
  });

  // Get array buffer from Response object
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage
await generateWithVoice('Welcome to our service', 'tongtong', './welcome.wav');
```

### Adjustable Speed

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateWithSpeed(text, speed, outputPath) {
  const zai = await ZAI.create();

  // Speed range: 0.5 to 2.0 (API constraint)
  // 0.5 = half speed (slower)
  // 1.0 = normal speed (default)
  // 2.0 = double speed (faster)
  // Values outside this range will cause API errors

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'tongtong',
    speed: speed,
    response_format: 'wav',
    stream: false
  });

  // Get array buffer from Response object
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage - slower narration
await generateWithSpeed('This is an important announcement', 0.8, './slow.wav');

// Usage - faster narration
await generateWithSpeed('Quick update', 1.3, './fast.wav');
```

### Adjustable Volume

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateWithVolume(text, volume, outputPath) {
  const zai = await ZAI.create();

  // Volume range: greater than 0, up to 10 (API constraint)
  // Values must be > 0 (exclusive) and <= 10 (inclusive)
  // Default: 1.0 (normal volume)

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'tongtong',
    speed: 1.0,
    volume: volume, // Optional parameter
    response_format: 'wav',
    stream: false
  });

  // Get array buffer from Response object
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage - louder audio
await generateWithVolume('This is an announcement', 5.0, './loud.wav');

// Usage - quieter audio
await generateWithVolume('Whispered message', 0.5, './quiet.wav');
```

## Advanced Use Cases

### Batch Processing

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function batchTextToSpeech(textArray, outputDir) {
  const zai = await ZAI.create();
  const results = [];

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < textArray.length; i++) {
    try {
      const text = textArray[i];
      const outputPath = path.join(outputDir, `audio_${i + 1}.wav`);

      const response = await zai.audio.tts.create({
        input: text,
        voice: 'tongtong',
        speed: 1.0,
        response_format: 'wav',
        stream: false
      });

      // Get array buffer from Response object
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));

      fs.writeFileSync(outputPath, buffer);
      results.push({
        success: true,
        text,
        path: outputPath
      });
    } catch (error) {
      results.push({
        success: false,
        text: textArray[i],
        error: error.message
      });
    }
  }

  return results;
}

// Usage
const texts = [
  'Welcome to chapter one',
  'Welcome to chapter two',
  'Welcome to chapter three'
];

const results = await batchTextToSpeech(texts, './audio-output');
console.log('Generated:', results.length, 'audio files');
```

### Dynamic Content Generation

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

class TTSGenerator {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async generateAudio(text, options = {}) {
    const {
      voice = 'tongtong',
      speed = 1.0,
      format = 'wav'
    } = options;

    const response = await this.zai.audio.tts.create({
      input: text,
      voice: voice,
      speed: speed,
      response_format: format,
      stream: false
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(new Uint8Array(arrayBuffer));
  }

  async saveAudio(text, outputPath, options = {}) {
    const buffer = await this.generateAudio(text, options);
    if (buffer) {
      fs.writeFileSync(outputPath, buffer);
      return outputPath;
    }
    return null;
  }
}

// Usage
const generator = new TTSGenerator();
await generator.initialize();

await generator.saveAudio(
  'Hello, this is a test',
  './output.wav',
  { speed: 1.2 }
);
```

### Next.js API Route Example

```javascript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'tongtong', speed = 1.0 } = await req.json();

    // Import ZAI SDK
    const ZAI = (await import('z-ai-web-dev-sdk')).default;

    // Create SDK instance
    const zai = await ZAI.create();

    // Generate TTS audio
    const response = await zai.audio.tts.create({
      input: text.trim(),
      voice: voice,
      speed: speed,
      response_format: 'wav',
      stream: false,
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    // Return audio as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '生成语音失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
```

## Best Practices

### 1. Text Preparation
```javascript
function prepareTextForTTS(text) {
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Expand common abbreviations for better pronunciation
  const abbreviations = {
    'Dr.': 'Doctor',
    'Mr.': 'Mister',
    'Mrs.': 'Misses',
    'etc.': 'et cetera'
  };

  for (const [abbr, full] of Object.entries(abbreviations)) {
    text = text.replace(new RegExp(abbr, 'g'), full);
  }

  return text;
}
```

### 2. Error Handling
```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function safeTTS(text, outputPath) {
  try {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error('Text input cannot be empty');
    }

    if (text.length > 1024) {
      throw new Error('Text input exceeds maximum length of 1024 characters');
    }

    const zai = await ZAI.create();

    const response = await zai.audio.tts.create({
      input: text,
      voice: 'tongtong',
      speed: 1.0,
      response_format: 'wav',
      stream: false
    });

    // Get array buffer from Response object
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

```

---

## `skills/ASR/SKILL.md`

> Size: 15.1KB | Lines: 580 | Lang: markdown

> ⚠️ File truncated to first 500 lines (total: 580)

```markdown
---
name: ASR
description: Implement speech-to-text (ASR/automatic speech recognition) capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to transcribe audio files, convert speech to text, build voice input features, or process audio recordings. Supports base64 encoded audio files and returns accurate text transcriptions.
license: MIT
---

# ASR (Speech to Text) Skill

This skill guides the implementation of speech-to-text (ASR) functionality using the z-ai-web-dev-sdk package, enabling accurate transcription of spoken audio into text.

## Skills Path

**Skill Location**: `{project_path}/skills/ASR`

this skill is located at above path in your project.

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/asr.ts` for a working example.

## Overview

Speech-to-Text (ASR - Automatic Speech Recognition) allows you to build applications that convert spoken language in audio files into written text, enabling voice-controlled interfaces, transcription services, and audio content analysis.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple audio transcription tasks, you can use the z-ai CLI instead of writing code. This is ideal for quick transcriptions, testing audio files, or batch processing.

### Basic Transcription from File

```bash
# Transcribe an audio file
z-ai asr --file ./audio.wav

# Save transcription to JSON file
z-ai asr -f ./recording.mp3 -o transcript.json

# Transcribe and view output
z-ai asr --file ./interview.wav --output result.json
```

### Transcription from Base64

```bash
# Transcribe from base64 encoded audio
z-ai asr --base64 "UklGRiQAAABXQVZFZm10..." -o result.json

# Using short option
z-ai asr -b "base64_encoded_audio_data" -o transcript.json
```

### Streaming Output

```bash
# Stream transcription results
z-ai asr -f ./audio.wav --stream
```

### CLI Parameters

- `--file, -f <path>`: **Required** (if not using --base64) - Audio file path
- `--base64, -b <base64>`: **Required** (if not using --file) - Base64 encoded audio
- `--output, -o <path>`: Optional - Output file path (JSON format)
- `--stream`: Optional - Stream the transcription output

### Supported Audio Formats

The ASR service supports various audio formats including:
- WAV (.wav)
- MP3 (.mp3)
- Other common audio formats

### When to Use CLI vs SDK

**Use CLI for:**
- Quick audio file transcriptions
- Testing audio recognition accuracy
- Simple batch processing scripts
- One-off transcription tasks

**Use SDK for:**
- Real-time audio transcription in applications
- Integration with recording systems
- Custom audio processing workflows
- Production applications with streaming audio

## Basic ASR Implementation

### Simple Audio Transcription

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeAudio(audioFilePath) {
  const zai = await ZAI.create();

  // Read audio file and convert to base64
  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  return response.text;
}

// Usage
const transcription = await transcribeAudio('./audio.wav');
console.log('Transcription:', transcription);
```

### Transcribe Multiple Audio Files

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeBatch(audioFilePaths) {
  const zai = await ZAI.create();
  const results = [];

  for (const filePath of audioFilePaths) {
    try {
      const audioFile = fs.readFileSync(filePath);
      const base64Audio = audioFile.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio
      });

      results.push({
        file: filePath,
        success: true,
        transcription: response.text
      });
    } catch (error) {
      results.push({
        file: filePath,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

// Usage
const files = ['./interview1.wav', './interview2.wav', './interview3.wav'];
const transcriptions = await transcribeBatch(files);

transcriptions.forEach(result => {
  if (result.success) {
    console.log(`${result.file}: ${result.transcription}`);
  } else {
    console.error(`${result.file}: Error - ${result.error}`);
  }
});
```

## Advanced Use Cases

### Audio File Processing with Metadata

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function transcribeWithMetadata(audioFilePath) {
  const zai = await ZAI.create();

  // Get file metadata
  const stats = fs.statSync(audioFilePath);
  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const startTime = Date.now();

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  const endTime = Date.now();

  return {
    filename: path.basename(audioFilePath),
    filepath: audioFilePath,
    fileSize: stats.size,
    transcription: response.text,
    wordCount: response.text.split(/\s+/).length,
    processingTime: endTime - startTime,
    timestamp: new Date().toISOString()
  };
}

// Usage
const result = await transcribeWithMetadata('./meeting_recording.wav');
console.log('Transcription Details:', JSON.stringify(result, null, 2));
```

### Real-time Audio Processing Service

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

class ASRService {
  constructor() {
    this.zai = null;
    this.transcriptionCache = new Map();
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  generateCacheKey(audioBuffer) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(audioBuffer).digest('hex');
  }

  async transcribe(audioFilePath, useCache = true) {
    const audioBuffer = fs.readFileSync(audioFilePath);
    const cacheKey = this.generateCacheKey(audioBuffer);

    // Check cache
    if (useCache && this.transcriptionCache.has(cacheKey)) {
      return {
        transcription: this.transcriptionCache.get(cacheKey),
        cached: true
      };
    }

    // Transcribe audio
    const base64Audio = audioBuffer.toString('base64');

    const response = await this.zai.audio.asr.create({
      file_base64: base64Audio
    });

    // Cache result
    if (useCache) {
      this.transcriptionCache.set(cacheKey, response.text);
    }

    return {
      transcription: response.text,
      cached: false
    };
  }

  clearCache() {
    this.transcriptionCache.clear();
  }

  getCacheSize() {
    return this.transcriptionCache.size;
  }
}

// Usage
const asrService = new ASRService();
await asrService.initialize();

const result1 = await asrService.transcribe('./audio.wav');
console.log('First call (not cached):', result1);

const result2 = await asrService.transcribe('./audio.wav');
console.log('Second call (cached):', result2);
```

### Directory Transcription

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function transcribeDirectory(directoryPath, outputJsonPath) {
  const zai = await ZAI.create();

  // Get all audio files
  const files = fs.readdirSync(directoryPath);
  const audioFiles = files.filter(file => 
    /\.(wav|mp3|m4a|flac|ogg)$/i.test(file)
  );

  const results = {
    directory: directoryPath,
    totalFiles: audioFiles.length,
    processedAt: new Date().toISOString(),
    transcriptions: []
  };

  for (const filename of audioFiles) {
    const filePath = path.join(directoryPath, filename);

    try {
      const audioFile = fs.readFileSync(filePath);
      const base64Audio = audioFile.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio
      });

      results.transcriptions.push({
        filename: filename,
        success: true,
        text: response.text,
        wordCount: response.text.split(/\s+/).length
      });

      console.log(`✓ Transcribed: ${filename}`);
    } catch (error) {
      results.transcriptions.push({
        filename: filename,
        success: false,
        error: error.message
      });

      console.error(`✗ Failed: ${filename} - ${error.message}`);
    }
  }

  // Save results to JSON
  fs.writeFileSync(
    outputJsonPath,
    JSON.stringify(results, null, 2)
  );

  return results;
}

// Usage
const results = await transcribeDirectory(
  './audio-recordings',
  './transcriptions.json'
);

console.log(`\nProcessed ${results.totalFiles} files`);
console.log(`Successful: ${results.transcriptions.filter(t => t.success).length}`);
console.log(`Failed: ${results.transcriptions.filter(t => !t.success).length}`);
```

## Best Practices

### 1. Audio Format Handling

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeAnyFormat(audioFilePath) {
  // Supported formats: WAV, MP3, M4A, FLAC, OGG, etc.
  const validExtensions = ['.wav', '.mp3', '.m4a', '.flac', '.ogg'];
  const ext = audioFilePath.toLowerCase().substring(audioFilePath.lastIndexOf('.'));

  if (!validExtensions.includes(ext)) {
    throw new Error(`Unsupported audio format: ${ext}`);
  }

  const zai = await ZAI.create();
  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  return response.text;
}
```

### 2. Error Handling

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function safeTranscribe(audioFilePath) {
  try {
    // Validate file exists
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`File not found: ${audioFilePath}`);
    }

    // Check file size (e.g., limit to 100MB)
    const stats = fs.statSync(audioFilePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > 100) {
      throw new Error(`File too large: ${fileSizeMB.toFixed(2)}MB (max 100MB)`);
    }

    // Transcribe
    const zai = await ZAI.create();
    const audioFile = fs.readFileSync(audioFilePath);
    const base64Audio = audioFile.toString('base64');

    const response = await zai.audio.asr.create({
      file_base64: base64Audio
    });

    if (!response.text || response.text.trim().length === 0) {
      throw new Error('Empty transcription result');
    }

    return {
      success: true,
      transcription: response.text,
      filePath: audioFilePath,
      fileSize: stats.size
    };
  } catch (error) {
    console.error('Transcription error:', error);
    return {
      success: false,
      error: error.message,
      filePath: audioFilePath
    };
  }
}
```

### 3. Post-Processing Transcriptions

```javascript
function cleanTranscription(text) {
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Capitalize first letter of sentences
  text = text.replace(/(^\w|[.!?]\s+\w)/g, match => match.toUpperCase());

  // Remove filler words (optional)
  const fillers = ['um', 'uh', 'ah', 'like', 'you know'];
  const fillerPattern = new RegExp(`\\b(${fillers.join('|')})\\b`, 'gi');
  text = text.replace(fillerPattern, '').replace(/\s+/g, ' ');

  return text;
}

async function transcribeAndClean(audioFilePath) {
  const zai = await ZAI.create();
  
  const audioFile = fs.readFileSync(audioFilePath);
  const base64Audio = audioFile.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  return {
    raw: response.text,
    cleaned: cleanTranscription(response.text)
  };
}
```

## Common Use Cases

1. **Meeting Transcription**: Convert recorded meetings into searchable text
2. **Interview Processing**: Transcribe interviews for analysis and documentation
3. **Podcast Transcription**: Create text versions of podcast episodes
4. **Voice Notes**: Convert voice memos to text for easier reference
5. **Call Center Analytics**: Analyze customer service calls
6. **Accessibility**: Provide text alternatives for audio content
7. **Voice Commands**: Enable voice-controlled applications
8. **Language Learning**: Transcribe pronunciation practice

## Integration Examples

### Express.js API Endpoint

```javascript
import express from 'express';
import multer from 'multer';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'uploads/' });

let zaiInstance;

async function initZAI() {
  zaiInstance = await ZAI.create();
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });

```

---

## `skills/VLM/SKILL.md`

> Size: 14.0KB | Lines: 588 | Lang: markdown

> ⚠️ File truncated to first 500 lines (total: 588)

```markdown
---
name: VLM
description: Implement vision-based AI chat capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to analyze images, describe visual content, or create applications that combine image understanding with conversational AI. Supports image URLs and base64 encoded images for multimodal interactions.
license: MIT
---

# VLM(Vision Chat) Skill

This skill guides the implementation of vision chat functionality using the z-ai-web-dev-sdk package, enabling AI models to understand and respond to images combined with text prompts.

## Skills Path

**Skill Location**: `{project_path}/skills/VLM`

this skill is located at above path in your project.

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/vlm.ts` for a working example.

## Overview

Vision Chat allows you to build applications that can analyze images, extract information from visual content, and answer questions about images through natural language conversation.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple image analysis tasks, you can use the z-ai CLI instead of writing code. This is ideal for quick image descriptions, testing vision capabilities, or simple automation.

### Basic Image Analysis

```bash
# Describe an image from URL
z-ai vision --prompt "What's in this image?" --image "https://example.com/photo.jpg"

# Using short options
z-ai vision -p "Describe this image" -i "https://example.com/image.png"
```

### Analyze Local Images

```bash
# Analyze a local image file
z-ai vision -p "What objects are in this photo?" -i "./photo.jpg"

# Save response to file
z-ai vision -p "Describe the scene" -i "./landscape.png" -o description.json
```

### Multiple Images

```bash
# Analyze multiple images at once
z-ai vision \
  -p "Compare these two images" \
  -i "./photo1.jpg" \
  -i "./photo2.jpg" \
  -o comparison.json

# Multiple images with detailed analysis
z-ai vision \
  --prompt "What are the differences between these images?" \
  --image "https://example.com/before.jpg" \
  --image "https://example.com/after.jpg"
```

### With Thinking (Chain of Thought)

```bash
# Enable thinking for complex visual reasoning
z-ai vision \
  -p "Count the number of people in this image and describe their activities" \
  -i "./crowd.jpg" \
  --thinking \
  -o analysis.json
```

### Streaming Output

```bash
# Stream the vision analysis
z-ai vision -p "Describe this image in detail" -i "./photo.jpg" --stream
```

### CLI Parameters

- `--prompt, -p <text>`: **Required** - Question or instruction about the image(s)
- `--image, -i <URL or path>`: Optional - Image URL or local file path (can be used multiple times)
- `--thinking, -t`: Optional - Enable chain-of-thought reasoning (default: disabled)
- `--output, -o <path>`: Optional - Output file path (JSON format)
- `--stream`: Optional - Stream the response in real-time

### Supported Image Formats

- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)
- WebP (.webp)
- BMP (.bmp)

### When to Use CLI vs SDK

**Use CLI for:**
- Quick image analysis
- Testing vision model capabilities
- One-off image descriptions
- Simple automation scripts

**Use SDK for:**
- Multi-turn conversations with images
- Dynamic image analysis in applications
- Batch processing with custom logic
- Production applications with complex workflows

## Recommended Approach

For better performance and reliability, use base64 encoding to pass images to the model instead of image URLs.

## Supported Content Types

The Vision Chat API supports three types of media content:

### 1. **image_url** - For Image Files
Use this type for static images (PNG, JPEG, GIF, WebP, etc.)
```typescript
{
    role: 'user',
    content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } }
    ]
}
```

### 2. **video_url** - For Video Files
Use this type for video content (MP4, AVI, MOV, etc.)
```typescript
{
    role: 'user',
    content: [
        { type: 'text', text: prompt },
        { type: 'video_url', video_url: { url: videoUrl } }
    ]
}
```

### 3. **file_url** - For Document Files
Use this type for document files (PDF, DOCX, TXT, etc.)
```typescript
{
    role: 'user',
    content: [
        { type: 'text', text: prompt },
        { type: 'file_url', file_url: { url: fileUrl } }
    ]
}
```

**Note**: You can combine multiple content types in a single message. For example, you can include both text and multiple images, or text with both an image and a document.

## Basic Vision Chat Implementation

### Single Image Analysis

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function analyzeImage(imageUrl, question) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: question
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}

// Usage
const result = await analyzeImage(
  'https://example.com/product.jpg',
  'Describe this product in detail'
);
console.log('Analysis:', result);
```

### Multiple Images Analysis

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function compareImages(imageUrls, question) {
  const zai = await ZAI.create();

  const content = [
    {
      type: 'text',
      text: question
    },
    ...imageUrls.map(url => ({
      type: 'image_url',
      image_url: { url }
    }))
  ];

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: content
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}

// Usage
const comparison = await compareImages(
  [
    'https://example.com/before.jpg',
    'https://example.com/after.jpg'
  ],
  'Compare these two images and describe the differences'
);
```

### Base64 Image Support

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function analyzeLocalImage(imagePath, question) {
  const zai = await ZAI.create();

  // Read image file and convert to base64
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: question
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`
            }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}
```

## Advanced Use Cases

### Conversational Vision Chat

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class VisionChatSession {
  constructor() {
    this.messages = [];
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async addImage(imageUrl, initialQuestion) {
    this.messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: initialQuestion
        },
        {
          type: 'image_url',
          image_url: { url: imageUrl }
        }
      ]
    });

    return this.getResponse();
  }

  async followUp(question) {
    this.messages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: question
        }
      ]
    });

    return this.getResponse();
  }

  async getResponse() {
    const response = await this.zai.chat.completions.createVision({
      messages: this.messages,
      thinking: { type: 'disabled' }
    });

    const assistantMessage = response.choices[0]?.message?.content;
    
    this.messages.push({
      role: 'assistant',
      content: assistantMessage
    });

    return assistantMessage;
  }
}

// Usage
const session = new VisionChatSession();
await session.initialize();

const initial = await session.addImage(
  'https://example.com/chart.jpg',
  'What does this chart show?'
);
console.log('Initial analysis:', initial);

const followup = await session.followUp('What are the key trends?');
console.log('Follow-up:', followup);
```

### Image Classification and Tagging

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function classifyImage(imageUrl) {
  const zai = await ZAI.create();

  const prompt = `Analyze this image and provide:
1. Main subject/category
2. Key objects detected
3. Scene description
4. Suggested tags (comma-separated)

Format your response as JSON.`;

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  const content = response.choices[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    return { rawResponse: content };
  }
}
```

### OCR and Text Extraction

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function extractText(imageUrl) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all text from this image. Preserve the layout and formatting as much as possible.'
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}
```

## Best Practices

### 1. Image Quality and Size
- Use high-quality images for better analysis results
- Optimize image size to balance quality and processing speed
- Supported formats: JPEG, PNG, WebP

### 2. Prompt Engineering
- Be specific about what information you need from the image
- Structure complex requests with numbered lists or bullet points
- Provide context about the image type (photo, diagram, chart, etc.)

### 3. Error Handling
```javascript
async function safeVisionChat(imageUrl, question) {
  try {
    const zai = await ZAI.create();
    
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    return {
      success: true,
      content: response.choices[0]?.message?.content
    };
  } catch (error) {
    console.error('Vision chat error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

### 4. Performance Optimization
- Cache SDK instance creation when processing multiple images
- Use appropriate image formats (JPEG for photos, PNG for diagrams)
- Consider image preprocessing for large batches

### 5. Security Considerations
- Validate image URLs before processing
- Sanitize user-provided image data
- Implement rate limiting for public-facing APIs
- Never expose SDK credentials in client-side code

## Common Use Cases

1. **Product Analysis**: Analyze product images for e-commerce applications

```

---

## `skills/docx/SKILL.md`

> Size: 11.7KB | Lines: 201 | Lang: markdown

```markdown
---
name: docx
metadata:
  author: Z.AI
  version: "1.0"
description: "Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. When GLM needs to work with professional documents (.docx files) for: (1) Creating new documents, (2) Modifying or editing content, (3) Working with tracked changes, (4) Adding comments, or any other document tasks"
license: Proprietary. LICENSE.txt has complete terms
---

# DOCX Creation, Editing, and Analysis

## Quick Setup

```bash
bash "$SKILL_DIR/setup.sh"    # Interactive environment check + install
```

## Overview

A .docx file is a ZIP archive containing XML files. This skill provides tools for creating, editing, reading, and reviewing Word documents.

## Quick Route — Read This First

**Step 1**: Determine task type → load the corresponding route file
**Step 2**: Determine business scene → load the corresponding scene file (if applicable)
**Step 3**: Load `references/design-system.md` for cover recipes, palettes, and chart colors
**Step 4**: Load `references/common-rules.md` for shared layout, font, and quality rules
**Step 5**: Execute per route instructions
**Step 6**: Run the post-generation checklist

⚠️ **MANDATORY — Cover Recipe Enforcement (Step 3):**
When creating a document that needs a cover page, you MUST use one of the 7 validated cover recipes (R1–R7) from `design-system.md`. **Free-form cover code is FORBIDDEN.** The recipe provides the wrapper table, background, layout structure, border settings, and spacing — do not reinvent any of these.

Workflow: (1) Call `selectCoverRecipe(docType, industry)` to get recipe + palette → (2) Use the corresponding `buildCoverRX()` function code from `design-system.md` → (3) Pass your `config` (title, subtitle, metaLines, etc.) into the recipe builder. If you skip this and write cover code from scratch, the cover WILL have compatibility issues (blank pages in MS Office, missing borders, overflow, etc.).

### Script Path Setup (MANDATORY before any script call)

All CLI tools live in `scripts/` relative to this skill's directory. Before calling any script, resolve the absolute path once:

```bash
DOCX_SCRIPTS="<skill_directory>/scripts"   # ← parent directory of this SKILL.md

# Then all commands use $DOCX_SCRIPTS:
python3 "$DOCX_SCRIPTS/postcheck.py" output.docx
python3 "$DOCX_SCRIPTS/add_toc_placeholders.py" output.docx --auto
```

**For Python imports** (when generation code needs to import skill modules):

```python
import sys, os
DOCX_SCRIPTS = os.path.join("<skill_directory>", "scripts")
if DOCX_SCRIPTS not in sys.path:
    sys.path.insert(0, DOCX_SCRIPTS)
```

**⚠️ NEVER use bare `python3 scripts/...`** — it only works if cwd happens to be the skill directory. Always use the absolute `$DOCX_SCRIPTS` path.

### Task Router

| User Intent | Route | Files to Load |
|-------------|-------|---------------|
| Create/write/generate (no attachment) | **Create** | `routes/create.md` + `references/docx-js-core.md` |
| Edit/modify/revise (has attachment) | **Edit** | `routes/edit.md` + `references/ooxml.md` |
| Format/layout/font/margin | **Format** | `routes/format.md` |
| Comment/annotate/review | **Comment** | `routes/comment.md` |
| Read/analyze/extract | **Read** | `routes/read.md` |

### Scene Router (Optional — load after route)

| User Keywords | Scene | File |
|---------------|-------|------|
| thesis, academic, research, paper, dissertation, abstract, journal | Academic | `scenes/academic.md` |
| report, analysis, experiment, testing, survey, review, summary, proposal, feasibility, competitor, industry, operations | Report | `scenes/report.md` |
| contract, agreement, terms, transfer, NDA, confidential, framework, cooperation, service terms, user agreement, procurement | Contract | `scenes/contract.md` |
| resume, CV, job application | Resume | `scenes/resume.md` |
| exam, test, quiz, paper (exam context), lesson plan | Exam | `scenes/exam.md` |
| official document, notice, letter, reply, minutes, red header, government, issuance | Official | `scenes/official-doc.md` |
| broadcast script, product copy, livestream, speech, presentation script, video script | Copywriting | `scenes/copywriting.md` |
| plan, proposal (if not report context) | Report | `scenes/report.md` |
| policy, regulation, standard, management rules | Official | `scenes/official-doc.md` |

**If no scene matches**, use default design rules from `references/design-system.md` and `references/common-rules.md`.

## Formatting Standards (Always Apply)

→ See `references/common-rules.md` for full font profiles, spacing, indent, and layout rules.

**Key rules (quick reference):**
- **Line spacing**: 1.3x (`line: 312`) — MANDATORY. Exceptions: resume 1.15x, official doc 28pt fixed, copywriting `400`, contract 1.5x
- **CJK body**: Justified + 2-char indent (`firstLine: 480` SimSun / `420` YaHei)
- **Tables**: `margins` set, `ShadingType.CLEAR`, `tableHeader: true`, `cantSplit: true`, title `keepNext: true`
- **Images**: `type` parameter required, preserve aspect ratio via `image-size`, PageBreak inside Paragraph
- **Full-page Table row**: `rule: "exact"` with 1200 twips safety margin

## Unit Quick Reference

| Unit | Value |
|------|-------|
| 1 cm | 567 twips |
| 1 inch | 1440 twips |
| 1 pt | 20 half-points |
| A4 | 11906 × 16838 twips |

For Chinese font size table and common margins, see `references/common-rules.md`.

## Post-Generation — Two-Layer Verification

### Layer 1: Manual Checklist (self-check during generation)

#### Basic Format
- [ ] Line spacing is 1.3x (`line: 312`) or scene-specific override
- [ ] CJK body has 2-char indent (`firstLine: 480` or `420`)
- [ ] Tables have margins set
- [ ] Images preserve aspect ratio via `image-size` — NEVER hardcode both width and height
- [ ] PageBreak inside Paragraph
- [ ] ShadingType uses CLEAR
- [ ] Each numbered list uses unique `reference`
- [ ] **⚠️ CRITICAL — Quotation marks in JS strings properly escaped.** Chinese curly quotes (`""` `''`) MUST use Unicode escapes (`\u201c` `\u201d` `\u2018` `\u2019`); straight quotes (`"` `'`) use `\"` `\'` or alternate delimiters. **This is the #1 most common code generation bug.** Chinese text frequently contains `""` for emphasis or proper nouns (e.g., "双11", "前低后高", "618") — every occurrence MUST be escaped. Failure to escape produces JS syntax errors that silently break document generation.
- [ ] ImageRun includes `type` parameter
- [ ] Header/footer present (unless scene says otherwise)

#### Heading Styles
- [ ] All body chapter headings use `heading: HeadingLevel.HEADING_X` (never simulate with bold + large font)
- [ ] Cover title may skip Heading style (not in TOC), but body headings MUST use Heading style

#### Page Break & Blank Page Prevention
- [ ] Cover/content in separate sections
- [ ] Three rules to prevent blank pages:
  - ① When using section(NEXT_PAGE), previous section must NOT end with PageBreak (double break = blank page)
  - ② PageBreak paragraph SHOULD contain visible text — **exception**: section-ending empty para + PageBreak is allowed (normal section separator, e.g., after cover page)
  - ③ No more than 3 consecutive empty paragraphs
- [ ] Full-page Table row height uses `rule: "exact"` (never `"atLeast"` for tall tables)
- [ ] No unwanted blank pages (check each section ending)

#### TOC
→ See `references/toc.md` for the complete TOC reference and checklist.
- [ ] If TOC title exists → `TableOfContents` element must be present
- [ ] **⚠️ MANDATORY PageBreak after TableOfContents** — a Paragraph containing PageBreak MUST immediately follow the `TableOfContents` element; without it, TOC and body content will render on the same page. This is the #1 TOC formatting failure — never omit it
- [ ] `add_toc_placeholders.py --auto` runs after generation; exit code = 0
- [ ] **TOC MUST be in its own section** — body section sets `page: { pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } }` so page numbers start from the first body page, not from the TOC pages
- [ ] **Page number API nesting** — `pageNumbers` MUST be inside `page: {}`, NOT at properties top level (see toc.md § Page Number API)
- [ ] **3-section page numbering** — Cover (no page#) → Front matter (Roman i,ii,iii, start=1) → Body (Arabic 1,2,3, start=1)
- [ ] **Post-process footers** — Roman section footer instrText must contain `PAGE \* ROMAN \* MERGEFORMAT`; Arabic section `PAGE \* arabic \* MERGEFORMAT` (WPS ignores pgNumType fmt). **⚠️ NEVER use `\* decimal` in instrText** — `decimal` is a docx-js API enum value (`NumberFormat.DECIMAL`), NOT a valid Word field format switch; using it causes page numbers to render as "1decimal", "2decimal". The correct Word field switch for Arabic numerals is `\* arabic`.
- [ ] **Remove empty pgNumType** — Post-process to strip `<w:pgNumType/>` from cover section (docx-js emits empty element that confuses WPS)
- [ ] **⚠️ TOC Refresh Hint MANDATORY** — between `TableOfContents` element and the PageBreak, MUST add an italic gray note paragraph telling users to right-click TOC → "Update Field" to refresh page numbers (see toc.md § TOC Refresh Hint)

#### Table Cross-Page
- [ ] Header rows: `tableHeader: true`
- [ ] All rows: `cantSplit: true`
- [ ] Title paragraph: `keepNext: true`

#### Cover
- [ ] **Cover MUST use a validated recipe (R1–R7)** from `design-system.md` — free-form cover code is forbidden
- [ ] Cover recipe matches document type (per `selectCoverRecipe()` in `design-system.md`)
- [ ] Cover uses the 16838 outer wrapper table with `allNoBorders` (all recipes provide this)
- [ ] Cover title uses `calcTitleLayout()` — never hardcoded font size above 40pt
- [ ] Cover spacing uses `calcCoverSpacing()` — never hardcoded large spacing values
- [ ] Cover content does not overflow (total height ≤ 15638 twips, Table uses `rule: "exact"`)
- [ ] Every TextRun on dark/colored background has explicit `color` set (Rule 9 — never rely on default black)
- [ ] Cover section has no trailing PageBreak or empty paragraphs
- [ ] Title lines split at semantic boundaries (no mid-word breaks, no single-char orphan lines)
- [ ] No text-character decorative lines (`───`, `━━━`) — use paragraph borders only

### Layer 2: Automated Post-Check Script

```bash
python3 "$DOCX_SCRIPTS/postcheck.py" output.docx
```

Automatically checks 14 business rules: blank pages, **cover overflow (font size/spacing/trailing content)**, line spacing consistency, table margins, table cross-page control (cantSplit/tblHeader), image overflow, image aspect ratio distortion, font fallback, CJK indent, heading hierarchy, ShadingType misuse, TOC quality, document cleanliness (placeholder text/Markdown/HTML residuals), report content quality (abstract presence/heading specificity/vague conclusion detection).

⚠️ **After generating any document, MUST run postcheck.py and fix all ❌ errors.**

## Math Formulas

Formula input uses **LaTeX syntax**, internally converted to docx-js Math objects.

- **Basic formulas** (fractions, sub/superscript, roots, summation) → docx-js Math components
- **Complex formulas** (3+ nesting, matrices, piecewise functions) → matplotlib PNG fallback

See `references/math-formulas.md`.

## Charts

Default: **matplotlib template library** generates PNG for embedding.

6 ready-to-use templates: bar, line, pie, box, radar, heatmap.
Colors auto-derived from document palette.accent for style consistency.
Default palette: Morandi low-saturation (see design-system.md).

See `references/chart-templates.md`.

## Dependencies

- **pandoc**: Text extraction
- **docx**: `bun add docx` or `npm install docx` (creating)
- **LibreOffice**: PDF conversion, .doc support
- **Poppler**: PDF to image (`pdftoppm`)
- **defusedxml**: Secure XML parsing
- **python-docx**: Simple comment operations

```

---

## `skills/charts/SKILL.md`

> Size: 22.1KB | Lines: 427 | Lang: markdown

```markdown
---
name: charts
metadata:
  author: Z.AI
  version: "1.0"
description: >
  Professional chart and diagram creation skill. Covers all types of visual data
  representation and structural diagrams:
  - **Data charts**: bar charts, line charts, pie charts, scatter plots, heatmaps,
    radar charts, candlestick charts, boxplots, histograms, area charts, waterfall charts,
    regression plots, distribution plots, and statistical visualizations.
  - **Structural diagrams**: flowcharts, mind maps, tree diagrams, org charts,
    architecture diagrams, network/relationship graphs, ER diagrams, class diagrams,
    Gantt charts, swimlane diagrams, and sequence diagrams.
  - **Dashboards**: data dashboards, KPI panels, multi-chart compositions,
    and interactive visualizations.
  - **Design quality**: professional color systems, anti-overlap rules, layout optimization,
    scene-based framework routing (matplotlib, seaborn, ECharts, D3.js, Mermaid, Playwright+CSS),
    and publication-ready output.
  Applies when the user wants to create, generate, draw, plot, visualize, or improve
  any chart, graph, diagram, or dashboard. Also applies when the user asks for something
  more polished, cleaner, or publication-ready.
  NOT for: PDF document layout (use pdf skill), slide decks (use slides skill),
  spreadsheets with embedded charts (use xlsx skill), AI image generation (use image_gen),
  posters / infographics / creative cards (use pdf skill Creative pipeline).
  FORBIDDEN: Using matplotlib/seaborn to draw mind maps, tree diagrams, org charts,
  flowcharts, or any structural diagram. These MUST use Playwright+CSS.
license: Proprietary. LICENSE.txt has complete terms
---

# Beautiful Charts

## Quick Setup

```bash
bash "$SKILL_DIR/setup.sh"    # Interactive environment check + install
```

Make every chart and diagram look professionally designed, not AI-generated.

## Architecture

| Module | File | When to Load |
|--------|------|-------------|
| **Routing + Core Rules** | This file | Always read first |
| **Framework Templates** | `references/` by framework | After choosing framework, read the corresponding file |

**Loading order: Read this file → choose framework → read template file → start coding.**

Each template file contains its own framework-specific rules (spacing, connectors, color details). This file contains only routing decisions and universal rules that apply to ALL charts.

---

# Part 1: Routing

## ⚠️ Format Constraint Rule (HIGHEST PRIORITY)

**When the user specifies an output format/tool, you MUST comply. Never substitute.**

| User Says | You Must Do | Forbidden |
|-----------|------------|-----------|
| "use mermaid code" / "用Mermaid格式输出" / "转化为mermaid" / "mermaid流程" | ① Output Mermaid code block (```mermaid ... ```) ② Also provide a rendered image preview | ❌ Cannot only give image without code; ❌ Cannot screenshot raw code text as image |
| "use markdown code" | Output markdown-formatted hierarchy | ❌ Cannot switch to HTML/CSS |
| "via mermaid or markdown code" | Choose one of the two, output code text | ❌ Cannot switch to any non-specified format |
| "flowchart" / "mind map" (no format specified) | Free to choose the best approach | - |
| "use echarts/d3" | Must use the specified framework | ❌ Cannot switch |

### 🚫 FORBIDDEN: Mermaid Code Screenshot
**NEVER take a screenshot of raw Mermaid source code and deliver it as the "diagram image".** This is the worst possible outcome — the user gets neither usable code nor a visual diagram. When the user requests Mermaid format:
1. **MUST** output the Mermaid code in a fenced code block (````mermaid`)
2. **SHOULD** also render the code into a visual diagram image (via mermaid-cli or Playwright + mermaid.js)
3. If rendering fails, deliver the code block and tell the user to paste it into mermaid.live

### Format Specified vs Auto-Upgrade Conflict
When the user specifies Mermaid but content triggers auto-upgrade conditions (>8 nodes, CJK-heavy, etc.):
1. **User choice wins** — still use Mermaid, deliver code block + rendered image
2. **Proactively guide** — after delivery, suggest the user try without specifying Mermaid for better layout quality
3. **Never silently switch** to Playwright+CSS when user explicitly asked for Mermaid

When a specified tool hits rendering difficulties (e.g., mermaid CDN fails):
- ✅ Output raw mermaid code text, tell user to view at mermaid.live
- ❌ Secretly switch to another framework
- ❌ Screenshot the code text as an "image"

---

## Routing Decision Tree

### 1. Structural Diagrams

#### 🔴 Flowchart Default: Phased Vertical (HIGHEST PRIORITY)

**When the user asks to "generate/create a XXX flowchart/流程图" without specifying format, the DEFAULT layout is Phased Vertical (Layout C in `references/playwright-css.md`).**

This is because nearly all real-world processes (manufacturing, legal proceedings, project management, business operations, cooking recipes, etc.) have natural phases/stages. Layout C produces the most professional, readable result.

**Flowchart routing priority:**
1. **User specified Mermaid/markdown** → follow user choice (Format Constraint Rule)
2. **≤6 nodes AND no phases AND short text** → Mermaid (simple flowchart)
3. **Everything else** → **Playwright + CSS, Layout C (Phased Vertical)** → `references/playwright-css.md`

**Phase detection — treat as "has phases" when ANY is true:**
- Content has numbered sections (一、二、三 or 1. 2. 3. or Phase 1/Stage 1)
- Process can be grouped by time/stage/role (e.g., "preparation → execution → review")
- Total steps ≥ 5 (almost always groupable into 2+ phases)
- Process involves multiple roles/departments
- Process has clear start/end with intermediate stages

**⚠️ When in doubt, default to Layout C.** A phased layout with only 1 phase still looks professional. A Grid layout with phases looks like a mess.

#### Other Structural Diagrams
- Simple flowchart (≤6 nodes, truly flat, no phases): **Mermaid**
- Complex flowchart (>6 nodes / CJK-heavy / branches / phases): **Playwright + CSS Layout C** → `references/playwright-css.md`
- Mind map / tree / org chart: **Playwright + CSS** → `references/mindmap-css.md`
- Relationship / network diagram: **ECharts graph**
- Center-radial analysis (SWOT / BSC / Porter's Five Forces / PEST): **Playwright + CSS** → `references/radial-grid.md`

### 2. Data Charts (matplotlib / seaborn)
- Standard bar/line/scatter/heatmap/radar/pie: **matplotlib**
- Regression/distribution/boxplot: **Seaborn**

### 3. Interactive Charts / Dashboards
- Data dashboard / candlestick / real-time: **ECharts**
- Fully custom interactive: **D3.js**

### Default Strategy
**One scene, one tool — don't hesitate:**

| Scene | Tool | Template |
|-------|------|----------|
| Data chart (bar/line/scatter/pie/radar) | matplotlib | `references/matplotlib.md` |
| Statistical (regression/box/dist) | Seaborn | `references/seaborn.md` |
| Mind map / tree / org chart | Playwright + CSS | `references/mindmap-css.md` |
| Center-radial (SWOT/BSC/PEST/Five Forces) | Playwright + CSS | `references/radial-grid.md` |
| **Any flowchart (default)** | **Playwright + CSS Layout C** | **`references/playwright-css.md`** |
| Simple flowchart (≤6 nodes, truly flat) | Mermaid | `references/mermaid.md` |
| Relationship / force-directed | ECharts graph | `references/echarts.md` |
| Data dashboard | ECharts | `references/echarts.md` |
| Academic paper figures | matplotlib | `references/matplotlib.md` |

---

## Mermaid Auto-Upgrade Rules

Mermaid's dagre/elk layout estimates CJK widths incorrectly. **Auto-switch to Playwright+CSS when ANY condition is met:**

| Trigger | Action |
|---------|--------|
| Total nodes > **6** | → CSS flowchart (Layout C) |
| Any node text > **12 Chinese characters** | → CSS flowchart |
| More than **3 parallel branches** | → CSS flowchart |
| Nested subgraphs > **2 levels** | → CSS flowchart |
| Connector crossings > **2** | → CSS flowchart |
| **Side annotations / dashed note boxes** | → CSS flowchart |
| **Loop-back / cycle arrows** | → CSS flowchart |
| **Process has identifiable phases/stages** | → CSS flowchart (Layout C) |

**If staying with Mermaid**: `padding: 32`, `nodeSpacing: 80`, `rankSpacing: 80`. Node text ≤ 10 CJK chars/line, wrap with `<br>`, quote all text `A["text"]`.

---

## Large Dataset Rendering

| Data Size | Approach |
|-----------|----------|
| < 1,000 points | matplotlib / any |
| 1,000 - 10,000 | matplotlib (no markers) or ECharts |
| 10,000 - 100,000 | ECharts (Canvas mode) |
| > 100,000 | ECharts (`large: true`) or WebGL |

---

# Part 2: Universal Rules

These rules apply to ALL charts regardless of framework. Framework-specific rules live in each template file.

## 7 Core Rules

1. **Zero overlap.** No element may cover another's text. Overlap = information loss = task failure. Post-generation: verify every element has clear separation.

2. **Hierarchy over uniformity.** Primary nodes larger/bolder than secondary. Annotation nodes smaller/muted. Spacing between groups > within groups. If every box looks identical, the layout has failed.

3. **Low-saturation palette.** 70% background/neutral, 20% secondary, 10% accent (one highlight only). No high-saturation large fills. Saturated colors only on borders (2px), text, and small elements.

4. **Insight first.** Titles express conclusions, not field names. Remove non-essential elements: top/right borders, grid lines, tick marks, legend box borders. If removing it doesn't reduce understanding, it shouldn't exist.

5. **Label clarity over label method.** The goal is zero overlap — choose the method that achieves it for each chart type. Direct labels, legends, and leader lines are all valid; what matters is that nothing overlaps.

### 🚫 FORBIDDEN: Any Text Overlapping Any Other Element
**No label, legend, annotation, or title may overlap any other visual element.** This is the single most common matplotlib defect. Both direct labels AND legends can cause overlap — neither is inherently safe.

**Anti-overlap decision tree:**
1. **Check if direct labels fit** — if all labels have enough space (bar tops, line endpoints, large pie slices), label directly. No legend needed.
2. **If some labels would collide** (small pie slices, dense scatter points, clustered bars) → use legend outside plot area instead of forcing labels into tight spaces.
3. **Mixed approach** — label the major items directly, group small items into "其他" or use leader lines + legend for the small ones.

**Pie chart specific (the worst offender):**
- Slices < 5%: MUST use leader lines (`wedgeprops + texts` manual repositioning, or `matplotlib.patches.ConnectionPatch`) to pull labels outside. Do NOT rely on `autopct` alone — it places text inside/near the slice.
- Multiple small adjacent slices: use `bbox_to_anchor` legend outside, NOT direct labels
- `labeldistance=1.25` minimum to keep labels outside the pie
- When >2 slices are < 5%, consider grouping all < 3% into "其他（X项）"
- Use `adjustText` library to auto-resolve label collisions when available

**Legend placement (when legend is needed):**
- Place legend **outside** the plot area using `bbox_to_anchor`
- Suggested starting positions:
  - Bar/line/scatter: right side outside (`bbox_to_anchor=(1.02, 1), loc='upper left'`)
  - Pie: right side outside (`bbox_to_anchor=(1.1, 0.5), loc='center left'`)
  - Radar: below chart (`bbox_to_anchor=(0.5, -0.15), loc='upper center'`)
  - Heatmap: no legend needed (colorbar suffices)

**🔧 Mandatory: auto-adjust legend to prevent overlap.** Copy this snippet after placing any legend:
```python
# ── Auto-adjust legend position to prevent overlap ──
fig.canvas.draw()  # must render first to get bboxes
legend = ax.get_legend()
if legend:
    renderer = fig.canvas.get_renderer()
    # Try shifting up to 5 times to resolve overlap
    for _ in range(5):
        leg_bb = legend.get_window_extent(renderer).transformed(ax.transAxes.inverted())
        has_overlap = False
        for text in ax.texts + [ax.title] + ax.get_xticklabels() + ax.get_yticklabels():
            if not text.get_text():
                continue
            txt_bb = text.get_window_extent(renderer).transformed(ax.transAxes.inverted())
            if leg_bb.overlaps(txt_bb):
                has_overlap = True
                break
        if not has_overlap:
            break
        # Move legend further outside (direction depends on current loc)
        bbox = legend.get_bbox_to_anchor().transformed(ax.transAxes.inverted())
        x0, y0 = bbox.x0, bbox.y0
        # Heuristic: if legend is below center, move down; if right of center, move right
        if y0 < 0.5:
            legend.set_bbox_to_anchor((x0, y0 - 0.08), transform=ax.transAxes)
        else:
            legend.set_bbox_to_anchor((x0 + 0.08, y0), transform=ax.transAxes)
        fig.canvas.draw()
```
- **After placing legend**: always call `plt.tight_layout()` or `fig.subplots_adjust()` to ensure legend is not clipped

🚫 FORBIDDEN:
- `loc='best'` — matplotlib's "best" frequently overlaps data
- `loc='upper right'` / `loc='lower right'` on line/bar charts — high collision risk
- Direct labels on pie slices < 5% without leader lines
- Any text placement without verifying zero overlap

6. **Font discipline.** Max 2 fonts. Chinese: SimHei/PingFang SC. Always explicitly set fonts in code. Font size follows hierarchy (title 18-24px → body 13-15px → annotation 11-13px). Never go below 10px floor. When text overflows: condense text → enlarge canvas → last resort: shrink font (but never below floor).

7. **Whitespace is design.** Chart area 60-70% of canvas, margins 15-20%. At least 16pt between title and chart. Crowded ≠ information-rich.

---

## Color System

### Recommended Palettes

| Palette | Text | Background | Block Fill | Accent |
|---------|------|------------|------------|--------|
| Business Cool | `#243447` | `#F8FAFC` | `#E9EEF3` | `#4C6EF5` |
| Tech Cyan-Gray | `#1F2937` | `#F5F7FA` | `#E6ECF2` | `#3AAFA9` |
| Morandi Warm | `#4B4A45` | `#FAF8F4` | `#EAE4DB` | `#C6866A` |
| Invisible Precision | `#37352F` | `#FFFFFF` | `#F7F7F7` | `#2383E2` |

### 🚫 Forbidden Background Colors

| Color | Forbidden Hex Values |
|-------|---------------------|
| Pure blue | `#3B82F6`, `#2563EB`, `#1D4ED8` |
| Pure green | `#10B981`, `#059669`, `#22C55E` |
| Pure red | `#EF4444`, `#DC2626`, `#F87171` |
| Pure purple | `#8B5CF6`, `#7C3AED`, `#A855F7` |
| Pure amber | `#F59E0B`, `#D97706`, `#FB923C` |

### ✅ Allowed Background Colors

| Color | Hex Values |
|-------|------------|
| Ice blue | `#EFF6FF`, `#DBEAFE` |
| Mint green | `#F0FDF4`, `#D1FAE5` |
| Light amber | `#FFF7ED`, `#FEF3C7` |
| Lavender | `#F5F3FF`, `#EDE9FE` |
| Light gray | `#F8FAFC`, `#F1F5F9` |

### Functional Color (states only, not decoration)
- Active/Selected: brand accent or `2px` accent line
- Error: `#EF4444`
- Success: `#10B981`
- Tags: light bg + dark text, never high-sat pills

### Colorblind-Safe
Don't rely on color alone — pair with shape, line style, or direct labels.
Paul Tol palette: `['#0077BB', '#33BBEE', '#009988', '#EE7733', '#CC3311', '#EE3377']`

### Dark Theme
- Background: `#0F172A` (not pure black)
- Text: `#F1F5F9` (not pure white)
- Grid: `#1E293B`, low alpha
- Export: `savefig(facecolor='#0F172A')`

---

## Export Rules

- Static charts: minimum 200 DPI, recommended 300 DPI
- Pie/radar: **square `figsize=(8, 8)`** — non-square = elliptical
- No more than 6 colors per chart (split if more)
- Bar chart Y-axis starts at 0 (line charts may truncate)
- Never use 3D (distorts proportions)

### Playwright Screenshot
Default `device_scale_factor=2`. Large mind maps (3000px+): 1.5. PDF embed: 1-1.5. Print: 3.
After render, read `bounding_box()` and resize viewport to fit. Min viewport: 800px single-col, 1200px multi-col.

### 🚫 FORBIDDEN: `max-width` on Mermaid/SVG Containers
Mermaid's dagre engine produces SVGs with unpredictable width (especially with subgraphs, CJK text, or parallel branches). **NEVER set `max-width` on the Mermaid container element.** Use `width: fit-content; min-width: 800px;` instead.

**Root cause**: Mermaid SVGs overflow their CSS container silently. `bounding_box()` (Playwright) returns the CSS box model size, NOT the SVG's actual rendered size. So auto-resize viewport based on `bounding_box()` alone will still produce clipped screenshots.

**Fix**: Always read the **SVG element's own `getBoundingClientRect()`** via `page.evaluate()`, then use `max(css_size, svg_size) + padding` for viewport dimensions. See `references/mermaid.md` for the corrected screenshot script.

### Aspect Ratio Preservation (embedding)
**MUST read actual image dimensions and calculate height proportionally. NEVER hardcode both width and height.**

---

## matplotlib-Specific Rules

These apply when routing to matplotlib/seaborn:

### Layout & Overlap
- Prefer `constrained_layout=True` over `tight_layout()`
- Use `adjustText` library for automatic label repositioning — **this is the most reliable anti-overlap tool for matplotlib.** Install: `pip install adjustText`. Usage: `from adjustText import adjust_text; adjust_text(texts)`
- Max 4 subplots per canvas. More → split images or `figsize=(20, 16)` minimum
- Multi-subplot: `GridSpec` with `wspace/hspace` ≥ 0.3
- Colorbar: `shrink=0.8` + `pad=0.08`
- Data labels: Y-axis upper limit with 15-20% headroom (`ylim(0, max_val * 1.18)`)
- Long X labels → horizontal bar chart or show every N-th label

### Radar / Spider Charts
- **Every `fill()` MUST have `alpha=0.25`** (max 0.3). Omitting alpha = opaque = hides underlying series.
- Legend: place outside chart with `bbox_to_anchor`, start with `(0.5, -0.15), loc='upper center'`. If dimension labels are long or dimensions > 8, increase offset (e.g., `-0.25` or `-0.3`). Also FORBIDDEN: `loc='lower right'` (collides with radar dimension labels).
- Dimension label padding: `set_rlim(0, max_value * 1.2)`
- Labels with >4 CJK chars: rotate to follow angle or abbreviate
- `figsize=(8, 8)` mandatory (square)

### One Color, Gray the Rest
5 lines → color only the key one, others `#D1D5DB`. 8 bars → accent only the highlight, rest `#E5E7EB`.

---

## Connector Rules (structural diagrams)

- Attach to node edges, not through centers
- Prefer orthogonal polylines or clean curves
- Main paths avoid crossing
- Never pass through text areas
- Start/end points at same level must align (no staggering)
- Same-level connectors follow same direction
- Bend angles consistent (all right-angles or all curves, no mixing)
- Label positions uniform (all above line or all centered)

---

## Pre-Output Checklist

Before delivery, verify:

- [ ] Zero overlap (nodes, connectors, labels, legends — **especially check legend vs data, and adjacent pie/bar labels**)
- [ ] No connectors pass through text boxes
- [ ] Clear hierarchy (primary/secondary/annotation visually distinct)
- [ ] Low-saturation palette (no forbidden background colors)
- [ ] Text readable at final size (standalone: ≥12px body, ≥10px annotation; PDF embed: ≥10pt/8pt/7pt)
- [ ] Legend fully visible, not clipped, not overlapping any chart element
- [ ] Canvas wide/tall enough (check bounding box before screenshot)
- [ ] **If mind map**: each level distinct (≥3 property changes), connectors visible (≥ `#94A3B8`), left-right balanced
- [ ] **If flowchart**: phase titles distinct from steps, arrows only between phases, **using Layout C by default**
- [ ] **If flowchart**: phase colors are same-hue family (blue-gray progression), **NOT rainbow** (blue→green→amber→purple)
- [ ] **If flowchart looks scattered**: STOP — you're using the wrong layout, switch to Layout C
- [ ] **If Mermaid looked rigid**: already switched to Playwright+CSS

---

## Anti-Pattern Quick Reference

| ❌ Don't | ✅ Do This Instead |
|----------|-------------------|
| matplotlib default blue `#1f77b4` | Use this skill's palette |
| 3D bar/pie | Always 2D |
| Rainbow colormap (jet/rainbow) | Single-hue gradient or diverging |
| Thick black grid lines | `alpha=0.08` or remove |
| Different color per bar | Same series same color, highlight only key |
| 45° tilted X labels | Horizontal bar chart or shorten |
| 8+ subplots in one canvas | Split to 2-3 images, max 4 each |
| `tight_layout()` alone | `constrained_layout=True` or `GridSpec` |
| Labels overflowing chart | `ylim` with 18-25% headroom |
| Mind map: all levels same style | Root+L1 get boxes, leaves plain text |
| Mind map: image too tall | Left-right layout for ≥5 branches |
| Mind map: invisible connectors | Lines ≥ `#94A3B8`, root→L1 `#64748B` 2.5px |
| Mind map: unbalanced sides | Alternate large/small branches across sides |
| Flowchart: high-sat node fills | Low-sat bg (`#EFF6FF`) + sat border (`#3B82F6`) |
| Flowchart: dark bg + dark text | Dark bg → white text. Light bg → dark text |
| Flowchart: arrows between every step | Arrows ONLY between phases, steps use indent |
| Flowchart: cross-layer lines through nodes | Connect adjacent layers only |
| Flowchart: Grid layout for phased process | **Always use Layout C (Phased Vertical)** |
| Flowchart: phase titles as floating labels | Phase titles MUST be inside group cards |
| Flowchart: nodes scattered without grouping | Group nodes into phase cards with `.phase-group` |
| Flowchart: rainbow phase colors (blue→green→amber→purple) | Same-hue blue-gray progression for all phases |
| Multiple arrows to same entry point | Merge-then-enter pattern |
| Legend inside plot obscuring data | `bbox_to_anchor` outside plot area |
| Radar fill without alpha | `alpha=0.25` mandatory |
| Decorative icons/emoji | Let the data speak |
| Grid lines where whitespace suffices | Background contrast or spacing instead |

---

## UI Aesthetics (dashboards / card layouts)

When building UI-style outputs (dashboards, panels), apply "Invisible Precision":

- **Boundaries**: Subtle bg shifts (`#F7F7F7` on `#FFFFFF`), not border lines. Reserve `1px` dividers for absolute logical breaks only.
- **Actions**: Primary CTA in dark neutral (`#1A1A1B`). Secondary: ghost/gray. Hover: 5% darker, no size change.
- **Quiet UI**: Action buttons `opacity: 0` by default, `1` on hover. Only active elements get visual indicators.
- **Numbers**: `font-variant-numeric: tabular-nums` for strict vertical alignment.
- **Spacing**: `line-height: 1.625`, generous paragraph spacing.

```

---

## `skills/coding-agent/SKILL.md`

> Size: 3.1KB | Lines: 120 | Lang: markdown

```markdown
---
name: coding-agent
slug: code
version: 1.0.4
homepage: https://clawic.com/skills/code
description: Coding workflow with planning, implementation, verification, and testing for clean software development.
changelog: Improved description for better discoverability
metadata: {"clawdbot":{"emoji":"💻","requires":{"bins":[]},"os":["linux","darwin","win32"]}}
---

## When to Use

User explicitly requests code implementation. Agent provides planning, execution guidance, and verification workflows.

## Architecture

User preferences stored in `~/code/` when user explicitly requests.

```
~/code/
  - memory.md    # User-provided preferences only
```

Create on first use: `mkdir -p ~/code`

## Quick Reference

| Topic | File |
|-------|------|
| Memory setup | `memory-template.md` |
| Task breakdown | `planning.md` |
| Execution flow | `execution.md` |
| Verification | `verification.md` |
| Multi-task state | `state.md` |
| User criteria | `criteria.md` |

## Scope

This skill ONLY:
- Provides coding workflow guidance
- Stores preferences user explicitly provides in `~/code/`
- Reads included reference files

This skill NEVER:
- Executes code automatically
- Makes network requests
- Accesses files outside `~/code/` and the user's project
- Modifies its own SKILL.md or auxiliary files
- Takes autonomous action without user awareness

## Core Rules

### 1. Check Memory First
Read `~/code/memory.md` for user's stated preferences if it exists.

### 2. User Controls Execution
- This skill provides GUIDANCE, not autonomous execution
- User decides when to proceed to next step
- Sub-agent delegation requires user's explicit request

### 3. Plan Before Code
- Break requests into testable steps
- Each step independently verifiable
- See `planning.md` for patterns

### 4. Verify Everything
| After | Do |
|-------|-----|
| Each function | Suggest running tests |
| UI changes | Suggest taking screenshot |
| Before delivery | Suggest full test suite |

### 5. Store Preferences on Request
| User says | Action |
|-----------|--------|
| "Remember I prefer X" | Add to memory.md |
| "Never do Y again" | Add to memory.md Never section |

Only store what user explicitly asks to save.

## Workflow

```
Request -> Plan -> Execute -> Verify -> Deliver
```

## Common Traps

- **Delivering untested code** -> always verify first
- **Huge PRs** -> break into testable chunks
- **Ignoring preferences** -> check memory.md first

## Self-Modification

This skill NEVER modifies its own SKILL.md or auxiliary files.
User data stored only in `~/code/memory.md` after explicit request.

## External Endpoints

This skill makes NO network requests.

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

## Security & Privacy

**Data that stays local:**
- Only preferences user explicitly asks to save
- Stored in `~/code/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.

**This skill does NOT:**
- Execute code automatically
- Access network or external services  
- Access files outside `~/code/` and user's project
- Take autonomous actions without user awareness
- Delegate to sub-agents without user's explicit request

```

---

## `skills/web-reader/SKILL.md`

> Size: 27.7KB | Lines: 1140 | Lang: markdown

> ⚠️ File truncated to first 500 lines (total: 1140)

```markdown
---
name: web-reader
description: Implement web page content extraction capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to scrape web pages, extract article content, retrieve page metadata, or build applications that process web content. Supports automatic content extraction with title, HTML, and publication time retrieval.
license: MIT
---

# Web Reader Skill

This skill guides the implementation of web page reading and content extraction functionality using the z-ai-web-dev-sdk package, enabling applications to fetch and process web page content programmatically.

## Skills Path

**Skill Location**: `{project_path}/skills/web-reader`

This skill is located at the above path in your project.

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory for quick testing and reference. See `{Skill Location}/scripts/web-reader.ts` for a working example.

## Overview

Web Reader allows you to build applications that can extract content from web pages, retrieve article metadata, and process HTML content. The API automatically handles content extraction, providing clean, structured data from any web URL.

**IMPORTANT**: z-ai-web-dev-sdk MUST be used in backend code only. Never use it in client-side code.

## Prerequisites

The z-ai-web-dev-sdk package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple web page content extraction, you can use the z-ai CLI instead of writing code. This is ideal for quick content scraping, testing URLs, or simple automation tasks.

### Basic Page Reading

```bash
# Extract content from a web page
z-ai function --name "page_reader" --args '{"url": "https://example.com"}'

# Using short options
z-ai function -n page_reader -a '{"url": "https://www.example.com/article"}'
```

### Save Page Content

```bash
# Save extracted content to JSON file
z-ai function \
  -n page_reader \
  -a '{"url": "https://news.example.com/article"}' \
  -o page_content.json

# Extract and save blog post
z-ai function \
  -n page_reader \
  -a '{"url": "https://blog.example.com/post/123"}' \
  -o blog_post.json
```

### Common Use Cases

```bash
# Extract news article
z-ai function \
  -n page_reader \
  -a '{"url": "https://news.site.com/breaking-news"}' \
  -o news.json

# Read documentation page
z-ai function \
  -n page_reader \
  -a '{"url": "https://docs.example.com/getting-started"}' \
  -o docs.json

# Scrape blog content
z-ai function \
  -n page_reader \
  -a '{"url": "https://techblog.com/ai-trends-2024"}' \
  -o blog.json

# Extract research article
z-ai function \
  -n page_reader \
  -a '{"url": "https://research.org/papers/quantum-computing"}' \
  -o research.json
```

### CLI Parameters

- `--name, -n`: **Required** - Function name (use "page_reader")
- `--args, -a`: **Required** - JSON arguments object with:
  - `url` (string, required): The URL of the web page to read
- `--output, -o <path>`: Optional - Output file path (JSON format)

### Response Structure

The CLI returns a JSON object containing:
- `title`: Page title
- `html`: Main content HTML
- `text`: Plain text content
- `publish_time`: Publication timestamp (if available)
- `url`: Original URL
- `metadata`: Additional page metadata

### Example Response

```json
{
  "title": "Introduction to Machine Learning",
  "html": "<article><h1>Introduction to Machine Learning</h1><p>Machine learning is...</p></article>",
  "text": "Introduction to Machine Learning\n\nMachine learning is...",
  "publish_time": "2024-01-15T10:30:00Z",
  "url": "https://example.com/ml-intro",
  "metadata": {
    "author": "John Doe",
    "description": "A comprehensive guide to ML"
  }
}
```

### Processing Multiple URLs

```bash
# Create a simple script to process multiple URLs
for url in \
  "https://site1.com/article1" \
  "https://site2.com/article2" \
  "https://site3.com/article3"
do
  filename=$(echo $url | md5sum | cut -d' ' -f1)
  z-ai function -n page_reader -a "{\"url\": \"$url\"}" -o "${filename}.json"
done
```

### When to Use CLI vs SDK

**Use CLI for:**
- Quick content extraction
- Testing URL accessibility
- Simple web scraping tasks
- One-off content retrieval

**Use SDK for:**
- Batch URL processing with custom logic
- Integration with web applications
- Complex content processing pipelines
- Production applications with error handling

## How It Works

The Web Reader uses the `page_reader` function to:
1. Fetch the web page content
2. Extract main article content and metadata
3. Parse and clean the HTML
4. Return structured data including title, content, and publication time

## Basic Web Reading Implementation

### Simple Page Reading

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function readWebPage(url) {
  try {
    const zai = await ZAI.create();

    const result = await zai.functions.invoke('page_reader', {
      url: url
    });

    console.log('Title:', result.data.title);
    console.log('URL:', result.data.url);
    console.log('Published:', result.data.publishedTime);
    console.log('HTML Content:', result.data.html);
    console.log('Tokens Used:', result.data.usage.tokens);

    return result.data;
  } catch (error) {
    console.error('Page reading failed:', error.message);
    throw error;
  }
}

// Usage
const pageData = await readWebPage('https://example.com/article');
console.log('Page title:', pageData.title);
```

### Extract Article Text Only

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function extractArticleText(url) {
  const zai = await ZAI.create();

  const result = await zai.functions.invoke('page_reader', {
    url: url
  });

  // Convert HTML to plain text (basic approach)
  const plainText = result.data.html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    title: result.data.title,
    text: plainText,
    url: result.data.url,
    publishedTime: result.data.publishedTime
  };
}

// Usage
const article = await extractArticleText('https://news.example.com/story');
console.log(article.title);
console.log(article.text.substring(0, 200) + '...');
```

### Read Multiple Pages

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function readMultiplePages(urls) {
  const zai = await ZAI.create();
  const results = [];

  for (const url of urls) {
    try {
      const result = await zai.functions.invoke('page_reader', {
        url: url
      });

      results.push({
        url: url,
        success: true,
        data: result.data
      });
    } catch (error) {
      results.push({
        url: url,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

// Usage
const urls = [
  'https://example.com/article1',
  'https://example.com/article2',
  'https://example.com/article3'
];

const pages = await readMultiplePages(urls);
pages.forEach(page => {
  if (page.success) {
    console.log(`✓ ${page.data.title}`);
  } else {
    console.log(`✗ ${page.url}: ${page.error}`);
  }
});
```

## Advanced Use Cases

### Web Content Analyzer

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class WebContentAnalyzer {
  constructor() {
    this.cache = new Map();
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async readPage(url, useCache = true) {
    // Check cache
    if (useCache && this.cache.has(url)) {
      console.log('Returning cached result for:', url);
      return this.cache.get(url);
    }

    // Fetch fresh content
    const result = await this.zai.functions.invoke('page_reader', {
      url: url
    });

    // Cache the result
    if (useCache) {
      this.cache.set(url, result.data);
    }

    return result.data;
  }

  async getPageMetadata(url) {
    const data = await this.readPage(url);

    return {
      title: data.title,
      url: data.url,
      publishedTime: data.publishedTime,
      contentLength: data.html.length,
      wordCount: this.estimateWordCount(data.html)
    };
  }

  estimateWordCount(html) {
    const text = html.replace(/<[^>]*>/g, ' ');
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.length;
  }

  async comparePages(url1, url2) {
    const [page1, page2] = await Promise.all([
      this.readPage(url1),
      this.readPage(url2)
    ]);

    return {
      page1: {
        title: page1.title,
        wordCount: this.estimateWordCount(page1.html),
        published: page1.publishedTime
      },
      page2: {
        title: page2.title,
        wordCount: this.estimateWordCount(page2.html),
        published: page2.publishedTime
      }
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

// Usage
const analyzer = new WebContentAnalyzer();
await analyzer.initialize();

const metadata = await analyzer.getPageMetadata('https://example.com/article');
console.log('Article Metadata:', metadata);

const comparison = await analyzer.comparePages(
  'https://example.com/article1',
  'https://example.com/article2'
);
console.log('Comparison:', comparison);
```

### RSS Feed Reader

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class FeedReader {
  constructor() {
    this.articles = [];
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async fetchArticlesFromUrls(urls) {
    const articles = [];

    for (const url of urls) {
      try {
        const result = await this.zai.functions.invoke('page_reader', {
          url: url
        });

        articles.push({
          title: result.data.title,
          url: result.data.url,
          publishedTime: result.data.publishedTime,
          content: result.data.html,
          fetchedAt: new Date().toISOString()
        });

        console.log(`Fetched: ${result.data.title}`);
      } catch (error) {
        console.error(`Failed to fetch ${url}:`, error.message);
      }
    }

    this.articles = articles;
    return articles;
  }

  getRecentArticles(limit = 10) {
    return this.articles
      .sort((a, b) => {
        const dateA = new Date(a.publishedTime || a.fetchedAt);
        const dateB = new Date(b.publishedTime || b.fetchedAt);
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  searchArticles(keyword) {
    return this.articles.filter(article => {
      const searchText = `${article.title} ${article.content}`.toLowerCase();
      return searchText.includes(keyword.toLowerCase());
    });
  }
}

// Usage
const reader = new FeedReader();
await reader.initialize();

const feedUrls = [
  'https://example.com/article1',
  'https://example.com/article2',
  'https://example.com/article3'
];

await reader.fetchArticlesFromUrls(feedUrls);
const recent = reader.getRecentArticles(5);
console.log('Recent articles:', recent.map(a => a.title));
```

### Content Aggregator

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function aggregateContent(urls, options = {}) {
  const zai = await ZAI.create();
  const aggregated = {
    sources: [],
    totalWords: 0,
    aggregatedAt: new Date().toISOString()
  };

  for (const url of urls) {
    try {
      const result = await zai.functions.invoke('page_reader', {
        url: url
      });

      const text = result.data.html.replace(/<[^>]*>/g, ' ');
      const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

      aggregated.sources.push({
        title: result.data.title,
        url: result.data.url,
        publishedTime: result.data.publishedTime,
        wordCount: wordCount,
        excerpt: text.substring(0, 200).trim() + '...'
      });

      aggregated.totalWords += wordCount;

      if (options.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error.message);
    }
  }

  return aggregated;
}

// Usage
const sources = [
  'https://example.com/news1',
  'https://example.com/news2',
  'https://example.com/news3'
];

const aggregated = await aggregateContent(sources, { delay: 1000 });
console.log(`Aggregated ${aggregated.sources.length} sources`);
console.log(`Total words: ${aggregated.totalWords}`);
```

### Web Scraping Pipeline

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class ScrapingPipeline {
  constructor() {
    this.processors = [];
  }

```

---


# 📂 Docker & Deploy

## `Dockerfile`

> Size: 7.4KB | Lines: 167 | Lang: text

```
# ─── Anzaro AI — HuggingFace Space Dockerfile ───────────────────────────
# Next.js 16 app with Prisma + Supabase PostgreSQL, running on port 3000
# DATABASE_URL and DIRECT_URL must be set as HF Space Secrets (Supabase pooler URLs).
# ─────────────────────────────────────────────────────────────────────────

FROM node:20-slim

# Install system dependencies for sharp, bcrypt, prisma, ffmpeg
# V.38: Added Playwright/Chromium system dependencies for PDF generation.
# Without these, Playwright can't launch Chromium → falls back to HTML
# instead of generating actual PDF files.
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    python3-pip \
    make \
    g++ \
    ffmpeg \
    # Playwright/Chromium system dependencies (for PDF rendering)
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install bun for faster installs (falls back to npm if bun.lock not present)
RUN npm install -g bun 2>/dev/null || true

# Install dependencies
RUN if [ -f bun.lock ]; then \
      bun install --frozen-lockfile 2>/dev/null || npm install; \
    else \
      npm install; \
    fi

# V.38: Install Chromium browser for Playwright (PDF generation).
# This downloads the Chromium binary (~150MB) that Playwright needs to
# render HTML → PDF. Without this, PDF generation falls back to HTML.
# Using --with-deps would re-install system deps we already installed above.
RUN npx playwright install chromium 2>/dev/null || echo "Playwright Chromium install failed — PDF generation will use HTML fallback"

# V.67: Install Python libraries for local file generation (PPTX/XLSX)
# V.68b: Add --break-system-packages for HF's externally-managed Python
# V.68c: Add qrcode and gTTS for QR code + audiobook generation
# V.93: MASTER PROMPT — pre-install ALL data science, document generation,
#        and media processing libraries so runtime auto-install is rarely needed.
#        These persist across container restarts (baked into the image).
# V.143: Install ALL Python packages from requirements.txt (BUILD TIME)
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages huggingface_hub
# Now install rest of packages
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt || echo "Some packages failed"
# Generate Prisma client (V.27: must succeed — AudioRecord model needed)
RUN npx prisma generate
# Validate the schema parses cleanly against the postgresql provider.
# This does NOT touch the DB — it just confirms schema syntax.
RUN npx prisma validate 2>/dev/null || true

# Copy source code
COPY . .

# Create .env file with non-secret production values.
# V.56: Using SQLite (matches schema.prisma provider = "sqlite")
# The DB file lives at /app/db/custom.db and is created by prisma db push at startup.
RUN echo 'SESSION_SECRET="anzaro-hf-space-secret-2026-abdelslam"' > .env && \
    echo 'NEXTAUTH_URL="https://ebsaya-delta-ai.hf.space"' >> .env && \
    echo 'NEXTAUTH_SECRET="anzaro-nextauth-secret-2026-abdelslam"' >> .env && \
    echo 'NODE_ENV="production"' >> .env && \
    echo 'DATABASE_URL="file:/app/db/custom.db"' >> .env && \
    echo 'ZAI_API_KEY=""' >> .env

# Set non-secret environment variables (also as ENV for CLI tools).
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SESSION_SECRET="anzaro-hf-space-secret-2026-abdelslam"
ENV NEXTAUTH_URL="https://ebsaya-delta-ai.hf.space"
ENV NEXTAUTH_SECRET="anzaro-nextauth-secret-2026-abdelslam"
# V.56: SQLite database (matches schema.prisma provider = "sqlite")
ENV DATABASE_URL="file:/app/db/custom.db"
# ZAI_API_KEY must be set as a HF Space Secret.

# Create the db directory for SQLite
RUN mkdir -p /app/db

# Pre-build the Next.js app so .next/ exists (fixes ENOENT required-server-files.json)
# V.105c: لو next build فشل، الـ CMD هيستخدم next dev
RUN npx next build --webpack 2>&1 || echo "Build failed — will use dev mode in CMD"

# Expose port
EXPOSE 3000

# Start the application.
# V.56: Force DATABASE_URL to SQLite (overrides any HF Space Secret that might
# still point to PostgreSQL). This matches schema.prisma provider=sqlite.
# V.92: Auto-setup admin user on every startup (SQLite DB gets wiped on rebuild)
# Admin credentials: ADMIN_EMAIL / ADMIN_PASSWORD env vars (set as HF Secrets)
# Default fallback: admin@anzaro.local / admin123456
CMD export DATABASE_URL="file:/app/db/custom.db" && \
    echo "[Startup] V.143: Checking /data/ for persistent DB..." && \
    if [ -f /data/custom.db ]; then \
      echo "[Startup] Found DB in /data/ — using persistent storage"; \
      cp /data/custom.db /app/db/custom.db; \
    else \
      echo "[Startup] No DB in /data/ — downloading from HF Dataset..."; \
      python3 /app/scripts/db_sync_manager.py 2>&1 | tail -5; \
    fi && \
    echo "[Startup] Running prisma db push..." && \
    npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -5 && \
    echo "[Startup] Setting up admin user..." && \
    node -e " \
      const { PrismaClient } = require('@prisma/client'); \
      const bcrypt = require('bcryptjs'); \
      (async () => { \
        const db = new PrismaClient(); \
        const email = (process.env.ADMIN_EMAIL || 'admin@anzaro.local').toLowerCase().trim(); \
        const password = process.env.ADMIN_PASSWORD || 'admin123456'; \
        const existing = await db.user.findFirst({ where: { role: 'admin' } }); \
        if (existing) { \
          console.log('[Startup] Admin exists:', existing.email); \
        } else { \
          const hash = await bcrypt.hash(password, 12); \
          const u = await db.user.create({ data: { email, password: hash, name: 'Admin', role: 'admin', isVerified: true, isActive: true } }); \
          console.log('[Startup] Admin created:', u.email); \
        } \
        const guest = await db.user.findUnique({ where: { email: 'guest@anzaro.ai' } }); \
        if (!guest) { \
          const g = await db.user.create({ data: { email: 'guest@anzaro.ai', name: 'زائر', isVerified: true, role: 'user' } }); \
          console.log('[Startup] Guest created:', g.id); \
        } \
        await db.\$disconnect(); \
      })().catch(e => { console.error('[Startup] Setup failed:', e.message); process.exit(0); }); \
    " && \
    echo "[Startup] Saving DB to /data/ for persistence..." && \
    mkdir -p /data && cp /app/db/custom.db /data/custom.db 2>/dev/null || true && \
    echo "[Startup] Starting Next.js..." && \
    if [ -d /app/.next/standalone ] || [ -f /app/.next/BUILD_ID ]; then \
      echo "[Startup] Production build — using next start"; \
      DATABASE_URL="file:/app/db/custom.db" npx next start -p 3000 -H 0.0.0.0; \
    else \
      echo "[Startup] No production build — using next dev"; \
      DATABASE_URL="file:/app/db/custom.db" npx next dev --webpack -p 3000 -H 0.0.0.0; \
    fi

```

---

## `Dockerfile.prod`

> Size: 3.0KB | Lines: 66 | Lang: text

```
# ═══════════════════════════════════════════════════
# Delta AI V2 — Production Dockerfile (VPS-optimized)
# ═══════════════════════════════════════════════════
# متوافق مع: Hetzner, DigitalOcean, Linode, Vultr, Contabo
# الموارد المطلوبة: 2 vCPU + 4GB RAM + 40GB SSD (الحد الأدنى)

FROM node:20-slim

# ─── System dependencies ───────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
    python3 python3-pip python3-venv \
    make g++ \
    ffmpeg \
    git curl wget \
    # Playwright/Chromium deps
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxcb1 libxkbcommon0 \
    libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    libatspi2.0-0 fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ─── Node.js dependencies ──────────────────────────
COPY package.json bun.lock* ./
COPY prisma ./prisma/
RUN npm install -g bun && \
    (bun install --frozen-lockfile 2>/dev/null || npm install)

# ─── Python dependencies (BUILD TIME) ──────────────
COPY requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages huggingface_hub && \
    pip3 install --no-cache-dir --break-system-packages -r requirements.txt || echo "Some packages failed"

# ─── Playwright Chromium ───────────────────────────
RUN npx playwright install chromium 2>/dev/null || echo "Playwright install failed"

# ─── Prisma client ─────────────────────────────────
RUN npx prisma generate

# ─── Source code ───────────────────────────────────
COPY . .

# ─── Environment ───────────────────────────────────
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL="file:/app/data/custom.db"
ENV PYTHONUNBUFFERED=1

# ─── Build Next.js ─────────────────────────────────
RUN npx next build --webpack 2>&1 || echo "Build failed — will use dev mode"

# ─── Persistent data directory ─────────────────────
RUN mkdir -p /app/data /app/db
VOLUME ["/app/data"]

EXPOSE 3000

# ─── Startup script ────────────────────────────────
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]

```

---

## `docker-compose.yml`

> Size: 2.3KB | Lines: 63 | Lang: yaml

```yaml
# ═══════════════════════════════════════════════════
# Delta AI V2 — Docker Compose for VPS deployment
# ═══════════════════════════════════════════════════
# Usage:
#   1. sudo docker compose up -d
#   2. Access on http://YOUR_SERVER_IP:3000

version: '3.8'

services:
  delta-ai:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: delta-ai
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      # Persistent data (DB + uploads + sessions)
      - delta_data:/app/data
      - delta_uploads:/app/upload
      - delta_exports:/app/exports
    environment:
      # ─── Required ─────────────────────────────
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/custom.db
      - SESSION_SECRET=${SESSION_SECRET:-anzaro-prod-secret-2026}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-anzaro-nextauth-prod-2026}
      - NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
      # ─── Admin ────────────────────────────────
      - ADMIN_EMAIL=${ADMIN_EMAIL:-admin@anzaro.local}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123456}
      # ─── AI Providers (set in .env) ──────────
      - ZAI_API_KEY=${ZAI_API_KEY:-}
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
      # ─── HF (optional, for DB sync) ──────────
      - HF_TOKEN=${HF_TOKEN:-}
      - HF_DATASET_REPO=${HF_DATASET_REPO:-}
      # ─── Hermes Agent ────────────────────────
      - HERMES_HOME=/app/hermes
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 60s
      timeout: 10s
      retries: 3
      start_period: 120s
    deploy:
      resources:
        limits:
          memory: 3G
        reservations:
          memory: 1G

volumes:
  delta_data:
    driver: local
  delta_uploads:
    driver: local
  delta_exports:
    driver: local

```

---

## `docker-entrypoint.sh`

> Size: 3.4KB | Lines: 77 | Lang: bash

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Docker Entrypoint
# ═══════════════════════════════════════════════════
set -e

echo "🚀 Delta AI V2 — Starting..."

# ─── 1. Database setup ─────────────────────────────
echo "📦 [1/5] Setting up database..."

# Use persistent volume if available
if [ -f /app/data/custom.db ]; then
    echo "   ✅ Found persistent DB at /app/data/custom.db"
    cp /app/data/custom.db /app/db/custom.db
elif [ -n "$HF_TOKEN" ] && [ -n "$HF_DATASET_REPO" ]; then
    echo "   📥 Downloading DB from HF Dataset..."
    python3 -c "
import os
from huggingface_hub import hf_hub_download
import shutil
path = hf_hub_download(
    repo_id=os.environ['HF_DATASET_REPO'],
    filename='custom.db',
    repo_type='dataset',
    token=os.environ['HF_TOKEN'],
    local_dir='/tmp/hf_db'
)
shutil.copy(path, '/app/db/custom.db')
print(f'   ✅ DB downloaded: {os.path.getsize(\"/app/db/custom.db\")/1024/1024:.1f}MB')
" 2>/dev/null || echo "   ⚠️ Download failed — will use empty DB"
fi

# ─── 2. Run Prisma migrations ──────────────────────
echo "📦 [2/5] Running prisma db push..."
npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -3

# ─── 3. Setup admin user ───────────────────────────
echo "👤 [3/5] Setting up admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
(async () => {
    const db = new PrismaClient();
    const email = (process.env.ADMIN_EMAIL || 'admin@anzaro.local').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'admin123456';
    const existing = await db.user.findFirst({ where: { role: 'admin' } });
    if (existing) {
        console.log('   ✅ Admin exists:', existing.email);
    } else {
        const hash = await bcrypt.hash(password, 12);
        const u = await db.user.create({ data: { email, password: hash, name: 'Admin', role: 'admin', isVerified: true, isActive: true } });
        console.log('   ✅ Admin created:', u.email);
    }
    const guest = await db.user.findUnique({ where: { email: 'guest@anzaro.ai' } });
    if (!guest) {
        const g = await db.user.create({ data: { email: 'guest@anzaro.ai', name: 'زائر', isVerified: true, role: 'user' } });
        console.log('   ✅ Guest created:', g.id);
    }
    await db.\$disconnect();
})().catch(e => { console.error('   ⚠️ Setup failed:', e.message); process.exit(0); });
"

# ─── 4. Save DB to persistent volume ───────────────
echo "💾 [4/5] Saving DB to persistent volume..."
mkdir -p /app/data
cp /app/db/custom.db /app/data/custom.db 2>/dev/null || true

# ─── 5. Start Next.js ──────────────────────────────
echo "🌐 [5/5] Starting Next.js..."
if [ -f /app/.next/BUILD_ID ]; then
    echo "   ✅ Production build — using next start"
    exec npx next start -p 3000 -H 0.0.0.0
else
    echo "   ⚠️ No production build — using next dev"
    exec npx next dev --webpack -p 3000 -H 0.0.0.0
fi

```

---

## `deploy-vps.sh`

> Size: 5.0KB | Lines: 144 | Lang: bash

```bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — VPS Deployment Script
# ═══════════════════════════════════════════════════
# Runs on: Ubuntu 22.04+ VPS (Hetzner, DO, Linode, etc.)
# 
# Usage:
#   wget https://raw.githubusercontent.com/ygfiouyg/DELTA_AI_V2/main/deploy-vps.sh
#   chmod +x deploy-vps.sh
#   sudo ./deploy-vps.sh

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — VPS Deployment"
echo "================================"

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Run as root: sudo ./deploy-vps.sh"
    exit 1
fi

# Check system
echo "📊 System info:"
echo "   CPU: $(nproc) cores"
echo "   RAM: $(free -h | grep Mem | awk '{print $2}')"
echo "   Disk: $(df -h / | tail -1 | awk '{print $4}') free"

# ─── 1. Install Docker ─────────────────────────────
echo ""
echo "📦 [1/6] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed"
else
    echo "   ✅ Docker already installed: $(docker --version)"
fi

# ─── 2. Install Docker Compose ─────────────────────
if ! command -v docker compose &> /dev/null; then
    echo "📦 [2/6] Installing Docker Compose..."
    apt-get update && apt-get install -y docker-compose-plugin
    echo "   ✅ Docker Compose installed"
else
    echo "📦 [2/6] Docker Compose already installed"
fi

# ─── 3. Clone repository ───────────────────────────
echo ""
echo "📂 [3/6] Cloning repository..."
APP_DIR="/opt/delta-ai"
if [ -d "$APP_DIR" ]; then
    cd $APP_DIR
    git pull origin main || true
    echo "   ✅ Repository updated"
else
    git clone https://github.com/ygfiouyg/DELTA_AI_V2.git $APP_DIR
    cd $APP_DIR
    echo "   ✅ Repository cloned"
fi

# ─── 4. Setup environment ──────────────────────────
echo ""
echo "⚙️ [4/6] Setting up environment..."
if [ ! -f .env ]; then
    cat > .env << 'ENVFILE'
# ─── Required ────────────────────────────────────
SESSION_SECRET=change-this-to-random-64-chars
NEXTAUTH_SECRET=change-this-to-random-64-chars
NEXTAUTH_URL=http://YOUR_SERVER_IP:3000

# ─── Admin ───────────────────────────────────────
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456

# ─── AI Providers ────────────────────────────────
ZAI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=

# ─── HF (optional) ───────────────────────────────
HF_TOKEN=
HF_DATASET_REPO=
ENVFILE
    echo "   ⚠️ Created .env — please edit it: nano $APP_DIR/.env"
    echo "   ⚠️ Set NEXTAUTH_URL to your server IP/domain"
else
    echo "   ✅ .env already exists"
fi

# ─── 5. Setup swap (if low RAM) ────────────────────
RAM_GB=$(free -g | grep Mem | awk '{print $2}')
if [ "$RAM_GB" -lt 4 ]; then
    echo ""
    echo "💾 [5/6] Setting up swap (low RAM detected: ${RAM_GB}GB)..."
    if [ ! -f /swapfile ]; then
        fallocate -l 4G /swapfile
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        echo '/swapfile none swap sw 0 0' >> /etc/fstab
        echo "   ✅ 4GB swap created"
    else
        echo "   ✅ Swap already exists"
    fi
else
    echo "💾 [5/6] Sufficient RAM (${RAM_GB}GB) — no swap needed"
fi

# ─── 6. Build and start ────────────────────────────
echo ""
echo "🏗️ [6/6] Building and starting Delta AI V2..."
echo "   This will take 10-20 minutes for first build..."
docker compose build --no-cache 2>&1 | tail -5
docker compose up -d

echo ""
echo "⏳ Waiting for container to start..."
sleep 30

# Check status
if docker compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Delta AI V2 is running!"
    echo "   URL: http://$(curl -s ifconfig.me):3000"
    echo "   Admin: admin@anzaro.local / admin123456"
    echo ""
    echo "📋 Logs: docker compose logs -f"
    echo "🛑 Stop: docker compose down"
    echo "🔄 Update: git pull && docker compose up -d --build"
else
    echo ""
    echo "❌ Container failed to start. Check logs:"
    echo "   docker compose logs"
fi

# ─── Optional: Setup Nginx reverse proxy ───────────
echo ""
echo "🌐 Optional: Setup Nginx + SSL?"
echo "   Run: sudo apt install nginx certbot python3-certbot-nginx"
echo "   Then configure /etc/nginx/sites-available/delta-ai"

```

---

## `deploy-hp-a8.sh`

> Size: 8.0KB | Lines: 231 | Lang: bash

```bash
#!/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — HP AMD A8 Server Deploy
# ═══════════════════════════════════════════════════
# للـ HP AMD A8 (6GB RAM + 500GB HDD)
# محسّن للأجهزة القديمة + HDD
#
# Usage:
#   sudo bash deploy-hp-a8.sh
# ═══════════════════════════════════════════════════

set -e

echo "💻 Delta AI V2 — HP AMD A8 Server Deploy"
echo "=========================================="

# Check root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Run as root: sudo bash deploy-hp-a8.sh"
    exit 1
fi

# ─── 0. System info ────────────────────────────────
echo "📊 System info:"
echo "   CPU: $(nproc) cores"
echo "   RAM: $(free -h | grep Mem | awk '{print $2}')"
echo "   Disk: $(df -h / | tail -1 | awk '{print $4}') free"
echo "   CPU model: $(grep 'model name' /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)"
echo ""

# ─── 1. Install zram for faster I/O (HDD optimization) ─
echo "⚡ [1/10] Setting up zram (HDD optimization)..."
apt update -y
apt install -y zram-tools

# Configure zram: use 50% of RAM for compressed swap
cat > /etc/default/zramswap << 'ZRAMEOF'
# zram configuration
ALGO=zstd
PERCENT=50
PRIORITY=100
ZRAMEOF

systemctl enable zramswap
systemctl start zramswap
echo "   ✅ zram enabled (compressed RAM swap)"

# ─── 2. Setup regular swap (8GB) ───────────────────
echo "💾 [2/10] Setting up swap (8GB)..."
if [ ! -f /swapfile ]; then
    fallocate -l 8G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "   ✅ 8GB swap created"
else
    echo "   ✅ Swap already exists"
fi

# ─── 3. Optimize swappiness ────────────────────────
echo "⚙️ [3/10] Optimizing swappiness..."
# Lower swappiness = prefer RAM over swap
echo "vm.swappiness=10" >> /etc/sysctl.conf
echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf
sysctl -p
echo "   ✅ Swappiness optimized"

# ─── 4. Install Docker ─────────────────────────────
echo "📦 [4/10] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed"
else
    echo "   ✅ Docker already installed"
fi

# ─── 5. Install Docker Compose ─────────────────────
if ! command -v docker compose &> /dev/null; then
    echo "📦 [5/10] Installing Docker Compose..."
    apt install -y docker-compose-plugin
    echo "   ✅ Docker Compose installed"
else
    echo "📦 [5/10] Docker Compose already installed"
fi

# ─── 6. Clone repository ───────────────────────────
echo "📂 [6/10] Cloning repository..."
APP_DIR="/opt/delta-ai"
if [ -d "$APP_DIR" ]; then
    cd $APP_DIR
    git pull origin main || true
    echo "   ✅ Repository updated"
else
    git clone https://github.com/ygfiouyg/DELTA_AI_V2.git $APP_DIR
    cd $APP_DIR
    echo "   ✅ Repository cloned"
fi

# ─── 7. Setup environment ──────────────────────────
echo "⚙️ [7/10] Setting up environment..."
SERVER_IP=$(curl -s ifconfig.me || echo "localhost")

if [ ! -f .env ]; then
    cat > .env << ENVFILE
# ─── Required ────────────────────────────────────
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000

# ─── Admin ───────────────────────────────────────
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456

# ─── AI Providers (add your keys) ────────────────
ZAI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=

# ─── HF (optional, for DB sync) ──────────────────
HF_TOKEN=
HF_DATASET_REPO=
ENVFILE
    echo "   ⚠️ Created .env — edit it: nano $APP_DIR/.env"
else
    echo "   ✅ .env already exists"
fi

# ─── 8. Create optimized docker-compose ───────────
echo "🏗️ [8/10] Creating optimized docker-compose..."
cat > docker-compose.hp.yml << 'COMPOSEEOF'
version: '3.8'

services:
  delta-ai:
    build:
      context: .
      dockerfile: Dockerfile.prod
    container_name: delta-ai
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - delta_data:/app/data
      - delta_uploads:/app/upload
      - delta_exports:/app/exports
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/app/data/custom.db
      - SESSION_SECRET=${SESSION_SECRET}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - ADMIN_EMAIL=${ADMIN_EMAIL:-admin@anzaro.local}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123456}
      - ZAI_API_KEY=${ZAI_API_KEY:-}
      - OPENAI_API_KEY=${OPENAI_API_KEY:-}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY:-}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY:-}
      - HF_TOKEN=${HF_TOKEN:-}
      - HF_DATASET_REPO=${HF_DATASET_REPO:-}
      - HERMES_HOME=/app/hermes
    # Memory limits optimized for 6GB RAM
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 1G
    # Logging limits (HDD optimization)
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  delta_data:
  delta_uploads:
  delta_exports:
COMPOSEEOF
echo "   ✅ docker-compose.hp.yml created"

# ─── 9. Build and start ────────────────────────────
echo ""
echo "🏗️ [9/10] Building Docker image..."
echo "   ⏳ This will take 20-30 minutes on AMD A8..."
echo "   (First build only — subsequent builds are faster)"
docker compose -f docker-compose.hp.yml build --no-cache 2>&1 | tail -5

echo ""
echo "🚀 [10/10] Starting Delta AI V2..."
docker compose -f docker-compose.hp.yml up -d

# Wait for startup
echo ""
echo "⏳ Waiting for container to start (60s)..."
sleep 60

# Check status
if docker compose -f docker-compose.hp.yml ps | grep -q "Up"; then
    echo ""
    echo "✅ Delta AI V2 is running!"
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  URL:    http://${SERVER_IP}:3000"
    echo "  Admin:  admin@anzaro.local"
    echo "  Pass:   admin123456"
    echo "═══════════════════════════════════════════════════"
    echo ""
    echo "📋 Commands:"
    echo "  Logs:       docker compose -f docker-compose.hp.yml logs -f"
    echo "  Stop:       docker compose -f docker-compose.hp.yml down"
    echo "  Restart:    docker compose -f docker-compose.hp.yml restart"
    echo "  Update:     git pull && docker compose -f docker-compose.hp.yml up -d --build"
else
    echo ""
    echo "❌ Container failed to start. Check logs:"
    echo "  docker compose -f docker-compose.hp.yml logs"
fi

# ─── Performance tips ──────────────────────────────
echo ""
echo "💡 Performance Tips for HP AMD A8:"
echo "   1. Add SSD if possible (HDD is the bottleneck)"
echo "   2. Add more RAM (8GB total = much better)"
echo "   3. Close unnecessary background processes"
echo "   4. Use LAN cable (not WiFi)"
echo "   5. Keep the PC well-ventilated"

```

---

## `deploy-termux.sh`

> Size: 7.6KB | Lines: 203 | Lang: bash

```bash
#!/data/data/com.termux/files/usr/bin/bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Termux Setup (OPPO A76 / Android 12GB+)
# ═══════════════════════════════════════════════════
# Supports: OPPO A76, Samsung Tab A7, any Android 8GB+
#
# Usage:
#   1. Install Termux from F-Droid (NOT Play Store)
#   2. Open Termux and run:
#      pkg update && pkg install wget -y
#      wget https://raw.githubusercontent.com/ygfiouyg/DELTA_AI_V2/main/deploy-termux.sh
#      bash deploy-termux.sh
# ═══════════════════════════════════════════════════

set -e

echo "📱 Delta AI V2 — Termux Setup"
echo "==============================="

# Detect device RAM
RAM_KB=$(grep MemTotal /proc/meminfo | awk '{print $2}')
RAM_GB=$((RAM_KB / 1024 / 1024))
echo "📊 Device RAM: ${RAM_GB}GB"

# Determine mode based on RAM
if [ "$RAM_GB" -ge 4 ]; then
    MODE="full"
    NODE_MEM="2048"
    echo "🚀 Mode: FULL (Hermes + Playwright + all features)"
elif [ "$RAM_GB" -ge 3 ]; then
    MODE="standard"
    NODE_MEM="1024"
    echo "✅ Mode: STANDARD (Next.js + Python, no Hermes)"
else
    MODE="lite"
    NODE_MEM="512"
    echo "⚠️ Mode: LITE (minimal features only)"
fi
echo ""

# ─── 1. Base packages ──────────────────────────────
echo "📦 [1/9] Installing base packages..."
pkg update -y && pkg upgrade -y
pkg install -y \
    git nodejs python python-pip \
    openssl wget curl nano which proot \
    clang make
echo "   ✅ Base packages installed"

# ─── 2. Install bun ────────────────────────────────
echo ""
echo "📦 [2/9] Installing bun..."
curl -fsSL https://bun.sh/install | bash 2>/dev/null || echo "   ⚠️ Bun install failed (using npm)"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc
echo "   ✅ Bun installed"

# ─── 3. Clone project ──────────────────────────────
echo ""
echo "📂 [3/9] Cloning Delta AI V2..."
cd ~
if [ -d "delta-ai" ]; then
    cd delta-ai
    git pull origin main 2>/dev/null || true
    echo "   ✅ Repository updated"
else
    git clone --depth 1 https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
    cd delta-ai
    echo "   ✅ Repository cloned (depth=1, saves space)"
fi

# ─── 4. Node.js dependencies ───────────────────────
echo ""
echo "📦 [4/9] Installing Node.js dependencies..."
if [ "$MODE" = "lite" ]; then
    npm install --production --no-optional 2>&1 | tail -2 || \
        bun install --production 2>&1 | tail -2
else
    npm install --no-optional 2>&1 | tail -2 || \
        bun install 2>&1 | tail -2
fi
echo "   ✅ Dependencies installed"

# ─── 5. Python packages ────────────────────────────
echo ""
echo "🐍 [5/9] Installing Python packages..."
if [ "$MODE" = "full" ]; then
    # Full install for 8GB+ devices
    echo "   Installing full Python packages..."
    pip install --no-cache-dir \
        requests beautifulsoup4 lxml \
        pandas numpy scipy \
        matplotlib pillow \
        qrcode vaderSentiment textblob \
        scikit-learn nltk \
        yt-dlp pydub \
        python-docx python-pptx openpyxl reportlab \
        sympy faker \
        2>&1 | tail -3 || echo "   ⚠️ Some packages failed (normal on ARM)"
elif [ "$MODE" = "standard" ]; then
    # Standard for 4GB devices
    pip install --no-cache-dir \
        requests beautifulsoup4 \
        pandas numpy \
        pillow qrcode \
        vaderSentiment textblob \
        2>&1 | tail -3 || echo "   ⚠️ Some packages failed"
else
    # Lite for 2GB devices
    pip install --no-cache-dir \
        requests beautifulsoup4 \
        pandas numpy pillow qrcode \
        2>&1 | tail -3 || echo "   ⚠️ Some packages failed"
fi
echo "   ✅ Python packages installed"

# ─── 6. Install Hermes Agent (8GB+ only) ───────────
if [ "$MODE" = "full" ]; then
    echo ""
    echo "☤ [6/9] Installing Hermes Agent..."
    curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash -s -- --skip-setup 2>&1 | tail -3 || \
        echo "   ⚠️ Hermes install failed (optional)"
    echo "   ✅ Hermes Agent installed"
else
    echo ""
    echo "☤ [6/9] Skipping Hermes Agent (need 8GB+ RAM)"
fi

# ─── 7. Database setup ─────────────────────────────
echo ""
echo "📊 [7/9] Setting up database..."
export DATABASE_URL="file:$HOME/delta-ai/db/custom.db"
npx prisma generate 2>&1 | tail -2
npx prisma db push --skip-generate --accept-data-loss 2>&1 | tail -2
echo "   ✅ Database ready"

# ─── 8. Build Next.js ──────────────────────────────
echo ""
echo "🏗️ [8/9] Building Next.js..."
NODE_OPTIONS="--max-old-space-size=$NODE_MEM" npx next build --webpack 2>&1 | tail -5 || {
    echo "   ⚠️ Build failed — will use dev mode"
}
echo "   ✅ Build complete"

# ─── 9. Start script ───────────────────────────────
echo ""
echo "🚀 [9/9] Creating start script..."
cat > ~/delta-ai/start-termux.sh << STARTEOF
#!/data/data/com.termux/files/usr/bin/bash
cd ~/delta-ai
export DATABASE_URL="file:\$HOME/delta-ai/db/custom.db"
export NODE_ENV=production
export SESSION_SECRET="anzaro-termux-secret-2026"
export NEXTAUTH_SECRET="anzaro-nextauth-termux-2026"
export NEXTAUTH_URL="http://localhost:3000"
export ADMIN_EMAIL="admin@anzaro.local"
export ADMIN_PASSWORD="admin123456"
export NODE_OPTIONS="--max-old-space-size=$NODE_MEM"

# Hermes path (if installed)
export HERMES_HOME="\$HOME/.hermes"
export PATH="\$HERMES_HOME/bin:\$HOME/.bun/bin:\$PATH"

if [ -f .next/BUILD_ID ]; then
    echo "🚀 Starting PRODUCTION mode..."
    npx next start -p 3000 -H 0.0.0.0
else
    echo "⚠️ Starting DEV mode (slower)..."
    npx next dev --webpack -p 3000 -H 0.0.0.0
fi
STARTEOF
chmod +x ~/delta-ai/start-termux.sh

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ Delta AI V2 — Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Mode:    $MODE ($RAM_GB GB RAM)"
echo "  URL:     http://localhost:3000"
echo "  Admin:   admin@anzaro.local / admin123456"
echo ""
echo "  Start:   bash ~/delta-ai/start-termux.sh"
echo "  Stop:    Ctrl+C"
echo "  Logs:    In Termux window"
echo ""
echo "  From other devices (same WiFi):"
IP=$(ip addr show wlan0 2>/dev/null | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)
if [ -n "$IP" ]; then
    echo "  URL:     http://$IP:3000"
fi
echo "═══════════════════════════════════════════════════"
echo ""

# Start now?
read -p "🚀 Start Delta AI now? (y/n): " choice
if [ "$choice" = "y" ] || [ "$choice" = "Y" ]; then
    bash ~/delta-ai/start-termux.sh
else
    echo "To start later: bash ~/delta-ai/start-termux.sh"
fi

```

---

## `deploy-oracle.sh`

> Size: 3.4KB | Lines: 93 | Lang: bash

```bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Oracle Cloud Deploy Script
# ═══════════════════════════════════════════════════
# للـ Oracle Cloud Always Free (4 ARM cores + 24GB RAM)
#
# خطوات الإعداد:
# 1. سجل في https://www.oracle.com/cloud/free/
# 2. اعمل VM instance:
#    - Image: Canonical Ubuntu 22.04
#    - Shape: VM.Standard.A1.Flex (ARM)
#    - OCPUs: 4
#    - Memory: 24 GB
#    - Block storage: 200 GB
#    - Download SSH keys
# 3. افتح port 3000 في Security List:
#    VCN → Security Lists → Ingress Rules → Add:
#    Source: 0.0.0.0/0, Port: 3000
# 4. اتصل بـ SSH واشغل الـ script ده

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — Oracle Cloud ARM Deploy"
echo "=========================================="

# ─── 1. Update system ──────────────────────────────
echo "📦 [1/8] Updating system..."
sudo apt update && sudo apt upgrade -y

# ─── 2. Install Docker ─────────────────────────────
echo "📦 [2/8] Installing Docker..."
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# ─── 3. Setup swap (24GB RAM كافية بس احتياط) ────
echo "💾 [3/8] Setting up swap (4GB)..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# ─── 4. Clone repository ───────────────────────────
echo "📂 [4/8] Cloning Delta AI V2..."
cd /opt
sudo git clone https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
cd delta-ai
sudo chown -R $USER:$USER /opt/delta-ai

# ─── 5. Setup environment ──────────────────────────
echo "⚙️ [5/8] Setting up environment..."
SERVER_IP=$(curl -s ifconfig.me)
cat > .env << ENVFILE
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456
# Add your API keys here:
ZAI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
HF_TOKEN=
HF_DATASET_REPO=
ENVFILE

# ─── 6. Build Docker image ─────────────────────────
echo "🏗️ [6/8] Building Docker image (ARM)..."
# Use production Dockerfile
docker build -f Dockerfile.prod -t delta-ai:latest .

# ─── 7. Start container ────────────────────────────
echo "🚀 [7/8] Starting container..."
docker compose up -d

# ─── 8. Wait and verify ────────────────────────────
echo "⏳ [8/8] Waiting for startup..."
sleep 30

if docker compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Delta AI V2 is running!"
    echo "   URL: http://${SERVER_IP}:3000"
    echo "   Admin: admin@anzaro.local / admin123456"
    echo ""
    echo "📋 Logs: docker compose logs -f"
    echo "🛑 Stop: docker compose down"
else
    echo "❌ Container failed. Check: docker compose logs"
fi

```

---

## `deploy-gcp.sh`

> Size: 1.5KB | Lines: 49 | Lang: bash

```bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — Google Cloud Deploy Script
# ═══════════════════════════════════════════════════
# للـ Google Cloud Platform ($300 credit - 90 يوم)
#
# خطوات الإعداد:
# 1. سجل في https://cloud.google.com/free
# 2. اعمل VM instance:
#    - Image: Ubuntu 22.04 LTS
#    - Machine type: e2-standard-4 (4 vCPU + 16GB)
#    - Allow HTTP/HTTPS traffic
# 3. افتح port 3000 في Firewall
# 4. اتصل بـ SSH واشغل الـ script ده

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — Google Cloud Deploy"
echo "====================================="

# Install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Clone and build
cd /opt
sudo git clone https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
cd delta-ai
sudo chown -R $USER:$USER /opt/delta-ai

# Setup env
SERVER_IP=$(curl -s ifconfig.me)
cat > .env << ENVFILE
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456
ZAI_API_KEY=
OPENAI_API_KEY=
ENVFILE

# Build and start
docker build -f Dockerfile.prod -t delta-ai:latest .
docker compose up -d

sleep 30
echo "✅ Running: http://${SERVER_IP}:3000"

```

---

## `deploy-do.sh`

> Size: 1.5KB | Lines: 47 | Lang: bash

```bash
# ═══════════════════════════════════════════════════
# Delta AI V2 — DigitalOcean Deploy Script
# ═══════════════════════════════════════════════════
# للـ DigitalOcean ($200 credit - 60 يوم)
#
# خطوات الإعداد:
# 1. سجل في https://digitalocean.com (مع referral link)
# 2. اعمل Droplet:
#    - Image: Ubuntu 22.04
#    - Plan: Premium Intel (8 vCPU + 16GB) - $96/month
#    - Datacenter: Frankfurt (أقرب لمصر)
#    - Add SSH key
# 3. اتصل بـ SSH واشغل الـ script ده

#!/bin/bash
set -e

echo "🚀 Delta AI V2 — DigitalOcean Deploy"
echo "====================================="

# Install Docker
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Clone and build
cd /opt
sudo git clone https://github.com/ygfiouyg/DELTA_AI_V2.git delta-ai
cd delta-ai
sudo chown -R $USER:$USER /opt/delta-ai

# Setup env
SERVER_IP=$(curl -s ifconfig.me)
cat > .env << ENVFILE
SESSION_SECRET=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -hex 32)
NEXTAUTH_URL=http://${SERVER_IP}:3000
ADMIN_EMAIL=admin@anzaro.local
ADMIN_PASSWORD=admin123456
ENVFILE

# Build and start
docker build -f Dockerfile.prod -t delta-ai:latest .
docker compose up -d

sleep 30
echo "✅ Running: http://${SERVER_IP}:3000"

```

---

## `install-hermes-termux.sh`

> Size: 5.0KB | Lines: 136 | Lang: bash

```bash
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

```

---


# 📂 Scripts

## `scripts/fast_pypi_rebuild.py`

> Size: 4.1KB | Lines: 116 | Lang: python

```python
#!/usr/bin/env python3
"""Fast PyPI rebuild — streaming version."""
import os, sys, json, sqlite3, time, gc, uuid, urllib.request
from datetime import datetime

DB_PATH = "/home/z/my-project/db/custom.db"

def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)

AI_KW = {"ai","ml","machine","deep","neural","llm","gpt","transformer","nlp","chatbot","embedding","rag","vector","openai","anthropic","langchain","agent","prompt","pytorch","tensorflow","scikit","xgboost"}
DATA_KW = {"data","pandas","numpy","dataset","database","sql","etl","pipeline","analytics","plot","chart","spark","dask","polars"}
MEDIA_KW = {"image","video","audio","music","tts","speech","voice","ocr","vision","pdf","ffmpeg","pillow","opencv","whisper"}
WEB_KW = {"scrape","crawl","spider","http","request","api","rest","graphql","beautifulsoup","selenium","playwright","fastapi","flask","django"}

def categorize(name):
    n = name.lower()
    for k in AI_KW:
        if k in n: return "ai"
    for k in DATA_KW:
        if k in n: return "data"
    for k in MEDIA_KW:
        if k in n: return "media"
    for k in WEB_KW:
        if k in n: return "web"
    return "utility"

def main():
    log("="*60)
    log("🚀 Fast PyPI Rebuild v2 — START")
    log("="*60)

    conn = sqlite3.connect(DB_PATH, timeout=60)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA synchronous=NORMAL;")
    conn.execute("""CREATE TABLE IF NOT EXISTS ToolRegistry (
        id TEXT PRIMARY KEY,
        name TEXT,
        source TEXT,
        summary TEXT DEFAULT '',
        description TEXT DEFAULT '',
        category TEXT DEFAULT 'general',
        installCmd TEXT DEFAULT '',
        homepage TEXT DEFAULT '',
        repository TEXT DEFAULT '',
        keywords TEXT DEFAULT '',
        author TEXT DEFAULT '',
        license TEXT DEFAULT '',
        version TEXT DEFAULT '',
        stars INTEGER DEFAULT 0,
        isVerified INTEGER DEFAULT 0,
        isInstalled INTEGER DEFAULT 0,
        installPath TEXT DEFAULT '',
        importName TEXT DEFAULT '',
        usageExample TEXT DEFAULT '',
        createdAt TEXT DEFAULT (datetime('now')),
        updatedAt TEXT DEFAULT (datetime('now'))
    )""")
    conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_tool_unique ON ToolRegistry(name, source)")
    conn.commit()

    log("🧹 Clearing old PyPI data...")
    conn.execute("DELETE FROM ToolRegistry WHERE source='pypi'")
    conn.commit()

    log("📥 Fetching PyPI simple index...")
    t0 = time.time()
    req = urllib.request.Request("https://pypi.org/simple/", headers={"Accept": "application/vnd.pypi.simple.v1+json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        raw = resp.read()
    log(f"✅ Fetched {len(raw)/1024/1024:.1f}MB in {time.time()-t0:.1f}s")

    data = json.loads(raw)
    projects = data.get("projects", [])
    log(f"📦 Total projects: {len(projects):,}")
    del raw
    gc.collect()

    cur = conn.cursor()
    BATCH = 5000
    inserted = 0
    batch = []
    sql = "INSERT OR IGNORE INTO ToolRegistry (id, name, source, category, installCmd, homepage, updatedAt) VALUES (?, ?, 'pypi', ?, ?, ?, datetime('now'))"

    t1 = time.time()
    for i, p in enumerate(projects):
        name = p.get("name","").strip()
        if not name or len(name) < 2: continue
        cat = categorize(name)
        batch.append((str(uuid.uuid4()), name, cat, f"pip install {name}", f"https://pypi.org/project/{name}/"))
        if len(batch) >= BATCH:
            cur.executemany(sql, batch)
            conn.commit()
            inserted += len(batch)
            batch = []
            if inserted % 50000 == 0:
                elapsed = time.time() - t1
                log(f"   Inserted {inserted:,} ({elapsed:.0f}s)")

    if batch:
        cur.executemany(sql, batch)
        conn.commit()
        inserted += len(batch)

    cur.execute("SELECT COUNT(*) FROM ToolRegistry WHERE source='pypi'")
    final_count = cur.fetchone()[0]
    log("="*60)
    log(f"✅ FINAL: {final_count:,} tools in DB")
    log(f"   DB size: {os.path.getsize(DB_PATH)/1024/1024:.1f}MB")
    log("🏁 DONE")

    conn.close()

if __name__ == "__main__":
    main()

```

---

## `scripts/github_tools_phase2.py`

> Size: 12.2KB | Lines: 323 | Lang: python

```python
#!/usr/bin/env python3
"""
Phase 2: Extract tools from top 100 GitHub repos.
بيـ load الـ manifest اللي اتجمّع في Phase 1 و يستخرج الأدوات.
"""
import os, sys, json, time, urllib.request, urllib.parse, re, base64
from pathlib import Path
from datetime import datetime

LOG_FILE = Path("/tmp/github_harvester_phase2.log")
TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")
TOOLS_DIR.mkdir(parents=True, exist_ok=True)

GH_TOKEN = None
try:
    import subprocess
    result = subprocess.run(["git", "config", "--get", "remote.githubnew.url"], capture_output=True, text=True, cwd="/home/z/my-project")
    if result.returncode == 0:
        url = result.stdout.strip()
        m = re.search(r'ygfiouyg:([^@]+)@github', url)
        if m:
            GH_TOKEN = m.group(1)
except Exception:
    pass

def log(msg):
    line = f"[{datetime.now().strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")

def gh_request(url, retries=3):
    headers = {"Accept": "application/vnd.github.v3+json", "User-Agent": "AnzaroTools/1.0"}
    if GH_TOKEN:
        headers["Authorization"] = f"token {GH_TOKEN}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 403 and "rate limit" in str(e).lower():
                reset = int(e.headers.get("X-RateLimit-Reset", 0))
                wait = max(0, reset - int(time.time()))
                log(f"   ⚠️ Rate limited, waiting {wait}s")
                time.sleep(min(wait, 60))
                continue
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return None
        except Exception:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return None
    return None

def get_repo_tree(full_name, default_branch="main"):
    url = f"https://api.github.com/repos/{full_name}/git/trees/{default_branch}?recursive=1"
    return gh_request(url)

def get_file_content(full_name, path, default_branch="main"):
    url = f"https://api.github.com/repos/{full_name}/contents/{urllib.parse.quote(path, safe='/')}?ref={default_branch}"
    data = gh_request(url)
    if not data or "content" not in data:
        return None
    try:
        return base64.b64decode(data["content"]).decode("utf-8", errors="replace")
    except Exception:
        return None

def extract_tools_from_python(content, repo_name):
    tools = []
    pattern = re.compile(
        r'^(?:async\s+)?def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*(?:->\s*[^:]+)?:\s*\n\s*((?:"""[^"]*""")|(?:\'\'\'[^\']*\'\'\')|(?:#[^\n]*\n(?:\s*#[^\n]*\n)*))?',
        re.MULTILINE
    )
    for match in pattern.finditer(content):
        func_name = match.group(1)
        params = match.group(2)
        if func_name.startswith("_") or func_name in ("main", "run", "test", "setup", "init", "cli", "command"):
            continue
        if func_name in ("get", "set", "create", "delete", "update", "load", "save", "open", "close", "execute", "process"):
            continue
        docstring = ""
        doc_match = re.search(r'("""[^"]*?"""|\'\'\'[^\']*?\'\'\')', content[match.end():match.end()+500], re.DOTALL)
        if doc_match:
            docstring = doc_match.group(1).strip('\"\'').strip()[:200]
        param_list = []
        if params.strip():
            for p in [p.strip() for p in params.split(",")]:
                if not p or p.startswith("*") or p.startswith("/"):
                    continue
                if p in ("self", "cls"):
                    continue
                pname = p.split("=")[0].split(":")[0].strip()
                if pname and re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', pname):
                    pdefault = None
                    if "=" in p:
                        pdefault = p.split("=", 1)[1].strip()[:50]
                    param_list.append({"name": pname, "default": pdefault})
        if len(param_list) > 8:
            continue
        # Must have at least 1 param or a docstring
        if not param_list and not docstring:
            continue
        tools.append({
            "name": func_name,
            "params": param_list,
            "docstring": docstring,
        })
    return tools

def create_tool_file(tool, repo_info, source_file):
    safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', tool["name"]).lower()
    if safe_name.startswith("_"):
        safe_name = safe_name[1:]
    if not safe_name:
        return None
    
    repo_clean = re.sub(r'[^a-zA-Z0-9_]', '_', repo_info["name"]).lower()[:30]
    file_name = f"gh_{repo_clean}_{safe_name}.py"
    file_path = TOOLS_DIR / file_name
    
    if file_path.exists():
        return None
    
    sig_params = ", ".join(p["name"] for p in tool["params"])
    params_doc = "\n".join(
        f"  {p['name']}: {p.get('default') or 'required'}" 
        for p in tool["params"]
    ) or "  (no parameters)"
    
    # Sanitize strings for f-string
    safe_docstring = (tool["docstring"] or "N/A").replace('"', '\\"').replace('\n', ' ')[:200]
    safe_description = (repo_info["description"] or "Tool from GitHub").replace('"', '\\"').replace('\n', ' ')[:200]
    safe_repo_name = repo_info["name"].replace('"', '\\"')
    safe_pip_name = repo_info["name"].lower().replace('"', '\\"').replace(" ", "-")
    safe_import_name = safe_pip_name.replace("-", "_")
    
    content = f'''"""
Tool: {repo_info["name"]}_{tool["name"]}
Source: {repo_info["full_name"]} ({repo_info["stars"]:,} stars)
License: {repo_info["license"]}
Original file: {source_file}

Description:
{tool["docstring"] or repo_info["description"] or "Tool from " + repo_info["full_name"]}

Parameters:
{params_doc}

Repo URL: {repo_info["url"]}
"""

import sys, os, json
for p in ["/usr/local/lib/python3.11/dist-packages", "/app/.venv/lib/python3.12/site-packages"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)


def execute({sig_params}):
    """Execute {tool["name"]} from {repo_info["full_name"]}."""
    try:
        import importlib
        try:
            mod = importlib.import_module("{safe_import_name}")
            if hasattr(mod, "{tool["name"]}"):
                fn = getattr(mod, "{tool["name"]}")
                result = fn({sig_params})
                return {{"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "{repo_info["full_name"]}"}}
        except ImportError:
            pass
        
        return {{
            "success": False,
            "error": f"Package '{safe_repo_name}' not installed. Install: pip install {safe_pip_name}",
            "repo_url": "{repo_info["url"]}",
            "original_function": "{tool["name"]}",
            "docstring": "{safe_docstring}",
            "params": {json.dumps([p["name"] for p in tool["params"]])},
        }}
    except Exception as e:
        return {{"success": False, "error": str(e)[:200]}}


def _dispatch(args):
    """V.145 dispatch for tools/registry."""
    valid_keys = {[p["name"] for p in tool["params"]] if tool["params"] else []}
    filtered = {{k: v for k, v in args.items() if k in valid_keys}} if valid_keys else args
    return execute(**filtered)


if __name__ == "__main__":
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)
    print(json.dumps({{"usage": "Use --args_file <path> with JSON args", "params": {json.dumps([p["name"] for p in tool["params"]])}}}))
'''
    
    file_path.write_text(content, encoding="utf-8")
    return file_path

def main():
    log("=" * 60)
    log("🚀 Phase 2: GitHub Tools Extraction — START")
    log("=" * 60)
    
    # Load manifest
    manifest_path = Path("/home/z/my-project/exports/github_top_repos.json")
    if not manifest_path.exists():
        log("❌ Manifest not found. Run Phase 1 first.")
        return
    
    with open(manifest_path) as f:
        manifest = json.load(f)
    
    repos = sorted(manifest["repos"], key=lambda x: x["stars"], reverse=True)[:50]
    log(f"Loaded {len(repos)} repos from manifest (top 50 by stars)")
    
    # Check rate limit
    rl = gh_request("https://api.github.com/rate_limit")
    if rl:
        remaining = rl.get("resources", {}).get("core", {}).get("remaining", 0)
        log(f"Rate limit remaining: {remaining}")
        if remaining < 200:
            log("⚠️ Low rate limit, aborting")
            return
    
    tools_created = 0
    repos_processed = 0
    
    # Track already-processed repos (skip if any gh_<repo>_*.py exists)
    import glob
    existing_repos = set()
    for f in glob.glob(str(TOOLS_DIR / "gh_*.py")):
        fname = os.path.basename(f)
        # gh_<repo>_<func>.py → extract repo part
        parts = fname.replace("gh_", "").rsplit("_", 1)
        if len(parts) == 2:
            existing_repos.add(parts[0])
    log(f"Already processed {len(existing_repos)} repos (will skip)")
    
    for i, repo in enumerate(repos, 1):
        # Skip if already processed
        repo_clean = re.sub(r'[^a-zA-Z0-9_]', '_', repo["name"]).lower()[:30]
        if repo_clean in existing_repos:
            log(f"[{i}/{len(repos)}] ⏭️  Skip {repo['full_name']} (already done)")
            continue
        
        log(f"\n[{i}/{len(repos)}] {repo['full_name']} ({repo['stars']:,} stars)")
        
        tree = get_repo_tree(repo["full_name"], repo.get("default_branch", "main"))
        if not tree or "tree" not in tree:
            log(f"   ❌ Failed to get tree")
            continue
        
        # Find Python files
        py_files = []
        for item in tree["tree"]:
            if item["type"] != "blob":
                continue
            path = item["path"]
            if not path.endswith(".py"):
                continue
            if any(skip in path.lower() for skip in ["test", "tests/", "docs/", "example", "examples/", "setup.py", "conftest", "__init__", "benchmark", "scripts/", "migrations", "vendor", ".github"]):
                continue
            if item.get("size", 0) > 50_000:
                continue
            py_files.append({"path": path, "size": item.get("size", 0)})
        
        # Sort by size (smaller files more likely to be utility modules)
        py_files.sort(key=lambda x: x["size"])
        py_files = py_files[:8]
        log(f"   Found {len(py_files)} candidate Python files")
        
        repo_tools_count = 0
        for py_file in py_files[:5]:
            content = get_file_content(repo["full_name"], py_file["path"], repo.get("default_branch", "main"))
            if not content or len(content) < 100:
                continue
            tools = extract_tools_from_python(content, repo["name"])
            for tool in tools[:3]:
                file_path = create_tool_file(tool, repo, py_file["path"])
                if file_path:
                    tools_created += 1
                    repo_tools_count += 1
            time.sleep(0.1)
        
        log(f"   ✅ Created {repo_tools_count} tools from this repo")
        repos_processed += 1
        time.sleep(0.3)
        
        # Save progress every 10 repos
        if i % 10 == 0:
            log(f"   📊 Progress: {tools_created} tools created so far")
            # Check rate limit
            rl = gh_request("https://api.github.com/rate_limit")
            if rl:
                remaining = rl.get("resources", {}).get("core", {}).get("remaining", 0)
                log(f"   📊 Rate limit remaining: {remaining}")
                if remaining < 50:
                    log(f"   ⚠️ Stopping due to low rate limit")
                    break
    
    log(f"\n{'=' * 60}")
    log(f"🏁 PHASE 2 COMPLETE")
    log(f"{'=' * 60}")
    log(f"   Repos processed: {repos_processed}")
    log(f"   Tools created: {tools_created}")
    
    final_tools = list(TOOLS_DIR.glob("gh_*.py"))
    log(f"   Total GitHub tools in dir: {len(final_tools)}")

if __name__ == "__main__":
    main()

```

---

## `scripts/generate_gh_registry.py`

> Size: 8.4KB | Lines: 275 | Lang: python

```python
#!/usr/bin/env python3
"""
Auto-generate registry entries for all gh_*.py tools.
بيـ scan الـ tools directory و يـ generate tool definitions.
"""
import os, re, json
from pathlib import Path

TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")
OUTPUT_FILE = Path("/home/z/my-project/src/lib/tools-registry/gh_tools_registry.ts")

def extract_metadata(filepath):
    """Extract metadata from a Python tool file."""
    content = filepath.read_text()
    
    # Extract name from filename
    fname = filepath.stem  # gh_flask_create_logger
    parts = fname.replace("gh_", "").rsplit("_", 1)
    if len(parts) == 2:
        repo_name, func_name = parts
        tool_name = f"gh_{repo_name}_{func_name}"
    else:
        tool_name = fname
        repo_name = "unknown"
        func_name = fname
    
    # Extract docstring
    desc_match = re.search(r'^"""\s*\n(.*?)\n^"""', content, re.MULTILINE | re.DOTALL)
    description = ""
    if desc_match:
        desc_block = desc_match.group(1)
        # Get the first non-empty line that's not a "Tool:" / "Source:" / etc header
        for line in desc_block.split("\n"):
            line = line.strip()
            if not line: continue
            if line.startswith(("Tool:", "Source:", "License:", "Original file:", "Parameters:", "Repo URL:", "Description:")):
                continue
            description = line[:200]
            break
    
    # Extract source repo
    source_match = re.search(r'Source:\s*(\S+)', content)
    source_repo = source_match.group(1) if source_match else ""
    
    # Extract license
    license_match = re.search(r'License:\s*(\S+)', content)
    license_name = license_match.group(1) if license_match else "NO_LICENSE"
    
    # Extract params from def execute(...)
    params = []
    exec_match = re.search(r'def execute\s*\(([^)]*)\)', content)
    if exec_match:
        params_str = exec_match.group(1).strip()
        if params_str:
            for p in [p.strip() for p in params_str.split(",")]:
                if p and not p.startswith("*"):
                    pname = p.split("=")[0].split(":")[0].strip()
                    if pname and re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', pname):
                        params.append(pname)
    
    return {
        "name": tool_name,
        "file": filepath.name,
        "description": description or f"Tool from {source_repo}",
        "source_repo": source_repo,
        "license": license_name,
        "params": params,
    }


def main():
    print("🔍 Scanning tools directory...")
    tools = []
    for f in sorted(TOOLS_DIR.glob("gh_*.py")):
        meta = extract_metadata(f)
        tools.append(meta)
        print(f"   ✅ {meta['name']} ({len(meta['params'])} params)")
    
    print(f"\n✅ Found {len(tools)} tools")
    
    # Generate TypeScript registry
    ts_content = """/**
 * GitHub Tools Registry — Auto-generated from src/lib/tools-registry/python/gh_*.py
 *
 * V.146: كل أداة دي implementation مستخرجة من top GitHub repos.
 * لكل أداة:
 *   - الـ source repo (مع عدد stars)
 *   - الـ original function name
 *   - الـ parameters المتوقعة
 *   - install instructions (pip install <package>)
 *
 * Generated at: """ + __import__('datetime').datetime.now().isoformat() + """
 */

import { spawn } from "child_process";
import { existsSync, promises as fs } from "fs";
import path from "path";
import * as os from "os";

const PYTHON_PATHS = [
  "/usr/local/lib/python3.11/dist-packages",
  "/app/.venv/lib/python3.12/site-packages",
  "/home/z/.venv/lib/python3.12/site-packages",
];

const TOOLS_DIR = path.join(process.cwd(), "src", "lib", "tools-registry", "python");

async function runGhPythonTool(scriptName: string, args: any, timeoutMs: number = 30000): Promise<any> {
  const scriptPath = path.join(TOOLS_DIR, scriptName);
  if (!existsSync(scriptPath)) {
    return { success: false, error: `script not found: ${scriptName}` };
  }

  const tmpArgsFile = path.join(os.tmpdir(), `anzaro_gh_args_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`);
  await fs.writeFile(tmpArgsFile, JSON.stringify(args), "utf-8");

  return new Promise((resolve) => {
    const proc = spawn("python3", [scriptPath, "--args_file", tmpArgsFile], {
      cwd: "/tmp",
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONPATH: PYTHON_PATHS.join(":"),
      },
    });

    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, error: `Timeout after ${timeoutMs}ms` });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      fs.unlink(tmpArgsFile).catch(() => {});

      if (code === 0 && stdout.trim()) {
        const lines = stdout.trim().split("\\n").filter((l) => l.trim());
        const lastLine = lines[lines.length - 1];
        try {
          resolve(JSON.parse(lastLine));
        } catch {
          resolve({ success: true, output: stdout });
        }
      } else {
        resolve({
          success: false,
          error: `Python exited with code ${code}`,
          stderr: stderr.slice(-300),
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, error: e.message });
    });
  });
}

export interface GhToolDefinition {
  name: string;
  description: string;
  category: "github";
  runtime: "python";
  source_repo: string;
  license: string;
  parameters: Record<string, { type: string; description: string }>;
  execute: (args: any) => Promise<any>;
}

"""
    
    # Generate tool definitions
    ts_content += "export const GH_TOOLS: GhToolDefinition[] = [\n"
    for tool in tools:
        # Sanitize
        safe_name = tool["name"]
        safe_desc = tool["description"].replace('"', '\\"').replace('\n', ' ')[:200]
        safe_repo = tool["source_repo"].replace('"', '\\"')
        safe_license = tool["license"].replace('"', '\\"')
        safe_file = tool["file"]
        
        # Build parameters object
        params_obj = ", ".join(
            f'{p}: {{ type: "string", description: "parameter {p}" }}'
            for p in tool["params"]
        )
        params_str = "{" + params_obj + "}" if tool["params"] else "{}"
        
        ts_content += f"""  {{
    name: "{safe_name}",
    description: "{safe_desc}",
    category: "github",
    runtime: "python",
    source_repo: "{safe_repo}",
    license: "{safe_license}",
    parameters: {params_str},
    execute: async (args) => runGhPythonTool("{safe_file}", args),
  }},
"""
    
    ts_content += "];\n\n"
    
    # Add helper functions
    ts_content += """export function getGhTools(): GhToolDefinition[] {
  return GH_TOOLS;
}

export function findGhTool(name: string): GhToolDefinition | null {
  return GH_TOOLS.find((t) => t.name === name) || null;
}

export async function executeGhTool(name: string, args: any): Promise<{ success: boolean; output?: any; error?: string; durationMs: number }> {
  const start = Date.now();
  const tool = findGhTool(name);
  if (!tool) {
    return { success: false, error: `GitHub tool '${name}' not found`, durationMs: 0 };
  }
  try {
    const result = await tool.execute(args);
    return {
      success: result?.success !== false,
      output: result,
      durationMs: Date.now() - start,
    };
  } catch (e: any) {
    return { success: false, error: e.message, durationMs: Date.now() - start };
  }
}

export function getGhToolsSchema() {
  return GH_TOOLS.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: `[GitHub:${t.source_repo}] ${t.description}`,
      parameters: {
        type: "object",
        properties: t.parameters,
      },
    },
    category: t.category,
    runtime: t.runtime,
    source_repo: t.source_repo,
    license: t.license,
  }));
}

export function getGhStats() {
  const repos = new Set(GH_TOOLS.map((t) => t.source_repo));
  return {
    total: GH_TOOLS.length,
    unique_repos: repos.size,
  };
}
"""
    
    OUTPUT_FILE.write_text(ts_content)
    print(f"\n✅ Generated {OUTPUT_FILE}")
    print(f"   Total tools: {len(tools)}")
    print(f"   Unique repos: {len(set(t['source_repo'] for t in tools))}")
    
    # Print sample
    if tools:
        print(f"\n   Sample tool:")
        print(f"     {tools[0]['name']}: {tools[0]['description'][:60]}")


if __name__ == "__main__":
    main()

```

---

## `scripts/patch_python_tools.py`

> Size: 6.1KB | Lines: 150 | Lang: python

```python
#!/usr/bin/env python3
"""Patch all Python tool scripts to support --args_file argument."""
import os, re
from pathlib import Path

TOOLS_DIR = Path("/home/z/my-project/tools/python")

# Common pattern to inject at the top of __main__ block
ARGS_FILE_PATCH = '''
    # V.145: Support --args_file (called from Node.js registry)
    import sys as _sys
    if "--args_file" in _sys.argv:
        import json as _json
        _idx = _sys.argv.index("--args_file")
        with open(_sys.argv[_idx + 1]) as _f:
            _args = _json.load(_f)
        # Map args to function call based on script
        _result = _dispatch(_args)
        print(_json.dumps(_result, ensure_ascii=False, default=str))
        _sys.exit(0)
'''

# Per-script dispatch logic (each script gets its own dispatcher)
DISPATCHERS = {
    "sentiment_analysis.py": '''
def _dispatch(args):
    return analyze(args.get("text", ""), args.get("language", "auto"))
''',
    "text_classifier.py": '''
def _dispatch(args):
    return classify(args.get("text", ""), args.get("categories"))
''',
    "text_summarizer.py": '''
def _dispatch(args):
    return summarize(args.get("text", ""), int(args.get("sentences_count", 3)), args.get("language", "en"))
''',
    "keyword_extractor.py": '''
def _dispatch(args):
    return extract_keywords(args.get("text", ""), int(args.get("top_n", 10)), args.get("language", "en"))
''',
    "language_detector.py": '''
def _dispatch(args):
    return detect(args.get("text", ""))
''',
    "csv_analyzer.py": '''
def _dispatch(args):
    return analyze(args.get("csv_path"), args.get("csv_text"), args.get("analysis_type", "summary"))
''',
    "statistics_calculator.py": '''
def _dispatch(args):
    return calc(args.get("numbers", []), args.get("operation", "descriptive"), args.get("numbers2"))
''',
    "data_visualizer.py": '''
def _dispatch(args):
    return create_chart(args.get("chart_type"), args.get("x"), args.get("y"), args.get("title", ""), args.get("x_label", ""), args.get("y_label", ""), args.get("output_path", "/tmp/chart.png"))
''',
    "web_scraper.py": '''
def _dispatch(args):
    return scrape(args.get("url", ""), args.get("extract", "all"), int(args.get("timeout", 30)))
''',
    "http_api_tester.py": '''
def _dispatch(args):
    return test_request(args.get("url", ""), args.get("method", "GET"), args.get("headers"), args.get("params"), args.get("body"), args.get("body_type", "json"), int(args.get("timeout", 30)))
''',
    "youtube_downloader.py": '''
def _dispatch(args):
    return download(args.get("url", ""), args.get("format", "best"), args.get("output_path", "/tmp/youtube_downloads"), bool(args.get("extract_info_only", False)))
''',
    "image_processor.py": '''
def _dispatch(args):
    return process(args.get("input_path", ""), args.get("output_path", ""), args.get("operation", ""), args.get("params", {}))
''',
    "ocr_extractor.py": '''
def _dispatch(args):
    return extract_text(args.get("image_path", ""), args.get("language", "eng"), args.get("output_format", "text"))
''',
    "pdf_processor.py": '''
def _dispatch(args):
    return process(args.get("pdf_path", ""), args.get("operation", "extract_text"), args.get("output_path"), args.get("pages", "all"), args.get("merge_files"))
''',
    "audio_processor.py": '''
def _dispatch(args):
    return process(args.get("input_path"), args.get("output_path"), args.get("operation", "info"), args.get("params", {}))
''',
    "text_to_speech.py": '''
def _dispatch(args):
    return synthesize(args.get("text", ""), args.get("voice", "auto"), args.get("output_path", "/tmp/tts_output.mp3"), args.get("rate", "+0%"), args.get("volume", "+0%"))
''',
    "qr_code_generator.py": '''
def _dispatch(args):
    return generate(args.get("data", ""), args.get("output_path", "/tmp/qr.png"), int(args.get("size", 10)), int(args.get("border", 4)), args.get("fill_color", "black"), args.get("back_color", "white"), args.get("error_correction", "M"))
''',
    "translator.py": '''
def _dispatch(args):
    return translate(args.get("text", ""), args.get("source_lang", "auto"), args.get("target_lang", "en"), args.get("engine", "google"))
''',
    "document_generator.py": '''
def _dispatch(args):
    return generate(args.get("format", ""), args.get("output_path", ""), args.get("title", ""), args.get("content", {}))
''',
    "fake_data_generator.py": '''
def _dispatch(args):
    return generate(args.get("data_type", "name"), int(args.get("count", 10)), args.get("locale", "en_US"))
''',
    "file_utilities.py": '''
def _dispatch(args):
    return operations(args.get("operation", ""), args.get("path"), args.get("params", {}))
''',
    "crypto_utilities.py": '''
def _dispatch(args):
    return operations(args.get("operation", ""), args.get("data", ""), args.get("params", {}))
''',
    "math_solver.py": '''
def _dispatch(args):
    return solve(args.get("operation", ""), args.get("expression", ""), args.get("variable", "x"), args.get("params", {}))
''',
}

patched = 0
for script_path in sorted(TOOLS_DIR.glob("*.py")):
    name = script_path.name
    if name in DISPATCHERS:
        content = script_path.read_text()
        # Skip if already patched
        if "_dispatch" in content and "--args_file" in content:
            print(f"  ⏭️  {name} (already patched)")
            continue
        dispatcher = DISPATCHERS[name]
        # Insert dispatcher before __main__ block
        if 'if __name__ == "__main__":' in content:
            # Insert dispatcher just before __main__
            content = content.replace(
                'if __name__ == "__main__":',
                dispatcher + '\n\nif __name__ == "__main__":'
            )
            # Insert args_file handler at the top of __main__ block
            # Find the line after __main__: and insert our handler
            content = content.replace(
                'if __name__ == "__main__":\n    import argparse',
                'if __name__ == "__main__":\n' + ARGS_FILE_PATCH + '\n    import argparse'
            )
            script_path.write_text(content)
            print(f"  ✅ {name} (patched)")
            patched += 1
        else:
            print(f"  ⚠️  {name} (no __main__ block)")
    else:
        print(f"  ❓ {name} (no dispatcher)")

print(f"\n✅ Patched {patched} scripts")

```

---

## `scripts/patch_gh_submodules.py`

> Size: 4.6KB | Lines: 101 | Lang: python

```python
#!/usr/bin/env python3
"""Patch all gh_*.py tools to try submodules if top-level import fails."""
import re
from pathlib import Path

TOOLS_DIR = Path("/home/z/my-project/src/lib/tools-registry/python")

# Map of known submodules for common packages
SUBMODULE_HINTS = {
    "requests": ["requests._internal_utils", "requests.utils", "requests.sessions", "requests.models", "requests.adapters", "requests.hooks", "requests.auth", "requests.cookies", "requests.structures"],
    "flask": ["flask.logging", "flask.helpers", "flask.app", "flask.config", "flask.ctx", "flask.globals", "flask.wrappers", "flask.blueprints"],
    "whisper": ["whisper.audio", "whisper.decoding", "whisper.model", "whisper.tokenizer", "whisper.triton"],
    "langchain": ["langchain_core", "langchain_community", "langchain.chains", "langchain.agents", "langchain.tools", "langchain.utilities"],
    "django": ["django.conf", "django.core", "django.db", "django.utils", "django.http", "django.urls", "django.views"],
    "fastapi": ["fastapi.routing", "fastapi.params", "fastapi.security", "fastapi.middleware", "fastapi.encoders", "fastapi.openapi"],
    "playwright": ["playwright.sync_api", "playwright.async_api", "playwright._impl"],
    "scrapy": ["scrapy.spiders", "scrapy.crawler", "scrapy.selector", "scrapy.http", "scrapy.utils", "scrapy.pipelines"],
    "pandas": ["pandas.core", "pandas.io", "pandas.api", "pandas.util"],
    "numpy": ["numpy.core", "numpy.lib", "numpy.fft", "numpy.linalg", "numpy.random", "numpy.ma"],
    "transformers": ["transformers.models", "transformers.pipelines", "transformers.tokenization_utils", "transformers.modeling_utils"],
}

patched = 0
for f in TOOLS_DIR.glob("gh_*.py"):
    content = f.read_text()
    
    # Extract package name from content
    pkg_match = re.search(r"importlib\.import_module\(\"([^\"]+)\"\)", content)
    if not pkg_match:
        continue
    pkg_name = pkg_match.group(1)
    
    # Get the function name from filename
    fname = f.stem  # gh_requests_unicode_is_ascii
    parts = fname.replace("gh_", "").rsplit("_", 1)
    if len(parts) != 2:
        continue
    repo_part, func_name = parts
    # The function name in the file
    func_match = re.search(r'hasattr\(mod, "([^"]+)"\)', content)
    if not func_match:
        continue
    orig_func = func_match.group(1)
    
    # Skip if already patched
    if "submodules_to_try" in content:
        continue
    
    # Get submodules to try
    submodules = SUBMODULE_HINTS.get(pkg_name, [])
    if not submodules:
        continue
    
    # Build the new import logic
    submodules_str = ", ".join(f'"{s}"' for s in submodules)
    
    # Replace the import block
    old_block = f'''        try:
            mod = importlib.import_module("{pkg_name}")
            if hasattr(mod, "{orig_func}"):
                fn = getattr(mod, "{orig_func}")
                result = fn({", ".join(re.findall(r'def execute\s*\(([^)]*)\)', content)[0].split(",") if re.search(r'def execute\s*\(([^)]*)\)', content) else [])})
                return {{"success": True, "result": str(result)[:2000] if result is not None else "None", "source": "{pkg_name}"}}'''
    
    # Actually let's just add submodule fallback BEFORE the original block
    # Insert after: try:\n        import importlib
    fallback_block = f'''
        # V.146: Try submodules if top-level import doesn't have the function
        submodules_to_try = [{submodules_str}]
        for submod_name in submodules_to_try:
            try:
                submod = importlib.import_module(submod_name)
                if hasattr(submod, "{orig_func}"):
                    fn = getattr(submod, "{orig_func}")
'''
    
    # Get the params from execute()
    exec_match = re.search(r'def execute\s*\(([^)]*)\)', content)
    if not exec_match:
        continue
    params = [p.strip().split("=")[0].split(":")[0].strip() for p in exec_match.group(1).split(",") if p.strip() and not p.startswith("*")]
    params_call = ", ".join(params)
    
    fallback_block += f'''                    result = fn({params_call})
                    return {{"success": True, "result": str(result)[:2000] if result is not None else "None", "source": submod_name}}
            except (ImportError, AttributeError):
                continue
'''
    
    # Insert the fallback block after `try:\n        import importlib\n`
    new_content = content.replace(
        '    try:\n        import importlib',
        '    try:\n        import importlib\n' + fallback_block
    )
    
    if new_content != content:
        f.write_text(new_content)
        patched += 1
        print(f"  ✅ {f.name}")

print(f"\n✅ Patched {patched} tools with submodule fallback")

```

---

## `scripts/db_sync_manager.py`

> Size: 4.1KB | Lines: 119 | Lang: python

```python
#!/usr/bin/env python3
"""
V.115: DB Sync Manager — بيـ sync الـ DB مع HF Dataset.
- عند الـ startup: download الـ DB قبل ما الـ Next.js يبدأ (blocking)
- كل تعديل: upload للـ DB لـ HF Dataset (auto-sync)
"""
import os, sys, sqlite3, shutil, time, threading, subprocess
from pathlib import Path

DB_PATH = os.environ.get("DB_PATH", "/app/db/custom.db")
HF_TOKEN = os.environ.get("HF_TOKEN", "")
DATASET_REPO = os.environ.get("HF_DATASET_REPO", "ebsaya/anzaro-tools-db")
SYNC_INTERVAL = 300  # 5 minutes
LOG_FILE = os.environ.get("DB_SYNC_LOG", "/tmp/db_sync.log")

def log(msg):
    line = f"[{time.strftime('%H:%M:%S')}] {msg}"
    print(line, flush=True)
    Path(LOG_FILE).parent.mkdir(parents=True, exist_ok=True)
    with open(LOG_FILE, "a") as f: f.write(line + "\n")

def db_has_data():
    """بيـ check لو الـ DB فيه ToolRegistry data (مش بس أي data)."""
    if not os.path.exists(DB_PATH):
        return False
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        # check ToolRegistry table exists + has data
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='ToolRegistry'")
        if not cur.fetchone():
            conn.close()
            return False
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        count = cur.fetchone()[0]
        conn.close()
        log(f"   DB check: ToolRegistry has {count:,} rows")
        return count > 1000
    except Exception as e:
        log(f"   DB check error: {e}")
        return False

def download_db():
    """بيـ download الـ DB من HF Dataset (blocking — لازم يخلص قبل الـ Next.js)."""
    log("📥 Downloading DB from HF Dataset (blocking)...")
    try:
        from huggingface_hub import hf_hub_download
        kwargs = {"repo_id": DATASET_REPO, "filename": "custom.db", "repo_type": "dataset", "local_dir": "/tmp/hf_db_sync"}
        if HF_TOKEN:
            kwargs["token"] = HF_TOKEN
        path = hf_hub_download(**kwargs)
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        shutil.copy(path, DB_PATH)
        size_mb = os.path.getsize(DB_PATH) / 1024 / 1024
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        tools = cur.fetchone()[0]
        cur.execute("SELECT COUNT(*) FROM SkillRegistry")
        skills = cur.fetchone()[0]
        conn.close()
        log(f"✅ DB downloaded ({size_mb:.1f}MB) | Tools: {tools:,} | Skills: {skills:,}")
        return True
    except Exception as e:
        log(f"❌ Download failed: {e}")
        return False

def upload_db():
    """بيـ upload الـ DB لـ HF Dataset."""
    if not os.path.exists(DB_PATH):
        return False
    try:
        from huggingface_hub import HfApi
        api = HfApi(token=HF_TOKEN) if HF_TOKEN else HfApi()
        api.upload_file(
            path_or_fileobj=DB_PATH,
            path_in_repo="custom.db",
            repo_id=DATASET_REPO,
            repo_type="dataset",
        )
        log("✅ DB uploaded to HF Dataset")
        return True
    except Exception as e:
        log(f"⚠️ Upload failed: {e}")
        return False

def sync_loop():
    """بيـ upload الـ DB كل 5 دقايق في background."""
    log("🔄 Starting sync loop (every 5 min)...")
    while True:
        time.sleep(SYNC_INTERVAL)
        if db_has_data():
            upload_db()

def main():
    log("=" * 50)
    log("🚀 V.115 DB Sync Manager — START")
    log("=" * 50)

    # blocking download
    if not db_has_data():
        download_db()
    else:
        log("✅ DB already has data")
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM ToolRegistry")
        log(f"   Tools: {cur.fetchone()[0]:,}")
        conn.close()

    # start sync loop in background
    sync_thread = threading.Thread(target=sync_loop, daemon=True)
    sync_thread.start()
    log("🔄 Sync loop started in background")

    log("🏁 DB Sync Manager — DONE (DB ready for Next.js)")

if __name__ == "__main__":
    main()

```

---


# 📂 Mobile App

## `mobile-app/package.json`

> Size: 369B | Lines: 19 | Lang: json

```json
{
  "name": "anzaro-mobile",
  "version": "3.0.0",
  "main": "src/App.tsx",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "react": "18.2.0",
    "react-native": "0.74.5"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}

```

---

## `mobile-app/src/App.tsx`

> Size: 515B | Lines: 11 | Lang: tsx

```tsx
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0f0f1e', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#7c3aed', marginBottom: 20 }} />
      <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: 'bold' }}>Anzaro</Text>
      <Text style={{ color: '#9ca3af', fontSize: 16, marginTop: 8 }}>الكرة الذكية</Text>
    </View>
  );
}

```

---

## `mobile-app/src/config.ts`

> Size: 1.8KB | Lines: 66 | Lang: typescript

```typescript
/**
 * Anzaro Mobile — App Configuration
 * V.14: All config values use null-coalescing (??) with safe defaults.
 */
import Constants from 'expo-constants';

export const ANZARO_API_URL: string =
  Constants?.expoConfig?.extra?.ANZARO_API_URL ??
  'https://kopabdo-delta-ai-v2.hf.space';

export const HASS_URL: string | null =
  Constants?.expoConfig?.extra?.HASS_URL ?? null;

export const HASS_TOKEN: string | null =
  Constants?.expoConfig?.extra?.HASS_TOKEN ?? null;

export const isHassConfigured: boolean = !!(HASS_URL && HASS_TOKEN);

// ─── Identity Matrix Types ───
export interface IdentityMatrix {
  archetypes: string[];
  primaryArchetype: string;
  traits: Record<string, number>;
  darkTriad: { machiavellianism: number; narcissism: number; psychopathy: number };
  cognitiveStyle: 'analytical' | 'creative' | 'philosophical' | 'pragmatic';
  growthFrictionLevel: 'none' | 'gentle' | 'moderate' | 'aggressive';
  confidenceScore: number;
  personaVersion: string;
  systemPersona: string;
}

export const EMPTY_MATRIX: IdentityMatrix = {
  archetypes: [],
  primaryArchetype: 'unknown',
  traits: {},
  darkTriad: { machiavellianism: 50, narcissism: 50, psychopathy: 50 },
  cognitiveStyle: 'pragmatic',
  growthFrictionLevel: 'none',
  confidenceScore: 0,
  personaVersion: 'v0.0',
  systemPersona: '',
};

// ─── HASS Device Types ───
export interface HassDevice {
  entity_id: string;
  friendly_name: string;
  domain: string;
  state: string;
  attributes: Record<string, any>;
}

// ─── Theme ───
export const COLORS = {
  background: '#0f0f1e',
  card: '#1a1a2e',
  cardLight: '#1e1e32',
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  text: '#ffffff',
  textMuted: '#9ca3af',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  border: 'rgba(255,255,255,0.1)',
};

```

---


# 📂 Docs

## `README.md`

> Size: 475B | Lines: 23 | Lang: markdown

```markdown
---
title: Delta AI V2
emoji: "🤖"
colorFrom: green
colorTo: blue
sdk: docker
app_port: 3000
pinned: false
license: mit
---

# Delta AI V2 — Unified AI Platform

منصة ذكاء اصطناعي متكاملة: Anzaro AI + Hermes Agent + 861K tools + 32 models.

## Tech Stack
- Next.js 16 (App Router)
- TypeScript 5
- Prisma ORM (SQLite)
- Tailwind CSS 4 + shadcn/ui

## Configuration
This Space uses a Dockerfile to build and run the Next.js application on port 3000.

```

---

## `MIGRATION.md`

> Size: 4.5KB | Lines: 115 | Lang: markdown

```markdown
# Migration: kopabdo → abdelslam-ai

## تاريخ Migration: 2026-07-31

### السبب
حساب HF القديم `kopabdo` تم عمل lock له من Hugging Face بسبب ToS violation.
تم إنشاء حساب جديد `abdelslam-ai` لنقل كل المشروع عليه.

---

## ✅ اللي اتعمل (Migration Complete)

### 1. HF Datasets (311MB + manifest)
| القديم (محذوف) | الجديد (شغال) |
|----------------|---------------|
| `kopabdo/anzaro-tools-db` | **`abdelslam-ai/anzaro-tools-db`** ✅ |
| `kopabdo/anzaro-python-wheels` | **`abdelslam-ai/anzaro-python-wheels`** ✅ |

- **DB**: 311MB فيه 861,572 أداة + 410 مثبتة + 70 skills
- **Wheels Manifest**: list بأسماء الـ packages المثبتة + requirements.txt

### 2. HF Space (Code Backup)
- **Static Space**: `abdelslam-ai/DELTA_AI_V2_CODE` ✅
  - فيه 1,582 ملف (كل كود الـ project)
  - للأسف مش Docker Space (الحساب الجديد free tier — يحتاج Pro لـ Docker Spaces)

### 3. GitHub Repo (كامل)
- **https://github.com/ygfiouyg/DELTA_AI_V2** ✅
  - كل الكود + Dockerfile + scripts
  - branch: main
  - آخر commit: `3589df24 V144: Migrate to new HF account abdelslam-ai`

### 4. الكود اتعدل
كل الـ references في الكود اتغيرت من `kopabdo` → `abdelslam-ai`:
- `src/app/api/auth/*` — NEXTAUTH_URL
- `src/app/api/oauth/*` — BASE_URL
- `src/app/api/spotify/*` — REDIRECT_URI
- `src/lib/skill-registry.ts` — HF_REPO_ID
- `src/lib/auth-nextauth.ts` — fallback URL
- `src/lib/hf-document.service.ts` — DELTA_AI_SPACE_URL
- `src/lib/integrations/telegram-webhook.ts` — public URL
- `src/lib/agents/n8n-templates.ts` — DELTAAI_API_URL
- `src/lib/mcp/tools/github-create-issue.ts` — example repo
- `src/lib/mcp/tools/google-auth.ts` — NEXTAUTH_URL
- `src/components/delta/header.tsx` — HF Space link
- `Dockerfile` — NEXTAUTH_URL + secrets
- `scripts/db_sync_manager.py` — DATASET_REPO (env-configurable)
- `scripts/install_from_wheels.py` — WHEELS_DATASET (env-configurable)
- `scripts/restore_db.py` — DATASET_REPO (env-configurable)

---

## ⚠️ اللي محتاج تعمله يدويًا

### 1. تفعيل Docker Space على الحساب الجديد
الحساب الجديد `abdelslam-ai` هو **Free Tier** — Docker Spaces محتاجة PRO.

**الخيارات:**
- **A)** اشترك PRO في حساب `abdelslam-ai` ($9/شهر): https://huggingface.co/pro
- **B)** اعمل transfer للـ Space من `kopabdo` لـ `abdelslam-ai` (محتاج فك الـ lock أولاً)
- **C)** استخدم حساب تالت PRO جديد

بعد ما تشترك PRO، شغّل:
```bash
python3 -c "
from huggingface_hub import HfApi
api = HfApi(token='YOUR_NEW_HF_TOKEN')
api.create_repo(repo_id='abdelslam-ai/DELTA_AI_V2', repo_type='space', space_sdk='docker')
"

# Push الكود:
git remote add hfnew https://abdelslam-ai:YOUR_NEW_HF_TOKEN@huggingface.co/spaces/abdelslam-ai/DELTA_AI_V2
git push hfnew main
```

### 2. ضبط HF Secrets على الـ Space الجديد
في Settings → Repository secrets:
```
HF_TOKEN = <your-new-hf-token>
HF_DATASET_REPO = abdelslam-ai/anzaro-tools-db
HF_WHEELS_REPO = abdelslam-ai/anzaro-python-wheels
ADMIN_EMAIL = admin@anzaro.local
ADMIN_PASSWORD = <your-password>
ZAI_API_KEY = <your-zai-key>
```

### 3. Persistent Storage (اختياري - 20GB مجاني مع PRO)
في Settings → Persistent storage → upgrade to 20GB small
الـ DB هيتـ store في `/data/custom.db` بدل ما يتـ download من HF Dataset كل مرة.

---

## معلومات الحسابات

| Service | Username | Token |
|---------|----------|-------|
| HF (new) | `abdelslam-ai` | (متوفر بأمان — استخدم اللي اتبعتلك في الـ IM) |
| HF (old - locked) | `kopabdo` | محذوف (الحساب مقفول) |
| GitHub | `ygfiouyg` | (متوفر في git config) |

## URLs بعد التفعيل
- HF Space: `https://abdelslam-ai-delta-ai-v2.hf.space`
- HF DB Dataset: `https://huggingface.co/datasets/abdelslam-ai/anzaro-tools-db`
- HF Wheels Dataset: `https://huggingface.co/datasets/abdelslam-ai/anzaro-python-wheels`
- HF Code Backup: `https://huggingface.co/spaces/abdelslam-ai/DELTA_AI_V2_CODE`
- GitHub: `https://github.com/ygfiouyg/DELTA_AI_V2`

---

## إحصائيات الـ DB الجديد
- **ToolRegistry**: 861,572 أداة (PyPI packages)
- **Installed tools**: 410 (معروفين كـ installed)
- **SkillRegistry**: 70 skills (local skills من /skills/)
- **DB size**: 311MB
- **تم الرفع**: ✅ على `abdelslam-ai/anzaro-tools-db`

```

---

## `EXECUTION_PLAN.md`

> Size: 17.6KB | Lines: 523 | Lang: markdown

> ⚠️ File truncated to first 500 lines (total: 523)

```markdown
# 📋 خطة التنفيذ التنفيذية — DELTA_AI_V2

> **تاريخ الإعداد:** 2026-08-04  
> **المُعد:** Z.ai Code (بناءً على طلب أ. عبدالسلام)  
> **الهدف:** خطة تنفيذية واضحة لتحويل DELTA_AI_V2 من prototype إلى production-ready

---

## 🎯 المرحلة 0: ما قبل التنفيذ (Pre-Flight Checks)

قبل البدء في أي تنفيذ، يجب التأكد من الآتي:

### 0.1 مراجعة البيئة الحالية
- [ ] التأكد من تثبيت Node.js 20+ و Bun
- [ ] التأكد من تثبيت Python 3.11+ مع pip
- [ ] التأكد من تثبيت Docker و Docker Compose
- [ ] التأكد من وجود نسخة احتياطية كاملة من الـ DB (304MB)
- [ ] التأكد من وجود `.env` file بمفاتيح API الصحيحة

### 0.2 تحديد الأولويات
بناءً على التحليل، الترتيب الصحيح للأولويات هو:
1. **P0 (Critical):** الاستقرار + الأمان + الـ Deployment
2. **P1 (High):** الـ Testing + الـ Refactoring الأساسي
3. **P2 (Medium):** التحسينات + الـ Documentation
4. **P3 (Low):** الـ Features الجديدة + التوسعات

---

## 🚨 المرحلة 1: إصلاحات حرجة (P0 — Critical)

> **الهدف:** جعل المنصة مستقرة وقابلة للتشغيل بدون crashes  
> **المدة المقدرة:** 3-5 أيام  
> **الجهد:** ~40 ساعة

### 1.1 حل مشكلة OOM (Out of Memory)

**المشكلة:** Next.js dev server يستهلك 2-3GB RAM ويتسبب في crashes.

**خطة التنفيذ:**
- [ ] تحويل التشغيل الافتراضي من `dev` إلى `production` (`next build` + `next start`)
- [ ] تحديث `package.json` script `start` لاستخدام `next start` بدلاً من `next dev`
- [ ] إضافة `NODE_OPTIONS=--max-old-space-size=1024` في الـ Dockerfile
- [ ] تحسين `next.config.ts`:
  - تقليل `optimizePackageImports` list
  - إضافة `swcMinify: true`
  - تفعيل `compress: true`
- [ ] اختبار الذاكرة بعد كل تغيير باستخدام `docker stats`

**معايير القبول:**
- التطبيق يعمل بـ 512MB RAM كحد أقصى في وضع production
- لا توجد crashes بعد 24 ساعة من التشغيل المتواصل
- زمن الاستجابة < 2 ثانية للصفحات الأساسية

### 1.2 إصلاح تضارب الـ Tools Registry

**المشكلة:** يوجد 3 طبقات للـ tools (tools-registry، callable-tools.ts، ALL_AGENT_TOOLS) مما يسبب تضارب.

**خطة التنفيذ:**
- [ ] توحيد الـ tools layer في `src/lib/tools-registry/` فقط
- [ ] ترحيل الـ 31 tool من `callable-tools.ts` إلى `tools-registry/`
- [ ] ترحيل الـ 67 tool من `ALL_AGENT_TOOLS` إلى `tools-registry/`
- [ ] تحديث `src/app/api/massive-tools/exec/route.ts` لاستخدام طبقة واحدة
- [ ] إزالة الكود المكرر من `src/lib/agent/custom-tools.ts`

**معايير القبول:**
- طبقة tools واحدة فقط في `src/lib/tools-registry/`
- API endpoint `/api/massive-tools/exec` يستدعي الـ registry مباشرة
- لا توجد أدوات مكررة عبر الملفات

### 1.3 تأمين قاعدة البيانات

**المشكلة:** SQLite مع `--accept-data-loss` في كل restart يسبب فقدان البيانات.

**خطة التنفيذ:**
- [ ] إزالة `--accept-data-loss` من `Dockerfile` و `docker-entrypoint.sh`
- [ ] استخدام `prisma migrate deploy` بدلاً من `prisma db push`
- [ ] إضافة Persistent Volume للـ DB في `docker-compose.yml`
- [ ] إنشاء backup script يومي للـ DB
- [ ] اختبار استعادة الـ DB من backup

**معايير القبول:**
- البيانات لا تُفقد بعد restart
- الـ migrations تعمل بشكل صحيح
- يوجد backup يومي تلقائي

### 1.4 إصلاح Hermes Integration

**المشكلة:** Hermes يعمل كـ child process في كل طلب = بطيء جداً (30-90 ثانية).

**خطة التنفيذ:**
- [ ] تحويل Hermes إلى WebSocket-based service (mini-service مستقل)
- [ ] إنشاء `mini-services/hermes-service/` يعمل كـ daemon
- [ ] تحديث `/api/hermes/chat` لاستخدام WebSocket بدلاً من spawn
- [ ] إضافة connection pooling للـ Hermes process
- [ ] اختبار زمن الاستجابة بعد التحسين

**معايير القبول:**
- زمن استجابة Hermes < 5 ثوانٍ
- Hermes process يعمل بشكل مستمر (مش spawn per request)
- WebSocket connection مستقر

---

## 🏗️ المرحلة 2: البنية التحتية (P1 — High Priority)

> **الهدف:** بناء infrastructure قابلة للتوسع والمراقبة  
> **المدة المقدرة:** 5-7 أيام  
> **الجهد:** ~60 ساعة

### 2.1 إعداد CI/CD Pipeline

**خطة التنفيذ:**
- [ ] إنشاء `.github/workflows/ci.yml`:
  - lint check على كل PR
  - TypeScript type check
  - build test
  - security audit (`npm audit`)
- [ ] إنشاء `.github/workflows/deploy.yml`:
  - auto-deploy على push to `main`
  - build Docker image
  - push to container registry
  - deploy to VPS
- [ ] إضافة pre-commit hooks (husky):
  - eslint
  - prettier
  - type check

**معايير القبول:**
- كل PR يتم فحصه تلقائياً
- الـ deploy يتم تلقائياً على merge to main
- لا يتم deploy كود فيه errors

### 2.2 إضافة Monitoring و Logging

**خطة التنفيذ:**
- [ ] تثبيت Sentry للـ error tracking:
  - `@sentry/nextjs`
  - إعداد DSN في `.env`
  - إعداد release tracking
- [ ] إضافة structured logging:
  - استخدام `pino` بدلاً من `console.log`
  - log rotation في Docker
  - centralized log collection
- [ ] إضافة health checks حقيقية:
  - `/api/health` endpoint
  - فحص DB connection
  - فحص Hermes availability
  - فحص disk space
- [ ] إضافة Prometheus metrics:
  - request count
  - response times
  - error rates
  - active connections

**معايير الققوبول:**
- Sentry يلتقط كل الأخطاء تلقائياً
- Logs منظمة وقابلة للبحث
- Health check endpoint يعمل
- Metrics متاحة على `/metrics`

### 2.3 تحسين الـ Docker Setup

**خطة التنفيذ:**
- [ ] تحسين `Dockerfile.prod` (multi-stage build):
  - Stage 1: build dependencies
  - Stage 2: production image (أصغر)
  - استخدام `.dockerignore` محسّن
- [ ] إضافة Docker layer caching:
  - cache `package.json` و `requirements.txt` بشكل منفصل
  - استخدام BuildKit
- [ ] تحديث `docker-compose.yml`:
  - إضافة nginx reverse proxy
  - إضافة redis للـ caching
  - إضافة backup service
  - network isolation

**معايير القبول:**
- حجم الـ Docker image < 1GB
- زمن الـ build < 10 دقائق
- الـ compose file يشمل كل الخدمات اللازمة

### 2.4 إعداد SSL و Domain

**خطة التنفيذ:**
- [ ] إعداد Nginx reverse proxy:
  - SSL termination
  - gzip compression
  - static file serving
  - rate limiting
- [ ] إضافة Certbot لـ Let's Encrypt:
  - auto-renewal
  - wildcard certificates
- [ ] إعداد domain DNS:
  - A record للـ server
  - CNAME للـ www
  - MX records للـ email

**معايير القبول:**
- الموقع يعمل على HTTPS
- SSL certificate صالح ومجدد تلقائياً
- Nginx يقدم static files بسرعة

---

## 🧪 المرحلة 3: Testing و Quality Assurance (P1)

> **الهدف:** ضمان جودة الكود ومنع الـ regressions  
> **المدة المقدرة:** 4-6 أيام  
> **الجهد:** ~50 ساعة

### 3.1 إعداد Testing Infrastructure

**خطة التنفيذ:**
- [ ] تثبيت testing frameworks:
  - `vitest` للـ unit tests
  - `@testing-library/react` للـ component tests
  - `playwright` للـ e2e tests
- [ ] إعداد `vitest.config.ts`
- [ ] إعداد `playwright.config.ts`
- [ ] إضافة test scripts في `package.json`:
  - `test:unit`
  - `test:integration`
  - `test:e2e`
  - `test:coverage`

### 3.2 كتابة Unit Tests للـ Tools Registry

**خطة التنفيذ:**
- [ ] اختبار كل tool في `src/lib/tools-registry/nodejs/`:
  - `date_utilities.test.ts`
  - `text_utilities.test.ts`
  - `json_utilities.test.ts`
  - ... (10 أدوات)
- [ ] اختبار الـ Python tools عبر subprocess:
  - `sentiment_analysis.test.ts`
  - `math_solver.test.ts`
  - ... (23 أداة)
- [ ] اختبار الـ GitHub tools (40 أداة)
- [ ] الهدف: 80% coverage للـ tools-registry

### 3.3 كتابة Integration Tests للـ API

**خطة التنفيذ:**
- [ ] اختبار الـ API routes الأساسية:
  - `/api/agents-list`
  - `/api/massive-tools/exec`
  - `/api/massive-tools/stats`
  - `/api/hermes/status`
  - `/api/auth/*`
- [ ] اختبار الـ agent engine:
  - `runAgent()` function
  - tool execution flow
  - error handling
- [ ] اختبار الـ DB operations:
  - CRUD لكل model
  - migrations
  - backup/restore

### 3.4 كتابة E2E Tests

**خطة التنفيذ:**
- [ ] اختبار user flows أساسية:
  - Login (guest + admin)
  - Chat مع Anzaro AI
  - استخدام tool من الـ tools-registry
  - تصفح الـ agents hub
  - تصفح الـ models
- [ ] اختبار الـ deployment:
  - Docker build
  - Container startup
  - Health check

**معايير القبول:**
- 80% code coverage للـ tools-registry
- 60% code coverage للـ API routes
- E2E tests تعمل على CI
- لا توجد regressions بعد refactoring

---

## 🔄 المرحلة 4: Refactoring (P2)

> **الهدف:** تحسين جودة الكود وقابليته للصيانة  
> **المدة المقدرة:** 5-7 أيام  
> **الجهد:** ~60 ساعة

### 4.1 فصل الـ Mini-Services

**المشكلة:** المشروع monolithic، كل الـ logic في `src/lib/`.

**خطة التنفيذ:**
- [ ] إنشاء `mini-services/` حقيقية:
  - `mini-services/hermes-service/` — Hermes daemon
  - `mini-services/tools-service/` — Python tools execution
  - `mini-services/chat-service/` — Chat orchestration
- [ ] تعريف communication protocol:
  - HTTP REST للـ synchronous calls
  - WebSocket للـ streaming
  - Redis pub/sub للـ async events
- [ ] تحديث `docker-compose.yml` لإضافة الخدمات الجديدة
- [ ] migration تدريجي للـ services الجديدة

### 4.2 تنظيم الـ API Routes

**المشكلة:** 293 API route بدون تنظيم واضح.

**خطة التنفيذ:**
- [ ] تجميع الـ routes حسب الـ domain:
  - `/api/v2/agents/*`
  - `/api/v2/tools/*`
  - `/api/v2/chat/*`
  - `/api/v2/admin/*`
- [ ] إضافة API versioning
- [ ] إنشاء OpenAPI/Swagger documentation
- [ ] إضافة rate limiting لكل endpoint
- [ ] إضافة request validation (zod schemas)

### 4.3 تحسين الـ Skills System

**المشكلة:** 70 skill بدون آلية موحدة للـ execution.

**خطة التنفيذ:**
- [ ] توحيد الـ skill format:
  - كل skill يكون له `index.ts` أو `index.py`
  - metadata في `skill.yaml`
  - tests في `__tests__/`
- [ ] إنشاء skill loader موحد:
  - `src/lib/skills/loader.ts` (موجود، يحتاج تحسين)
  - auto-discovery للـ skills الجديدة
  - hot-reload في dev mode
- [ ] ربط الـ skills بالـ agents بشكل أوضح:
  - كل agent يحدد الـ skills التي يستخدمها
  - الـ skill context injection تلقائي

### 4.4 إزالة الـ Tech Debt

**خطة التنفيذ:**
- [ ] إزالة `ignoreBuildErrors: true` من `next.config.ts`
- [ ] إصلاح كل TypeScript errors
- [ ] إزالة الكود الميت (dead code)
- [ ] تحسين الـ naming conventions
- [ ] إضافة JSDoc للـ functions المهمة

**معايير القبول:**
- لا توجد TypeScript errors
- 293 API route منظمة في groups
- الـ skills system موحد
- الكود نظيف وقابل للصيانة

---

## 📚 المرحلة 5: Documentation (P2)

> **الهدف:** توثيق شامل للمشروع  
> **المدة المقدرة:** 3-4 أيام  
> **الجهد:** ~30 ساعة

### 5.1 إنشاء Architecture Documentation

**خطة التنفيذ:**
- [ ] إنشاء `docs/ARCHITECTURE.md`:
  - System overview
  - Component diagram
  - Data flow diagram
  - Deployment diagram
- [ ] إنشاء `docs/API.md`:
  - كل endpoint مع مثال
  - request/response schemas
  - authentication flow
- [ ] إنشاء `docs/DEPLOYMENT.md`:
  - prerequisites
  - step-by-step deployment
  - troubleshooting
- [ ] تحديث `README.md` الرئيسي

### 5.2 إنشاء Developer Guide

**خطة التنفيذ:**
- [ ] إنشاء `docs/DEVELOPMENT.md`:
  - local setup
  - coding standards
  - git workflow
  - testing guide
- [ ] إنشاء `docs/CONTRIBUTING.md`:
  - how to add a new tool
  - how to add a new skill
  - how to add a new agent
- [ ] إنشاء `docs/SECURITY.md`:
  - security best practices
  - API key management
  - user data protection

### 5.3 إنشاء SDK

**خطة التنفيذ:**
- [ ] إنشاء `packages/sdk/`:
  - TypeScript SDK للـ API
  - Python SDK للـ API
- [ ] نشر الـ SDK على npm و PyPI
- [ ] توثيق الـ SDK usage

---

## 🎯 المرحلة 6: الميزات الجديدة (P3)

> **الهدف:** إضافة ميزات تزيد من قيمة المنصة  
> **المدة المقدرة:** حسب الطلب  
> **الجهد:** حسب الميزة

### 6.1 ميزات مقترحة (مرتبة بالأولوية)

#### 6.1.1 WebSocket Streaming للـ Chat
- استبدال SSE بـ WebSocket للـ real-time chat
- تحسين تجربة المستخدم في الـ streaming responses

#### 6.1.2 User Dashboard محسّن
- إحصائيات استخدام شخصية
- تاريخ المحادثات مع search
- إدارة الـ API keys

#### 6.1.3 Plugin System
- السماح للمطورين بإضافة plugins
- plugin marketplace
- plugin sandboxing

#### 6.1.4 Multi-language Support
- دعم لغات إضافية (English, French, Spanish)
- RTL/LTR switching
- localized UI

#### 6.1.5 Mobile App Refresh
- تحديث الـ React Native app
- إضافة features جديدة
- تحسين الـ UX

#### 6.1.6 Vector Search للـ Tools
- إضافة embeddings للـ tools
- semantic search بدلاً من keyword search
- تحسين دقة اكتشاف الـ tools

---

## 📊 الجدول الزمني الإجمالي

| المرحلة | المدة | الجهد | الأولوية |
|---------|------|------|---------|
| **المرحلة 0:** Pre-Flight | 1 يوم | 8 ساعات | - |
| **المرحلة 1:** Critical Fixes | 3-5 أيام | 40 ساعة | P0 |
| **المرحلة 2:** Infrastructure | 5-7 أيام | 60 ساعة | P1 |
| **المرحلة 3:** Testing & QA | 4-6 أيام | 50 ساعة | P1 |
| **المرحلة 4:** Refactoring | 5-7 أيام | 60 ساعة | P2 |
| **المرحلة 5:** Documentation | 3-4 أيام | 30 ساعة | P2 |
| **المرحلة 6:** New Features | حسب الطلب | - | P3 |
| **الإجمالي** | **21-30 يوم** | **248 ساعة** | - |

---

## ✅ معايير القبول النهائية (Definition of Done)

المنصة تعتبر "production-ready" عند تحقيق الآتي:

### الاستقرار
- [ ] التطبيق يعمل 24/7 بدون crashes
- [ ] زمن الاستجابة < 2 ثانية للـ 95% من الطلبات
- [ ] الذاكرة المستهلكة < 1GB في وضع production
- [ ] لا توجد memory leaks

### الأمان
- [ ] جميع الـ API endpoints محمية بـ authentication
- [ ] الـ secrets محفوظة في environment variables
- [ ] الـ DB محمية بكلمة مرور قوية
- [ ] HTTPS مفعّل مع SSL certificate صالح

### الجودة
- [ ] 80% code coverage للـ tools-registry
- [ ] 60% code coverage للـ API routes
- [ ] لا توجد TypeScript errors
- [ ] لا توجد ESLint errors
- [ ] CI/CD pipeline يعمل

### المراقبة
- [ ] Sentry يلتقط كل الأخطاء
- [ ] Logs منظمة وقابلة للبحث
- [ ] Health check endpoint يعمل
- [ ] Metrics متاحة على `/metrics`

### التوثيق
- [ ] `docs/ARCHITECTURE.md` موجود ومحدّث
- [ ] `docs/API.md` موجود ومحدّث
- [ ] `docs/DEPLOYMENT.md` موجود ومحدّث
- [ ] `README.md` محدّث

---

## ⚠️ المخاطر والافتراضات

### المخاطر
1. **الوقت:** الجدول الزمني قد يمتد بسبب مشاكل غير متوقعة
2. **ال resources:** قد نحتاج لـ VPS أقوى لـ testing
3. **الـ migrations:** نقل الـ DB من SQLite لـ PostgreSQL قد يكون معقداً

```

---

