'use client';

import { MobileMorePage } from '@/components/mobile/MobileMorePage';
import { Settings, User, Video } from 'lucide-react';

export default function AuditorMorePage() {
  const sections = [
    {
      title: 'Performance',
      items: [
        { label: 'Flashmob', icon: Video, href: '/dashboard/auditor/flashmob' },
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'My Profile', icon: User, href: '/dashboard/auditor/settings' },
        { label: 'Security & Settings', icon: Settings, href: '/dashboard/auditor/settings' },
      ]
    }
  ];

  return <MobileMorePage title="More" sections={sections} />;
}
