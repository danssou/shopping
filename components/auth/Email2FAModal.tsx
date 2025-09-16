"use client";

import { useState } from 'react';
import use2FA from '@/hooks/use2FA';

interface Props {
  isOpen: boolean;
  identifier?: string;
  onClose: () => void;
  onVerified: () => void;
}

export default function Email2FAModal({ isOpen, identifier: initialIdentifier = '', onClose, onVerified }: Props) {
  const { sendCode, verifyCode, loading, error, setError } = use2FA();
  const [step, setStep] = useState<'send' | 'verify'>(initialIdentifier ? 'verify' : 'send');
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    setError(null);
    const res = await sendCode(identifier);
    if (res.success) setStep('verify');
  };

  const handleVerify = async () => {
    setError(null);
    const res = await verifyCode(identifier, code);
    if (res.success) {
      onVerified();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 z-50 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Two-factor verification</h3>
        {step === 'send' ? (
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-1 w-full p-2 border rounded" />
            <div className="mt-4 flex gap-2">
              <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>Send code</button>
              <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-2">Enter the 6-digit code sent to <strong>{identifier}</strong>.</p>
            <input value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full p-2 border rounded" />
            <div className="mt-4 flex gap-2">
              <button onClick={handleVerify} className="px-4 py-2 bg-green-600 text-white rounded" disabled={loading}>Verify</button>
              <button onClick={() => setStep('send')} className="px-4 py-2 border rounded">Send new code</button>
              <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        )}
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
