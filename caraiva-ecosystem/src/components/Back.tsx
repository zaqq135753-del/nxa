import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function Back({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="mb-6">
      <Link href="/turista" className="inline-flex items-center gap-1 text-xs text-areia-300 hover:text-areia-50"><ChevronLeft size={14} /> Início</Link>
      <h1 className="mt-2 font-display text-4xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-areia-300">{sub}</p>}
    </header>
  );
}
