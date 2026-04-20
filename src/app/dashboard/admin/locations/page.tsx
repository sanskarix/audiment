'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
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
import { MoreHorizontal, Pencil, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { useAuthSync } from '@/components/AuthProvider';
import posthog from 'posthog-js';

export function ManagerMultiSelect({ managers, value, onChange }: { managers: any[], value: string[], onChange: (val: string[]) => void }) {
  const anchor = useComboboxAnchor()

  const selectedManagers = managers.filter(m => value.includes(m.id));

  return (
    <Combobox
      multiple
      value={selectedManagers}
      onValueChange={(val: any[]) => onChange(val.map(v => v.id))}
    >
      <ComboboxChips ref={anchor} className="w-full min-h-11 border-border/50 bg-background hover:bg-muted/5 p-1 px-1.5 transition-colors">
        <ComboboxValue placeholder="Select managers...">
          {(values: any) => (
            <>
              {values.map((manager: any) => (
                <ComboboxChip key={manager.id} className="text-xs px-2 py-0.5 bg-muted/50 border border-border/50 text-body font-medium hover:bg-muted duration-150">
                  {manager.name}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={values.length === 0 ? "Select managers..." : ""} className="text-[13px] font-normal" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor} align="start" className="max-h-64 h-auto">
        <ComboboxEmpty className="py-6 px-4">No managers found.</ComboboxEmpty>
        <ComboboxList>
          {(manager: any) => (
            <ComboboxItem key={manager.id} value={manager} className="text-[13px] font-normal py-1.5 cursor-pointer">
              {manager.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function AdminLocationsPage() {
  const { isSynced, orgId } = useAuthSync();
  const [locations, setLocations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);


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
    defaultStartTime: '',
    defaultEndTime: '',
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    city: '',
    assignedManagerIds: [] as string[],
    defaultStartTime: '',
    defaultEndTime: '',
  });

  // No longer needed

  const fetchData = async () => {
    if (!isSynced || !orgId) return;
    try {
      // Fetch Locations
      const locationsQuery = query(
        collection(db, 'locations'),
        where('organizationId', '==', orgId)
      );
      const locationsSnap = await getDocs(locationsQuery);
      const fetchedLocations: any[] = [];
      locationsSnap.forEach((doc) => {
        fetchedLocations.push({ id: doc.id, ...doc.data() });
      });
      fetchedLocations.sort((a, b) => a.name.localeCompare(b.name));
      setLocations(fetchedLocations);

      // Fetch Managers
      const usersQuery = query(
        collection(db, 'users'),
        where('organizationId', '==', orgId),
        where('role', '==', 'MANAGER')
      );
      const usersSnap = await getDocs(usersQuery);
      const fetchedManagers: any[] = [];
      usersSnap.forEach((doc) => {
        const data = doc.data();
        if (data.isActive !== false) {
          fetchedManagers.push({ id: doc.id, ...data });
        }
      });
      fetchedManagers.sort((a, b) => a.name.localeCompare(b.name));
      setManagers(fetchedManagers);
    } catch (err) {
      console.error('Error fetching locations/managers:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgId, isSynced]);



  const handleToggleActive = async (locationId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'locations', locationId), {
        isActive: !currentStatus,
      });
      await fetchData();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!orgId) {
      setError('Missing organization ID');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'locations'), {
        organizationId: orgId,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        latitude: 0,
        longitude: 0,
        assignedManagerIds: formData.assignedManagerIds,
        defaultStartTime: formData.defaultStartTime || null,
        defaultEndTime: formData.defaultEndTime || null,
        isActive: true,
        createdAt: serverTimestamp(),
      });

      posthog.capture('location_created', {
        location_name: formData.name,
        city: formData.city,
        assigned_manager_count: formData.assignedManagerIds.length,
      });

      await fetchData();
      setFormData({ name: '', address: '', city: '', assignedManagerIds: [], defaultStartTime: '', defaultEndTime: '' });
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
        defaultStartTime: editFormData.defaultStartTime || null,
        defaultEndTime: editFormData.defaultEndTime || null,
      });

      if (selectedLocation.name !== editFormData.name) {
        const batch = writeBatch(db);
        const collectionsToUpdate = ['audits', 'correctiveActions', 'flashmobAudits'];

        for (const collName of collectionsToUpdate) {
          const q = query(collection(db, collName), where('locationId', '==', selectedLocation.id));
          const snap = await getDocs(q);
          snap.forEach((docSnap) => {
            batch.update(docSnap.ref, { locationName: editFormData.name });
          });
        }

        await batch.commit();
      }

      posthog.capture('location_updated', {
        location_id: selectedLocation.id,
        location_name: editFormData.name,
        city: editFormData.city,
        assigned_manager_count: editFormData.assignedManagerIds.length,
      });

      await fetchData();
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
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        <div className="page-header-section mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="page-heading">Locations</h1>
            <p className="body-text text-muted-text">Manage locations and add assign managers.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="default" className="shadow-lg shadow-primary/20 font-medium h-11 px-5 text-[14px] gap-2 active:scale-95 transition-all">
                <Plus className="mr-2 h-4 w-4" /> Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-semibold text-heading">Add Location</DialogTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-body font-normal">Start Time (Optional)</Label>
                    <Input type="time" value={formData.defaultStartTime} onChange={(e) => setFormData({ ...formData, defaultStartTime: e.target.value })} className="text-body" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-body font-normal">EOD / Deadline (Optional)</Label>
                    <Input type="time" value={formData.defaultEndTime} onChange={(e) => setFormData({ ...formData, defaultEndTime: e.target.value })} className="text-body" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Label className="text-body font-normal">Managers</Label>
                  <ManagerMultiSelect
                    managers={managers}
                    value={formData.assignedManagerIds}
                    onChange={(val) => setFormData({ ...formData, assignedManagerIds: val })}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <DialogFooter><Button type="submit" disabled={loading} className="w-full font-medium">{loading ? 'Adding...' : 'Add Location'}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>



        <Card className="standard-card">
          <Table>
            <TableHeader className="standard-table-header">
              <TableRow className="hover:bg-transparent">
                <TableHead className="standard-table-head">Name</TableHead>
                <TableHead className="standard-table-head">City</TableHead>
                <TableHead className="standard-table-head">Managers</TableHead>
                <TableHead className="standard-table-head">Status</TableHead>
                <TableHead className="standard-table-head text-right w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="standard-table-cell h-32 text-center">
                    No locations found. Add your first location to get started.
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location: any) => (
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
                              assignedManagerIds: location.assignedManagerIds || (location.assignedManagerId ? [location.assignedManagerId] : []),
                              defaultStartTime: location.defaultStartTime || '',
                              defaultEndTime: location.defaultEndTime || ''
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-body font-normal">Start Time (Optional)</Label>
                  <Input type="time" value={editFormData.defaultStartTime} onChange={(e) => setEditFormData({ ...editFormData, defaultStartTime: e.target.value })} className="text-body" />
                </div>
                <div className="space-y-2">
                  <Label className="text-body font-normal">EOD / Deadline (Optional)</Label>
                  <Input type="time" value={editFormData.defaultEndTime} onChange={(e) => setEditFormData({ ...editFormData, defaultEndTime: e.target.value })} className="text-body" />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-body font-normal">Assigned Managers</Label>
                <ManagerMultiSelect
                  managers={managers}
                  value={editFormData.assignedManagerIds}
                  onChange={(val) => setEditFormData({ ...editFormData, assignedManagerIds: val })}
                />
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
