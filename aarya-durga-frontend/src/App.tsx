import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import { LoaderProvider } from "./contexts/LoaderContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import GlobalLoader from "./components/global/GlobalLoader";
import Index from "./pages/Index";
import About from "./pages/About";
import History from "./pages/History";
import PoojaDonation from "./pages/PoojaDonation";
import EventsGallery from "./pages/EventsGallery";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import UserProfile from "./pages/user/UserProfile";
import ScrollToTop from "./components/temple/ScrollToTop";
import { SiteTitleFaviconManager } from "./components/global/SiteTitleFaviconManager";
import AdminLogin from "./pages/admin/AdminLogin";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import AboutPageEditor from "./pages/admin/about/AboutPageEditor";
import HomePageEditor from "./pages/admin/home/HomePageEditor";
import { QuotesList } from "./pages/admin/quotes/QuotesList";
import { QuoteForm } from "./pages/admin/quotes/QuoteForm";
import { ContactSubjectsPage } from "./pages/admin/contact/ContactSubjectsPage";
import { ContactSubmissionsPage } from "./pages/admin/contact/ContactSubmissionsPage";
import { SiteSettings } from "./pages/admin/settings/SiteSettings";
import { MediaLibrary } from "./pages/admin/media/MediaLibrary";
import PageContentEditor from "./pages/admin/settings/PageContentEditor";
import HistoryPageEditor from "./pages/admin/history/HistoryPageEditor";
import PoojaAndDonationPageEditor from "./pages/admin/pooja-donation/PoojaAndDonationPageEditor";
import EventsGalleryPageEditor from "./pages/admin/events-gallery/EventsGalleryPageEditor";
import ContactPageEditor from "./pages/admin/contact/ContactPageEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <LoaderProvider>
            <SettingsProvider>
              <TooltipProvider>
                <GlobalLoader />
                <SiteTitleFaviconManager />
                <Toaster />
                <Sonner position="top-right" />
                <BrowserRouter>
                  <ScrollToTop />
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/history" element={<History />} />
                <Route path="/pooja-donation" element={<PoojaDonation />} />
                <Route path="/events-gallery" element={<EventsGallery />} />
                <Route path="/contact" element={<Contact />} />

                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />

                {/* User Routes */}
                <Route path="/user/profile" element={<UserProfile />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route index element={<Navigate to="home" replace />} />

                        {/* Overview - Page Editors */}
                        <Route path="home" element={<HomePageEditor />} />
                        <Route path="about" element={<AboutPageEditor />} />
                        <Route path="history-editor" element={<HistoryPageEditor />} />
                        <Route path="pooja-donation-editor" element={<PoojaAndDonationPageEditor />} />
                        <Route path="events-gallery-editor" element={<EventsGalleryPageEditor />} />
                        <Route path="contact" element={<ContactPageEditor />} />

                        {/* Settings */}
                        <Route path="quotes" element={<QuotesList />} />
                        <Route path="quotes/new" element={<QuoteForm />} />
                        <Route path="quotes/:id/edit" element={<QuoteForm />} />
                        <Route path="contact-subjects" element={<ContactSubjectsPage />} />
                        <Route path="contact-submissions" element={<ContactSubmissionsPage />} />
                        <Route path="site-settings" element={<SiteSettings />} />
                        <Route path="page-content" element={<PageContentEditor />} />
                        <Route path="media" element={<MediaLibrary />} />
                      </Routes>
                    </AdminLayout>
                  </AdminProtectedRoute>
                } />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
              </TooltipProvider>
            </SettingsProvider>
          </LoaderProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
