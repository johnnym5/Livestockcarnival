'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Eye, EyeOff, KeyRound, LoaderCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { getCmsProfile } from '@/lib/cms';

export default function AcceptEditorialInvitePage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const verifyInvite = async () => {
      const parameters = new URLSearchParams(window.location.search);
      const tokenHash = parameters.get('token_hash');
      const inviteType = parameters.get('type');

      if (tokenHash && inviteType === 'invite') {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'invite',
        });

        if (verifyError) {
          if (active) setError('This invitation link is invalid or has expired. Ask your super admin to send a new one.');
        } else if (active) {
          setIsVerified(true);
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (active && session) setIsVerified(true);
        else if (active) setError('Open the invitation link from your email to set up your account.');
      }

      if (active) setIsVerifying(false);
    };

    void verifyInvite();
    return () => {
      active = false;
    };
  }, []);

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 12) {
      setError('Use at least 12 characters for your password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setError('');
    setIsSaving(true);
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) {
      setError('We could not save your password. Please try again.');
      setIsSaving(false);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    const profile = user ? await getCmsProfile(user.id) : null;
    router.replace(profile?.role === 'super_admin' ? '/admin' : '/editor');
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#07150D] px-4 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(228,176,58,.12),transparent_55%)]" aria-hidden="true" />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0B1B11]/85 p-7 shadow-[0_40px_100px_-45px_rgba(0,0,0,.9)] backdrop-blur-xl sm:p-10">
        <div className="mb-7 grid h-12 w-12 place-items-center rounded-2xl border border-[#E4B03A]/30 bg-[#E4B03A]/10 text-[#E4B03A]">
          {isVerifying ? <LoaderCircle className="h-5 w-5 animate-spin" /> : isVerified ? <KeyRound className="h-5 w-5" /> : <Check className="h-5 w-5" />}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E4B03A]">Editorial account setup</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Choose your password</h1>
        <p className="mt-2 text-sm leading-6 text-white/55">Create a secure password to access the newsroom.</p>

        {isVerifying ? (
          <p className="mt-8 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">Verifying your invitation…</p>
        ) : isVerified ? (
          <form onSubmit={handleSetPassword} className="mt-8 space-y-5">
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">New password</span>
              <span className="relative block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={12}
                  required
                  className="h-12 w-full rounded-xl border border-white/12 bg-black/20 px-4 pr-12 text-sm text-white outline-none focus:border-[#E4B03A]/70 focus:ring-2 focus:ring-[#E4B03A]/15"
                  placeholder="At least 12 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-white/45 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Confirm password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
                className="h-12 w-full rounded-xl border border-white/12 bg-black/20 px-4 text-sm text-white outline-none focus:border-[#E4B03A]/70 focus:ring-2 focus:ring-[#E4B03A]/15"
                placeholder="Enter it once more"
              />
            </label>
            {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p>}
            <button
              type="submit"
              disabled={isSaving}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#E4B03A] px-5 text-sm font-extrabold text-[#102015] transition duration-500 hover:-translate-y-0.5 hover:bg-[#F2C65B] disabled:opacity-60"
            >
              {isSaving ? 'Saving password…' : 'Save password and continue'}
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-5">
            <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm leading-5 text-rose-100">{error}</p>
            <Link href="/admin/login" className="inline-flex h-11 items-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-white/80 transition hover:border-[#E4B03A]/50 hover:text-white">
              Return to sign in
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
