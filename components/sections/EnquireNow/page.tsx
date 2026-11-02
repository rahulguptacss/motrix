'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronDown, Check, CheckCircle2 } from 'lucide-react';
import type { EnquireNowProps, EnquireNowSectionData } from '../../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function EnquireNow({ data }: EnquireNowProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { eyebrow, title_black, title_orange, description, form, why_enquire } = data;

  const rawOptions = form.interest_options || [
    'Advanced Manufacturing',
    'Precision Engineering',
    'Quality Assurance',
    'Scalable Production',
    'Advanced Automation',
    'End-to-End Capabilities',
    'Powertrain Components',
    'Chassis & Safety Solutions',
    'EV Drive Systems',
  ];
  const placeholderText = form.interest_placeholder || 'Product / Solution of Interest';
  const cleanOptions = rawOptions.filter(
    (opt) =>
      opt &&
      opt.trim().length > 0 &&
      opt.trim().toLowerCase() !== placeholderText.trim().toLowerCase()
  );

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedControlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Tab',
      'Enter',
      'Home',
      'End',
    ];
    if (allowedControlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }
    if (e.key === '+' && e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes('+')) {
      return;
    }
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9+]/g, '');
    if (value.includes('+')) {
      const hasLeadingPlus = value.startsWith('+');
      value = (hasLeadingPlus ? '+' : '') + value.replace(/\+/g, '');
    }
    setPhoneValue(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-reveal]'), { autoAlpha: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Top Header Reveal
        const headTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root, start: 'top 80%', once: true },
        });

        headTl
          .fromTo(
            q('[data-enquire-eyebrow]'),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.6 }
          )
          .fromTo(
            q('[data-enquire-title]'),
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.75 },
            0.1
          )
          .fromTo(
            q('[data-enquire-desc]'),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.2
          );

        // 2. Form Card Reveal
        const formEl = q('[data-enquire-form]')[0];
        if (formEl) {
          gsap.fromTo(
            formEl,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: formEl,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // 3. Right Column (Why Enquire) Reveal
        const rightEyebrow = q('[data-why-eyebrow]')[0];
        if (rightEyebrow) {
          const rightTl = gsap.timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: rightEyebrow, start: 'top 85%', once: true },
          });

          rightTl
            .fromTo(
              q('[data-why-eyebrow]'),
              { autoAlpha: 0, y: 14 },
              { autoAlpha: 1, y: 0, duration: 0.6 }
            )
            .fromTo(
              q('[data-why-title]'),
              { autoAlpha: 0, y: 22 },
              { autoAlpha: 1, y: 0, duration: 0.75 },
              0.1
            )
            .fromTo(
              q('[data-why-desc]'),
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: 0.7 },
              0.2
            );
        }

        const steps = q('[data-why-step]');
        if (steps.length > 0) {
          gsap.fromTo(
            steps,
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: steps[0],
                start: 'top 88%',
                once: true,
              },
            }
          );
        }
      });
    },
    { scope: rootRef }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setSelectedInterest('');
      setPhoneValue('');
      setDropdownOpen(false);
      target.reset();
    }, 850);
  };

  return (
    <section ref={rootRef} className="relative w-full bg-white py-10 sm:py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            1. TOP HEADER (Eyebrow, Two-Tone Heading, Subtitle)
           ======================================================== */}
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div data-enquire-eyebrow className="flex items-center gap-2.5">
            <span className="h-[2.5px] w-6 bg-primary shrink-0" />
            <span className="font-heading text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
              {eyebrow}
            </span>
          </div>

          {/* Two-Tone Title */}
          <h1
            data-enquire-title
            className="font-heading text-[32px] sm:text-[40px] lg:text-[46px] font-black tracking-tight leading-[1.14] mt-3 sm:mt-4 text-[#0f172a]"
          >
            {title_black}{' '}
            <span className="text-primary block sm:inline">{title_orange}</span>
          </h1>

          {/* Description */}
          <p
            data-enquire-desc
            className="mt-3.5 sm:mt-4 text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#555d6e] max-w-2xl"
          >
            {description}
          </p>
        </div>

        {/* ========================================================
            2. TWO-COLUMN ROW: Form Card (Left) & Why Enquire (Right)
               Both start at the EXACT SAME horizontal level as shown in the screenshot!
           ======================================================== */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Form Card (7 cols) */}
          <div
            data-enquire-form
            className="lg:col-span-7 bg-[#f8fafd] rounded-[8px] p-6 sm:p-8 lg:p-9 border border-[#e8edf4] shadow-[0_2px_16px_rgba(0,0,0,0.02)]"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-4.5">
              {/* Row 1: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={form.name_placeholder}
                  className="w-full h-[52px] sm:h-[56px] px-5 rounded-[4px] border border-[#e2e8f0] bg-white text-[14px] sm:text-[14.5px] text-[#1e293b] placeholder:text-[#555d6e] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
                <input
                  type="text"
                  name="company"
                  placeholder={form.company_placeholder}
                  className="w-full h-[52px] sm:h-[56px] px-5 rounded-[4px] border border-[#e2e8f0] bg-white text-[14px] sm:text-[14.5px] text-[#1e293b] placeholder:text-[#555d6e] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Row 2: Email & Phone (Strictly numbers allowed in phone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4.5">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={form.email_placeholder}
                  className="w-full h-[52px] sm:h-[56px] px-5 rounded-[4px] border border-[#e2e8f0] bg-white text-[14px] sm:text-[14.5px] text-[#1e293b] placeholder:text-[#555d6e] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  onKeyDown={handlePhoneKeyDown}
                  inputMode="numeric"
                  pattern="[0-9+]*"
                  placeholder={form.phone_placeholder}
                  className="w-full h-[52px] sm:h-[56px] px-5 rounded-[4px] border border-[#e2e8f0] bg-white text-[14px] sm:text-[14.5px] text-[#1e293b] placeholder:text-[#555d6e] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Row 3: Product / Solution of Interest (Custom Select matching screenshot) */}
              <div ref={dropdownRef} className="relative w-full">
                <input type="hidden" name="interest" value={selectedInterest} />
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className={`w-full h-[52px] sm:h-[56px] px-5 rounded-[4px] border bg-white flex items-center justify-between text-[14px] sm:text-[14.5px] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer text-left select-none outline-none ${
                    dropdownOpen
                      ? 'border-primary ring-2 ring-primary/15'
                      : 'border-[#e2e8f0] hover:border-slate-300'
                  }`}
                >
                  <span
                    className={
                      selectedInterest
                        ? 'text-[#1e293b] font-medium truncate'
                        : 'text-[#555d6e] truncate'
                    }
                  >
                    {selectedInterest || placeholderText}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1e293b] stroke-[2.2] transition-transform duration-200 shrink-0 ml-2 ${
                      dropdownOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-full mt-1.5 max-h-[280px] overflow-y-auto rounded-[6px] border border-[#e2e8f0] bg-white py-1.5 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.16),0_4px_12px_rgba(0,0,0,0.06)] z-50 divide-y divide-[#f1f5f9]"
                  >
                    {cleanOptions.map((opt, idx) => {
                      const isSelected = selectedInterest === opt;
                      return (
                        <li
                          key={idx}
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSelectedInterest(opt);
                            setDropdownOpen(false);
                          }}
                          className={`flex items-center justify-between px-5 py-3 sm:py-3.5 text-[13.5px] sm:text-[14px] cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#fff4ed] text-primary font-bold'
                              : 'text-[#1e293b] hover:bg-[#f8fafc] hover:text-primary font-medium'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary stroke-[2.5]" />}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Row 4: Message Textarea */}
              <div>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder={form.message_placeholder}
                  className="w-full min-h-[140px] sm:min-h-[150px] p-5 rounded-[4px] border border-[#e2e8f0] bg-white text-[14px] sm:text-[14.5px] text-[#1e293b] placeholder:text-[#555d6e] focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all resize-y shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                />
              </div>

              {/* Row 5: Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-[4px] bg-primary hover:bg-primary-dark text-white font-heading font-bold text-[14.5px] sm:text-[15px] shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer disabled:opacity-70"
                >
                  <span>{status === 'sending' ? form.submitting_text : form.submit_text}</span>
                </button>
              </div>

              {/* Success Notification */}
              {status === 'sent' && (
                <div
                  role="status"
                  className="flex items-center gap-2.5 p-4 rounded-[4px] bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-[13.5px] sm:text-[14px] mt-2 shadow-xs"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{form.success_message}</span>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Why Enquire With Motrix (5 cols) */}
          <div className="lg:col-span-5 flex flex-col pt-1 sm:pt-2">
            {/* Header: Eyebrow */}
            <div data-why-eyebrow className="flex items-center gap-2.5">
              <span className="h-[2.5px] w-6 bg-primary shrink-0" />
              <span className="font-heading text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
                {why_enquire.eyebrow}
              </span>
            </div>

            {/* Two-Tone Title */}
            <h2
              data-why-title
              className="font-heading text-[28px] sm:text-[34px] lg:text-[38px] font-black tracking-tight leading-[1.16] mt-3 sm:mt-4 text-[#0f172a]"
            >
              {why_enquire.title_black}{' '}
              {why_enquire.title_prefix && (
                <span className="font-bold text-[#0f172a]">{why_enquire.title_prefix} </span>
              )}
              <span className="text-primary">{why_enquire.title_orange}</span>
            </h2>

            {/* Description */}
            <p
              data-why-desc
              className="mt-3.5 sm:mt-4 text-[14px] sm:text-[15px] leading-relaxed text-[#555d6e]"
            >
              {why_enquire.description}
            </p>

            {/* 3 Numbered Steps / Features */}
            <div className="mt-8 sm:mt-10 flex flex-col gap-6 sm:gap-7">
              {why_enquire.steps.map((item, idx) => (
                <div key={idx} data-why-step className="flex items-start gap-4 sm:gap-5 group">
                  {/* Step Number + Orange Line */}
                  <div className="flex items-center gap-2.5 pt-0.5 shrink-0">
                    <span className="font-heading font-black text-[20px] sm:text-[22px] text-primary leading-none">
                      {item.step}
                    </span>
                    <span className="w-6 sm:w-8 h-[2px] bg-[#fed7aa] shrink-0" />
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-[15.5px] sm:text-[16.5px] text-[#0f172a] leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13.5px] sm:text-[14px] leading-relaxed text-[#555d6e]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
