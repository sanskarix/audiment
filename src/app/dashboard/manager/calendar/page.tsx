'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.uid || !session?.organizationId) return;

    let unsubscribe = () => { };

    async function fetchCalendarData() {
      try {
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

        const usersSnap = await getDocs(query(collection(db, 'users'), where('organizationId', '==', session.organizationId)));
        const usersMap = new Map();
        usersSnap.forEach(doc => usersMap.set(doc.id, doc.data().name));

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

  const [expandedAuditId, setExpandedAuditId] = useState<string | null>(null);

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Calendar</h1>
          </div>

          <div className="flex items-center gap-2 bg-muted/20 p-1 rounded-lg border border-border/50 shadow-sm">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="h-8 w-8 hover:bg-background transition-all active:scale-95 border-border/50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 min-w-[140px] text-center">
              <h2 className="text-[12px] font-semibold tracking-widest text-[#6b7280] uppercase">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="h-8 w-8 hover:bg-background transition-all active:scale-95 border-border/50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="standard-card">
          <CardContent className="p-0 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border/50 bg-muted/10">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-3 text-center text-[10px] font-bold tracking-widest text-[#6b7280] uppercase">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
              {days.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      "border-r border-b border-border/30 p-2 flex flex-col gap-1 transition-colors relative group min-h-[120px]",
                      !isCurrentMonth ? "bg-muted/5 opacity-40" : "bg-background hover:bg-muted/5",
                      isToday(day) && "bg-primary/[0.02]"
                    )}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn(
                        "text-[11px] font-semibold h-7 w-7 flex items-center justify-center rounded-lg transition-all",
                        isToday(day)
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : !isCurrentMonth
                            ? "text-muted-text/30"
                            : "text-[#45474d] group-hover:text-primary"
                      )}>
                        {format(day, dateFormat)}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="text-[9px] font-bold text-primary/40 mr-1">
                          {dayEvents.length} {dayEvents.length === 1 ? 'Mission' : 'Missions'}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1 overflow-y-auto no-scrollbar max-h-[140px]">
                      {dayEvents.map((event, idx) => {
                        const isExpanded = expandedAuditId === event.id;
                        return (
                          <div
                            key={event.id || idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedAuditId(isExpanded ? null : event.id);
                            }}
                            className={cn(
                              "text-[10px] p-2 rounded-lg border transition-all duration-150 cursor-pointer select-none bg-background",
                              isExpanded 
                                ? "border-primary/40 shadow-sm z-10 translate-x-0.5" 
                                : "border-border/50 text-body hover:border-primary/20",
                              event.status === 'in_progress' && !isExpanded && "border-l-2 border-l-primary"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full shrink-0",
                                event.status === 'in_progress' ? "bg-primary" : "bg-muted-text/30"
                              )} />
                              <div className={cn(
                                "font-medium text-heading leading-tight truncate",
                                isExpanded && "whitespace-normal text-[11px] font-semibold"
                              )}>
                                {event.templateTitle}
                              </div>
                            </div>
                            
                            {isExpanded && (
                              <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-border/30 animate-in fade-in duration-200">
                                <div className="flex items-center gap-2 text-muted-text">
                                  <MapPin className="h-3 w-3 shrink-0 text-primary/40" />
                                  <span className="font-normal leading-none">{event.locationName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-text/80">
                                  <User className="h-3 w-3 shrink-0 opacity-30" />
                                  <span className={cn(
                                    "font-normal leading-none",
                                    !event.assignedAuditorId && "text-warning italic font-medium"
                                  )}>
                                    {event.auditorName || 'Unassigned'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider",
                                    event.status === 'in_progress' ? "bg-primary/10 text-primary" : "bg-muted/10 text-muted-text"
                                  )}>
                                    {event.status.replace('_', ' ')}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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
