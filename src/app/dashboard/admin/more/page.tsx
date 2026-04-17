'use client';

import { MobileMorePage } from '@/components/mobile/MobileMorePage';
import { MapPin, FileText, BarChart, ClipboardList, Settings } from 'lucide-react';

export default function AdminMorePage() {
  const sections = [
    {
      title: 'Management',
      items: [
        { label: 'Locations', icon: MapPin, href: '/dashboard/admin/locations' },
        { label: 'Templates', icon: FileText, href: '/dashboard/admin/templates' },
      ]
    },
    {
      title: 'Analytics & Actions',
      items: [
        { label: 'Reports', icon: BarChart, href: '/dashboard/admin/reports' },
        { label: 'Corrective Actions', icon: ClipboardList, href: '/dashboard/admin/corrective-actions' },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', icon: Settings, href: '/dashboard/admin/settings' },
      ]
    }
  ];

  return <MobileMorePage title="More" sections={sections} />;
}
