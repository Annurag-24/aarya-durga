# Daily Image Section — Design Spec

**Date:** 2026-05-12

---

## Overview

A new "Daily Image" feature that lets the admin set one image (with an optional trilingual caption) to display on the home page. The section is completely hidden when no image is set.

---

## Public Home Page

### Placement
Between `HeroSection` and `AboutSection` on the home page (`/`).

### Layout
- Centered card, max-width ~520px, horizontally centered within the section
- Rounded corners, soft shadow
- Image fills the top of the card (landscape or portrait, `object-cover`)
- Below the image: a thin gold line divider, then the caption text in italic
- Caption is optional — if empty, the text area is not rendered
- If no image is set by the admin, the entire section (`<section>`) is not rendered at all

### New component
`src/components/temple/DailyImageSection.tsx`
- Fetches `/api/public/daily-image` on mount
- If response has no image, returns `null`
- Reads caption in the active language (en/hi/mr) via `useLanguage()`

---

## Backend

### Database
New `daily_image` table (single-row, always ID = 1):
```
id                bigint PK
image_id          bigint FK → media.id (nullable, onDelete set null)
caption_en        text nullable
caption_hi        text nullable
caption_mr        text nullable
created_at        timestamp
updated_at        timestamp
```

### Migration
`create_daily_image_table.php`

### Model
`App\Models\DailyImage` — with `image()` belongsTo Media relationship.

### Controller
`App\Http\Controllers\DailyImageController`

**Public endpoint:**
- `GET /api/public/daily-image` — returns `{ image: { file_url }, caption_en, caption_hi, caption_mr }` or `{ image: null }` if unset

**Admin endpoints (JWT protected):**
- `GET /api/admin/daily-image` — returns current record
- `PUT /api/admin/daily-image` — upserts the single row; accepts `{ image_id, caption_en, caption_hi, caption_mr }`

### Seeder
`DailyImageSeeder` — inserts an empty row (no image, no captions) so the record always exists.

---

## Admin Panel

### Route
`/admin/daily-image` → new page `src/pages/admin/daily-image/DailyImageEditor.tsx`

### Sidebar
New menu item "Daily Image" in `AdminSidebar.tsx`.

### Editor UI
- **Image upload** — uses existing `ImageUpload` component; shows current image preview if set; "Remove Image" button clears it
- **Caption** — `Tabs` with EN / हि / मर tabs, one textarea per language (optional)
- **Save button** — calls `PUT /api/admin/daily-image`
- Save and remove actions use the existing `client` API helper

---

## Data Flow

```
Admin sets image → PUT /api/admin/daily-image → daily_image row updated
Home page loads  → GET /api/public/daily-image → DailyImageSection renders or returns null
```

---

## What's Not In Scope
- No scheduling / expiry date (can be added later)
- No multiple daily images or rotation
- No animation beyond what Framer Motion provides by default
