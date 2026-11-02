'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type {
  BlogDetailLabels,
  BlogDetailProps,
  BlogDetailSectionData,
  RecentPostItem,
} from '../../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BlogDetail({
  data,
  labels,
  recentPosts,
}: BlogDetailProps) {
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
        });

        // 1. Eyebrow, Title & Meta Line
        tl.fromTo(
          q('[data-blog-eyebrow]'),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.7 }
        )
          .fromTo(
            q('[data-blog-title]'),
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            0.15
          )
          .fromTo(
            q('[data-blog-meta]'),
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            0.3
          )
          .fromTo(
            q('[data-blog-hero]'),
            { autoAlpha: 0, y: 25, scale: 0.98 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 },
            0.35
          )
          .fromTo(
            q('[data-blog-intro]'),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            0.5
          );

        // 2. Sections Reveal on Scroll
        const sections = q('[data-blog-section]');
        if (sections.length > 0) {
          sections.forEach((sec) => {
            gsap.fromTo(
              sec,
              { autoAlpha: 0, y: 26 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: sec,
                  start: 'top 86%',
                  once: true,
                },
              }
            );
          });
        }

        // 3. Sidebar Reveal
        gsap.fromTo(
          q('[data-blog-sidebar]'),
          { autoAlpha: 0, x: 24 },
          { autoAlpha: 1, x: 0, duration: 0.85, ease: 'power3.out', delay: 0.25 }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative w-full bg-white py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-14 items-start">
          {/* ========================================================
              LEFT COLUMN: Article Body (8 cols)
             ======================================================== */}
          <article className="lg:col-span-8 flex flex-col min-w-0">
            {/* 1. Category Eyebrow with Orange Accent Line */}
            <div data-blog-eyebrow className="flex items-center gap-2.5">
              <span className="h-[2px] w-6 bg-primary shrink-0" />
              <span className="font-heading text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.16em] text-primary">
                {data.category}
              </span>
            </div>

            {/* 2. Two-Tone Heading */}
            <h1
              data-blog-title
              className="font-heading text-[28px] xs:text-[34px] sm:text-[38px] lg:text-[42px] font-bold tracking-tight leading-[1.16] mt-3 sm:mt-4 text-[#0f172a]"
            >
              {data.title_black || data.title}{' '}
              {data.title_orange && (
                <span className="text-primary block sm:inline">{data.title_orange}</span>
              )}
            </h1>

            {/* 3. Meta Line: Date | Author | Read Time */}
            <div
              data-blog-meta
              className="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-[13px] sm:text-[14px] text-[#555d6e] font-medium"
            >
              <span>{data.date}</span>
              <span className="text-slate-300">|</span>
              <span>{data.author.startsWith('By ') ? data.author : `By ${data.author}`}</span>
              <span className="text-slate-300">|</span>
              <span>{data.read_time}</span>
            </div>

            {/* 4. Full-Width Hero Image */}
            <div
              data-blog-hero
              className="mt-6 sm:mt-8 relative aspect-[16/9.5] w-full overflow-hidden rounded-[4px] bg-[#0f172a] shadow-xs"
            >
              <Image
                src={data.hero_image}
                alt={data.hero_alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 820px"
                className="object-cover"
              />
            </div>

            {/* 5. Intro Paragraph */}
            <p
              data-blog-intro
              className="mt-6 sm:mt-8 text-[14.5px] sm:text-[15.5px] leading-[1.75] text-[#555d6e]"
            >
              {Array.isArray(data.intro) ? data.intro.join(' ') : data.intro}
            </p>

            {/* 6. Dynamic Content Sections with Two-Tone Headings & Images */}
            <div className="mt-8 sm:mt-10 flex flex-col gap-8 sm:gap-10">
              {data.sections.map((section, idx) => (
                <div key={idx} data-blog-section className="flex flex-col">
                  {/* Two-Tone Subheading + Orange Accent Line */}
                  <div>
                    <h2 className="font-heading text-[20px] sm:text-[23px] lg:text-[25px] font-bold tracking-tight text-[#0f172a] leading-snug">
                      {section.title_black || section.title}{' '}
                      {section.title_orange && (
                        <span className="text-primary">{section.title_orange}</span>
                      )}
                    </h2>
                    <span className="mt-2 block h-[2.5px] w-9 bg-primary" />
                  </div>

                  {/* Paragraph Body */}
                  <p className="mt-3.5 sm:mt-4 text-[14.5px] sm:text-[15.5px] leading-[1.75] text-[#555d6e]">
                    {section.paragraph}
                  </p>

                  {/* Full-Width Section Image */}
                  {section.image && (
                    <div className="mt-5 sm:mt-6 relative aspect-[16/9] w-full overflow-hidden rounded-[4px] bg-[#0f172a] shadow-xs">
                      <Image
                        src={section.image}
                        alt={section.image_alt || section.title_black || 'Section illustration'}
                        fill
                        sizes="(max-width: 1024px) 100vw, 820px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* ========================================================
              RIGHT COLUMN: Recent Posts Sidebar (4 cols)
              Aligned with the top of the article header & sticky on desktop
             ======================================================== */}
          <aside className="lg:col-span-4 w-full self-start lg:sticky lg:top-24 xl:top-28">
            <div
              data-blog-sidebar
              className="bg-[#f8fafd] rounded-[8px] p-5 sm:p-6 lg:p-7 border border-[#e8edf4] shadow-[0_2px_16px_rgba(0,0,0,0.02)]"
            >
              {/* Header with Orange Accent Bar */}
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <span className="h-[18px] w-[3.5px] bg-primary rounded-full shrink-0" />
                <h3 className="font-heading text-[16px] sm:text-[17.5px] font-bold text-[#0f172a] leading-none tracking-tight">
                  {labels.recent_posts_title || 'Recent Posts'}
                </h3>
              </div>

              {/* List of Recent Posts */}
              <div className="flex flex-col gap-5 sm:gap-5.5">
                {recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex items-start gap-3.5 transition-colors"
                  >
                    {/* Thumbnail Image */}
                    <div className="relative w-[70px] h-[70px] sm:w-[74px] sm:h-[74px] shrink-0 overflow-hidden rounded-[4px] bg-[#0f172a]">
                      <Image
                        src={post.image}
                        alt={post.alt}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Title & Date */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-[13px] sm:text-[14px] leading-snug text-[#0f172a] transition-colors duration-200 group-hover:text-primary line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] sm:text-[12px] text-[#64748b]">
                        <Calendar className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
