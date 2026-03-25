'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import DashboardShell from '@/components/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FlashmobAuditDetailsPage() {
  const params = useParams();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      if (!params?.flashmobId) return;
      try {
        const docRef = doc(db, 'flashmobAudits', params.flashmobId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAudit({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [params?.flashmobId]);

  if (loading) {
    return (
      <DashboardShell role="Admin">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="Admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Audit Not Found</h2>
          <Link href="/dashboard/admin/flashmob" passHref>
            <Button>Return to Flashmob Logs</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const date = audit.submittedAt?.toDate();

  return (
    <DashboardShell role="Admin">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/flashmob" passHref>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Flashmob Audit Details</h1>
            <p className="text-muted-foreground">Reviewing scan from {audit.locationName}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Audit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><User className="h-4 w-4" /> Auditor</span>
                  <p className="font-medium">{audit.auditorName || 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</span>
                  <p className="font-medium">{audit.locationName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Date</span>
                  <p className="font-medium">{date ? date.toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> Time</span>
                  <p className="font-medium">{date ? date.toLocaleTimeString() : 'N/A'}</p>
                </div>
              </div>
              
              {(audit.latitude && audit.longitude) && (
                <div className="mt-6 pt-6 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">Geo-Location Verified</p>
                      <p className="text-xs text-muted-foreground">{audit.latitude}, {audit.longitude}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => window.open(`https://www.google.com/maps?q=${audit.latitude},${audit.longitude}`, '_blank')}>
                    View on Map
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2 flex flex-col">
            <CardHeader>
              <CardTitle>Video Evidence</CardTitle>
              <CardDescription>Uncut 20-second location scan</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="relative aspect-video bg-black rounded-md overflow-hidden flex-1">
                <video src={audit.videoUrl} controls className="h-full w-full object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Auditor Verification</CardTitle>
              <CardDescription>Selfie captured on-site</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="relative flex-1 bg-zinc-100 rounded-md overflow-hidden min-h-[300px]">
                <img src={audit.selfieUrl} alt="Auditor Selfie" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
