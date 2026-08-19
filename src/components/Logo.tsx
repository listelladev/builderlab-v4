import Image from "next/image";

export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <Image
      src="/images/footer-logo.webp"
      alt="Builderlab"
      width={1200}
      height={289}
      priority
      className={`${className} w-auto object-contain`}
    />
  );
}
