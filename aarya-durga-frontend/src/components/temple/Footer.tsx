import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Youtube } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { findContentItem, getContentByLanguage } from "@/api/helpers";
import { useHomePageData } from "@/contexts/HomePageContext";

interface FooterData {
  address: string;
  phone: string;
  email: string;
  socialLabel: string;
  facebookLink: string;
  youtubeLink: string;
  copyrightText: string;
}

const Footer = () => {
  const { t, language } = useLanguage();
  const { pageData } = useHomePageData();
  const [footerData, setFooterData] = useState<FooterData>({
    address: "",
    phone: "",
    email: "",
    socialLabel: "",
    facebookLink: "",
    youtubeLink: "",
    copyrightText: "",
  });

  useEffect(() => {
    if (pageData.length > 0) {
      const lang = language as 'en' | 'hi' | 'mr';

      const getContent = (sectionKey: string): string => {
        return getContentByLanguage(findContentItem(pageData, sectionKey), lang);
      };

      const address = getContent('visit_address');
      const phone = getContent('visit_phone');
      const email = getContent('visit_email');
      const socialLabel = getContent('footer_social_label');
      const facebook = getContent('footer_facebook_link');
      const youtube = getContent('footer_youtube_link');
      const copyright = getContent('footer_copyright');

      setFooterData({
        address,
        phone,
        email,
        socialLabel,
        facebookLink: facebook,
        youtubeLink: youtube,
        copyrightText: copyright,
      });
    }
  }, [pageData, language]);

  const quickLinks = [
    { label: t.footer.home, href: "/" },
    { label: t.footer.about, href: "/about" },
    { label: t.footer.history, href: "/history" },
    { label: t.footer.events, href: "/events-gallery" },
    { label: t.footer.contact, href: "/contact" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">{t.footer.templeInfo}</h3>
            <div className="space-y-2 text-primary-foreground/80 text-sm">
              <p className="flex items-center gap-2"><MapPin size={14} /> {footerData.address}</p>
              <p className="flex items-center gap-2"><Phone size={14} /> {footerData.phone}</p>
              <p className="flex items-center gap-2"><Mail size={14} /> {footerData.email}</p>
            </div>
          </div>
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">{t.footer.quickLinks}</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              {quickLinks.map((link) => (
                <Link key={link.href} to={link.href} className="block hover:text-secondary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-heading text-lg font-semibold mb-4 text-center md:text-left">{footerData.socialLabel}</h3>
            <div className="flex gap-3">
              {footerData.facebookLink && footerData.facebookLink !== "#" && (
                <a href={footerData.facebookLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors" title="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {footerData.youtubeLink && footerData.youtubeLink !== "#" && (
                <a href={footerData.youtubeLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-sm hover:bg-secondary hover:text-secondary-foreground transition-colors" title="YouTube">
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/80">
          {footerData.copyrightText}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
