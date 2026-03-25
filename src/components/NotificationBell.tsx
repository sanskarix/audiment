'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  orderBy,
  limit,
  writeBatch
} from 'firebase/firestore';
import { 
  Bell, 
  CheckCheck, 
  CheckSquare, 
  AlertTriangle, 
  Zap, 
  FileText,
  Clock
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
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [session, setSession] = useState<{ uid: string } | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ uid: data.uid });
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;

    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', session.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));
      setNotifications(fetched);
      setUnreadCount(fetched.filter((n: any) => !n.isRead).length);
    });

    return () => unsubscribe();
  }, [session]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { isRead: true });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'audit_assigned': return <CheckSquare className="h-4 w-4 text-blue-500" />;
      case 'audit_missed': return <Clock className="h-4 w-4 text-rose-500" />;
      case 'surprise_audit': return <Zap className="h-4 w-4 text-amber-500" />;
      case 'low_score': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'trend_alert': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'corrective_action': return <FileText className="h-4 w-4 text-indigo-500" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50 rounded-full transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-[10px] font-bold border-2 border-background animate-in zoom-in duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-85 md:w-96 p-0 shadow-2xl border-muted/50">
        <div className="flex items-center justify-between p-4 bg-muted/30">
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">Notifications</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{unreadCount} Unread Alerts</span>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 text-[10px] uppercase font-bold text-primary hover:text-primary hover:bg-primary/5 transition-colors">
              <CheckCheck className="mr-1.5 h-3 w-3" /> Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Bell className="h-6 w-6 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
              <p className="text-[11px] text-muted-foreground/60">No pending alerts for your attention.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "relative flex gap-4 p-4 transition-all border-b last:border-0 hover:bg-muted/30 cursor-pointer",
                    !n.isRead && "bg-primary/5 border-l-2 border-l-primary",
                    n.type === 'surprise_audit' && "bg-amber-50/50 hover:bg-amber-50"
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className={cn(
                    "h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-background border shadow-sm",
                    !n.isRead && "ring-2 ring-primary/10"
                  )}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-semibold leading-none truncate flex items-center gap-1.5", !n.isRead ? "text-foreground" : "text-muted-foreground font-medium")}>
                        {n.type === 'surprise_audit' && (
                          <Badge className="bg-amber-500 hover:bg-amber-600 h-3.5 px-1 py-0 text-[8px] font-black uppercase text-white animate-pulse">URGENT</Badge>
                        )}
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap mt-0.5">
                        {n.createdAt ? formatDistanceToNow(n.createdAt.toDate(), { addSuffix: true }) : 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 bg-muted/10">
          <Button variant="ghost" className="w-full h-8 text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
