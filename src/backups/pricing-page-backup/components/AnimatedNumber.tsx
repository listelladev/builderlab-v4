"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

const format = (prefix: string, n: number) =>
  `${prefix}${Math.round(n).toLocaleString("en-US")}`;

// A dollar figure that counts to its new value when `value` changes — used
// for the prices that react to the commitment toggle and add-on switches.
//
// The server-rendered text is the real value (no "0" flash, correct with JS
// off). After that the span's text is driven imperatively, so React is handed
// a constant string and never fights it for the node. It is a fixed-duration
// tween rather than a spring on purpose: a spring settles asymptotically and
// would leave a price a few dollars off for seconds, which is the one thing
// a pricing page cannot do. This always lands exactly on `value`.
export function AnimatedNumber({
  value,
  prefix = "$",
  className,
}: {
  value: number;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [initial] = useState(value);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === value) return;
    const controls = animate(shown.current, value, {
      duration: 0.6,
      ease: [0.21, 0.5, 0.28, 1],
      onUpdate: (latest) => {
        shown.current = latest;
        el.textContent = format(prefix, latest);
      },
      onComplete: () => {
        shown.current = value;
        el.textContent = format(prefix, value);
      },
    });
    return () => controls.stop();
  }, [value, prefix]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {format(prefix, initial)}
    </span>
  );
}
