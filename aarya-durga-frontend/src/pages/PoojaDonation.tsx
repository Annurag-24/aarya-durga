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
import Navbar from "@/components/temple/Navbar";
import Footer from "@/components/temple/Footer";
import BankDetailsModal from "@/components/temple/BankDetailsModal";
import { useLanguage } from "@/i18n/LanguageContext";
import { useLoader } from "@/contexts/LoaderContext";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

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
    const [bannerQuote, setBannerQuote] = useState("");
    const [bannerImage, setBannerImage] = useState("");
    const imagesLoaded = useImagesLoaded([heroImage, bannerImage]);

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

            // Fetch schedule - Dynamically detect all schedule items
            const scheduleNumbers = new Set<number>();
            pageData.forEach((item: { section_key: string }) => {
                const match = item.section_key.match(/^schedule_(\d+)_/);
                if (match) {
                    scheduleNumbers.add(parseInt(match[1], 10));
                }
            });

            const sortedScheduleNumbers = Array.from(scheduleNumbers).sort(
                (a, b) => a - b,
            );
            const scheduleFromAPI = sortedScheduleNumbers
                .map((num) => ({
                    time: getContentEn(`schedule_${num}_time`),
                    event: getContent(`schedule_${num}_description`),
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

            setPoojas(services);

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

            // Banner - Fetch quote and image
            setBannerQuote(getContent("banner_quote"));
            setBannerImage(getImg("banner_image"));
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
                <section className="relative pt-16 min-h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt="Pooja"
                            className="w-full h-full object-cover"
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
                        <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
                            {heroSubtitle}
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <div className="gold-line mx-auto mb-4" />
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                                {servicesTitle}
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto mt-4">
                                {servicesSubtitle}
                            </p>
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
                                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                                        {pooja.desc}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-heading text-lg font-bold text-primary">
                                            {pooja.price}
                                        </span>
                                        <Button
                                            variant="temple"
                                            size="sm"
                                            onClick={() => {
                                                setModalType("pooja");
                                                setBankModalOpen(true);
                                            }}
                                        >
                                            {t.poojaPage.bookPooja}
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {schedule.length > 0 && (
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
                                                <p className="text-foreground font-medium text-base">
                                                    {item.event}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {donations.length > 0 && (
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
                                                <p className="text-muted-foreground text-sm mb-4">
                                                    {item.desc}
                                                </p>
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

                {bannerImage && (
                    <section className="relative py-24 overflow-hidden">
                        <div className="absolute inset-0">
                            <img
                                src={bannerImage}
                                alt="Goddess Durga"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/80" />
                        </div>
                        <div className="relative z-10 text-center px-4">
                            <div className="lotus-divider mb-6">
                                <span className="text-3xl">🪷</span>
                            </div>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="font-heading text-2xl md:text-4xl font-semibold text-primary-foreground max-w-3xl mx-auto italic leading-relaxed"
                            >
                                "{bannerQuote}"
                            </motion.p>
                            <div className="lotus-divider mt-6">
                                <span className="text-3xl">🪷</span>
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
