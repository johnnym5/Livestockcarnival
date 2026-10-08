import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using the Renewed Hope National Livestock Carnival website.',
};

const sections = [
  { title: 'Using this website', text: 'You may use this website for lawful personal, editorial, educational, and business information related to the carnival. Do not interfere with the website, attempt unauthorized access, submit malicious material, misuse another person’s information, or use browser notifications to harass or mislead others.' },
  { title: 'Information and event details', text: 'We aim to keep programme, venue, and event information accurate, but details may change. Check the latest published information before travelling or making arrangements. Nothing on this website guarantees admission, accreditation, vendor space, sponsorship, or a commercial outcome.' },
  { title: 'Payments, renewals, and cancellation', text: 'This website does not offer paid subscriptions or auto-renewing plans. Pass registration and vendor bookings are handled on separate portals. Review the terms, price, renewal, cancellation, and refund conditions shown by the relevant portal before completing a transaction; those services are responsible for their own purchase and cancellation terms.' },
  { title: 'Applications and notifications', text: 'Accreditation applications must contain accurate information and documents you are authorized to provide. Browser notifications are optional and can be disabled at any time in this website or your browser settings. Authorized staff may send event announcements to all subscribed browsers.' },
  { title: 'Content and intellectual property', text: 'Website text, branding, photographs, and other materials are owned by or used with permission of the carnival organizers or their respective rights holders. You may link to public pages. Do not reproduce or commercially exploit protected material without permission, except where applicable law allows.' },
  { title: 'External services', text: 'Links to pass registration, vendor services, social networks, maps, and other third-party websites are provided for convenience. Those services operate under their own terms and privacy notices; the carnival website does not control their content or data handling.' },
  { title: 'Availability and responsibility', text: 'The website is provided for general information and may be interrupted, changed, or unavailable. To the extent permitted by law, the organizers disclaim warranties for uninterrupted service and are not responsible for losses caused by reliance on outdated website information, third-party services, or events beyond their reasonable control. These terms do not limit rights that cannot lawfully be limited.' },
  { title: 'Changes and contact', text: 'These terms may be updated by publishing a revised version here. Questions about these terms may be sent to info@livestockcarnival.ng or 09014740776.' },
];

export default function TermsPage() {
  return <main className="min-h-screen bg-[#FBFBFA] px-5 pb-20 pt-28 text-[#17251D] sm:px-8"><article className="mx-auto max-w-4xl"><p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#8D6B1B]">Legal information · Last updated 8 October 2026</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Website Terms of Use</h1><p className="mt-4 max-w-3xl text-sm leading-6 text-[#59635D]">These terms apply to use of the Renewed Hope National Livestock Carnival 2026 website. They do not replace admission, accreditation, exhibitor, vendor, or sponsorship terms issued by the relevant service.</p><div className="mt-10 divide-y divide-[#E4E9E3] rounded-2xl border border-[#E1E7E0] bg-white px-5 sm:px-8">{sections.map((section) => <section key={section.title} className="py-6"><h2 className="text-lg font-extrabold">{section.title}</h2><p className="mt-2 text-sm leading-7 text-[#4B5563]">{section.text}</p></section>)}</div><p className="mt-8 text-xs text-[#68746C]"><Link href="/privacy" className="font-semibold text-[#1E4D38] underline">Read the Privacy Policy</Link> for information about personal data and browser notifications.</p></article></main>;
}
