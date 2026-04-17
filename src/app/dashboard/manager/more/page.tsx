'use client';

import { MobileMorePage } from '@/components/mobile/MobileMorePage';
import { Users, Calendar, Settings, Video } from 'lucide-react';

export default function ManagerMorePage() {
  const sections = [
    {
      title: 'Operations',
      items: [
        { label: 'Auditors', icon: Users, href: '/dashboard/manager/auditors' },
        { label: 'Calendar / Planning', icon: Calendar, href: '/dashboard/manager/calendar' },
        { label: 'Flashmob', icon: Video, href: '/dashboard/manager/flashmob' },
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Settings', icon: Settings, href: '/dashboard/manager/settings' },
      ]
    }
  ];

  return <MobileMorePage title="More" sections={sections} />;
}
