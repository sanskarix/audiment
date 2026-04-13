'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  isSynced: boolean;
  uid: string | null;
  role: string | null;
  orgId: string | null;
}

const AuthContext = createContext<AuthState>({
  isSynced: false,
  uid: null,
  role: null,
  orgId: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isSynced: false,
    uid: null,
    role: null,
    orgId: null,
  });

  useEffect(() => {
    // Return the unsubscribe function
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // This ensures the ID token is refreshed and contains the latest custom claims (role, orgId)
          // before we signal to components that they can start Firestore listeners.
          await user.getIdToken(true);
          const idTokenResult = await user.getIdTokenResult();
          const role = (idTokenResult.claims.role as string || '').toLowerCase() || null;
          const orgId = (idTokenResult.claims.organizationId as string) || (idTokenResult.claims.orgId as string) || null;

          setAuthState({
            isSynced: true,
            uid: user.uid,
            role,
            orgId,
          });
        } catch (e) {
          console.error('Failed to sync auth token:', e);
          // Even if refresh fails, we set synced = true as a fallback so the app doesn't hang,
          // though it might hit permission errors if the token is very stale.
          setAuthState(prev => ({ ...prev, isSynced: true, uid: user.uid }));
        }
      } else {
        // Auth state checked and found no user
        setAuthState({
          isSynced: true,
          uid: null,
          role: null,
          orgId: null,
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthSync = () => useContext(AuthContext);
