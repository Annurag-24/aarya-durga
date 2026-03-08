import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Register = () => {
    const { t } = useLanguage();
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
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
            await register(formData.email, formData.fullName);
            toast.success("Account created!", {
                description: "Welcome to Aarya Durga Temple community.",
            });
            navigate("/");
        } catch (error) {
            toast.error("Registration failed", {
                description: "An error occurred during sign up. Please try again.",
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
                    {t.auth.registerTitle}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
                >
                    {t.auth.registerSubtitle}
                </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                >
                    <Label htmlFor="fullName">{t.auth.fullName}</Label>
                    <div className="relative group">
                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="fullName"
                            placeholder="Your full name"
                            className="pl-10 h-11 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    <Label htmlFor="email">{t.auth.email}</Label>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 h-11 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                >
                    <Label htmlFor="password">{t.auth.password}</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-11 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-2"
                >
                    <Label htmlFor="confirmPassword">{t.auth.confirmPassword}</Label>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10 h-11 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="pt-2"
                >
                    <Button
                        type="submit"
                        className="w-full h-11 rounded-xl font-bold text-base shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                        disabled={loading}
                        variant="temple"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                {t.auth.signingUp}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <UserPlus size={18} />
                                {t.auth.signUp}
                            </span>
                        )}
                    </Button>
                </motion.div>
            </form>

            <div className="mt-8">
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card/90 px-3 text-muted-foreground font-medium tracking-wider">
                            {t.auth.haveAccount}
                        </span>
                    </div>
                </div>

                <Link to="/auth/login" className="block text-center text-primary font-bold hover:underline">
                    {t.auth.signIn}
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;
