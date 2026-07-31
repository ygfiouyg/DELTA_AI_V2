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
