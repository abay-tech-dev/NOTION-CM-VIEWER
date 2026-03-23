# InstaGrid — Instagram Viewer powered by Notion

Turn your Notion database into a beautiful Instagram-style profile page.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abay-tech-dev/NOTION-CM-VIEWER&env=NOTION_TOKEN,NOTION_DATABASE_ID,PROFILE_NAME,PROFILE_IMAGE_URL,PROFILE_BIO,PROFILE_FOLLOWERS,PROFILE_FOLLOWING&envDescription=Configure%20your%20Notion%20integration%20and%20profile&project-name=instagrid&repository-name=instagrid)

---

## Setup in 3 steps

### Step 1 — Create a Notion Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Name it (e.g. `instagrid`), select your workspace, click **Save**
4. Copy the **Internal Integration Token** → this is your `NOTION_TOKEN`

### Step 2 — Create your Notion Database

Create a database with these columns:

| Column | Type | Description |
|--------|------|-------------|
| Name | Title | Post title |
| Caption | Text | Post caption/description |
| Date | Date | Post date |
| Image | Files & media | Post image |
| Type | Select | `post`, `reel`, or `carousel` |

Then:
1. Open the database → click **`...`** → **Connections** → add your integration
2. Copy the database ID from the URL: `notion.so/`**`THIS-IS-THE-ID`**`?v=...`

### Step 3 — Deploy to Vercel

Click the **Deploy** button above and fill in:

| Variable | Description |
|----------|-------------|
| `NOTION_TOKEN` | Your integration token (starts with `secret_` or `ntn_`) |
| `NOTION_DATABASE_ID` | Your database ID (32 characters, no dashes) |
| `PROFILE_NAME` | Your Instagram username |
| `PROFILE_IMAGE_URL` | URL to your profile picture |
| `PROFILE_BIO` | Your bio text |
| `PROFILE_FOLLOWERS` | Followers count (e.g. `1.2k`) |
| `PROFILE_FOLLOWING` | Following count (e.g. `420`) |

---

## Local development

```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
