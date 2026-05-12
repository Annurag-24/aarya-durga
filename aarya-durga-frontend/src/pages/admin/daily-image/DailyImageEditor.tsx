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
                    mediaId={form.image_id}
                    existingImageUrl={form.existingImageUrl}
                    onUpload={(mediaId) =>
                        setForm((f) => ({ ...f, image_id: mediaId }))
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
