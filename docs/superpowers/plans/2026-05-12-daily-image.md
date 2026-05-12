# Daily Image Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin-controlled daily image section (with optional trilingual caption) that appears between HeroSection and AboutSection on the home page, hidden entirely when no image is set.

**Architecture:** A new `daily_image` table (single row, always ID=1) stores an optional `image_id` FK and three caption fields. A Laravel controller exposes one public GET and two admin endpoints. The frontend adds a `DailyImageSection` component (auto-hides when empty) and a `/admin/daily-image` editor page.

**Tech Stack:** Laravel 12, Eloquent, MySQL, React + Vite, TypeScript, Tailwind CSS, Framer Motion, shadcn/ui, Sonner toasts

---

## File Map

**Backend — create:**
- `database/migrations/2026_05_12_000000_create_daily_image_table.php`
- `app/Models/DailyImage.php`
- `app/Http/Controllers/Admin/DailyImageController.php`

**Backend — modify:**
- `routes/api.php` — add public + admin routes

**Frontend — create:**
- `src/components/temple/DailyImageSection.tsx`
- `src/pages/admin/daily-image/DailyImageEditor.tsx`

**Frontend — modify:**
- `src/pages/Index.tsx` — insert `<DailyImageSection />` between Hero and About
- `src/components/admin/AdminSidebar.tsx` — add "Daily Image" menu item
- `src/App.tsx` — add `/admin/daily-image` route

---

## Task 1: Backend — Migration & Model

**Files:**
- Create: `aarya-durga-backend/database/migrations/2026_05_12_000000_create_daily_image_table.php`
- Create: `aarya-durga-backend/app/Models/DailyImage.php`

- [ ] **Step 1: Create migration**

```php
// aarya-durga-backend/database/migrations/2026_05_12_000000_create_daily_image_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_image', function (Blueprint $table) {
            $table->id();
            $table->foreignId('image_id')->nullable()->constrained('media')->nullOnDelete();
            $table->text('caption_en')->nullable();
            $table->text('caption_hi')->nullable();
            $table->text('caption_mr')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_image');
    }
};
```

- [ ] **Step 2: Run migration**

```bash
cd aarya-durga-backend && php artisan migrate
```

Expected output: `Migrating: 2026_05_12_000000_create_daily_image_table` … `Migrated`

- [ ] **Step 3: Create model**

```php
// aarya-durga-backend/app/Models/DailyImage.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyImage extends Model
{
    protected $table = 'daily_image';

    protected $fillable = [
        'image_id',
        'caption_en',
        'caption_hi',
        'caption_mr',
    ];

    public function image(): BelongsTo
    {
        return $this->belongsTo(Media::class, 'image_id');
    }
}
```

- [ ] **Step 4: Seed the single row**

```bash
cd aarya-durga-backend && php artisan tinker --execute="App\Models\DailyImage::firstOrCreate(['id' => 1], ['image_id' => null]);"
```

Expected: no error, row with id=1 inserted.

- [ ] **Step 5: Commit**

```bash
cd aarya-durga-backend
git add database/migrations/2026_05_12_000000_create_daily_image_table.php app/Models/DailyImage.php
git commit -m "feat: add daily_image table, migration, and model"
```

---

## Task 2: Backend — Controller & Routes

**Files:**
- Create: `aarya-durga-backend/app/Http/Controllers/Admin/DailyImageController.php`
- Modify: `aarya-durga-backend/routes/api.php`

- [ ] **Step 1: Create controller**

```php
// aarya-durga-backend/app/Http/Controllers/Admin/DailyImageController.php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DailyImage;
use Illuminate\Http\Request;

class DailyImageController extends Controller
{
    public function show()
    {
        return response()->json(DailyImage::with('image')->firstOrCreate(['id' => 1]));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'image_id'   => 'nullable|exists:media,id',
            'caption_en' => 'nullable|string|max:500',
            'caption_hi' => 'nullable|string|max:500',
            'caption_mr' => 'nullable|string|max:500',
        ]);

        $record = DailyImage::firstOrCreate(['id' => 1]);
        $record->update($validated);

        return response()->json($record->load('image'));
    }

    public function publicShow()
    {
        $record = DailyImage::with('image')->firstOrCreate(['id' => 1]);

        if (!$record->image) {
            return response()->json(['image' => null]);
        }

        return response()->json([
            'image'      => $record->image,
            'caption_en' => $record->caption_en,
            'caption_hi' => $record->caption_hi,
            'caption_mr' => $record->caption_mr,
        ]);
    }
}
```

