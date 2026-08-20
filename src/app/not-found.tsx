import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionGlow } from "@/components/SectionGlow";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[80vh] flex items-center py-32 overflow-hidden">
          <SectionGlow
            positions={[
              "top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] blur-[150px] opacity-50",
              "bottom-0 left-1/4 w-[500px] h-[400px] blur-[140px] opacity-30",
              "bottom-0 right-1/4 w-[500px] h-[400px] blur-[160px] opacity-25",
            ]}
          />
          <div className="relative z-10 max-w-[700px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-[#38B685] text-sm font-semibold uppercase tracking-wider mb-4">
              Page not found
            </p>
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 text-balance">
              404 Error
            </h1>
            <p className="text-lg text-white/50 mb-10">
              The page you&apos;re looking for doesn&apos;t exist or has moved.
            </p>
            <Link
              href="/"
              className="group inline-flex items-center gap-2 bg-white hover:bg-[#38B685] text-black hover:text-white px-6 py-3.5 rounded-full text-base font-semibold transition-colors duration-500 ease-out"
            >
              Back to home
              <span className="w-6 h-6 rounded-full bg-black group-hover:bg-white flex items-center justify-center group-hover:translate-x-1 transition-all duration-500 ease-out">
                <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#38B685] transition-colors duration-500 ease-out" />
              </span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
