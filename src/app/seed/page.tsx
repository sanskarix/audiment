'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';

export default function SeedPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const seedUsers = async () => {
    setLoading(true);
    setStatus('Seeding users...\n');
    
    const usersToCreate = [
      {
        email: 'admin@audiment.com',
        password: 'Admin123!',
        role: 'ADMIN',
        name: 'Test Admin',
        organizationId: 'org_test_123',
      },
      {
        email: 'manager@audiment.com',
        password: 'Manager123!',
        role: 'MANAGER',
        name: 'Test Manager',
        organizationId: 'org_test_123',
      },
      {
        email: 'auditor@audiment.com',
        password: 'Auditor123!',
        role: 'AUDITOR',
        name: 'Test Auditor',
        organizationId: 'org_test_123',
      }
    ];

    for (const testUser of usersToCreate) {
      let uid = '';
      try {
        const credential = await createUserWithEmailAndPassword(auth, testUser.email, testUser.password);
        uid = credential.user.uid;
        setStatus(prev => prev + `✅ Created Auth user for ${testUser.role} (${testUser.email})\n`);
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          setStatus(prev => prev + `⚠️ Auth user already exists for ${testUser.role} (${testUser.email})\n`);
          // We don't have the UID here unless we sign in or use admin SDK, 
          // but if the user run this with the MCP users I found, I'll assume they match.
          // Let's just catch this and let the user know they need to login with the correct password.
        } else {
          setStatus(prev => prev + `❌ Error creating Auth ${testUser.role}: ${err.message}\n`);
          continue;
        }
      }

      // If we got here and didn't have UID, we can't update Firestore directly from client.
      // But we can inform the user.
      if (uid) {
        try {
          await setDoc(doc(db, 'users', uid), {
            uid,
            email: testUser.email,
            role: testUser.role,
            name: testUser.name,
            organizationId: testUser.organizationId,
            isActive: true,
            createdAt: new Date(),
          });
          setStatus(prev => prev + `✅ Created Firestore document for ${testUser.role}\n`);
        } catch (dbErr: any) {
          setStatus(prev => prev + `❌ Error updating Firestore for ${testUser.role}: ${dbErr.message}\n`);
        }
      }
    }

    setStatus(prev => prev + '\nSeeding complete! You can now delete this page or test login.');
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-4 max-w-lg mx-auto mt-10 border rounded-lg">
      <h1 className="text-2xl font-bold">Database Seeder</h1>
      <p className="text-muted-foreground text-sm">
        This will create three Firebase Auth users and add their corresponding records to the Firestore <code>users</code> collection.
      </p>
      
      <Button onClick={seedUsers} disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Test Accounts'}
      </Button>

      {status && (
        <pre className="mt-4 p-4 bg-zinc-100 dark:bg-zinc-900 rounded text-xs whitespace-pre-wrap">
          {status}
        </pre>
      )}
    </div>
  );
}
