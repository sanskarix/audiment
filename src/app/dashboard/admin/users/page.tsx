'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import DashboardShell from '@/components/DashboardShell';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, Mail, UserPlus, Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MANAGER',
    managerId: '',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    managerId: '',
  });

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ orgId: data.organizationId });
      } catch (e) {
        console.error('Failed to parse session cookie');
      }
    }
  }, []);

  useEffect(() => {
    if (!session?.orgId) return;

    const q = query(
      collection(db, 'users'),
      where('organizationId', '==', session.orgId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers: any[] = [];
      snapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      fetchedUsers.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, [session]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !currentStatus,
      });
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizationId: session?.orgId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      setFormData({ name: '', email: '', password: '', role: 'MANAGER', managerId: '' });
      setIsCreateOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: selectedUser.id,
          ...editFormData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');

      setIsEditOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/users?uid=${selectedUser.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');

      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userEmail: string) => {
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, userEmail);
      setSuccess(`Reset email sent to ${userEmail}`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleFlashmob = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        hasFlashmobAccess: !currentStatus,
      });
    } catch (err) {
      console.error('Failed to toggle flashmob access', err);
    }
  };

  // Logic: Manager must be active to appear in listener
  const activeManagers = users.filter((u) => u.role.toUpperCase() === 'MANAGER' && u.isActive !== false);

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-xs">
            <h1 className="page-heading">Users Management</h1>
            <p className="body-text">Manage permissions, roles, and status for all organization users.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium">
                <UserPlus className="mr-2 h-4 w-4" /> Create User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-semibold text-heading">Create New User</DialogTitle>
                <DialogDescription className="text-muted-text">Add a new account to your organization.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4 py-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-body font-normal">Full Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" className="text-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-body font-normal">Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="john@example.com" className="text-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-body font-normal">Temporary Password</Label>
                  <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} className="text-body" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-body font-normal">Role</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                    <SelectTrigger className="text-body"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER" className="text-body">Manager</SelectItem>
                      <SelectItem value="AUDITOR" className="text-body">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === 'AUDITOR' && (
                  <div className="space-y-2">
                    <Label htmlFor="managerId" className="text-body font-normal">Assign to Manager</Label>
                    <Select value={formData.managerId} onValueChange={(val) => setFormData({ ...formData, managerId: val })} required>
                      <SelectTrigger className="text-body"><SelectValue placeholder="Select active manager" /></SelectTrigger>
                      <SelectContent>
                        {activeManagers.length === 0 ? (
                          <SelectItem value="none" disabled className="text-muted-text">No active managers found</SelectItem>
                        ) : (
                          activeManagers.map(m => <SelectItem key={m.id} value={m.id} className="text-body">{m.name}</SelectItem>)
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter><Button type="submit" disabled={loading} className="w-full font-medium">{loading ? 'Creating...' : 'Create User'}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {success && <div className="bg-success/10 border border-success/50 text-success p-3 rounded-md text-sm font-normal animate-in fade-in slide-in-from-top-1">{success}</div>}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search users by name, email, or role..." 
              className="pl-9 h-11 text-body font-normal bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs uppercase tracking-widest border-border/40 text-muted-text">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Name</TableHead>
                <TableHead className="standard-table-head">Email</TableHead>
                <TableHead className="standard-table-head">Role</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head">Flashmob</TableHead>
                <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="standard-table-cell h-32 text-center text-muted-text">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                <TableRow key={user.id} className="standard-table-row group">
                  <TableCell className="standard-table-cell font-normal text-body text-sm">{user.name}</TableCell>
                  <TableCell className="standard-table-cell text-body">{user.email}</TableCell>
                  <TableCell className="standard-table-cell">
                    <Badge variant={user.role === 'ADMIN' ? 'default' : user.role === 'MANAGER' ? 'secondary' : 'outline'} className="font-normal text-[9px] uppercase tracking-widest px-2 py-0.5 text-body">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="standard-table-cell">
                    <div className="flex items-center space-x-3">
                      <Switch checked={user.isActive !== false} onCheckedChange={() => handleToggleActive(user.id, user.isActive !== false)} disabled={user.role === 'ADMIN'} />
                      <span className={cn("text-[10px] font-medium uppercase tracking-widest", user.isActive !== false ? "text-success" : "text-muted-text opacity-50")}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="standard-table-cell">
                    {user.role === 'AUDITOR' ? (
                      <div className="flex items-center space-x-3">
                        <Switch 
                          checked={user.hasFlashmobAccess === true} 
                          onCheckedChange={() => handleToggleFlashmob(user.id, user.hasFlashmobAccess === true)} 
                        />
                        <span className={cn("text-[10px] font-medium uppercase tracking-widest", user.hasFlashmobAccess ? "text-primary" : "text-muted-text opacity-50")}>
                          {user.hasFlashmobAccess ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-text/30">-</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setEditFormData({ name: user.name, managerId: user.managerId || '' });
                          setIsEditOpen(true);
                        }} disabled={user.role === 'ADMIN'}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleResetPassword(user.email)}>
                          <Mail className="mr-2 h-4 w-4" /> Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteOpen(true);
                        }} disabled={user.role === 'ADMIN'}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          </Table>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-semibold text-heading">Edit User</DialogTitle>
              <DialogDescription className="text-muted-text">Update the details for {selectedUser?.name}.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-body font-normal">Full Name</Label>
                <Input value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="text-body" />
              </div>
              {selectedUser?.role === 'AUDITOR' && (
                <div className="space-y-2">
                  <Label className="text-body font-normal">Assigned Manager</Label>
                  <Select value={editFormData.managerId} onValueChange={(val) => setEditFormData({ ...editFormData, managerId: val })} required>
                    <SelectTrigger className="text-body"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {activeManagers.map(m => <SelectItem key={m.id} value={m.id} className="text-body">{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter><Button type="submit" disabled={loading} className="w-full font-medium">{loading ? 'Updating...' : 'Save Changes'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-semibold text-heading">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-body font-normal">
                This will permanently delete <strong className="font-medium text-heading">{selectedUser?.name}</strong> from both Firebase Authentication and the database.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedUser(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90 text-white font-medium" disabled={loading}>
                {loading ? 'Deleting...' : 'Delete User'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardShell>
  );
}
