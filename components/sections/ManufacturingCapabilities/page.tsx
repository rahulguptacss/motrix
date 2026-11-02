'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type {
  ManufacturingCapabilitiesProps,
  ProjectItem,
  ProjectsSectionData,
} from '../../types';
import LineEyebrow from '../../ui/LineEyebrow';
import DisplayTitle from '../../ui/DisplayTitle';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Individual Capability Card:
 * - High-definition automotive imagery with hover zoom
 * - Dark gradient overlay for strong text contrast
 * - Uppercase bold title + signature orange accent dash with sublabel
 * - Bottom orange reveal underline on hover
 */
function CapabilityCard({
  item,
  href = '/manufacturing-capabilities',
}: {
  item: ProjectItem;
  href?: string;
}) {
  const sublabel = item.subtext || item.category;
  const targetHref = item.slug ? `/manufacturing-capabilities/${item.slug}` : `${href}/${item.id}`;

  return (
    <Link
      href={targetHref}
      data-capability-card
      data-reveal
      aria-label={`${item.title} - ${sublabel}`}
      className="group relative block w-full overflow-hidden bg-dark cursor-pointer rounded-[4px] sm:rounded-[2px] aspect-[4/4.6] sm:aspect-[4/4.5]"
    >
      {/* Inner overflow container with bleed for GSAP parallax scroll */}
      <div className="absolute -inset-y-[8%] inset-x-0 overflow-hidden">
        <Image
          data-capability-img
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

      {/* Card Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-7 flex flex-col justify-end pointer-events-none z-10">
        <h3 className="font-heading text-[16px] sm:text-[19px] lg:text-[20px] font-black uppercase leading-[1.2] tracking-[-0.01em] text-white">
          {item.title}
        </h3>
        <div className="mt-2 sm:mt-3 flex items-center gap-2.5">
          <span className="h-[2px] w-4 shrink-0 bg-primary transition-all duration-300 group-hover:w-6" />
          <p className="font-heading text-[10.5px] sm:text-[12px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/85">
            {sublabel}
          </p>
        </div>
      </div>

      {/* Bottom orange highlight bar */}
      <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100 z-20" />
    </Link>
  );
}

export default function ManufacturingCapabilities({
  data,
}: ManufacturingCapabilitiesProps) {
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
        /* ---------- 1. Eyebrow + Heading + Text Reveal ---------- */
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        });

        tl.fromTo(q('[data-eyebrow]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 })
          .fromTo(q('[data-eyebrow-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.2)
          .set(q('[data-title]'), { autoAlpha: 1 }, 0.1)
          .fromTo(
            q('[data-title-char]'),
            { yPercent: 115, rotate: 6 },
            { yPercent: 0, rotate: 0, duration: 0.95, stagger: 0.025, ease: 'power4.out' },
            0.15
          )
          .fromTo(q('[data-title-line]'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.45)
          .fromTo(q('[data-cap-copy]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0.35);

        /* ---------- 2. Card Entrances Staggered ---------- */
        const cards = q('[data-capability-card]');
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 44, scale: 0.97 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: cards[0],
                start: 'top 82%',
                once: true,
              },
            }
          );

          /* ---------- 3. Card Image Parallax on Scroll ---------- */
          cards.forEach((card) => {
            const img = card.querySelector('[data-capability-img]');
            if (img) {
              gsap.fromTo(
                img,
                { yPercent: -5 },
                {
                  yPercent: 5,
                  ease: 'none',
                  scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                  },
                }
              );
            }
          });
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-16 items-end">
          <div>
            <LineEyebrow text={data.eyebrow} className="mb-3.5 sm:mb-5" />
            <DisplayTitle bold={data.title_bold} light={data.title_light} />
          </div>
          <p data-cap-copy data-reveal className="text-[14px] sm:text-[15.5px] leading-relaxed text-[#646b7a] lg:pb-2">
            {data.description}
          </p>
        </div>

        <div className="mt-8 sm:mt-12 lg:mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {data.items.map((item) => (
            <CapabilityCard key={item.id} item={item} href={data.button_link} />
          ))}
        </div>
      </div>
    </section>
  );
}

