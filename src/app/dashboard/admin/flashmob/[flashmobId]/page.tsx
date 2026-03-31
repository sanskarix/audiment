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
          <Loader2 className="h-8 w-8 animate-spin text-muted-text" />
        </div>
      </DashboardShell>
    );
  }

  if (!audit) {
    return (
      <DashboardShell role="Admin">
        <div className="text-center py-12">
          <h2 className="page-heading mb-4">Audit not found</h2>
          <Link href="/dashboard/admin/flashmob" passHref>
            <Button>Return to flashmob logs</Button>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const date = audit.submittedAt?.toDate();

  return (
    <DashboardShell role="Admin">
      <div className="dashboard-page-container max-w-5xl mx-auto">
        <div className="page-header-section mb-xl flex flex-col md:flex-row md:items-center gap-xl">
          <Link href="/dashboard/admin/flashmob" passHref>
            <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 md:-ml-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex flex-col gap-xs">
            <h1 className="page-heading">Flashmob Audit Details</h1>
            <p className="body-text">Reviewing scan from {audit.locationName}</p>
          </div>
        </div>

        <div className="grid gap-xl md:grid-cols-3">
          <Card className="standard-card md:col-span-3">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-xl">
              <CardTitle className="section-heading">Audit Information</CardTitle>
            </CardHeader>
            <CardContent className="p-xl space-y-xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <span className="muted-label flex items-center gap-1.5"><User className="h-4 w-4" /> Auditor</span>
                  <p className="standard-table-cell p-0">{audit.auditorName || 'Unknown'}</p>
                </div>
                <div className="space-y-1">
                  <span className="muted-label flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Location</span>
                  <p className="standard-table-cell p-0">{audit.locationName}</p>
                </div>
                <div className="space-y-1">
                  <span className="muted-label flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Date</span>
                  <p className="standard-table-cell p-0">{date ? date.toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="muted-label flex items-center gap-1.5"><Clock className="h-4 w-4" /> Time</span>
                  <p className="standard-table-cell p-0">{date ? date.toLocaleTimeString() : 'N/A'}</p>
                </div>
              </div>

              {(audit.latitude && audit.longitude) && (
                <div className="pt-xl border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-success" />
                    <div>
                      <p className="muted-label">Geo-location verified</p>
                      <p>{audit.latitude}, {audit.longitude}</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => window.open(`https://www.google.com/maps?q=${audit.latitude},${audit.longitude}`, '_blank')}>
                    View on Map
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="standard-card md:col-span-2 flex flex-col">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-xl">
              <CardTitle className="section-heading">Video Evidence</CardTitle>
              <CardDescription className="body-text">Uncut 20-second location scan</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-xl">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex-1 shadow-inner">
                <video src={audit.videoUrl} controls className="h-full w-full object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card className="standard-card flex flex-col">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-xl">
              <CardTitle className="section-heading">Auditor Verification</CardTitle>
              <CardDescription className="body-text">Selfie captured on-site</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-xl">
              <div className="relative flex-1 bg-muted/30 rounded-lg overflow-hidden min-h-[300px] shadow-inner">
                <img src={audit.selfieUrl} alt="Auditor Selfie" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
