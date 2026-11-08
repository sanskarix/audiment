'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/app-ui/dialog';
import { Button } from '@/components/app-ui/button';
import { Check } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  feature?: string;
}

export default function UpgradeModal({
  open,
  onOpenChange,
  title = 'Upgrade to Pro',
  description = 'Scale operations across all locations with enterprise accountability.',
  feature,
}: UpgradeModalProps) {
  const calLink = 'https://cal.com/sanskarix/demo';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] border-border/60 bg-card p-6 shadow-2xl">
        <DialogHeader className="space-y-1.5 text-left pb-1">
          <DialogTitle className="text-lg font-medium text-heading tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-text text-[13px] leading-normal">
            {description}
          </DialogDescription>
        </DialogHeader>

        {feature && (
          <div className="text-[12px] text-primary bg-primary/5 border border-primary/15 rounded-md px-3 py-2">
            <span><strong>{feature}</strong> is available on Pro & Enterprise plans.</span>
          </div>
        )}

        <div className="space-y-2 py-3 border-y border-border/50 my-1 text-[13px] text-body">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <span>Multi-outlet management & cross-store analytics</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <span>Flashmob 20s video presence audits</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <span>Automated recurring audit schedules</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <span>Unlimited team members & manager accounts</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-primary shrink-0" />
            <span>Permanent compliance storage & clean PDF exports</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button
            asChild
            className="w-full h-10 text-[13px] font-normal"
          >
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
            >
              Upgrade now
            </a>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full h-8 text-[12px] text-muted-text hover:text-foreground font-normal"
            onClick={() => onOpenChange(false)}
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
