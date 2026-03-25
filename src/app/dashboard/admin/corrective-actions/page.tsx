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
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-rose-500" />
              CRITICAL ACTIONS
            </h2>
            <p className="text-zinc-500 font-medium pt-1">Unresolved safety and quality failures requiring immediate attention</p>
          </div>
          
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-100 font-black px-3 py-1 text-xs">
               {actions.length} OPEN ISSUES
             </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="shadow-sm border-zinc-200 bg-zinc-950 text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
              <CardHeader className="pb-2 relative z-10">
                <CardDescription className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Overdue Tasks</CardDescription>
                <CardTitle className="text-4xl font-black tabular-nums">
                  {actions.filter(a => a.deadline?.toDate() < new Date()).length}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-xs text-zinc-500 font-medium">Critical issues past their resolution deadline</p>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-zinc-200 overflow-hidden relative">
              <CardHeader className="pb-2">
                <CardDescription className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">High Severity</CardDescription>
                <CardTitle className="text-4xl font-black tabular-nums">
                  {actions.filter(a => a.severity === 'critical').length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-500 font-medium">Items that could cause serious business risk</p>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-zinc-200 overflow-hidden relative">
              <CardHeader className="pb-2">
                <CardDescription className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Average TAT</CardDescription>
                <CardTitle className="text-4xl font-black tabular-nums">48h</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-zinc-500 font-medium">Target turn-around time for resolution</p>
              </CardContent>
           </Card>
        </div>

        {/* Actions Table */}
        <Card className="shadow-sm border-zinc-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-50 border-b border-zinc-200">
              <TableRow>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Location & Manager</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Issue Description</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Severity</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4">Deadline</TableHead>
                <TableHead className="font-bold text-[11px] text-zinc-500 uppercase py-4 text-center">Status</TableHead>
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
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-medium bg-zinc-50/30">
                    <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500 opacity-20" />
                        <p>No open corrective actions found. All systems are green.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                actions.map((action) => (
                  <TableRow key={action.id} className="hover:bg-zinc-50 transition-colors">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-rose-500" /> {action.locationName}
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-medium">
                          <User className="h-3 w-3" /> {action.managerName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm font-bold text-zinc-900 leading-tight">{action.questionText}</p>
                      <p className="text-[11px] text-zinc-400 italic line-clamp-1 mt-0.5">{action.description}</p>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={cn(
                        "font-black text-[10px] tracking-widest px-2 py-0.5",
                        action.severity === 'critical' ? "bg-rose-500 hover:bg-rose-600" : "bg-amber-500 hover:bg-amber-600"
                      )}>
                        {action.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className={cn(
                        "flex items-center gap-1.5 font-black text-[11px] uppercase tracking-wider",
                        action.deadline?.toDate() < new Date() ? "text-rose-600" : "text-zinc-600"
                      )}>
                        <Clock className="h-3.5 w-3.5" />
                        {format(action.deadline?.toDate(), 'MMM d, ha')}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                       <Badge variant="outline" className={cn(
                         "bg-white font-bold text-[10px] px-2 py-1 border-zinc-200",
                         action.status === 'in_progress' ? "text-indigo-600 border-indigo-100 bg-indigo-50" : "text-amber-600"
                       )}>
                         {action.status.replace('_', ' ').toUpperCase()}
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
