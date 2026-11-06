'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { OnboardingGuide } from '@/components/onboarding/OnboardingGuide';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Bike, Building2, CakeSlice, Check,
  CheckCircle2, ChefHat, CircleHelp, Coffee, CreditCard, Download,
  FileSpreadsheet, Flame, IceCream, MapPin, Package, Plus, QrCode, Save,
  ShieldCheck, ShoppingBag, Store,
  Truck, Utensils, X,
} from 'lucide-react';

type StepId = 'business-type' | 'business-details' | 'owner-details' | 'outlets' | 'operations' | 'menu' | 'payments' | 'subscription' | 'review' | 'success';
type Outlet = {
  name: string; type: string; address: string; contact: string; openTime?: string;
  closeTime?: string; closedDays?: string; manager?: string; latitude?: string;
  longitude?: string; services?: string[];
};
type Product = {
  name: string; category: string; price: string; description?: string;
  foodType?: string; variants?: string; photoName?: string; availability?: string;
  combo?: boolean;
};
type OnboardingData = {
  businessTypes: string[];
  business: Record<string, string>;
  owner: Record<string, string>;
  outlets: Outlet[];
  modes: string[];
  operations: Record<string, string>;
  products: Product[];
  payments: string[];
  plan: string;
  launched: boolean;
};

const STORAGE_KEY = 'ordora-onboarding-v1';
const steps: { id: StepId; label: string; short: string }[] = [
  { id: 'business-type', label: 'Business type', short: 'Business' },
  { id: 'business-details', label: 'Business details', short: 'Details' },
  { id: 'owner-details', label: 'Owner account', short: 'Owner' },
  { id: 'outlets', label: 'Your outlets', short: 'Outlets' },
  { id: 'operations', label: 'How you operate', short: 'Operations' },
  { id: 'menu', label: 'Your menu', short: 'Menu' },
  { id: 'payments', label: 'Payments', short: 'Payments' },
  { id: 'subscription', label: 'Choose a plan', short: 'Plan' },
  { id: 'review', label: 'Review', short: 'Review' },
  { id: 'success', label: 'Ready to launch', short: 'Launch' },
];

const businessOptions = [
  { name: 'Restaurant', icon: Utensils, color: 'bg-orange-100 text-orange-700', note: 'Dine-in, tables & takeaway' },
  { name: 'Cafe', icon: Coffee, color: 'bg-amber-100 text-amber-800', note: 'Coffee, bakery & counter' },
  { name: 'Food Cart', icon: ShoppingBag, color: 'bg-rose-100 text-rose-700', note: 'A simple setup that moves' },
  { name: 'Food Truck', icon: Truck, color: 'bg-sky-100 text-sky-700', note: 'Mobile location & pickup' },
  { name: 'Food Kiosk', icon: Store, color: 'bg-lime-100 text-lime-800', note: 'Fast, touch-friendly service' },
  { name: 'Cloud Kitchen', icon: ChefHat, color: 'bg-violet-100 text-violet-700', note: 'Delivery & virtual brands' },
  { name: 'QSR', icon: Flame, color: 'bg-red-100 text-red-700', note: 'Quick service & order tokens' },
  { name: 'Bakery', icon: CakeSlice, color: 'bg-pink-100 text-pink-700', note: 'Pre-orders & product variants' },
  { name: 'Food Court Outlet', icon: Building2, color: 'bg-teal-100 text-teal-700', note: 'Independent vendor operations' },
  { name: 'Juice & Beverage Shop', icon: IceCream, color: 'bg-green-100 text-green-700', note: 'Drinks, sizes & add-ons' },
  { name: 'Franchise', icon: Bike, color: 'bg-indigo-100 text-indigo-700', note: 'Central tools for every outlet' },
  { name: 'Other', icon: Package, color: 'bg-stone-100 text-stone-700', note: 'A different kind of food business' },
];

const templates: Record<string, string[]> = {
  Cafe: ['Hot Coffee', 'Cold Coffee', 'Tea', 'Bakery', 'Sandwiches', 'Desserts'],
  'Food Cart': ['Main Items', 'Snacks', 'Beverages', 'Combos'],
  Restaurant: ['Starters', 'Main Course', 'Breads', 'Beverages', 'Desserts'],
  Bakery: ['Breads', 'Pastries', 'Cakes', 'Cookies'],
  default: ['Popular', 'Food', 'Beverages', 'Combos'],
};

const emptyData: OnboardingData = {
  businessTypes: [], business: {}, owner: {}, outlets: [], modes: [], operations: {},
  products: [], payments: [], plan: 'Free trial', launched: false,
};

const inputClass = 'w-full rounded-xl border border-ordora-border bg-white px-3.5 py-3 text-sm text-ordora-charcoal outline-none transition placeholder:text-ordora-muted/60 focus:border-ordora-coral focus:ring-2 focus:ring-ordora-coral/10';
const labelClass = 'mb-1.5 block text-xs font-semibold text-ordora-charcoal';

function Field({ label, name, value, onChange, required, placeholder, type = 'text', help }: {
  label: string; name: string; value: string; onChange: (name: string, value: string) => void;
  required?: boolean; placeholder?: string; type?: string; help?: string;
}) {
  return <label className="block">
    <span className={labelClass}>{label}{required && <span className="ml-1 text-ordora-coral">*</span>}</span>
    <input className={inputClass} name={name} type={type} value={value || ''} placeholder={placeholder} required={required} onChange={(event) => onChange(name, event.target.value)} />
    {help && <span className="mt-1 block text-[11px] leading-relaxed text-ordora-muted">{help}</span>}
  </label>;
}

