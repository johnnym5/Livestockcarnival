import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NHESICS: National Halal Economy Strategy Implementation Committee Secretariat',
  description:
    'Positioning Nigeria as a leader in the $7 trillion global Halal economy spanning food, finance, logistics, and digital commerce. Renewed Hope Agenda strategic mandate.',
};

export default function NhesicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
