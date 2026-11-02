'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { ProjectItem, ProjectsProps, ProjectsSectionData } from '../../types';
import LineEyebrow from '../../ui/LineEyebrow';
import DisplayTitle from '../../ui/DisplayTitle';
import PrimaryButton from '../../ui/PrimaryButton';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Individual Project Card:
 * - High-definition image with subtle parallax and hover zoom
 * - Dark gradient overlay for optimal text contrast
 * - Uppercase bold title + orange accent dash with subtext
 * - Orange bottom reveal line on hover
 */
function ProjectCard({
  item,
  aspect = 'aspect-[4/4.4]',
  href = '/manufacturing-capabilities',
}: {
  item: ProjectItem;
  aspect?: string;
  href?: string;
}) {
  const sublabel = item.subtext || item.category;
  const targetHref = item.slug ? `/manufacturing-capabilities/${item.slug}` : href;

  return (
    <Link
      href={targetHref}
      data-project-card
      data-reveal
      aria-label={`${item.title} - ${sublabel}`}
      className={`group relative block w-full overflow-hidden bg-dark cursor-pointer rounded-none sm:rounded-[2px] ${aspect}`}
    >
      {/* Inner overflow container with bleed for GSAP parallax scroll */}
      <div className="absolute -inset-y-[8%] inset-x-0 overflow-hidden">
        <Image
          data-project-img
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Card Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7 flex flex-col justify-end pointer-events-none z-10">
        <h3 className="font-heading text-[16px] sm:text-[18px] lg:text-[19px] xl:text-[21px] font-black uppercase leading-[1.2] tracking-[-0.01em] text-white">
          {item.title}
        </h3>
        <div className="mt-2.5 sm:mt-3 flex items-center gap-2.5">
          <span className="h-[2px] w-4 shrink-0 bg-primary transition-all duration-300 group-hover:w-6" />
          <p className="font-heading text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/85">
            {sublabel}
          </p>
        </div>
      </div>

      {/* Bottom orange highlight bar */}
      <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100 z-20" />
    </Link>
  );
}

export default function Projects({ data, variant = 'mosaic', showButton = true }: ProjectsProps) {
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
          .fromTo(q('[data-projects-copy]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0.35);

        /* ---------- 2. Card Entrances Staggered ---------- */
        const cards = q('[data-project-card]');
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
            const img = card.querySelector('[data-project-img]');
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

  /* Capabilities page: 3-column full grid */
  if (variant === 'grid') {
    return (
      <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16 items-end">
            <div>
              <LineEyebrow text={data.eyebrow} className="mb-4 sm:mb-5" />
              <DisplayTitle bold={data.title_bold} light={data.title_light} />
            </div>
            <p data-projects-copy data-reveal className="invisible text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#646b7a] lg:pb-2">
              {data.description}
            </p>
          </div>

          <div className="mt-12 sm:mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {data.items.map((item) => (
              <ProjectCard key={item.id} item={item} aspect="aspect-[4/4.5]" href={data.button_link} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* Homepage Mosaic: Asymmetrical 3-Column Layout */
  const homepageItems = data.items.slice(0, data.homepage_count || 4);

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10 xl:py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-7 xl:gap-8 items-stretch">
          {/* Left Column (lg:col-span-4): Top Eyebrow + Title, Bottom Description + Outline Button */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full">
            <div>
              <LineEyebrow text={data.eyebrow} className="mb-4 sm:mb-5" />
              <DisplayTitle bold={data.title_bold} light={data.title_light} />

              {/* Mobile/Tablet copy shown right below heading */}
              <p data-projects-copy data-reveal className="invisible mt-5 sm:mt-6 text-[14.5px] sm:text-[15px] leading-[1.7] text-[#646b7a] lg:hidden">
                {data.description}
              </p>
            </div>

            {/* Desktop bottom block (aligned with bottom edge of bottom cards) */}
            <div className="hidden lg:block pt-12 xl:pt-16">
              <p data-projects-copy data-reveal className="invisible max-w-[340px] text-[14.5px] sm:text-[15px] leading-[1.7] text-[#646b7a]">
                {data.description}
              </p>
              {showButton && (
                <div data-projects-copy data-reveal className="invisible mt-7 xl:mt-8">
                  <PrimaryButton href={data.button_link} text={data.button_text} variant="outline" />
                </div>
              )}
            </div>
          </div>

          {/* Right Area (lg:col-span-8): 2x2 Grid of Project Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            {homepageItems.map((item) => (
              <ProjectCard key={item.id} item={item} aspect="aspect-[4/4.3] sm:aspect-[4/4.4] lg:aspect-[4/4.4]" href={data.button_link} />
            ))}
          </div>
        </div>

        {/* Mobile/Tablet button shown below cards */}
        {showButton && (
          <div data-projects-copy data-reveal className="invisible mt-8 sm:mt-10 lg:hidden">
            <PrimaryButton href={data.button_link} text={data.button_text} variant="outline" />
          </div>
        )}
      </div>
    </section>
  );
}
