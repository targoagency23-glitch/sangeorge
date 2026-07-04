import React from "react";
import { BrandItem } from "../types";

interface BrandMarqueeProps {
  brands: BrandItem[];
  lang?: "en" | "ar";
}

export const BrandMarquee: React.FC<BrandMarqueeProps> = ({ brands, lang = "ar" }) => {
  // If no brands are defined, render a clean alert
  if (!brands || brands.length === 0) return null;

  // Convert any string representation gracefully to BrandItem
  const normalizedBrands = brands.map((b: any, idx) => {
    if (typeof b === "string") {
      return { id: `brand-fallback-${idx}`, name: b, logoUrl: "" };
    }
    return b;
  });

  // Duplicate brand list to ensure seamless marquee wrapping loop
  const duplicatedBrands = [...normalizedBrands, ...normalizedBrands, ...normalizedBrands];

  return (
    <div className="py-7 bg-brand-blue border-t border-brand-blue-hover overflow-hidden relative" id="brand-marquee-section">
      {/* Decorative gradient overlay screens for standard smooth fade-out effects */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-brand-blue to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-brand-blue to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4 flex items-center justify-between text-white/50">
        {lang === "en" ? (
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
            Authorized Global Partners
          </span>
        ) : (
          <span className="text-sm font-Cairo font-semibold">
            الوكالات التجارية المعتمدة بالسويس
          </span>
        )}
        <span className="text-[10px] uppercase opacity-40">
          {lang === "en" ? "SUEZ HUB" : "موزع معتمد"}
        </span>
      </div>

      <div className="relative w-full overflow-hidden flex items-center" dir="ltr" style={{ direction: "ltr" }}>
        <div className="animate-marquee whitespace-nowrap flex gap-10 md:gap-14 items-center" dir="ltr" style={{ direction: "ltr" }}>
          {duplicatedBrands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="inline-flex items-center justify-center bg-white px-7 py-3 rounded-xl border border-white/10 transition-all duration-300 transform hover:scale-105 shrink-0 shadow-sm"
              style={{ minWidth: "160px", height: "64px" }}
              title={brand.name}
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  referrerPolicy="no-referrer"
                  className="max-h-11 max-w-[130px] object-contain"
                />
              ) : (
                <span className="text-neutral-800 font-extrabold font-display text-xs tracking-wider uppercase">
                  {brand.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
