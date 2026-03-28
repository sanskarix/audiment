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
import { Filter, MapPin, ArrowRight, Loader2, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ManagerReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  
  // Filters
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.uid) return;

    async function fetchInitialData() {
      try {
        const locationsSnap = await getDocs(query(
          collection(db, 'locations'), 
          where('assignedManagerId', '==', session.uid)
        ));
        const locs = locationsSnap.docs.map(d => ({ id: d.id, name: d.data().name }));
        setLocations(locs);
        
        const locIds = locs.map(l => l.id);
        if (locIds.length > 0) {
            await fetchReports(locIds);
        } else {
            setReports([]);
            setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, [session]);

  const fetchReports = async (ids?: string[]) => {
    setLoading(true);
    try {
      const activeIds = ids || locations.map(l => l.id);
      if (activeIds.length === 0) {
        setReports([]);
        return;
      }

      let q = query(
        collection(db, 'audits'),
        where('status', '==', 'completed'),
        where('locationId', 'in', activeIds),
        orderBy('completedAt', 'desc')
      );

      const snap = await getDocs(q);
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
  };

  useEffect(() => {
    if (locations.length > 0) fetchReports();
  }, [selectedLocation]);

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading">Audit Log</h1>
            <p className="body-text">Comprehensive list of completed audits across your managed locations</p>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="standard-card">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex-1 min-w-[280px] space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground tracking-tight pl-1">
                  Branch Performance Focus
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-11 bg-muted/20 border-muted rounded-md focus:ring-primary/10 transition-all">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent className="">
                    <SelectItem value="all" className="rounded-lg h-10 font-bold text-xs cursor-pointer">All Active Branches</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-10 font-bold text-xs cursor-pointer">{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pb-0.5">
                <Button 
                  variant="outline" 
                  onClick={() => fetchReports()} 
                  className="h-11 px-6 font-bold uppercase tracking-tight text-[10px] border-muted bg-muted/5 hover:bg-muted/10 transition-all active:scale-95 gap-2.5"
                >
                  <Filter className="h-3.5 w-3.5 opacity-50" /> Sync Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader >
              <TableRow >
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Audit Blueprint</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Branch Intelligence</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Timeline</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground text-center">Score</TableHead>
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
                          <CheckSquare className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="page-heading text-lg opacity-40 uppercase tracking-tight">
                          {locations.length === 0 ? "No assigned locations found." : "No completed records in this range."}
                        </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow 
                    key={report.id} 
                    className="border-b last:border-0 transition-colors hover:bg-muted/40 cursor-pointer"
                  >
                        <TableCell className="px-4 py-3">
                          <Link href={`/dashboard/manager/reports/${report.id}`} className="block space-y-1">
                            <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors uppercase tracking-tight">{report.templateTitle}</p>
                            <p className="text-[10px] text-muted-foreground font-bold tracking-tight opacity-40 uppercase tabular-nums">{report.id.slice(-8)}</p>
                          </Link>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Link href={`/dashboard/manager/reports/${report.id}`} className="block">
                            <div className="flex items-center gap-2.5">
                              <MapPin className="h-3.5 w-3.5 text-primary opacity-50" />
                              <span className="text-[11px] font-bold uppercase tracking-tight text-foreground/80">{report.locationName}</span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Link href={`/dashboard/manager/reports/${report.id}`} className="block space-y-1">
                            <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">{report.completedAt ? format(report.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight opacity-50">COMPLETED</p>
                          </Link>
                        </TableCell>
                        <TableCell className="px-4 py-3">
                          <Link href={`/dashboard/manager/reports/${report.id}`} className="flex justify-center">
                            <div className={cn(
                              "inline-flex items-center justify-center h-10 w-14 rounded-md font-bold text-[13px] tracking-tight tabular-nums shadow-lg shadow-black/5",
                              report.scorePercentage >= 90 ? "bg-success text-success-foreground" : report.scorePercentage >= 70 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                            )}>
                              {report.scorePercentage}%
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="px-6 py-5 text-right">
                          <Link href={`/dashboard/manager/reports/${report.id}`} className="flex items-center justify-end gap-3 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all">
                              <span className="text-[9px] font-bold uppercase hidden sm:inline">Inspect Report</span>
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
