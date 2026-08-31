"use client";

import Image from "next/image";
import { Play, Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";

// Two-column testimonial block: the quote and attribution on the left,
// a video placeholder on the right, the video itself is optional and
// wired up per case study later.
export function TestimonialMedia({
  image,
  quote,
  name,
  role,
}: {
  image: string;
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <Reveal>
        <Quote className="w-10 h-10 text-[#38B685]/40 mb-6" fill="currentColor" />

        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
          ))}
        </div>

        <p className="text-2xl font-semibold text-white leading-snug mb-6 text-balance">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="h-px bg-white/10 mb-6" />

        <p
          className="text-3xl lg:text-4xl text-[#38B685] mb-1"
          style={{ fontFamily: "var(--font-signature)" }}
        >
          {name}
        </p>
        <p className="text-white/50 text-sm">{role}</p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#161616]"
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover opacity-60"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur max-lg:backdrop-blur-none flex items-center justify-center border border-white/20">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
