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
import { Card } from '@/components/ui/card';
import { MoreHorizontal, Pencil, Plus, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [session, setSession] = useState<{ orgId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Locations</h1>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Create Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-semibold text-heading">Create New Location</DialogTitle>
                <DialogDescription className="text-muted-text">Add a new branch/outlet to your organization.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateLocation} className="space-y-4 py-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-body font-normal">Location Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="Downtown Branch" className="text-body" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address" className="text-body font-normal">Address</Label>
                  <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required placeholder="123 Main St" className="text-body" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city" className="text-body font-normal">City</Label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required placeholder="Megacity" className="text-body" />
                </div>
                <div className="flex flex-col gap-4">
                  <Label className="text-body font-normal">Assign Managers</Label>
                  <div className="grid grid-cols-2 gap-4 border rounded-md p-4 bg-muted/20">
                    {managers.length === 0 ? (
                      <p className="text-xs text-muted-text col-span-2">No active managers found</p>
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
                <DialogFooter><Button type="submit" disabled={loading} className="w-full font-medium">{loading ? 'Creating...' : 'Create Location'}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search locations by name, address, or city..."
              className="pl-9 h-11 text-body font-normal bg-background border border-border/50 text-[#6b7280] placeholder:text-[#6b7280]/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 px-4 gap-2 font-medium text-xs border-border/50 text-[#6b7280]">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Name</TableHead>
                <TableHead className="standard-table-head">City</TableHead>
                <TableHead className="standard-table-head">Manager</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLocations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell h-32 text-center">
                    No locations found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLocations.map((location: any) => (
                  <TableRow key={location.id} className="standard-table-row group">
                    <TableCell className="standard-table-cell font-normal text-sm text-body">
                      {location.name}
                    </TableCell>
                    <TableCell className="standard-table-cell text-body font-normal">{location.city}</TableCell>
                    <TableCell className="standard-table-cell text-body font-normal">{getManagerNames(location.assignedManagerIds, location.assignedManagerId)}</TableCell>
                    <TableCell className="standard-table-cell">
                      <Switch checked={location.isActive} onCheckedChange={() => handleToggleActive(location.id, location.isActive)} />
                    </TableCell>
                    <TableCell className="standard-table-cell text-right">
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
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-semibold text-heading">Edit Location</DialogTitle>
              <DialogDescription className="text-muted-text">Update the details for {selectedLocation?.name}.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditLocation} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-body font-normal">Location Name</Label>
                <Input id="edit-name" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} required className="text-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-address" className="text-body font-normal">Address</Label>
                <Input id="edit-address" value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} required className="text-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-city" className="text-body font-normal">City</Label>
                <Input id="edit-city" value={editFormData.city} onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })} required className="text-body" />
              </div>
              <div className="space-y-4">
                <Label className="text-body font-normal">Assigned Managers</Label>
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
              <DialogFooter><Button type="submit" disabled={loading} className="w-full font-medium">{loading ? 'Updating...' : 'Save Changes'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  );
}
