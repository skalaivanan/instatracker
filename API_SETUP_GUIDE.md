# API Setup Guide — InstaTrack

## 1. Supabase Setup

### Step 1 — Create a Supabase project
1. Go to https://supabase.com and sign in
2. Click **New project**
3. Choose an org, give your project a name, set a strong DB password
4. Wait ~2 minutes for provisioning

### Step 2 — Get your API keys
1. In your project dashboard go to **Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 3 — Run the schema
1. In Supabase go to **SQL Editor → New query**
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run**

### Step 4 — Enable Google OAuth in Supabase
1. Go to **Authentication → Providers → Google**
2. Toggle **Enable**
3. You need a Google OAuth Client ID and Secret (see section 2 below)
4. Set **Redirect URL** to: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

---

## 2. Google OAuth Setup (for Sign in with Google)

1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Go to **APIs & Services → OAuth consent screen**
   - Choose **External**, fill in app name and email
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Authorized redirect URIs:
     - `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local dev)
5. Copy **Client ID** and **Client Secret**
6. Paste them into Supabase → Authentication → Providers → Google

---

## 3. Instagram Graph API Setup

> Required to fetch real Instagram profile and post data.

### Step 1 — Create a Meta Developer App
1. Go to https://developers.facebook.com
2. Click **My Apps → Create App**
3. Choose **Consumer** or **Business** type
4. Give it a name

### Step 2 — Add Instagram Basic Display
1. In your app dashboard, click **Add Product**
2. Find **Instagram Basic Display** → click **Set Up**
3. Under **Instagram Basic Display**:
   - Valid OAuth Redirect URIs: `http://localhost:3000/auth/instagram/callback`
   - Deauthorize Callback URL: `http://localhost:3000/api/instagram/deauth`
   - Data Deletion Request URL: `http://localhost:3000/api/instagram/delete`
4. Save changes

### Step 3 — Get your credentials
1. Go to **App Settings → Basic**
2. Copy:
   - **App ID** → `INSTAGRAM_CLIENT_ID`
   - **App Secret** → `INSTAGRAM_CLIENT_SECRET`

### Step 4 — Add test users
While the app is in Development mode, you need to add test Instagram users:
1. Go to **Instagram Basic Display → User Token Generator**
2. Click **Add or Remove Instagram Testers**
3. Add your Instagram account username
4. Accept the tester invitation on Instagram: **Settings → Apps and Websites → Tester Invites**

### Step 5 — For production
Submit your app for App Review at https://developers.facebook.com/docs/app-review

---

## 4. RapidAPI (Optional Fallback for Competitor Data)

Since the Instagram Basic Display API only lets users fetch their **own** data, you need a third-party service to fetch competitor public profile data.

### Option A — RapidAPI Instagram Scraper
1. Go to https://rapidapi.com
2. Search for **"Instagram Scraper"** or **"Instagram Data"**
3. Recommended APIs:
   - `instagram-bulk-profile-scrapper`
   - `instagram-data-api`
4. Subscribe to a plan (free tiers available)
5. Copy your RapidAPI key → `RAPIDAPI_KEY`

### Competitor data fetch example
```typescript
// In your competitor add API route
const res = await fetch(
  `https://instagram-bulk-profile-scrapper.p.rapidapi.com/clientprofile/v1/scrapper?username=${username}`,
  {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': 'instagram-bulk-profile-scrapper.p.rapidapi.com',
    },
  }
)
const data = await res.json()
```

---

## 5. Final .env.local

Create a `.env.local` file in the project root with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...

# Instagram Graph API
INSTAGRAM_CLIENT_ID=123456789012345
INSTAGRAM_CLIENT_SECRET=abc123def456ghi789
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: RapidAPI for competitor profile data
RAPIDAPI_KEY=your_rapidapi_key_here
```

---

## 6. Run the app

```bash
npm install
npm run dev
```

Open http://localhost:3000
