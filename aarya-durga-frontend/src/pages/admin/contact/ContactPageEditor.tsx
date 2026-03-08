import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Plus, Edit2 } from "lucide-react";
import client from "@/api/client";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useLoader } from "@/contexts/LoaderContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import { constructImageUrl } from "@/api/imageUrl";
import {
    useContactSubjects,
    useCreateContactSubject,
    useUpdateContactSubject,
    useDeleteContactSubject,
} from "@/hooks/content/useContactSubjects";
import type { ContactSubject } from "@/api/contactSubjects";

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

interface HowToReachItem {
    mode: string;
    title_en: string;
    title_hi: string;
    title_mr: string;
    description_en: string;
    description_hi: string;
    description_mr: string;
}

const ContactPageEditor = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const [activeSection, setActiveSection] = useState<
        "hero" | "how-to-reach" | "subjects"
    >("hero");

    const [heroContent, setHeroContent] = useState<HeroContent>({
        title_en: "",
        title_hi: "",
        title_mr: "",
        subtitle_en: "",
        subtitle_hi: "",
        subtitle_mr: "",
    });

    const [howToReachItems, setHowToReachItems] = useState<HowToReachItem[]>(
        [],
    );

    // Contact Subjects state
    const { data: subjects = [], isLoading: subjectsLoading } =
        useContactSubjects();
    const createMutation = useCreateContactSubject();
    const updateMutation = useUpdateContactSubject();
    const deleteMutation = useDeleteContactSubject();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        label_en: "",
        label_hi: "",
        label_mr: "",
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const imagesLoaded = useImagesLoaded([heroContent.existingImageUrl]);

    const sections = [
        {
            key: "hero",
            label: "Hero Section",
            description: "Title, subtitle, background image",
        },
        {
            key: "how-to-reach",
            label: "How to Reach",
            description: "Travel modes and directions",
        },
        {
            key: "subjects",
            label: "Contact Subjects",
            description: "Manage form subject dropdown options",
        },
    ] as const;

    useEffect(() => {
        fetchContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (loading || subjectsLoading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, subjectsLoading, imagesLoaded, setGlobalLoading]);

    const fetchContent = async () => {
        setLoading(true);
        setGlobalLoading(true);
        try {
            const response = await client.get("/public/page-content/contact");
            const data = response.data;

            const findContent = (key: string) =>
                data.find((item: any) => item.section_key === key);
            const getImage = (key: string) => {
                const item = findContent(key);
                if (item?.image?.file_url) {
                    return constructImageUrl(item.image.file_url);
                }
                return undefined;
            };

            // Hero content
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

            // How to reach items - dynamically detect all travel modes
            const modes = new Set<string>();
            data.forEach((item: { section_key: string }) => {
                const match = item.section_key.match(/^how_to_reach_(\w+)_/);
                if (match) {
                    modes.add(match[1]);
                }
            });

            const sortedModes = Array.from(modes).sort();
            const reachItems = sortedModes.map((mode) => ({
                mode,
                title_en:
                    findContent(`how_to_reach_${mode}_title`)?.content_en || "",
                title_hi:
                    findContent(`how_to_reach_${mode}_title`)?.content_hi || "",
                title_mr:
                    findContent(`how_to_reach_${mode}_title`)?.content_mr || "",
                description_en:
                    findContent(`how_to_reach_${mode}_description`)
                        ?.content_en || "",
                description_hi:
                    findContent(`how_to_reach_${mode}_description`)
                        ?.content_hi || "",
                description_mr:
                    findContent(`how_to_reach_${mode}_description`)
                        ?.content_mr || "",
            }));

            setHowToReachItems(reachItems);
        } catch (error) {
            toast.error("Failed to load content");
        } finally {
            setLoading(false);
        }
    };

    const saveHeroSection = async () => {
        setSaving(true);
        try {
            await Promise.all([
                client.post("/admin/page-content", {
                    page_key: "contact",
                    section_key: "hero_title",
                    content_en: heroContent.title_en,
                    content_hi: heroContent.title_hi,
                    content_mr: heroContent.title_mr,
                }),
                client.post("/admin/page-content", {
                    page_key: "contact",
                    section_key: "hero_subtitle",
                    content_en: heroContent.subtitle_en,
                    content_hi: heroContent.subtitle_hi,
                    content_mr: heroContent.subtitle_mr,
                }),
                heroContent.image_id
                    ? client.post("/admin/page-content", {
                          page_key: "contact",
                          section_key: "hero_image",
                          image_id: heroContent.image_id,
                      })
                    : Promise.resolve(),
            ]);
            toast.success("Hero section saved successfully");
        } catch (error) {
            toast.error("Failed to save content");
        } finally {
            setSaving(false);
        }
    };

    const saveHowToReachSection = async () => {
        setSaving(true);
        try {
            const requests = howToReachItems.flatMap((item) => [
                client.post("/admin/page-content", {
                    page_key: "contact",
                    section_key: `how_to_reach_${item.mode}_title`,
                    content_en: item.title_en,
                    content_hi: item.title_hi,
                    content_mr: item.title_mr,
                }),
                client.post("/admin/page-content", {
                    page_key: "contact",
                    section_key: `how_to_reach_${item.mode}_description`,
                    content_en: item.description_en,
                    content_hi: item.description_hi,
                    content_mr: item.description_mr,
                }),
            ]);
            await Promise.all(requests);
            toast.success("How to reach section saved successfully");
        } catch (error) {
            toast.error("Failed to save content");
        } finally {
            setSaving(false);
        }
    };

    const addHowToReachItem = () => {
        setHowToReachItems([
            ...howToReachItems,
            {
                mode: "",
                title_en: "",
                title_hi: "",
                title_mr: "",
                description_en: "",
                description_hi: "",
                description_mr: "",
            },
        ]);
    };

    const removeHowToReachItem = (index: number) => {
        setHowToReachItems(howToReachItems.filter((_, i) => i !== index));
    };

    // Contact Subjects handlers
    const handleOpenDialog = (subject?: ContactSubject) => {
        if (subject) {
            setEditingId(subject.id);
            setFormData({
                label_en: subject.label_en,
                label_hi: subject.label_hi,
                label_mr: subject.label_mr,
            });
        } else {
            setEditingId(null);
            setFormData({ label_en: "", label_hi: "", label_mr: "" });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (
            !formData.label_en.trim() ||
            !formData.label_hi.trim() ||
            !formData.label_mr.trim()
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            if (editingId) {
                await updateMutation.mutateAsync({
                    id: editingId,
                    data: formData,
                });
                toast.success("Subject updated successfully");
            } else {
                await createMutation.mutateAsync(formData);
                toast.success("Subject added successfully");
            }
            setIsDialogOpen(false);
            setFormData({ label_en: "", label_hi: "", label_mr: "" });
        } catch {
            toast.error(
                editingId
                    ? "Failed to update subject"
                    : "Failed to add subject",
            );
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId);
            toast.success("Subject deleted successfully");
            setDeleteId(null);
        } catch {
            toast.error("Failed to delete subject");
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
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-2 mt-4">
                    {isTextarea ? (
                        <Textarea
                            value={en}
                            onChange={(e) => onChange("en", e.target.value)}
                            placeholder={`Enter ${label} in English`}
                            disabled={loading}
                            rows={3}
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
                        <Textarea
                            value={hi}
                            onChange={(e) => onChange("hi", e.target.value)}
                            placeholder={`हिंदी में ${label} दर्ज करें`}
                            disabled={loading}
                            rows={3}
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
                        <Textarea
                            value={mr}
                            onChange={(e) => onChange("mr", e.target.value)}
                            placeholder={`मराठीत ${label} प्रविष्ट करा`}
                            disabled={loading}
                            rows={3}
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

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                    Contact Page Editor
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage Contact page content in multiple languages
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                section="contact-hero"
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
                            onClick={saveHeroSection}
                            disabled={saving}
                            className="w-full"
                        >
                            {saving ? "Saving..." : "Save Hero Section"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* How to Reach Section */}
            {activeSection === "how-to-reach" && (
                <Card>
                    <CardHeader>
                        <CardTitle>How to Reach Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {howToReachItems.map((item, index) => (
                            <div
                                key={index}
                                className="border border-border rounded-lg p-6 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-foreground">
                                        Travel Mode {index + 1}
                                    </h3>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                            removeHowToReachItem(index)
                                        }
                                        disabled={loading}
                                    >
                                        <Trash2 size={16} className="mr-1" />
                                        Remove
                                    </Button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Mode (road, train, air)
                                    </label>
                                    <Input
                                        value={item.mode}
                                        onChange={(e) => {
                                            const newItems = [
                                                ...howToReachItems,
                                            ];
                                            newItems[index].mode =
                                                e.target.value;
                                            setHowToReachItems(newItems);
                                        }}
                                        placeholder="e.g., road, train, air"
                                        disabled={loading}
                                    />
                                </div>

                                {renderLanguageTabs(
                                    "Title",
                                    item.title_en,
                                    item.title_hi,
                                    item.title_mr,
                                    (lang, value) => {
                                        const newItems = [...howToReachItems];
                                        newItems[index][`title_${lang}`] =
                                            value;
                                        setHowToReachItems(newItems);
                                    },
                                )}

                                {renderLanguageTabs(
                                    "Description",
                                    item.description_en,
                                    item.description_hi,
                                    item.description_mr,
                                    (lang, value) => {
                                        const newItems = [...howToReachItems];
                                        newItems[index][`description_${lang}`] =
                                            value;
                                        setHowToReachItems(newItems);
                                    },
                                    true,
                                )}
                            </div>
                        ))}

                        <Button
                            onClick={addHowToReachItem}
                            disabled={loading}
                            variant="outline"
                            className="w-full"
                        >
                            <Plus size={16} className="mr-1" />
                            Add Travel Mode
                        </Button>

                        {howToReachItems.length > 0 && (
                            <Button
                                onClick={saveHowToReachSection}
                                disabled={saving}
                                className="w-full"
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save How to Reach Section"}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Contact Subjects Section */}
            {activeSection === "subjects" && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Contact Form Subjects</CardTitle>
                        <Button
                            onClick={() => handleOpenDialog()}
                            className="gap-2"
                        >
                            <Plus size={18} /> Add Subject
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted">
                                        <TableHead>English</TableHead>
                                        <TableHead>हिंदी</TableHead>
                                        <TableHead>मराठी</TableHead>
                                        <TableHead className="w-32">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {subjects.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                No subjects found. Add one to
                                                get started!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        subjects.map((subject) => (
                                            <TableRow
                                                key={subject.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <TableCell className="font-medium">
                                                    {subject.label_en}
                                                </TableCell>
                                                <TableCell>
                                                    {subject.label_hi}
                                                </TableCell>
                                                <TableCell>
                                                    {subject.label_mr}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                handleOpenDialog(
                                                                    subject,
                                                                )
                                                            }
                                                        >
                                                            <Edit2 size={16} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    subject.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? "Edit Subject" : "Add New Subject"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingId
                                ? "Update the subject in all languages"
                                : "Create a new contact form subject category"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="label_en">English Label *</Label>
                            <Input
                                id="label_en"
                                placeholder="e.g., General Inquiry"
                                value={formData.label_en}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        label_en: e.target.value,
                                    })
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="label_hi">हिंदी Label *</Label>
                            <Input
                                id="label_hi"
                                placeholder="e.g., सामान्य प्रश्न"
                                value={formData.label_hi}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        label_hi: e.target.value,
                                    })
                                }
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <Label htmlFor="label_mr">मराठी Label *</Label>
                            <Input
                                id="label_mr"
                                placeholder="e.g., सामान्य प्रश्न"
                                value={formData.label_mr}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        label_mr: e.target.value,
                                    })
                                }
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={handleSave}
                            disabled={
                                createMutation.isPending ||
                                updateMutation.isPending
                            }
                        >
                            {editingId ? "Update Subject" : "Add Subject"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this subject? This
                        action cannot be undone.
                    </AlertDialogDescription>
                    <div className="flex gap-3 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteMutation.isPending}
                        >
                            Delete
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ContactPageEditor;
