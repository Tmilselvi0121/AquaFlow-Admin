# AquaFlow Daily Instagram Automation Guide

This module automatically publishes one water purifier product per day to an Instagram Professional/Business account with zero manual intervention after setup.

---

### Architecture & Data Flow

```
[Daily Scheduler (09:00 AM)]
             │
             ▼
[1. AquaFlow DB / Firestore] ──► Selects unposted product (prevents duplicates)
             │
             ▼
[2. Google Gemini / Groq AI] ──► Generates marketing caption, benefits & hashtags
             │
             ▼
[3. ImgBB / Cloudinary CDN]  ──► Ensures public image URL for Meta Graph API
             │
             ▼
[4. Meta Graph API]          ──► Creates Media Container -> Publishes to Instagram
             │
             ▼
[5. Local & Firestore Logs]  ──► Records post ID, timestamp, and diagnostic status
```

---

### Prerequisites & Credentials

1. **Meta for Developers Account:**
   - Create an app at [developers.facebook.com](https://developers.facebook.com).
   - Add product **Instagram Graph API**.
   - Connect your Instagram Professional/Business Account to a Facebook Page.
   - Permissions required: `instagram_basic`, `instagram_content_publish`, `pages_read_engagement`.
   - Copy your **User Access Token** and **Instagram Business Account ID**.

2. **Free Gemini AI or Groq API Key:**
   - **Google Gemini API (Free Spark tier):** Generate a free key from [Google AI Studio](https://aistudio.google.com).
   - **Or Groq API (Free tier):** Generate a free key from [console.groq.com](https://console.groq.com).

3. **Free Public Image Hosting (ImgBB):**
   - Free API key from [api.imgbb.com](https://api.imgbb.com).

---

### Configuration

Add your keys to the project `.env` file (copied from `.env.example`):

```bash
# Meta / Instagram Graph API
META_ACCESS_TOKEN="EAA..."
INSTAGRAM_ACCOUNT_ID="17841400000000000"

# AI Caption Generation (Gemini or Groq)
GEMINI_API_KEY="AIzaSy..."
# GROQ_API_KEY="gsk_..."

# Public Image Hosting
IMGBB_API_KEY="your_imgbb_api_key"
API_BASE_URL="http://localhost:5000"
```

---

### Running the Automation

#### Option A: Self-Contained Node.js Automation (Recommended)

1. **Run a single test post immediately:**
   ```bash
   node automation/instagram_automation.js
   ```

2. **Run in 24-hour recurring background schedule:**
   ```bash
   node automation/instagram_automation.js --schedule
   ```

3. **Check execution logs & diagnostics:**
   Open `automation/execution_logs.json` to review post timestamps, Meta post IDs, and any diagnostic errors.

#### Option B: Zero-Cost n8n Workflow

1. Start your local n8n instance:
   ```bash
   npx n8n
   ```
2. Open `http://localhost:5678` in your browser.
3. Click **Workflows** → **Import from File**.
4. Select `automation/aquaflow_instagram_n8n_workflow.json`.
5. Enter your Meta and Gemini credentials in the node parameters.
6. Toggle the workflow to **Active**. It will automatically trigger every day at 09:00 AM.
