'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, onSnapshot, limit, doc, getDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/app-ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, MapPin, User } from 'lucide-react';
import { Button } from '@/components/app-ui/button';
import { Badge } from '@/components/app-ui/badge';
import { cn } from '@/lib/utils';
import { useAuthSync } from '@/components/AuthProvider';

const toDate = (val: any): Date | null => {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate();
  if (val instanceof Date) return val;
  if (typeof val === 'number') return new Date(val);
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

export default function ManagerCalendarPage() {
  const { isSynced, uid, orgId } = useAuthSync();
  const [audits, setAudits] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSynced) return;
    if (!uid || !orgId) {
      setLoading(false);
      return;
    }

    async function fetchCalendarData() {
      try {
        let locationIds: string[] = [];
        
        const userRef = doc(db, 'users', uid!);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();
        
        if (userData?.assignedLocationIds?.length || userData?.assignedLocations?.length || userData?.managedLocationIds?.length || userData?.locationIds?.length) {
          locationIds = userData?.assignedLocationIds || userData?.assignedLocations || userData?.managedLocationIds || userData?.locationIds || [];
        }
        
        if (locationIds.length === 0) {
          const snap1 = await getDocs(query(
            collection(db, 'locations'),
            where('organizationId', '==', orgId!),
            where('assignedManagerIds', 'array-contains', uid!)
          )).catch(() => ({ docs: [] }));
          const snap2 = await getDocs(query(
            collection(db, 'locations'),
            where('organizationId', '==', orgId!),
            where('managerIds', 'array-contains', uid!)
          )).catch(() => ({ docs: [] }));
          const snap3 = await getDocs(query(
            collection(db, 'locations'),
            where('organizationId', '==', orgId!),
            where('assignedManagerId', '==', uid!)
          )).catch(() => ({ docs: [] }));
          const snap4 = await getDocs(query(
            collection(db, 'locations'),
            where('organizationId', '==', orgId!),
            where('managerId', '==', uid!)
          )).catch(() => ({ docs: [] }));
          
          const foundIds = new Set<string>();
          snap1.docs.forEach((d: any) => foundIds.add(d.id));
          snap2.docs.forEach((d: any) => foundIds.add(d.id));
          snap3.docs.forEach((d: any) => foundIds.add(d.id));
          snap4.docs.forEach((d: any) => foundIds.add(d.id));
          locationIds = Array.from(foundIds);

          if (locationIds.length === 0) {
            const allLocs = await getDocs(query(
              collection(db, 'locations'),
              where('organizationId', '==', orgId!)
            )).catch(() => ({ docs: [] }));
            locationIds = allLocs.docs.map((d: any) => d.id);
          }
        }

        const usersSnap = await getDocs(query(collection(db, 'users'), where('organizationId', '==', orgId!)));
        const usersMap = new Map();
        usersSnap.forEach(doc => usersMap.set(doc.id, doc.data().name || doc.data().email));

        const auditsQuery = query(
          collection(db, 'audits'),
          where('organizationId', '==', orgId!)
        );

        const snap = await getDocs(auditsQuery);
        let allAudits = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

        if (locationIds.length > 0) {
          const locSet = new Set(locationIds);
          const filtered = allAudits.filter(a => 
            locSet.has(a.locationId) || a.assignedManagerId === uid || a.managerId === uid
          );
          if (filtered.length > 0) {
            allAudits = filtered;
          }
        }

        const fetchedAudits = allAudits.map(data => {
          const parsedDate = toDate(data.scheduledDate) || toDate(data.completedAt) || toDate(data.createdAt);
          return {
            ...data,
            titleText: data.templateTitle || data.title || 'Audit',
            auditorName: data.assignedAuditorId ? (usersMap.get(data.assignedAuditorId) || 'Assigned') : 'Unassigned',
            parsedDate
          };
        }).filter((a: any) => a.isSurprise !== true && a.parsedDate);

        setAudits(fetchedAudits);
        setLoading(false);
      } catch (e) {
        console.error("[ManagerCalendar] Error fetching calendar data:", e);
        setLoading(false);
      }
    }

    fetchCalendarData();
  }, [uid, orgId, isSynced]);

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
    <DashboardShell role="manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="page-heading">Calendar</h1>
            <p className="body-text">View and manage audit schedules for your locations.</p>
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
              <h2 className="text-[14px] font-semibold text-heading">
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
                <div key={day} className="py-3 text-center text-[11px] font-medium text-muted-text">
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
                            : "text-body group-hover:text-primary"
                      )}>
                        {format(day, dateFormat)}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="text-[9px] font-bold text-primary/60 mr-1">
                          {dayEvents.length} {dayEvents.length === 1 ? 'Audit' : 'Audits'}
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
                              event.status === 'in_progress' && !isExpanded && "border-l-2 border-l-primary",
                              event.status === 'completed' && !isExpanded && "border-l-2 border-l-success"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full shrink-0",
                                event.status === 'completed' ? "bg-success" :
                                event.status === 'in_progress' ? "bg-primary" :
                                event.status === 'missed' ? "bg-destructive" :
                                "bg-amber-500"
                              )} />
                              <div className={cn(
                                "font-medium text-heading leading-tight truncate text-[12px]",
                                isExpanded && "whitespace-normal text-[13px] font-semibold"
                              )}>
                                {event.titleText}
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
                                    !event.assignedAuditorId && "text-amber-500 italic font-medium"
                                  )}>
                                    {event.auditorName || 'Unassigned'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider",
                                    event.status === 'completed' ? "bg-success/10 text-success" :
                                    event.status === 'in_progress' ? "bg-primary/10 text-primary" :
                                    event.status === 'scheduled' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                                    event.status === 'missed' ? "bg-destructive/10 text-destructive" :
                                    "bg-muted/20 text-muted-text"
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
