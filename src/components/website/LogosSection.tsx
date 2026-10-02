import React from 'react';
import DemoOne, { LogoCloud, clientLogos, techDemoLogos } from '@/components/website/logo-cloud-3';

export const LogosSection: React.FC = () => {
  return <DemoOne logos={clientLogos} />;
};

export { DemoOne, LogoCloud, clientLogos, techDemoLogos };
export const Logos3Demo = LogosSection;
