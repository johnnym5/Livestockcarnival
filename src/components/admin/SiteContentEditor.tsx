'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { DEFAULT_SITE_CONTENT } from '@/lib/siteContent';
import { supabase } from '@/lib/supabase/client';
import { Images, Save } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type ContentPage = keyof typeof DEFAULT_SITE_CONTENT;

const labels: Record<ContentPage, string> = {
  magazine: 'Homepage magazine',
  schedule: 'Schedule page',
  livestock: 'Livestock page',
  fashion: 'Fashion page',
};

function titleCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/^./, (letter) => letter.toUpperCase());
}

function updateAtPath(root: JsonValue, path: (string | number)[], value: JsonValue): JsonValue {
  if (!path.length) return value;
  const [head, ...tail] = path;
  if (Array.isArray(root)) {
    const next = [...root];
    const index = Number(head);
    next[index] = updateAtPath(next[index], tail, value);
    return next;
  }
  if (root && typeof root === 'object') {
    return { ...root, [String(head)]: updateAtPath(root[String(head)], tail, value) };
  }
  return root;
}

function blankFromSample(sample: JsonValue, key = ''): JsonValue {
  if (key.toLowerCase() === 'id') return `new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') return Object.fromEntries(Object.entries(sample).map(([childKey, child]) => [childKey, blankFromSample(child, childKey)]));
  if (typeof sample === 'boolean') return false;
  if (typeof sample === 'number') return 0;
  return '';
}

function initializeLivestockEntries(value: JsonValue): JsonValue {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const record = value as Record<string, JsonValue>;
  if (record.catalogInitialized === true) return value;
  const entries = Array.isArray(record.entries) && record.entries.length
    ? record.entries
    : DEFAULT_SITE_CONTENT.livestock.entries as JsonValue[];
  return { ...record, entries, catalogInitialized: true };
}

function ContentField({
  label,
  value,
  path,
  onChange,
  onPickImage,
}: {
  label: string;
  value: JsonValue;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: JsonValue) => void;
  onPickImage: (path: (string | number)[]) => void;
}) {
  if (Array.isArray(value)) {
    const addItem = () => {
      const sample = value[0];
      const next: JsonValue = sample && typeof sample === 'object' && !Array.isArray(sample)
        ? blankFromSample(sample)
        : /entries|breeds|records|catalog/i.test(label) ? { id: `new-${Date.now()}`, name: '', breed: '', category: '', age: '', exhibitor: '', description: '', image_url: '', is_featured: false, origin: '', purpose: '', traits: '' }
        : '';
      onChange(path, [...value, next]);
    };
    return (
      <fieldset className="min-w-0 space-y-3 rounded-xl border border-[#E1E7E0] bg-[#F9FBF8] p-3 sm:p-4">
        <legend className="px-1 text-xs font-extrabold text-[#1E4D38]">{label} ({value.length})</legend>
        {label.toLowerCase() === 'entries' && <p className="text-xs leading-relaxed text-[#68746C]">These animals appear in the public livestock catalog after you publish. Edit each animal, choose its image, or add, reorder, and remove entries below.</p>}
        {value.map((item, index) => (
          <div key={index} className="min-w-0 rounded-xl border border-[#E1E7E0] bg-white p-3">
            {item && typeof item === 'object' && !Array.isArray(item)
              ? <div className="space-y-3">{Object.entries(item).map(([key, child]) => <ContentField key={`${index}-${key}`} label={titleCase(key)} value={child} path={[...path, index, key]} onChange={onChange} onPickImage={onPickImage} />)}</div>
              : <ContentField label={`${label} ${index + 1}`} value={item} path={[...path, index]} onChange={onChange} onPickImage={onPickImage} />}
            <div className="mt-3 flex gap-2 border-t border-[#EEF1ED] pt-2">
              <button type="button" disabled={!index} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(path, next); }} className="rounded-lg border px-2.5 py-1.5 text-[10px] font-bold disabled:opacity-40">Up</button>
              <button type="button" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(path, next); }} className="rounded-lg border px-2.5 py-1.5 text-[10px] font-bold disabled:opacity-40">Down</button>
              <button type="button" onClick={() => onChange(path, value.filter((_, itemIndex) => itemIndex !== index))} className="ml-auto rounded-lg border border-rose-200 px-2.5 py-1.5 text-[10px] font-bold text-rose-700">Remove</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addItem} className="rounded-lg bg-[#E8F1E8] px-3 py-2 text-xs font-bold text-[#1E4D38]">{label.toLowerCase() === 'entries' ? 'Add animal' : `Add ${label.replace(/s$/, '')}`}</button>
      </fieldset>
    );
  }

  if (value && typeof value === 'object') {
    return <fieldset className="space-y-3 rounded-xl border border-[#E1E7E0] p-3"><legend className="px-1 text-xs font-extrabold">{label}</legend>{Object.entries(value).map(([key, child]) => <ContentField key={key} label={titleCase(key)} value={child} path={[...path, key]} onChange={onChange} onPickImage={onPickImage} />)}</fieldset>;
  }

  if (typeof value === 'boolean') {
    return <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={value} onChange={(event) => onChange(path, event.target.checked)} />{label}</label>;
  }

  const isNumber = typeof value === 'number';
  const isLongText = typeof value === 'string' && (value.length > 90 || /description|intro|body|traits|economic|activities/i.test(label));
    const isImage = typeof value === 'string' && /image|photo|cover|hero/i.test(label);
  return (
    <label className="block min-w-0 space-y-1.5 text-[11px] font-bold text-[#526057]">
      <span>{label}</span>
      {label.toLowerCase().includes('color') ? <input type="color" value={String(value || '#ffffff')} onChange={(event) => onChange(path, event.target.value)} className="h-10 w-16 rounded-lg border border-[#DDE4DC] bg-white p-1" /> : isLongText ? <textarea rows={3} value={String(value ?? '')} onChange={(event) => onChange(path, event.target.value)} className="w-full resize-y rounded-lg border border-[#DDE4DC] bg-white px-3 py-2 text-xs font-normal leading-5 outline-none focus:border-[#1E4D38]" /> :
        <input type={isNumber ? 'number' : 'text'} value={String(value ?? '')} onChange={(event) => onChange(path, isNumber ? Number(event.target.value) : event.target.value)} className="h-9 w-full min-w-0 rounded-lg border border-[#DDE4DC] bg-white px-3 text-xs font-normal outline-none focus:border-[#1E4D38]" />}
      {isImage && String(value ?? '').trim() && <Image src={String(value)} alt={`${label} preview`} width={180} height={112} unoptimized className="mt-2 h-24 w-40 rounded-lg border border-[#DDE4DC] bg-white object-cover" />}
      {isImage && <button type="button" onClick={() => onPickImage(path)} className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8F1E8] px-2.5 py-1.5 text-[10px] font-bold text-[#1E4D38]"><Images className="h-3.5 w-3.5" />Choose from media library</button>}
    </label>
  );
}

export default function SiteContentEditor({
  onChooseImage,
  allowedPages,
}: {
  onChooseImage: (setImage: (url: string) => void) => void;
  allowedPages?: ContentPage[];
}) {
  const pages = allowedPages?.length ? allowedPages : Object.keys(DEFAULT_SITE_CONTENT) as ContentPage[];
  const [selectedPage, setSelectedPage] = useState<ContentPage>(pages[0]);
  const page = pages.includes(selectedPage) ? selectedPage : pages[0];
  const [content, setContent] = useState<JsonValue>(DEFAULT_SITE_CONTENT.magazine as JsonValue);
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [loadedPage, setLoadedPage] = useState<ContentPage | null>(null);
  const loading = loadedPage !== page;
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    void supabase.from('site_page_content').select('content,status').eq('page_key', page).maybeSingle().then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) setError('Could not load saved page content. Check that the site content migration has been applied.');
      else if (data?.content) {
        const savedContent = data.content as JsonValue;
        setContent(page === 'livestock' ? initializeLivestockEntries(savedContent) : savedContent);
        setStatus(data.status as 'draft' | 'published');
      } else {
        setContent(DEFAULT_SITE_CONTENT[page] as JsonValue);
        setStatus('published');
      }
      setLoadedPage(page);
    });
    return () => { active = false; };
  }, [page]);

  const save = async (nextStatus: 'draft' | 'published') => {
    if (!content || typeof content !== 'object' || Array.isArray(content) || saving) {
      setError('Page content must be an object before it can be saved.');
      return;
    }
    if (nextStatus === 'published') {
      const record = content as Record<string, JsonValue>;
      const missing = page === 'magazine'
        ? ['title', 'intro'].some((key) => !String(record[key] ?? '').trim())
        : page === 'schedule'
          ? !record.days || typeof record.days !== 'object' || Array.isArray(record.days) || Object.keys(record.days).length < 1
          : page === 'livestock'
            ? !String(record.title ?? '').trim() || !String(record.description ?? '').trim()
            : !record.pageCopy || !String((record.pageCopy as Record<string, JsonValue>).title ?? '').trim();
      if (missing) {
        setError('Complete the required page title and introduction or add at least one schedule day before publishing.');
        return;
      }
    }
    setSaving(true);
    setError('');
    const { error: saveError } = await supabase.from('site_page_content').upsert({ page_key: page, content, status: nextStatus, updated_at: new Date().toISOString() });
    if (saveError) setError(`Could not save ${labels[page].toLowerCase()}: ${saveError.message}`);
    else {
      setStatus(nextStatus);
      setMessage(nextStatus === 'published' ? 'Changes published.' : 'Draft saved.');
    }
    setSaving(false);
  };

  const change = (path: (string | number)[], value: JsonValue) => setContent((current) => updateAtPath(current, path, value));
  const pickImage = (path: (string | number)[]) => onChooseImage((url) => change(path, url));

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E1E7E0] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9EDE8] p-4 sm:p-5">
        <div><h2 className="text-base font-extrabold">Editable page content</h2><p className="mt-1 text-xs text-[#758078]">Change text, media, colors, links, and repeatable records for public pages.</p></div>
        <select value={page} onChange={(event) => { setMessage(''); setError(''); setSelectedPage(event.target.value as ContentPage); }} className="h-10 rounded-xl border border-[#DDE4DC] bg-white px-3 text-xs font-bold">
          {pages.map((key) => <option key={key} value={key}>{labels[key]}</option>)}
        </select>
      </div>
      {message && <p role="status" className="mx-4 mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 sm:mx-5">{message}</p>}
      {error && <p role="alert" className="mx-4 mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-800 sm:mx-5">{error}</p>}
      {loading ? <p className="p-8 text-center text-sm text-[#758078]">Loading {labels[page].toLowerCase()}…</p> : (
        <div className="max-h-[72vh] space-y-4 overflow-y-auto p-4 sm:p-5">
          {content && typeof content === 'object' && !Array.isArray(content) && Object.entries(content).filter(([key]) => key !== 'catalogInitialized').map(([key, value]) => <ContentField key={key} label={titleCase(key)} value={value} path={[key]} onChange={change} onPickImage={pickImage} />)}
        </div>
      )}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E9EDE8] bg-[#FBFCFA] px-4 py-3 sm:px-5">
        <span className="text-[11px] font-semibold text-[#68746C]">Current status: {status}</span>
        <div className="flex gap-2"><button type="button" disabled={saving || loading} onClick={() => void save('draft')} className="h-9 rounded-lg border border-[#DDE4DC] bg-white px-3 text-xs font-bold disabled:opacity-50">Save draft</button><button type="button" disabled={saving || loading} onClick={() => void save('published')} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1E4D38] px-3 text-xs font-extrabold text-white disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving ? 'Saving…' : 'Publish'}</button></div>
      </footer>
    </section>
  );
}
