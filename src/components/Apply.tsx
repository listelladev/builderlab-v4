"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { phoneCodes } from "@/lib/data";

const inputClass =
  "w-full bg-transparent border-b border-white/20 focus:border-[#38B685] text-white text-lg py-3 px-1 outline-none transition-colors placeholder:text-white/30";

export function Apply() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
  });
  const [countryCode, setCountryCode] = useState("+1");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="apply" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#08120E]" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[150px] opacity-50"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[500px] h-[400px] rounded-full blur-[140px] opacity-30"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-[160px] opacity-25"
        style={{ background: "radial-gradient(ellipse, #38B685, transparent 70%)" }}
      />

      <div className="relative max-w-[700px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 text-balance">
            Ready to Grow?
          </h2>
          <p className="text-lg text-white/50">No sales reps. No middlemen.</p>
        </div>

        {submitted ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-[#38B685] mx-auto mb-6 flex items-center justify-center">
              <Check className="w-7 h-7 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Application received.
            </h3>
            <p className="text-white/60 max-w-md mx-auto">
              We&apos;ll be in touch within 24 hours to schedule your free
              strategy call.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-white/40 mb-1 block">
                Full name *
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">Phone</label>
              <div className="flex gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent border-b border-white/20 focus:border-[#38B685] text-white py-3 px-1 outline-none transition-colors"
                >
                  {phoneCodes.map((c) => (
                    <option
                      key={c.code + c.flag}
                      value={c.code}
                      className="bg-[#0D1814]"
                    >
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass + " flex-1"}
                  placeholder="Your phone number"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">
                Company name *
              </label>
              <input
                required
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputClass}
                placeholder="Company name"
              />
            </div>
            <div>
              <label className="text-sm text-white/40 mb-1 block">
                Website *
              </label>
              <input
                required
                type="text"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className={inputClass}
                placeholder="yourcompany.com.au"
              />
            </div>
            <button
              type="submit"
              className="group w-full mt-8 bg-[#38B685] text-black py-5 rounded-full text-lg font-bold hover:scale-[1.02] transition-transform duration-500 ease-out flex items-center justify-center gap-2 cursor-pointer"
            >
              Book My Free Strategy Call
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
