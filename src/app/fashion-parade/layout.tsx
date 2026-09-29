import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'National Livestock Carnival: Livestock Cultural Fashion Parade 2026',
  description:
    'Where Agriculture Meets Fashion. Official portal for the National Livestock Carnival at Abuja National Grounds, November 21–23, 2026. Backed by the Federal Government of Nigeria (Office of the Vice President) in collaboration with Golden Camel and Cow (GCC).',
};

export default function FashionParadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
