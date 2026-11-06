import { NextResponse } from 'next/server';

type GuideStep = 'start' | 'business-type' | 'business-details' | 'owner-details' | 'outlets' | 'operations' | 'menu' | 'payments' | 'subscription' | 'review' | 'success';
type ChatMessage = { role: 'user' | 'assistant'; content: string };
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
const requestLimit = 20;
const requestWindow = 60_000;

function isRateLimited(request: Request) {
  const key = request.headers.get('x-real-ip') || 'anonymous';
  const now = Date.now();
  const current = requestBuckets.get(key);
  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + requestWindow });
    return false;
  }
  if (current.count >= requestLimit) return true;
  current.count += 1;
  return false;
}

const stepHelp: Record<GuideStep, string> = {
  start: 'Start by choosing the formats that describe your business. You can select more than one, and you can add outlets or brands later.',
  'business-type': 'Choose all formats that fit how you sell. If you have several, select your main format and any others you operate. ORDORA uses these choices to recommend relevant tools; you can change them later.',
  'business-details': 'Start with your brand or display name; that is the only required business detail on this screen. GSTIN, FSSAI and registration details are conditional or optional, so you can leave them blank if they do not apply.',
  'owner-details': 'Enter the account owner’s contact details and confirm you are authorised to register this business. In this preview, OTP delivery is not connected. Never share your password or verification codes in this chat.',
  outlets: 'Add at least one outlet to continue. Give it a name, then open the optional hours and location section for operating hours, service modes, manager details, or GPS coordinates. You can add more outlets later.',
  operations: 'Select the ordering methods you currently support. You can leave optional settings such as minimum order value, tax, and pickup slots for later. Mobile businesses can add today’s location and availability.',
  menu: 'Add a category, product name and price, then expand the extra details for description, dietary type, variants, photo and availability. You can import a CSV or skip menu setup and finish it later.',
  payments: 'Select the ways customers can pay. You do not need to enter bank or card details here; secure provider setup would happen later in a connected account.',
  subscription: 'Choose the free trial to start without committing. The plan cards are examples in this preview; billing and plan access are not connected.',
  review: 'Check the summary and use Edit beside any section you want to change. Completing setup opens the local setup dashboard; it does not create a live account in this preview.',
  success: 'Your checklist shows what is ready. Launch My Store reveals the preview ordering link and QR code. A real public storefront needs the ORDORA ordering service to be connected.',
};

function fallbackReply(step: GuideStep, messages: ChatMessage[]) {
  const question = messages.filter((message) => message.role === 'user').at(-1)?.content.toLowerCase() || '';
  if (/walk|guide|show me|how do i|how should/i.test(question)) return stepHelp[step];
  if (/skip|optional|required|must/i.test(question)) {
    if (step === 'business-details') return 'Only your brand or display name is required here. Compliance information such as GSTIN and FSSAI is conditional; website, description and registration details can be skipped.';
    if (step === 'menu') return 'You can skip menu setup now and add it later. If you continue here, only a product name and price are needed to add a basic item.';
    if (step === 'outlets') return 'You need one outlet to continue. Hours, GPS, manager details and service options are optional and can be added later.';
    return stepHelp[step];
  }
  if (/next|after this|later/i.test(question)) return `Next, ${stepHelp[step].split('. ')[0].charAt(0).toLowerCase()}${stepHelp[step].split('. ').slice(1).length ? `, then continue to ${nextStepLabel(step)}.` : ` Continue to ${nextStepLabel(step)} when you’re ready.`}`;
  if (/password|otp|code|payment details|card number/i.test(question)) return 'Please don’t share passwords, OTPs, or payment details in chat. The account verification and payment-provider connections are not enabled in this preview.';
  return stepHelp[step];
}

function nextStepLabel(step: GuideStep) {
  const order: GuideStep[] = ['start', 'business-type', 'business-details', 'owner-details', 'outlets', 'operations', 'menu', 'payments', 'subscription', 'review', 'success'];
  const next = order[Math.min(order.indexOf(step) + 1, order.length - 1)];
  return next.replaceAll('-', ' ');
}

export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 12_000) {
    return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  }
  if (isRateLimited(request)) {
    return NextResponse.json({ error: 'Please wait a moment before asking again.' }, { status: 429 });
  }

  let payload: { step?: string; businessTypes?: unknown; messages?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const validSteps: GuideStep[] = ['start', 'business-type', 'business-details', 'owner-details', 'outlets', 'operations', 'menu', 'payments', 'subscription', 'review', 'success'];
  const step = validSteps.includes(payload.step as GuideStep) ? payload.step as GuideStep : 'start';
  const businessTypes = Array.isArray(payload.businessTypes) ? payload.businessTypes.filter((value): value is string => typeof value === 'string').slice(0, 12) : [];
  const messages = Array.isArray(payload.messages) ? payload.messages.slice(-8).filter((value): value is ChatMessage => {
    if (!value || typeof value !== 'object') return false;
    const item = value as ChatMessage;
    return (item.role === 'assistant' || item.role === 'user') && typeof item.content === 'string';
  }).map((message) => ({ ...message, content: message.content.slice(0, 700) })) : [];
  if (!messages.some((message) => message.role === 'user')) return NextResponse.json({ error: 'Add a question first.' }, { status: 400 });

  const fallback = fallbackReply(step, messages);
  const apiKey = process.env.ORDORA_AI_API_KEY;
  if (!apiKey) return NextResponse.json({ reply: fallback, source: 'guide' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        model: process.env.ORDORA_AI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
        max_tokens: 220,
        messages: [
          { role: 'system', content: `You are ORDORA's friendly onboarding guide for independent food businesses. Help with the current onboarding step only. Be concise, practical, non-technical, and supportive; use plain language and at most 120 words. Never ask for passwords, OTPs, bank details, card numbers, or identity-document numbers. Do not claim to verify, save, publish, or perform actions. This is a browser-only onboarding preview; explain clearly when a feature is not connected. Current step: ${step}. Selected business types: ${businessTypes.join(', ') || 'not selected'}.` },
          ...messages.map((message) => ({ role: message.role, content: message.content })),
        ],
      }),
    });
    if (!response.ok) return NextResponse.json({ reply: fallback, source: 'guide' });
    const result = await response.json();
    const reply = result.choices?.[0]?.message?.content;
    return NextResponse.json({ reply: typeof reply === 'string' && reply.trim() ? reply.slice(0, 1600) : fallback, source: 'ai' });
  } catch {
    return NextResponse.json({ reply: fallback, source: 'guide' });
  }
}