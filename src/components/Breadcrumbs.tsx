import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center justify-center flex-wrap gap-2 text-sm">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="text-white/40 hover:text-[#38B685] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white/70">{item.label}</span>
          )}
          {i < items.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-white/20" />
          )}
        </span>
      ))}
    </nav>
  );
}
