import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import {
    useSiteSettings,
    useUpdateSiteSettings,
} from "@/hooks/content/useSiteSettings";
import type { SiteSetting } from "@/api/settings";
import { constructImageUrl } from "@/api/imageUrl";
import { useLoader } from "@/contexts/LoaderContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

export const SiteSettings = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettings = useUpdateSiteSettings();

    const [formData, setFormData] = useState<Partial<SiteSetting>>({
        site_title: "",
        website_name_en: "",
        website_name_hi: "",
        website_name_mr: "",
        favicon_id: undefined,
        logo_id: undefined,
        bank_account_name: "",
        bank_name: "",
        bank_branch: "",
        bank_account_number: "",
        bank_ifsc: "",
        upi_id: "",
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                site_title: settings.site_title || "",
                website_name_en: settings.website_name_en || "",
                website_name_hi: settings.website_name_hi || "",
                website_name_mr: settings.website_name_mr || "",
                favicon_id: settings.favicon_id,
                logo_id: settings.logo_id,
                bank_account_name: settings.bank_account_name || "",
                bank_name: settings.bank_name || "",
                bank_branch: settings.bank_branch || "",
                bank_account_number: settings.bank_account_number || "",
                bank_ifsc: settings.bank_ifsc || "",
                upi_id: settings.upi_id || "",
            });
        }
    }, [settings]);

    // Construct full favicon and logo URLs
    const faviconUrl = settings?.favicon?.file_url
        ? constructImageUrl(settings.favicon.file_url)
        : undefined;

    const logoUrl = settings?.logo?.file_url
        ? constructImageUrl(settings.logo.file_url)
        : undefined;

    const imagesLoaded = useImagesLoaded([faviconUrl, logoUrl]);

    useEffect(() => {
        if (isLoading || updateSettings.isPending || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [isLoading, updateSettings.isPending, imagesLoaded, setGlobalLoading]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateSettings.mutateAsync(formData);
            toast.success("Site settings saved successfully");
        } catch {
            toast.error("Failed to save settings");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold">
                    Site Settings
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage website title, favicon, and payment details
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* Site Identity Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Site Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="title">Website Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Aarya Durga Temple | Wagde, Kankavli"
                                value={formData.site_title || ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        site_title: e.target.value,
                                    })
                                }
                                className="mt-2"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                This appears in browser tabs and search results
                            </p>
                        </div>

                        <div>
                            <Label>Website Name</Label>
                            <p className="text-xs text-muted-foreground mb-3">
                                This appears next to the logo in headers and
                                auth pages
                            </p>
                            <Tabs defaultValue="en" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="en">
                                        English
                                    </TabsTrigger>
                                    <TabsTrigger value="hi">हिंदी</TabsTrigger>
                                    <TabsTrigger value="mr">मराठी</TabsTrigger>
                                </TabsList>
                                <TabsContent value="en" className="mt-4">
                                    <Input
                                        placeholder="e.g., Aarya Durga Temple"
                                        value={formData.website_name_en || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                website_name_en: e.target.value,
                                            })
                                        }
                                    />
                                </TabsContent>
                                <TabsContent value="hi" className="mt-4">
                                    <Input
                                        placeholder="e.g., आर्य दुर्गा मंदिर"
                                        value={formData.website_name_hi || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                website_name_hi: e.target.value,
                                            })
                                        }
                                    />
                                </TabsContent>
                                <TabsContent value="mr" className="mt-4">
                                    <Input
                                        placeholder="e.g., आर्य दुर्गा मंदिर"
                                        value={formData.website_name_mr || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                website_name_mr: e.target.value,
                                            })
                                        }
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">
                                Favicon
                            </h3>
                            <ImageUpload
                                onUpload={(mediaId) =>
                                    setFormData({
                                        ...formData,
                                        favicon_id: mediaId,
                                    })
                                }
                                existingImageUrl={faviconUrl}
                                section="favicon"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Browser tab icon
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4 text-foreground">
                                Logo
                            </h3>
                            <ImageUpload
                                onUpload={(mediaId) =>
                                    setFormData({
                                        ...formData,
                                        logo_id: mediaId,
                                    })
                                }
                                existingImageUrl={logoUrl}
                                section="logo"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Website logo for header/branding
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Bank Details Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bank Details for Donations</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="accountName">
                                    Account Name
                                </Label>
                                <Input
                                    id="accountName"
                                    placeholder="e.g., Aarya Durga Temple Trust"
                                    value={formData.bank_account_name || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bank_account_name: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input
                                    id="bankName"
                                    placeholder="e.g., Bank of Maharashtra"
                                    value={formData.bank_name || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bank_name: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="branch">Branch</Label>
                                <Input
                                    id="branch"
                                    placeholder="e.g., Kankavli Branch"
                                    value={formData.bank_branch || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bank_branch: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="accountNumber">
                                    Account Number
                                </Label>
                                <Input
                                    id="accountNumber"
                                    placeholder="e.g., 12345678901234"
                                    value={formData.bank_account_number || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bank_account_number: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="ifsc">IFSC Code</Label>
                                <Input
                                    id="ifsc"
                                    placeholder="e.g., MAHB0001234"
                                    value={formData.bank_ifsc || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            bank_ifsc: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <Label htmlFor="upi">UPI ID</Label>
                                <Input
                                    id="upi"
                                    placeholder="e.g., temple@bankname"
                                    value={formData.upi_id || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            upi_id: e.target.value,
                                        })
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-3">
                    <Button type="submit" disabled={updateSettings.isPending}>
                        {updateSettings.isPending
                            ? "Saving..."
                            : "Save Settings"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
