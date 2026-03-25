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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Schedule</h1>
            <p className="text-muted-foreground text-sm">Monthly overview of upcoming planned audits.</p>
          </div>
          <div className="flex items-center space-x-4 bg-card px-4 py-2 rounded-lg border shadow-sm">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm font-bold w-32 text-center uppercase tracking-wider text-muted-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="shadow-sm border-muted overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-3 text-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 auto-rows-[140px]">
              {days.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "border-r border-b p-2 flex flex-col gap-1.5 transition-colors relative group",
                      !isCurrentMonth ? "bg-muted/10" : "bg-card hover:bg-muted/30",
                      isToday(day) && "bg-blue-50/30"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <span className={cn(
                        "text-xs font-bold h-6 w-6 flex items-center justify-center rounded-full mt-1 ml-1",
                        isToday(day) ? "bg-blue-600 text-white shadow-sm" : !isCurrentMonth ? "text-muted-foreground/40" : "text-zinc-700 font-semibold"
                      )}>
                        {format(day, dateFormat)}
                      </span>
                      {dayEvents.length > 0 && (
                        <Badge variant="secondary" className="text-[9px] font-bold h-4 px-1.5 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none mt-1 mr-1">
                          {dayEvents.length}
                        </Badge>
                      )}
                    </div>
                    
                    <ScrollArea className="flex-1 -mx-1 px-1">
                      <div className="flex flex-col gap-1.5">
                        {dayEvents.map((event: any, idx) => (
                          <div 
                            key={event.id || idx} 
                            className={cn(
                              "text-xs p-2 rounded-md border flex flex-col gap-1 transition-colors group/event cursor-default shadow-sm",
                              event.status === 'in_progress' ? "bg-indigo-50/80 border-indigo-100" : "bg-white border-muted"
                            )}
                          >
                            <div className="font-bold truncate text-zinc-900 leading-tight" title={event.templateTitle}>
                              {event.templateTitle}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5" title={event.locationName}>
                              <MapPin className="h-3 w-3 flex-shrink-0 text-zinc-400" />
                              <span className="truncate">{event.locationName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground" title={event.auditorName}>
                              <User className="h-3 w-3 flex-shrink-0 text-zinc-400" />
                              <span className={cn("truncate", !event.assignedAuditorId && "italic opacity-80 text-rose-500 font-medium")}>
                                {event.auditorName}
                              </span>
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
