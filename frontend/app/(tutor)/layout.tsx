import { Prefetcher } from '@/components/shared/Prefetcher';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Prefetcher />
      {children}
    </>
  );
}

