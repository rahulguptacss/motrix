'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { PurposeProps, PurposeSectionData } from '../../types';
import LineEyebrow from '../../ui/LineEyebrow';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Motrix Purpose Section (Mission & Vision):
 * - Left: "OUR PURPOSE ——" eyebrow + Two-tone bold headline [ DRIVEN BY PURPOSE. / FOCUSED ON PROGRESS. ]
 *   + Supporting paragraph + Side-by-side Mission & Vision cards
 * - Right: Portrait technical photograph of Motrix automotive engineer assembling an engine block
 * - GSAP ScrollTrigger entrance animations + image parallax
 */
export default function Purpose({ data }: PurposeProps) {
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
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        });

        tl.fromTo(q('[data-eyebrow]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 })
          .fromTo(q('[data-eyebrow-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.2)
          .fromTo(q('[data-purpose-title]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.2)
          .fromTo(q('[data-purpose-copy]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
          .fromTo(
            q('[data-purpose-card]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 },
            0.45
          )
          .fromTo(
            q('[data-purpose-img-wrap]'),
            { autoAlpha: 0, scale: 0.96, y: 30 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.95 },
            0.3
          );

        /* Image Parallax */
        const img = q('[data-purpose-img]')[0];
        const wrap = q('[data-purpose-img-wrap]')[0];
        if (img && wrap) {
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
              },
            }
          );
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column (lg:col-span-7): Headline + Copy + 01/02 Cards */}
          <div className="lg:col-span-7">
            <LineEyebrow text={data.eyebrow} className="mb-4 sm:mb-5" />

            {/* Signature Two-Tone Headline */}
            <h2
              data-purpose-title
              data-reveal
              className="invisible font-heading uppercase text-[32px] min-[400px]:text-[38px] sm:text-[46px] lg:text-[52px] font-black leading-[0.98] tracking-[-0.025em]"
            >
              <span className="block text-ink">{data.title_black_1}</span>
              <span className="block text-ink">{data.title_black_2}</span>
              <span className="block text-primary">{data.title_orange_1}</span>
              <span className="block text-primary">{data.title_orange_2}</span>
            </h2>

            {/* Paragraph */}
            <p
              data-purpose-copy
              data-reveal
              className="invisible mt-5 sm:mt-6 text-[14.5px] sm:text-[15px] leading-[1.65] text-[#646b7a] max-w-xl"
            >
              {data.description}
            </p>

            {/* 01. Our Mission & 02. Our Vision Cards */}
            <div className="mt-8 sm:mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {data.items.map((item) => (
                <div
                  key={item.id}
                  data-purpose-card
                  data-reveal
                  className="invisible border border-[#e5e7eb] bg-white p-5 sm:p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_12px_28px_-14px_rgba(0,0,0,0.1)] rounded-none sm:rounded-[2px]"
                >
                  <h3 className="font-heading text-[15px] sm:text-[16px] font-black leading-tight flex items-baseline gap-2">
                    <span className="font-bold text-primary text-[16px] sm:text-[17px]">{item.number}</span>
                    <span className="font-black text-ink uppercase tracking-tight">{item.title}</span>
                  </h3>
                  <p className="mt-2.5 text-[13px] sm:text-[13.5px] leading-[1.6] text-[#646b7a]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (lg:col-span-5): Engineer Photo */}
          <div className="lg:col-span-5">
            <div
              data-purpose-img-wrap
              data-reveal
              className="invisible relative aspect-[4/4.8] sm:aspect-[4/4.5] lg:aspect-[4/4.8] w-full overflow-hidden bg-dark rounded-none sm:rounded-[2px] shadow-[0_16px_36px_-18px_rgba(0,0,0,0.25)]"
            >
              <Image
                data-purpose-img
                src={data.image}
                alt={data.image_alt}
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

