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
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null
  });

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const locationsSnap = await getDocs(collection(db, 'locations'));
        setLocations(locationsSnap.docs.map(d => ({ id: d.id, name: d.data().name })));
        
        await fetchReports();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'audits'),
        where('status', '==', 'completed'),
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
  }

  useEffect(() => {
    fetchReports();
  }, [selectedLocation]);

  return (
    <DashboardShell role="Admin">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Archive</h2>
          <p className="text-muted-foreground pt-1">Comprehensive repository of all completed quality submissions</p>
        </div>

        {/* Filters Card */}
        <Card className="shadow-sm border-zinc-200">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pl-1 pb-1.5 flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" /> Location Filter
                </p>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-zinc-50 border-zinc-200">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end h-full pt-4">
                <Button variant="outline" onClick={fetchReports} className="font-bold gap-2 text-zinc-600 border-zinc-200">
                  <Filter className="h-4 w-4" /> REFRESH LIST
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="shadow-sm border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50 border-b border-zinc-200">
              <TableRow>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Audit Details</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Branch</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Completion Date</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4 text-center">Score</TableHead>
                <TableHead className="text-right py-4"></TableHead>
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
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                    No results found for current filters
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow 
                    key={report.id} 
                    className="hover:bg-zinc-50 transition-colors cursor-pointer group"
                  >
                        <TableCell className="py-4 font-medium">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                            <p className="font-bold text-zinc-950 text-sm">{report.templateTitle}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">#{report.id.slice(-8).toUpperCase()}</p>
                          </Link>
                        </TableCell>
                        <TableCell className="py-4">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                            <div className="flex items-center gap-1.5 text-zinc-600 font-medium text-sm">
                              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                              {report.locationName}
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="py-4 text-zinc-600 text-sm font-medium">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                            {report.completedAt ? format(report.completedAt.toDate(), 'MMMM d, yyyy') : 'N/A'}
                          </Link>
                        </TableCell>
                        <TableCell className="py-4 text-center">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="flex justify-center">
                            <div className={cn(
                              "inline-flex items-center justify-center h-8 w-12 rounded-lg font-black text-[12px] shadow-sm",
                              report.scorePercentage >= 90 ? "bg-emerald-500 text-white" : report.scorePercentage >= 70 ? "bg-indigo-500 text-white" : "bg-rose-500 text-white"
                            )}>
                              {report.scorePercentage}%
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <Link href={`/dashboard/admin/reports/${report.id}`} className="flex items-center justify-end gap-2 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">View Full Report</span>
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
