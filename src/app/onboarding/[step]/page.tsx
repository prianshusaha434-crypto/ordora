import { notFound } from 'next/navigation';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

const validSteps = new Set([
  'business-type', 'business-details', 'owner-details', 'outlets', 'operations',
  'menu', 'payments', 'subscription', 'review', 'success',
]);

export default function OnboardingStepPage({ params }: { params: { step: string } }) {
  if (!validSteps.has(params.step)) notFound();
  return <OnboardingFlow step={params.step} />;
}