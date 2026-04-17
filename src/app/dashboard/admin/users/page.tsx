'use client';

import { useState, useEffect, useMemo } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, Mail, UserPlus, Search, Filter, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { useAuthSync } from '@/components/AuthProvider';
import posthog from 'posthog-js';
import { MobileCard, MobileCardHeader, MobileCardTitle, MobileCardDescription, MobileCardContent } from '@/components/mobile/MobileCard';

// Memoized Form Components to prevent lag
const UserFormFields = React.memo(({ formData, setFormData, activeManagers, isEdit = false, selectedUser = null, handleResetPassword = null }: any) => {
  return (
    <div className="space-y-4 py-4 transition-opacity duration-150">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-body font-normal">Full Name</Label>
        <Input 
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required 
          placeholder="John Doe" 
          className="text-body h-11" 
        />
      </div>
      
      {!isEdit && (
        <>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-body font-normal">Email</Label>
            <Input 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              required 
              placeholder="john@example.com" 
              className="text-body h-11" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-body font-normal">Temporary Password</Label>
            <Input 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              required 
              minLength={6} 
              className="text-body h-11" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-body font-normal">Role</Label>
            <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
              <SelectTrigger className="text-body h-11"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MANAGER" className="text-body">Manager</SelectItem>
                <SelectItem value="AUDITOR" className="text-body">Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {(formData.role === 'AUDITOR' || (isEdit && selectedUser?.role === 'AUDITOR')) && (
        <>
          <div className="space-y-2">
            <Label htmlFor="managerId" className="text-body font-normal">Assigned Manager</Label>
            <Select value={formData.managerId} onValueChange={(val) => setFormData({ ...formData, managerId: val })} required>
              <SelectTrigger className="text-body h-11"><SelectValue placeholder="Select active manager" /></SelectTrigger>
              <SelectContent>
                {activeManagers.length === 0 ? (
                  <SelectItem value="none" disabled className="text-muted-text">No active managers found</SelectItem>
                ) : (
                  activeManagers.map((m: any) => <SelectItem key={m.id} value={m.id} className="text-body">{m.name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div>
          
          {isEdit && (
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10 mt-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Flashmob Access</Label>
                <p className="text-xs text-muted-text">Allow auditor to record flashmob videos</p>
              </div>
              <Switch
                checked={formData.hasFlashmobAccess}
                onCheckedChange={(checked) => setFormData({ ...formData, hasFlashmobAccess: checked })}
              />
            </div>
          )}
        </>
      )}

      {isEdit && handleResetPassword && (
        <div className="pt-4 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs gap-2 h-10"
            onClick={() => handleResetPassword(selectedUser.email)}
          >
            <Mail className="h-3.5 w-3.5" />
            Send Password Reset Email
          </Button>
        </div>
      )}
    </div>
  );
});

UserFormFields.displayName = 'UserFormFields';

export default function AdminUsersPage() {
  const { isSynced, orgId } = useAuthSync();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [managerFilter, setManagerFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [orgLocations, setOrgLocations] = useState<any[]>([]);

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
    hasFlashmobAccess: false,
  });


  const fetchData = async () => {
    if (!isSynced || !orgId) return;
    try {
      const q = query(
        collection(db, 'users'),
        where('organizationId', '==', orgId)
      );
      const usersSnap = await getDocs(q);
      const fetchedUsers: any[] = [];
      usersSnap.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      fetchedUsers.sort((a, b) => a.name.localeCompare(b.name));
      setUsers(fetchedUsers);

      const qLoc = query(
        collection(db, 'locations'),
        where('organizationId', '==', orgId)
      );
      const locationsSnap = await getDocs(qLoc);
      const fetchedLocations: any[] = [];
      locationsSnap.forEach((doc) => {
        fetchedLocations.push({ id: doc.id, ...doc.data() });
      });
      fetchedLocations.sort((a, b) => a.name.localeCompare(b.name));
      setOrgLocations(fetchedLocations);
    } catch (err) {
      console.error('Error fetching users/locations:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId, isSynced]);

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: userId, isActive: !currentStatus })
      });
      await fetchData();
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
          organizationId: orgId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');

      posthog.capture('user_created', { role: formData.role });
      
      await fetchData();
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

      await fetchData();
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

      posthog.capture('user_deleted', { role: selectedUser?.role });
      
      await fetchData();
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



  const activeManagers = useMemo(() => {
    return users.filter(
      (u) => String(u.role ?? '').toUpperCase() === 'MANAGER' && u.isActive !== false
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(u.role ?? '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (managerFilter !== 'all') {
        if (u.role !== 'AUDITOR' || u.managerId !== managerFilter) return false;
      }

      if (locationFilter !== 'all') {
        const loc = orgLocations.find(l => l.id === locationFilter);
        if (!loc) return false;
        const assignedIds = loc.assignedManagerIds || (loc.assignedManagerId ? [loc.assignedManagerId] : []);

        if (u.role === 'AUDITOR' && !assignedIds.includes(u.managerId)) return false;
        if (u.role === 'MANAGER' && !assignedIds.includes(u.id)) return false;
        if (u.role === 'ADMIN') return false;
      }

      return true;
    });
  }, [users, searchQuery, managerFilter, locationFilter, orgLocations]);

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="page-heading">Users</h1>
              <p className="body-text text-muted-text hidden md:block">Manage users, roles and permissions.</p>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button
                  size="default"
                  className="shadow-lg shadow-primary/20 h-10 md:h-11 px-4 md:px-5 text-xs md:text-[14px] font-bold gap-2 active:scale-95 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add User</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] transition-all duration-150 max-md:fixed max-md:bottom-0 max-md:top-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:rounded-b-none max-md:rounded-t-3xl max-md:max-w-full max-md:h-auto max-md:max-h-[85vh] max-md:overflow-y-auto">
                <DialogHeader className="max-md:pb-2">
                  <DialogTitle className="text-lg md:text-xl font-bold text-heading">Add User</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser}>
                  <UserFormFields 
                    formData={formData} 
                    setFormData={setFormData} 
                    activeManagers={activeManagers} 
                  />
                  {error && <p className="text-xs text-destructive mb-4 font-medium px-1">{error}</p>}
                  <DialogFooter className="max-md:pb-4">
                    <Button type="submit" disabled={loading} className="w-full h-11 font-bold transition-all active:scale-[0.98] shadow-lg shadow-primary/20">
                      {loading ? 'Adding...' : 'Add User'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {success && <div className="bg-success/10 border border-success/50 text-success p-3 rounded-md text-xs font-medium mb-4 animate-in fade-in slide-in-from-top-1">{success}</div>}

        <div className="flex items-center gap-2 mb-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search users..."
              className="pl-9 h-10 md:h-11 text-xs md:text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70 focus:border-primary/50 transition-all rounded-xl md:rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 md:h-11 w-10 md:w-auto md:px-4 flex items-center justify-center gap-2 font-medium text-xs border-border/50 text-[#6b7280] rounded-xl md:rounded-lg">
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">Filters</span>
                {(managerFilter !== 'all' || locationFilter !== 'all') && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 h-4 text-[10px] rounded-sm bg-primary text-white">!</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-text px-2 py-1 block">Manager</span>
              <DropdownMenuRadioGroup value={managerFilter} onValueChange={(val) => { setManagerFilter(val); setLocationFilter('all'); }}>
                <DropdownMenuRadioItem value="all" className="text-xs">All Managers</DropdownMenuRadioItem>
                {activeManagers.map(m => (
                  <DropdownMenuRadioItem key={m.id} value={m.id} className="text-xs">{m.name}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator className="my-1" />

              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-text px-2 py-1 block">Location</span>
              <DropdownMenuRadioGroup value={locationFilter} onValueChange={(val) => { setLocationFilter(val); setManagerFilter('all'); }}>
                <DropdownMenuRadioItem value="all" className="text-xs">All Locations</DropdownMenuRadioItem>
                {orgLocations.map((loc: any) => (
                  <DropdownMenuRadioItem key={loc.id} value={loc.id} className="text-xs">{loc.name}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:block">
          <Card className="standard-card">
            <Table>
              <TableHeader className="standard-table-header">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="standard-table-head">Name</TableHead>
                  <TableHead className="standard-table-head">Email</TableHead>
                  <TableHead className="standard-table-head">Role</TableHead>
                  <TableHead className="standard-table-head">Status</TableHead>
                  <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="standard-table-cell h-32 text-center">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="standard-table-row group">
                      <TableCell className="standard-table-cell">{user.name}</TableCell>
                      <TableCell className="standard-table-cell">{user.email}</TableCell>
                      <TableCell className="standard-table-cell">
                        <Badge
                          variant={user.role === 'ADMIN' ? 'default' : user.role === 'MANAGER' ? 'secondary' : 'outline'}
                          className={cn("px-2 py-0.5 text-body", user.role === 'ADMIN' && "text-white")}
                          style={{ fontSize: 12, fontWeight: 400 }}
                        >
                          {String(user.role ?? '')
                            .toLowerCase()
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell className="standard-table-cell">
                        <div className="flex items-center">
                          <Switch
                            checked={user.isActive !== false}
                            onCheckedChange={() =>
                              handleToggleActive(user.id, user.isActive !== false)
                            }
                            disabled={user.role === 'ADMIN'}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setEditFormData({
                                name: user.name,
                                managerId: user.managerId || '',
                                hasFlashmobAccess: user.hasFlashmobAccess === true
                              });
                              setIsEditOpen(true);
                            }} disabled={user.role === 'ADMIN'}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
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
        </div>

        {/* Mobile View */}
        <div className="flex flex-col gap-3 md:hidden">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/10 p-4 rounded-full mb-4">
                <UserPlus className="h-8 w-8 opacity-20" />
              </div>
              <p className="text-muted-text">No users found. Add one to get started.</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <MobileCard key={user.id} className="relative overflow-hidden">
                <MobileCardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <MobileCardTitle className="truncate">{user.name}</MobileCardTitle>
                      <MobileCardDescription className="truncate">{user.email}</MobileCardDescription>
                    </div>
                    <Badge
                      variant={user.role === 'ADMIN' ? 'default' : user.role === 'MANAGER' ? 'secondary' : 'outline'}
                      className={cn("px-2 py-0 h-5 text-[10px] font-bold shrink-0", user.role === 'ADMIN' && "text-white")}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </MobileCardHeader>
                <MobileCardContent>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <Switch 
                        checked={user.isActive !== false} 
                        onCheckedChange={() => handleToggleActive(user.id, user.isActive !== false)} 
                        disabled={user.role === 'ADMIN'}
                        className="scale-90"
                      />
                      <span className="text-[11px] font-medium text-muted-text">
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-text"
                        disabled={user.role === 'ADMIN'}
                        onClick={() => {
                          setSelectedUser(user);
                          setEditFormData({
                            name: user.name,
                            managerId: user.managerId || '',
                            hasFlashmobAccess: user.hasFlashmobAccess === true
                          });
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        disabled={user.role === 'ADMIN'}
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </MobileCardContent>
              </MobileCard>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px] transition-all duration-150 max-md:fixed max-md:bottom-0 max-md:top-auto max-md:left-1/2 max-md:-translate-x-1/2 max-md:translate-y-0 max-md:rounded-b-none max-md:rounded-t-3xl max-md:max-w-full max-md:h-auto max-md:max-h-[85vh] max-md:overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-semibold text-heading">Edit User</DialogTitle>
              <DialogDescription className="text-muted-text">Update the details for {selectedUser?.name}.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser}>
              <UserFormFields 
                formData={editFormData} 
                setFormData={setEditFormData} 
                activeManagers={activeManagers} 
                isEdit={true}
                selectedUser={selectedUser}
                handleResetPassword={handleResetPassword}
              />
              
              {error && <p className="text-sm text-destructive mb-4">{error}</p>}
              <DialogFooter>
                <div className="flex w-full gap-3 pt-2">
                  <Button type="button" variant="ghost" className="flex-1 h-11" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading} className="flex-1 h-11 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.98]">
                    {loading ? 'Updating...' : 'Save Changes'}
                  </Button>
                </div>
              </DialogFooter>
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
