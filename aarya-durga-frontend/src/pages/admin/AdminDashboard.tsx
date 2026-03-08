import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  Calendar,
  Package,
  DollarSign,
  Users,
  ArrowRight,
} from 'lucide-react';
import { useEvents } from '@/hooks/content/useEvents';
import { useGallery } from '@/hooks/content/useGallery';
import { usePoojaServices } from '@/hooks/content/usePoojaServices';
import { useDonationCategories } from '@/hooks/content/useDonationCategories';
import { useCommitteeMembers } from '@/hooks/content/useCommitteeMembers';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ size: number }>;
  href: string;
  onClick: () => void;
}

const StatCard = ({ title, value, icon: Icon, onClick }: StatCardProps) => (
  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium flex items-center justify-between">
        <span>{title}</span>
        <Icon size={20} className="text-secondary" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">items in database</p>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: events = [] } = useEvents();
  const { data: gallery = [] } = useGallery();
  const { data: poojaServices = [] } = usePoojaServices();
  const { data: donationCategories = [] } = useDonationCategories();
  const { data: committeeMembers = [] } = useCommitteeMembers();

  const stats = [
    {
      title: 'Events',
      value: events.length,
      icon: Calendar,
      href: '/admin/events',
    },
    {
      title: 'Gallery',
      value: gallery.length,
      icon: LayoutGrid,
      href: '/admin/gallery',
    },
    {
      title: 'Pooja Services',
      value: poojaServices.length,
      icon: Package,
      href: '/admin/pooja-services',
    },
    {
      title: 'Donations',
      value: donationCategories.length,
      icon: DollarSign,
      href: '/admin/donation-categories',
    },
    {
      title: 'Committee',
      value: committeeMembers.length,
      icon: Users,
      href: '/admin/committee',
    },
  ];

  const quickLinks = [
    { label: 'Events', href: '/admin/events' },
    { label: 'Gallery', href: '/admin/gallery' },
    { label: 'Pooja Services', href: '/admin/pooja-services' },
    { label: 'Site Settings', href: '/admin/site-settings' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
          Welcome to Admin Panel
        </h1>
        <p className="text-muted-foreground">
          Manage all temple content from a single dashboard
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.href}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            href={stat.href}
            onClick={() => navigate(stat.href)}
          />
        ))}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <Button
                key={link.href}
                variant="outline"
                className="justify-between"
                onClick={() => navigate(link.href)}
              >
                {link.label}
                <ArrowRight size={16} />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Navigate to different sections using the sidebar menu</li>
            <li>✓ Add, edit, and delete content items in each section</li>
            <li>✓ Use the search and filter options to find items quickly</li>
            <li>✓ All changes are saved automatically to the database</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
