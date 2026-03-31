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
        <div className="page-header-section mb-xl flex flex-col md:flex-row md:items-center justify-between gap-xl">
          <div className="flex flex-col gap-xs">
            <h1 className="page-heading">Audit Schedule</h1>
            <p className="body-text">Monthly strategic overview of upcoming planned quality missions.</p>
          </div>
          
          <div className="flex items-center gap-xs bg-muted/20 p-1.5 rounded-lg border border-border/50 shadow-sm">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevMonth} 
              className="h-8 w-8 hover:bg-background transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 min-w-[140px] text-center">
              <h2 className="text-xs font-medium uppercase tracking-widest text-heading">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextMonth} 
              className="h-8 w-8 hover:bg-background transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="standard-card">
          <CardContent className="p-0 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-4 text-center text-xs uppercase font-medium tracking-widest text-muted-text/80">
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
                      "border-r border-b border-border/30 p-sm flex flex-col gap-xs transition-colors relative group",
                      !isCurrentMonth ? "bg-muted/10 opacity-60" : "bg-background hover:bg-muted/20",
                      isToday(day) && "bg-primary/[0.02]"
                    )}
                  >
                    <div className="flex justify-between items-start mb-1 px-1 pt-1">
                      <span className={cn(
                        "text-xs font-medium h-7 w-7 flex items-center justify-center rounded-md transition-all",
                        isToday(day) 
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105" 
                          : !isCurrentMonth 
                            ? "text-muted-text/50" 
                            : "text-body group-hover:text-primary"
                      )}>
                        {format(day, dateFormat)}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="h-2 w-2 rounded-full bg-primary shadow-sm mt-2.5 mr-1" />
                      )}
                    </div>
                    
                    <ScrollArea className="flex-1 -mx-sm px-sm overflow-hidden border-t border-transparent group-hover:border-border/10 transition-colors">
                      <div className="flex flex-col gap-xs pb-2 mt-1">
                        {dayEvents.map((event: any, idx) => (
                          <div 
                            key={event.id || idx} 
                            className={cn(
                              "text-[10px] p-2 rounded-md border flex flex-col gap-1 transition-colors group/event cursor-default shadow-sm",
                              event.status === 'in_progress' 
                                ? "bg-primary/5 border-primary/20 text-primary" 
                                : "bg-muted/10 border-border/50 text-body hover:bg-muted/30"
                            )}
                          >
                            <div className="font-medium text-heading leading-tight truncate px-1" title={event.templateTitle}>
                              {event.templateTitle}
                            </div>
                            <div className="flex flex-col gap-0.5 pt-1 px-1 opacity-80">
                              <div className="flex items-center gap-1.5 truncate" title={event.locationName}>
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="font-normal text-body truncate">{event.locationName}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate" title={event.auditorName}>
                                <User className="h-3 w-3 flex-shrink-0" />
                                <span className={cn(
                                  "font-medium uppercase tracking-widest text-[9px] truncate text-muted-text", 
                                  !event.assignedAuditorId && "text-warning animate-pulse"
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
