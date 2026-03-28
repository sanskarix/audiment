'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ManagerCalendarPage() {
  const [session, setSession] = useState<any>(null);
  const [audits, setAudits] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.uid || !session?.organizationId) return;

    let unsubscribe = () => {};

    async function fetchCalendarData() {
      try {
        // Fetch manager's assigned locations
        const locationsQuery = query(
          collection(db, 'locations'), 
          where('organizationId', '==', session.organizationId),
          where('assignedManagerId', '==', session.uid)
        );
        const locationsSnap = await getDocs(locationsQuery);
        const locationIds = locationsSnap.docs.map(d => d.id);

        if (locationIds.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch user data for auditors mapping
        const usersSnap = await getDocs(query(collection(db, 'users'), where('organizationId', '==', session.organizationId)));
        const usersMap = new Map();
        usersSnap.forEach(doc => usersMap.set(doc.id, doc.data().name));

        // Fetch upcoming audits (exclude surprise audits)
        const auditsQuery = query(
          collection(db, 'audits'),
          where('organizationId', '==', session.organizationId),
          where('locationId', 'in', locationIds)
        );

        unsubscribe = onSnapshot(auditsQuery, (snap) => {
          const fetchedAudits = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              auditorName: data.assignedAuditorId ? usersMap.get(data.assignedAuditorId) : 'Unassigned',
              parsedDate: data.scheduledDate ? data.scheduledDate.toDate() : null
            } as any;
          }).filter((a: any) => !a.isSurprise && a.parsedDate && ['published', 'assigned', 'in_progress'].includes(a.status)); 
          // Surprise audits never show on this schedule

          setAudits(fetchedAudits);
          setLoading(false);
        });

      } catch (e) {
        console.error("Error fetching calendar data:", e);
        setLoading(false);
      }
    }

    fetchCalendarData();
    return () => unsubscribe();
  }, [session]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calendar calculations
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getEventsForDay = (day: Date) => {
    return audits.filter(audit => {
      const auditDate = audit.parsedDate;
      return auditDate && 
             auditDate.getDate() === day.getDate() &&
             auditDate.getMonth() === day.getMonth() &&
             auditDate.getFullYear() === day.getFullYear();
    });
  };

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Audit Schedule</h1>
            <p className="body-text">Monthly strategic overview of upcoming planned quality missions.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-muted/20 p-1.5 rounded-xl border border-muted/50 shadow-sm backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={prevMonth} 
              className="h-9 w-9 rounded-lg hover:bg-background transition-all active:scale-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="px-4 min-w-[140px] text-center">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground italic">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={nextMonth} 
              className="h-9 w-9 rounded-lg hover:bg-background transition-all active:scale-90"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Card className="standard-card">
          <CardContent className="p-0 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-muted/20 bg-muted/40 backdrop-blur-md">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-4 text-center text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground opacity-60">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 auto-rows-[160px] md:auto-rows-[180px]">
              {days.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "border-r border-b border-muted/10 p-3 flex flex-col gap-2.5 transition-all relative group",
                      !isCurrentMonth ? "bg-muted/5 opacity-50" : "bg-card hover:bg-muted/10",
                      isToday(day) && "bg-primary/[0.03]"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "text-[11px] font-black h-7 w-7 flex items-center justify-center rounded-lg transition-all",
                        isToday(day) 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" 
                          : !isCurrentMonth 
                            ? "text-muted-foreground/30" 
                            : "text-foreground opacity-60 group-hover:opacity-100"
                      )}>
                        {format(day, dateFormat)}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                      )}
                    </div>
                    
                    <ScrollArea className="flex-1 -mx-2 px-2 overflow-hidden">
                      <div className="flex flex-col gap-2 pb-2">
                        {dayEvents.map((event: any, idx) => (
                          <div 
                            key={event.id || idx} 
                            className={cn(
                              "text-[10px] p-2.5 rounded-xl border flex flex-col gap-1.5 transition-all group/event cursor-default shadow-sm backdrop-blur-sm",
                              event.status === 'in_progress' 
                                ? "bg-primary/5 border-primary/20 text-primary" 
                                : "bg-muted/20 border-muted text-foreground hover:bg-muted/30"
                            )}
                          >
                            <div className="font-black uppercase tracking-tight leading-none truncate" title={event.templateTitle}>
                              {event.templateTitle}
                            </div>
                            <div className="flex flex-col gap-1 pt-1 opacity-70">
                              <div className="flex items-center gap-2 truncate" title={event.locationName}>
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="font-bold truncate">{event.locationName}</span>
                              </div>
                              <div className="flex items-center gap-2 truncate" title={event.auditorName}>
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className={cn(
                                  "font-black tracking-widest text-[9px] truncate", 
                                  !event.assignedAuditorId && "text-destructive animate-pulse"
                                )}>
                                  {event.auditorName || 'UNASSIGNED'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
