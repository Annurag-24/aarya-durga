import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLoader } from "@/contexts/LoaderContext";
import { constructImageUrl } from "@/api/imageUrl";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

interface HeroContent {
    main_title_en: string;
    main_title_hi: string;
    main_title_mr: string;
    main_subtitle_en: string;
    main_subtitle_hi: string;
    main_subtitle_mr: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
    image_id?: string;
    existingImageUrl?: string;
}

interface MissionContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
}

interface CoreValue {
    key: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
}

interface CoreValuesContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    values: CoreValue[];
}

interface CommitteeMemberForm {
    id?: number;
    tempId: string;
    name: string;
    designation_en: string;
    designation_hi: string;
    designation_mr: string;
    address_en: string;
    address_hi: string;
    address_mr: string;
    phone: string;
    image_id?: number;
    existingImageUrl?: string;
    sort_order: number;
}

interface CommitteeContent {
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
    members: CommitteeMemberForm[];
}

const AboutPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [activeSection, setActiveSection] = useState<"hero" | "committee">(
        "hero",
    );

    const [heroContent, setHeroContent] = useState<HeroContent>({
        main_title_en: "",
        main_title_hi: "",
        main_title_mr: "",
        main_subtitle_en: "",
        main_subtitle_hi: "",
        main_subtitle_mr: "",
        title_en: "",
        title_hi: "",
        title_mr: "",
        description_en: "",
        description_hi: "",
        description_mr: "",
    });

    const [committeeContent, setCommitteeContent] = useState<CommitteeContent>({
        title_en: "",
        title_hi: "",
        title_mr: "",
        description_en: "",
        description_hi: "",
        description_mr: "",
        members: [],
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const imagesLoaded = useImagesLoaded([heroContent.existingImageUrl]);

    useEffect(() => {
        if (!loading && imagesLoaded) {
            setGlobalLoading(false);
        }
    }, [loading, imagesLoaded, setGlobalLoading]);

    const sections = [
        {
            key: "hero",
            label: "Hero Section",
            description: "Hero heading, subtitle, section content, and image",
        },
        {
            key: "committee",
            label: "Committee",
            description: "Committee title, description & members",
        },
    ] as const;

    useEffect(() => {
        loadAboutContent();
    }, []);

    const loadAboutContent = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const [aboutResponse, homeResponse] = await Promise.all([
                client.get(`/public/page-content/about`),
                client.get(`/public/page-content/home`),
            ]);
            const aboutData = aboutResponse.data as Array<{
                section_key: string;
                content_en?: string;
                content_hi?: string;
                content_mr?: string;
                image_id?: number;
                image?: { file_url: string };
            }>;
            const homeData = homeResponse.data as Array<{
                section_key: string;
                content_en?: string;
                content_hi?: string;
                content_mr?: string;
                image_id?: number;
                image?: { file_url: string };
            }>;

            // Hero section now manages home/about content
            const heroMainTitleData = aboutData.find(
                (item) => item.section_key === "hero_main_title",
            );
            const heroMainSubtitleData = aboutData.find(
                (item) => item.section_key === "hero_main_subtitle",
            );
            const heroTitleData = homeData.find(
                (item) => item.section_key === "about_title",
            );
            const heroDescriptionData = homeData.find(
                (item) => item.section_key === "about_description",
            );
            const heroImageData = homeData.find(
                (item) => item.section_key === "about_image",
            );
            let heroImageUrl: string | undefined;
            if (heroImageData?.image?.file_url) {
                heroImageUrl = constructImageUrl(heroImageData.image.file_url);
            }
            setHeroContent({
                main_title_en: heroMainTitleData?.content_en || "",
                main_title_hi: heroMainTitleData?.content_hi || "",
                main_title_mr: heroMainTitleData?.content_mr || "",
                main_subtitle_en: heroMainSubtitleData?.content_en || "",
                main_subtitle_hi: heroMainSubtitleData?.content_hi || "",
                main_subtitle_mr: heroMainSubtitleData?.content_mr || "",
                title_en: heroTitleData?.content_en || "",
                title_hi: heroTitleData?.content_hi || "",
                title_mr: heroTitleData?.content_mr || "",
                description_en: heroDescriptionData?.content_en || "",
                description_hi: heroDescriptionData?.content_hi || "",
                description_mr: heroDescriptionData?.content_mr || "",
                image_id: heroImageData?.image_id
                    ? String(heroImageData.image_id)
                    : undefined,
                existingImageUrl: heroImageUrl,
            });

            const committeeMembersResponse = await client.get(
                "/admin/committee-members",
            );
            const committeeMembersData =
                committeeMembersResponse.data as Array<{
                    id: number;
                    name: string;
                    role_en?: string;
                    role_hi?: string;
                    role_mr?: string;
                    address_en?: string;
                    address_hi?: string;
                    address_mr?: string;
                    phone?: string;
                    photo_id?: number;
                    photo?: { file_url?: string; url?: string };
                    sort_order?: number;
                }>;

            // Committee
            const committeeTitleData = aboutData.find(
                (item) => item.section_key === "committee_title",
            );
            const committeeDescData = aboutData.find(
                (item) => item.section_key === "committee_description",
            );
            setCommitteeContent({
                title_en: committeeTitleData?.content_en || "",
                title_hi: committeeTitleData?.content_hi || "",
                title_mr: committeeTitleData?.content_mr || "",
                description_en: committeeDescData?.content_en || "",
                description_hi: committeeDescData?.content_hi || "",
                description_mr: committeeDescData?.content_mr || "",
                members: committeeMembersData.map((member, index) => ({
                    id: member.id,
                    tempId: String(member.id),
                    name: member.name || "",
                    designation_en: member.role_en || "",
                    designation_hi: member.role_hi || "",
                    designation_mr: member.role_mr || "",
                    address_en: member.address_en || "",
                    address_hi: member.address_hi || "",
                    address_mr: member.address_mr || "",
                    phone: member.phone || "",
                    image_id: member.photo_id,
                    existingImageUrl: member.photo?.file_url
                        ? constructImageUrl(member.photo.file_url)
                        : member.photo?.url
                          ? constructImageUrl(member.photo.url)
                          : undefined,
                    sort_order: member.sort_order ?? index,
                })),
            });
        } catch (error) {
            toast.error("Failed to load about page content");
        } finally {
            setLoading(false);
        }
    };

    const saveSectionContent = async (
        sectionName: string,
        updates: Array<{ endpoint: string; data: any }>,
    ) => {
        setSaving(true);
        try {
            await Promise.all(
                updates.map((update) =>
                    client.put(
                        `/admin/page-content/about/${update.endpoint}`,
                        update.data,
                    ),
                ),
            );
            toast.success(`${sectionName} saved successfully`);
        } catch (error) {
            toast.error(`Failed to save ${sectionName}`);
        } finally {
            setSaving(false);
        }
    };

    const saveHeroSection = async () => {
        setSaving(true);
        try {
            await Promise.all([
                client.put(`/admin/page-content/about/hero_main_title`, {
                    language: "en",
                    content: heroContent.main_title_en,
                }),
                client.put(`/admin/page-content/about/hero_main_title`, {
                    language: "hi",
                    content: heroContent.main_title_hi,
                }),
                client.put(`/admin/page-content/about/hero_main_title`, {
                    language: "mr",
                    content: heroContent.main_title_mr,
                }),
                client.put(`/admin/page-content/about/hero_main_subtitle`, {
                    language: "en",
                    content: heroContent.main_subtitle_en,
                }),
                client.put(`/admin/page-content/about/hero_main_subtitle`, {
                    language: "hi",
                    content: heroContent.main_subtitle_hi,
                }),
                client.put(`/admin/page-content/about/hero_main_subtitle`, {
                    language: "mr",
                    content: heroContent.main_subtitle_mr,
                }),
            ]);

            if (
                heroContent.title_en ||
                heroContent.title_hi ||
                heroContent.title_mr
            ) {
                await Promise.all(
                    [
                        heroContent.title_en &&
                            client.put(`/admin/page-content/home/about_title`, {
                                language: "en",
                                content: heroContent.title_en,
                            }),
                        heroContent.title_hi &&
                            client.put(`/admin/page-content/home/about_title`, {
                                language: "hi",
                                content: heroContent.title_hi,
                            }),
                        heroContent.title_mr &&
                            client.put(`/admin/page-content/home/about_title`, {
                                language: "mr",
                                content: heroContent.title_mr,
                            }),
                    ].filter(Boolean),
                );
            }

            await Promise.all([
                client.put(`/admin/page-content/home/about_description`, {
                    language: "en",
                    content: heroContent.description_en,
                }),
                client.put(`/admin/page-content/home/about_description`, {
                    language: "hi",
                    content: heroContent.description_hi,
                }),
                client.put(`/admin/page-content/home/about_description`, {
                    language: "mr",
                    content: heroContent.description_mr,
                }),
                client.put(`/admin/page-content/home/about_image`, {
                    image_id: heroContent.image_id || null,
                }),
            ]);

            toast.success("Hero section saved successfully");
        } catch (error) {
            toast.error("Failed to save hero section");
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveHeroImage = async () => {
        try {
            await client.put(`/admin/page-content/home/about_image`, {
                image_id: null,
            });
            setHeroContent({
                ...heroContent,
                image_id: undefined,
                existingImageUrl: undefined,
            });
            toast.success("Image removed successfully");
        } catch (error) {
            toast.error("Failed to remove image");
        }
    };

    const renderLanguageTabs = (
        label: string,
        enValue: string,
        hiValue: string,
        mrValue: string,
        onChange: (lang: "en" | "hi" | "mr", value: string) => void,
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
                            value={enValue}
                            onChange={(value) => onChange("en", value)}
                            placeholder={`Enter ${label} in English`}
                        />
                    ) : (
                        <Input
                            value={enValue}
                            onChange={(e) => onChange("en", e.target.value)}
                            placeholder={`Enter ${label} in English`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>

                <TabsContent value="hi" className="space-y-2 mt-4">
                    {isTextarea ? (
                        <RichTextEditor
                            value={hiValue}
                            onChange={(value) => onChange("hi", value)}
                            placeholder={`हिंदी में ${label} दर्ज करें`}
                        />
                    ) : (
                        <Input
                            value={hiValue}
                            onChange={(e) => onChange("hi", e.target.value)}
                            placeholder={`हिंदी में ${label} दर्ज करें`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>

                <TabsContent value="mr" className="space-y-2 mt-4">
                    {isTextarea ? (
                        <RichTextEditor
                            value={mrValue}
                            onChange={(value) => onChange("mr", value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                        />
                    ) : (
                        <Input
                            value={mrValue}
                            onChange={(e) => onChange("mr", e.target.value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                            disabled={loading}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );

    const addCommitteeMember = () => {
        setCommitteeContent({
            ...committeeContent,
            members: [
                {
                    tempId: `new-${Date.now()}`,
                    name: "",
                    designation_en: "",
                    designation_hi: "",
                    designation_mr: "",
                    address_en: "",
                    address_hi: "",
                    address_mr: "",
                    phone: "",
                    sort_order: committeeContent.members.length,
                },
                ...committeeContent.members,
            ],
        });
    };

    const updateCommitteeMember = (
        tempId: string,
        updates: Partial<CommitteeMemberForm>,
    ) => {
        setCommitteeContent({
            ...committeeContent,
            members: committeeContent.members.map((member) =>
                member.tempId === tempId ? { ...member, ...updates } : member,
            ),
        });
    };

    const removeCommitteeMember = async (tempId: string) => {
        const member = committeeContent.members.find(
            (item) => item.tempId === tempId,
        );
        if (!member) return;

        if (member.id) {
            try {
                await client.delete(`/admin/committee-members/${member.id}`);
                toast.success("Committee member removed successfully");
            } catch (error) {
                toast.error("Failed to remove committee member");
                return;
            }
        }

        setCommitteeContent({
            ...committeeContent,
            members: committeeContent.members
                .filter((item) => item.tempId !== tempId)
                .map((item, index) => ({ ...item, sort_order: index })),
        });
    };

    const saveCommitteeSection = async () => {
        setSaving(true);
        try {
            const sectionUpdates = [
                committeeContent.title_en && {
                    endpoint: "committee_title",
                    data: {
                        language: "en",
                        content: committeeContent.title_en,
                    },
                },
                committeeContent.title_hi && {
                    endpoint: "committee_title",
                    data: {
                        language: "hi",
                        content: committeeContent.title_hi,
                    },
                },
                committeeContent.title_mr && {
                    endpoint: "committee_title",
                    data: {
                        language: "mr",
                        content: committeeContent.title_mr,
                    },
                },
                committeeContent.description_en && {
                    endpoint: "committee_description",
                    data: {
                        language: "en",
                        content: committeeContent.description_en,
                    },
                },
                committeeContent.description_hi && {
                    endpoint: "committee_description",
                    data: {
                        language: "hi",
                        content: committeeContent.description_hi,
                    },
                },
                committeeContent.description_mr && {
                    endpoint: "committee_description",
                    data: {
                        language: "mr",
                        content: committeeContent.description_mr,
                    },
                },
            ].filter(Boolean) as Array<{ endpoint: string; data: any }>;

            await Promise.all(
                sectionUpdates.map((update) =>
                    client.put(
                        `/admin/page-content/about/${update.endpoint}`,
                        update.data,
                    ),
                ),
            );

            const savedMembers = await Promise.all(
                committeeContent.members.map((member, index) => {
                    const payload = {
                        name: member.name,
                        role_en: member.designation_en,
                        role_hi: member.designation_hi || member.designation_en,
                        role_mr: member.designation_mr || member.designation_en,
                        address_en: member.address_en,
                        address_hi: member.address_hi || member.address_en,
                        address_mr: member.address_mr || member.address_en,
                        phone: member.phone,
                        photo_id: member.image_id || null,
                        sort_order: index,
                    };

                    if (member.id) {
                        return client.put(
                            `/admin/committee-members/${member.id}`,
                            payload,
                        );
                    }

                    return client.post("/admin/committee-members", payload);
                }),
            );

            setCommitteeContent({
                ...committeeContent,
                members: savedMembers.map((response, index) => ({
                    id: response.data.id,
                    tempId: String(response.data.id),
                    name: response.data.name || "",
                    designation_en: response.data.role_en || "",
                    designation_hi: response.data.role_hi || "",
                    designation_mr: response.data.role_mr || "",
                    address_en: response.data.address_en || "",
                    address_hi: response.data.address_hi || "",
                    address_mr: response.data.address_mr || "",
                    phone: response.data.phone || "",
                    image_id: response.data.photo_id,
                    existingImageUrl: response.data.photo?.file_url
                        ? constructImageUrl(response.data.photo.file_url)
                        : response.data.photo?.url
                          ? constructImageUrl(response.data.photo.url)
                          : undefined,
                    sort_order: response.data.sort_order ?? index,
                })),
            });

            toast.success("Committee section saved successfully");
        } catch (error) {
            toast.error("Failed to save committee section");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                    About Us Page Editor
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage all About Us page sections in multiple languages
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {sections.map((section) => (
                    <Card
                        key={section.key}
                        className={`cursor-pointer transition-all ${activeSection === section.key ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setActiveSection(section.key)}
                    >
                        <CardContent className="pt-6">
                            <p className="font-semibold text-sm text-foreground">
                                {section.label}
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
                        {renderLanguageTabs(
                            "Main Title",
                            heroContent.main_title_en,
                            heroContent.main_title_hi,
                            heroContent.main_title_mr,
                            (lang, val) =>
                                setHeroContent({
                                    ...heroContent,
                                    [`main_title_${lang}`]: val,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Main Subtitle",
                            heroContent.main_subtitle_en,
                            heroContent.main_subtitle_hi,
                            heroContent.main_subtitle_mr,
                            (lang, val) =>
                                setHeroContent({
                                    ...heroContent,
                                    [`main_subtitle_${lang}`]: val,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Section Title",
                            heroContent.title_en,
                            heroContent.title_hi,
                            heroContent.title_mr,
                            (lang, val) =>
                                setHeroContent({
                                    ...heroContent,
                                    [`title_${lang}`]: val,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Section Description",
                            heroContent.description_en,
                            heroContent.description_hi,
                            heroContent.description_mr,
                            (lang, val) =>
                                setHeroContent({
                                    ...heroContent,
                                    [`description_${lang}`]: val,
                                }),
                            true,
                        )}

                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground">
                                Hero Image
                            </h3>
                            <ImageUpload
                                onUpload={(mediaId: number) =>
                                    setHeroContent({
                                        ...heroContent,
                                        image_id: String(mediaId),
                                    })
                                }
                                existingImageUrl={heroContent.existingImageUrl}
                                onRemove={handleRemoveHeroImage}
                                section="about-hero"
                            />
                        </div>

                        <Button
                            onClick={saveHeroSection}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Hero Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Committee Section */}
            {activeSection === "committee" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Committee Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {renderLanguageTabs(
                            "Committee Title",
                            committeeContent.title_en,
                            committeeContent.title_hi,
                            committeeContent.title_mr,
                            (lang, val) =>
                                setCommitteeContent({
                                    ...committeeContent,
                                    [`title_${lang}`]: val,
                                }),
                        )}
                        {renderLanguageTabs(
                            "Committee Description",
                            committeeContent.description_en,
                            committeeContent.description_hi,
                            committeeContent.description_mr,
                            (lang, val) =>
                                setCommitteeContent({
                                    ...committeeContent,
                                    [`description_${lang}`]: val,
                                }),
                            true,
                        )}

                        <div className="space-y-8 mt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-foreground">
                                    Committee Members
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={addCommitteeMember}
                                >
                                    <Plus size={16} />
                                    Add Member
                                </Button>
                            </div>

                            {committeeContent.members.map((member, index) => (
                                <div
                                    key={member.tempId}
                                    className="border rounded-lg p-4 bg-muted/30 space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-foreground">
                                            Member{" "}
                                            {committeeContent.members.length -
                                                index}
                                        </h4>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                removeCommitteeMember(
                                                    member.tempId,
                                                )
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-foreground">
                                            Member Photo
                                        </h3>
                                        <ImageUpload
                                            onUpload={(mediaId: number) =>
                                                updateCommitteeMember(
                                                    member.tempId,
                                                    { image_id: mediaId },
                                                )
                                            }
                                            existingImageUrl={
                                                member.existingImageUrl
                                            }
                                            section={`committee-member-${index + 1}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-foreground">
                                            Name
                                        </h3>
                                        <Input
                                            value={member.name}
                                            onChange={(e) =>
                                                updateCommitteeMember(
                                                    member.tempId,
                                                    { name: e.target.value },
                                                )
                                            }
                                            placeholder="Enter member name"
                                            disabled={loading}
                                        />
                                    </div>

                                    {renderLanguageTabs(
                                        "Designation",
                                        member.designation_en,
                                        member.designation_hi,
                                        member.designation_mr,
                                        (lang, val) => {
                                            updateCommitteeMember(
                                                member.tempId,
                                                {
                                                    [`designation_${lang}`]:
                                                        val,
                                                } as Partial<CommitteeMemberForm>,
                                            );
                                        },
                                    )}

                                    {renderLanguageTabs(
                                        "Address",
                                        member.address_en,
                                        member.address_hi,
                                        member.address_mr,
                                        (lang, val) => {
                                            updateCommitteeMember(
                                                member.tempId,
                                                {
                                                    [`address_${lang}`]: val,
                                                } as Partial<CommitteeMemberForm>,
                                            );
                                        },
                                    )}

                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-foreground">
                                            Phone
                                        </h3>
                                        <Input
                                            value={member.phone}
                                            onChange={(e) =>
                                                updateCommitteeMember(
                                                    member.tempId,
                                                    { phone: e.target.value },
                                                )
                                            }
                                            placeholder="Enter phone number"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            ))}

                            {committeeContent.members.length === 0 && (
                                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                                    No committee members added yet.
                                </div>
                            )}
                        </div>

                        <Button
                            onClick={saveCommitteeSection}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Committee Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AboutPageEditor;
