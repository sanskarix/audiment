'use client';

import { useState, useEffect } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  ClipboardList,
  Filter,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminCorrectiveActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.organizationId) return;

    // Fetch all open corrective actions for the organization
    const q = query(
      collection(db, 'correctiveActions'),
      where('organizationId', '==', session.organizationId),
      where('status', 'in', ['open', 'in_progress']),
      orderBy('deadline', 'asc')
    );

    const unsubscribe = onSnapshot(q, async (snap) => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // We need manager names if they aren't stored (schema says assignedManagerId is stored)
      // For now we'll just show the ID or fetch names if needed.
      // Better to store managerName in the CA doc during creation for performance.
      // Re-reading DATABASE.md: assignedManagerId is there, but not managerName.
      // I'll fetch manager names for better UX.
      
      const actionsWithExtras = await Promise.all(fetched.map(async (action: any) => {
        if (!action.assignedManagerId) return action;
        const managerSnap = await getDoc(doc(db, 'users', action.assignedManagerId));
        return {
          ...action,
          managerName: managerSnap.exists() ? managerSnap.data().name : 'Unknown Manager'
        };
      }));

      setActions(actionsWithExtras);
      setLoading(false);
    }, (err) => {
      console.error('Snapshot error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const filteredActions = actions.filter((action) => 
    action.locationName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    action.issueDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.managerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="page-heading flex items-center gap-3 font-semibold text-heading">
              <AlertCircle className="h-8 w-8 text-destructive" />
              CRITICAL ACTIONS
            </h1>
            <p className="body-text">Unresolved safety and quality failures requiring immediate executive attention</p>
          </div>
          
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-medium px-4 py-1.5 text-[10px] tracking-tight uppercase">
               {actions.length} OPEN ISSUES
             </Badge>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search actions by location, issue, or manager..." 
              className="pl-9 h-11 bg-background text-body"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs uppercase tracking-widest border-border/40 text-muted-text">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
           <Card className="standard-card border-l-4 border-l-destructive p-6 overflow-hidden relative group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-text">Overdue Tasks</CardTitle>
                <Clock className="h-5 w-5 text-destructive/60" />
              </div>
              <div className="relative z-10">
                <div className="text-4xl font-medium tracking-tight text-destructive">
                  {actions.filter(a => a.deadline?.toDate() < new Date()).length}
                </div>
                <p className="text-xs text-muted-text mt-2 font-normal">Critical mission delays</p>
              </div>
           </Card>

           <Card className="standard-card border-l-4 border-l-warning p-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-text">High Severity</CardTitle>
                <AlertCircle className="h-5 w-5 text-warning/60" />
              </div>
              <div>
                <div className="text-4xl font-medium tracking-tight text-warning">
                  {actions.filter(a => a.severity === 'critical').length}
                </div>
                <p className="text-xs text-muted-text mt-2 font-normal">Immediate business risk</p>
              </div>
           </Card>

           <Card className="standard-card border-l-4 border-l-primary p-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-text">Average TAT</CardTitle>
                <ClipboardList className="h-5 w-5 text-primary/60" />
              </div>
              <div>
                <div className="text-4xl font-medium tracking-tight text-heading">48h</div>
                <p className="text-xs text-muted-text mt-2 font-normal">Target resolution window</p>
              </div>
           </Card>
        </div>

        {/* Actions Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
               <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Location & Responsibility</TableHead>
                <TableHead className="standard-table-head">Issue Blueprint</TableHead>
                <TableHead className="standard-table-head">Severity</TableHead>
                <TableHead className="standard-table-head">Deadline</TableHead>
                <TableHead className="standard-table-head text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={5} className="h-16 bg-white" />
                  </TableRow>
                ))
              ) : actions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell py-24 text-center text-muted-text bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-success/10 p-4 rounded-full">
                          <CheckCircle2 className="h-8 w-8 text-success opacity-40" />
                        </div>
                        <p className="page-heading text-lg opacity-40 uppercase tracking-tight font-medium">All systems operational. No open actions.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredActions.map((action) => (
                  <TableRow key={action.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-normal text-heading text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                          <MapPin className="h-3.5 w-3.5 text-primary opacity-50" /> {action.locationName}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-text text-[10px] font-normal uppercase tracking-tight pl-5 opacity-60">
                          <User className="h-3 w-3" /> {action.managerName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-normal text-body leading-tight">{action.questionText}</p>
                        <p className="text-[10px] text-muted-text italic line-clamp-1 opacity-60 font-normal">{action.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <Badge className={cn(
                        "font-normal text-[9px] tracking-tight px-3 py-1 uppercase rounded-full border-none shadow-sm",
                        action.severity === 'critical' ? "bg-destructive text-white" : "bg-warning text-warning-foreground"
                      )}>
                        {action.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="standard-table-cell">
                      <div className={cn(
                        "flex items-center gap-2 font-normal text-[11px] uppercase tracking-tight tabular-nums",
                        action.deadline?.toDate() < new Date() ? "text-destructive animate-pulse" : "text-muted-text"
                      )}>
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {format(action.deadline?.toDate(), 'MMM d, ha')}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                       <Badge variant="outline" className={cn(
                         "font-normal text-[9px] px-3 py-1 uppercase tracking-tight rounded-lg border-muted/20",
                         action.status === 'in_progress' ? "text-primary border-primary/20 bg-primary/5" : "text-warning border-warning/20 bg-warning/5"
                       )}>
                         {action.status.replace('_', ' ')}
                       </Badge>
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
