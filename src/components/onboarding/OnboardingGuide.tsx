'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, LifeBuoy, Send, Sparkles, X } from 'lucide-react';

type GuideMessage = { role: 'user' | 'assistant'; content: string };

const starterPrompts = ['Walk me through this step', 'What can I skip?', 'What happens next?'];

export function OnboardingGuide({ step, businessTypes }: { step: string; businessTypes: string[] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'ai' | 'guide'>('guide');
  const [messages, setMessages] = useState<GuideMessage[]>([
    { role: 'assistant', content: 'Hi, I’m your ORDORA setup guide. I can explain this screen, walk you through each choice, or help you decide what to do next.' },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = endRef.current;
    if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (value: string) => {
    const text = value.trim();
    if (!text || loading) return;
    const conversation = [...messages, { role: 'user' as const, content: text }];
    setMessages(conversation);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('/api/onboarding-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step, businessTypes, messages: conversation.slice(-8) }),
      });
      const result = await response.json() as { reply?: string; source?: 'ai' | 'guide' };
      setMessages((previous) => [...previous, {
        role: 'assistant',
        content: result.reply || 'I couldn’t get an answer just now. You can still continue through the setup, or contact the ORDORA team for help.',
      }]);
      setSource(result.source === 'ai' ? 'ai' : 'guide');
    } catch {
      setMessages((previous) => [...previous, {
        role: 'assistant',
        content: 'I can’t reach the guide service right now. You can continue through setup, or contact the ORDORA team for help.',
      }]);
      setSource('guide');
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return <>
    {open && <section aria-label="ORDORA setup guide" className="fixed bottom-[76px] right-3 z-[70] flex h-[min(560px,calc(100dvh-100px))] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-ordora-border bg-white shadow-[0_20px_65px_rgba(37,39,34,.2)] sm:bottom-20 sm:right-5">
      <header className="flex items-center gap-3 bg-[#292d27] px-4 py-3.5 text-white">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-ordora-coral"><Bot size={19} /></span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-bold">ORDORA Guide</span><span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-white/65"><span className="h-1.5 w-1.5 rounded-full bg-[#a8c99e]" /> Setup help · {source === 'ai' ? 'AI assistant' : 'step-by-step guide'}</span></span>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close guide" className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"><X size={17} /></button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf8f3] p-3.5" aria-live="polite">
        <div className="mb-1 rounded-lg border border-[#e7d8bd] bg-[#f4ead8] px-3 py-2 text-[10px] leading-4 text-[#6f614e]">For your privacy, don’t share passwords, verification codes, or payment details here.</div>
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <p className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3 py-2.5 text-xs leading-[1.55] ${message.role === 'user' ? 'rounded-br-md bg-ordora-coral text-white' : 'rounded-bl-md border border-ordora-border bg-white text-ordora-charcoal'}`}>{message.content}</p>
        </div>)}
        {loading && <div className="flex items-center gap-2 text-[11px] text-ordora-muted"><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-ordora-coral" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-ordora-coral [animation-delay:120ms]" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-ordora-coral [animation-delay:240ms]" /></span>Putting together a helpful answer</div>}
        <div ref={endRef} />
      </div>

      {messages.length < 3 && <div className="flex flex-wrap gap-1.5 border-t border-ordora-border bg-white px-3 py-2.5">{starterPrompts.map((prompt) => <button type="button" key={prompt} onClick={() => void sendMessage(prompt)} disabled={loading} className="rounded-full border border-ordora-border px-2.5 py-1.5 text-[10px] font-semibold text-ordora-charcoal hover:border-ordora-coral hover:text-ordora-coral disabled:opacity-50">{prompt}</button>)}</div>}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-ordora-border bg-white p-3">
        <input value={input} onChange={(event) => setInput(event.target.value)} maxLength={700} placeholder="Ask about this step..." aria-label="Ask the ORDORA guide" className="h-10 min-w-0 flex-1 rounded-lg border border-ordora-border px-3 text-xs outline-none placeholder:text-ordora-muted/70 focus:border-ordora-coral" />
        <button type="submit" disabled={!input.trim() || loading} aria-label="Send message" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ordora-coral text-white transition hover:bg-ordora-coral-hover disabled:cursor-not-allowed disabled:opacity-45"><Send size={16} /></button>
      </form>
    </section>}
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close setup guide' : 'Open setup guide'} className="fixed bottom-3 right-3 z-[70] inline-flex h-12 items-center gap-2 rounded-full bg-[#292d27] px-4 text-sm font-bold text-white shadow-[0_8px_24px_rgba(37,39,34,.24)] transition hover:-translate-y-0.5 hover:bg-[#3b4038] sm:bottom-5 sm:right-5">
      {open ? <ChevronDown size={17} /> : <span className="relative"><LifeBuoy size={18} /><Sparkles size={10} className="absolute -right-1 -top-1 text-[#f5bb78]" /></span>}
      <span>{open ? 'Close guide' : 'Need a hand?'}</span>
    </button>
  </>;
}