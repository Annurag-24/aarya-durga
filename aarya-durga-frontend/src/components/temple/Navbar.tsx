import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoutDialog from "../auth/LogoutDialog";
import { constructImageUrl } from "@/api/imageUrl";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { settingsData } = useSettings();

  const navItems = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.history, href: "/history" },
    { label: t.nav.poojaDonation, href: "/pooja-donation" },
    { label: t.nav.eventsGallery, href: "/events-gallery" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-sm border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            {settingsData?.logo?.file_url && (
              <img src={constructImageUrl(settingsData.logo.file_url)} alt="Temple Logo" className="h-10 w-10 object-cover rounded" />
            )}
            <span className="font-heading text-lg font-bold text-primary">
              {language === 'hi'
                ? settingsData?.website_name_hi || t.nav.templeName
                : language === 'mr'
                ? settingsData?.website_name_mr || t.nav.templeName
                : settingsData?.website_name_en || t.nav.templeName}
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors ${location.pathname === item.href
                  ? "text-primary font-semibold"
                  : "text-foreground/80 hover:text-primary"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="h-6 w-px bg-border mx-1" />
            <LanguageSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/user/profile">
                  <Button variant="ghost" size="sm" className="gap-2 font-semibold">
                    <User size={18} />
                    {user?.fullName.split(" ")[0]}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  onClick={() => setShowLogoutDialog(true)}
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : null}
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher mobile />

            {isAuthenticated && (
              <Link to="/user/profile" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="icon" className="text-primary">
                  <User size={22} />
                </Button>
              </Link>
            )}

            <button className="text-foreground p-1" onClick={() => setOpen(!open)} aria-label="Toggle Menu">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-card border-t border-border px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`block py-3 text-base font-medium transition-colors border-b border-border/50 last:border-0 ${location.pathname === item.href
                  ? "text-primary font-bold"
                  : "text-foreground/80 hover:text-primary"
                  }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 grid grid-cols-1 gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/user/profile" onClick={() => setOpen(false)}>
                    <Button variant="outline" className="w-full h-11 rounded-xl border-primary/20 text-primary font-bold">
                      {t.user.profileTitle}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full h-11 rounded-xl text-red-500 font-bold"
                    onClick={() => {
                      setOpen(false);
                      setShowLogoutDialog(true);
                    }}
                  >
                    {t.user.logout}
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </nav>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Navbar;
