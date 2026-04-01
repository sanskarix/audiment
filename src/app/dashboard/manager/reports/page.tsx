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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Filter, MapPin, ArrowRight, CheckSquare, Search } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ManagerReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) { }
    }
  }, []);

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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (locations.length > 0) fetchReports();
  }, [selectedLocation]);

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="dashboard-page-container">
          <div className="page-header-section mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-[120px] w-full rounded-xl mb-6" />
          <div className="border border-border/40 rounded-xl overflow-hidden">
            <Skeleton className="h-12 w-full rounded-none" />
            <Skeleton className="h-96 w-full rounded-none mt-2" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  const filteredReports = reports.filter((r) =>
    r.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audit Archive</h1>
            <p className="body-text">Access and export completed audit reports for performance review.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search reports by template or location..."
              className="pl-9 h-11 bg-background text-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn(
                  "h-11 px-4 gap-2 font-medium text-xs border-border/50",
                  selectedLocation !== 'all' ? "text-primary border-primary/20 bg-primary/5" : "text-muted-text"
                )}>
                  <Filter className="h-4 w-4" />
                  {selectedLocation === 'all' ? 'Filters' : locations.find(l => l.id === selectedLocation)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">Filter by Location</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">
                    All Locations
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                  {locations.map(loc => (
                    <DropdownMenuRadioItem key={loc.id} value={loc.id} className="text-body cursor-pointer">
                      {loc.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Reports Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Audit Template</TableHead>
                <TableHead className="standard-table-head">Location</TableHead>
                <TableHead className="standard-table-head">Completed On</TableHead>
                <TableHead className="standard-table-head text-right">Score</TableHead>
                <TableHead className="standard-table-head w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={5} className="h-16 bg-muted/5" />
                  </TableRow>
                ))
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell h-64 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CheckSquare className="h-10 w-10 opacity-20" />
                      <p className="font-normal">
                        {reports.length === 0
                          ? (locations.length === 0 ? "No locations assigned." : "No completed reports.")
                          : "No matching reports found."}
                      </p>
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
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="block">
                        <span className="text-[14px] font-normal text-body group-hover:text-primary transition-colors">{report.templateTitle}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="block">
                        <span className="text-[14px] font-normal text-body">{report.locationName}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="block">
                        <span className="text-[13px] font-normal text-muted-text">{report.completedAt ? format(report.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="flex justify-end">
                        <Badge className={cn(
                          "px-2.5 py-0.5 font-medium text-[11px] rounded-sm",
                          report.scorePercentage >= 90 ? "bg-success/10 text-success hover:bg-success/20" :
                            report.scorePercentage >= 70 ? "bg-primary/10 text-primary hover:bg-primary/20" :
                              "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        )}>
                          {report.scorePercentage}%
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="flex items-center justify-end text-muted-text/30 group-hover:text-primary transition-colors">
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
