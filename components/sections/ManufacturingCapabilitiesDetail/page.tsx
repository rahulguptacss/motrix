'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type {
  ManufacturingCapabilityDetailData,
  ManufacturingCapabilitiesDetailLabels,
  ManufacturingCapabilitiesDetailProps,
} from '../../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Helper for SVG icons used in Process steps */
function ProcessStepIcon({ icon }: { icon?: string }) {
  if (icon === 'cube') {
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    );
  }
  if (icon === 'clipboard') {
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
        <path d="M14 2v6h6" />
        <path d="M8 12h4" />
        <path d="M8 16h3" />
        <circle cx="17.5" cy="17.5" r="3.5" />
        <path d="m16 17.5 1 1 2-2" />
      </svg>
    );
  }
  if (icon === 'shield') {
    return (
      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  // Default Gear icon
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

export default function ManufacturingCapabilitiesDetail({
  data,
  labels,
  currentSlug,
}: ManufacturingCapabilitiesDetailProps) {
  const rootRef = useRef<HTMLElement>(null);

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
        // 1. Hero Image Reveal
        gsap.fromTo(
          q('[data-detail-hero]'),
          { autoAlpha: 0, y: 30, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' }
        );

        // 2. Eyebrow Line & Text Reveal
        gsap.fromTo(
          q('[data-detail-eyebrow-line]'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.85, delay: 0.1, ease: 'power2.inOut' }
        );

        gsap.fromTo(
          q('[data-detail-eyebrow-text]'),
          { autoAlpha: 0, x: -10 },
          { autoAlpha: 1, x: 0, duration: 0.7, delay: 0.15, ease: 'power3.out' }
        );

        // 3. Heading & Intro
        gsap.fromTo(
          q('[data-detail-heading]'),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.85, delay: 0.2, ease: 'power3.out' }
        );

        gsap.fromTo(
          q('[data-detail-intro]'),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.85, delay: 0.3, ease: 'power3.out' }
        );

        // 4. Sidebar Reveal: synchronized with hero, clearProps to preserve CSS sticky
        gsap.fromTo(
          q('[data-detail-sidebar]'),
          { autoAlpha: 0, y: 25 },
          { autoAlpha: 1, y: 0, duration: 0.85, delay: 0.15, ease: 'power3.out', clearProps: 'transform' }
        );

        const sidebarItems = q('[data-sidebar-item]');
        if (sidebarItems.length > 0) {
          gsap.fromTo(
            sidebarItems,
            { autoAlpha: 0, x: 15 },
            { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.06, delay: 0.25, ease: 'power2.out' }
          );
        }

        // 5. Supporting Mid Images Stagger on Scroll
        const midImgs = q('[data-mid-img]');
        if (midImgs.length > 0) {
          gsap.fromTo(
            midImgs,
            { autoAlpha: 0, y: 35, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: midImgs[0],
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        // 6. "Why Choose" Section
        const whySection = q('[data-why-section]');
        if (whySection.length > 0) {
          gsap.fromTo(
            q('[data-why-head]'),
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: whySection[0],
                start: 'top 85%',
                once: true,
              },
            }
          );

          const whyPoints = q('[data-why-point]');
          if (whyPoints.length > 0) {
            gsap.fromTo(
              whyPoints,
              { autoAlpha: 0, x: -16 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: whyPoints[0],
                  start: 'top 88%',
                  once: true,
                },
              }
            );
          }
        }

        // 7. "Our Process" Section
        const processSection = q('[data-process-section]');
        if (processSection.length > 0) {
          gsap.fromTo(
            q('[data-process-head]'),
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: processSection[0],
                start: 'top 85%',
                once: true,
              },
            }
          );

          const processCards = q('[data-process-card]');
          if (processCards.length > 0) {
            gsap.fromTo(
              processCards,
              { autoAlpha: 0, y: 28, scale: 0.95 },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.75,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: processCards[0],
                  start: 'top 88%',
                  once: true,
                },
              }
            );
          }
        }

        // 8. "We Guarantee to Deliver" Section
        const guaranteeSection = q('[data-guarantee-section]');
        if (guaranteeSection.length > 0) {
          gsap.fromTo(
            q('[data-guarantee-head]'),
            { autoAlpha: 0, y: 20 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: guaranteeSection[0],
                start: 'top 85%',
                once: true,
              },
            }
          );

          const guaranteePoints = q('[data-guarantee-point]');
          if (guaranteePoints.length > 0) {
            gsap.fromTo(
              guaranteePoints,
              { autoAlpha: 0, x: 18 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: guaranteePoints[0],
                  start: 'top 88%',
                  once: true,
                },
              }
            );
          }
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative w-full bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              LEFT COLUMN: Main Capability Detail (8 cols on desktop)
             ======================================================== */}
          <div className="lg:col-span-8 flex flex-col">
            {/* 1. Main Hero Image */}
            <div
              data-detail-hero
              className="relative aspect-[16/10] sm:aspect-[16/8.8] w-full overflow-hidden rounded-[4px] sm:rounded-[6px] bg-dark shadow-sm"
            >
              <Image
                src={data.hero_image}
                alt={data.hero_alt}
                fill
                priority
                quality={90}
                sizes="(max-width: 1024px) 100vw, 68vw"
                className="object-cover"
              />
            </div>

            {/* 2. Eyebrow + Main Two-Tone Heading */}
            <div className="mt-6 sm:mt-9">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span
                  data-detail-eyebrow-line
                  className="h-[2px] w-5 bg-primary shrink-0 origin-left"
                />
                <span
                  data-detail-eyebrow-text
                  className="font-heading text-[11.5px] sm:text-[13px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-primary"
                >
                  {data.eyebrow}
                </span>
              </div>

              <h1
                data-detail-heading
                className="font-heading text-[26px] xs:text-[30px] sm:text-[38px] lg:text-[44px] font-black uppercase tracking-tight leading-[1.12] mt-3 sm:mt-4 text-dark"
              >
                {data.title_black} <span className="text-primary">{data.title_orange}</span>
              </h1>

              {/* Intro Paragraph */}
              <p
                data-detail-intro
                className="mt-3.5 sm:mt-5 text-[14px] sm:text-[15.5px] leading-[1.7] text-[#555d6e]"
              >
                {data.intro}
              </p>
            </div>

            {/* 3. Supporting 2 Images Side-by-Side */}
            {data.mid_images && data.mid_images.length > 0 && (
              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
                {data.mid_images.map((img, idx) => (
                  <div
                    key={idx}
                    data-mid-img
                    className="group relative aspect-[16/10.5] w-full overflow-hidden rounded-[4px] sm:rounded-[6px] bg-dark shadow-sm"
                  >
                    <Image
                      src={img.image}
                      alt={img.alt}
                      fill
                      quality={88}
                      sizes="(max-width: 640px) 100vw, 34vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 4. "Why Choose Our [Title]" */}
            {data.why_choose && (
              <div data-why-section className="mt-8 sm:mt-12">
                <div data-why-head>
                  <h2 className="font-heading text-[20px] sm:text-[24px] lg:text-[25px] font-bold text-dark leading-snug">
                    {data.why_choose.title}
                  </h2>
                  <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15px] leading-[1.7] text-[#555d6e]">
                    {data.why_choose.description}
                  </p>
                </div>

                {/* 2-Column Checklist */}
                <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-3.5 gap-x-6">
                  {data.why_choose.points.map((pt, idx) => (
                    <div key={idx} data-why-point className="flex items-start sm:items-center gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[10px] font-black mt-0.5 sm:mt-0 shadow-xs">
                        ✓
                      </span>
                      <span className="text-[13.5px] sm:text-[14.5px] font-medium text-[#374151] leading-snug">
                        {pt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. "Our Process" Section Box */}
            {data.process && (
              <div
                data-process-section
                className="mt-8 sm:mt-12 rounded-[8px] bg-[#f2f7fb] p-5 sm:p-7 lg:p-9 border border-[#dce5ee]/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              >
                <div data-process-head>
                  <h3 className="font-heading text-[22px] sm:text-[28px] lg:text-[32px] font-black tracking-tight text-[#0f172a]">
                    {data.process.title_black}{' '}
                    <span className="text-primary">{data.process.title_orange}</span>
                  </h3>
                  <p className="mt-2 text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#556075] max-w-2xl">
                    {data.process.subtitle}
                  </p>
                </div>

                {/* Responsive Grid: Max 3 per row on desktop; clean stacked cards on mobile */}
                <div className="mt-6 sm:mt-9 grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 sm:gap-y-8 gap-x-0 items-center">
                  {data.process.steps.map((st, idx) => {
                    const isRowStart = idx % 3 === 0;
                    const isRowEnd = idx % 3 === 2;
                    const hasNextInRow = idx + 1 < data.process.steps.length && !isRowEnd;

                    return (
                      <div
                        key={idx}
                        data-process-card
                        className={`flex items-center gap-3.5 sm:gap-4 p-3 sm:p-0 rounded-[6px] sm:rounded-none bg-white/70 sm:bg-transparent border border-[#dce5ee]/60 sm:border-0 shadow-xs sm:shadow-none ${
                          hasNextInRow ? 'sm:border-r sm:border-[#d5dbe5] sm:pr-6 lg:pr-8' : ''
                        } ${!isRowStart ? 'sm:pl-6 lg:pl-8' : 'sm:pl-0'}`}
                      >
                        {/* Soft Peach Circular Badge */}
                        <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] xl:w-[60px] xl:h-[60px] rounded-full bg-[#f8eae6] flex items-center justify-center shrink-0 shadow-sm">
                          <ProcessStepIcon icon={st.icon} />
                        </div>
                        {/* Number + Title */}
                        <div className="flex flex-col min-w-0">
                          <span className="font-heading font-black text-[17px] sm:text-[18px] text-primary leading-none">
                            {st.number}
                          </span>
                          <h4 className="font-heading font-bold text-[14px] sm:text-[15px] text-[#1e293b] leading-[1.3] mt-1 sm:whitespace-pre-line">
                            {st.title.replace(' & ', ' &\n').replace(' Machining', '\nMachining').replace(' Inspection', '\nInspection').replace(' Verification', '\nVerification').replace(' Production', '\nProduction').replace(' Assembly', '\nAssembly').replace(' Prototyping', '\nPrototyping').replace(' Approval', '\nApproval')}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. "We Guarantee to Deliver" Section */}
            {data.guarantee && (
              <div data-guarantee-section className="mt-8 sm:mt-12">
                <div data-guarantee-head>
                  <h2 className="font-heading text-[20px] sm:text-[24px] lg:text-[25px] font-bold text-dark leading-snug">
                    {data.guarantee.title}
                  </h2>
                  <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15px] leading-[1.7] text-[#555d6e]">
                    {data.guarantee.description}
                  </p>
                </div>

                {/* Bullet Points with Orange Chevrons */}
                <ul className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3">
                  {data.guarantee.points.map((pt, idx) => (
                    <li
                      key={idx}
                      data-guarantee-point
                      className="flex items-start gap-2.5 text-[13.5px] sm:text-[14.5px] leading-relaxed text-[#4b5563]"
                    >
                      <span className="text-primary font-bold text-[18px] leading-snug shrink-0 mt-0.5">
                        ›
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: Sidebar Menu (4 cols on desktop)
              Starts flush with the hero image on the left and stays sticky on scroll.
             ======================================================== */}
          <aside className="lg:col-span-4 w-full self-start lg:sticky lg:top-24 xl:top-28 z-20 mt-8 lg:mt-0">
            <div
              data-detail-sidebar
              className="bg-[#f8fafd] rounded-[8px] p-4 sm:p-6 lg:p-7 border border-[#e5eaf2] shadow-sm"
            >
              {/* Sidebar Header with Orange Vertical Bar (Title Case, no border-b, matching screenshot) */}
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <span className="h-[18px] w-[3.5px] bg-primary rounded-full shrink-0" />
                <h3 className="font-heading text-[16px] sm:text-[18px] font-bold text-[#0f172a] leading-none tracking-tight">
                  {labels.sidebar_title}
                </h3>
              </div>

              {/* Capabilities Menu List */}
              <nav className="flex flex-col gap-2.5 sm:gap-3" aria-label="Capabilities Navigation">
                {labels.capabilities_list.map((item) => {
                  const isActive =
                    item.slug === currentSlug ||
                    (item.slug === 'advanced-manufacturing' && currentSlug === 'automotive-structure') ||
                    (item.slug === 'precision-engineering' && currentSlug === 'precision-engineered-parts') ||
                    (item.slug === 'quality-assurance' && currentSlug === 'safety-performance') ||
                    (item.slug === 'scalable-production' && currentSlug === 'powertrain-solutions') ||
                    (item.slug === 'advanced-automation' && currentSlug === 'cnc-machining') ||
                    (item.slug === 'end-to-end-capabilities' && currentSlug === 'ev-battery');

                  if (isActive) {
                    return (
                      <Link
                        key={item.slug}
                        href={`/manufacturing-capabilities/${item.slug}`}
                        data-sidebar-item
                        className="group flex items-stretch justify-between rounded-[4px] bg-primary overflow-hidden shadow-sm transition-all h-[48px] sm:h-[52px]"
                      >
                        <span className="flex-1 px-4 sm:px-5 font-heading text-[13.5px] sm:text-[14.5px] font-bold text-white tracking-tight flex items-center">
                          {item.name}
                        </span>
                        <span className="w-11 sm:w-[50px] bg-[#1a2332] flex items-center justify-center shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.4}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.slug}
                      href={`/manufacturing-capabilities/${item.slug}`}
                      data-sidebar-item
                      className="group flex items-center justify-between px-4 sm:px-5 rounded-[4px] bg-white border border-[#e5e9f0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-[#fafbfc] hover:border-slate-300 transition-all h-[48px] sm:h-[52px]"
                    >
                      <span className="font-heading text-[13.5px] sm:text-[14.5px] font-semibold text-[#1e293b] group-hover:text-primary transition-colors tracking-tight">
                        {item.name}
                      </span>
                      <svg
                        className="w-4 h-4 text-[#1e293b] group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
