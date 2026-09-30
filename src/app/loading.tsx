import BrandLoadingContent from '@/components/BrandLoadingContent';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]">
      <BrandLoadingContent />
    </div>
  );
}
