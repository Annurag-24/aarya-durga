import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminAuth } from "@/hooks/admin/useAdminAuth";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { admin, adminLogout } = useAdminAuth();

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AdminSidebar />

                <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
                    {/* Header */}
                    <header className="border-b bg-white shadow-sm">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div className="flex items-center gap-4">
                                <SidebarTrigger>
                                    <Menu size={20} />
                                </SidebarTrigger>
                                <h1 className="font-heading text-xl font-semibold text-foreground hidden sm:block">
                                    Aarya Durga Temple Admin
                                </h1>
                            </div>

                            <div className="flex items-center gap-4">
                                {admin && (
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-foreground">
                                            {admin.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {admin.email}
                                        </p>
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={adminLogout}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <LogOut size={20} />
                                </Button>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-6">{children}</div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};
