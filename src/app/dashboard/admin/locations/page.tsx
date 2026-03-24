'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
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
import { MoreHorizontal, Pencil } from 'lucide-react';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string } | null>(null);

  // Form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    assignedManagerIds: [] as string[], 
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    city: '',
    assignedManagerIds: [] as string[],
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

    // Fetch Locations
    const locationsQuery = query(
      collection(db, 'locations'),
      where('organizationId', '==', session.orgId)
    );

    const unsbuscribeLocations = onSnapshot(locationsQuery, (snapshot) => {
      const fetchedLocations: any[] = [];
      snapshot.forEach((doc) => {
        fetchedLocations.push({ id: doc.id, ...doc.data() });
      });
      fetchedLocations.sort((a, b) => a.name.localeCompare(b.name));
      setLocations(fetchedLocations);
    });

    // Fetch Managers for the assignment dropdown
    const usersQuery = query(
      collection(db, 'users'),
      where('organizationId', '==', session.orgId),
      where('role', '==', 'MANAGER')
    );

    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      const fetchedManagers: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive !== false) { // Only active managers
          fetchedManagers.push({ id: doc.id, ...data });
        }
      });
      fetchedManagers.sort((a, b) => a.name.localeCompare(b.name));
      setManagers(fetchedManagers);
    });

    return () => {
      unsbuscribeLocations();
      unsubscribeUsers();
    };
  }, [session]);

  const handleToggleActive = async (locationId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'locations', locationId), {
        isActive: !currentStatus,
      });
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!session?.orgId) {
      setError('Missing organization ID');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'locations'), {
        organizationId: session.orgId,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: 0,
        longitude: 0,
        assignedManagerIds: formData.assignedManagerIds,
        isActive: true,
        createdAt: serverTimestamp(),
      });

      setFormData({ name: '', address: '', city: '', assignedManagerIds: [] });
      setIsCreateOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create location');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'locations', selectedLocation.id), {
        name: editFormData.name,
        address: editFormData.address,
        city: editFormData.city,
        assignedManagerIds: editFormData.assignedManagerIds,
      });

      setIsEditOpen(false);
      setSelectedLocation(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update location');
    } finally {
      setLoading(false);
    }
  };

  const getManagerNames = (managerIds: string[] | undefined, legacyId?: string) => {
    const ids = managerIds || (legacyId ? [legacyId] : []);
    if (ids.length === 0) return 'Unassigned';
    
    const names = ids.map(id => {
      const m = managers.find(mgr => mgr.id === id);
      return m ? m.name : 'Unknown';
    });
    return names.join(', ');
  };

  const toggleManagerSelection = (id: string, isEdit: boolean) => {
    if (isEdit) {
      const current = editFormData.assignedManagerIds;
      if (current.includes(id)) {
        setEditFormData({ ...editFormData, assignedManagerIds: current.filter(cid => cid !== id) });
      } else {
        setEditFormData({ ...editFormData, assignedManagerIds: [...current, id] });
      }
    } else {
      const current = formData.assignedManagerIds;
      if (current.includes(id)) {
        setFormData({ ...formData, assignedManagerIds: current.filter(cid => cid !== id) });
      } else {
        setFormData({ ...formData, assignedManagerIds: [...current, id] });
      }
    }
  };

  return (
    <DashboardShell role="Admin">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Locations Management</h1>
            <p className="text-muted-foreground text-sm">
              Manage branches, outlets, and assign managers.
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>Create Location</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Location</DialogTitle>
                <DialogDescription>Add a new branch/outlet to your organization.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateLocation} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="Downtown Branch" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required placeholder="123 Main St" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required placeholder="Megacity" />
                </div>
                <div className="space-y-4">
                  <Label>Assign Managers</Label>
                  <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/20">
                    {managers.length === 0 ? (
                      <p className="text-xs text-muted-foreground col-span-2">No active managers found</p>
                    ) : (
                      managers.map(m => (
                        <div key={m.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={`mgr-${m.id}`} 
                            checked={formData.assignedManagerIds.includes(m.id)}
                            onChange={() => toggleManagerSelection(m.id, false)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`mgr-${m.id}`} className="text-sm font-normal cursor-pointer line-clamp-1">{m.name}</Label>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter><Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create Location'}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No locations found here. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={getManagerNames(location.assignedManagerIds, location.assignedManagerId)}>
                        {getManagerNames(location.assignedManagerIds, location.assignedManagerId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch checked={location.isActive !== false} onCheckedChange={() => handleToggleActive(location.id, location.isActive !== false)} />
                        <span className="text-xs">{location.isActive !== false ? 'Active' : 'Inactive'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedLocation(location);
                            setEditFormData({ 
                              name: location.name, 
                              address: location.address || '',
                              city: location.city || '',
                              assignedManagerIds: location.assignedManagerIds || (location.assignedManagerId ? [location.assignedManagerId] : [])
                            });
                            setIsEditOpen(true);
                          }}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
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

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>Update the details for {selectedLocation?.name}.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditLocation} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Location Name</Label>
                <Input id="edit-name" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input id="edit-address" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input id="edit-city" value={editFormData.city} onChange={(e) => setEditFormData({...editFormData, city: e.target.value})} required />
              </div>
              <div className="space-y-4">
                <Label>Assigned Managers</Label>
                <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/20">
                  {managers.map(m => (
                    <div key={m.id} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`edit-mgr-${m.id}`} 
                        checked={editFormData.assignedManagerIds.includes(m.id)}
                        onChange={() => toggleManagerSelection(m.id, true)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`edit-mgr-${m.id}`} className="text-sm font-normal cursor-pointer line-clamp-1">{m.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <DialogFooter><Button type="submit" disabled={loading} className="w-full">{loading ? 'Updating...' : 'Save Changes'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
