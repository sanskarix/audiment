'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Image from 'next/image';
import DashboardShell from '@/components/DashboardShell';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAuthSync } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Building2,
  Bell,
  AlertTriangle,
  Camera,
  Loader2,
  Check,
  Download,
  ShieldAlert,
  Globe,
  Mail,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Cropper from 'react-easy-crop';

const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
];

type Tab = 'profile' | 'organization' | 'notifications' | 'danger';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: ShieldAlert },
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TABS.some(t => t.id === tabParam)) {
      setActiveTab(tabParam as Tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    router.replace(`?tab=${tabId}`, { scroll: false });
  };

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const [userDoc, setUserDoc] = useState<any>(null);
  const [orgDoc, setOrgDoc] = useState<any>(null);
  const [notifSettings, setNotifSettings] = useState({
    lowScoreAlert: true,
    missedAuditAlert: true,
    trendAlert: true,
    correctiveOverdueAlert: true,
    lowScoreThreshold: 60
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const orgLogoInputRef = useRef<HTMLInputElement>(null);

  // Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'user' | 'org' | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [orgForm, setOrgForm] = useState({ name: '', timezone: 'UTC' });
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const { isSynced, uid, orgId } = useAuthSync();

  // No longer needed

  useEffect(() => {
    if (!isSynced || !uid || !orgId) return;
    async function fetchData() {
      try {
        const uSnap = await getDoc(doc(db, 'users', uid!));
        if (uSnap.exists()) {
          const d = uSnap.data();
          setUserDoc(d);
          setProfileForm({ name: d.name || '', email: d.email || '' });
        }
        const oSnap = await getDoc(doc(db, 'organizations', orgId!));
        if (oSnap.exists()) {
          const d = oSnap.data();
          setOrgDoc(d);
          setOrgForm({ name: d.name || '', timezone: d.timezone || 'UTC' });
        }
        const nSnap = await getDoc(doc(db, 'organizations', orgId!, 'settings', 'notifications'));
        if (nSnap.exists()) {
          setNotifSettings(nSnap.data() as typeof notifSettings);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [uid, orgId, isSynced]);

  const flashSuccess = (key: string) => {
    setSaveSuccess(key);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, target: 'user' | 'org') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result as string);
      setCropTarget(target);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
      if (e.target) e.target.value = '';
    });
    reader.readAsDataURL(file);
  };

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2d context');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], 'cropped.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg');
    });
  };

  const handleCropSave = async () => {
    if (!imageToCrop || !croppedAreaPixels || !cropTarget || !uid || !orgId) return;
    setCropModalOpen(false);
    setUploadingPhoto(true);
    try {
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const fd = new FormData();
      fd.append('file', croppedFile);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      if (cropTarget === 'user') {
        await setDoc(doc(db, 'users', uid), { photoUrl: url }, { merge: true });
        setUserDoc((prev: any) => ({ ...prev, photoUrl: url }));
      } else {
        await setDoc(doc(db, 'organizations', orgId), { logoUrl: url }, { merge: true });
        setOrgDoc((prev: any) => ({ ...prev, logoUrl: url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
      setImageToCrop(null);
      setCropTarget(null);
    }
  };

  const handleRemovePhoto = async (target: 'user' | 'org') => {
    if (!uid || !orgId) return;
    try {
      if (target === 'user') {
        setUserDoc((prev: any) => ({ ...prev, photoUrl: null }));
        await setDoc(doc(db, 'users', uid), { photoUrl: null }, { merge: true });
      } else {
        setOrgDoc((prev: any) => ({ ...prev, logoUrl: null }));
        await setDoc(doc(db, 'organizations', orgId), { logoUrl: null }, { merge: true });
      }
    } catch (err) {
      console.error('Failed to remove photo:', err);
    }
  };

  const updateProfile = async () => {
    if (!uid) return;
    setUpdating('profile');
    try {
      await setDoc(doc(db, 'users', uid), { name: profileForm.name }, { merge: true });
      if (profileForm.email !== userDoc.email) {
        await updateEmail(auth.currentUser!, profileForm.email);
        await setDoc(doc(db, 'users', uid), { email: profileForm.email }, { merge: true });
      }
      setUserDoc((prev: any) => ({ ...prev, ...profileForm }));
      flashSuccess('profile');
    } catch (err: any) { alert(err.message || 'Failed to update profile'); }
    finally { setUpdating(null); }
  };

  const updatePasswordFlow = async () => {
    if (!auth.currentUser) return;
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setUpdating('password');
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        passwordForm.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      flashSuccess('password');
    } catch (err: any) { 
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        alert('Current password is incorrect.');
      } else {
        alert(err.message || 'Failed to update password. Try re-logging in first.');
      }
    }
    finally { setUpdating(null); }
  };

  const updateOrganization = async () => {
    if (!orgId) return;
    setUpdating('org');
    try {
      await setDoc(doc(db, 'organizations', orgId), { name: orgForm.name, timezone: orgForm.timezone }, { merge: true });
      setOrgDoc((prev: any) => ({ ...prev, ...orgForm }));
      flashSuccess('org');
    } catch (err: any) { alert(err.message || 'Failed to update'); }
    finally { setUpdating(null); }
  };

  const updateNotification = async (updates: Partial<typeof notifSettings>) => {
    if (!orgId) return;
    const merged = { ...notifSettings, ...updates };
    setNotifSettings(merged);
    try {
      await setDoc(doc(db, 'organizations', orgId, 'settings', 'notifications'), merged, { merge: true });
    } catch (err) { console.error(err); }
  };

  const exportData = async () => {
    if (!orgId) return;
    setUpdating('export');
    try {
      const snap = await getDocs(query(
        collection(db, 'audits'),
        where('organizationId', '==', orgId),
        orderBy('createdAt', 'desc')
      ));
      const audits = snap.docs.map(d => d.data());
      if (!audits.length) { alert('No data to export'); return; }
      const headers = ['Audit Title', 'Location', 'Auditor', 'Score', 'Date', 'Status'];
      const rows = audits.map(a => [
        `"${a.templateName || 'Audit'}"`,
        `"${a.locationName || 'N/A'}"`,
        `"${a.auditorName || 'N/A'}"`,
        a.scorePercentage ? `${a.scorePercentage}%` : 'N/A',
        a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString() : 'N/A',
        a.status
      ]);
      const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = `audiment_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (err) { console.error(err); }
    finally { setUpdating(null); }
  };

  if (loading) {
    return (
      <DashboardShell role="admin">
        <div className="dashboard-page-container">
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-80 mb-8" />
          <div className="flex gap-8">
            <div className="w-48 space-y-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
            <Skeleton className="flex-1 h-[500px] rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="admin">
      <div className="dashboard-page-container">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="page-heading">Settings</h1>
          <p className="body-text text-muted-text">Manage platform preferences.</p>
        </div>

        {/* Layout: vertical tab rail + content */}
        <div className="flex gap-8 items-start">

          {/* Left nav rail */}
          <nav className="w-48 flex-shrink-0 flex flex-col gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left',
                  activeTab === tab.id
                    ? tab.id === 'danger'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-primary/5 text-primary'
                    : 'text-muted-text hover:bg-muted/50 hover:text-body'
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Content pane */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ── PROFILE ── */}
            {activeTab === 'profile' && (
              <>
                <Card className="standard-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[15px] font-semibold">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar row */}
                    <div className="flex items-center gap-5 pb-5 border-b border-border/50">
                      <div className="relative group">
                        <Avatar className="h-16 w-16 rounded-full border-2 border-border/60">
                          <AvatarImage src={userDoc?.photoUrl} />
                          <AvatarFallback className="bg-primary/5 text-primary text-lg font-semibold">
                            {userDoc?.name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        <button
                          onClick={() => userPhotoInputRef.current?.click()}
                          disabled={uploadingPhoto}
                          className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow hover:opacity-90 transition-opacity"
                        >
                          {uploadingPhoto ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
                        </button>
                        <input type="file" accept="image/*" ref={userPhotoInputRef} className="hidden" onChange={e => handleFileSelect(e, 'user')} />
                      </div>
                      <div className="flex flex-col gap-0.5 items-start px-2">
                        <p className="text-[13px] font-medium text-heading">Profile Photo</p>
                        <p className="text-[12px] text-muted-text">PNG, JPG or GIF up to 2MB</p>
                        {userDoc?.photoUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePhoto('user')}
                            className="h-6 px-2 mt-1 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Remove Logo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="grid gap-4">
                      <div className="grid gap-1.5">
                        <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Full Name</Label>
                        <Input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="h-10" />
                      </div>
                      <div className="grid gap-1.5">
                        <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                          <Input type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} className="h-10 pl-9" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/5 border-t border-border/30 py-3 px-6 justify-end">
                    <Button onClick={updateProfile} disabled={updating === 'profile'} className="h-9 px-4 gap-2 text-[13px]">
                      {updating === 'profile' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saveSuccess === 'profile' ? <Check className="h-3.5 w-3.5" /> : null}
                      {saveSuccess === 'profile' ? 'Saved!' : 'Save Changes'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="standard-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-[15px] font-semibold">Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                        <Input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className="h-10 pl-9" />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                        <Input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} className="h-10 pl-9" />
                      </div>
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                        <Input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className="h-10 pl-9" />
                      </div>
                    </div>
                    {passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="text-[12px] text-destructive">Passwords do not match.</p>
                    )}
                    {passwordForm.newPassword && passwordForm.newPassword.length < 8 && (
                      <p className="text-[12px] text-warning">Password must be at least 8 characters.</p>
                    )}
                  </CardContent>
                  <CardFooter className="bg-muted/5 border-t border-border/30 py-3 px-6 justify-end">
                    <Button
                      onClick={updatePasswordFlow}
                      variant="outline"
                      disabled={updating === 'password' || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                      className="h-9 px-4 gap-2 text-[13px]"
                    >
                      {updating === 'password' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saveSuccess === 'password' ? <Check className="h-3.5 w-3.5 text-success" /> : <Lock className="h-3.5 w-3.5" />}
                      {saveSuccess === 'password' ? 'Updated!' : 'Update Password'}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}

            {/* ── ORGANIZATION ── */}
            {activeTab === 'organization' && (
              <Card className="standard-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[15px] font-semibold">Organization Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo */}
                  <div className="flex items-center gap-5 pb-5 border-b border-border/50">
                    <div className="relative group h-16 w-24 rounded-lg border border-border/50 bg-muted/10 overflow-hidden flex items-center justify-center">
                      {orgDoc?.logoUrl
                        ? <Image src={orgDoc.logoUrl} alt="Logo" width={96} height={64} className="max-h-full max-w-full object-contain" unoptimized />
                        : <Building2 className="h-7 w-7 text-muted-text/30" />
                      }
                      <button
                        onClick={() => orgLogoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                      </button>
                      <input type="file" accept="image/*" ref={orgLogoInputRef} className="hidden" onChange={e => handleFileSelect(e, 'org')} />
                    </div>
                    <div className="flex flex-col gap-0.5 items-start px-2">
                      <p className="text-[13px] font-medium text-heading">Company Logo</p>
                      <p className="text-[12px] text-muted-text">Displayed on reports and dashboard.</p>
                      {orgDoc?.logoUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePhoto('org')}
                          className="h-6 px-2 mt-1 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove Logo
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Company Name</Label>
                      <Input value={orgForm.name} onChange={e => setOrgForm(p => ({ ...p, name: e.target.value }))} className="h-10" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Default Timezone</Label>
                      <Select value={orgForm.timezone} onValueChange={val => setOrgForm(p => ({ ...p, timezone: val }))}>
                        <SelectTrigger className="h-10">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-text/50" />
                            <SelectValue placeholder="Select timezone" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map(tz => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/30 py-3 px-6 justify-end">
                  <Button onClick={updateOrganization} disabled={updating === 'org'} className="h-9 px-4 gap-2 text-[13px]">
                    {updating === 'org' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saveSuccess === 'org' ? <Check className="h-3.5 w-3.5" /> : null}
                    {saveSuccess === 'org' ? 'Saved!' : 'Save Organization'}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <Card className="standard-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[15px] font-semibold">Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {([
                    { key: 'lowScoreAlert', label: 'Low Score Alert', desc: 'Triggered when an audit score falls below the threshold.' },
                    { key: 'missedAuditAlert', label: 'Missed Audit Alert', desc: 'Triggered when a scheduled audit passes its due date.' },
                    { key: 'trendAlert', label: 'Performance Trend Alert', desc: 'Triggered on 3 consecutive low-score audits at a location.' },
                    { key: 'correctiveOverdueAlert', label: 'Corrective Action Overdue', desc: 'Triggered when a manager misses a resolution deadline.' },
                  ] as { key: keyof typeof notifSettings; label: string; desc: string }[]).map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-muted/10">
                      <div>
                        <p className="text-[13px] font-medium text-heading">{item.label}</p>
                        <p className="text-[12px] text-muted-text mt-0.5">{item.desc}</p>
                      </div>
                      <Switch
                        checked={notifSettings[item.key] as boolean}
                        onCheckedChange={val => updateNotification({ [item.key]: val })}
                      />
                    </div>
                  ))}

                  <div className="pt-4 border-t border-border/50">
                    <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Low Score Threshold</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input
                        type="number" min={1} max={100}
                        value={notifSettings.lowScoreThreshold}
                        onChange={e => updateNotification({ lowScoreThreshold: parseInt(e.target.value) || 60 })}
                        className="w-24 h-10 font-medium"
                      />
                      <p className="text-[12px] text-muted-text">Audits below this percentage trigger a low score alert.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── DANGER ZONE ── */}
            {activeTab === 'danger' && (
              <Card className="border-destructive/20 overflow-hidden">
                <CardHeader className="bg-destructive/5 border-b border-destructive/10 pb-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <CardTitle className="text-[15px] font-semibold text-destructive">Danger Zone</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-semibold text-heading">Export Data</p>
                      <p className="text-[12px] text-muted-text mt-0.5 max-w-sm">
                        Download all audit data as a CSV file.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={exportData}
                      disabled={updating === 'export'}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 gap-2 h-9 px-5 font-medium text-[13px] shrink-0"
                    >
                      {updating === 'export' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      Export CSV
                    </Button>
                  </div>

                  <div className="pt-5 border-t border-destructive/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-50 pointer-events-none select-none">
                    <div>
                      <p className="text-[13px] font-semibold text-heading">Delete Organization</p>
                    </div>
                    <Button variant="ghost" disabled className="text-destructive h-9 px-5 font-medium text-[13px]">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
      {/* Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold">Crop Image</DialogTitle>
          </DialogHeader>
          <div className="relative h-64 w-full bg-black/5 rounded-lg overflow-hidden my-4">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCropSave}>Save Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={
      <DashboardShell role="admin">
        <div className="dashboard-page-container">
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-80 mb-8" />
          <div className="flex gap-8">
            <div className="w-48 space-y-2">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
            <Skeleton className="flex-1 h-[500px] rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    }>
      <SettingsContent />
    </Suspense>
  );
}
