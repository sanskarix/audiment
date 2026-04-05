'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db, auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  BarChart3,
  Key,
  MoreHorizontal,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  ClipboardList
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Auditor {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: string;
  status?: 'active' | 'inactive';
  isActive?: boolean;
  flashmobAccess?: boolean;
  lastActive?: any;
  createdAt?: any;
  assignedLocations?: string[];
}

export default function AuditorsPage() {
  const router = useRouter();
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [teamAuditsCount, setTeamAuditsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add Auditor State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAuditorName, setNewAuditorName] = useState('');
  const [newAuditorEmail, setNewAuditorEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        setSession(JSON.parse(decodeURIComponent(match[1])));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!session?.uid || !session?.organizationId) return;

    const fetchData = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('organizationId', '==', session.organizationId),
          where('managerId', '==', session.uid),
          where('role', '==', 'AUDITOR')
        );
        const snapshot = await getDocs(q);
        const fetchedAuditors = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Auditor[];
        setAuditors(fetchedAuditors);
        
        const auditorIds = fetchedAuditors.map(a => a.id).filter(id => !!id);
        if (auditorIds.length > 0) {
          const auditsQuery = query(
            collection(db, 'audits'),
            where('assignedAuditorId', 'in', auditorIds.slice(0, 30))
          );
          const snap = await getDocs(auditsQuery);
          setTeamAuditsCount(snap.size);
          setLoading(false);
        } else {
          setTeamAuditsCount(0);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching auditors:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const toggleField = async (auditorId: string, field: string, currentValue: boolean) => {
    setIsUpdating(auditorId + field);
    try {
      const userRef = doc(db, 'users', auditorId);
      await updateDoc(userRef, {
        [field]: !currentValue,
        ...(field === 'isActive' ? { status: !currentValue ? 'active' : 'inactive' } : {})
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(`Reset link sent to ${email}`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error: any) {
      console.error("Error sending reset link:", error);
    }
  };

  const handleAddAuditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditorName || !newAuditorEmail || !session) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'users'), {
        name: newAuditorName,
        email: newAuditorEmail,
        role: 'AUDITOR',
        organizationId: session.organizationId,
        managerId: session.uid,
        status: 'active',
        isActive: true,
        flashmobAccess: false,
        createdAt: serverTimestamp(),
      });

      setNewAuditorName('');
      setNewAuditorEmail('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding auditor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAuditors = auditors.filter(auditor => {
    const matchesSearch = 
      auditor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auditor.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? auditor.isActive : !auditor.isActive);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Auditors</h1>
            <p className="body-text">Manage and track the performance of your auditor team.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 px-5 gap-2 font-medium text-xs shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <UserPlus className="h-4 w-4" /> add auditor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-semibold text-heading">Add Auditor</DialogTitle>
                <DialogDescription className="text-muted-text text-sm">
                  Add a new auditor to your team.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAuditor}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-body font-normal">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Liam Smith"
                      value={newAuditorName}
                      onChange={(e) => setNewAuditorName(e.target.value)}
                      required
                      className="h-10 text-body bg-background border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-body font-normal">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="liam@audiment.com"
                      value={newAuditorEmail}
                      onChange={(e) => setNewAuditorEmail(e.target.value)}
                      required
                      className="h-10 text-body bg-background border-border/50"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-normal text-sm">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="font-normal text-sm">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    add auditor
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Team Size</p>
              <Users className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-heading tabular-nums leading-tight">{auditors.length}</div>
              <p className="body-text mt-2 font-normal">Total auditors</p>
            </div>
          </Card>
          
          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Compliance</p>
              <Clock className="h-4 w-4 text-success/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-success tabular-nums leading-tight">100%</div>
              <p className="body-text mt-2 font-normal">Overall team performance</p>
            </div>
          </Card>

          <Card className="standard-card p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="section-heading">Missions</p>
              <ClipboardList className="h-4 w-4 text-primary/40 transition-colors" />
            </div>
            <div>
              <div className="text-[32px] font-semibold tracking-tight text-primary tabular-nums leading-tight">{teamAuditsCount}</div>
              <p className="body-text mt-2 font-normal">Active assignments</p>
            </div>
          </Card>
        </div>

        {successMessage && (
          <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl text-xs font-semibold animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMessage}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search auditors by name or email..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/50 placeholder:text-muted-text/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {statusFilter !== 'all' && (
              <Button 
                variant="ghost" 
                onClick={() => setStatusFilter('all')}
                className="h-11 px-3 text-[11px] font-medium text-muted-text hover:text-destructive transition-colors group"
              >
                <X className="h-3 w-3 mr-1.5 opacity-40 group-hover:opacity-100" />
                Clear
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={cn(
                  "h-11 px-4 gap-2 font-medium text-xs border-border/50",
                  statusFilter !== 'all' ? "text-primary border-primary/20 bg-primary/5" : "text-muted-text"
                )}>
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-normal text-muted-text/50 px-2 py-1.5">Availability Status</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                  <DropdownMenuRadioItem value="all" className="text-body cursor-pointer">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="active" className="text-body cursor-pointer">Active Only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="inactive" className="text-body cursor-pointer">Inactive Only</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Card className="standard-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="standard-table-head pl-6 py-5">Name</TableHead>
                  <TableHead className="standard-table-head py-5">Email</TableHead>
                  <TableHead className="standard-table-head text-center py-5">Status</TableHead>
                  <TableHead className="standard-table-head text-center py-5">Flash Audit</TableHead>
                  <TableHead className="standard-table-head text-right pr-6 py-5 w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="standard-table-cell h-32 text-center text-muted-text">
                      No auditors found in your reporting list.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAuditors.map((auditor) => (
                    <TableRow 
                      key={auditor.id} 
                      className="standard-table-row group h-[72px] cursor-pointer hover:bg-muted/5 transition-colors"
                      onClick={() => router.push(`/dashboard/manager/auditors/${auditor.id}`)}
                    >
                      <TableCell className="standard-table-cell pl-6">
                        <span className="text-[14px] font-normal text-heading">{auditor.name}</span>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <span className="text-[13px] font-normal text-body">{auditor.email}</span>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={auditor.isActive ?? true}
                            onCheckedChange={() => toggleField(auditor.id, 'isActive', auditor.isActive ?? true)}
                            disabled={isUpdating === auditor.id + 'isActive'}
                            className="data-[state=checked]:bg-success"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                          <Switch 
                            checked={auditor.flashmobAccess ?? false}
                            onCheckedChange={() => toggleField(auditor.id, 'flashmobAccess', auditor.flashmobAccess ?? false)}
                            disabled={isUpdating === auditor.id + 'flashmobAccess'}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell text-right pr-6" onClick={(e) => e.stopPropagation()}>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" className="h-8 w-8 p-0 text-muted-text hover:text-primary transition-colors">
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-[180px]">
                             <DropdownMenuItem className="text-xs font-normal gap-2 py-2" onClick={() => handleResetPassword(auditor.email)}>
                               <Key className="h-3.5 w-3.5 opacity-40" /> Send Reset Link
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
