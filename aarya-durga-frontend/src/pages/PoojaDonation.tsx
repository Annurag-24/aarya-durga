import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Flame,
    Heart,
    Gift,
    Clock,
    Calendar,
    Star,
    Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import BankDetailsModal from "@/components/temple/BankDetailsModal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import client from "@/api/client";
import { constructImageUrl } from "@/api/imageUrl";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { RichTextContent } from "@/components/global/RichTextContent";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

const parseStoredKeys = (
    rawValue: string | undefined,
    legacyPrefix: string,
    data: Array<{ section_key: string }>,
) => {
    if (rawValue) {
        try {
            const parsed = JSON.parse(rawValue);
            if (Array.isArray(parsed)) {
                return parsed.filter(
                    (value): value is string => typeof value === "string",
                );
            }
        } catch {
            // Fall back to legacy detection.
        }
    }

    const legacyNumbers = new Set<number>();
    data.forEach((item) => {
        const match = item.section_key.match(
            new RegExp(`^${legacyPrefix}_(\\d+)_`),
        );
        if (match) {
            legacyNumbers.add(parseInt(match[1], 10));
        }
    });

    return Array.from(legacyNumbers)
        .sort((a, b) => a - b)
        .map((number) => `${legacyPrefix}_${number}`);
};

const PoojaDonation = () => {
    const { t, language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [loading, setLoading] = useState(true);
    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"pooja" | "donation" | null>(
        null,
    );
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");
    const [heroImage, setHeroImage] = useState("");
    const [servicesTitle, setServicesTitle] = useState("");
    const [servicesSubtitle, setServicesSubtitle] = useState("");
    const [poojas, setPoojas] = useState<
        Array<{
            icon: any;
            title: string;
            time: string;
            desc: string;
            price: string;
        }>
    >([]);
    const [schedule, setSchedule] = useState<
        Array<{ time: string; event: string }>
    >([]);
    const [donationsData, setDonationsData] = useState<
        Array<{ icon: any; title: string; desc: string; suggested: string }>
    >([]);
    const [bankDetails, setBankDetails] = useState<
        Array<{
            id: number;
            account_name: string;
            bank_name: string;
            branch: string;
            account_number: string;
            ifsc_code: string;
            upi_id?: string;
            qr_image?: { file_url?: string };
            qrImage?: { file_url?: string };
        }>
    >([]);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        client
            .get("/public/bank-details")
            .then((response) => setBankDetails(response.data as typeof bankDetails))
            .catch(() => setBankDetails([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCopy = (value: string, field: string) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };
    const imagesLoaded = useImagesLoaded([heroImage]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        fetchHeroContent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    const fetchHeroContent = async () => {
        setLoading(true);
        try {
            const pageData = await fetchPageContent("pooja_donation");
            const lang = language as "en" | "hi" | "mr";

            const getContent = (key: string) =>
                getContentByLanguage(findContentItem(pageData, key), lang);
            const getImg = (key: string) =>
                getImageUrl(findContentItem(pageData, key));
            const getContentEn = (key: string) =>
                getContentByLanguage(findContentItem(pageData, key), "en");

            setHeroTitle(getContent("hero_title"));
            setHeroSubtitle(getContent("hero_subtitle"));
            setHeroImage(getImg("hero_image"));

            // Fetch services & schedule
            setServicesTitle(getContent("services_title"));
            setServicesSubtitle(getContent("services_subtitle"));

            const scheduleKeys = parseStoredKeys(
                findContentItem(pageData, "schedule_keys")?.content_en,
                "schedule",
                pageData,
            );
            const scheduleFromAPI = scheduleKeys
                .map((scheduleKey) => ({
                    time: getContentEn(`${scheduleKey}_time`),
                    event: getContent(`${scheduleKey}_description`),
                }))
                .filter((s) => s.time && s.event);

            setSchedule(scheduleFromAPI);

            // Donations - Dynamically detect all donation items
            const donationNumbers = new Set<number>();
            pageData.forEach((item: { section_key: string }) => {
                const match = item.section_key.match(/^donation_(\d+)_/);
                if (match) {
                    donationNumbers.add(parseInt(match[1], 10));
                }
            });

            const iconNameMap: { [key: string]: any } = {
                flame: Flame,
                star: Star,
                sparkles: Sparkles,
                calendar: Calendar,
                gift: Gift,
                heart: Heart,
            };

            // Dynamically detect all services from API response
            const serviceNumbers = new Set<number>();
            pageData.forEach((item: { section_key: string }) => {
                const match = item.section_key.match(/^service_(\d+)_/);
                if (match) {
                    serviceNumbers.add(parseInt(match[1], 10));
                }
            });

            const sortedServiceNumbers = Array.from(serviceNumbers).sort(
                (a, b) => a - b,
            );
            const services = sortedServiceNumbers
                .map((num) => {
                    const serviceKey = `service_${num}`;
                    const name = getContent(`${serviceKey}_name`);
                    const time = getContent(`${serviceKey}_time`);
                    const desc = getContent(`${serviceKey}_description`);
                    const amountType = getContentEn(
                        `${serviceKey}_amount_type`,
                    );
                    const amount = getContentEn(`${serviceKey}_amount`);
                    const iconName = getContentEn(`${serviceKey}_icon`);
                    const price =
                        amountType === "free" ? t.poojaPage.free : `₹${amount}`;

                    return {
                        icon: iconNameMap[iconName] || Flame,
                        title: name,
                        time,
                        desc,
                        price,
                    };
                })
                .filter((s) => s.title);

            setPoojas(services.slice().reverse());

            // Process donations
            const sortedDonationNumbers = Array.from(donationNumbers).sort(
                (a, b) => a - b,
            );
            const donationsFromAPI = sortedDonationNumbers
                .map((num) => {
                    const name = getContent(`donation_${num}_name`);
                    const desc = getContent(`donation_${num}_description`);
                    const suggestedAmount = getContentEn(
                        `donation_${num}_suggested_amount`,
                    );
                    const iconName = getContentEn(`donation_${num}_icon`);
                    const suggested = suggestedAmount
                        ? `₹${suggestedAmount}`
                        : "";

                    return {
                        icon: iconNameMap[iconName] || Gift,
                        title: name,
                        desc,
                        suggested,
                    };
                })
                .filter((d) => d.title);

            setDonationsData(donationsFromAPI);
        } catch (error) {
            // Error fetching pooja & donation content
        } finally {
            setLoading(false);
        }
    };

    const donations = donationsData;

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />
                <section className="relative pt-16 h-[300px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt="Pooja"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
                    </div>
                    <div className="relative z-10 text-center px-4 py-20">
                        <div className="lotus-divider mb-4">
                            <span className="text-3xl">🪷</span>
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4"
                        >
                            {heroTitle}
                        </motion.h1>
                        <RichTextContent
                            content={heroSubtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="gold-line mx-auto mb-4" />
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                {servicesTitle}
                            </h2>
                            <RichTextContent
                                content={servicesSubtitle}
                                className="mx-auto mt-4 max-w-xl text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {poojas.map((pooja, i) => (
                                <motion.div
                                    key={pooja.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.08,
                                    }}
                                    className="bg-accent rounded-lg p-6 shadow-md border border-border hover:shadow-lg transition-shadow flex flex-col"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <pooja.icon
                                                className="text-primary"
                                                size={24}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-lg font-semibold text-foreground">
                                                {pooja.title}
                                            </h3>
                                            <p className="flex items-center gap-1 text-xs text-secondary">
                                                <Clock size={12} /> {pooja.time}
                                            </p>
                                        </div>
                                    </div>
                                    <RichTextContent
                                        content={pooja.desc}
                                        className="mb-4 flex-1 text-sm text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="font-body text-3xl font-bold text-primary">
                                            {(() => {
                                                const raw = (pooja.price ?? "").toString().trim();
                                                if (!raw) return raw;
                                                const match = raw.match(/^(\D*)(-?\d+(?:\.\d+)?)(.*)$/);
                                                if (!match) return raw;
                                                const [, prefix, num, suffix] = match;
                                                const formatted = Number(num).toFixed(2);
                                                return `${prefix}${formatted}${suffix}`;
                                            })()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {false && schedule.length > 0 && (
                    <section className="py-20 bg-accent mandala-bg">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    Daily Schedule
                                </h2>
                            </div>
                            <div className="max-w-3xl mx-auto space-y-0">
                                {schedule.map((item, i) => (
                                    <motion.div
                                        key={item.time}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="border-b border-border/50 last:border-0 py-5"
                                    >
                                        <div className="flex items-start gap-6 text-left">
                                            <div className="w-32 shrink-0">
                                                <span className="font-heading text-lg font-bold text-primary flex items-center gap-2">
                                                    <Clock
                                                        size={16}
                                                        className="shrink-0"
                                                    />
                                                    {item.time}
                                                </span>
                                            </div>
                                            <div className="flex-1 text-left">
                                                <RichTextContent
                                                    content={item.event}
                                                    className="text-base font-medium text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {bankDetails.length > 0 && (
                    <section className="pt-8 pb-20 bg-card">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    Donation Details
                                </h2>
                                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                                    Please use these details for your donation or temple offering
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {bankDetails.map((account, accountIdx) => (
                                    <motion.div
                                        key={account.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="bg-accent rounded-lg p-6 shadow-md border border-border space-y-3"
                                    >
                                        {bankDetails.length > 1 && (
                                            <p className="font-heading text-lg font-semibold text-foreground">
                                                Account {accountIdx + 1}
                                            </p>
                                        )}
                                        {[
                                            account.account_name && {
                                                label: "Account Name",
                                                value: account.account_name,
                                                field: `accountName-${account.id}`,
                                            },
                                            (account.bank_name || account.branch) && {
                                                label: "Bank",
                                                value: [account.bank_name, account.branch]
                                                    .filter(Boolean)
                                                    .join(", "),
                                                field: `bankName-${account.id}`,
                                            },
                                            account.account_number && {
                                                label: "Account Number",
                                                value: account.account_number,
                                                field: `accountNumber-${account.id}`,
                                            },
                                            account.ifsc_code && {
                                                label: "IFSC Code",
                                                value: account.ifsc_code,
                                                field: `ifscCode-${account.id}`,
                                            },
                                            account.upi_id && {
                                                label: "UPI ID",
                                                value: account.upi_id,
                                                field: `upiId-${account.id}`,
                                            },
                                        ]
                                            .filter(Boolean)
                                            .map((row: any) => (
                                                <div
                                                    key={row.field}
                                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                                >
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-0.5">
                                                            {row.label}
                                                        </p>
                                                        <p className="font-mono text-sm text-foreground font-semibold break-all">
                                                            {row.value}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleCopy(row.value, row.field)}
                                                        className="ml-4 p-2 rounded-lg hover:bg-primary/10 transition-colors shrink-0"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copiedField === row.field ? (
                                                            <Check className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <Copy className="w-5 h-5 text-primary" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        {(() => {
                                            const qr =
                                                account.qr_image ||
                                                account.qrImage;
                                            return qr?.file_url ? (
                                                <div className="mt-2 flex flex-col items-center gap-2 rounded-lg border border-border p-3 bg-muted/20">
                                                    <p className="text-xs text-muted-foreground">
                                                        Scan to pay
                                                    </p>
                                                    <img
                                                        src={constructImageUrl(
                                                            qr.file_url,
                                                        )}
                                                        alt="Payment QR"
                                                        className="h-48 w-48 object-contain bg-white rounded"
                                                    />
                                                </div>
                                            ) : null;
                                        })()}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {false && donations.length > 0 && (
                    <section className="py-20 bg-card">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <div className="gold-line mx-auto mb-4" />
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                    Donations
                                </h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                {donations.map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: i * 0.1,
                                        }}
                                        className="bg-accent rounded-lg p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <item.icon
                                                    className="text-primary"
                                                    size={28}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                                                    {item.title}
                                                </h3>
                                                <RichTextContent
                                                    content={item.desc}
                                                    className="mb-4 text-sm text-muted-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-em:text-muted-foreground"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-secondary font-medium">
                                                        {t.poojaPage.suggested}:{" "}
                                                        {item.suggested}
                                                    </span>
                                                    <Button
                                                        variant="gold"
                                                        size="sm"
                                                        onClick={() => {
                                                            setModalType(
                                                                "donation",
                                                            );
                                                            setBankModalOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        {t.poojaPage.donateNow}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <BankDetailsModal
                    open={bankModalOpen}
                    onOpenChange={setBankModalOpen}
                    type={modalType}
                />

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default PoojaDonation;
