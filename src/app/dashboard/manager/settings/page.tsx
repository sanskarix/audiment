'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { updatePassword, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import DashboardShell from '@/components/DashboardShell';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Camera,
  Loader2,
  Check,
  Mail,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Cropper from 'react-easy-crop';

type Tab = 'profile' | 'security';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: ShieldCheck },
];

export default function ManagerSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [session, setSession] = useState<{ uid: string } | null>(null);

  const [userDoc, setUserDoc] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);

  // Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ uid: data.uid });
      } catch { setLoading(false); }
    } else { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!session) return;
    async function fetchData() {
      try {
        const uSnap = await getDoc(doc(db, 'users', session!.uid));
        if (uSnap.exists()) {
          const d = uSnap.data();
          setUserDoc(d);
          setProfileForm({ name: d.name || '', email: d.email || '' });
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [session]);

  const flashSuccess = (key: string) => {
    setSaveSuccess(key);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageToCrop(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropModalOpen(true);
      if (e.target) e.target.value = '';
    });
    reader.readAsDataURL(file);
  };

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
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
    if (!imageToCrop || !croppedAreaPixels || !session) return;
    setCropModalOpen(false);
    setUploadingPhoto(true);
    try {
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const fd = new FormData();
      fd.append('file', croppedFile);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      await setDoc(doc(db, 'users', session.uid), { photoUrl: url }, { merge: true });
      setUserDoc((prev: any) => ({ ...prev, photoUrl: url }));
      flashSuccess('profile-photo');
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingPhoto(false);
      setImageToCrop(null);
    }
  };

  const handleRemovePhoto = async () => {
    if (!session) return;
    try {
      setUserDoc((prev: any) => ({ ...prev, photoUrl: null }));
      await setDoc(doc(db, 'users', session.uid), { photoUrl: null }, { merge: true });
      flashSuccess('profile-photo-removed');
    } catch (err) {
      console.error('Failed to remove photo:', err);
    }
  };

  const updateProfile = async () => {
    if (!session) return;
    setUpdating('profile');
    try {
      await setDoc(doc(db, 'users', session.uid), { name: profileForm.name }, { merge: true });
      if (profileForm.email !== userDoc.email) {
        if (auth.currentUser) {
          await updateEmail(auth.currentUser, profileForm.email);
        }
        await setDoc(doc(db, 'users', session.uid), { email: profileForm.email }, { merge: true });
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
        alert(err.message || 'Failed. Try re-logging in first.');
      }
    }
    finally { setUpdating(null); }
  };

  if (loading) {
    return (
      <DashboardShell role="Manager">
        <div className="dashboard-page-container">
          <Skeleton className="h-9 w-40 mb-2" />
          <div className="flex gap-8 mt-8">
            <div className="w-48 space-y-2">
              {[1, 2].map(i => <Skeleton key={i} className="h-10 w-full rounded-lg" />)}
            </div>
            <Skeleton className="flex-1 h-[400px] rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Manager">
      <div className="dashboard-page-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-heading">Settings</h1>
        </div>

        {/* Layout: vertical tab rail + content */}
        <div className="flex gap-8 items-start">

          {/* Left nav rail */}
          <nav className="w-48 flex-shrink-0 flex flex-col gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all w-full text-left',
                  activeTab === tab.id
                    ? 'bg-primary/5 text-primary'
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
              <Card className="standard-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[15px] font-semibold">Personal Information</CardTitle>
                  <CardDescription className="text-[13px]">Update your name, email, and profile photo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar row */}
                  <div className="flex items-center gap-5 pb-5 border-b border-border/50">
                    <div className="relative group">
                      <Avatar className="h-16 w-16 rounded-full border-2 border-border/60">
                        <AvatarImage src={userDoc?.photoUrl} />
                        <AvatarFallback className="bg-primary/5 text-primary text-lg font-semibold">
                          {userDoc?.name?.charAt(0) || 'M'}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => userPhotoInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow hover:opacity-90 transition-opacity"
                      >
                        {uploadingPhoto ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
                      </button>
                      <input type="file" accept="image/*" ref={userPhotoInputRef} className="hidden" onChange={handleFileSelect} />
                    </div>
                    <div className="flex flex-col gap-0.5 items-start px-2">
                      <p className="text-[13px] font-medium text-heading">Profile Photo</p>
                      <p className="text-[12px] text-muted-text">PNG, JPG or GIF up to 2MB</p>
                      {userDoc?.photoUrl && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleRemovePhoto} 
                          className="h-6 px-2 mt-1 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid gap-4">
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Full Name</Label>
                      <Input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="h-10 shadow-sm" />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                        <Input type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} className="h-10 pl-9 shadow-sm" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/30 py-3 px-6 justify-end">
                  <Button onClick={updateProfile} disabled={updating === 'profile'} className="h-9 px-4 gap-2 text-[13px] shadow-sm">
                    {updating === 'profile' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saveSuccess === 'profile' ? <Check className="h-3.5 w-3.5" /> : null}
                    {saveSuccess === 'profile' ? 'Saved!' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* ── SECURITY ── */}
            {activeTab === 'security' && (
              <Card className="standard-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-[15px] font-semibold">Security</CardTitle>
                  <CardDescription className="text-[13px]">Change your account password.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-1.5">
                    <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                      <Input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className="h-10 pl-9 shadow-sm" />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                      <Input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} className="h-10 pl-9 shadow-sm" />
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label className="text-[11px] font-semibold text-muted-text uppercase tracking-wider">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/50" />
                      <Input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className="h-10 pl-9 shadow-sm" />
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
                    className="h-9 px-4 gap-2 text-[13px] shadow-sm"
                  >
                    {updating === 'password' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saveSuccess === 'password' ? <Check className="h-3.5 w-3.5 text-success" /> : <Lock className="h-3.5 w-3.5" />}
                    {saveSuccess === 'password' ? 'Updated!' : 'Update Password'}
                  </Button>
                </CardFooter>
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
