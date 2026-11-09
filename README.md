# PROITBRIDGE Success Stories: how it works

The page (`index.html`) reads its stories from a **Google Sheet**.
Add a row to the sheet and the website shows it within about 5 minutes. You don't edit any code and don't need to re-upload anything.

```
Google Sheet ("Stories" + "Stats" tabs, published as CSV)
        │  read on every page visit
        ▼
index.html ──► shows the saved copy (data/snapshot.js) instantly,
               then swaps in the live sheet as soon as it loads.
               If Google can't be reached, the saved copy stays.
```

---

## One-time setup (about 20 minutes)

### 1. Create the sheet
1. Create a **new, separate** Google Sheet, e.g. "PROITBRIDGE Website Stories".
   Don't use the private placement sheet: that one has phone numbers and emails.
2. **File → Import → Upload** `sheet-template/Stories.csv` → "Replace current sheet".
   **Untick "Convert text to numbers, dates, and formulas"** so dates stay exactly `2026-09-03`. (A US-format sheet would turn 3 Sep into `9/3/2026`, which reads as 9 March.) Rename the tab to **Stories**.
3. **File → Import → Upload** `sheet-template/Stats.csv` → "Insert new sheet", same untick. Rename the tab to **Stats**.
4. **Add the dropdowns:** go to **Extensions → Apps Script**, paste all of `sheet-template/setup.gs`, Save, pick `setupSheet` and click **Run**, then allow access.
   This adds dropdowns for Publish, Type, Category, Featured, Masked, Stars, Source and Mentor, plus Where on the Stats tab. Package becomes numbers only, and Offer date gets a date picker.
   Dropdown options live in a new **Lists** tab. Add a new mentor, source or tag at the bottom of its column there.

### 2. Publish the two tabs
1. **File → Share → Publish to web**.
2. Pick the **Stories** tab and **Comma-separated values (.csv)**, then click **Publish**. Copy the link.
   Under "Published content & settings", keep **"Automatically republish when changes are made"** ticked. If it's off, sheet edits never reach the site.
3. Do the same for the **Stats** tab.
4. Paste both links into `site-config.js`:
   ```js
   STORIES_CSV: 'https://docs.google.com/spreadsheets/d/e/…/pub?gid=0&single=true&output=csv',
   STATS_CSV:   'https://docs.google.com/spreadsheets/d/e/…/pub?gid=123&single=true&output=csv',
   ```
> ⚠️ Everything in a published tab is public. Only put what you'd show on the website in this sheet.

### 3. Set the buttons
In `site-config.js`, fill in `LINKS.induction` (the ₹89 page), `LINKS.category`, and `WHATSAPP` (digits only, e.g. `919876543210`).
Leave any of them empty and that button just scrolls to the stories instead.

### 4. Put it online (free)
Upload only this `website` folder, never the raw folders or the `.xlsx`.
- **Quickest:** go to <https://app.netlify.com/drop> and drag the `website` folder onto the page. You get a live link immediately.
- **With automatic daily backups:** put the folder in a GitHub repository, then **Settings → Pages → Deploy from branch**. The included workflow (`.github/workflows/refresh-snapshot.yml`) copies the live sheet into `data/snapshot.js` every morning.

---

## Daily use: adding a story

Add a row to the **Stories** tab and set **Publish = Yes**. That's it.

