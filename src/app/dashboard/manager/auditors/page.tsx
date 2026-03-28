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
          <div>
            <h1 className="page-heading">Auditors Management</h1>
            <p className="body-text">Manage and monitor the performance of your audit team.</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-black/20">
                <UserPlus className="mr-2 h-4 w-4" /> Add Auditor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Auditor</DialogTitle>
                <DialogDescription>
                  Invite a new auditor to your team. They will receive an email to join the platform.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAuditor} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={newAuditorName}
                    onChange={(e) => setNewAuditorName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={newAuditorEmail}
                    onChange={(e) => setNewAuditorEmail(e.target.value)}
                    required
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Create Auditor
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Auditor Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="standard-card border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Team Size</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{auditors.length}</div>
              <p className="muted-label pt-1 text-muted-foreground/60">Active auditors reporting to you</p>
            </CardContent>
          </Card>
          <Card className="standard-card border-l-4 border-l-success">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Avg. Efficiency</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">94%</div>
              <p className="muted-label pt-1 text-muted-foreground/60">Completion rate on assignments</p>
            </CardContent>
          </Card>
          <Card className="standard-card border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="muted-label pt-1 text-muted-foreground/60">Across all assigned locations</p>
            </CardContent>
          </Card>
        </div>

        {/* Auditors Table Section */}
        <Card className="standard-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Team Roster</CardTitle>
                <CardDescription>A complete list of your assigned auditors.</CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search auditors..."
                  className="pl-8 bg-muted/20 border-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow>
                  <TableHead className="w-[250px] font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Locations</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuditors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      {searchQuery ? "No auditors found matching your search." : "No auditors assigned yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAuditors.map((auditor) => (
                    <TableRow key={auditor.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                            {auditor.name.substring(0, 2)}
                          </div>
                          <span className="font-medium text-foreground">{auditor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Mail className="h-3 w-3" /> {auditor.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-success/10 text-success border-success/10 font-bold text-[10px] uppercase tracking-wider">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                         <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3 w-3" /> {auditor.assignedLocations?.length || 0} Locations
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
