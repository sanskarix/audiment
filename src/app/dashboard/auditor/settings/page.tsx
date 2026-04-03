'use client';

import { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { updatePassword, updateEmail } from 'firebase/auth';
import DashboardShell from '@/components/DashboardShell';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  User,
  Camera,
  Loader2,
  Check,
  Globe,
  Mail,
  Lock,
  User2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Cropper from 'react-easy-crop';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'ar', label: 'العربية' },
];

export default function AuditorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [session, setSession] = useState<{ uid: string; orgId: string } | null>(null);

  const [userDoc, setUserDoc] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const userPhotoInputRef = useRef<HTMLInputElement>(null);

  // Crop states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const [profileForm, setProfileForm] = useState({ name: '', email: '', language: 'en' });
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    const match = document.cookie.match(/audiment_session=([^;]+)/);
    if (match) {
      try {
        const data = JSON.parse(decodeURIComponent(match[1]));
        setSession({ uid: data.uid, orgId: data.organizationId });
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
          setProfileForm({ 
            name: d.name || '', 
            email: d.email || '', 
            language: d.language || 'en' 
          });
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
    } catch (err) {
      console.error('Failed to remove photo:', err);
    }
  };

  const updateProfile = async () => {
    if (!session) return;
    setUpdating('profile');
    try {
      await setDoc(doc(db, 'users', session.uid), { 
        name: profileForm.name,
        language: profileForm.language 
      }, { merge: true });
      
      if (profileForm.email !== userDoc.email) {
        await updateEmail(auth.currentUser!, profileForm.email);
        await setDoc(doc(db, 'users', session.uid), { email: profileForm.email }, { merge: true });
      }
      setUserDoc((prev: any) => ({ ...prev, ...profileForm }));
      flashSuccess('profile');
    } catch (err: any) { alert(err.message || 'Failed to update profile'); }
    finally { setUpdating(null); }
  };

  const updatePasswordFlow = async () => {
    if (!auth.currentUser || passwordForm.newPassword !== passwordForm.confirmPassword) return;
    setUpdating('password');
    try {
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      flashSuccess('password');
    } catch (err: any) { alert(err.message || 'Failed. Try re-logging in first.'); }
    finally { setUpdating(null); }
  };

  if (loading) {
    return (
      <DashboardShell role="Auditor">
        <div className="dashboard-page-container px-4 md:px-10">
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-80 mb-8" />
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="Auditor">
      <div className="dashboard-page-container px-4 md:px-10 max-w-4xl">
        {/* Header */}
        <div className="page-header-section mb-8">
          <h1 className="page-heading">Settings</h1>
          <p className="body-text">Manage your profile, account security, and preferences.</p>
        </div>

        <div className="space-y-6 pb-20">
          
          {/* Profile Section */}
          <Card className="standard-card border-border/40 overflow-hidden">
            <CardHeader className="pb-6 border-b border-border/40 bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-[16px] font-semibold">Profile Settings</CardTitle>
                  <CardDescription className="text-[13px]">Update your personal info and photo.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Avatar upload */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                <div className="relative group">
                  <Avatar className="h-24 w-24 rounded-full border-4 border-background shadow-xl ring-1 ring-border/50">
                    <AvatarImage src={userDoc?.photoUrl} className="object-cover" />
                    <AvatarFallback className="bg-primary/5 text-primary text-2xl font-semibold">
                      {userDoc?.name?.charAt(0) || <User2 className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => userPhotoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={userPhotoInputRef} 
                    className="hidden" 
                    onChange={handleFileSelect} 
                  />
                </div>
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <p className="text-[15px] font-semibold text-heading">Profile Picture</p>
                  <p className="text-[12px] text-muted-text max-w-[200px]">JPG, PNG or GIF. Recommended size 400x400px.</p>
                  {userDoc?.photoUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleRemovePhoto}
                      className="h-7 px-0 w-fit text-destructive hover:bg-transparent hover:text-destructive/80 text-[12px] font-medium"
                    >
                      Remove photo
                    </Button>
                  )}
                </div>
              </div>

              {/* Personal details fields */}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label className="text-[12px] font-semibold text-muted-text uppercase tracking-wider">Full Name</Label>
                  <Input 
                    value={profileForm.name} 
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} 
                    className="h-11 bg-background border-border/50 rounded-xl"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[12px] font-semibold text-muted-text uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text/40" />
                    <Input 
                      type="email" 
                      value={profileForm.email} 
                      onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} 
                      className="h-11 pl-10 bg-background border-border/50 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[12px] font-semibold text-muted-text uppercase tracking-wider">Preferred Language</Label>
                  <Select value={profileForm.language} onValueChange={val => setProfileForm(p => ({ ...p, language: val }))}>
                    <SelectTrigger className="h-11 bg-background border-border/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-text/40" />
                        <SelectValue placeholder="Select language" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-text/60 italic">This will update the dashboard UI language.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 border-t border-border/40 py-4 px-8 justify-end">
              <Button 
                onClick={updateProfile} 
                disabled={updating === 'profile'} 
                className="h-10 px-6 font-semibold rounded-xl transition-all"
              >
                {updating === 'profile' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saveSuccess === 'profile' ? <Check className="mr-2 h-4 w-4" /> : null}
                {saveSuccess === 'profile' ? 'Saved' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>

          {/* Password Section */}
          <Card className="standard-card border-border/40 overflow-hidden">
            <CardHeader className="pb-6 border-b border-border/40 bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Lock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-[16px] font-semibold">Change Password</CardTitle>
                  <CardDescription className="text-[13px]">Secure your mission access.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid gap-2">
                <Label className="text-[12px] font-semibold text-muted-text uppercase tracking-wider">New Password</Label>
                <Input 
                  type="password" 
                  placeholder="Minimum 8 characters"
                  value={passwordForm.newPassword} 
                  onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} 
                  className="h-11 bg-background border-border/50 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[12px] font-semibold text-muted-text uppercase tracking-wider">Confirm New Password</Label>
                <Input 
                  type="password" 
                  value={passwordForm.confirmPassword} 
                  onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} 
                  className="h-11 bg-background border-border/50 rounded-xl"
                />
              </div>
              {passwordForm.newPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg text-[12px] text-destructive flex items-center gap-2">
                  <Check className="h-4 w-4 rotate-45" /> Passwords do not match.
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/5 border-t border-border/40 py-4 px-8 justify-end">
              <Button
                onClick={updatePasswordFlow}
                variant="outline"
                disabled={updating === 'password' || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                className="h-10 px-6 font-semibold rounded-xl border-border/50"
              >
                {updating === 'password' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : saveSuccess === 'password' ? <Check className="mr-2 h-4 w-4 text-success" /> : null}
                {saveSuccess === 'password' ? 'Updated' : 'Update Password'}
              </Button>
            </CardFooter>
          </Card>

        </div>
      </div>

      {/* Crop Modal */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold">Crop Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="relative h-72 w-full bg-black/5 rounded-2xl overflow-hidden my-4">
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
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl h-11" onClick={() => setCropModalOpen(false)}>Cancel</Button>
            <Button className="rounded-xl h-11" onClick={handleCropSave}>Save Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
