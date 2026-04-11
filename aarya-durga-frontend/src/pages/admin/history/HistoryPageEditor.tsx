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
    key: string;
    era_en: string;
    era_hi: string;
    era_mr: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
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
    key: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
}

interface BannerContent {
    quote_en: string;
    quote_hi: string;
    quote_mr: string;
    image_id?: number;
    existingImageUrl?: string;
}

interface HomeHistoryContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
    card1_title_en: string;
    card1_title_hi: string;
    card1_title_mr: string;
    card1_description_en: string;
    card1_description_hi: string;
    card1_description_mr: string;
    card2_title_en: string;
    card2_title_hi: string;
    card2_title_mr: string;
    card2_description_en: string;
    card2_description_hi: string;
    card2_description_mr: string;
    card3_title_en: string;
    card3_title_hi: string;
    card3_title_mr: string;
    card3_description_en: string;
    card3_description_hi: string;
    card3_description_mr: string;
}

const HistoryPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [activeSection, setActiveSection] = useState<
        "hero" | "origin" | "timeline" | "traditions" | "banner" | "home-history"
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
        items: [
            {
                key: "ancient",
                era_en: "",
                era_hi: "",
                era_mr: "",
                title_en: "",
                title_hi: "",
                title_mr: "",
                description_en: "",
                description_hi: "",
                description_mr: "",
            },
            {
                key: "medieval",
                era_en: "",
                era_hi: "",
                era_mr: "",
                title_en: "",
                title_hi: "",
                title_mr: "",
                description_en: "",
                description_hi: "",
                description_mr: "",
            },
            {
                key: "colonial",
                era_en: "",
                era_hi: "",
                era_mr: "",
                title_en: "",
                title_hi: "",
                title_mr: "",
                description_en: "",
                description_hi: "",
                description_mr: "",
            },
            {
                key: "post",
                era_en: "",
                era_hi: "",
                era_mr: "",
                title_en: "",
                title_hi: "",
                title_mr: "",
                description_en: "",
                description_hi: "",
                description_mr: "",
            },
            {
                key: "modern",
                era_en: "",
                era_hi: "",
                era_mr: "",
                title_en: "",
                title_hi: "",
                title_mr: "",
                description_en: "",
                description_hi: "",
                description_mr: "",
            },
        ],
    });

    const [traditionsContent, setTraditionsContent] =
        useState<TraditionsContent>({
            title_en: "",
            title_hi: "",
            title_mr: "",
            subtitle_en: "",
            subtitle_hi: "",
            subtitle_mr: "",
            items: [
                {
                    key: "navratri",
                    title_en: "",
                    title_hi: "",
                    title_mr: "",
                    description_en: "",
                    description_hi: "",
                    description_mr: "",
                },
                {
                    key: "texts",
                    title_en: "",
                    title_hi: "",
                    title_mr: "",
                    description_en: "",
                    description_hi: "",
                    description_mr: "",
                },
                {
                    key: "konkan",
                    title_en: "",
                    title_hi: "",
                    title_mr: "",
                    description_en: "",
                    description_hi: "",
                    description_mr: "",
                },
                {
                    key: "diwali",
                    title_en: "",
                    title_hi: "",
                    title_mr: "",
                    description_en: "",
                    description_hi: "",
                    description_mr: "",
                },
            ],
        });

    const [bannerContent, setBannerContent] = useState<BannerContent>({
        quote_en: "",
        quote_hi: "",
        quote_mr: "",
    });

    const [homeHistoryContent, setHomeHistoryContent] =
        useState<HomeHistoryContent>({
            title_en: "",
            title_hi: "",
            title_mr: "",
            description_en: "",
            description_hi: "",
            description_mr: "",
            card1_title_en: "",
            card1_title_hi: "",
            card1_title_mr: "",
            card1_description_en: "",
            card1_description_hi: "",
            card1_description_mr: "",
            card2_title_en: "",
            card2_title_hi: "",
            card2_title_mr: "",
            card2_description_en: "",
            card2_description_hi: "",
            card2_description_mr: "",
            card3_title_en: "",
            card3_title_hi: "",
            card3_title_mr: "",
            card3_description_en: "",
            card3_description_hi: "",
            card3_description_mr: "",
        });

    const imagesLoaded = useImagesLoaded([
        heroContent.existingImageUrl,
        originContent.existingImageUrl,
        bannerContent.existingImageUrl,
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
            const [historyResponse, homeResponse] = await Promise.all([
                client.get("/public/page-content/history"),
                client.get("/public/page-content/home"),
            ]);
            const data = historyResponse.data;
            const homeData = homeResponse.data;

            const findContent = (key: string) =>
                data.find((item: any) => item.section_key === key);
            const findHomeContent = (key: string) =>
                homeData.find((item: any) => item.section_key === key);
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

            setTimelineContent({
                title_en: findContent("timeline_title")?.content_en || "",
                title_hi: findContent("timeline_title")?.content_hi || "",
                title_mr: findContent("timeline_title")?.content_mr || "",
                items: [
                    {
                        key: "ancient",
                        era_en: findContent("ancient_era")?.content_en || "",
                        era_hi: findContent("ancient_era")?.content_hi || "",
                        era_mr: findContent("ancient_era")?.content_mr || "",
                        title_en:
                            findContent("ancient_title")?.content_en || "",
                        title_hi:
                            findContent("ancient_title")?.content_hi || "",
                        title_mr:
                            findContent("ancient_title")?.content_mr || "",
                        description_en:
                            findContent("ancient_description")?.content_en ||
                            "",
                        description_hi:
                            findContent("ancient_description")?.content_hi ||
                            "",
                        description_mr:
                            findContent("ancient_description")?.content_mr ||
                            "",
                    },
                    {
                        key: "medieval",
                        era_en: findContent("medieval_era")?.content_en || "",
                        era_hi: findContent("medieval_era")?.content_hi || "",
                        era_mr: findContent("medieval_era")?.content_mr || "",
                        title_en:
                            findContent("medieval_title")?.content_en || "",
                        title_hi:
                            findContent("medieval_title")?.content_hi || "",
                        title_mr:
                            findContent("medieval_title")?.content_mr || "",
                        description_en:
                            findContent("medieval_description")?.content_en ||
                            "",
                        description_hi:
                            findContent("medieval_description")?.content_hi ||
                            "",
                        description_mr:
                            findContent("medieval_description")?.content_mr ||
                            "",
                    },
                    {
                        key: "colonial",
                        era_en: findContent("colonial_era")?.content_en || "",
                        era_hi: findContent("colonial_era")?.content_hi || "",
                        era_mr: findContent("colonial_era")?.content_mr || "",
                        title_en:
                            findContent("colonial_title")?.content_en || "",
                        title_hi:
                            findContent("colonial_title")?.content_hi || "",
                        title_mr:
                            findContent("colonial_title")?.content_mr || "",
                        description_en:
                            findContent("colonial_description")?.content_en ||
                            "",
                        description_hi:
                            findContent("colonial_description")?.content_hi ||
                            "",
                        description_mr:
                            findContent("colonial_description")?.content_mr ||
                            "",
                    },
                    {
                        key: "post",
                        era_en:
                            findContent("post_independence_era")?.content_en ||
                            "",
                        era_hi:
                            findContent("post_independence_era")?.content_hi ||
                            "",
                        era_mr:
                            findContent("post_independence_era")?.content_mr ||
                            "",
                        title_en:
                            findContent("post_independence_title")
                                ?.content_en || "",
                        title_hi:
                            findContent("post_independence_title")
                                ?.content_hi || "",
                        title_mr:
                            findContent("post_independence_title")
                                ?.content_mr || "",
                        description_en:
                            findContent("post_independence_description")
                                ?.content_en || "",
                        description_hi:
                            findContent("post_independence_description")
                                ?.content_hi || "",
                        description_mr:
                            findContent("post_independence_description")
                                ?.content_mr || "",
                    },
                    {
                        key: "modern",
                        era_en: findContent("modern_day_era")?.content_en || "",
                        era_hi: findContent("modern_day_era")?.content_hi || "",
                        era_mr: findContent("modern_day_era")?.content_mr || "",
                        title_en:
                            findContent("modern_day_title")?.content_en || "",
                        title_hi:
                            findContent("modern_day_title")?.content_hi || "",
                        title_mr:
                            findContent("modern_day_title")?.content_mr || "",
                        description_en:
                            findContent("modern_day_description")?.content_en ||
                            "",
                        description_hi:
                            findContent("modern_day_description")?.content_hi ||
                            "",
                        description_mr:
                            findContent("modern_day_description")?.content_mr ||
                            "",
                    },
                ],
            });

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
                items: [
                    {
                        key: "navratri",
                        title_en:
                            findContent("navratri_title")?.content_en || "",
                        title_hi:
                            findContent("navratri_title")?.content_hi || "",
                        title_mr:
                            findContent("navratri_title")?.content_mr || "",
                        description_en:
                            findContent("navratri_description")?.content_en ||
                            "",
                        description_hi:
                            findContent("navratri_description")?.content_hi ||
                            "",
                        description_mr:
                            findContent("navratri_description")?.content_mr ||
                            "",
                    },
                    {
                        key: "texts",
                        title_en: findContent("texts_title")?.content_en || "",
                        title_hi: findContent("texts_title")?.content_hi || "",
                        title_mr: findContent("texts_title")?.content_mr || "",
                        description_en:
                            findContent("texts_description")?.content_en || "",
                        description_hi:
                            findContent("texts_description")?.content_hi || "",
                        description_mr:
                            findContent("texts_description")?.content_mr || "",
                    },
                    {
                        key: "konkan",
                        title_en: findContent("konkan_title")?.content_en || "",
                        title_hi: findContent("konkan_title")?.content_hi || "",
                        title_mr: findContent("konkan_title")?.content_mr || "",
                        description_en:
                            findContent("konkan_description")?.content_en || "",
                        description_hi:
                            findContent("konkan_description")?.content_hi || "",
                        description_mr:
                            findContent("konkan_description")?.content_mr || "",
                    },
                    {
                        key: "diwali",
                        title_en: findContent("diwali_title")?.content_en || "",
                        title_hi: findContent("diwali_title")?.content_hi || "",
                        title_mr: findContent("diwali_title")?.content_mr || "",
                        description_en:
                            findContent("diwali_description")?.content_en || "",
                        description_hi:
                            findContent("diwali_description")?.content_hi || "",
                        description_mr:
                            findContent("diwali_description")?.content_mr || "",
                    },
                ],
            });

            setBannerContent({
                quote_en: findContent("banner_quote")?.content_en || "",
                quote_hi: findContent("banner_quote")?.content_hi || "",
                quote_mr: findContent("banner_quote")?.content_mr || "",
                image_id: findContent("banner_image")?.image_id,
                existingImageUrl: getImage("banner_image"),
            });

            setHomeHistoryContent({
                title_en: findHomeContent("history_title")?.content_en || "",
                title_hi: findHomeContent("history_title")?.content_hi || "",
                title_mr: findHomeContent("history_title")?.content_mr || "",
                description_en:
                    findHomeContent("history_description")?.content_en || "",
                description_hi:
                    findHomeContent("history_description")?.content_hi || "",
                description_mr:
                    findHomeContent("history_description")?.content_mr || "",
                card1_title_en:
                    findHomeContent("history_card1_title")?.content_en || "",
                card1_title_hi:
                    findHomeContent("history_card1_title")?.content_hi || "",
                card1_title_mr:
                    findHomeContent("history_card1_title")?.content_mr || "",
                card1_description_en:
                    findHomeContent("history_card1_description")?.content_en ||
                    "",
                card1_description_hi:
                    findHomeContent("history_card1_description")?.content_hi ||
                    "",
                card1_description_mr:
                    findHomeContent("history_card1_description")?.content_mr ||
                    "",
                card2_title_en:
                    findHomeContent("history_card2_title")?.content_en || "",
                card2_title_hi:
                    findHomeContent("history_card2_title")?.content_hi || "",
                card2_title_mr:
                    findHomeContent("history_card2_title")?.content_mr || "",
                card2_description_en:
                    findHomeContent("history_card2_description")?.content_en ||
                    "",
                card2_description_hi:
                    findHomeContent("history_card2_description")?.content_hi ||
                    "",
                card2_description_mr:
                    findHomeContent("history_card2_description")?.content_mr ||
                    "",
                card3_title_en:
                    findHomeContent("history_card3_title")?.content_en || "",
                card3_title_hi:
                    findHomeContent("history_card3_title")?.content_hi || "",
                card3_title_mr:
                    findHomeContent("history_card3_title")?.content_mr || "",
                card3_description_en:
                    findHomeContent("history_card3_description")?.content_en ||
                    "",
                card3_description_hi:
                    findHomeContent("history_card3_description")?.content_hi ||
                    "",
                card3_description_mr:
                    findHomeContent("history_card3_description")?.content_mr ||
                    "",
            });
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
                        client.post("/admin/page-content", {
                            page_key: "history",
                            section_key: "hero_title",
                            content_en: heroContent.title_en,
                            content_hi: heroContent.title_hi,
                            content_mr: heroContent.title_mr,
                        }),
                        client.post("/admin/page-content", {
                            page_key: "history",
                            section_key: "hero_subtitle",
                            content_en: heroContent.subtitle_en,
                            content_hi: heroContent.subtitle_hi,
                            content_mr: heroContent.subtitle_mr,
                        }),
                        heroContent.image_id
                            ? client.post("/admin/page-content", {
                                  page_key: "history",
                                  section_key: "hero_image",
                                  image_id: heroContent.image_id,
                              })
                            : Promise.resolve(),
                    ]);
                    break;
                case "origin":
                    await Promise.all([
                        client.post("/admin/page-content", {
                            page_key: "history",
                            section_key: "origin_title",
                            content_en: originContent.title_en,
                            content_hi: originContent.title_hi,
                            content_mr: originContent.title_mr,
                        }),
                        client.post("/admin/page-content", {
                            page_key: "history",
                            section_key: "origin_paragraph1",
                            content_en: originContent.paragraph1_en,
                            content_hi: originContent.paragraph1_hi,
                            content_mr: originContent.paragraph1_mr,
                        }),
                        client.post("/admin/page-content", {
                            page_key: "history",
                            section_key: "origin_paragraph2",
                            content_en: originContent.paragraph2_en,
                            content_hi: originContent.paragraph2_hi,
                            content_mr: originContent.paragraph2_mr,
                        }),
                        originContent.image_id
                            ? client.post("/admin/page-content", {
                                  page_key: "history",
                                  section_key: "origin_image",
                                  image_id: originContent.image_id,
                              })
                            : Promise.resolve(),
                    ]);
                    break;
                case "timeline":
                    await client.post("/admin/page-content", {
                        page_key: "history",
                        section_key: "timeline_title",
                        content_en: timelineContent.title_en,
                        content_hi: timelineContent.title_hi,
                        content_mr: timelineContent.title_mr,
                    });
                    await Promise.all(
                        timelineContent.items.map((item) =>
                            Promise.all([
                                client.post("/admin/page-content", {
                                    page_key: "history",
                                    section_key: `${item.key}_era`,
                                    content_en: item.era_en,
                                    content_hi: item.era_hi,
                                    content_mr: item.era_mr,
                                }),
                                client.post("/admin/page-content", {
                                    page_key: "history",
                                    section_key: `${item.key}_title`,
                                    content_en: item.title_en,
                                    content_hi: item.title_hi,
                                    content_mr: item.title_mr,
                                }),
                                client.post("/admin/page-content", {
                                    page_key: "history",
                                    section_key: `${item.key}_description`,
                                    content_en: item.description_en,
                                    content_hi: item.description_hi,
                                    content_mr: item.description_mr,
                                }),
                            ]),
                        ),
                    );
                    break;
                case "traditions":
                    await client.post("/admin/page-content", {
                        page_key: "history",
                        section_key: "traditions_title",
                        content_en: traditionsContent.title_en,
                        content_hi: traditionsContent.title_hi,
                        content_mr: traditionsContent.title_mr,
                    });
                    await client.post("/admin/page-content", {
                        page_key: "history",
                        section_key: "traditions_subtitle",
                        content_en: traditionsContent.subtitle_en,
                        content_hi: traditionsContent.subtitle_hi,
                        content_mr: traditionsContent.subtitle_mr,
                    });
                    await Promise.all(
                        traditionsContent.items.map((item) =>
                            Promise.all([
                                client.post("/admin/page-content", {
                                    page_key: "history",
                                    section_key: `${item.key}_title`,
                                    content_en: item.title_en,
                                    content_hi: item.title_hi,
                                    content_mr: item.title_mr,
                                }),
                                client.post("/admin/page-content", {
                                    page_key: "history",
                                    section_key: `${item.key}_description`,
                                    content_en: item.description_en,
                                    content_hi: item.description_hi,
                                    content_mr: item.description_mr,
                                }),
                            ]),
                        ),
                    );
                    break;
                case "banner":
                    await Promise.all([
                        client.post("/admin/page-content", {
                            page_key: "history",
                            section_key: "banner_quote",
                            content_en: bannerContent.quote_en,
                            content_hi: bannerContent.quote_hi,
                            content_mr: bannerContent.quote_mr,
                        }),
                        bannerContent.image_id
                            ? client.post("/admin/page-content", {
                                  page_key: "history",
                                  section_key: "banner_image",
                                  image_id: bannerContent.image_id,
                              })
                            : Promise.resolve(),
                    ]);
                    break;
                case "home-history":
                    await Promise.all([
                        client.put("/admin/page-content/home/history_title", {
                            language: "en",
                            content: homeHistoryContent.title_en,
                        }),
                        client.put("/admin/page-content/home/history_title", {
                            language: "hi",
                            content: homeHistoryContent.title_hi,
                        }),
                        client.put("/admin/page-content/home/history_title", {
                            language: "mr",
                            content: homeHistoryContent.title_mr,
                        }),
                        client.put(
                            "/admin/page-content/home/history_description",
                            {
                                language: "en",
                                content: homeHistoryContent.description_en,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_description",
                            {
                                language: "hi",
                                content: homeHistoryContent.description_hi,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_description",
                            {
                                language: "mr",
                                content: homeHistoryContent.description_mr,
                            },
                        ),
                        client.put("/admin/page-content/home/history_card1_title", {
                            language: "en",
                            content: homeHistoryContent.card1_title_en,
                        }),
                        client.put("/admin/page-content/home/history_card1_title", {
                            language: "hi",
                            content: homeHistoryContent.card1_title_hi,
                        }),
                        client.put("/admin/page-content/home/history_card1_title", {
                            language: "mr",
                            content: homeHistoryContent.card1_title_mr,
                        }),
                        client.put(
                            "/admin/page-content/home/history_card1_description",
                            {
                                language: "en",
                                content: homeHistoryContent.card1_description_en,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_card1_description",
                            {
                                language: "hi",
                                content: homeHistoryContent.card1_description_hi,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_card1_description",
                            {
                                language: "mr",
                                content: homeHistoryContent.card1_description_mr,
                            },
                        ),
                        client.put("/admin/page-content/home/history_card2_title", {
                            language: "en",
                            content: homeHistoryContent.card2_title_en,
                        }),
                        client.put("/admin/page-content/home/history_card2_title", {
                            language: "hi",
                            content: homeHistoryContent.card2_title_hi,
                        }),
                        client.put("/admin/page-content/home/history_card2_title", {
                            language: "mr",
                            content: homeHistoryContent.card2_title_mr,
                        }),
                        client.put(
                            "/admin/page-content/home/history_card2_description",
                            {
                                language: "en",
                                content: homeHistoryContent.card2_description_en,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_card2_description",
                            {
                                language: "hi",
                                content: homeHistoryContent.card2_description_hi,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_card2_description",
                            {
                                language: "mr",
                                content: homeHistoryContent.card2_description_mr,
                            },
                        ),
                        client.put("/admin/page-content/home/history_card3_title", {
                            language: "en",
                            content: homeHistoryContent.card3_title_en,
                        }),
                        client.put("/admin/page-content/home/history_card3_title", {
                            language: "hi",
                            content: homeHistoryContent.card3_title_hi,
                        }),
                        client.put("/admin/page-content/home/history_card3_title", {
                            language: "mr",
                            content: homeHistoryContent.card3_title_mr,
                        }),
                        client.put(
                            "/admin/page-content/home/history_card3_description",
                            {
                                language: "en",
                                content: homeHistoryContent.card3_description_en,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_card3_description",
                            {
                                language: "hi",
                                content: homeHistoryContent.card3_description_hi,
                            },
                        ),
                        client.put(
                            "/admin/page-content/home/history_card3_description",
                            {
                                language: "mr",
                                content: homeHistoryContent.card3_description_mr,
                            },
                        ),
                    ]);
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
            description: "5 historical periods",
        },
        {
            id: "traditions" as const,
            title: "Sacred Traditions",
            description: "4 tradition items",
        },
        {
            id: "banner" as const,
            title: "Banner Section",
            description: "Title, background image",
        },
        {
            id: "home-history" as const,
            title: "Home Page History Section",
            description: "Homepage history title, description, and 3 cards",
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
                        {timelineContent.items.map((item, idx) => (
                            <div key={item.key} className="border-t pt-6">
                                <h3 className="font-semibold mb-4 capitalize">
                                    {item.key} Era
                                </h3>
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
                        <CardTitle>Traditions Section</CardTitle>
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
                        {traditionsContent.items.map((item, idx) => (
                            <div key={item.key} className="border-t pt-6">
                                <h3 className="font-semibold mb-4 capitalize">
                                    {item.key}
                                </h3>
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
                        <Button
                            onClick={() => saveSection("traditions")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Traditions Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Banner Section */}
            {activeSection === "banner" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Banner Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-4">Banner Image</h3>
                            <ImageUpload
                                onUpload={(mediaId) =>
                                    setBannerContent({
                                        ...bannerContent,
                                        image_id: mediaId,
                                    })
                                }
                                existingImageUrl={
                                    bannerContent.existingImageUrl
                                }
                                section="banner"
                            />
                        </div>
                        {renderLanguageTabs(
                            "Quote",
                            bannerContent.quote_en,
                            bannerContent.quote_hi,
                            bannerContent.quote_mr,
                            (lang, value) =>
                                setBannerContent({
                                    ...bannerContent,
                                    [`quote_${lang}`]: value,
                                }),
                            true,
                        )}
                        <Button
                            onClick={() => saveSection("banner")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Banner Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {activeSection === "home-history" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Home Page History Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {renderLanguageTabs(
                            "Section Title",
                            homeHistoryContent.title_en,
                            homeHistoryContent.title_hi,
                            homeHistoryContent.title_mr,
                            (lang, value) =>
                                setHomeHistoryContent({
                                    ...homeHistoryContent,
                                    [`title_${lang}`]: value,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Section Description",
                            homeHistoryContent.description_en,
                            homeHistoryContent.description_hi,
                            homeHistoryContent.description_mr,
                            (lang, value) =>
                                setHomeHistoryContent({
                                    ...homeHistoryContent,
                                    [`description_${lang}`]: value,
                                }),
                            true,
                        )}

                        {["1", "2", "3"].map((cardNo) => (
                            <div key={cardNo} className="border rounded-lg p-4 bg-muted/30">
                                <h3 className="font-semibold mb-4">
                                    Card {cardNo}
                                </h3>
                                {renderLanguageTabs(
                                    `Card ${cardNo} Title`,
                                    homeHistoryContent[
                                        `card${cardNo}_title_en` as keyof HomeHistoryContent
                                    ] as string,
                                    homeHistoryContent[
                                        `card${cardNo}_title_hi` as keyof HomeHistoryContent
                                    ] as string,
                                    homeHistoryContent[
                                        `card${cardNo}_title_mr` as keyof HomeHistoryContent
                                    ] as string,
                                    (lang, value) =>
                                        setHomeHistoryContent({
                                            ...homeHistoryContent,
                                            [`card${cardNo}_title_${lang}`]: value,
                                        }),
                                )}
                                {renderLanguageTabs(
                                    `Card ${cardNo} Description`,
                                    homeHistoryContent[
                                        `card${cardNo}_description_en` as keyof HomeHistoryContent
                                    ] as string,
                                    homeHistoryContent[
                                        `card${cardNo}_description_hi` as keyof HomeHistoryContent
                                    ] as string,
                                    homeHistoryContent[
                                        `card${cardNo}_description_mr` as keyof HomeHistoryContent
                                    ] as string,
                                    (lang, value) =>
                                        setHomeHistoryContent({
                                            ...homeHistoryContent,
                                            [`card${cardNo}_description_${lang}`]: value,
                                        }),
                                    true,
                                )}
                            </div>
                        ))}

                        <Button
                            onClick={() => saveSection("home-history")}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Home Page History Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default HistoryPageEditor;