export function OnboardingFlow({ step: routeStep }: { step: string }) {
  const [data, setData] = useState<OnboardingData>(emptyData);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState('');
  const [qr, setQr] = useState('');
  const [outletDraft, setOutletDraft] = useState<Outlet>({ name: '', type: 'Main outlet', address: '', contact: '', services: [] });
  const [productDraft, setProductDraft] = useState<Product>({ name: '', category: '', price: '', foodType: 'Vegetarian', availability: 'Available', combo: false });
  const index = steps.findIndex((item) => item.id === routeStep);
  const currentIndex = routeStep === 'start' ? -1 : Math.max(0, index);
  const current = steps[currentIndex];
  const progress = currentIndex < 0 ? 0 : Math.round(((currentIndex + 1) / steps.length) * 100);
  const businessName = data.business.displayName || data.business.legalName || 'your-food-business';
  const slug = businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-food-business';
  const orderUrl = `https://ordora.com/order/${slug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...emptyData, ...JSON.parse(saved) as Partial<OnboardingData> });
    } catch { localStorage.removeItem(STORAGE_KEY); }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      owner: { ...data.owner, password: '' },
    }));
  }, [data, hydrated]);

  useEffect(() => {
    if (routeStep === 'success') QRCode.toDataURL(orderUrl, { width: 240, margin: 1, color: { dark: '#252722', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [routeStep, orderUrl]);

  const setRecord = (record: 'business' | 'owner' | 'operations', name: string, value: string) => {
    setData((previous) => ({ ...previous, [record]: { ...previous[record], [name]: value } }));
  };
  const toggleArray = (key: 'businessTypes' | 'modes' | 'payments', value: string) => {
    setData((previous) => ({ ...previous, [key]: previous[key].includes(value) ? previous[key].filter((item) => item !== value) : [...previous[key], value] }));
  };
  const next = () => {
    setNotice('');
    if (routeStep === 'business-type' && !data.businessTypes.length) return setNotice('Choose at least one business type to continue.');
    if (routeStep === 'business-details' && !data.business.displayName) return setNotice('Add your business or brand name to continue.');
    if (routeStep === 'owner-details' && (!data.owner.fullName || !data.owner.email || !data.owner.phone || !data.owner.password)) return setNotice('Complete the required owner account fields to continue.');
    if (routeStep === 'owner-details' && data.owner.password.length < 8) return setNotice('Use a password with at least 8 characters.');
    if (routeStep === 'owner-details' && data.owner.ownership !== 'yes') return setNotice('Confirm that you own the business or are authorised to register it.');
    if (routeStep === 'outlets' && !data.outlets.length) return setNotice('Add at least one outlet to continue.');
    const target = steps[Math.min(currentIndex + 1, steps.length - 1)];
    if (target) window.location.href = `/onboarding/${target.id}`;
  };
  const back = () => window.location.href = currentIndex <= 0 ? '/onboarding' : `/onboarding/${steps[currentIndex - 1].id}`;
  const addOutlet = () => {
    if (!outletDraft.name.trim()) return setNotice('Give your outlet a name first.');
    setData((previous) => ({ ...previous, outlets: [...previous.outlets, outletDraft] }));
    setOutletDraft({ name: '', type: 'Main outlet', address: '', contact: '', services: [] }); setNotice('');
  };
  const addProduct = () => {
    if (!productDraft.name.trim() || !productDraft.price.trim()) return setNotice('Add a product name and price.');
    setData((previous) => ({ ...previous, products: [...previous.products, productDraft] }));
    setProductDraft({ name: '', category: '', price: '', foodType: 'Vegetarian', availability: 'Available', combo: false }); setNotice('');
  };
  const importMenu = async (file?: File) => {
    if (!file) return;
    const rows = (await file.text()).split(/\r?\n/).slice(1).filter(Boolean);
    const imported = rows.map((row) => row.split(',').map((cell) => cell.trim())).filter((row) => row[0]).map((row) => ({ name: row[0], category: row[1] || '', price: row[2] || '' }));
    setData((previous) => ({ ...previous, products: [...previous.products, ...imported] }));
    setNotice(`${imported.length} menu item${imported.length === 1 ? '' : 's'} imported.`);
  };

  const completed = useMemo(() => [
    ['Business profile', Boolean(data.business.displayName)],
    ['First outlet', data.outlets.length > 0],
    ['Menu items', data.products.length > 0],
    ['Payment options', data.payments.length > 0],
    ['Ordering mode', data.modes.length > 0],
    ['QR menu link', data.outlets.length > 0],
    ['Storefront published', data.launched],
  ] as [string, boolean][], [data]);

  if (!hydrated) return <div className="min-h-screen bg-ordora-ivory" />;

  if (routeStep === 'start') return <main className="min-h-screen bg-[#f7f4ee]">
    <TopBar />
    <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-[1fr_0.85fr] md:px-8">
      <div className="max-w-xl">
        <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-ordora-coral"><span className="h-2 w-2 rounded-full bg-ordora-coral" /> Setup that fits your business</p>
        <h1 className="font-display text-4xl font-black leading-[1.08] text-ordora-charcoal sm:text-6xl">Your food business, <span className="text-ordora-coral">ready to grow.</span></h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-ordora-muted">From your first street cart to a growing restaurant group, get ordering, outlets and daily operations in one place.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/onboarding/business-type" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-ordora-coral px-6 text-sm font-bold text-white transition hover:bg-ordora-coral-hover">Start Selling with ORDORA <ArrowRight size={17} /></Link>
          <Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ordora-border bg-white px-5 text-sm font-semibold text-ordora-charcoal hover:border-ordora-coral">Explore ORDORA</Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-ordora-muted"><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-ordora-success" /> Save as you go</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-ordora-success" /> Start with one outlet</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 size={15} className="text-ordora-success" /> Free trial available</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-md">
        <div className="absolute -right-4 -top-5 h-24 w-24 rounded-full bg-[#eed3a5]" />
        <div className="absolute -bottom-4 -left-5 h-28 w-28 rounded-full bg-[#bfd1c5]" />
        <div className="relative rounded-[26px] border border-white bg-white p-3 shadow-[0_28px_70px_rgba(47,44,35,.12)]">
          <div className="overflow-hidden rounded-[19px] bg-[#262b25] p-5 text-white">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-ordora-coral"><Utensils size={17} /></span> ordora</span><span className="rounded-full bg-white/10 px-3 py-1 text-[10px] text-white/75">TODAY</span></div>
            <div className="mt-8 flex items-end justify-between"><div><p className="text-xs text-white/50">Good morning, Asha</p><p className="mt-1 text-2xl font-bold">Your shop is<br />almost ready.</p></div><div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#e6a14e] text-[#342a20]"><Store size={26} /></div></div>
            <div className="mt-7 rounded-2xl bg-white p-4 text-ordora-charcoal"><div className="flex items-center justify-between text-xs font-bold"><span>Store setup</span><span className="text-ordora-coral">3 of 7</span></div><div className="mt-3 h-2 rounded-full bg-[#eeeae2]"><div className="h-full w-[43%] rounded-full bg-ordora-coral" /></div><div className="mt-4 space-y-3 text-xs"><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-ordora-success" /> Your business profile</span><span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-ordora-success" /> First outlet added</span><span className="flex items-center gap-2 text-ordora-muted"><span className="h-[15px] w-[15px] rounded-full border border-ordora-border" /> Add your first menu item</span></div></div>
            <p className="mt-4 text-center text-[10px] text-white/45">A calmer way to run your food business</p>
          </div>
        </div>
      </div>
    </div>
    <OnboardingGuide step="start" businessTypes={data.businessTypes} />
  </main>;

  if (routeStep === 'success') return <main className="min-h-screen bg-[#f7f4ee]"><TopBar /><div className="mx-auto max-w-5xl px-4 py-8 sm:px-7">
    <div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-ordora-coral">Your workspace</p><h1 className="mt-1 font-display text-3xl font-black text-ordora-charcoal">{data.launched ? 'You’re open for business.' : 'Your store is taking shape.'}</h1></div><button onClick={() => { localStorage.removeItem(STORAGE_KEY); setData(emptyData); window.location.href = '/onboarding'; }} className="rounded-lg p-2 text-ordora-muted hover:bg-white" title="Start a new setup"><X size={19} /></button></div>
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-2xl border border-ordora-border bg-white p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-ordora-muted">BUSINESS</p><h2 className="mt-1 text-xl font-bold">{businessName}</h2><p className="mt-1 text-sm text-ordora-muted">{data.businessTypes.join(' · ') || 'Food business'} · {data.outlets.length} outlet{data.outlets.length === 1 ? '' : 's'}</p></div><span className="rounded-full bg-[#eaf5ee] px-3 py-1.5 text-xs font-bold text-ordora-success">{data.plan}</span></div>
      <div className="mt-7 flex items-end justify-between"><span className="text-sm font-bold">Setup checklist</span><span className="text-xs font-semibold text-ordora-coral">{completed.filter(([, done]) => done).length} / {completed.length} complete</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eeeae2]"><div className="h-full rounded-full bg-ordora-coral transition-all" style={{ width: `${Math.round(completed.filter(([, done]) => done).length / completed.length * 100)}%` }} /></div>
      <div className="mt-4 divide-y divide-ordora-border">{completed.map(([label, done]) => <div key={label} className="flex items-center gap-3 py-3"><span className={`grid h-6 w-6 place-items-center rounded-full ${done ? 'bg-[#eaf5ee] text-ordora-success' : 'border border-ordora-border text-transparent'}`}>{done && <Check size={14} />}</span><span className={`flex-1 text-sm ${done ? 'text-ordora-charcoal' : 'text-ordora-muted'}`}>{label}</span>{!done && label !== 'Storefront published' && <Link href={`/onboarding/${label === 'Business profile' ? 'business-details' : label === 'First outlet' ? 'outlets' : label === 'Menu items' ? 'menu' : label === 'Payment options' ? 'payments' : 'operations'}`} className="text-xs font-bold text-ordora-coral">Set up</Link>}</div>)}</div>
      <button onClick={() => setData((previous) => ({ ...previous, launched: true }))} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ordora-coral px-5 text-sm font-bold text-white hover:bg-ordora-coral-hover"><Store size={17} /> {data.launched ? 'Storefront is live' : 'Launch My Store'} <ArrowRight size={16} /></button>
      {data.launched && <div className="mt-4 rounded-xl bg-[#f7f4ee] p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-ordora-muted">Your public ordering link</p><a className="mt-1 block break-all text-sm font-semibold text-ordora-coral" href={orderUrl}>{orderUrl.replace('https://', '')}</a></div>}</section>
      <aside className="space-y-5"><section className="rounded-2xl border border-ordora-border bg-white p-5"><div className="flex items-center gap-2"><QrCode size={18} className="text-ordora-coral" /><h3 className="font-bold">Your ordering QR</h3></div><p className="mt-1 text-xs leading-5 text-ordora-muted">Share your menu link or place this QR at your counter.</p>{qr && <img src={qr} alt="QR code for your public ordering page" className="mx-auto my-4 h-40 w-40" />}<a href={qr} download={`${slug}-menu-qr.png`} className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-ordora-border text-sm font-semibold hover:border-ordora-coral ${qr ? '' : 'pointer-events-none opacity-50'}`}><Download size={15} /> Download QR code</a><a href={orderUrl} className="mt-3 block truncate text-center text-xs text-ordora-coral">Open ordering page <ArrowRight size={12} className="inline" /></a></section>
      <section className="rounded-2xl border border-[#e7d8bd] bg-[#f4ead8] p-5"><div className="flex items-start gap-3"><CircleHelp size={18} className="mt-0.5 shrink-0 text-[#9c7041]" /><div><h3 className="text-sm font-bold">A real person can help</h3><p className="mt-1 text-xs leading-5 text-[#6f614e]">Need help setting up your menu or outlet? Our onboarding team can guide you through the next steps.</p><a href="mailto:hello@ordora.com" className="mt-3 inline-block text-xs font-bold text-[#8e5c27]">Contact ORDORA support <ArrowRight size={12} className="inline" /></a></div></div></section></aside>
    </div></div><OnboardingGuide step="success" businessTypes={data.businessTypes} /></main>;

  const selectedTypes = data.businessTypes;
  const recommended = Array.from(new Set(selectedTypes.flatMap((type) => type === 'Restaurant' ? ['Table QR', 'POS', 'Kitchen display', 'Inventory'] : type === 'Cafe' ? ['Counter ordering', 'Beverage customisations', 'Table QR'] : type === 'Food Cart' || type === 'Food Truck' ? ['Quick menu', 'Mobile POS', 'Daily availability', 'Location updates'] : type === 'Cloud Kitchen' ? ['Delivery orders', 'Multi-brand menus', 'Central kitchen'] : type === 'Franchise' ? ['Central menu', 'Multi-outlet reports', 'Staff permissions'] : ['Counter ordering', 'Takeaway', 'QR ordering'])));

  return <main className="min-h-screen bg-[#f7f4ee]">
    <TopBar />
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-7 lg:grid-cols-[220px_1fr] lg:gap-12 lg:py-10">
      <aside className="hidden lg:block"><div className="sticky top-8"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-ordora-muted">SET UP YOUR BUSINESS</p><div className="mt-5 space-y-1">{steps.map((item, itemIndex) => <div key={item.id} className={`flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-xs ${itemIndex === currentIndex ? 'bg-white font-bold text-ordora-charcoal shadow-sm' : itemIndex < currentIndex ? 'text-ordora-success' : 'text-ordora-muted'}`}><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${itemIndex < currentIndex ? 'bg-[#eaf5ee]' : itemIndex === currentIndex ? 'bg-ordora-coral text-white' : 'bg-[#ebe8e1]'}`}>{itemIndex < currentIndex ? <Check size={13} /> : itemIndex + 1}</span>{item.label}</div>)}</div><div className="mt-7 rounded-xl border border-ordora-border bg-white p-3.5"><div className="flex items-center gap-2 text-xs font-bold"><Save size={14} className="text-ordora-coral" /> Progress saved</div><p className="mt-1.5 text-[11px] leading-5 text-ordora-muted">Your details stay on this device. Come back any time to finish.</p></div></div></aside>
      <section className="min-w-0">
        <div className="mb-6 lg:hidden"><div className="flex items-center justify-between text-xs"><span className="font-bold text-ordora-charcoal">Step {currentIndex + 1} of {steps.length}</span><span className="text-ordora-muted">{current?.label}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e6e1d7]"><div className="h-full bg-ordora-coral" style={{ width: `${progress}%` }} /></div></div>
        <div className="mx-auto max-w-3xl">
          <button onClick={back} className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-ordora-muted hover:text-ordora-charcoal"><ArrowLeft size={14} /> Back</button>
          {routeStep === 'business-type' && <><StepTitle eyebrow="FIRST, THE BASICS" title="What type of food business do you operate?" description="Choose every format that fits. We’ll tailor your setup and tools around the way you work." /><div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">{businessOptions.map(({ name, icon: Icon, color, note }) => { const selected = data.businessTypes.includes(name); return <button key={name} onClick={() => toggleArray('businessTypes', name)} className={`relative flex min-h-[105px] items-start gap-3 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${selected ? 'border-ordora-coral bg-[#fff9f6] ring-1 ring-ordora-coral' : 'border-ordora-border bg-white hover:border-[#d7c8b7]'}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${color}`}><Icon size={20} /></span><span className="min-w-0 pt-0.5"><span className="block text-sm font-bold text-ordora-charcoal">{name}</span><span className="mt-1 block text-[11px] leading-4 text-ordora-muted">{note}</span></span><span className={`absolute right-3 top-3 grid h-[18px] w-[18px] place-items-center rounded-full border ${selected ? 'border-ordora-coral bg-ordora-coral text-white' : 'border-[#d7d2c8] text-transparent'}`}><Check size={12} /></span></button>; })}</div><p className="mt-4 flex items-center gap-1.5 text-xs text-ordora-muted"><CircleHelp size={14} /> You can add brands and locations later.</p><Recommended modules={recommended} /></>}

          {routeStep === 'business-details' && <><StepTitle eyebrow="YOUR BUSINESS" title="Tell us about your business" description="Start with the essentials. You can add documents and extra details whenever you’re ready." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Brand or display name" name="displayName" value={data.business.displayName} onChange={(n,v) => setRecord('business',n,v)} required placeholder="e.g. Urban Bite" /><Field label="Legal business name" name="legalName" value={data.business.legalName} onChange={(n,v) => setRecord('business',n,v)} placeholder="As shown on registration documents" /><Field label="Business email" name="email" value={data.business.email} onChange={(n,v) => setRecord('business',n,v)} type="email" placeholder="hello@yourbusiness.com" /><Field label="Contact number" name="phone" value={data.business.phone} onChange={(n,v) => setRecord('business',n,v)} type="tel" placeholder="+91 98765 43210" /><div className="sm:col-span-2"><Field label="Business description" name="description" value={data.business.description} onChange={(n,v) => setRecord('business',n,v)} placeholder="A few words about what you serve" /></div><Field label="Website (optional)" name="website" value={data.business.website} onChange={(n,v) => setRecord('business',n,v)} placeholder="https://" /><label className="block"><span className={labelClass}>Business logo (optional)</span><input type="file" accept="image/*" className={`${inputClass} file:mr-3 file:rounded-md file:border-0 file:bg-[#f4eee6] file:px-3 file:py-1.5 file:text-xs file:font-semibold`} onChange={(event) => event.target.files?.[0] && setRecord('business','logoName',event.target.files[0].name)} /><span className="mt-1 block text-[11px] text-ordora-muted">Image selected: {data.business.logoName || 'None'}</span></label><div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><Field label="Street address" name="address" value={data.business.address} onChange={(n,v) => setRecord('business',n,v)} placeholder="Building, street, area" /><Field label="City" name="city" value={data.business.city} onChange={(n,v) => setRecord('business',n,v)} placeholder="City" /><Field label="State" name="state" value={data.business.state} onChange={(n,v) => setRecord('business',n,v)} placeholder="State" /><Field label="PIN code" name="pin" value={data.business.pin} onChange={(n,v) => setRecord('business',n,v)} placeholder="PIN code" /><Field label="Country" name="country" value={data.business.country || 'India'} onChange={(n,v) => setRecord('business',n,v)} /><Field label="GSTIN (optional)" name="gstin" value={data.business.gstin} onChange={(n,v) => setRecord('business',n,v)} placeholder="Add if registered" help="Only required for businesses registered for GST." /><Field label="FSSAI licence (optional)" name="fssai" value={data.business.fssai} onChange={(n,v) => setRecord('business',n,v)} placeholder="Add when applicable" help="Food safety details can be added later." /><Field label="Registration details (optional)" name="registration" value={data.business.registration} onChange={(n,v) => setRecord('business',n,v)} placeholder="Company or proprietor details" /></div></div><Notice icon={<ShieldCheck size={17} />} text="Compliance fields are optional during setup. Requirements depend on your business and location." /></>}

          {routeStep === 'owner-details' && <><StepTitle eyebrow="SECURE YOUR ACCOUNT" title="Who’s setting things up?" description="Create the owner account for your business. Your contact details are used for account access and important updates." /><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Owner’s full name" name="fullName" value={data.owner.fullName} onChange={(n,v) => setRecord('owner',n,v)} required placeholder="Your name" /><Field label="Phone number" name="phone" value={data.owner.phone} onChange={(n,v) => setRecord('owner',n,v)} required type="tel" placeholder="+91 98765 43210" /><Field label="Email address" name="email" value={data.owner.email} onChange={(n,v) => setRecord('owner',n,v)} required type="email" placeholder="you@example.com" /><Field label="Create a password" name="password" value={data.owner.password} onChange={(n,v) => setRecord('owner',n,v)} required type="password" placeholder="At least 8 characters" help="Use at least 8 characters." /></div><div className="mt-5 rounded-xl border border-ordora-border bg-white p-4"><p className="text-sm font-bold">Verify your contact details</p><p className="mt-1 text-xs leading-5 text-ordora-muted">Verification codes are not connected in this preview. Your password is never saved in browser storage.</p><div className="mt-3 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f2ec] px-3 py-2 text-xs text-ordora-muted"><BadgeCheck size={14} /> Phone verification pending</span><span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f2ec] px-3 py-2 text-xs text-ordora-muted"><BadgeCheck size={14} /> Email verification pending</span></div></div><label className="mt-4 flex items-start gap-2.5 rounded-xl border border-ordora-border bg-white p-4 text-xs leading-5 text-ordora-muted"><input type="checkbox" checked={data.owner.ownership === 'yes'} onChange={(event) => setRecord('owner','ownership',event.target.checked ? 'yes' : '')} className="mt-0.5 accent-[#d95c42]" /><span>I confirm that I’m the business owner or am authorised to create this account on behalf of the business.</span></label></>}

          {routeStep === 'outlets' && <><StepTitle eyebrow="YOUR LOCATIONS" title="Where do you serve customers?" description="Add one outlet to get started. Every outlet can have its own hours, menu availability and order settings." /><div className="mt-6 space-y-3">{data.outlets.map((outlet, outletIndex) => <div key={`${outlet.name}-${outletIndex}`} className="flex items-start gap-3 rounded-xl border border-ordora-border bg-white p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#e9efe9] text-[#587360]"><MapPin size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold">{outlet.name}</p><p className="text-xs text-ordora-muted">{outlet.type}{outlet.address && ` · ${outlet.address}`}</p></div><button onClick={() => setData((previous) => ({ ...previous, outlets: previous.outlets.filter((_, i) => i !== outletIndex) }))} title="Remove outlet" className="rounded p-1 text-ordora-muted hover:text-ordora-error"><X size={16} /></button></div>)}</div><div className="mt-4 rounded-xl border border-dashed border-[#d6cdbd] bg-white/70 p-4 sm:p-5"><h3 className="text-sm font-bold">Add an outlet</h3><div className="mt-4 grid gap-3 sm:grid-cols-2"><Field label="Outlet name" name="name" value={outletDraft.name} onChange={(n,v) => setOutletDraft((previous) => ({...previous,[n]:v}))} placeholder="e.g. Park Street" /><label><span className={labelClass}>Outlet type</span><select className={inputClass} value={outletDraft.type} onChange={(event) => setOutletDraft((previous) => ({...previous,type:event.target.value}))}><option>Main outlet</option><option>Restaurant</option><option>Food cart</option><option>Food truck</option><option>Cloud kitchen</option><option>Food court counter</option><option>Kiosk</option></select></label><Field label="Address or service area" name="address" value={outletDraft.address} onChange={(n,v) => setOutletDraft((previous) => ({...previous,[n]:v}))} placeholder="Street, neighbourhood, city" /><Field label="Outlet contact (optional)" name="contact" value={outletDraft.contact} onChange={(n,v) => setOutletDraft((previous) => ({...previous,[n]:v}))} placeholder="Phone number" /></div><button onClick={addOutlet} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#f4eee6] px-4 text-xs font-bold text-ordora-charcoal hover:bg-[#eee4d7]"><Plus size={15} /> Add this outlet</button></div><Notice icon={<CircleHelp size={17} />} text="Opening hours, service modes and manager details can be set for each outlet after registration." /></>}

          {routeStep === 'operations' && <><StepTitle eyebrow="DAILY OPERATIONS" title="How do customers order from you?" description="Pick the ways you serve today. You can change these separately for each outlet later." /><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{['Dine-in', 'Takeaway', 'Pickup', 'Delivery', 'Counter orders', 'Table QR orders', 'Scheduled orders', 'Self-service kiosk'].map((mode) => {const active=data.modes.includes(mode);return <button key={mode} onClick={() => toggleArray('modes',mode)} className={`flex min-h-[70px] items-center gap-2.5 rounded-xl border p-3 text-left text-xs font-semibold ${active ? 'border-ordora-coral bg-[#fff9f6] text-ordora-charcoal' : 'border-ordora-border bg-white text-ordora-muted hover:border-[#d7c8b7]'}`}><span className={`grid h-5 w-5 shrink-0 place-items-center rounded border ${active ? 'border-ordora-coral bg-ordora-coral text-white' : 'border-[#d7d2c8]'}`}>{active && <Check size={13} />}</span>{mode}</button>;})}</div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Average preparation time" name="prepTime" value={data.operations.prepTime} onChange={(n,v) => setRecord('operations',n,v)} placeholder="e.g. 20 minutes" /><Field label="Minimum order value (optional)" name="minimumOrder" value={data.operations.minimumOrder} onChange={(n,v) => setRecord('operations',n,v)} placeholder="₹ 0" /><label><span className={labelClass}>Order acceptance</span><select className={inputClass} value={data.operations.acceptance || 'Accept orders manually'} onChange={(event) => setRecord('operations','acceptance',event.target.value)}><option>Accept orders manually</option><option>Automatically accept orders</option></select></label><label><span className={labelClass}>Tax setup</span><select className={inputClass} value={data.operations.tax || 'Set this up later'} onChange={(event) => setRecord('operations','tax',event.target.value)}><option>Set this up later</option><option>Prices include tax</option><option>Add tax at checkout</option></select></label><Field label="Service charge (optional)" name="serviceCharge" value={data.operations.serviceCharge} onChange={(n,v) => setRecord('operations',n,v)} placeholder="₹ or %" /><Field label="Pickup time slots (optional)" name="pickupSlots" value={data.operations.pickupSlots} onChange={(n,v) => setRecord('operations',n,v)} placeholder="e.g. Every 15 minutes" /></div>{selectedTypes.some((type) => ['Food Cart','Food Truck'].includes(type)) && <div className="mt-5 rounded-xl border border-[#d8e2d9] bg-[#eef3ed] p-4"><h3 className="text-sm font-bold">Mobile business settings</h3><p className="mt-1 text-xs text-ordora-muted">Set a temporary service area or mark yourself closed whenever you’re on the move.</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Current operating location" name="currentLocation" value={data.operations.currentLocation} onChange={(n,v) => setRecord('operations',n,v)} placeholder="Street, market or landmark" /><Field label="Today’s availability" name="availability" value={data.operations.availability} onChange={(n,v) => setRecord('operations',n,v)} placeholder="e.g. Open until 9 pm" /></div></div>}<div className="mt-5"><p className="text-xs font-bold text-ordora-charcoal">Recommended for your setup</p><Recommended modules={recommended} /></div></>}

          {routeStep === 'menu' && <><StepTitle eyebrow="YOUR FIRST MENU" title="Add a few favourites to get started" description="A small menu is enough to launch. Add more items, modifiers and photos whenever you’re ready." /><div className="mt-5 flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-ordora-muted">Start with a template:</span>{(templates[selectedTypes[0]] || templates.default).map((category) => <button key={category} onClick={() => setProductDraft((previous) => ({...previous,category}))} className="rounded-full border border-ordora-border bg-white px-3 py-1.5 text-[11px] font-semibold text-ordora-charcoal hover:border-ordora-coral">{category}</button>)}</div><div className="mt-5 rounded-xl border border-ordora-border bg-white p-4 sm:p-5"><h3 className="text-sm font-bold">Add a menu item</h3><div className="mt-4 grid gap-3 sm:grid-cols-[1.3fr_1fr_.7fr]"><Field label="Item name" name="name" value={productDraft.name} onChange={(n,v) => setProductDraft((previous) => ({...previous,[n]:v}))} placeholder="e.g. Masala chai" /><Field label="Category" name="category" value={productDraft.category} onChange={(n,v) => setProductDraft((previous) => ({...previous,[n]:v}))} placeholder="e.g. Beverages" /><Field label="Price (₹)" name="price" value={productDraft.price} onChange={(n,v) => setProductDraft((previous) => ({...previous,[n]:v}))} placeholder="120" type="number" /></div><button onClick={addProduct} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-ordora-coral px-4 text-xs font-bold text-white hover:bg-ordora-coral-hover"><Plus size={15} /> Add item</button></div><label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-ordora-border bg-white p-4 hover:border-ordora-coral"><FileSpreadsheet size={19} className="text-ordora-success" /><span className="flex-1"><span className="block text-xs font-bold">Import a menu file</span><span className="mt-0.5 block text-[11px] text-ordora-muted">CSV with columns: name, category, price</span></span><span className="text-xs font-bold text-ordora-coral">Choose file</span><input type="file" accept=".csv,text/csv" className="sr-only" onChange={(event) => void importMenu(event.target.files?.[0])} /></label>{data.products.length > 0 && <div className="mt-5 overflow-hidden rounded-xl border border-ordora-border bg-white"><div className="flex items-center justify-between border-b border-ordora-border px-4 py-3"><span className="text-xs font-bold">Your menu items</span><span className="text-[11px] text-ordora-muted">{data.products.length} added</span></div>{data.products.map((product, productIndex) => <div key={`${product.name}-${productIndex}`} className="flex items-center gap-3 border-b border-ordora-border px-4 py-3 last:border-0"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f5f2ec]"><Utensils size={15} className="text-ordora-muted" /></span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{product.name}</span><span className="block text-[10px] text-ordora-muted">{product.category || 'Uncategorised'}</span></span><span className="text-xs font-bold">₹{product.price}</span><button onClick={() => setData((previous) => ({...previous,products:previous.products.filter((_,i)=>i!==productIndex)}))} title="Remove item" className="p-1 text-ordora-muted hover:text-ordora-error"><X size={14} /></button></div>)}</div>}<button onClick={next} className="mt-4 text-xs font-semibold text-ordora-muted underline decoration-dotted underline-offset-4 hover:text-ordora-coral">Skip menu for now</button></>}

          {routeStep === 'payments' && <><StepTitle eyebrow="GET PAID YOUR WAY" title="Choose how you take payments" description="Select the options you accept today. You can connect a payment provider later from your account." /><div className="mt-6 space-y-3">{[{name:'Cash at counter',desc:'For walk-in and pickup orders',icon:Store},{name:'UPI',desc:'Accept UPI payments at checkout',icon:QrCode},{name:'Card payments',desc:'Credit and debit cards',icon:CreditCard},{name:'Pay on delivery',desc:'Collect payment when the order arrives',icon:Truck}].map(({name,desc,icon:Icon}) => {const active=data.payments.includes(name);return <button key={name} onClick={() => toggleArray('payments',name)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${active?'border-ordora-coral bg-[#fff9f6]':'border-ordora-border bg-white hover:border-[#d7c8b7]'}`}><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3eee6] text-ordora-charcoal"><Icon size={19} /></span><span className="flex-1"><span className="block text-sm font-bold">{name}</span><span className="mt-0.5 block text-xs text-ordora-muted">{desc}</span></span><span className={`grid h-5 w-5 place-items-center rounded-full border ${active?'border-ordora-coral bg-ordora-coral text-white':'border-[#d7d2c8]'}`}>{active&&<Check size={13}/>}</span></button>;})}</div><Notice icon={<ShieldCheck size={17}/>} text="No bank or card details are collected in this setup preview. Payment provider connection happens securely in your account." /></>}

          {routeStep === 'subscription' && <><StepTitle eyebrow="START AT YOUR PACE" title="Pick a plan that feels right" description="Start small. You can change your plan as your business and team grow." /><div className="mt-6 grid gap-3 md:grid-cols-3">{[{name:'Free trial',price:'14 days free',desc:'Try the essentials, no card required',features:['Online menu & QR ordering','One outlet','Basic order management']},{name:'Growth',price:'Monthly',desc:'For busy, growing food businesses',features:['POS & kitchen display','Inventory tools','Sales reports']},{name:'Scale',price:'Annual',desc:'For groups and multi-outlet teams',features:['Multiple outlets & brands','Central menu controls','Advanced permissions']}].map((plan) => {const active=data.plan===plan.name;return <button key={plan.name} onClick={() => setData((previous)=>({...previous,plan:plan.name}))} className={`rounded-xl border p-4 text-left transition ${active?'border-ordora-coral bg-[#fff9f6] ring-1 ring-ordora-coral':'border-ordora-border bg-white hover:border-[#d7c8b7]'}`}><span className="flex items-center justify-between"><span className="text-sm font-bold">{plan.name}</span><span className={`grid h-4 w-4 place-items-center rounded-full border ${active?'border-ordora-coral bg-ordora-coral':'border-[#d7d2c8]'}`}>{active&&<span className="h-1.5 w-1.5 rounded-full bg-white"/>}</span></span><span className="mt-3 block text-lg font-black text-ordora-coral">{plan.price}</span><span className="mt-1 block min-h-8 text-[11px] leading-4 text-ordora-muted">{plan.desc}</span><span className="mt-4 block space-y-2 border-t border-ordora-border pt-3">{plan.features.map((feature)=><span key={feature} className="flex items-center gap-1.5 text-[11px] text-ordora-charcoal"><Check size={13} className="text-ordora-success"/>{feature}</span>)}</span></button>;})}</div><Notice icon={<CircleHelp size={17}/>} text="Plans shown here are examples for the onboarding preview. Billing and plan entitlements are not connected." /></>}

          {routeStep === 'review' && <><StepTitle eyebrow="ONE LAST LOOK" title="Does everything look right?" description="Your progress is saved on this device. You can go back to change anything before opening your setup dashboard." /><div className="mt-6 divide-y divide-ordora-border overflow-hidden rounded-xl border border-ordora-border bg-white">{[{title:'Business',body:[data.business.displayName,data.businessTypes.join(', ')].filter(Boolean).join(' · ')||'Not added yet',href:'business-details'},{title:'Owner',body:[data.owner.fullName,data.owner.email].filter(Boolean).join(' · ')||'Not added yet',href:'owner-details'},{title:'Outlets',body:data.outlets.map((outlet)=>outlet.name).join(', ')||'Not added yet',href:'outlets'},{title:'Ordering',body:data.modes.join(', ')||'Choose later',href:'operations'},{title:'Menu',body:`${data.products.length} item${data.products.length===1?'':'s'}${data.products.length?`: ${data.products.slice(0,3).map((item)=>item.name).join(', ')}`:''}`,href:'menu'},{title:'Payments',body:data.payments.join(', ')||'Choose later',href:'payments'},{title:'Plan',body:data.plan,href:'subscription'}].map((item)=><div key={item.title} className="flex items-center gap-3 px-4 py-3.5"><span className="w-20 shrink-0 text-xs font-bold">{item.title}</span><span className="min-w-0 flex-1 truncate text-xs text-ordora-muted">{item.body}</span><Link href={`/onboarding/${item.href}`} className="text-xs font-bold text-ordora-coral">Edit</Link></div>)}</div><div className="mt-4 rounded-xl border border-[#e7d8bd] bg-[#f4ead8] p-4 text-xs leading-5 text-[#6f614e]">This creates a local onboarding preview only. Account security, document verification, subscriptions and live ordering require the ORDORA services to be connected.</div></>}

          {routeStep === 'outlets' && <OutletAdvancedFields outlet={outletDraft} setOutlet={setOutletDraft} addOutlet={addOutlet} setNotice={setNotice} />}
          {routeStep === 'menu' && <ProductAdvancedFields product={productDraft} setProduct={setProductDraft} addProduct={addProduct} />}
          {notice && <p role="alert" className="mt-4 rounded-lg bg-[#fcecec] px-3 py-2.5 text-xs font-medium text-ordora-error">{notice}</p>}
          {routeStep !== 'review' && <div className="mt-7 flex flex-col-reverse items-center justify-between gap-3 border-t border-[#e7e1d7] pt-5 sm:flex-row"><button onClick={() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, owner: { ...data.owner, password: '' } })); setNotice('Your progress is saved on this device.'); }} className="inline-flex min-h-10 items-center gap-2 px-2 text-xs font-semibold text-ordora-muted hover:text-ordora-charcoal"><Save size={15}/> Save and finish later</button><button onClick={next} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ordora-coral px-6 text-sm font-bold text-white hover:bg-ordora-coral-hover sm:w-auto">{routeStep==='subscription'?'Review setup':'Continue'} <ArrowRight size={16}/></button></div>}
          {routeStep === 'review' && <div className="mt-7 flex flex-col-reverse items-center justify-between gap-3 border-t border-[#e7e1d7] pt-5 sm:flex-row"><button onClick={back} className="inline-flex min-h-10 items-center gap-2 px-2 text-xs font-semibold text-ordora-muted"><ArrowLeft size={14}/> Back to setup</button><Link href="/onboarding/success" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ordora-coral px-6 text-sm font-bold text-white hover:bg-ordora-coral-hover sm:w-auto">Complete setup <CheckCircle2 size={16}/></Link></div>}
          <p className="mt-5 text-center text-[11px] text-ordora-muted">Need a hand? <a href="mailto:hello@ordora.com" className="font-semibold text-ordora-coral">Talk to our setup team</a></p>
        </div>
      </section>
    </div>
    <OnboardingGuide step={routeStep} businessTypes={data.businessTypes} />
  </main>;
}

function TopBar() { return <header className="border-b border-ordora-border bg-[#faf8f3]"><div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-7"><Link href="/" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ordora-coral text-white"><Utensils size={19}/></span><span className="font-display text-lg font-black tracking-wide">ORDORA</span></Link><div className="flex items-center gap-3"><a href="mailto:hello@ordora.com" className="hidden items-center gap-1.5 text-xs font-semibold text-ordora-muted hover:text-ordora-coral sm:flex"><CircleHelp size={15}/> Need help?</a><Link href="/login" className="rounded-lg border border-ordora-border bg-white px-3 py-2 text-xs font-semibold text-ordora-charcoal hover:border-ordora-coral">Log in</Link></div></div></header>; }
function StepTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-ordora-coral">{eyebrow}</p><h1 className="mt-2 max-w-2xl font-display text-3xl font-black leading-tight text-ordora-charcoal sm:text-[38px]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-ordora-muted">{description}</p></div>; }
function Recommended({ modules }: { modules: string[] }) { return <div className="mt-5 rounded-xl border border-[#d8e2d9] bg-[#eef3ed] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#435849]"><BadgeCheck size={16}/> We’ll set up the right tools for you</div><div className="mt-3 flex flex-wrap gap-2">{modules.map((module)=><span key={module} className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-[#52675a]">{module}</span>)}</div></div>; }
function Notice({ icon, text }: { icon: React.ReactNode; text: string }) { return <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#e7d8bd] bg-[#f4ead8] p-3.5 text-xs leading-5 text-[#6f614e]">{icon}<span>{text}</span></div>; }

function OutletAdvancedFields({ outlet, setOutlet, addOutlet, setNotice }: {
  outlet: Outlet; setOutlet: React.Dispatch<React.SetStateAction<Outlet>>;
  addOutlet: () => void; setNotice: (message: string) => void;
}) {
  const setField = (name: string, value: string) => setOutlet((previous) => ({ ...previous, [name]: value }));
  return <details className="mt-3 rounded-xl border border-ordora-border bg-white p-4">
    <summary className="cursor-pointer text-xs font-bold">Hours, service options & location</summary>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Field label="Opens at" name="openTime" type="time" value={outlet.openTime || ''} onChange={setField} />
      <Field label="Closes at" name="closeTime" type="time" value={outlet.closeTime || ''} onChange={setField} />
      <Field label="Closing days (optional)" name="closedDays" value={outlet.closedDays || ''} onChange={setField} placeholder="e.g. Sunday" />
      <Field label="Outlet manager (optional)" name="manager" value={outlet.manager || ''} onChange={setField} placeholder="Manager name" />
      <Field label="Latitude (optional)" name="latitude" value={outlet.latitude || ''} onChange={setField} placeholder="GPS latitude" />
      <Field label="Longitude (optional)" name="longitude" value={outlet.longitude || ''} onChange={setField} placeholder="GPS longitude" />
    </div>
    <button type="button" onClick={() => {
      if (!navigator.geolocation) return setNotice('Location access is not available in this browser.');
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setOutlet((previous) => ({ ...previous, latitude: String(coords.latitude), longitude: String(coords.longitude) }));
        setNotice('');
      }, () => setNotice('Location permission was not granted. You can enter coordinates instead.'));
    }} className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#f5f2ec] px-3 text-xs font-semibold hover:bg-[#eee8dd]"><MapPin size={14} /> Use current location</button>
    <p className="mb-2 mt-4 text-[11px] font-semibold text-ordora-muted">Services available at this outlet</p>
    <div className="flex flex-wrap gap-2">{['Dine-in', 'Pickup', 'Takeaway', 'Delivery'].map((service) => {
      const active = outlet.services?.includes(service) || false;
      return <button type="button" key={service} onClick={() => setOutlet((previous) => ({ ...previous, services: active ? previous.services?.filter((item) => item !== service) : [...(previous.services || []), service] }))} className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${active ? 'border-ordora-coral bg-[#fff9f6] text-ordora-coral' : 'border-ordora-border text-ordora-muted'}`}>{active && <Check size={12} className="mr-1 inline" />}{service}</button>;
    })}</div>
    <button type="button" onClick={addOutlet} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-ordora-coral px-4 text-xs font-bold text-white hover:bg-ordora-coral-hover"><Plus size={15} /> Add outlet with these settings</button>
  </details>;
}

function ProductAdvancedFields({ product, setProduct, addProduct }: {
  product: Product; setProduct: React.Dispatch<React.SetStateAction<Product>>; addProduct: () => void;
}) {
  const setField = (name: string, value: string) => setProduct((previous) => ({ ...previous, [name]: value }));
  return <details className="mt-3 rounded-xl border border-ordora-border bg-white p-4">
    <summary className="cursor-pointer text-xs font-bold">Description, variants & availability</summary>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="block sm:col-span-2"><span className={labelClass}>Description</span><textarea className={`${inputClass} min-h-20 resize-y`} value={product.description || ''} onChange={(event) => setField('description', event.target.value)} placeholder="Ingredients, portion size or a short description" /></label>
      <label><span className={labelClass}>Food type</span><select className={inputClass} value={product.foodType || 'Vegetarian'} onChange={(event) => setField('foodType', event.target.value)}><option>Vegetarian</option><option>Non-vegetarian</option><option>Vegan</option><option>Egg</option></select></label>
      <Field label="Variants or customisations" name="variants" value={product.variants || ''} onChange={setField} placeholder="e.g. Small, Regular, Large" />
      <label><span className={labelClass}>Availability</span><select className={inputClass} value={product.availability || 'Available'} onChange={(event) => setField('availability', event.target.value)}><option>Available</option><option>Limited stock</option><option>Pre-order</option><option>Unavailable</option></select></label>
      <label className="block"><span className={labelClass}>Product photo (optional)</span><input type="file" accept="image/*" className={`${inputClass} file:mr-2 file:rounded-md file:border-0 file:bg-[#f4eee6] file:px-2 file:py-1 file:text-[11px]`} onChange={(event) => event.target.files?.[0] && setField('photoName', event.target.files[0].name)} /><span className="mt-1 block truncate text-[10px] text-ordora-muted">{product.photoName || 'No photo selected'}</span></label>
    </div>
    <label className="mt-3 flex items-center gap-2 text-xs text-ordora-charcoal"><input type="checkbox" checked={product.combo || false} onChange={(event) => setProduct((previous) => ({ ...previous, combo: event.target.checked }))} className="accent-[#d95c42]" /> Include this item in a combo</label>
    <button type="button" onClick={addProduct} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-ordora-coral px-4 text-xs font-bold text-white hover:bg-ordora-coral-hover"><Plus size={15} /> Add item with these details</button>
  </details>;
}