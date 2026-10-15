import { BusinessConnectionBoundary } from '@/components/BusinessConnectionBoundary';
export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-6xl min-w-0 overflow-x-hidden px-3 pb-safe pt-4 sm:px-5 sm:pt-8"><BusinessConnectionBoundary>{children}</BusinessConnectionBoundary></main>;
}
