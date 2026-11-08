'use client';

import { useState } from 'react';
import { useAuthSync } from '@/components/AuthProvider';
import UpgradeModal from '@/components/UpgradeModal';

export default function PlanBadge() {
  const { plan } = useAuthSync();
  const [modalOpen, setModalOpen] = useState(false);

  const isFree = !plan || plan.toLowerCase() === 'free';

  if (!isFree) {
    return (
      <div className="flex items-center justify-center py-1 text-[11px] text-muted-text font-normal tracking-tight capitalize select-none w-full text-center">
        {plan} Plan
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-1.5 py-1 text-[12px] text-muted-text font-normal select-none w-full text-center">
        <span>Free Plan</span>
        <span className="text-border">|</span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="text-primary hover:text-primary/80 font-normal hover:underline cursor-pointer transition-colors"
        >
          Upgrade
        </button>
      </div>

      <UpgradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
