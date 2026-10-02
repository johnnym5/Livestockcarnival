'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { DEFAULT_HOMEPAGE_MOTION, normalizeHomepageMotion, type HomepageMotionSettings } from '@/lib/homepageMotion';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_SITE_ANIMATION, getTransitionFrame, normalizeSiteAnimation, resolveSiteAnimation, SITE_ANIMATION_STORAGE_KEY, SITE_ANIMATION_UPDATED_EVENT, type SiteAnimationDocument, type SiteAnimationValues, type TransitionEffect } from '@/lib/siteAnimation';

const controls: { key: keyof HomepageMotionSettings; label: string; min: number; max: number; step: number; group: string }[] = [
  { key: 'sceneLengthVh', label: 'Total pinned scroll length (vh)', min: 280, max: 600, step: 10, group: 'Scene and opening' },
  { key: 'heroStepStagger', label: 'Delay between hero elements (seconds)', min: 0.04, max: 0.5, step: 0.01, group: 'Scene and opening' },
  { key: 'heroStepDuration', label: 'Hero element reveal (seconds)', min: 0.15, max: 1.5, step: 0.05, group: 'Scene and opening' },
  { key: 'riseDelay', label: 'Delay before deck rises (seconds)', min: 0, max: 2.5, step: 0.05, group: 'Scene and opening' },
  { key: 'riseDuration', label: 'Deck rise duration (seconds)', min: 0.25, max: 3, step: 0.05, group: 'Scene and opening' },
  { key: 'stackStartY', label: 'Deck starting position', min: 0.3, max: 0.8, step: 0.01, group: 'Scene and opening' },
  { key: 'stackScaleDesktop', label: 'Desktop deck scale', min: 0.65, max: 1.2, step: 0.01, group: 'Deck and fan' },
  { key: 'stackScaleMobile', label: 'Mobile deck scale', min: 0.55, max: 1.1, step: 0.01, group: 'Deck and fan' },
  { key: 'fanScaleDesktop', label: 'Desktop fanned card scale', min: 0.55, max: 1.25, step: 0.01, group: 'Deck and fan' },
  { key: 'fanScaleMobile', label: 'Mobile fanned card scale', min: 0.5, max: 1.1, step: 0.01, group: 'Deck and fan' },
  { key: 'stackPeek', label: 'Stack card spacing', min: 0.08, max: 0.55, step: 0.01, group: 'Deck and fan' },
  { key: 'fanSpreadDesktop', label: 'Desktop fan spread', min: 35, max: 100, step: 1, group: 'Deck and fan' },
  { key: 'fanSpreadMobile', label: 'Mobile fan spread', min: 24, max: 72, step: 1, group: 'Deck and fan' },
  { key: 'fanStartProgress', label: 'Fan start point (scene progress)', min: 0.02, max: 0.55, step: 0.01, group: 'Scroll stages' },
  { key: 'fanEndProgress', label: 'Fan open point (scene progress)', min: 0.08, max: 0.72, step: 0.01, group: 'Scroll stages' },
  { key: 'fanHoldEndProgress', label: 'End of fan hold (scene progress)', min: 0.12, max: 0.86, step: 0.01, group: 'Scroll stages' },
  { key: 'promptStartProgress', label: 'Prompt fade start (after fan opens)', min: 0.08, max: 0.84, step: 0.01, group: 'Scroll stages' },
  { key: 'promptEndProgress', label: 'Prompt fully visible (scene progress)', min: 0.1, max: 0.9, step: 0.01, group: 'Scroll stages' },
  { key: 'heroShrinkEnd', label: 'Hero shrink complete (scene progress)', min: 0.08, max: 0.48, step: 0.01, group: 'Scroll stages' },
  { key: 'magazineEndProgress', label: 'Magazine fully covering deck (scene progress)', min: 0.2, max: 1, step: 0.01, group: 'Magazine overlap' },
  { key: 'magazineRestackAt', label: 'Restack point during overlap (90%+)', min: 0.9, max: 0.98, step: 0.01, group: 'Magazine overlap' },
  { key: 'magazineScale', label: 'Deck scale under magazine', min: 0.55, max: 1, step: 0.01, group: 'Magazine overlap' },
  { key: 'magazineBlurDesktop', label: 'Desktop deck blur (px)', min: 0, max: 8, step: 0.1, group: 'Magazine overlap' },
  { key: 'magazineBlurMobile', label: 'Mobile deck blur (px)', min: 0, max: 2.5, step: 0.1, group: 'Magazine overlap' },
  { key: 'heroScaleOpeningDesktop', label: 'Desktop opening hero scale', min: 0.75, max: 1.4, step: 0.01, group: 'Hero and selection' },
  { key: 'heroScaleOpeningMobile', label: 'Mobile opening hero scale', min: 0.75, max: 1.3, step: 0.01, group: 'Hero and selection' },
  { key: 'heroScaleCoveredDesktop', label: 'Desktop covered/fan hero scale', min: 0.5, max: 1.1, step: 0.01, group: 'Hero and selection' },
  { key: 'heroScaleCoveredMobile', label: 'Mobile covered/fan hero scale', min: 0.5, max: 1.1, step: 0.01, group: 'Hero and selection' },
  { key: 'heroBlur', label: 'Hero blur after scroll (px, max 10)', min: 0, max: 10, step: 0.1, group: 'Hero and selection' },
  { key: 'heroBackgroundIntensity', label: 'Hero background animation intensity', min: 0, max: 10, step: 0.1, group: 'Hero and selection' },
  { key: 'expandedCardScaleDesktop', label: 'Desktop expanded card scale', min: 0.9, max: 1.15, step: 0.01, group: 'Hero and selection' },
  { key: 'expandedCardScaleMobile', label: 'Mobile expanded card scale', min: 0.9, max: 1.15, step: 0.01, group: 'Hero and selection' },
  { key: 'cardOpenDuration', label: 'Second-click open duration (seconds)', min: 0.2, max: 2.5, step: 0.05, group: 'Card open and close' },
  { key: 'cardOpenStartScale', label: 'Second-click start scale', min: 0.8, max: 1.15, step: 0.01, group: 'Card open and close' },
  { key: 'cardOpenEndScale', label: 'Second-click end scale', min: 0.8, max: 1.15, step: 0.01, group: 'Card open and close' },
  { key: 'cardCloseDuration', label: 'Close card duration (seconds)', min: 0.15, max: 2.5, step: 0.05, group: 'Card open and close' },
  { key: 'cardCloseStartScale', label: 'Close card start scale', min: 0.8, max: 1.15, step: 0.01, group: 'Card open and close' },
  { key: 'cardCloseEndScale', label: 'Close card end scale', min: 0.8, max: 1.15, step: 0.01, group: 'Card open and close' },
];