- [ ] **Step 2: Register routes**

In `aarya-durga-backend/routes/api.php`, inside the `Route::middleware('admin.auth')->prefix('admin')` group (after the facilities routes), add:

```php
    // Daily Image
    Route::get('/daily-image', [\App\Http\Controllers\Admin\DailyImageController::class, 'show']);
    Route::put('/daily-image', [\App\Http\Controllers\Admin\DailyImageController::class, 'update']);
```

In the `Route::prefix('public')` group (after facilities public routes), add:

```php
    Route::get('/daily-image', [\App\Http\Controllers\Admin\DailyImageController::class, 'publicShow']);
```

- [ ] **Step 3: Test endpoints**

```bash
# Public (no auth needed)
curl http://localhost:8000/api/public/daily-image
# Expected: {"image":null}

# Admin show (get a token first via POST /api/admin/auth/login)
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/admin/daily-image
# Expected: {"id":1,"image_id":null,"caption_en":null,...}
```

- [ ] **Step 4: Commit**

```bash
cd aarya-durga-backend
git add app/Http/Controllers/Admin/DailyImageController.php routes/api.php
git commit -m "feat: add DailyImageController with admin and public endpoints"
```

---

## Task 3: Frontend — DailyImageSection Component

**Files:**
- Create: `Aarya-Durga-Frontend/src/components/temple/DailyImageSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// Aarya-Durga-Frontend/src/components/temple/DailyImageSection.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";

interface DailyImageData {
    image: { file_url?: string } | null;
    caption_en?: string;
    caption_hi?: string;
    caption_mr?: string;
}

const DailyImageSection = () => {
    const { language } = useLanguage();
    const [data, setData] = useState<DailyImageData | null>(null);

    useEffect(() => {
        client
            .get<DailyImageData>("/public/daily-image")
            .then((res) => setData(res.data))
            .catch(() => setData(null));
    }, []);

    if (!data?.image?.file_url) return null;

    const imageUrl = constructImageUrl(data.image.file_url);
    const caption =
        language === "mr"
            ? data.caption_mr || data.caption_en
            : language === "hi"
            ? data.caption_hi || data.caption_en
            : data.caption_en;

    return (
        <section className="py-12 bg-accent">
            <div className="container mx-auto px-4 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg overflow-hidden rounded-2xl shadow-xl bg-card"
                >
                    <img
                        src={imageUrl}
                        alt="Daily blessing"
                        className="w-full h-72 object-cover"
                    />
                    {caption && (
                        <div className="px-6 py-5 text-center">
                            <div className="gold-line mx-auto mb-3" />
                            <p className="font-body text-sm italic text-muted-foreground leading-relaxed">
                                {caption}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default DailyImageSection;
```

- [ ] **Step 2: Insert into Index.tsx between Hero and About**

In `Aarya-Durga-Frontend/src/pages/Index.tsx`, add the import:

```tsx
import DailyImageSection from "@/components/temple/DailyImageSection";
```

Then in the JSX, insert `<DailyImageSection />` between `<HeroSection />` and `<AboutSection />`:

```tsx
<HeroSection />
<DailyImageSection />
<AboutSection />
```

- [ ] **Step 3: Verify home page compiles**

```bash
cd Aarya-Durga-Frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd Aarya-Durga-Frontend
git add src/components/temple/DailyImageSection.tsx src/pages/Index.tsx
git commit -m "feat: add DailyImageSection to home page (auto-hides when empty)"
```

---

## Task 4: Frontend — Admin Editor Page

**Files:**
- Create: `Aarya-Durga-Frontend/src/pages/admin/daily-image/DailyImageEditor.tsx`

- [ ] **Step 1: Create the editor page**

