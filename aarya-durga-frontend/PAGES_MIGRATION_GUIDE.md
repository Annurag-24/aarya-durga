# Pages Migration Guide - Using API Helpers

This guide shows how to refactor the remaining pages to use centralized API helpers from `src/api/helpers.ts`.

## Pages to Migrate

1. **About.tsx** - Multiple sections with hero, about, mission, values, etc.
2. **EventsGallery.tsx** - Events and gallery display page
3. **History.tsx** - History timeline display
4. **PoojaDonation.tsx** - Pooja services and donation categories
5. **Contact.tsx** - Contact form with contact subjects

---

## Migration Pattern

### Before (Old Pattern)
```typescript
const response = await client.get(`/public/page-content/about`);
const aboutData = response.data;
const titleData = aboutData.find((item: any) => item.section_key === 'about_title');
const titleText = titleData?.[contentKey] as string || '';
const imageUrl = titleData?.image?.file_url
  ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${titleData.image.file_url}`
  : '';
setAboutTitle(titleText);
setAboutImage(imageUrl);
```

### After (New Pattern with Helpers)
```typescript
import { fetchPageContent, findContentItem, getContentByLanguage, getImageUrl } from '@/api/helpers';

const pageData = await fetchPageContent('about');
const lang = language as 'en' | 'hi' | 'mr';

// Simple getter functions
const getContent = (key: string) => getContentByLanguage(findContentItem(pageData, key), lang);
const getImg = (key: string) => getImageUrl(findContentItem(pageData, key));

setAboutTitle(getContent('about_title'));
setAboutImage(getImg('about_image'));
```

---

## Step-by-Step Migration for Each Page

### 1. About.tsx

**What it does:** Displays about page with hero section, about info, mission, values, traditions, services, and committee info.

**Current approach:** Fetches from `/public/page-content/about` and `/public/page-content/home`

**Migration steps:**

```typescript
// ✅ Step 1: Update imports
import { fetchPageContent, findContentItem, getContentByLanguage, getImageUrl } from '@/api/helpers';

// Remove:
// import client from "@/api/client";

// ✅ Step 2: Replace the fetch in useEffect
// OLD:
const aboutResponse = await client.get(`/public/page-content/about`);
const aboutData = aboutResponse.data;
const homeResponse = await client.get(`/public/page-content/home`);
const homeData = homeResponse.data;

// NEW:
const aboutData = await fetchPageContent('about');
const homeData = await fetchPageContent('home');
const lang = language as 'en' | 'hi' | 'mr';

// ✅ Step 3: Create helper getter
const getContent = (arr: any[], key: string) => getContentByLanguage(findContentItem(arr, key), lang);
const getImg = (arr: any[], key: string) => getImageUrl(findContentItem(arr, key));

// ✅ Step 4: Replace all content assignments
// OLD:
const heroTitleData = data.find((item: any) => item.section_key === 'hero_title');
setHeroTitle(heroTitleData?.[contentKey] as string || '');

// NEW:
setHeroTitle(getContent(aboutData, 'hero_title'));
setHeroImage(getImg(aboutData, 'hero_image'));
```

---

### 2. EventsGallery.tsx

**What it does:** Displays events and gallery images with a tab switcher

**Current approach:** Fetches events_gallery content and parses dynamically

**Migration steps:**

```typescript
// ✅ Step 1: Update imports
import { fetchPageContent, getContentByLanguage, findContentItem, getImageUrl } from '@/api/helpers';

// ✅ Step 2: Replace client.get with fetchPageContent
// OLD:
const response = await client.get("/public/page-content/events_gallery");
const data = response.data;

// NEW:
const pageData = await fetchPageContent('events_gallery');
const lang = language as 'en' | 'hi' | 'mr';

// ✅ Step 3: Simplify content extraction
// OLD:
const languageKey = language as 'en' | 'hi' | 'mr';
const contentKey = `content_${languageKey === 'en' ? 'en' : ...}`;
const titleData = data.find((item: any) => item.section_key === 'events_title');
setEventsTitle(titleData?.[contentKey] as string || '');

// NEW:
setEventsTitle(getContentByLanguage(findContentItem(pageData, 'events_title'), lang));
```

---

### 3. History.tsx

**What it does:** Displays timeline and history sections

**Similar pattern:**
- Fetch with `fetchPageContent('history')`
- Use `getContent()` helper for all text
- Use `getImg()` helper for all images

---

### 4. PoojaDonation.tsx

**What it does:** Shows pooja services and donation categories

**Similar pattern:**
- Fetch with `fetchPageContent('pooja_donation')` (or separate pages if needed)
- Use helpers for all content extraction

---

### 5. Contact.tsx

**What it does:** Contact form with contact subjects

**Pattern:**
```typescript
import { fetchPageContent, getContentByLanguage, findContentItem } from '@/api/helpers';

// Fetch page content
const pageData = await fetchPageContent('contact');
const lang = language as 'en' | 'hi' | 'mr';

// Get all needed content
setPageTitle(getContentByLanguage(findContentItem(pageData, 'page_title'), lang));
```

---

## Benefits of Migration

✅ **Code Reduction** - 30-40% fewer lines per page
✅ **Consistency** - All pages use same pattern
✅ **Maintainability** - Changes to API logic affect all pages
✅ **Type Safety** - Well-typed helper functions
✅ **Error Handling** - Centralized error handling

---

## Testing After Migration

After refactoring a page:

1. **Check page loads** - Navigate to the page in browser
2. **Verify content displays** - All text/images should load
3. **Test language switching** - Change language and verify content updates
4. **Check console** - No errors in browser console
5. **Run build** - `npm run build` should succeed with no errors

---

## Common Patterns

### Getting content in multiple languages
```typescript
const content = buildMultilingualContent(findContentItem(pageData, 'key'));
// Returns: { en: '...', hi: '...', mr: '...' }
```

### Getting sorted items (events, services, etc.)
```typescript
const items = getSortedContentByPrefix(pageData, 'event_', 3); // Get max 3 events
items.forEach(item => {
  console.log(getImageUrl(item));
});
```

### Combining patterns
```typescript
const events = getSortedContentByPrefix(pageData, 'event_', 5)
  .map(item => ({
    title: getContentByLanguage(findContentItem(pageData, `event_${index}_name`), lang),
    image: getImageUrl(item),
  }));
```

---

## File Locations

- **Helpers:** `src/api/helpers.ts`
- **Complete docs:** `src/api/HELPERS_GUIDE.md`
- **Already migrated components:**
  - `src/components/temple/HeroSection.tsx`
  - `src/components/temple/AboutSection.tsx`
  - `src/components/temple/EventsSection.tsx`
  - `src/components/temple/GallerySection.tsx`
  - `src/components/temple/BlessingBanner.tsx`
  - `src/components/temple/VisitSection.tsx`
  - `src/components/temple/Navbar.tsx`
  - `src/components/global/SiteTitleFaviconManager.tsx`

---

## Quick Checklist for Each Page

- [ ] Import helpers from `@/api/helpers`
- [ ] Remove `import client from "@/api/client"`
- [ ] Replace `client.get()` with `fetchPageContent()`
- [ ] Create local `getContent()` and `getImg()` helpers
- [ ] Replace all manual content extraction
- [ ] Test page renders correctly
- [ ] Test language switching works
- [ ] Run `npm run build` to verify no errors
