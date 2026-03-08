import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, Clock, ShieldCheck, LogOut, Save, UserCircle, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import LogoutDialog from "@/components/auth/LogoutDialog";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { t } = useLanguage();
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock update
            await new Promise((resolve) => setTimeout(resolve, 1000));
            updateUser(formData);
            toast.success("Profile updated!", {
                description: "Your information has been successfully saved.",
            });
        } catch (error) {
            toast.error("Update failed", {
                description: "An error occurred while saving your profile.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
        toast.success("Logged out successfully");
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-8">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="text-primary/50" size={48} />
                </div>
                <p className="text-muted-foreground text-center max-w-xs">{t.auth.noAccount}</p>
                <Button variant="temple" onClick={() => navigate("/auth/login")}>{t.auth.signIn}</Button>
            </div>
        );
    }

    return (
        <section className="py-12 px-4 md:py-20 lg:py-24 bg-background relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48 blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Sidebar / User Info Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card/50 backdrop-blur-md rounded-3xl p-8 border border-border shadow-xl text-center">
                            <div className="relative w-28 h-28 mx-auto mb-6">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-primary/20">
                                    {user.fullName.charAt(0)}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center shadow-md border border-border hover:scale-110 transition-transform">
                                    <Edit3 size={16} />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-1 font-heading">{user.fullName}</h2>
                            <p className="text-muted-foreground text-sm mb-6 truncate">{user.email}</p>

                            <div className="space-y-4 pt-6 border-t border-border">
                                <div className="flex items-center gap-3 text-sm text-left">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs leading-none mb-1">Status</p>
                                        <p className="font-semibold text-foreground">Verified Devotee</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-left">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Calendar size={16} />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs leading-none mb-1">{t.user.memberSince}</p>
                                        <p className="font-semibold text-foreground">{user.memberSince}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-left">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <Clock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground text-xs leading-none mb-1">{t.user.lastLogin}</p>
                                        <p className="font-semibold text-foreground">{user.lastLogin}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6">
                                <Button
                                    variant="ghost"
                                    className="w-full h-11 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 font-bold"
                                    onClick={() => setShowLogoutDialog(true)}
                                >
                                    <LogOut size={18} />
                                    {t.user.logout}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Areas */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="info" className="w-full">
                            <TabsList className="bg-muted/50 p-1.5 rounded-2xl mb-8 w-full max-w-sm">
                                <TabsTrigger value="info" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    {t.user.personalInfo}
                                </TabsTrigger>
                                <TabsTrigger value="security" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                    {t.user.changePasswordTitle}
                                </TabsTrigger>
                            </TabsList>

                            <AnimatePresence mode="wait">
                                <TabsContent value="info" className="mt-0 focus-visible:outline-none">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-card/50 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-border shadow-xl"
                                    >
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold font-heading mb-2">{t.user.profileTitle}</h3>
                                            <p className="text-muted-foreground text-sm">{t.user.profileSubtitle}</p>
                                        </div>

                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fullName" className="text-sm font-semibold">{t.auth.fullName}</Label>
                                                    <div className="relative group">
                                                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            id="fullName"
                                                            className="pl-10 h-12 rounded-xl border-border bg-background/50 focus:bg-background transition-all"
                                                            value={formData.fullName}
                                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-semibold">{t.auth.email}</Label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            className="pl-10 h-12 rounded-xl border-border bg-background/50 cursor-not-allowed opacity-80"
                                                            value={formData.email}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    type="submit"
                                                    className="h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-primary/20 gap-2"
                                                    disabled={loading}
                                                    variant="temple"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                            {t.user.updating}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save size={18} />
                                                            {t.user.saveChanges}
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="security" className="mt-0 focus-visible:outline-none">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="bg-card/50 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-border shadow-xl"
                                    >
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold font-heading mb-2">{t.user.changePasswordTitle}</h3>
                                            <p className="text-muted-foreground text-sm">{t.user.changePasswordSubtitle}</p>
                                        </div>

                                        <form className="space-y-6">
                                            <div className="space-y-6 max-w-md">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold">{t.user.currentPassword}</Label>
                                                    <Input
                                                        type="password"
                                                        className="h-12 rounded-xl border-border bg-background/50 focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold">{t.user.newPassword}</Label>
                                                    <Input
                                                        type="password"
                                                        className="h-12 rounded-xl border-border bg-background/50 focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-semibold">{t.auth.confirmPassword}</Label>
                                                    <Input
                                                        type="password"
                                                        className="h-12 rounded-xl border-border bg-background/50 focus:bg-background transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <Button
                                                    type="button"
                                                    className="h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-primary/20 gap-2"
                                                    variant="temple"
                                                    onClick={() => {
                                                        toast.success("Security Update", { description: "Password functionality is still in development." });
                                                    }}
                                                >
                                                    <Save size={18} />
                                                    {t.user.updatePassword}
                                                </Button>
                                            </div>
                                        </form>
                                    </motion.div>
                                </TabsContent>
                            </AnimatePresence>
                        </Tabs>
                    </div>
                </motion.div>
            </div>

            <LogoutDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                onConfirm={handleLogout}
            />
        </section>
    );
};

export default UserProfile;