```tsx
// Aarya-Durga-Frontend/src/pages/admin/daily-image/DailyImageEditor.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { constructImageUrl } from "@/api/imageUrl";

interface DailyImageForm {
    image_id?: number;
    existingImageUrl?: string;
    caption_en: string;
    caption_hi: string;
    caption_mr: string;
}

const DailyImageEditor = () => {
    const [form, setForm] = useState<DailyImageForm>({
        caption_en: "",
        caption_hi: "",
        caption_mr: "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        client.get("/admin/daily-image").then((res) => {
            const d = res.data;
            setForm({
                image_id: d.image_id ?? undefined,
                existingImageUrl: d.image?.file_url
                    ? constructImageUrl(d.image.file_url)
                    : undefined,
                caption_en: d.caption_en ?? "",
                caption_hi: d.caption_hi ?? "",
                caption_mr: d.caption_mr ?? "",
            });
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await client.put("/admin/daily-image", {
                image_id: form.image_id ?? null,
                caption_en: form.caption_en || null,
                caption_hi: form.caption_hi || null,
                caption_mr: form.caption_mr || null,
            });
            toast.success("Daily image saved.");
        } catch {
            toast.error("Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Daily Image</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Set an image and optional caption to display on the home page. Remove the image to hide the section.
                </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">Image</p>
                <ImageUpload
                    currentImageUrl={form.existingImageUrl}
                    onUpload={(id, url) =>
                        setForm((f) => ({ ...f, image_id: id, existingImageUrl: url }))
                    }
                    onRemove={() =>
                        setForm((f) => ({ ...f, image_id: undefined, existingImageUrl: undefined }))
                    }
                />
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <p className="text-sm font-semibold text-foreground">
                    Caption <span className="font-normal text-muted-foreground">(optional)</span>
                </p>
                <Tabs defaultValue="en">
                    <TabsList>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="hi">हिंदी</TabsTrigger>
                        <TabsTrigger value="mr">मराठी</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                        <Textarea
                            placeholder="Enter caption in English..."
                            value={form.caption_en}
                            onChange={(e) => setForm((f) => ({ ...f, caption_en: e.target.value }))}
                            rows={3}
                        />
                    </TabsContent>
                    <TabsContent value="hi">
                        <Textarea
                            placeholder="हिंदी में कैप्शन दर्ज करें..."
                            value={form.caption_hi}
                            onChange={(e) => setForm((f) => ({ ...f, caption_hi: e.target.value }))}
                            rows={3}
                        />
                    </TabsContent>
                    <TabsContent value="mr">
                        <Textarea
                            placeholder="मराठीत मथळा प्रविष्ट करा..."
                            value={form.caption_mr}
                            onChange={(e) => setForm((f) => ({ ...f, caption_mr: e.target.value }))}
                            rows={3}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <Button variant="temple" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Daily Image"}
            </Button>
        </div>
    );
};

export default DailyImageEditor;
```

- [ ] **Step 2: Verify component compiles**

```bash
cd Aarya-Durga-Frontend && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd Aarya-Durga-Frontend
git add src/pages/admin/daily-image/DailyImageEditor.tsx
git commit -m "feat: add DailyImageEditor admin page"
```

---

## Task 5: Frontend — Wire Up Admin Route & Sidebar

**Files:**
- Modify: `Aarya-Durga-Frontend/src/App.tsx`
- Modify: `Aarya-Durga-Frontend/src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Add import and route in App.tsx**

Add import near the other admin page imports:

```tsx
import DailyImageEditor from "./pages/admin/daily-image/DailyImageEditor";
```

Add route inside the admin `<Routes>` block (e.g. after the `facilities-editor` route):

```tsx
<Route path="daily-image" element={<DailyImageEditor />} />
```

- [ ] **Step 2: Add sidebar menu item in AdminSidebar.tsx**

Add `Camera` to the lucide-react import:

```tsx
import {
  Home,
  Info,
  BookOpen,
  MessageSquare,
  Mail,
  Settings,
  Flame,
  Images,
  Building2,
  Camera,
} from 'lucide-react';
```

Add the menu item to the `menuItems` array (after `'Home Page'`):

```tsx
{ label: 'Daily Image', icon: Camera, href: '/admin/daily-image' },
```

- [ ] **Step 3: Verify compiles and test full flow**

```bash
cd Aarya-Durga-Frontend && npx tsc --noEmit
```

Expected: no errors.

Then manually test:
1. Open `http://localhost:8083/admin/daily-image` — editor page loads
2. Upload an image, enter a caption, click Save
3. Open `http://localhost:8083/` — DailyImageSection appears between Hero and About with the image and caption
4. Go back to admin, remove the image, save
5. Reload home page — DailyImageSection is gone

- [ ] **Step 4: Commit**

```bash
cd Aarya-Durga-Frontend
git add src/App.tsx src/components/admin/AdminSidebar.tsx
git commit -m "feat: register daily-image admin route and sidebar item"
```
