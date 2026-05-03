import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import client from "@/api/client";
import {
    useSiteSettings,
    useUpdateSiteSettings,
} from "@/hooks/content/useSiteSettings";
import type { SiteSetting } from "@/api/settings";
import { constructImageUrl } from "@/api/imageUrl";
import { useLoader } from "@/contexts/LoaderContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

interface BankDetail {
    id?: number;
    tempId: string;
    account_name: string;
    bank_name: string;
    branch: string;
    account_number: string;
    ifsc_code: string;
    upi_id: string;
    qr_image_id?: number;
    qr_image_url?: string;
    sort_order: number;
}

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

    const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
    const [removedBankDetailIds, setRemovedBankDetailIds] = useState<number[]>(
        [],
    );
    const [savingBankDetails, setSavingBankDetails] = useState(false);

    useEffect(() => {
        const loadBankDetails = async () => {
            try {
                const response = await client.get("/admin/bank-details");
                const data = response.data as Array<any>;
                setBankDetails(
                    data.map((item) => {
                        const qr =
                            item.qr_image || item.qrImage;
                        return {
                            id: item.id,
                            tempId: String(item.id),
                            account_name: item.account_name || "",
                            bank_name: item.bank_name || "",
                            branch: item.branch || "",
                            account_number: item.account_number || "",
                            ifsc_code: item.ifsc_code || "",
                            upi_id: item.upi_id || "",
                            qr_image_id: item.qr_image_id ?? undefined,
                            qr_image_url: qr?.file_url
                                ? constructImageUrl(qr.file_url)
                                : undefined,
                            sort_order: item.sort_order,
                        };
                    }),
                );
            } catch {
                // ignore
            }
        };
        loadBankDetails();
    }, []);

    const updateBankDetail = (
        tempId: string,
        field: keyof BankDetail,
        value: string,
    ) => {
        setBankDetails((prev) =>
            prev.map((b) =>
                b.tempId === tempId ? { ...b, [field]: value } : b,
            ),
        );
    };

    const updateBankDetailField = <K extends keyof BankDetail>(
        tempId: string,
        field: K,
        value: BankDetail[K],
    ) => {
        setBankDetails((prev) =>
            prev.map((b) =>
                b.tempId === tempId ? { ...b, [field]: value } : b,
            ),
        );
    };

    const saveBankDetails = async () => {
        setSavingBankDetails(true);
        try {
            await Promise.all(
                removedBankDetailIds.map((id) =>
                    client.delete(`/admin/bank-details/${id}`),
                ),
            );

            const saved = await Promise.all(
                bankDetails.map((item, index) => {
                    const payload = {
                        account_name: item.account_name,
                        bank_name: item.bank_name,
                        branch: item.branch,
                        account_number: item.account_number,
                        ifsc_code: item.ifsc_code,
                        upi_id: item.upi_id,
                        qr_image_id: item.qr_image_id ?? null,
                        sort_order: index,
                    };
                    if (item.id) {
                        return client.put(
                            `/admin/bank-details/${item.id}`,
                            payload,
                        );
                    }
                    return client.post("/admin/bank-details", payload);
                }),
            );

            setBankDetails(
                saved.map((response, index) => {
                    const item = response.data;
                    const qr = item.qr_image || item.qrImage;
                    return {
                        id: item.id,
                        tempId: String(item.id),
                        account_name: item.account_name || "",
                        bank_name: item.bank_name || "",
                        branch: item.branch || "",
                        account_number: item.account_number || "",
                        ifsc_code: item.ifsc_code || "",
                        upi_id: item.upi_id || "",
                        qr_image_id: item.qr_image_id ?? undefined,
                        qr_image_url: qr?.file_url
                            ? constructImageUrl(qr.file_url)
                            : undefined,
                        sort_order: item.sort_order ?? index,
                    };
                }),
            );
            setRemovedBankDetailIds([]);
            toast.success("Donation details saved");
        } catch {
            toast.error("Failed to save donation details");
        } finally {
            setSavingBankDetails(false);
        }
    };

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
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="en">
                                        English
                                    </TabsTrigger>
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

                <div className="flex gap-3">
                    <Button type="submit" disabled={updateSettings.isPending}>
                        {updateSettings.isPending
                            ? "Saving..."
                            : "Save Settings"}
                    </Button>
                </div>
            </form>

            <Card>
                <CardHeader>
                    <CardTitle>Donation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                            Bank Accounts
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setBankDetails([
                                    {
                                        tempId: `new-${Date.now()}`,
                                        account_name: "",
                                        bank_name: "",
                                        branch: "",
                                        account_number: "",
                                        ifsc_code: "",
                                        upi_id: "",
                                        sort_order: bankDetails.length,
                                    },
                                    ...bankDetails,
                                ])
                            }
                        >
                            + Add Bank Account
                        </Button>
                    </div>

                    {bankDetails.map((item, idx) => (
                        <div
                            key={item.tempId}
                            className="border rounded-lg p-4 bg-muted/30 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">
                                    Account {bankDetails.length - idx}
                                </h4>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        if (item.id) {
                                            setRemovedBankDetailIds([
                                                ...removedBankDetailIds,
                                                item.id,
                                            ]);
                                        }
                                        setBankDetails(
                                            bankDetails.filter(
                                                (b) => b.tempId !== item.tempId,
                                            ),
                                        );
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Account Name</Label>
                                    <Input
                                        placeholder="e.g., Aarya Durga Temple Trust"
                                        value={item.account_name}
                                        onChange={(e) =>
                                            updateBankDetail(
                                                item.tempId,
                                                "account_name",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Bank Name</Label>
                                    <Input
                                        placeholder="e.g., Bank of Maharashtra"
                                        value={item.bank_name}
                                        onChange={(e) =>
                                            updateBankDetail(
                                                item.tempId,
                                                "bank_name",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Branch</Label>
                                    <Input
                                        placeholder="e.g., Kankavli Branch"
                                        value={item.branch}
                                        onChange={(e) =>
                                            updateBankDetail(
                                                item.tempId,
                                                "branch",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>Account Number</Label>
                                    <Input
                                        placeholder="e.g., 12345678901234"
                                        value={item.account_number}
                                        onChange={(e) =>
                                            updateBankDetail(
                                                item.tempId,
                                                "account_number",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>IFSC Code</Label>
                                    <Input
                                        placeholder="e.g., MAHB0001234"
                                        value={item.ifsc_code}
                                        onChange={(e) =>
                                            updateBankDetail(
                                                item.tempId,
                                                "ifsc_code",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label>UPI ID</Label>
                                    <Input
                                        placeholder="e.g., temple@bankname"
                                        value={item.upi_id}
                                        onChange={(e) =>
                                            updateBankDetail(
                                                item.tempId,
                                                "upi_id",
                                                e.target.value,
                                            )
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>UPI / Payment QR Code</Label>
                                <p className="text-xs text-muted-foreground mt-1 mb-2">
                                    Upload a QR image for this account. Shown
                                    on the public donation page.
                                </p>
                                <ImageUpload
                                    onUpload={(mediaId) =>
                                        updateBankDetailField(
                                            item.tempId,
                                            "qr_image_id",
                                            mediaId,
                                        )
                                    }
                                    onRemove={() => {
                                        updateBankDetailField(
                                            item.tempId,
                                            "qr_image_id",
                                            undefined,
                                        );
                                        updateBankDetailField(
                                            item.tempId,
                                            "qr_image_url",
                                            undefined,
                                        );
                                    }}
                                    existingImageUrl={item.qr_image_url}
                                    section="bank-qr"
                                />
                            </div>
                        </div>
                    ))}

                    {bankDetails.length === 0 && (
                        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                            No bank accounts yet. Click "Add Bank Account" to
                            add one.
                        </div>
                    )}

                    <Button
                        onClick={saveBankDetails}
                        disabled={savingBankDetails}
                        className="w-full"
                    >
                        {savingBankDetails
                            ? "Saving..."
                            : "Save Donation Details"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};
