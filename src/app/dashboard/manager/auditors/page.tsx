'use client';

import { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  doc,
  addDoc,
  serverTimestamp,
  getDocs
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
  MoreVertical,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Loader2,
  Plus
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

interface Auditor {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: string;
  status?: 'active' | 'inactive';
  lastActive?: any;
  createdAt?: any;
  assignedLocations?: string[];
}

export default function AuditorsPage() {
  const [auditors, setAuditors] = useState<Auditor[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
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
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!session?.uid || !session?.organizationId) return;

    // Real-time listener for auditors reporting to this manager
    const q = query(
      collection(db, 'users'),
      where('organizationId', '==', session.organizationId),
      where('managerId', '==', session.uid),
      where('role', '==', 'AUDITOR')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedAuditors = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Auditor[];
      setAuditors(fetchedAuditors);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching auditors:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [session]);

  const handleAddAuditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditorName || !newAuditorEmail || !session) return;

    setIsSubmitting(true);
    try {
      // Logic for adding a new auditor
      // This usually involves creating a user document or sending an invite
      // For now, we'll create a platform user document (auditor role)
      await addDoc(collection(db, 'users'), {
        name: newAuditorName,
        email: newAuditorEmail,
        role: 'AUDITOR',
        organizationId: session.organizationId,
        managerId: session.uid,
        status: 'active',
        isActive: true,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setNewAuditorName('');
      setNewAuditorEmail('');
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding auditor:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAuditors = auditors.filter(auditor => 
    auditor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    auditor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="page-header-section">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Auditors Management</h1>
            <p className="body-text">Manage and monitor the performance of your audit team.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all text-xs font-medium uppercase tracking-widest">
                <UserPlus className="mr-2 h-4 w-4" /> Add Auditor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="p-xl border-b border-border/50">
                <DialogTitle className="text-lg font-semibold text-heading">Add New Auditor</DialogTitle>
                <DialogDescription className="body-text text-xs mt-2">
                  Invite a new auditor to your team. They will receive an email to join the platform.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAuditor}>
                <div className="space-y-lg p-xl">
                  <div className="space-y-xs">
                    <Label htmlFor="name" className="text-xs font-normal uppercase tracking-widest text-muted-text">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={newAuditorName}
                      onChange={(e) => setNewAuditorName(e.target.value)}
                      required
                      className="bg-background border-input h-10 text-body"
                    />
                  </div>
                  <div className="space-y-xs">
                    <Label htmlFor="email" className="text-xs font-normal uppercase tracking-widest text-muted-text">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={newAuditorEmail}
                      onChange={(e) => setNewAuditorEmail(e.target.value)}
                      required
                      className="bg-background border-input h-10 text-body"
                    />
                  </div>
                </div>
                <DialogFooter className="p-xl border-t border-border/50 bg-muted/10 gap-sm">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="font-medium text-xs uppercase tracking-widest shadow-sm text-body">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="font-medium text-xs uppercase tracking-widest shadow-md">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create Auditor
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search auditors by name or email..." 
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

        {/* Auditor Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Total Team Size</p>
              <h3 className="text-3xl font-medium tracking-tight text-primary">
                {auditors.length}
              </h3>
            </div>
          </Card>
          
          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Avg. Efficiency</p>
              <h3 className="text-3xl font-medium tracking-tight text-success">
                94%
              </h3>
            </div>
          </Card>
          
          <Card className="standard-card">
            <div className="p-6">
              <p className="muted-label mb-2">Pending Tasks</p>
              <h3 className="text-3xl font-medium tracking-tight text-warning">
                12
              </h3>
            </div>
          </Card>
        </div>

        {/* Auditors Table Section */}
        <Card className="standard-card overflow-hidden">
          <div className="p-6 border-b border-border/40 bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="section-heading">Team Roster</h3>
              <p className="body-text">A complete list of your assigned auditors.</p>
            </div>
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search auditors..."
                className="pl-9 h-10 w-full text-body"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="standard-table-head w-[250px]">Name</TableHead>
                  <TableHead className="standard-table-head">Email</TableHead>
                  <TableHead className="standard-table-head">Status</TableHead>
                  <TableHead className="standard-table-head">Locations</TableHead>
                  <TableHead className="standard-table-head text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="standard-table-cell h-64 text-center text-muted-text">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Users className="h-10 w-10 opacity-20" />
                        <p className="font-normal">{searchQuery ? "No auditors matching search." : "No auditors assigned."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAuditors.map((auditor) => (
                    <TableRow key={auditor.id} className="standard-table-row group">
                      <TableCell className="standard-table-cell">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm uppercase shrink-0">
                            {auditor.name.substring(0, 2)}
                          </div>
                          <span className="font-normal text-sm text-heading">{auditor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex items-center gap-1.5 font-normal text-body">
                          <Mail className="h-3.5 w-3.5 text-primary opacity-60" /> {auditor.email}
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-medium text-[10px] uppercase tracking-widest px-2 py-0.5">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                         <div className="flex items-center gap-1.5 font-normal text-body">
                          <MapPin className="h-3.5 w-3.5 text-primary opacity-60" /> {auditor.assignedLocations?.length || 0} Locations
                        </div>
                      </TableCell>
                      <TableCell className="standard-table-cell text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-text hover:text-primary hover:bg-primary/10 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
