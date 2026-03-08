import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Info,
  BookOpen,
  MessageSquare,
  Mail,
  Settings,
  Flame,
  Images,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';

const menuItems = [
  { label: 'Home Page', icon: Home, href: '/admin/home' },
  { label: 'About Us', icon: Info, href: '/admin/about' },
  { label: 'History', icon: BookOpen, href: '/admin/history-editor' },
  { label: 'Pooja & Donation', icon: Flame, href: '/admin/pooja-donation-editor' },
  { label: 'Events & Gallery', icon: Images, href: '/admin/events-gallery-editor' },
  { label: 'Contact Us', icon: MessageSquare, href: '/admin/contact' },
  { label: 'Contact Submissions', icon: Mail, href: '/admin/contact-submissions' },
  { label: 'Site Settings', icon: Settings, href: '/admin/site-settings' },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="px-4 py-2">
          <h1 className="font-heading text-xl font-bold text-primary">Admin Panel</h1>
          {admin && <p className="text-xs text-muted-foreground mt-1">{admin.name}</p>}
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-6">
        <SidebarMenu className="px-4 space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                onClick={() => navigate(item.href)}
                isActive={isActive(item.href)}
                className={isActive(item.href) ? 'bg-primary/10 text-primary' : ''}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};
