import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Save, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error(t.auth.passwordsDoNotMatch);
            return;
        }

        setLoading(true);
        try {
            // Mock reset delay
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Password updated!", {
                description: "You can now sign in with your new password.",
            });
            navigate("/auth/login");
        } catch (error) {
            toast.error("Process failed", {
                description: "An error occurred. Please try again later.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-heading text-3xl font-bold text-foreground mb-3"
                >
                    {t.auth.resetPasswordTitle}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
                >
                    {t.auth.resetPasswordSubtitle}
                </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                >
                    <Label htmlFor="password">{t.auth.password}</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-12 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                >
                    <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-12 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-2"
                >
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-bold text-base shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                        disabled={loading}
                        variant="temple"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                {t.auth.sending}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <RefreshCcw size={18} />
                                {t.auth.updatePassword}
                            </span>
                        )}
                    </Button>
                </motion.div>
            </form>
        </AuthLayout>
    );
};

export default ResetPassword;
