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
import { Input } from '@/components/ui/input';
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
import { CalendarIcon, FileText, Filter, MapPin, Eye, ArrowRight, Search } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  const filteredReports = reports.filter((r) => 
    r.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchReports();
  }, [selectedLocation]);

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-xs">
            <h1 className="page-heading">Audit Archive</h1>
            <p className="body-text">Comprehensive repository of all completed quality submissions</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search reports by templates or location..." 
              className="pl-9 h-11 bg-background text-body font-normal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs uppercase tracking-widest border-border/40 text-muted-text">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="standard-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[300px] flex flex-col gap-2">
                <Label className="text-[10px] font-normal uppercase text-muted-text tracking-widest pl-1">
                  Location Filter
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-10 text-xs font-medium uppercase tracking-widest text-body">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-normal uppercase tracking-widest text-body">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id} className="text-xs font-normal uppercase tracking-widest text-body">{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="outline" 
                onClick={fetchReports} 
                className="h-10 px-6 font-medium uppercase tracking-widest text-[10px] active:scale-95 gap-2 text-muted-text"
              >
                <Filter className="h-3.5 w-3.5" /> Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Audit Blueprint</TableHead>
                <TableHead className="standard-table-head">Branch Intelligence</TableHead>
                <TableHead className="standard-table-head">Completion Timeline</TableHead>
                <TableHead className="standard-table-head text-center">Executive Score</TableHead>
                <TableHead className="standard-table-head text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 [1,2,3,4,5].map(i => (
                  <TableRow key={i} className="animate-pulse">
                     <TableCell colSpan={5} className="h-16 bg-muted/10" />
                  </TableRow>
                 ))
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell py-24 text-center text-muted-text bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-muted/10 p-4 rounded-full">
                          <FileText className="h-8 w-8 opacity-20" />
                        </div>
                        <p className="page-heading text-lg opacity-40 uppercase tracking-[0.2em] font-medium text-heading">No historical reports found for this criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow 
                    key={report.id} 
                    className="standard-table-row group cursor-pointer"
                  >
                        <TableCell className="standard-table-cell">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block space-y-1">
                            <p className="font-normal text-heading text-sm group-hover:text-primary transition-colors uppercase tracking-tight">{report.templateTitle}</p>
                            <p className="text-[10px] text-muted-text font-normal tracking-widest opacity-40 uppercase tabular-nums">ID: {report.id.slice(-8)}</p>
                          </Link>
                        </TableCell>
                        <TableCell className="standard-table-cell">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                            <div className="flex items-center gap-2.5">
                              <MapPin className="h-3.5 w-3.5 text-primary opacity-50" />
                              <span className="text-[11px] font-normal uppercase tracking-tight text-body">{report.locationName}</span>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="standard-table-cell">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block space-y-1">
                            <p className="text-[10px] font-normal text-heading uppercase tracking-widest">{report.completedAt ? format(report.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}</p>
                            <p className="text-[9px] font-normal text-muted-text uppercase tracking-[0.2em] opacity-50">FINALIZED SUBMISSION</p>
                          </Link>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="flex justify-center">
                            <div className={cn(
                              "inline-flex items-center justify-center h-10 w-14 rounded-xl font-medium text-[13px] italic tracking-tighter tabular-nums shadow-lg shadow-black/5",
                              report.scorePercentage >= 90 ? "bg-success text-success-foreground" : report.scorePercentage >= 70 ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                            )}>
                              {report.scorePercentage}%
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-right">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="flex items-center justify-end gap-3 text-muted-text/40 group-hover:text-primary group-hover:translate-x-1 transition-all">
                              <span className="text-[9px] font-normal uppercase tracking-[0.2em] hidden sm:inline">Inspect Intelligence</span>
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
