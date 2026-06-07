'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  GOOGLE_CLIENT_ID,
  loadGoogleScript,
  type GoogleCredentialResponse,
} from '@/lib/auth/google';

interface GoogleSignInButtonProps {
  /** Called with the Google ID token (credential) once the user signs in. */
  onCredential: (idToken: string) => void;
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  width?: number;
}

export function GoogleSignInButton({
  onCredential,
  theme = 'outline',
  text = 'continue_with',
  width = 320,
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google sign-in is not configured.');
      return;
    }

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: GoogleCredentialResponse) => {
            if (response.credential) callbackRef.current(response.credential);
          },
          cancel_on_tap_outside: true,
        });
        containerRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme,
          size: 'large',
          text,
          shape: 'pill',
          width,
          logo_alignment: 'left',
        });
      })
      .catch(() => {
        if (!cancelled) setError('Could not load Google sign-in.');
      });

    return () => {
      cancelled = true;
    };
  }, [theme, text, width]);

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return <div ref={containerRef} className="flex justify-center" />;
}
