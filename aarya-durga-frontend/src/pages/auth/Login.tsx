import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, LogIn, Github, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import AuthLayout from "@/components/auth/AuthLayout";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Login = () => {
    const { t } = useLanguage();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Mock login - in real app, we would send this to an API
            await login(formData.email, "Devotee User");
            toast.success("Welcome back!", {
                description: "You have successfully signed in.",
            });
            navigate("/");
        } catch (error) {
            toast.error("Login failed", {
                description: "Please check your credentials and try again.",
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
                    {t.auth.loginTitle}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
                >
                    {t.auth.loginSubtitle}
                </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t.auth.password}</Label>
                        <Link
                            to="/auth/forgot-password"
                            className="text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors"
                        >
                            {t.auth.forgotPasswordLink}
                        </Link>
                    </div>
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center space-x-2 py-1"
                >
                    <Checkbox id="remember" className="data-[state=checked]:bg-primary rounded-md" />
                    <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none text-muted-foreground cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {t.auth.rememberMe}
                    </label>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl font-bold text-base shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all"
                        disabled={loading}
                        variant="temple"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                {t.auth.signingIn}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <LogIn size={18} />
                                {t.auth.signIn}
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
                            {t.auth.noAccount}
                        </span>
                    </div>
                </div>

                <Link to="/auth/register">
                    <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-semibold transition-all border-2"
                    >
                        {t.auth.signUp}
                    </Button>
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
