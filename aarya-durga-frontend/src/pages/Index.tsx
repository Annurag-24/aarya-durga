import { useEffect, useMemo } from "react";
import Navbar from "@/components/temple/Navbar";
import HeroSection from "@/components/temple/HeroSection";
import AboutSection from "@/components/temple/AboutSection";
import BlessingBanner from "@/components/temple/BlessingBanner";
import HistorySection from "@/components/temple/HistorySection";
import EventsSection from "@/components/temple/EventsSection";
import GallerySection from "@/components/temple/GallerySection";
import VisitSection from "@/components/temple/VisitSection";
import DevotionalQuote from "@/components/temple/DevotionalQuote";
import Footer from "@/components/temple/Footer";
import { HomePageProvider, useHomePageData } from "@/contexts/HomePageContext";
import {
    EventsGalleryPageProvider,
    useEventsGalleryPageData,
} from "@/contexts/EventsGalleryPageContext";
import { useLoader } from "@/contexts/LoaderContext";
import { useImagesLoaded } from "@/hooks/useImagesLoaded";

const IndexContent = () => {
    const { setLoading: setGlobalLoading } = useLoader();
    const { pageData: homeData, loading: homeLoading } = useHomePageData();
    const { pageData: eventsData, loading: eventsLoading } =
        useEventsGalleryPageData();

    const pageImageUrls = useMemo(() => {
        const collectImageUrls = (items: any[]) =>
            items
                .map((item) => item?.image?.file_url)
                .filter((url): url is string => Boolean(url));

        return [...collectImageUrls(homeData), ...collectImageUrls(eventsData)];
    }, [homeData, eventsData]);

    const imagesLoaded = useImagesLoaded([
        homeLoading,
        eventsLoading,
        ...pageImageUrls,
    ]);

    useEffect(() => {
        if (homeLoading || eventsLoading || !imagesLoaded) {
            setGlobalLoading(true);
            return;
        }

        setGlobalLoading(false);
    }, [homeLoading, eventsLoading, imagesLoaded, setGlobalLoading]);

    return (
        <div className="min-h-screen">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <BlessingBanner />
            <HistorySection />
            <EventsSection />
            <GallerySection />
            <VisitSection />
            <DevotionalQuote />
            <Footer />
        </div>
    );
};

const Index = () => {
    return (
        <HomePageProvider>
            <EventsGalleryPageProvider>
                <IndexContent />
            </EventsGalleryPageProvider>
        </HomePageProvider>
    );
};

export default Index;
