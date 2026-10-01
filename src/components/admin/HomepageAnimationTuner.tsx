'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { DEFAULT_HOMEPAGE_MOTION, normalizeHomepageMotion, type HomepageMotionSettings } from '@/lib/homepageMotion';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SITE_ANIMATION, normalizeSiteAnimation, resolveSiteAnimation, type SiteAnimationDocument, type SiteAnimationValues, type TransitionEffect } from '@/lib/siteAnimation';

const controls: { key: keyof HomepageMotionSettings; label: string; min: number; max: number; step: number }[] = [
  { key: 'stackStartY', label: 'Starting vertical position', min: 0.55, max: 1.2, step: 0.01 },
  { key: 'stackScaleDesktop', label: 'Desktop stack size', min: 0.35, max: 0.8, step: 0.01 },
  { key: 'stackScaleMobile', label: 'Mobile stack size', min: 0.5, max: 1, step: 0.01 },
  { key: 'stackPeek', label: 'Peek amount', min: 0.08, max: 0.45, step: 0.01 },
  { key: 'fanSpreadDesktop', label: 'Desktop fan spread', min: 35, max: 100, step: 1 },
  { key: 'fanSpreadMobile', label: 'Mobile fan spread', min: 30, max: 85, step: 1 },
  { key: 'riseDuration', label: 'Rise duration (seconds)', min: 0.25, max: 2.5, step: 0.05 },
  { key: 'fanDuration', label: 'Fan duration (seconds)', min: 0.5, max: 4, step: 0.05 },
  { key: 'flipDuration', label: 'Flip duration (seconds)', min: 0.3, max: 1.8, step: 0.05 },
  { key: 'magazineScale', label: 'Magazine overlap scale', min: 0.65, max: 1, step: 0.01 },
  { key: 'magazineBlurDesktop', label: 'Desktop overlap blur', min: 0, max: 8, step: 0.1 },
  { key: 'magazineBlurMobile', label: 'Mobile overlap blur', min: 0, max: 4, step: 0.1 },
];

