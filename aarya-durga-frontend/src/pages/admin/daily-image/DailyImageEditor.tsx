import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { constructImageUrl } from "@/api/imageUrl";

interface DaySlot {
    day: number;
    image_id?: number;
    existingImageUrl?: string;
    caption_en: string;
    caption_hi: string;
    caption_mr: string;
}

const DAYS = 15;

const emptySlot = (day: number): DaySlot => ({
    day,
    caption_en: "",
    caption_hi: "",
    caption_mr: "",
});

const DailyImageEditor = () => {
    const [slots, setSlots] = useState<DaySlot[]>(
        Array.from({ length: DAYS }, (_, i) => emptySlot(i + 1))
    );
    const [saving, setSaving] = useState<number | null>(null);

    useEffect(() => {
        client.get("/admin/daily-image").then((res) => {
            const list = Array.isArray(res.data) ? res.data : [res.data];
            setSlots((prev) =>
                prev.map((s) => {
                    const match = list.find((r) => r.day_number === s.day);
                    if (!match) return s;
                    return {
                        ...s,
                        image_id: match.image_id ?? undefined,
                        existingImageUrl: match.image?.file_url
                            ? constructImageUrl(match.image.file_url)
                            : undefined,
                        caption_en: match.caption_en ?? "",
                        caption_hi: match.caption_hi ?? "",
                        caption_mr: match.caption_mr ?? "",
                    };
                })
            );
        }).catch(() => {});
    }, []);

    const updateSlot = (day: number, patch: Partial<DaySlot>) => {
        setSlots((prev) => prev.map((s) => (s.day === day ? { ...s, ...patch } : s)));
    };

    const handleSave = async (slot: DaySlot) => {
        setSaving(slot.day);
        try {
            await client.put(`/admin/daily-image/${slot.day}`, {
                image_id: slot.image_id ?? null,
                caption_en: slot.caption_en || null,
                caption_hi: slot.caption_hi || null,
                caption_mr: slot.caption_mr || null,
            });
            toast.success(`Day ${slot.day} saved.`);
        } catch {
            toast.error("Failed to save. Please try again.");
        } finally {
            setSaving(null);
        }
    };

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">Daily Image</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Upload images for each day of the month cycle (Day 1–{DAYS}).
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {slots.map((slot) => (
                    <div key={slot.day} className="rounded-xl border border-border bg-card p-5 space-y-4">
                        <p className="text-sm font-semibold text-foreground">Day {slot.day}</p>

                        <ImageUpload
                            compact
                            mediaId={slot.image_id}
                            existingImageUrl={slot.existingImageUrl}
                            onUpload={(mediaId) => updateSlot(slot.day, { image_id: mediaId })}
                            onRemove={() => updateSlot(slot.day, { image_id: undefined, existingImageUrl: undefined })}
                        />

                        <div className="hidden space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                                Caption <span className="font-normal">(optional)</span>
                            </p>
                            <Tabs defaultValue="en">
                                <TabsList className="h-7">
                                    <TabsTrigger value="en" className="text-xs px-2 py-1">EN</TabsTrigger>
                                    <TabsTrigger value="hi" className="text-xs px-2 py-1">हि</TabsTrigger>
                                    <TabsTrigger value="mr" className="text-xs px-2 py-1">म</TabsTrigger>
                                </TabsList>
                                <TabsContent value="en">
                                    <Textarea
                                        placeholder="English caption..."
                                        value={slot.caption_en}
                                        onChange={(e) => updateSlot(slot.day, { caption_en: e.target.value })}
                                        rows={2}
                                        className="text-sm"
                                    />
                                </TabsContent>
                                <TabsContent value="hi">
                                    <Textarea
                                        placeholder="हिंदी कैप्शन..."
                                        value={slot.caption_hi}
                                        onChange={(e) => updateSlot(slot.day, { caption_hi: e.target.value })}
                                        rows={2}
                                        className="text-sm"
                                    />
                                </TabsContent>
                                <TabsContent value="mr">
                                    <Textarea
                                        placeholder="मराठी मथळा..."
                                        value={slot.caption_mr}
                                        onChange={(e) => updateSlot(slot.day, { caption_mr: e.target.value })}
                                        rows={2}
                                        className="text-sm"
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>

                        <Button
                            variant="temple"
                            size="sm"
                            className="w-full"
                            onClick={() => handleSave(slot)}
                            disabled={saving === slot.day}
                        >
                            {saving === slot.day ? "Saving..." : `Save Day ${slot.day}`}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyImageEditor;
