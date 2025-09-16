import { useState } from 'react';

export function use2FA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(identifier: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/2fa/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send code');
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Unknown error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(identifier: string, code: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error || 'Invalid code');
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Unknown error');
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }

  return { sendCode, verifyCode, loading, error, setError };
}

export default use2FA;
