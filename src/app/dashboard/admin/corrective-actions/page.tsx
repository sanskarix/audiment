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
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminCorrectiveActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

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

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section">
          <div>
            <h1 className="page-heading flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-destructive animate-pulse" />
              CRITICAL ACTIONS
            </h1>
            <p className="body-text">Unresolved safety and quality failures requiring immediate executive attention</p>
          </div>
          
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-bold px-4 py-1.5 text-[10px] tracking-tight uppercase">
               {actions.length} OPEN ISSUES
             </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="standard-card bg-foreground text-background overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent opacity-50" />
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-muted-foreground/60 text-xs font-medium text-muted-foreground">Overdue Tasks</CardDescription>
                <CardTitle className="text-3xl font-bold tabular-nums text-white">
                  {actions.filter(a => a.deadline?.toDate() < new Date()).length}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pt-2">
                <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-tight">CRITICAL MISSION DELAYS</p>
              </CardContent>
           </Card>

           <Card className="standard-card overflow-hidden relative border-destructive/20 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardDescription className="text-destructive text-xs font-medium text-muted-foreground opacity-70">High Severity</CardDescription>
                <CardTitle className="text-3xl font-bold tabular-nums text-destructive">
                  {actions.filter(a => a.severity === 'critical').length}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[10px] text-destructive/60 font-bold uppercase tracking-tight">IMMEDIATE BUSINESS RISK</p>
              </CardContent>
           </Card>

           <Card className="standard-card overflow-hidden relative">
              <CardHeader className="pb-2">
                <CardDescription className="text-muted-foreground text-xs font-medium text-muted-foreground">Average TAT</CardDescription>
                <CardTitle className="text-3xl font-bold tabular-nums text-foreground">48h</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-tight">TARGET RESOLUTION WINDOW</p>
              </CardContent>
           </Card>
        </div>

        {/* Actions Table */}
        <Card className="standard-card">
          <Table>
            <TableHeader >
              <TableRow >
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Location & Responsibility</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Issue Blueprint</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Severity</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground">Deadline</TableHead>
                <TableHead className="h-11 text-xs font-medium text-muted-foreground text-center">Status</TableHead>
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
                  <TableCell colSpan={5} className="py-24 text-center text-muted-foreground bg-muted/5">
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-success/10 p-4 rounded-full">
                          <CheckCircle2 className="h-8 w-8 text-success opacity-40" />
                        </div>
                        <p className="page-heading text-lg opacity-40 uppercase tracking-tight">All systems operational. No open actions.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                actions.map((action) => (
                  <TableRow key={action.id} className="border-b last:border-0 transition-colors hover:bg-muted/40">
                    <TableCell className="px-4 py-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                          <MapPin className="h-3.5 w-3.5 text-primary opacity-50" /> {action.locationName}
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold uppercase tracking-tight pl-5 opacity-60">
                          <User className="h-3 w-3" /> {action.managerName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-foreground leading-tight">{action.questionText}</p>
                        <p className="text-[10px] text-muted-foreground italic line-clamp-1 opacity-60">{action.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge className={cn(
                        "font-bold text-[9px] tracking-tight px-3 py-1 uppercase rounded-full border-none shadow-sm",
                        action.severity === 'critical' ? "bg-destructive text-white" : "bg-warning text-warning-foreground"
                      )}>
                        {action.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className={cn(
                        "flex items-center gap-2 font-bold text-[11px] uppercase tracking-tight tabular-nums",
                        action.deadline?.toDate() < new Date() ? "text-destructive animate-pulse" : "text-muted-foreground"
                      )}>
                        <Clock className="h-3.5 w-3.5 opacity-50" />
                        {format(action.deadline?.toDate(), 'MMM d, ha')}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-center">
                       <Badge variant="outline" className={cn(
                         "font-bold text-[9px] px-3 py-1 uppercase tracking-tight rounded-lg border-muted/20",
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
