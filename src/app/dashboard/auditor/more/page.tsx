'use client';

import { MobileMorePage } from '@/components/mobile/MobileMorePage';
import { Settings, User } from 'lucide-react';

export default function AuditorMorePage() {
  const sections = [
    {
      title: 'Account',
      items: [
        { label: 'Profile', icon: User, href: '/dashboard/auditor/settings' },
        { label: 'Settings', icon: Settings, href: '/dashboard/auditor/settings' },
      ]
    }
  ];

  return <MobileMorePage title="More" sections={sections} />;
}
