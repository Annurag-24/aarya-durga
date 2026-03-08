import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ForgotPassword = () => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock reset link sending
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setSubmitted(true);
            toast.success("Reset link sent!", {
                description: "Please check your email for the reset link.",
            });
        } catch (error) {
            toast.error("Error sending link", {
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
                    {t.auth.forgotPasswordTitle}
                </motion.h2>
                {!submitted ? (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
                    >
                        {t.auth.forgotPasswordSubtitle}
                    </motion.p>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary font-medium text-sm leading-relaxed max-w-xs mx-auto"
                    >
                        Check your inbox for a link to reset your password.
                    </motion.p>
                )}
            </div>

            {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                    >
                        <Label htmlFor="email">{t.auth.email}</Label>
                        <div className="relative group">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 h-12 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>

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
                                <Send size={18} />
                                {t.auth.sendResetLink}
                            </span>
                        )}
                    </Button>

                    <Link to="/auth/login" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-2 font-medium">
                        <ArrowLeft size={16} />
                        {t.auth.backToLogin}
                    </Link>
                </form>
            ) : (
                <div className="flex flex-col items-center gap-6 mt-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="text-primary" size={28} />
                    </div>
                    <Link to="/auth/login" className="w-full">
                        <Button variant="temple" className="w-full h-12 rounded-xl font-bold text-base shadow-md">
                            {t.auth.backToLogin}
                        </Button>
                    </Link>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
