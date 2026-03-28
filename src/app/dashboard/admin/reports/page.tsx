'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar as CalendarIcon, FileText, Filter, MapPin, Eye, ArrowRight } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [session, setSession] = useState<{ organizationId: string } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null
  });

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        if (!session?.organizationId) return;
        
        console.log('Admin Reports - Fetching locations for org:', session.organizationId);
        const locationsSnap = await getDocs(query(
          collection(db, 'locations'),
          where('organizationId', '==', session.organizationId)
        ));
        console.log('Admin Reports - Locations found:', locationsSnap.size);
        setLocations(locationsSnap.docs.map(d => ({ id: d.id, name: d.data().name })));
        
        await fetchReports();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (session?.organizationId) {
      fetchInitialData();
    }
  }, [session]);

  async function fetchReports() {
    setLoading(true);
    try {
      if (!session?.organizationId) return;

      console.log('Admin Reports - Fetching completed audits for org:', session.organizationId);
      let q = query(
        collection(db, 'audits'),
        where('organizationId', '==', session.organizationId),
        where('status', '==', 'completed'),
        orderBy('completedAt', 'desc')
      );

      const snap = await getDocs(q);
      console.log('Admin Reports - Audit reports found:', snap.size);
      let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));

      if (selectedLocation !== 'all') {
        fetched = fetched.filter(r => r.locationId === selectedLocation);
      }

      setReports(fetched);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, [selectedLocation]);

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Audit Archive</h1>
            <p className="body-text">Comprehensive repository of all completed quality submissions</p>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="standard-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex-1 min-w-[280px] space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">
                  Location Intelligence Filter
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-11 bg-muted/20 border-muted rounded-xl focus:ring-primary/10 transition-all">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-muted/20 shadow-xl p-1.5">
                    <SelectItem value="all" className="rounded-lg h-10 font-bold text-xs cursor-pointer">All Global Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-10 font-bold text-xs cursor-pointer">{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pb-0.5">
                <Button 
                  variant="outline" 
                  onClick={fetchReports} 
                  className="h-11 px-6 font-black uppercase tracking-widest text-[10px] border-muted bg-muted/5 hover:bg-muted/10 transition-all active:scale-95 gap-2.5"
                >
                  <Filter className="h-3.5 w-3.5 opacity-50" /> Update Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-muted/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest opacity-50">Audit Blueprint</TableHead>
                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest opacity-50">Branch Intelligence</TableHead>
                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest opacity-50">Completion Timeline</TableHead>
                <TableHead className="py-5 px-6 font-black uppercase text-[10px] tracking-widest opacity-50 text-center">Executive Score</TableHead>
                <TableHead className="py-5 px-6 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 [1,2,3,4,5].map(i => (
                  <TableRow key={i} className="animate-pulse">
                     <TableCell colSpan={5} className="h-16 bg-zinc-50/50" />
                  </TableRow>
                 ))
              ) : reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center text-muted-foreground bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-muted/10 p-4 rounded-full">
                          <FileText className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="page-heading text-lg opacity-40 uppercase tracking-[0.2em]">No historical reports found for this criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow 
                    key={report.id} 
                    className="hover:bg-muted/10 transition-all border-b border-muted/10 group cursor-pointer"
                  >
                        <TableCell className="px-6 py-5">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block space-y-1">
                            <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors uppercase tracking-tight">{report.templateTitle}</p>
                            <p className="text-[10px] text-muted-foreground font-black tracking-widest opacity-40 uppercase tabular-nums">{report.id.slice(-8)}</p>
                          </Link>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                            <div className="flex items-center gap-2.5">
                              <MapPin className="h-3.5 w-3.5 text-primary opacity-50" />
                              <span className="text-[11px] font-black uppercase tracking-tight text-foreground/80">{report.locationName}</span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block space-y-1">
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">{report.completedAt ? format(report.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">FINALIZED SUBMISSION</p>
                          </Link>
                        </TableCell>
                        <TableCell className="px-6 py-5">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="flex justify-center">
                            <div className={cn(
                              "inline-flex items-center justify-center h-10 w-14 rounded-xl font-black text-[13px] italic tracking-tighter tabular-nums shadow-lg shadow-black/5",
                              report.scorePercentage >= 90 ? "bg-success text-success-foreground" : report.scorePercentage >= 70 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                            )}>
                              {report.scorePercentage}%
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="flex items-center justify-end gap-3 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all">
                              <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden sm:inline">Inspect Intelligence</span>
                              <ArrowRight className="h-4 w-4" />
                          </Link>
                        </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardShell>
  );
}
