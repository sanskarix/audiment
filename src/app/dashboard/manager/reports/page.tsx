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

  const filteredReports = reports.filter((r) =>
    r.templateTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.locationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (locations.length > 0) fetchReports();
  }, [selectedLocation]);

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Audit Log</h1>
            <p className="body-text">Comprehensive list of completed audits across your managed locations</p>
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
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="standard-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-end gap-md">
              <div className="flex-1 min-w-[280px] space-y-xs">
                <Label className="text-xs font-normal  tracking-widest text-muted-text">
                  Branch Performance Focus
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-10 bg-background border-input transition-colors text-body">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-normal text-sm cursor-pointer">All Active Branches</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id} className="font-normal text-sm cursor-pointer">{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 sm:pt-0">
                <Button
                  variant="outline"
                  onClick={() => fetchReports()}
                  className="h-10 gap-2 font-medium text-xs  tracking-widest hover:bg-muted/30 shadow-sm transition-all active:scale-95 text-body"
                >
                  <Filter className="h-4 w-4 text-muted-text" /> Sync Log
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Audit Blueprint</TableHead>
                <TableHead className="standard-table-head">Branch Location</TableHead>
                <TableHead className="standard-table-head">Timeline</TableHead>
                <TableHead className="standard-table-head text-center">Score</TableHead>
                <TableHead className="standard-table-head text-right">Action</TableHead>
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
                          ? (locations.length === 0 ? "No assigned locations found." : "No completed records in this range.")
                          : "No reports found matching your search."}
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
	                      <Link href={`/dashboard/manager/reports/${report.id}`} className="flex flex-col gap-1">
	                        <span>{report.templateTitle}</span>
	                        <span className="muted-label opacity-60">ID: {report.id.slice(-8)}</span>
	                      </Link>
	                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="block">
	                        <div className="flex items-center gap-2">
	                          <MapPin className="h-4 w-4 text-primary opacity-60" />
	                          <span>{report.locationName}</span>
	                        </div>
	                      </Link>
	                    </TableCell>
	                    <TableCell className="standard-table-cell">
	                      <Link href={`/dashboard/manager/reports/${report.id}`} className="flex flex-col gap-1">
	                        <span>{report.completedAt ? format(report.completedAt.toDate(), 'MMM d, yyyy') : 'N/A'}</span>
	                        <span className="muted-label opacity-60">Completed</span>
	                      </Link>
	                    </TableCell>
                    <TableCell className="standard-table-cell text-center">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="flex justify-center">
                        <Badge className={cn(
                          "px-3 py-1 font-medium text-xs tracking-widest ",
                          report.scorePercentage >= 90 ? "bg-success text-success-foreground hover:bg-success/90" :
                            report.scorePercentage >= 70 ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                              "bg-warning text-warning-foreground hover:bg-warning/90"
                        )}>
                          {report.scorePercentage}%
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
                      <Link href={`/dashboard/manager/reports/${report.id}`} className="flex items-center justify-end gap-2 text-muted-text group-hover:text-primary transition-colors">
                        <span className="text-[10px] font-medium  tracking-widest hidden sm:inline">View</span>
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
