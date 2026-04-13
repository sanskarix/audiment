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
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CalendarIcon,
  Plus,
  Search,
  Filter,
  ArrowRight,
  FileText,
  Award
} from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { format, startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthSync } from '@/components/AuthProvider';

export default function AdminReportsPage() {
  const { isSynced, orgId } = useAuthSync();
  const [reports, setReports] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({
    start: null,
    end: null
  });

  // No longer needed

  useEffect(() => {
    if (!isSynced || !orgId) return;
    async function fetchInitialData() {
      try {
        console.log('Admin Reports - Fetching locations for org:', orgId);
        const locationsSnap = await getDocs(query(
          collection(db, 'locations'),
          where('organizationId', '==', orgId)
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
    if (orgId) {
      fetchInitialData();
    }
  }, [orgId, isSynced]);

  async function fetchReports() {
    setLoading(true);
    try {
      if (!orgId) return;

      console.log('Admin Reports - Fetching completed audits for org:', orgId);
      let q = query(
        collection(db, 'audits'),
        where('organizationId', '==', orgId),
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
    if (!isSynced) return;
    fetchReports();
  }, [selectedLocation, isSynced]);

  if (loading) {
    return (
      <DashboardShell role="admin">
        <div className="dashboard-page-container">
          <div className="page-header-section mb-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="page-heading">Reports</h1>
              <p className="body-text text-muted-text">View and manage all completed audit reports.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn(
                  "h-11 px-4 gap-2 font-medium text-xs border-border/50",
                  selectedLocation !== 'all' ? "text-primary border-primary/20 bg-primary/5" : "text-[#6b7280]"
                )}>
                  <Filter className="h-4 w-4" />
                  {selectedLocation === 'all' ? 'Filters' : locations.find(l => l.id === selectedLocation)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">Filter by location</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">
                    All locations
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
                <TableHead className="standard-table-head">Template</TableHead>
                <TableHead className="standard-table-head">Location</TableHead>
                <TableHead className="standard-table-head">Date</TableHead>
                <TableHead className="standard-table-head text-right">Score</TableHead>
                <TableHead className="standard-table-head w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell py-24 text-center bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-muted/10 p-4 rounded-full">
                        <FileText className="h-8 w-8 opacity-20" />
                      </div>
                      <p className="page-heading opacity-40">No matching reports found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="standard-table-row group"
                  >
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                        <span className="text-[14px] font-normal text-body group-hover:text-primary transition-colors">{report.templateTitle}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                        <span className="text-[14px] font-normal text-body">{report.locationName}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                        <span className="text-[14px] font-normal text-body">{report.completedAt ? format(report.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
                      <Link href={`/dashboard/admin/reports/${report.id}`} className="block">
                        <span className={cn(
                          "text-[14px] font-medium tabular-nums",
                          report.scorePercentage < 70 ? "text-destructive" : report.scorePercentage >= 90 ? "text-success" : "text-primary"
                        )}>
                          {report.scorePercentage}%
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <Link href={`/dashboard/admin/reports/${report.id}`} className="flex items-center justify-end text-muted-text/30 group-hover:text-primary group-hover:translate-x-1 transition-all">
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