| Column | What to put | Example |
|---|---|---|
| **Publish** | `Yes` shows the row on the site, `No` hides it (drafts, pending consent) | Yes |
| **Type** | `Offer` (placement), `Review` (Google review), `Video`, `Voice`, `Quote` (photo + words), `Proof` (recruiter / referral message) | Offer |
| **Category** | `College Student`, `Fresher`, `Career Gap`, `Non-IT → AI`, `IT → AI Switch`, `IT Upskill` | Career Gap |
| **Tags** | Comma-separated labels. They become filter buttons on the offers wall. | Abroad, Salary hike |
| **Featured** | `Yes` on an **Offer** puts it in the **Spotlight** section, in sheet order, up to 8. If fewer than 4 are featured, the highest packages fill the rest. On a Video, the first featured one becomes the big video at the top. Featured reviews and videos also show first in Testimonials. | Yes |
| **Name** | As the learner wants it shown | Renuka V |
| **Masked** | `Yes` hides the name, company, city, package, photo, batch and mentor on the site. **Also leave those cells empty in this sheet**, because the sheet itself is public. | Yes |
| **Photo** | Headshot: an image file in `assets/`, a Google Drive link, or any direct image link | assets/kavimalar.jpg |
| **Batch / Mentor** | Shown on the card | Batch 52 / Rakshitha V R |
| **Program / Modules** | Modules comma-separated. They feed the "skills behind these offers" chart. | Python, SQL, ML |
| **Previous role** | Shows as "Before → Now" | QA |
| **Role / Company / City** | The new job | Technical Lead / Fujitsu / Chennai |
| **Package (LPA)** | Number only | 33 |
| **Headline** | Big text when there's no package, the subtitle under a review, or the title on a video. Wrap words in `**…**` to colour them. | QA → AI |
| **Offer date** | `YYYY-MM-DD`. Offers from the last 45 days get a **New** badge. | 2026-08-24 |
| **Text** | Review / quote words. `**…**` highlights a phrase. Never start a cell with `=`, because Sheets treats it as a formula and shows #ERROR!. | …**the NLP module alone had 15 projects**… |
| **Stars** | 1–5 (reviews) | 5 |
| **Source** | Google, WhatsApp, LinkedIn, Mentors' channel… | Google |
| **Media** | **Any viewable link** (see the table below), or a file in `assets/` | https://www.instagram.com/reel/… |
| **Poster / Duration** | Video thumbnail (optional: YouTube and Drive thumbnails are automatic) and length | assets/poster.jpg / 03:38 |
| **Note** | One extra line on the card | Got Infosys before finishing the course. |

**Media links: anything viewable works.** Make sure the link is public (for Drive: Share → **Anyone with the link**).

| You paste | The website shows |
|---|---|
| Image file or direct image link (Drive, Dropbox, imgur…) | The image |
| YouTube, Vimeo, Loom, Facebook video | Plays inside the page |
| Instagram post / reel, LinkedIn post, Facebook post, PDF | Embedded in the story pop-up |
| `.mp4` / `.m4a` / `.mp3` file or link | Built-in video / audio player |
| SoundCloud | Embedded audio player |
| Anything else (X, Google Photos, OneDrive, any web page) | A "View on …" tile that opens it in a new tab |

`?check` tells you if a link can't work, such as an image used as a Video, or a YouTube link used as a Photo.
For the fastest page, compress files to `.webp` / `.mp4`, put them in `assets/` and write the path. That needs a re-upload.

**Stats tab:** `Where` = `band` (the big number boxes), `trust` (the small line under the hero buttons) or `company` (adds a name to "Our learners got offers from").
The top offer, screenshot count, review count and the company list are calculated from the Stories tab automatically.

---

## Checking for mistakes

Open the site with **`?check`** on the end, e.g. `https://your-site/?check`. A panel shows:
- where the data came from (live sheet or saved copy) and when,
- how many stories are in each category,
- every row with a problem (unknown Type or Category, missing Role, a bad date, an image that doesn't load) and its **row number**.

## Shareable links (for ads)

Each category has its own link that opens straight to it:
`#student`, `#fresher`, `#career-gap`, `#nonit-switch`, `#it-switch`, `#it-upskill`.
Links from the old page (`#it`, `#nonit`, `#gap`) still work.

## Tracking

If Google Analytics (`gtag`) or the Meta Pixel (`fbq`) is on the page, these events are sent automatically:
`category_select`, `spotlight_view`, `story_open`, `testimonial_tab`, `video_play`, `voice_play`, `review_open`, `whatsapp_click`, `cta_click`.
Add your GA/Pixel snippet inside `<head>` in `index.html`.

## Files

| File | What it is |
|---|---|
| `index.html` | The page. You shouldn't need to edit it. |
| `site-config.js` | Sheet links, button links, WhatsApp number, category roadmaps (goal, salary target, what you learn, where you land) |
| `data/snapshot.js` | Saved copy of the sheet. Refresh it with `node tools/update-snapshot.mjs`, or let the GitHub workflow do it daily. |
| `sheet-template/` | Starting CSVs for the sheet, plus the dropdown helper script |
| `assets/` | Compressed images, videos and audio |
