import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "sonner";
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLoader } from "@/contexts/LoaderContext";
import { constructImageUrl } from "@/api/imageUrl";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

interface HeroContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_hi: string;
    subtitle_mr: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface OriginContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    paragraph1_en: string;
    paragraph1_hi: string;
    paragraph1_mr: string;
    paragraph2_en: string;
    paragraph2_hi: string;
    paragraph2_mr: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface TimelineContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    items: TimelineItem[];
}

interface TimelineItem {
    id?: number;
    tempId: string;
    era_en: string;
    era_hi: string;
    era_mr: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
    sort_order: number;
}

interface TraditionsContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    subtitle_en: string;
    subtitle_hi: string;
    subtitle_mr: string;
    items: TraditionItem[];
}

interface TraditionItem {
    id?: number;
    tempId: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
    sort_order: number;
}


const HistoryPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [activeSection, setActiveSection] = useState<
        | "hero"
        | "origin"
        | "timeline"
        | "traditions"
        | "banner"
    >("hero");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const [heroContent, setHeroContent] = useState<HeroContent>({
        title_en: "",
        title_hi: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_hi: "",
        subtitle_mr: "",
    });

    const [originContent, setOriginContent] = useState<OriginContent>({
        title_en: "",
        title_hi: "",
        title_mr: "",
        paragraph1_en: "",
        paragraph1_hi: "",
        paragraph1_mr: "",
        paragraph2_en: "",
        paragraph2_hi: "",
        paragraph2_mr: "",
    });

    const [timelineContent, setTimelineContent] = useState<TimelineContent>({
        title_en: "",
        title_hi: "",
        title_mr: "",
        items: [],
    });
    const [removedTimelineIds, setRemovedTimelineIds] = useState<number[]>([]);

    const [traditionsContent, setTraditionsContent] =
        useState<TraditionsContent>({
            title_en: "",
            title_hi: "",
            title_mr: "",
            subtitle_en: "",
            subtitle_hi: "",
            subtitle_mr: "",
            items: [],
        });
    const [removedTraditionIds, setRemovedTraditionIds] = useState<number[]>([]);

    const imagesLoaded = useImagesLoaded([
        heroContent.existingImageUrl,
        originContent.existingImageUrl,
    ]);

    useEffect(() => {
        if (!loading && imagesLoaded) {
            setGlobalLoading(false);
        }
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const historyResponse = await client.get(
                "/public/page-content/history",
            );
            const data = historyResponse.data;

            const findContent = (key: string) =>
                data.find((item: any) => item.section_key === key);
            const getImage = (key: string) => {
                const item = findContent(key);
                return item?.image?.file_url
                    ? constructImageUrl(item.image.file_url)
                    : undefined;
            };

            setHeroContent({
                title_en: findContent("hero_title")?.content_en || "",
                title_hi: findContent("hero_title")?.content_hi || "",
                title_mr: findContent("hero_title")?.content_mr || "",
                subtitle_en: findContent("hero_subtitle")?.content_en || "",
                subtitle_hi: findContent("hero_subtitle")?.content_hi || "",
                subtitle_mr: findContent("hero_subtitle")?.content_mr || "",
                image_id: findContent("hero_image")?.image_id,
                existingImageUrl: getImage("hero_image"),
            });

            setOriginContent({
                title_en: findContent("origin_title")?.content_en || "",
                title_hi: findContent("origin_title")?.content_hi || "",
                title_mr: findContent("origin_title")?.content_mr || "",
                paragraph1_en:
                    findContent("origin_paragraph1")?.content_en || "",
                paragraph1_hi:
                    findContent("origin_paragraph1")?.content_hi || "",
                paragraph1_mr:
                    findContent("origin_paragraph1")?.content_mr || "",
                paragraph2_en:
                    findContent("origin_paragraph2")?.content_en || "",
                paragraph2_hi:
                    findContent("origin_paragraph2")?.content_hi || "",
                paragraph2_mr:
                    findContent("origin_paragraph2")?.content_mr || "",
                image_id: findContent("origin_image")?.image_id,
                existingImageUrl: getImage("origin_image"),
            });

            const timelineResponse = await client.get(
                "/admin/history-timeline",
            );
            const timelineData = timelineResponse.data as Array<{
                id: number;
                era_label_en: string;
                era_label_hi: string;
                era_label_mr: string;
                title_en: string;
                title_hi: string;
                title_mr: string;
                description_en?: string;
                description_hi?: string;
                description_mr?: string;
                sort_order: number;
            }>;

            setTimelineContent({
                title_en: findContent("timeline_title")?.content_en || "",
                title_hi: findContent("timeline_title")?.content_hi || "",
                title_mr: findContent("timeline_title")?.content_mr || "",
                items: timelineData.map((item, index) => ({
                    id: item.id,
                    tempId: String(item.id),
                    era_en: item.era_label_en,
                    era_hi: item.era_label_hi,
                    era_mr: item.era_label_mr,
                    title_en: item.title_en,
                    title_hi: item.title_hi,
                    title_mr: item.title_mr,
                    description_en: item.description_en || "",
                    description_hi: item.description_hi || "",
                    description_mr: item.description_mr || "",
                    sort_order: item.sort_order ?? index,
                })),
            });
            setRemovedTimelineIds([]);

            const traditionsResponse = await client.get(
                "/admin/sacred-traditions",
            );
            const traditionsData = traditionsResponse.data as Array<{
                id: number;
                title_en: string;
                title_hi: string;
                title_mr: string;
                description_en?: string;
                description_hi?: string;
                description_mr?: string;
                sort_order: number;
            }>;

            setTraditionsContent({
                title_en: findContent("traditions_title")?.content_en || "",
                title_hi: findContent("traditions_title")?.content_hi || "",
                title_mr: findContent("traditions_title")?.content_mr || "",
                subtitle_en:
                    findContent("traditions_subtitle")?.content_en || "",
                subtitle_hi:
                    findContent("traditions_subtitle")?.content_hi || "",
                subtitle_mr:
                    findContent("traditions_subtitle")?.content_mr || "",
                items: traditionsData.map((item, index) => ({
                    id: item.id,
                    tempId: String(item.id),
                    title_en: item.title_en,
                    title_hi: item.title_hi,
                    title_mr: item.title_mr,
                    description_en: item.description_en || "",
                    description_hi: item.description_hi || "",
                    description_mr: item.description_mr || "",
                    sort_order: item.sort_order ?? index,
                })),
            });
            setRemovedTraditionIds([]);

        } catch (error) {
            toast.error("Failed to load content");
        } finally {
            setLoading(false);
        }
    };

    const saveSection = async (sectionName: string) => {
        setSaving(true);
        try {
            switch (sectionName) {
                case "hero":
                    await Promise.all([
                        client.put("/admin/page-content/history/hero_title", {
                            content_en: heroContent.title_en,
                            content_hi: heroContent.title_hi,
                            content_mr: heroContent.title_mr,
                        }),
                        client.put(
                            "/admin/page-content/history/hero_subtitle",
                            {
                                content_en: heroContent.subtitle_en,
                                content_hi: heroContent.subtitle_hi,
                                content_mr: heroContent.subtitle_mr,
                            },
                        ),
                        heroContent.image_id
                            ? client.put(
                                  "/admin/page-content/history/hero_image",
                                  {
                                      image_id: heroContent.image_id,
                                  },
                              )
                            : Promise.resolve(),
                    ]);
                    break;
                case "origin":
                    await Promise.all([
                        client.put("/admin/page-content/history/origin_title", {
                            content_en: originContent.title_en,
                            content_hi: originContent.title_hi,
                            content_mr: originContent.title_mr,
                        }),
                        client.put(
                            "/admin/page-content/history/origin_paragraph1",
                            {
                                content_en: originContent.paragraph1_en,
                                content_hi: originContent.paragraph1_hi,
                                content_mr: originContent.paragraph1_mr,
                            },
                        ),
                        client.put(
                            "/admin/page-content/history/origin_paragraph2",
                            {
                                content_en: originContent.paragraph2_en,
                                content_hi: originContent.paragraph2_hi,
                                content_mr: originContent.paragraph2_mr,
                            },
                        ),
                        originContent.image_id
                            ? client.put(
                                  "/admin/page-content/history/origin_image",
                                  {
                                      image_id: originContent.image_id,
                                  },
                              )
                            : Promise.resolve(),
                    ]);
                    break;
                case "timeline":
                    await client.put(
                        "/admin/page-content/history/timeline_title",
                        {
                            content_en: timelineContent.title_en,
                            content_hi: timelineContent.title_hi,
                            content_mr: timelineContent.title_mr,
                        },
                    );

                    await Promise.all(
                        removedTimelineIds.map((id) =>
                            client.delete(`/admin/history-timeline/${id}`),
                        ),
                    );

                    const savedTimeline = await Promise.all(
                        timelineContent.items.map((item, index) => {
                            const payload = {
                                era_label_en: item.era_en,
                                era_label_hi: item.era_hi || item.era_en,
                                era_label_mr: item.era_mr || item.era_en,
                                title_en: item.title_en,
                                title_hi: item.title_hi || item.title_en,
                                title_mr: item.title_mr || item.title_en,
                                description_en: item.description_en,
                                description_hi: item.description_hi,
                                description_mr: item.description_mr,
                                sort_order: index,
                            };

                            if (item.id) {
                                return client.put(
                                    `/admin/history-timeline/${item.id}`,
                                    payload,
                                );
                            }
                            return client.post(
                                "/admin/history-timeline",
                                payload,
                            );
                        }),
                    );

                    setTimelineContent({
                        ...timelineContent,
                        items: savedTimeline.map((response, index) => ({
                            id: response.data.id,
                            tempId: String(response.data.id),
                            era_en: response.data.era_label_en || "",
                            era_hi: response.data.era_label_hi || "",
                            era_mr: response.data.era_label_mr || "",
                            title_en: response.data.title_en || "",
                            title_hi: response.data.title_hi || "",
                            title_mr: response.data.title_mr || "",
                            description_en: response.data.description_en || "",
                            description_hi: response.data.description_hi || "",
                            description_mr: response.data.description_mr || "",
                            sort_order: response.data.sort_order ?? index,
                        })),
                    });
                    setRemovedTimelineIds([]);
                    break;
                case "traditions":
                    await client.put(
                        "/admin/page-content/history/traditions_title",
                        {
                            content_en: traditionsContent.title_en,
                            content_hi: traditionsContent.title_hi,
                            content_mr: traditionsContent.title_mr,
                        },
                    );
                    await client.put(
                        "/admin/page-content/history/traditions_subtitle",
                        {
                            content_en: traditionsContent.subtitle_en,
                            content_hi: traditionsContent.subtitle_hi,
                            content_mr: traditionsContent.subtitle_mr,
                        },
                    );
                    await Promise.all(
                        removedTraditionIds.map((id) =>
                            client.delete(`/admin/sacred-traditions/${id}`),
                        ),
                    );

                    const savedTraditions = await Promise.all(
                        traditionsContent.items.map((item, index) => {
                            const payload = {
                                title_en: item.title_en,
                                title_hi: item.title_hi || item.title_en,
                                title_mr: item.title_mr || item.title_en,
                                description_en: item.description_en,
                                description_hi: item.description_hi,
                                description_mr: item.description_mr,
                                sort_order: index,
                            };

                            if (item.id) {
                                return client.put(
                                    `/admin/sacred-traditions/${item.id}`,
                                    payload,
                                );
                            }
                            return client.post(
                                "/admin/sacred-traditions",
                                payload,
                            );
                        }),
                    );

                    setTraditionsContent({
                        ...traditionsContent,
                        items: savedTraditions.map((response, index) => ({
                            id: response.data.id,
                            tempId: String(response.data.id),
                            title_en: response.data.title_en || "",
                            title_hi: response.data.title_hi || "",
                            title_mr: response.data.title_mr || "",
                            description_en: response.data.description_en || "",
                            description_hi: response.data.description_hi || "",
                            description_mr: response.data.description_mr || "",
                            sort_order: response.data.sort_order ?? index,
                        })),
                    });
                    setRemovedTraditionIds([]);
                    break;
            }
            toast.success("Content saved successfully");
        } catch (error) {
            toast.error("Failed to save content");
        } finally {
            setSaving(false);
        }
    };

    const renderLanguageTabs = (
        label: string,
        en: string,
        hi: string,
        mr: string,
        onChange: (lang: string, value: string) => void,
        isTextarea = false,
    ) => (
        <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{label}</h3>
            <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-2 mt-4">
                    {isTextarea ? (
                        <RichTextEditor
                            value={en}
                            onChange={(value) => onChange("en", value)}
                            placeholder={`Enter ${label} in English`}
                        />
                    ) : (
                        <Input
                            value={en}
                            onChange={(e) => onChange("en", e.target.value)}
                            placeholder={`Enter ${label} in English`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>
                <TabsContent value="hi" className="space-y-2 mt-4">
                    {isTextarea ? (
                        <RichTextEditor
                            value={hi}
                            onChange={(value) => onChange("hi", value)}
                            placeholder={`हिंदी में ${label} दर्ज करें`}
                        />
                    ) : (
                        <Input
                            value={hi}
                            onChange={(e) => onChange("hi", e.target.value)}
                            placeholder={`हिंदी में ${label} दर्ज करें`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>
                <TabsContent value="mr" className="space-y-2 mt-4">
                    {isTextarea ? (
                        <RichTextEditor
                            value={mr}
                            onChange={(value) => onChange("mr", value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                        />
                    ) : (
                        <Input
                            value={mr}
                            onChange={(e) => onChange("mr", e.target.value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );

    const sections = [
        {
            id: "hero" as const,
            title: "Hero Section",
            description: "Title, subtitle, background image",
        },
        {
            id: "origin" as const,
            title: "Origin Section",
            description: "Title, 2 paragraphs, background image",
        },
        {
            id: "timeline" as const,
            title: "Timeline",
            description: `${timelineContent.items.length} historical period${timelineContent.items.length === 1 ? "" : "s"}`,
        },
        {
            id: "traditions" as const,
            title: "Annual Events",
            description: `${traditionsContent.items.length} tradition item${traditionsContent.items.length === 1 ? "" : "s"}`,
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">History Page Editor</h1>
                <p className="text-muted-foreground mt-2">
                    Manage all History page sections in multiple languages
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                {sections.map((section) => (
                    <Card
                        key={section.id}
                        className={`cursor-pointer transition-all ${activeSection === section.id ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setActiveSection(section.id)}
                    >
                        <CardContent className="pt-6">
                            <p className="font-semibold text-sm text-foreground">
                                {section.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {section.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Hero Section */}
            {activeSection === "hero" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Hero Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-4">Hero Image</h3>
                            <ImageUpload
                                onUpload={(mediaId) =>
                                    setHeroContent({
                                        ...heroContent,
                                        image_id: mediaId,
                                    })
                                }
                                existingImageUrl={heroContent.existingImageUrl}
                                section="hero"
                            />
                        </div>
                        {renderLanguageTabs(
                            "Title",
                            heroContent.title_en,
                            heroContent.title_hi,
                            heroContent.title_mr,
                            (lang, value) =>
                                setHeroContent({
                                    ...heroContent,
                                    [`title_${lang}`]: value,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Subtitle",
                            heroContent.subtitle_en,
                            heroContent.subtitle_hi,
                            heroContent.subtitle_mr,
                            (lang, value) =>
                                setHeroContent({
                                    ...heroContent,
                                    [`subtitle_${lang}`]: value,
                                }),
                            true,
                        )}
                        <Button
                            onClick={() => saveSection("hero")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Hero Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Origin Section */}
            {activeSection === "origin" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Origin Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-4">
                                Section Image
                            </h3>
                            <ImageUpload
                                onUpload={(mediaId) =>
                                    setOriginContent({
                                        ...originContent,
                                        image_id: mediaId,
                                    })
                                }
                                existingImageUrl={
                                    originContent.existingImageUrl
                                }
                                section="origin"
                            />
                        </div>
                        {renderLanguageTabs(
                            "Title",
                            originContent.title_en,
                            originContent.title_hi,
                            originContent.title_mr,
                            (lang, value) =>
                                setOriginContent({
                                    ...originContent,
                                    [`title_${lang}`]: value,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Paragraph 1",
                            originContent.paragraph1_en,
                            originContent.paragraph1_hi,
                            originContent.paragraph1_mr,
                            (lang, value) =>
                                setOriginContent({
                                    ...originContent,
                                    [`paragraph1_${lang}`]: value,
                                }),
                            true,
                        )}
                        {renderLanguageTabs(
                            "Paragraph 2",
                            originContent.paragraph2_en,
                            originContent.paragraph2_hi,
                            originContent.paragraph2_mr,
                            (lang, value) =>
                                setOriginContent({
                                    ...originContent,
                                    [`paragraph2_${lang}`]: value,
                                }),
                            true,
                        )}
                        <Button
                            onClick={() => saveSection("origin")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Origin Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Timeline Section */}
            {activeSection === "timeline" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Timeline Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {renderLanguageTabs(
                            "Section Title",
                            timelineContent.title_en,
                            timelineContent.title_hi,
                            timelineContent.title_mr,
                            (lang, value) =>
                                setTimelineContent({
                                    ...timelineContent,
                                    [`title_${lang}`]: value,
                                }),
                        )}
                        <div className="flex items-center justify-between border-t pt-6">
                            <h3 className="font-semibold text-foreground">
                                Timeline Items
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setTimelineContent({
                                        ...timelineContent,
                                        items: [
                                            {
                                                tempId: `new-${Date.now()}`,
                                                era_en: "",
                                                era_hi: "",
                                                era_mr: "",
                                                title_en: "",
                                                title_hi: "",
                                                title_mr: "",
                                                description_en: "",
                                                description_hi: "",
                                                description_mr: "",
                                                sort_order:
                                                    timelineContent.items.length,
                                            },
                                            ...timelineContent.items,
                                        ],
                                    })
                                }
                            >
                                + Add Timeline Item
                            </Button>
                        </div>
                        {timelineContent.items.map((item, idx) => (
                            <div
                                key={item.tempId}
                                className="border rounded-lg p-4 bg-muted/30 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">
                                        Item{" "}
                                        {timelineContent.items.length - idx}
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            if (item.id) {
                                                setRemovedTimelineIds([
                                                    ...removedTimelineIds,
                                                    item.id,
                                                ]);
                                            }
                                            setTimelineContent({
                                                ...timelineContent,
                                                items: timelineContent.items.filter(
                                                    (i) =>
                                                        i.tempId !== item.tempId,
                                                ),
                                            });
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                {renderLanguageTabs(
                                    `Era Label`,
                                    item.era_en,
                                    item.era_hi,
                                    item.era_mr,
                                    (lang, value) => {
                                        const newItems = [
                                            ...timelineContent.items,
                                        ];
                                        newItems[idx] = {
                                            ...item,
                                            [`era_${lang}`]: value,
                                        };
                                        setTimelineContent({
                                            ...timelineContent,
                                            items: newItems,
                                        });
                                    },
                                )}
                                {renderLanguageTabs(
                                    `Title`,
                                    item.title_en,
                                    item.title_hi,
                                    item.title_mr,
                                    (lang, value) => {
                                        const newItems = [
                                            ...timelineContent.items,
                                        ];
                                        newItems[idx] = {
                                            ...item,
                                            [`title_${lang}`]: value,
                                        };
                                        setTimelineContent({
                                            ...timelineContent,
                                            items: newItems,
                                        });
                                    },
                                )}
                                {renderLanguageTabs(
                                    `Description`,
                                    item.description_en,
                                    item.description_hi,
                                    item.description_mr,
                                    (lang, value) => {
                                        const newItems = [
                                            ...timelineContent.items,
                                        ];
                                        newItems[idx] = {
                                            ...item,
                                            [`description_${lang}`]: value,
                                        };
                                        setTimelineContent({
                                            ...timelineContent,
                                            items: newItems,
                                        });
                                    },
                                    true,
                                )}
                            </div>
                        ))}
                        {timelineContent.items.length === 0 && (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No timeline items yet. Click "Add Timeline Item" to add one.
                            </div>
                        )}
                        <Button
                            onClick={() => saveSection("timeline")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Timeline Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Traditions Section */}
            {activeSection === "traditions" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Annual Events Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {renderLanguageTabs(
                            "Section Title",
                            traditionsContent.title_en,
                            traditionsContent.title_hi,
                            traditionsContent.title_mr,
                            (lang, value) =>
                                setTraditionsContent({
                                    ...traditionsContent,
                                    [`title_${lang}`]: value,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Section Subtitle",
                            traditionsContent.subtitle_en,
                            traditionsContent.subtitle_hi,
                            traditionsContent.subtitle_mr,
                            (lang, value) =>
                                setTraditionsContent({
                                    ...traditionsContent,
                                    [`subtitle_${lang}`]: value,
                                }),
                            true,
                        )}
                        <div className="flex items-center justify-between border-t pt-6">
                            <h3 className="font-semibold text-foreground">
                                Tradition Items
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setTraditionsContent({
                                        ...traditionsContent,
                                        items: [
                                            {
                                                tempId: `new-${Date.now()}`,
                                                title_en: "",
                                                title_hi: "",
                                                title_mr: "",
                                                description_en: "",
                                                description_hi: "",
                                                description_mr: "",
                                                sort_order:
                                                    traditionsContent.items
                                                        .length,
                                            },
                                            ...traditionsContent.items,
                                        ],
                                    })
                                }
                            >
                                + Add Tradition
                            </Button>
                        </div>
                        {traditionsContent.items.map((item, idx) => (
                            <div
                                key={item.tempId}
                                className="border rounded-lg p-4 bg-muted/30 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">
                                        Item{" "}
                                        {traditionsContent.items.length - idx}
                                    </h4>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => {
                                            if (item.id) {
                                                setRemovedTraditionIds([
                                                    ...removedTraditionIds,
                                                    item.id,
                                                ]);
                                            }
                                            setTraditionsContent({
                                                ...traditionsContent,
                                                items: traditionsContent.items.filter(
                                                    (i) =>
                                                        i.tempId !==
                                                        item.tempId,
                                                ),
                                            });
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                                {renderLanguageTabs(
                                    `Title`,
                                    item.title_en,
                                    item.title_hi,
                                    item.title_mr,
                                    (lang, value) => {
                                        const newItems = [
                                            ...traditionsContent.items,
                                        ];
                                        newItems[idx] = {
                                            ...item,
                                            [`title_${lang}`]: value,
                                        };
                                        setTraditionsContent({
                                            ...traditionsContent,
                                            items: newItems,
                                        });
                                    },
                                )}
                                {renderLanguageTabs(
                                    `Description`,
                                    item.description_en,
                                    item.description_hi,
                                    item.description_mr,
                                    (lang, value) => {
                                        const newItems = [
                                            ...traditionsContent.items,
                                        ];
                                        newItems[idx] = {
                                            ...item,
                                            [`description_${lang}`]: value,
                                        };
                                        setTraditionsContent({
                                            ...traditionsContent,
                                            items: newItems,
                                        });
                                    },
                                    true,
                                )}
                            </div>
                        ))}
                        {traditionsContent.items.length === 0 && (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                No traditions yet. Click "Add Tradition" to add one.
                            </div>
                        )}
                        <Button
                            onClick={() => saveSection("traditions")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Annual Events Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default HistoryPageEditor;
