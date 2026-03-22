# InstaGrid Viewer — Setup Guide

Transform your Notion database into a beautiful Instagram-style feed!

---

## Step 1: Create your Notion Database

Create a new **database** in Notion with these exact properties:

| Property | Type       | Description                        |
|----------|------------|------------------------------------|
| Name     | Title      | Post title (auto-created)          |
| Image    | Files      | Upload your image or paste a URL   |
| Date     | Date       | Publication date                   |
| Caption  | Rich Text  | Your post caption/description      |
| Type     | Select     | Options: `Post`, `Reel`, `Story`   |

### Tips:
- For **Image**, you can either upload directly to Notion or paste an external URL
- **Date** is used to sort posts (newest first)
- **Type** is optional — if set to "Reel", a small icon appears on the grid

---

## Step 2: Create a Notion Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Name it (e.g., "InstaGrid Viewer")
4. Select your workspace
5. Click **Submit**
6. Copy the **Internal Integration Secret** (starts with `secret_...`)

---

## Step 3: Connect the Integration to your Database

1. Open your Notion database page
2. Click the **"..."** menu (top right)
3. Go to **"Connections"** → **"Connect to"**
4. Find and select your integration
5. Confirm

---

## Step 4: Get your Database ID

Your database URL looks like:
```
https://www.notion.so/your-workspace/DATABASE_ID?v=...
```

The **Database ID** is the 32-character string before the `?v=`.

Example: `https://notion.so/myspace/a1b2c3d4e5f6...` → the ID is `a1b2c3d4e5f6...`

---

## Step 5: Deploy to Vercel

### Option A: One-Click Deploy

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **"New Project"**
3. Import your GitHub repository
4. Add the following **Environment Variables**:

| Variable            | Value                                    |
|---------------------|------------------------------------------|
| `NOTION_TOKEN`      | Your `secret_...` token from Step 2      |
| `NOTION_DATABASE_ID`| Your database ID from Step 4             |
| `PROFILE_NAME`      | Your display name (e.g., `john_doe`)     |
| `PROFILE_IMAGE_URL` | URL to your profile picture              |
| `PROFILE_BIO`       | Your bio text                            |

5. Click **Deploy**!

### Option B: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Set environment variables with:
```bash
vercel env add NOTION_TOKEN
vercel env add NOTION_DATABASE_ID
vercel env add PROFILE_NAME
vercel env add PROFILE_IMAGE_URL
vercel env add PROFILE_BIO
```

---

## Step 6: Embed in Notion (Optional)

You can embed your InstaGrid back into Notion:

1. Copy your Vercel deployment URL
2. In Notion, type `/embed`
3. Paste the URL
4. Resize the embed block as needed

---

## Troubleshooting

### "Configuration Required" message
→ Check that `NOTION_TOKEN` and `NOTION_DATABASE_ID` are set in Vercel environment variables.

### No images showing
→ Make sure the **Image** property in Notion is of type **Files & media**, and images are uploaded or have valid URLs.

### Images disappear after ~1 hour
→ Notion-hosted file URLs expire. Use **external URLs** (e.g., Imgur, Cloudinary) for permanent images.

### "Notion API error"
→ Make sure your integration is connected to the database (Step 3).

---

## Support

If you have any issues, reach out via your Etsy order page.

Enjoy your InstaGrid! ✨
