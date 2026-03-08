import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/i18n/LanguageContext";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

const LogoutDialog = ({ open, onOpenChange, onConfirm }: LogoutDialogProps) => {
    const { t } = useLanguage();

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl max-w-sm">
                <AlertDialogHeader className="items-center text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 border border-primary/20"
                    >
                        <LogOut className="text-primary" size={28} />
                    </motion.div>
                    <AlertDialogTitle className="font-heading text-2xl font-bold text-foreground">
                        {t.user.logoutConfirmTitle}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground pt-2">
                        {t.user.logoutConfirmDesc}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-6">
                    <AlertDialogCancel className="w-full sm:w-auto h-11 rounded-xl border-border bg-background hover:bg-accent text-foreground transition-all">
                        {t.user.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="w-full sm:w-auto h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all border-none"
                    >
                        {t.user.confirmLogout}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LogoutDialog;
