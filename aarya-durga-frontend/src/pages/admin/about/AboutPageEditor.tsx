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
    name_en: string;
    name_hi: string;
    name_mr: string;
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

    const imagesLoaded = useImagesLoaded([]);

    useEffect(() => {
        if (!loading && imagesLoaded) {
            setGlobalLoading(false);
        }
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        loadAboutContent();
    }, []);

    const loadAboutContent = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const aboutResponse = await client.get(`/public/page-content/about`);
            const aboutData = aboutResponse.data as Array<{
                section_key: string;
                content_en?: string;
                content_hi?: string;
                content_mr?: string;
                image_id?: number;
                image?: { file_url: string };
            }>;

            const committeeMembersResponse = await client.get(
                "/admin/committee-members",
            );
            const committeeMembersData =
                committeeMembersResponse.data as Array<{
                    id: number;
                    name_en?: string;
                    name_hi?: string;
                    name_mr?: string;
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
                    name_en: member.name_en || "",
                    name_hi: member.name_hi || "",
                    name_mr: member.name_mr || "",
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
                    name_en: "",
                    name_hi: "",
                    name_mr: "",
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
                        name_en: member.name_en,
                        name_hi: member.name_hi || member.name_en,
                        name_mr: member.name_mr || member.name_en,
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
                    name_en: response.data.name_en || "",
                    name_hi: response.data.name_hi || "",
                    name_mr: response.data.name_mr || "",
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
                    Management
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage committee title, description, and members in multiple languages
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Committee</CardTitle>
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

                                    {renderLanguageTabs(
                                        "Name",
                                        member.name_en,
                                        member.name_hi,
                                        member.name_mr,
                                        (lang, val) => {
                                            updateCommitteeMember(
                                                member.tempId,
                                                {
                                                    [`name_${lang}`]: val,
                                                } as Partial<CommitteeMemberForm>,
                                            );
                                        },
                                    )}

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
        </div>
    );
};

export default AboutPageEditor;
