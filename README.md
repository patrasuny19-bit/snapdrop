# SnapDrop - Social Media Video Downloader

A complete, production-ready video downloader website that supports 20+ platforms.

## 🚀 Quick Setup (3 Steps)

### Step 1 — Get your RapidAPI Key (FREE)
1. Go to **https://rapidapi.com** and create a free account
2. Search for **"Social Media Video Downloader"** API
3. Click **"Subscribe"** on the FREE plan (500 requests/month)
4. Copy your **API Key** from the dashboard

### Step 2 — Add your API Key
Open `js/main.js` and replace line 8:
```javascript
const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY_HERE';
// Change to:
const RAPIDAPI_KEY = 'your_actual_key_from_rapidapi_here';
```

### Step 3 — Upload to GitHub Pages
1. Create a new GitHub repository (make it **Public**)
2. Upload all these files (drag & drop in GitHub)
3. Go to **Settings → Pages → Source → main branch**
4. Your site is live at: `https://yourusername.github.io/repo-name`

---

## 💰 Enable Google AdSense (Earn Money)

### Step 1 — Apply for AdSense
1. Go to **https://adsense.google.com**
2. Sign in with Google account
3. Add your website URL
4. **Wait 1-2 weeks** for approval (site needs real content + traffic)

### Step 2 — Add Ad Code
Once approved, uncomment and fill in the AdSense scripts in these files:
- `index.html` (line 28-30) — replace `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID
- All files in `pages/` folder — same replacement

### Step 3 — Add Ad Units
Replace `<div class="ad-placeholder">Advertisement</div>` with:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-YOUR_ID"
     data-ad-slot="YOUR_SLOT_ID"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

---

## 📁 File Structure
```
snapdrop/
├── index.html          ← Main homepage
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← All JavaScript + API logic
├── pages/
│   ├── youtube.html    ← YouTube downloader page
│   ├── tiktok.html     ← TikTok downloader page
│   ├── instagram.html  ← Instagram downloader page
│   ├── facebook.html   ← Facebook downloader page
│   ├── twitter.html    ← Twitter/X downloader page
│   ├── blog.html       ← Blog (SEO traffic)
│   ├── about.html      ← About page
│   ├── privacy.html    ← Privacy Policy (required for AdSense)
│   ├── terms.html      ← Terms of Service
│   └── dmca.html       ← DMCA Policy
├── robots.txt          ← For search engines
├── sitemap.xml         ← For Google indexing
└── README.md           ← This file
```

---

## 🔍 SEO Tips (Get More Traffic)

1. **Submit sitemap** to Google Search Console:
   - Go to search.google.com/search-console
   - Add your site → Submit sitemap URL

2. **Update `yourdomain.com`** in all HTML files with your actual domain

3. **Add Google Analytics**:
   - Create account at analytics.google.com
   - Uncomment and fill in Analytics code in `index.html`

4. **Write blog posts** in `pages/blog.html` — target keywords like:
   - "how to download youtube videos"
   - "tiktok video downloader without watermark"
   - "instagram reel downloader"

5. **Share on social media** — Reddit, Quora, Twitter

---

## 🔑 Alternative Free APIs

If RapidAPI limits are exceeded, alternatives:
- **yt-dlp** — run your own backend (needs a server)
- **Cobalt.tools API** — free, open source
- **SaveFrom API** — another option on RapidAPI

---

## ⚠️ Important Notes

- This tool is for **personal use only**
- Respect copyright laws and platform terms
- Do not redistribute downloaded content commercially
- The RapidAPI free tier allows **500 downloads/month**
- For more traffic, upgrade to a paid API plan (~$10/month)

---

## 📞 Support
For help: Create a GitHub issue or contact hello@snapdrop.com
