'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import {
  Bell,
  CheckCheck,
  ClipboardList,
  AlertCircle,
  TrendingDown,
  BarChart2,
  Wrench,
  Zap,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuthSync } from './AuthProvider';

export default function NotificationBell({ variant, userRole }: { variant?: 'default' | 'trigger-only' | 'sidebar-item' | 'sidebar-card', userRole?: string }) {
  const { isSynced, uid } = useAuthSync();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!isSynced || !uid) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setNotifications(fetched);
      setUnreadCount(fetched.filter((n: any) => !n.isRead).length);
    }, (err) => {
      console.error('[NotificationBell] Snapshot error:', err);
    });

    return () => unsubscribe();
  }, [uid, isSynced]);

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
    
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (e) {
      console.error(e);
      // Revert if failed? (Optional, but user asked for immediate removal)
    }
  };

  const markAllAsRead = async () => {
    // Optimistic UI update
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.isRead).forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { isRead: true });
      });
      await batch.commit();
    } catch (e) {
      console.error(e);
    }
  };

  const handleNavigate = async (n: any) => {
    if (!n) return;
    markAsRead(n.id);
    
    // Always respect the current user's role dashboard prefix
    const rolePrefix = (userRole || n.recipientRole)?.toLowerCase() || 'auditor';
    
    // Map notification types to specific dashboard routes based on recipient role
    switch (n.type) {
      case 'audit_assigned':
      case 'audit_published':
      case 'surprise_audit':
        if (rolePrefix === 'auditor') {
          try {
            const auditSnap = await getDoc(doc(db, 'audits', n.relatedId));
            if (auditSnap.exists()) {
              const auditData = auditSnap.data();
              const now = new Date();
              const sched = auditData.scheduledDate?.toDate() || new Date(0);
              if (now < sched) {
                alert(`Audit is locked until ${format(sched, 'MMM d, h:mm a')}`);
                return;
              }
            }
          } catch(e) { }
          router.push(`/dashboard/auditor/audits/${n.relatedId}`);
        } else {
          router.push(`/dashboard/${rolePrefix}/audits`);
        }
        break;
      case 'audit_missed':
        if (rolePrefix === 'admin') {
          router.push('/dashboard/admin/audits');
        } else {
          router.push(`/dashboard/${rolePrefix}/audits`);
        }
        break;
      case 'low_score':
      case 'trend_alert':
        if (rolePrefix === 'admin') {
          router.push('/dashboard/admin/reports');
        } else if (rolePrefix === 'manager') {
          router.push('/dashboard/manager/reports');
        } else {
          router.push(`/dashboard/${rolePrefix}`);
        }
        break;
      case 'corrective_action':
        if (rolePrefix === 'manager') {
          router.push('/dashboard/manager/corrective-actions');
        } else if (rolePrefix === 'admin') {
          router.push('/dashboard/admin/corrective-actions');
        } else {
          router.push(`/dashboard/${rolePrefix}`);
        }
        break;
      default:
        // General fallback
        router.push(`/dashboard/${rolePrefix}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'audit_assigned': return <ClipboardList className="w-3.5 h-3.5 text-foreground" />;
      case 'audit_missed': return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      case 'low_score': return <TrendingDown className="w-3.5 h-3.5 text-amber-500" />;
      case 'trend_alert': return <BarChart2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'corrective_action': return <Wrench className="w-3.5 h-3.5 text-orange-500" />;
      case 'surprise_audit': return <Zap className="w-3.5 h-3.5 text-purple-500" />;
      case 'audit_published': return <Bell className="w-3.5 h-3.5 text-foreground" />;
      default: return <Bell className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  if (variant === 'trigger-only') {
    return (
      <div className="relative">
        {unreadCount > 0 && (
          <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px] font-medium border-2 border-background animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </div>
    );
  }

  const NotificationContent = () => (
    <DropdownMenuContent align={variant === 'sidebar-item' ? 'start' : 'end'} side={variant === 'sidebar-item' ? 'right' : 'bottom'} className="w-85 md:w-96 p-0 shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl z-[60]">
      <div className="flex items-center justify-between p-4 bg-muted/20">
        <div className="flex flex-col">
          <span className="font-medium text-sm tracking-tight text-heading">Notifications</span>
          <span className="muted-label">{unreadCount} unread alerts</span>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-[10px]  font-medium text-primary hover:text-primary hover:bg-primary/10 transition-colors">
            <CheckCheck className="mr-1.5 h-3 w-3" /> Mark all read
          </Button>
        )}
      </div>
      <DropdownMenuSeparator className="m-0 bg-border/50" />
      <ScrollArea className="h-[450px]">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-text/20" />
            </div>
            <p className="text-sm font-medium text-muted-text">All caught up!</p>
            <p className="text-xs text-muted-text/60 max-w-[200px] mt-1">No pending alerts for your attention right now.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((n) => (
              <div key={n.id} className="p-1 last:border-0 border-b border-border/30">
                <div 
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                    !n.isRead && "bg-primary/5"
                  )}
                  onClick={() => handleNavigate(n)}
                >
                  {/* Left: colored icon based on type */}
                  <div className="mt-0.5 p-1.5 rounded-full bg-muted flex-shrink-0">
                    {getIcon(n.type)}
                  </div>
                  
                  {/* Middle: content */}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm leading-tight text-foreground", !n.isRead ? "font-semibold" : "font-medium")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {n.createdAt ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                    </p>
                  </div>

                  {/* Right: dismiss button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground mt-0.5 p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <DropdownMenuSeparator className="m-0 bg-border/50" />
      <div className="p-2 bg-muted/5">
        <Button variant="ghost" className="w-full h-9 text-xs font-medium text-muted-text hover:text-heading hover:bg-muted/50 transition-colors">
          View all notifications
        </Button>
      </div>
    </DropdownMenuContent>
  );

  if (variant === 'sidebar-card') {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const displayNotes = unreadNotifications.slice(0, 3);

    if (displayNotes.length === 0) return null;

    return (
      <div className="mx-3 mt-auto mb-10 relative h-[100px] flex flex-col justify-end">
        <AnimatePresence mode="popLayout">
          {displayNotes.slice().reverse().map((n, idx) => {
            const stackIdx = displayNotes.length - 1 - idx;
            const isTop = stackIdx === 0;
            
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: -stackIdx * 8, 
                  scale: 1 - stackIdx * 0.05,
                  zIndex: 10 - stackIdx,
                  filter: stackIdx > 0 ? 'blur(0.5px)' : 'none'
                }}
                exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                className={cn(
                  "absolute inset-x-0 bottom-0 bg-card border border-border/60 rounded-xl p-4 shadow-xl cursor-pointer select-none group",
                  isTop ? "hover:border-primary/40 ring-1 ring-transparent hover:ring-primary/10 transition-all" : "pointer-events-none opacity-80"
                )}
                onClick={() => isTop && handleNavigate(n)}
              >
                {isTop && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-muted/50 text-muted-text/30 hover:text-destructive transition-colors z-20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                
                <div className="flex flex-col gap-1 pr-6">
                  <div className="flex items-center gap-2">
                     <div className="h-5 w-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        {getIcon(n.type)}
                     </div>
                     <span className="text-[13px] font-bold text-heading truncate leading-none tracking-tight">
                       {n.title}
                     </span>
                  </div>
                  <p className="text-[11px] text-muted-text leading-tight line-clamp-2 mt-1 font-medium">
                    {n.message}
                  </p>
                  <span className="text-[9px] text-muted-text/30 mt-1.5 font-bold">
                     {n.createdAt ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'sidebar-item') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-between w-full h-10 px-3 rounded-lg text-muted-text hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-200 group border-none outline-none ring-0 bg-transparent">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12" />
              <span className="text-[13px] font-normal tracking-tight text-body">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <Badge className="h-5 min-w-5 p-0 flex items-center justify-center bg-primary text-[10px] font-medium rounded-full animate-in zoom-in duration-300">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>
        <NotificationContent />
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full transition-all duration-200 active:scale-95">
          <Bell className="h-5 w-5 text-muted-text" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center bg-primary text-[10px] font-medium border-2 border-background animate-in zoom-in duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <NotificationContent />
    </DropdownMenu>
  );
}
