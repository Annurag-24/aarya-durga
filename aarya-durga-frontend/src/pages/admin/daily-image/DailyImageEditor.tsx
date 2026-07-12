import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";
import { useUploadMedia } from "@/hooks/content/useMedia";
import { cn } from "@/lib/utils";

interface DayRecord {
    image_date: string;
    image_id?: number | null;
    image?: { file_url?: string } | null;
}

const WINDOW_DAYS = 15;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

const startOfDay = (d: Date) => {
    const n = new Date(d);
    n.setHours(0, 0, 0, 0);
    return n;
};

const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const DailyImageEditor = () => {
    const today = useMemo(() => startOfDay(new Date()), []);
    const windowStart = useMemo(() => {
        const d = new Date(today);
        d.setDate(d.getDate() - (WINDOW_DAYS - 1));
        return d;
    }, [today]);

    const [viewMonth, setViewMonth] = useState<Date>(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );
    const [records, setRecords] = useState<Record<string, DayRecord>>({});
    const [busyKey, setBusyKey] = useState<string | null>(null);
    const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
    const uploadMedia = useUploadMedia();

    const fetchRange = async () => {
        try {
            const res = await client.get("/admin/daily-image", {
                params: { from: toISO(windowStart), to: toISO(today) },
            });
            const list: DayRecord[] = Array.isArray(res.data) ? res.data : [];
            const map: Record<string, DayRecord> = {};
            for (const r of list) {
                const key = (r.image_date || "").slice(0, 10);
                if (key) map[key] = r;
            }
            setRecords(map);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchRange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const gridDays = useMemo(() => {
        const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
        const startWeekday = first.getDay();
        const daysInMonth = new Date(
            viewMonth.getFullYear(),
            viewMonth.getMonth() + 1,
            0
        ).getDate();
        const cells: (Date | null)[] = [];
        for (let i = 0; i < startWeekday; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
        }
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [viewMonth]);

    const isEditable = (d: Date) => d >= windowStart && d <= today;

    const handleFile = async (date: Date, file: File) => {
        const key = toISO(date);
        setBusyKey(key);
        try {
            const media = await uploadMedia.mutateAsync({ file, section: `daily-${key}` });
            const mediaId = (media as { id: number }).id;
            const res = await client.put(`/admin/daily-image/by-date/${key}`, {
                image_id: mediaId,
            });
            setRecords((prev) => ({ ...prev, [key]: res.data }));
            toast.success(`Image saved for ${key}.`);
        } catch {
            toast.error("Failed to upload image.");
        } finally {
            setBusyKey(null);
        }
    };

    const handleRemove = async (date: Date) => {
        const key = toISO(date);
        setBusyKey(key);
        try {
            const res = await client.put(`/admin/daily-image/by-date/${key}`, {
                image_id: null,
            });
            setRecords((prev) => ({ ...prev, [key]: res.data }));
            toast.success(`Image removed for ${key}.`);
        } catch {
            toast.error("Failed to remove image.");
        } finally {
            setBusyKey(null);
        }
    };

    const prevMonth = () =>
        setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
    const nextMonth = () =>
        setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

    const canGoPrev = viewMonth > new Date(windowStart.getFullYear(), windowStart.getMonth(), 1);
    const canGoNext = viewMonth < new Date(today.getFullYear(), today.getMonth(), 1);

    return (
        <div className="w-full space-y-6">
            <div>
                <h1 className="text-2xl font-heading font-bold text-foreground py-2">Daily Image</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Click any date within the past {WINDOW_DAYS} days (including today) to upload an image. The uploaded
                    image will appear in that day's cell.
                </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <Button variant="outline" size="icon" onClick={prevMonth} disabled={!canGoPrev}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-heading font-semibold">
                        {MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}
                    </h2>
                    <Button variant="outline" size="icon" onClick={nextMonth} disabled={!canGoNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                    {WEEKDAYS.map((d) => (
                        <div
                            key={d}
                            className="text-xs font-medium text-muted-foreground text-center py-1"
                        >
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {gridDays.map((date, idx) => {
                        if (!date) {
                            return <div key={`e-${idx}`} className="aspect-square" />;
                        }
                        const key = toISO(date);
                        const record = records[key];
                        const imageUrl = record?.image?.file_url
                            ? constructImageUrl(record.image.file_url)
                            : undefined;
                        const editable = isEditable(date);
                        const isToday = sameDay(date, today);
                        const busy = busyKey === key;

                        return (
                            <div
                                key={key}
                                className={cn(
                                    "aspect-square rounded-lg border relative overflow-hidden group",
                                    editable
                                        ? "border-border bg-background hover:border-primary cursor-pointer"
                                        : "border-dashed border-border/50 bg-muted/30 opacity-60",
                                    isToday && "ring-2 ring-primary"
                                )}
                                onClick={() => {
                                    if (editable && !busy) fileInputs.current[key]?.click();
                                }}
                            >
                                <input
                                    ref={(el) => (fileInputs.current[key] = el)}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFile(date, f);
                                        e.target.value = "";
                                    }}
                                />

                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt=""
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                )}

                                <div
                                    className={cn(
                                        "absolute top-1 left-2 text-sm font-semibold z-10",
                                        imageUrl
                                            ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                                            : "text-foreground"
                                    )}
                                >
                                    {date.getDate()}
                                </div>

                                {editable && !imageUrl && !busy && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary">
                                        <Upload className="h-6 w-6 mb-1" />
                                        <span className="text-[10px]">Upload</span>
                                    </div>
                                )}

                                {editable && imageUrl && !busy && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(date);
                                        }}
                                        className="absolute top-1 right-1 z-10 p-1 rounded bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}

                                {busy && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-20">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                    Editable window: {toISO(windowStart)} – {toISO(today)} (15 days). Other dates are
                    disabled.
                </p>
            </div>
        </div>
    );
};

export default DailyImageEditor;
