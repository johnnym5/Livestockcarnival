'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { getCmsProfile } from '@/lib/cms';
import { supabase } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setIsChecking(false);
        return;
      }

      try {
        const profile = await getCmsProfile(session.user.id);
        if (active && profile) {
          router.replace('/admin');
          return;
        }
        if (active && !profile) {
          await supabase.auth.signOut();
          setError('This account does not have editorial access. Ask your super admin for an invitation.');
        }
      } catch {
        if (active) setError('We could not verify this account. Please try signing in again.');
      }

      if (active) setIsChecking(false);
    };

    void checkSession();
    return () => {
      active = false;
    };
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError || !data.user) {
      setError('Check your email and password, then try again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const profile = await getCmsProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        setError('This account does not have editorial access. Ask your super admin for an invitation.');
        setIsSubmitting(false);
        return;
      }

      router.replace('/admin');
    } catch {
      await supabase.auth.signOut();
      setError('We could not verify this account. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07150D] px-4 py-10 text-white sm:px-6">
      <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_18%,rgba(228,176,58,0.14),transparent_38%),radial-gradient(ellipse_at_82%_82%,rgba(30,77,56,0.4),transparent_44%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.4)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B1B11]/80 shadow-[0_40px_100px_-45px_rgba(0,0,0,.9)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
          <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#123B26] via-[#0B2115] to-[#08130D] p-12 lg:flex">
            <div className="absolute inset-0 opacity-25" aria-hidden="true">
              <div className="absolute -right-24 top-20 h-80 w-80 rounded-full border border-[#E4B03A]/50" />
              <div className="absolute -right-10 top-34 h-52 w-52 rounded-full border border-white/20" />
            </div>
            <Link href="/" className="relative inline-flex w-fit items-center gap-3 text-sm font-semibold text-white/80 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to carnival site
            </Link>
            <div className="relative max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E4B03A]/30 bg-[#E4B03A]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#F2C65B]">
                <ShieldCheck className="h-3.5 w-3.5" />
                Editorial workspace
              </div>
              <h1 className="text-5xl font-black leading-[1.04] tracking-tight">
                The newsroom, <span className="text-[#E4B03A]">in your hands.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Manage press stories and media imagery for the National Livestock Carnival.
              </p>
            </div>
            <p className="relative text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              National Livestock Carnival · Media Center
            </p>
          </section>

          <section className="flex min-h-[620px] items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <Link href="/" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold text-white/55 transition-colors hover:text-white lg:hidden">
                <ArrowLeft className="h-4 w-4" />
                Back to site
              </Link>

              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E4B03A]/30 bg-[#E4B03A]/10 text-[#E4B03A]">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E4B03A]">Secure sign in</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">Use the account invited by your super admin.</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="block space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Work email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    required
                    placeholder="name@livestockcarnival.ng"
                    className="h-12 w-full rounded-xl border border-white/12 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-[#E4B03A]/70 focus:ring-2 focus:ring-[#E4B03A]/15"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Password</span>
                  <span className="relative block">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-xl border border-white/12 bg-black/20 px-4 pr-12 text-sm text-white outline-none transition focus:border-[#E4B03A]/70 focus:ring-2 focus:ring-[#E4B03A]/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 grid w-12 place-items-center text-white/45 transition hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </span>
                </label>

                {error && (
                  <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm leading-5 text-rose-100">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isChecking}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#E4B03A] px-5 text-sm font-extrabold text-[#102015] shadow-[0_12px_30px_-12px_rgba(228,176,58,.7)] transition duration-500 hover:-translate-y-0.5 hover:bg-[#F2C65B] disabled:cursor-wait disabled:opacity-60"
                >
                  {isChecking ? 'Checking access…' : isSubmitting ? 'Signing in…' : 'Sign in to newsroom'}
                </button>
              </form>

              <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-white/40">
                Access is invite-only. Contact the super admin if you need an editorial account.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
