import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import AuthLayout from '@/components/auth/AuthLayout';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(formData.email, formData.password);
      toast.success('Welcome to Admin Portal!', {
        description: 'You have successfully signed in.',
      });
      navigate('/admin/home');
    } catch (error) {
      toast.error('Login failed', {
        description: 'Please check your credentials and try again.',
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
          Admin Portal
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
        >
          Sign in to manage temple content
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="email">Email</Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
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
          <Label htmlFor="password">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10 h-12 rounded-xl border-border bg-background focus:ring-primary/20 transition-all shadow-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn size={18} />
                Sign In
              </span>
            )}
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
