import Link from "next/link";
import { BookOpen } from "lucide-react";
import { SITE } from "@/lib/config";

interface SiteHeaderProps {
  subtitle?: string;
  badge?: React.ReactNode;
  backHref?: string;
}

export function SiteHeader({ subtitle, badge, backHref }: SiteHeaderProps) {
  return (
    <header className="border-b border-stone-300 bg-paper/95 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-10 h-10 rounded border border-stone-300 bg-primary-light shrink-0">
            <BookOpen className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            {backHref ? (
              <Link
                href={backHref}
                className="text-xs text-primary font-medium hover:underline"
              >
                ← トップに戻る
              </Link>
            ) : (
              <p className="text-xs font-medium text-stone-500 tracking-wide">
                {SITE.subtitle}
              </p>
            )}
            <h1 className="text-base md:text-lg font-bold text-stone-900 truncate whitespace-nowrap">
              {subtitle ?? SITE.title}
            </h1>
          </div>
        </div>
        {badge}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-300 bg-paper mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-stone-500">
          独立評価プロトコル v1.1 · 盲検中立
        </p>
        <p className="text-xs text-stone-400 mt-1">{SITE.researcher}</p>
      </div>
    </footer>
  );
}
