'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ChevronDown,
  Navigation,
  Check,
} from 'lucide-react';
import type { ContactProps, ContactSectionData } from '../../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Contact({ data }: ContactProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { form, help_badge, info_cards, map } = data;

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
    // Allow navigation / editing keys
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
    // Allow '+' only if it's at index 0 and no '+' already exists
    if (e.key === '+' && (e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes('+'))) {
      return;
    }
    // Only allow numbers 0-9
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip all non-numeric characters except optional leading '+'
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
            q('[data-contact-eyebrow]'),
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.6 }
          )
          .fromTo(
            q('[data-contact-title]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            0.1
          )
          .fromTo(
            q('[data-contact-desc]'),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.75 },
            0.2
          );

        // 2. Left Column (Image + Phone Badge) Reveal
        gsap.fromTo(
          q('[data-contact-left]'),
          { autoAlpha: 0, y: 35, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: q('[data-contact-left]')[0],
              start: 'top 85%',
              once: true,
            },
          }
        );

        // 3. Right Column (Form Box) Reveal
        gsap.fromTo(
          q('[data-contact-form]'),
          { autoAlpha: 0, y: 35 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: q('[data-contact-form]')[0],
              start: 'top 85%',
              once: true,
            },
          }
        );

        // 4. Info Cards Stagger
        const infoCards = q('[data-info-card]');
        if (infoCards.length > 0) {
          gsap.fromTo(
            infoCards,
            { autoAlpha: 0, y: 25 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: infoCards[0],
                start: 'top 88%',
                once: true,
              },
            }
          );
        }

        // 5. Map Reveal
        const mapContainer = q('[data-contact-map]');
        if (mapContainer.length > 0) {
          gsap.fromTo(
            mapContainer,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: mapContainer[0],
                start: 'top 90%',
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
    <section ref={rootRef} className="relative w-full bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================
            1. SECTION HEADER (Eyebrow, Two-Tone Heading, Subtitle)
           ======================================================== */}
        <div className="max-w-3xl">
          <div data-contact-eyebrow className="flex items-center gap-2 sm:gap-2.5">
            <span className="h-[2px] w-5 bg-primary shrink-0" />
            <span className="font-heading text-[11.5px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-primary">
              {data.eyebrow}
            </span>
          </div>

          <h1
            data-contact-title
            className="font-heading text-[28px] xs:text-[34px] sm:text-[42px] lg:text-[48px] font-black uppercase tracking-tight leading-[1.12] mt-3 sm:mt-4 text-[#0f172a]"
          >
            {data.title_black || data.title_bold}{' '}
            <span className="text-primary">{data.title_orange || (data.title_light && data.title_light[0])}</span>
          </h1>

          <p
            data-contact-desc
            className="mt-3.5 sm:mt-4 text-[14px] sm:text-[15.5px] leading-[1.7] text-[#555d6e]"
          >
            {data.description}
          </p>
        </div>

        {/* ========================================================
            2. MAIN CONTENT (Left Image + Phone Badge | Right Form)
           ======================================================== */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ── LEFT COLUMN: Engineers Photo + Bottom Phone Bar (Matching screenshot) ── */}
          <div
            data-contact-left
            className="lg:col-span-5 flex flex-col rounded-[8px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#e8edf4]"
          >
            <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-dark">
              <Image
                src={data.image}
                alt={data.image_alt}
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>

            {/* Bottom Dark Navy Bar with Phone Icon Box and Number */}
            {help_badge && (
              <a
                href={help_badge.phone_href || `tel:${help_badge.phone.replace(/[^0-9+]/g, '')}`}
                className="group flex items-center gap-4 sm:gap-5 bg-[#0b111e] p-5 sm:p-7 transition-colors hover:bg-[#111a2e]"
              >
                {/* Orange Phone Icon Box with filled handset */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[4px] bg-primary flex items-center justify-center shrink-0 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
                </div>

                {/* Question Label + Phone Number */}
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-primary font-heading text-[11px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] leading-tight">
                    {help_badge.label}
                  </span>
                  <span className="font-heading font-black text-[20px] sm:text-[24px] lg:text-[26px] text-white tracking-tight leading-tight mt-1.5 transition-colors group-hover:text-primary">
                    {help_badge.phone}
                  </span>
                </div>
              </a>
            )}
          </div>

          {/* ── RIGHT COLUMN: Request a Quote Form (Card matching screenshot) ── */}
          <div
            data-contact-form
            className="lg:col-span-7 bg-[#f8fafd] rounded-[8px] p-6 sm:p-8 lg:p-10 border border-[#e8edf4] shadow-[0_2px_16px_rgba(0,0,0,0.02)] flex flex-col"
          >
            {/* Form Header */}
            <div>
              {form.eyebrow && (
                <div className="flex items-center gap-2.5">
                  <span className="h-[2.5px] w-6 bg-primary shrink-0" />
                  <span className="font-heading text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
                    {form.eyebrow}
                  </span>
                </div>
              )}

              <h2 className="font-heading text-[30px] sm:text-[36px] lg:text-[40px] font-black tracking-tight text-[#0f172a] mt-2.5 leading-tight">
                {form.title_black && `${form.title_black} `}
                <span className="text-primary">{form.title_orange || form.title}</span>
              </h2>

              {form.subtitle && (
                <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-[#555d6e]">
                  {form.subtitle}
                </p>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 flex flex-col gap-4 sm:gap-4.5">
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

              {/* Row 2: Email & Phone */}
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
                  <span className="text-[17px] leading-none">→</span>
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
        </div>

        {/* ========================================================
            3. THREE INFO CARDS (Address, Phone, Email)
           ======================================================== */}
        <div className="mt-12 sm:mt-16 lg:mt-20 pt-8 sm:pt-12 border-t border-[#e8edf4]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0">
            {info_cards.map((card, idx) => {
              const isLast = idx === info_cards.length - 1;

              return (
                <div
                  key={card.id}
                  data-info-card
                  className={`flex items-center gap-4 sm:gap-4.5 p-4 sm:p-0 rounded-[6px] sm:rounded-none bg-[#f8fafd] sm:bg-transparent border border-[#e8edf4] sm:border-0 ${
                    !isLast ? 'md:border-r md:border-[#e2e8f0] md:pr-8' : ''
                  } ${idx > 0 ? 'md:pl-8' : ''}`}
                >
                  {/* Orange Circular Badge */}
                  <div className="w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-300 hover:scale-105">
                    {card.icon === 'phone' ? (
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : card.icon === 'mail' ? (
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>

                  {/* Card Text Content */}
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading font-bold text-[11.5px] sm:text-[12.5px] uppercase tracking-[0.14em] text-primary">
                      {card.label || card.title}
                    </span>
                    {card.lines.map((line, lIdx) =>
                      card.href ? (
                        <a
                          key={lIdx}
                          href={card.href}
                          className="font-heading font-semibold text-[13.5px] sm:text-[14.5px] text-[#1e293b] hover:text-primary transition-colors leading-[1.4] mt-0.5"
                        >
                          {line}
                        </a>
                      ) : (
                        <span
                          key={lIdx}
                          className="font-heading font-semibold text-[13.5px] sm:text-[14.5px] text-[#1e293b] leading-[1.4] mt-0.5"
                        >
                          {line}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          4. FULL-WIDTH GOOGLE MAP WITH MOTRIX PIN OVERLAY
         ======================================================== */}
      <div data-contact-map className="mt-12 sm:mt-16 lg:mt-20 relative w-full h-[360px] sm:h-[440px] lg:h-[480px] overflow-hidden border-t border-b border-[#e2e8f0]">
        <iframe
          title={map.title}
          src={map.embed_url}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />

        {/* Floating Google Maps Style Card matching screenshot (data-driven) */}
        {map.card && (
          <div className="hidden sm:block absolute top-5 left-5 z-10 bg-white p-4 rounded-[6px] shadow-lg border border-slate-200/80 max-w-[290px] text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-heading font-bold text-[15px] text-[#0f172a]">{map.card.title}</h4>
                <p className="text-[12px] text-slate-600 leading-snug mt-0.5">
                  {map.card.address}
                </p>
              </div>
              <a
                href={map.card.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-primary hover:text-primary-dark shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                  <Navigation className="w-4 h-4 fill-primary text-primary" />
                </div>
                <span className="text-[10px] font-bold text-primary mt-0.5">{map.card.directions_text}</span>
              </a>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11.5px]">
              <span className="text-amber-500 font-bold">{map.card.rating_text}</span>
              <a
                href={map.card.directions_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {map.card.view_larger_text}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
