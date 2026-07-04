import { motion } from "framer-motion";
import { Users, MapPin, Phone, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/temple/Navbar";
import AboutSection from "@/components/temple/AboutSection";
import Footer from "@/components/temple/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import {
    fetchPageContent,
    findContentItem,
    getContentByLanguage,
    getImageUrl,
} from "@/api/helpers";
import { useLoader } from "@/contexts/LoaderContext";
import { HomePageProvider } from "@/contexts/HomePageContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";
import { RichTextContent } from "@/components/global/RichTextContent";
import { constructImageUrl } from "@/api/imageUrl";
import client from "@/api/client";

interface CommitteeMember {
    id: number;
    name_en: string;
    name_hi?: string;
    name_mr?: string;
    role_en?: string;
    role_hi?: string;
    role_mr?: string;
    address_en?: string;
    address_hi?: string;
    address_mr?: string;
    phone?: string;
    photo?: {
        file_url?: string;
        url?: string;
    };
}

const About = () => {
    const { language } = useLanguage();
    const { setLoading: setGlobalLoading } = useLoader();
    const [heroMainTitle, setHeroMainTitle] = useState<string>("");
    const [heroMainSubtitle, setHeroMainSubtitle] = useState<string>("");
    const [heroImage, setHeroImage] = useState<string>("");
    const [committeeTitle, setCommitteeTitle] = useState<string>("");
    const [committeeDesc, setCommitteeDesc] = useState<string>("");
    const [selectedAddress, setSelectedAddress] = useState<{
        name: string;
        address: string;
    } | null>(null);
    const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(
        [],
    );
    const [loading, setLoading] = useState(true);
    const memberImageUrls = useMemo(
        () =>
            committeeMembers.map((member) =>
                member.photo?.file_url
                    ? constructImageUrl(member.photo.file_url)
                    : member.photo?.url
                      ? constructImageUrl(member.photo.url)
                      : "",
            ),
        [committeeMembers],
    );
    const imagesLoaded = useImagesLoaded([
        heroImage,
        JSON.stringify(memberImageUrls),
    ]);

    useEffect(() => {
        if (loading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [loading, imagesLoaded, setGlobalLoading]);

    useEffect(() => {
        const fetchAboutContent = async () => {
            setLoading(true);
            try {
                const [aboutData, homeData, committeeMembersResponse] =
                    await Promise.all([
                        fetchPageContent("about"),
                        fetchPageContent("home"),
                        client.get("/public/committee-members"),
                    ]);
                const lang = language as "en" | "hi" | "mr";

                const getContent = (arr: any[], key: string) =>
                    getContentByLanguage(findContentItem(arr, key), lang);
                const getImg = (arr: any[], key: string) =>
                    getImageUrl(findContentItem(arr, key));

                // Hero overlay content comes from the about page
                setHeroMainTitle(getContent(aboutData, "hero_main_title"));
                setHeroMainSubtitle(
                    getContent(aboutData, "hero_main_subtitle"),
                );
                setHeroImage(
                    getImg(aboutData, "hero_image") ||
                        getImg(homeData, "about_image"),
                );

                // Committee section
                setCommitteeTitle(getContent(aboutData, "committee_title"));
                setCommitteeDesc(
                    getContent(aboutData, "committee_description"),
                );
                setCommitteeMembers((committeeMembersResponse.data || []).slice().reverse());
            } catch (error) {
                console.error("Error fetching about content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAboutContent();
    }, [language, setGlobalLoading]);

    return (
        <HomePageProvider>
            <div className="min-h-screen">
                <Navbar />
                <section className="relative pt-16 h-[300px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroImage}
                            alt="Temple"
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
                            {heroMainTitle}
                        </motion.h1>
                        <RichTextContent
                            content={heroMainSubtitle}
                            className="mx-auto max-w-2xl text-lg text-primary-foreground/80 prose-p:text-primary-foreground/80 prose-strong:text-primary-foreground prose-em:text-primary-foreground/90"
                        />
                    </div>
                </section>

                <AboutSection showReadMore={false} showDailyImage={false} scrollableText />

                <section className="py-20 bg-accent">
                    <div className="container mx-auto px-4 text-center">
                        <div className="gold-line mx-auto mb-4" />
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                            {committeeTitle}
                        </h2>
                        <RichTextContent
                            content={committeeDesc}
                            className="mx-auto mb-10 max-w-2xl text-muted-foreground"
                        />
                        {committeeMembers.length === 0 ? (
                            <p className="mx-auto max-w-2xl text-muted-foreground">
                                Committee member details will be updated soon.
                            </p>
                        ) : (
                            <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2 xl:grid-cols-3 items-stretch">
                                {committeeMembers.map((member, i) => {
                                    const memberName =
                                        language === "mr"
                                            ? member.name_mr || member.name_en
                                            : language === "hi"
                                              ? member.name_hi || member.name_en
                                              : member.name_en;
                                    const designation =
                                        language === "mr"
                                            ? member.role_mr
                                            : language === "hi"
                                              ? member.role_hi
                                              : member.role_en;
                                    const address =
                                        language === "mr"
                                            ? member.address_mr
                                            : language === "hi"
                                              ? member.address_hi
                                              : member.address_en;
                                    const imageUrl = member.photo?.file_url
                                        ? constructImageUrl(
                                              member.photo.file_url,
                                          )
                                        : member.photo?.url
                                          ? constructImageUrl(member.photo.url)
                                          : "";
                                    const mapUrl = address
                                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
                                        : undefined;

                                    return (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex flex-col items-center rounded-[2rem] border border-border/80 bg-card px-6 py-8 shadow-sm"
                                        >
                                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-accent shadow-md">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={memberName}
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <Users
                                                        className="text-primary"
                                                        size={32}
                                                    />
                                                )}
                                            </div>
                                            <h3 className="font-heading text-xl font-bold text-foreground text-center">
                                                {memberName}
                                            </h3>
                                            <div className="mt-auto pt-4 w-full">
                                                <p className="font-heading text-2xl font-semibold text-primary text-center">
                                                    {designation}
                                                </p>
                                                <p
                                                    className="mt-2 w-full truncate font-body text-sm text-muted-foreground text-center"
                                                    title={address}
                                                >
                                                    {address}
                                                </p>
                                                <div className="mt-4 w-full">
                                                    <div className="mb-4 h-px w-full bg-border" />
                                                    <div className="flex flex-col gap-3 w-full">
                                                        {member.phone && (
                                                            <a
                                                                href={`tel:${member.phone.startsWith('+91') ? member.phone : '+91' + member.phone}`}
                                                                className="flex items-center gap-3 text-primary transition-colors hover:text-primary/80"
                                                                aria-label={`Call ${memberName}`}
                                                            >
                                                                <span className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-secondary/40 hover:bg-accent">
                                                                    <Phone size={16} />
                                                                </span>
                                                                <span className="text-sm text-muted-foreground font-medium">{member.phone}</span>
                                                            </a>
                                                        )}
                                                        {address && (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedAddress({ name: memberName, address })
                                                                }
                                                                className="flex items-center gap-3 text-primary transition-colors hover:text-primary/80 text-left"
                                                                aria-label={`View address for ${memberName}`}
                                                            >
                                                                <span className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-full border border-secondary/40 hover:bg-accent">
                                                                    <MapPin size={16} />
                                                                </span>
                                                                <span className="text-sm text-muted-foreground font-medium truncate">{address}</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                <Dialog
                    open={!!selectedAddress}
                    onOpenChange={(open) => !open && setSelectedAddress(null)}
                >
                    <DialogContent className="max-w-sm text-center">
                        <DialogHeader>
                            <DialogTitle className="font-heading text-lg">
                                {selectedAddress?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                            {selectedAddress?.address}
                        </p>
                        {selectedAddress?.address && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress.address)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-secondary/40 px-4 py-2 text-sm text-primary hover:bg-accent transition-colors"
                            >
                                <MapPin size={14} /> Open in Maps
                            </a>
                        )}
                    </DialogContent>
                </Dialog>

                <Footer />
            </div>
        </HomePageProvider>
    );
};

export default About;