export default function HomepageAnimationTuner() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_MOTION);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [siteDocument, setSiteDocument] = useState<SiteAnimationDocument>(DEFAULT_SITE_ANIMATION);
  const [route, setRoute] = useState('all');
  const [siteSaving, setSiteSaving] = useState(false);
  useEffect(() => {
    void supabase.from('homepage_motion_settings').select('settings').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data?.settings) setSettings(normalizeHomepageMotion(data.settings));
    });
  }, []);
  useEffect(() => {
    void supabase.from('site_animation_settings').select('settings').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data?.settings) setSiteDocument(normalizeSiteAnimation(data.settings));
    });
  }, []);
  const siteValues: SiteAnimationValues = route === 'all' ? siteDocument.defaults : resolveSiteAnimation(siteDocument, route);
  const changeSiteValue = <K extends keyof SiteAnimationValues>(key: K, value: SiteAnimationValues[K]) => setSiteDocument((current) => route === 'all'
    ? { ...current, defaults: { ...current.defaults, [key]: value } }
    : { ...current, pageOverrides: { ...current.pageOverrides, [route]: { ...current.pageOverrides[route], [key]: value } } });
  const saveSite = async () => {
    setSiteSaving(true);
    const { error } = await supabase.from('site_animation_settings').upsert({ id: 1, settings: siteDocument, updated_at: new Date().toISOString() });
    setMessage(error ? `Could not save site animation settings: ${error.message}` : 'Site-wide animation settings saved.');
    setSiteSaving(false);
  };
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('homepage_motion_settings').upsert({ id: 1, settings, updated_at: new Date().toISOString() });
    setMessage(error ? `Could not save settings: ${error.message}` : 'Animation settings saved.');
    setSaving(false);
  };
  const spread = settings.fanSpreadDesktop;
  return <div className="space-y-6"><section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div className="rounded-2xl border border-[#E1E7E0] bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-base font-extrabold">Homepage animation tuner</h2><p className="mt-1 text-xs text-[#758078]">Changes preview here and only reach the homepage after you save.</p>
      <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">{controls.map(({ key, label, min, max, step }) => <label key={key} className="block text-xs font-bold text-[#526057]">{label}<div className="mt-2 flex items-center gap-3"><input className="min-w-0 flex-1 accent-[#1E4D38]" type="range" min={min} max={max} step={step} value={settings[key]} onChange={(event) => setSettings((current) => ({ ...current, [key]: Number(event.target.value) }))} /><output className="w-12 text-right tabular-nums">{settings[key]}</output></div></label>)}</div>
      {message && <p className="mt-5 text-xs font-semibold text-[#1E4D38]">{message}</p>}
      <button type="button" onClick={() => void save()} disabled={saving} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save animation settings'}</button>
    </div>
    <aside className="rounded-2xl border border-[#E1E7E0] bg-[#FBFCFA] p-5"><h3 className="text-xs font-extrabold uppercase tracking-wider">Live preview</h3><div className="relative mt-4 h-64 overflow-hidden rounded-xl border border-[#E7EAE6] bg-[#F4F1E8]"><div className="absolute left-1/2 top-1/2 h-32 w-48 -translate-x-1/2 -translate-y-1/2" style={{ transform: `translate(-50%, calc(-50% + ${(settings.stackStartY - 0.5) * 90}px))` }}>{Array.from({ length: 5 }, (_, index) => { const n = index - 2; return <div key={index} className="absolute inset-0 rounded-xl border-2 border-[#E4B03A] bg-gradient-to-br from-[#0D4020] to-[#031209] shadow-lg transition-all" style={{ transitionDuration: `${settings.fanDuration}s`, transform: `translate(${n * spread * 0.48}px, ${Math.abs(n) * settings.stackPeek * 36}px) rotate(${n * 9}deg) scale(${settings.stackScaleDesktop})`, zIndex: 5 - Math.abs(n) }} />; })}<p className="absolute inset-x-0 -top-9 text-center text-xs font-black uppercase text-[#101820]">Pick a card and explore</p></div></div><p className="mt-3 text-[11px] leading-5 text-[#758078]">Preview responds to stack position, size, peek, and fan timing. Test final scroll timing on the public homepage after saving.</p></aside>
  </section>
  <section className="grid gap-5 rounded-2xl border border-[#E1E7E0] bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px] sm:p-7">
    <div>
      <h2 className="text-base font-extrabold">Site-wide animation tuner</h2>
      <p className="mt-1 text-xs leading-5 text-[#758078]">Choose all public pages for defaults, or a route for an override. Workspace routes ignore these settings.</p>
      <label className="mt-5 block max-w-sm text-xs font-bold text-[#526057]">Settings apply to<select className="mt-2 h-10 w-full rounded-lg border border-[#DDE4DC] bg-white px-3" value={route} onChange={(event) => setRoute(event.target.value)}><option value="all">All public pages (global defaults)</option>{['/', '/about', '/accreditation', '/attractions', '/contact', '/fashion-parade', '/livestock', '/media', '/nhesics', '/schedule', '/venue-map'].map((path) => <option key={path} value={path}>{path === '/' ? 'Homepage' : path.slice(1).replaceAll('-', ' ')}</option>)}</select></label>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-[#526057]">Page transition style<select value={siteValues.transitionEffect} onChange={(event) => changeSiteValue('transitionEffect', event.target.value as TransitionEffect)} className="mt-2 h-10 w-full rounded-lg border border-[#DDE4DC] bg-white px-3"><option value="fade">Fade</option><option value="blur-fade">Blur and fade</option><option value="slide-fade">Slide and fade</option></select></label>
        {([['transitionDuration','Transition duration (seconds)',0,3,0.05],['homepageRevealDuration','Homepage white reveal (seconds)',0,8,0.1],['scrollDuration','Smooth scrolling speed (seconds)',0.2,2.5,0.05],['scrollRevealDuration','Scroll reveal timing (seconds)',0,2,0.05],['skeletonDuration','Skeleton animation speed (seconds)',0.4,4,0.1],['interactionDuration','Button interaction timing (seconds)',0,1,0.02]] as [keyof SiteAnimationValues,string,number,number,number][]).map(([key,label,min,max,step])=><label key={key} className="text-xs font-bold text-[#526057]">{label}<div className="mt-2 flex items-center gap-2"><input type="range" min={min} max={max} step={step} value={Number(siteValues[key])} onChange={(event) => changeSiteValue(key, Number(event.target.value))} className="min-w-0 flex-1 accent-[#1E4D38]"/><output className="w-12 text-right tabular-nums">{Number(siteValues[key]).toFixed(2)}</output></div></label>)}
        <label className="flex items-center gap-2 text-xs font-bold text-[#526057]"><input type="checkbox" checked={siteValues.skeletonEnabled} onChange={(event) => changeSiteValue('skeletonEnabled', event.target.checked)} className="accent-[#1E4D38]"/>Enable skeleton loader animation</label>
        {(route === 'all' || route === '/') && <label className="flex items-center gap-2 text-xs font-bold text-[#526057]"><input type="checkbox" checked={siteValues.cardDeckEnabled} onChange={(event) => changeSiteValue('cardDeckEnabled', event.target.checked)} className="accent-[#1E4D38]"/>Enable homepage card deck (off uses magazine)</label>}
      </div>
      <button type="button" disabled={siteSaving} onClick={() => void saveSite()} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white disabled:opacity-60"><Save className="h-4 w-4"/>{siteSaving ? 'Saving…' : 'Save site animation settings'}</button>
    </div>
    <aside className="rounded-xl bg-[#F7F8F5] p-4"><h3 className="text-xs font-extrabold uppercase tracking-wider">Transition preview</h3><div className="mt-4 grid h-48 place-items-center overflow-hidden rounded-xl border bg-white"><div key={`${siteValues.transitionEffect}-${siteValues.transitionDuration}`} className="grid h-28 w-44 place-items-center rounded-xl bg-[#0D4020] text-xs font-black text-[#E4B03A] shadow-xl" style={{ animation: `site-transition-preview ${siteValues.transitionDuration}s ease both`, filter: siteValues.transitionEffect === 'blur-fade' ? 'drop-shadow(0 0 6px #1E4D38)' : undefined }}>CARNIVAL 2026</div></div><p className="mt-3 text-[11px] leading-5 text-[#758078]">This preview updates immediately; public pages use it after saving. Reduced-motion preferences shorten animations for visitors who request them.</p></aside>
  </section></div>;
}
