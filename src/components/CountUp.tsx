"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 32, stiffness: 55 });
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isDecimal = !Number.isInteger(value);

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (!ref.current) return;
      const display = isDecimal
        ? (Math.round(latest * 10) / 10).toFixed(1)
        : Math.round(latest).toLocaleString();
      ref.current.textContent = display;
    });
  }, [springValue, isDecimal]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