export default function HomepageAnimationTuner() {
  const [settings, setSettings] = useState(DEFAULT_HOMEPAGE_MOTION);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [siteDocument, setSiteDocument] = useState<SiteAnimationDocument>(DEFAULT_SITE_ANIMATION);
  const [route, setRoute] = useState('all');
  const [siteSaving, setSiteSaving] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0.5);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [transitionPreviewMode, setTransitionPreviewMode] = useState<'in' | 'out'>('in');
  const [transitionPreviewKey, setTransitionPreviewKey] = useState(0);
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
    if (error) {
      setMessage(`Could not save site animation settings: ${error.message}`);
    } else {
      const normalized = normalizeSiteAnimation(siteDocument);
      try { window.localStorage.setItem(SITE_ANIMATION_STORAGE_KEY, JSON.stringify(normalized)); } catch { /* Storage may be unavailable. */ }
      window.dispatchEvent(new CustomEvent(SITE_ANIMATION_UPDATED_EVENT, { detail: normalized }));
      setMessage('Site-wide animation settings saved and applied.');
    }
    setSiteSaving(false);
  };
  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('homepage_motion_settings').upsert({ id: 1, settings, updated_at: new Date().toISOString() });
    setMessage(error ? `Could not save settings: ${error.message}` : 'Animation settings saved.');
    setSaving(false);
  };
  const spread = settings.fanSpreadDesktop;
  const heroRevealSequences = [
    'Logo → eyebrow → headline → introduction',
    'Headline → logo → eyebrow → introduction',
    'Logo → headline → introduction → eyebrow',
    'Eyebrow → logo → headline → introduction',
  ];
  const heroRevealSequence = heroRevealSequences[Math.round(settings.heroRevealPreset)] ?? heroRevealSequences[0];
  const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
  const isPreviewMobile = previewViewport === 'mobile';
  const fanAmount = clamp01((previewProgress - settings.fanStartProgress) / (settings.fanEndProgress - settings.fanStartProgress));
  const overlapAmount = clamp01((previewProgress - settings.fanHoldEndProgress) / (settings.magazineEndProgress - settings.fanHoldEndProgress));
  const restackAmount = clamp01((overlapAmount - settings.magazineRestackAt) / (1 - settings.magazineRestackAt));
  const fanVisible = fanAmount * (1 - restackAmount);
  const promptIn = clamp01((previewProgress - settings.promptStartProgress) / (settings.promptEndProgress - settings.promptStartProgress));
  const promptOut = 1 - clamp01((previewProgress - settings.fanHoldEndProgress) / (settings.magazineEndProgress - settings.fanHoldEndProgress));
  const activeStackScale = isPreviewMobile ? settings.stackScaleMobile : settings.stackScaleDesktop;
  const activeFanScale = isPreviewMobile ? settings.fanScaleMobile : settings.fanScaleDesktop;
  const stageScale = (activeStackScale + fanAmount * (activeFanScale - activeStackScale)) * (1 - restackAmount * (1 - settings.magazineScale));
  const heroOpeningScale = isPreviewMobile ? settings.heroScaleOpeningMobile : settings.heroScaleOpeningDesktop;
  const heroCoveredScale = isPreviewMobile ? settings.heroScaleCoveredMobile : settings.heroScaleCoveredDesktop;
  const heroPreviewProgress = clamp01(previewProgress / settings.heroShrinkEnd);
  const heroPreviewScale = heroOpeningScale + heroPreviewProgress * (heroCoveredScale - heroOpeningScale);
  const expandedPreviewScale = isPreviewMobile ? settings.expandedCardScaleMobile : settings.expandedCardScaleDesktop;
  const overlapBlur = restackAmount * (isPreviewMobile ? settings.magazineBlurMobile : settings.magazineBlurDesktop);
  return <div className="space-y-6"><section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div className="rounded-2xl border border-[#E1E7E0] bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-base font-extrabold">Homepage animation tuner</h2><p className="mt-1 text-xs text-[#758078]">Changes preview here and only reach the homepage after you save.</p>
      <label className="mt-5 block max-w-lg text-xs font-bold text-[#526057]">Hero reveal order<select className="mt-2 h-10 w-full rounded-lg border border-[#DDE4DC] bg-white px-3" value={Math.round(settings.heroRevealPreset)} onChange={(event) => setSettings((current) => normalizeHomepageMotion({ ...current, heroRevealPreset: Number(event.target.value) }))}><option value="0">Logo → eyebrow → headline → introduction</option><option value="1">Headline → logo → eyebrow → introduction</option><option value="2">Logo → headline → introduction → eyebrow</option><option value="3">Eyebrow → logo → headline → introduction</option></select></label>
      <div className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">{controls.map((control, index) => <div key={control.key}>{(index === 0 || controls[index - 1].group !== control.group) && <h3 className="mb-2 mt-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8D6B1B] sm:col-span-2">{control.group}</h3>}<label className="block text-xs font-bold text-[#526057]">{control.label}<div className="mt-2 flex items-center gap-3"><input className="min-w-0 flex-1 accent-[#1E4D38]" type="range" min={control.min} max={control.max} step={control.step} value={settings[control.key]} onChange={(event) => setSettings((current) => normalizeHomepageMotion({ ...current, [control.key]: Number(event.target.value) }))} /><output className="w-12 text-right tabular-nums">{settings[control.key] < 1 ? settings[control.key].toFixed(2) : settings[control.key]}</output></div></label></div>)}</div>
      {message && <p className="mt-5 text-xs font-semibold text-[#1E4D38]">{message}</p>}
      <button type="button" onClick={() => void save()} disabled={saving} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white disabled:opacity-60"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save animation settings'}</button>
    </div>
    <aside className="rounded-2xl border border-[#E1E7E0] bg-[#FBFCFA] p-5">
      <h3 className="text-xs font-extrabold uppercase tracking-wider">Deck preview</h3>
      <label className="mt-3 block text-[11px] font-bold text-[#526057]">Preview viewport<select className="mt-1 h-9 w-full rounded-lg border border-[#DDE4DC] bg-white px-2" value={previewViewport} onChange={(event) => setPreviewViewport(event.target.value as 'desktop' | 'mobile')}><option value="desktop">Desktop</option><option value="mobile">Mobile</option></select></label>
      <div className={`relative mt-3 h-64 overflow-hidden rounded-xl border border-[#E7EAE6] bg-[#F4F1E8] ${isPreviewMobile ? 'mx-auto max-w-[190px]' : ''}`} style={{ backgroundImage: `radial-gradient(ellipse at 50% 18%, rgba(232,196,104,${settings.heroBackgroundIntensity / 25}), transparent 64%)` }}>
        <div className="absolute inset-x-2 top-8 z-0 text-center" style={{ transform: `scale(${heroPreviewScale})`, opacity: Math.max(0.12, 1 - fanAmount * 0.88), filter: `blur(${heroPreviewProgress * settings.heroBlur}px)` }}><Image src="/assets/branding/carnival-logo-transparent.png" alt="" width={60} height={46} className="mx-auto h-7 w-auto" /><p className="mt-1 text-[8px] font-black leading-tight text-[#17221A]">WELCOME TO THE <span className="text-[#D9A928]">NATIONAL CARNIVAL</span></p></div>
        <p className="absolute inset-x-0 top-4 z-20 text-center text-[11px] font-black uppercase tracking-wide text-[#101820]" style={{ opacity: promptIn * promptOut, filter: `blur(${(1 - promptIn) * 3 + (1 - promptOut) * 2}px)` }}>PICK A CARD AND <span className="text-[#D9A928]">EXPLORE!</span></p>
        <div className="absolute left-1/2 top-[61%] h-24 w-44 transition-[filter,transform]" style={{ transform: `translate(-50%, calc(-50% + ${(1 - fanAmount) * settings.stackStartY * 38 - fanAmount * 59}px)) scale(${stageScale})`, filter: `blur(${overlapBlur}px)` }}>
          {Array.from({ length: 5 }, (_, index) => { const n = index - 2; const colors = ['#0D4020', '#2A2006', '#20125C', '#0D4845', '#0E2014']; const fanX = n * (isPreviewMobile ? settings.fanSpreadMobile : spread) * (isPreviewMobile ? 0.5 : 0.82) * fanVisible; const rotation = n * (isPreviewMobile ? 8 : 13) * fanVisible; return <div key={index} className="absolute left-1/2 top-1/2 grid place-items-center rounded-xl border-2 bg-gradient-to-br shadow-lg" style={{ width: '100%', aspectRatio: isPreviewMobile ? '9 / 16' : '16 / 9', borderColor: '#D9A928', background: `linear-gradient(135deg, ${colors[index]}, #031209)`, transform: `translate(calc(-50% + ${fanX}px), calc(-50% + ${Math.abs(n) * settings.stackPeek * 10}px)) rotate(${rotation}deg)`, zIndex: index }}>{index === 2 && <Image src="/assets/branding/carnival-logo-transparent.png" alt="" width={54} height={42} className="w-10" />}</div>; })}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[#D9A928]/60 transition-[height,opacity]" style={{ height: `${overlapAmount * 100}%`, opacity: overlapAmount, background: '#F4F1E8' }} />
        {previewExpanded && <div className="absolute inset-0 z-40 grid place-items-center bg-black/35 backdrop-blur-sm"><div className="grid h-full w-full place-items-center rounded-xl border-2 border-[#D9A928] bg-gradient-to-br from-[#0D4020] to-[#031209] shadow-2xl" style={{ transform: `scale(${expandedPreviewScale})` }}><div className="text-center"><Image src="/assets/branding/carnival-logo-transparent.png" alt="" width={70} height={54} className="mx-auto w-12" /><span className="mt-2 block text-[9px] font-black uppercase tracking-widest text-[#F2C349]">Expanded card preview</span></div></div><button type="button" onClick={() => setPreviewExpanded(false)} className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#1E4D38]">Close preview</button></div>}
      </div>
      <button type="button" onClick={() => setPreviewExpanded((current) => !current)} className="mt-3 rounded-lg border border-[#DDE4DC] bg-white px-3 py-2 text-[10px] font-extrabold text-[#1E4D38]">{previewExpanded ? 'Hide expanded preview' : 'Preview expanded card'}</button>
      <p className="mt-3 text-[10px] font-bold text-[#526057]">Hero reveal: {heroRevealSequence}</p>
      <label className="mt-3 block text-[11px] font-bold text-[#526057]">Scrub scene preview<input className="mt-2 w-full accent-[#1E4D38]" type="range" min="0" max="1" step="0.01" value={previewProgress} onChange={(event) => setPreviewProgress(Number(event.target.value))} /><span className="flex justify-between font-medium text-[#758078]"><span>Opening</span><span>Fan</span><span>Magazine</span></span></label>
      <p className="mt-3 text-[11px] leading-5 text-[#758078]">Scrub the scene to preview the opening, fan, prompt, restack, and magazine overlap. Motion settings apply on the public homepage after saving.</p>
    </aside>
  </section>
  <section className="grid gap-5 rounded-2xl border border-[#E1E7E0] bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px] sm:p-7">
    <div>
      <h2 className="text-base font-extrabold">Site-wide animation tuner</h2>
      <p className="mt-1 text-xs leading-5 text-[#758078]">Choose all public pages for defaults, or a route for an override. Workspace routes ignore these settings.</p>
      <label className="mt-5 block max-w-sm text-xs font-bold text-[#526057]">Settings apply to<select className="mt-2 h-10 w-full rounded-lg border border-[#DDE4DC] bg-white px-3" value={route} onChange={(event) => setRoute(event.target.value)}><option value="all">All public pages (global defaults)</option>{['/', '/about', '/accreditation', '/attractions', '/contact', '/fashion-parade', '/livestock', '/media', '/nhesics', '/schedule', '/venue-map'].map((path) => <option key={path} value={path}>{path === '/' ? 'Homepage' : path.slice(1).replaceAll('-', ' ')}</option>)}</select></label>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {(['in', 'out'] as const).map((direction) => {
          const prefix = direction === 'in' ? 'transitionIn' : 'transitionOut';
          const effectKey = `${prefix}Effect` as 'transitionInEffect' | 'transitionOutEffect';
          const title = direction === 'in' ? 'Transition into page' : 'Transition out of page';
          return <fieldset key={direction} className="rounded-xl border border-[#E1E7E0] p-4"><legend className="px-1 text-xs font-extrabold text-[#1E4D38]">{title}</legend>
            <label className="block text-xs font-bold text-[#526057]">Effect<select value={siteValues[effectKey]} onChange={(event) => changeSiteValue(effectKey, event.target.value as TransitionEffect)} className="mt-2 h-10 w-full rounded-lg border border-[#DDE4DC] bg-white px-3">{[['fade','Fade'],['blur-fade','Blur and fade'],['slide-up','Slide up'],['slide-down','Slide down'],['slide-left','Slide left'],['slide-right','Slide right'],['zoom-in','Zoom in'],['zoom-out','Zoom out'],['zoom-blur','Zoom and blur']].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">{([
              [`${prefix}Duration`, 'Duration (seconds)', 0, 3, 0.05],
              [`${prefix}Blur`, 'Blur (px)', 0, 32, 1],
              [`${prefix}Scale`, direction === 'in' ? 'Starting scale' : 'Ending scale', 0.7, 1.3, 0.01],
              [`${prefix}Distance`, 'Slide distance (px)', 0, 160, 4],
            ] as [string, string, number, number, number][]).map(([rawKey, label, min, max, step]) => {
              const key = rawKey as keyof SiteAnimationValues;
              return <label key={key} className="text-[11px] font-bold text-[#526057]">{label}<div className="mt-2 flex items-center gap-2"><input type="range" min={min} max={max} step={step} value={Number(siteValues[key])} onChange={(event) => changeSiteValue(key, Number(event.target.value))} className="min-w-0 flex-1 accent-[#1E4D38]"/><output className="w-12 text-right tabular-nums">{Number(siteValues[key]).toFixed(key.toLowerCase().includes('scale') ? 2 : 1)}</output></div></label>;
            })}</div>
          </fieldset>;
        })}
        {([['homepageRevealDuration','Homepage white reveal (seconds)',0,8,0.1],['scrollDuration','Smooth scrolling speed (seconds)',0.2,2.5,0.05],['scrollRevealDuration','Scroll reveal timing (seconds)',0,2,0.05],['skeletonDuration','Skeleton animation speed (seconds)',0.4,4,0.1],['interactionDuration','Button interaction timing (seconds)',0,1,0.02]] as [keyof SiteAnimationValues,string,number,number,number][]).map(([key,label,min,max,step])=><label key={key} className="text-xs font-bold text-[#526057]">{label}<div className="mt-2 flex items-center gap-2"><input type="range" min={min} max={max} step={step} value={Number(siteValues[key])} onChange={(event) => changeSiteValue(key, Number(event.target.value))} className="min-w-0 flex-1 accent-[#1E4D38]"/><output className="w-12 text-right tabular-nums">{Number(siteValues[key]).toFixed(2)}</output></div></label>)}
        <label className="flex items-center gap-2 text-xs font-bold text-[#526057]"><input type="checkbox" checked={siteValues.skeletonEnabled} onChange={(event) => changeSiteValue('skeletonEnabled', event.target.checked)} className="accent-[#1E4D38]"/>Enable skeleton loader animation</label>
        {(route === 'all' || route === '/') && <label className="flex items-center gap-2 text-xs font-bold text-[#526057]"><input type="checkbox" checked={siteValues.cardDeckEnabled} onChange={(event) => changeSiteValue('cardDeckEnabled', event.target.checked)} className="accent-[#1E4D38]"/>Enable homepage card deck (off uses magazine)</label>}
      </div>
      <button type="button" disabled={siteSaving} onClick={() => void saveSite()} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-[#1E4D38] px-4 text-xs font-extrabold text-white disabled:opacity-60"><Save className="h-4 w-4"/>{siteSaving ? 'Saving…' : 'Save site animation settings'}</button>
    </div>
    <aside className="rounded-xl bg-[#F7F8F5] p-4"><h3 className="text-xs font-extrabold uppercase tracking-wider">Transition preview</h3><div className="mt-4 grid h-48 place-items-center overflow-hidden rounded-xl border bg-white"><motion.div key={`${transitionPreviewMode}-${transitionPreviewKey}-${transitionPreviewMode === 'in' ? siteValues.transitionInEffect : siteValues.transitionOutEffect}`} initial={transitionPreviewMode === 'in' ? getTransitionFrame(siteValues.transitionInEffect, 'in', siteValues) : { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1 }} animate={transitionPreviewMode === 'in' ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1 } : getTransitionFrame(siteValues.transitionOutEffect, 'out', siteValues)} transition={{ duration: transitionPreviewMode === 'in' ? siteValues.transitionInDuration : siteValues.transitionOutDuration, ease: transitionPreviewMode === 'in' ? 'easeOut' : 'easeIn' }} className="grid h-28 w-44 place-items-center rounded-xl bg-[#0D4020] text-xs font-black text-[#E4B03A] shadow-xl">CARNIVAL 2026</motion.div></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => { setTransitionPreviewMode('in'); setTransitionPreviewKey((key) => key + 1); }} className="rounded-lg bg-[#1E4D38] px-3 py-2 text-[10px] font-extrabold text-white">Preview entrance</button><button type="button" onClick={() => { setTransitionPreviewMode('out'); setTransitionPreviewKey((key) => key + 1); }} className="rounded-lg border border-[#DDE4DC] bg-white px-3 py-2 text-[10px] font-extrabold text-[#1E4D38]">Preview exit</button></div><p className="mt-3 text-[11px] leading-5 text-[#758078]">Previews use the selected direction’s effect, duration, blur, zoom scale, and slide distance. Saved settings apply to public page navigation.</p></aside>
  </section></div>;
}
