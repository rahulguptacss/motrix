'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { BlogPostItem, BlogProps, BlogSectionData } from '../../types';
import Pagination from '../../ui/Pagination/page';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function parseDateBadge(dateStr?: string) {
  if (!dateStr) return { day: '28', monthYear: 'OCT 2026' };
  const clean = dateStr.replace(/,/g, '').trim();
  const parts = clean.split(/\s+/);

  // Format: "28 October 2026" or "24 March 2024"
  if (parts.length >= 3 && !isNaN(Number(parts[0]))) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].slice(0, 3).toUpperCase();
    const year = parts[2];
    return { day, monthYear: `${month} ${year}` };
  }

  // Format: "October 28 2026" or "March 12 2026"
  if (parts.length >= 3 && !isNaN(Number(parts[1]))) {
    const day = parts[1].padStart(2, '0');
    const month = parts[0].slice(0, 3).toUpperCase();
    const year = parts[2];
    return { day, monthYear: `${month} ${year}` };
  }

  // Format: "28 Oct"
  if (parts.length === 2 && !isNaN(Number(parts[0]))) {
    return { day: parts[0].padStart(2, '0'), monthYear: `${parts[1].slice(0, 3).toUpperCase()} 2026` };
  }

  return { day: '28', monthYear: 'OCT 2026' };
}

/**
 * Motrix Blog Section:
 * - Centered "OUR BLOG ——" eyebrow + "Latest Insights & Updates" (bold & light contrast)
 * - Left: Large featured post with date, title, excerpt and signature two-tone split [ Read More | → ] CTA
 * - Right: 3 stacked horizontal posts with crisp dividers
 * - GSAP ScrollTrigger entry animations + hover interactions
 */
export default function Blog({ data, variant = 'featured' }: BlogProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [page, setPage] = useState(1);

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
        /* ---------- 1. Header & Featured Post Reveal ---------- */
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root, start: 'top 78%', once: true },
        });

        tl.fromTo(q('[data-eyebrow]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.7 })
          .fromTo(q('[data-eyebrow-line]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, 0.2)
          .fromTo(q('[data-title]'), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.85 }, 0.25)
          .fromTo(q('[data-blog-featured]'), { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.35);

        /* ---------- 2. Side Posts Staggered Entry ---------- */
        const sideItems = q('[data-blog-side-item]');
        if (sideItems.length > 0) {
          gsap.fromTo(
            sideItems,
            { autoAlpha: 0, x: 30 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sideItems[0],
                start: 'top 85%',
                once: true,
              },
            }
          );
        }
      });
    },
    { scope: rootRef }
  );

  /* Smooth re-animation when pagination `page` changes */
  useGSAP(
    () => {
      if (variant !== 'grid') return;
      const root = rootRef.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const gridItems = q('[data-blog-grid-item]');
      if (gridItems.length > 0) {
        gsap.fromTo(
          gridItems,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
          }
        );
      }
    },
    { scope: rootRef, dependencies: [page, variant] }
  );

  /* Blog Full Page Variant (Paginated 2-Column Grid matching screenshot) */
  if (variant === 'grid') {
    const perPage = data.per_page || 4;
    const total = data.posts.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const pageStart = (page - 1) * perPage;
    const pagePosts = data.posts.slice(pageStart, pageStart + perPage);

    return (
      <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          {/* Centered Heading */}
          <div className="text-center">
            <div data-eyebrow data-reveal className="invisible flex items-center justify-center gap-4 mb-4 sm:mb-5">
              <span className="font-heading text-[10.5px] sm:text-[12px] font-semibold uppercase tracking-[0.3em] text-primary">
                {data.eyebrow}
              </span>
              <span data-eyebrow-line className="h-[1.5px] w-7 sm:w-9 shrink-0 origin-left bg-primary" />
            </div>
            <h2 data-title data-reveal className="invisible font-heading text-[32px] min-[400px]:text-[38px] sm:text-[46px] lg:text-[54px] leading-[1.05] tracking-[-0.02em] text-center">
              <span className="font-black text-ink">{data.title_regular} {data.title_highlight} </span>
              <span className="font-light text-ink">{data.title_suffix}</span>
            </h2>
            {data.description && (
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#646b7a]">
                {data.description}
              </p>
            )}
          </div>

          {/* 2-Column Grid (1 row = 2 blogs) */}
          <div className="mt-12 sm:mt-14 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {pagePosts.map((post) => {
              const dateParts = parseDateBadge(post.date);

              return (
                <article
                  key={post.id}
                  data-blog-grid-item
                  className="group flex flex-col bg-white border border-[#e5e7eb] rounded-[4px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.08)]"
                >
                  {/* Top Image + Inset Orange Date Badge */}
                  <div className="relative aspect-[16/10.5] w-full overflow-hidden bg-dark">
                    <Link href={`/blog/${post.slug}`} className="block w-full h-full relative">
                      <Image
                        src={post.image}
                        alt={post.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* Inset Orange Date Badge (Matching Screenshot) */}
                    <div className="absolute top-4 left-4 sm:top-5 sm:left-5 w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] bg-primary rounded-[3px] flex flex-col items-center justify-center text-white shadow-md z-10 pointer-events-none">
                      <span className="font-heading font-black text-[26px] sm:text-[30px] leading-none text-white tracking-tight">
                        {dateParts.day}
                      </span>
                      <span className="font-heading font-bold text-[9.5px] sm:text-[11px] tracking-[0.14em] uppercase text-white mt-1.5 leading-none">
                        {dateParts.monthYear}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-1 flex-col p-6 sm:p-7 sm:pb-8 bg-white">
                    {/* Category with horizontal line */}
                    <div className="flex items-center gap-2.5">
                      <span className="h-[2.5px] w-5 sm:w-6 bg-primary shrink-0" />
                      <span className="font-heading text-[11.5px] sm:text-[12.5px] font-bold uppercase tracking-[0.16em] text-primary">
                        {post.category}
                      </span>
                    </div>

                    {/* Post Title */}
                    <h3 className="mt-3 font-heading text-[20px] sm:text-[23px] font-black leading-[1.28] text-[#0f172a] transition-colors duration-300 group-hover:text-primary">
                      <Link href={`/blog/${post.slug}`} className="block">
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#64748b] line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Read More Link with Arrow */}
                    <div className="mt-auto pt-6">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-3 font-heading text-[13.5px] sm:text-[14px] font-bold text-[#0f172a] transition-colors duration-300 group-hover:text-primary"
                      >
                        <span>{data.read_more_text}</span>
                        <ArrowRight
                          className="w-4 h-4 text-[#0f172a] transition-all duration-300 group-hover:text-primary group-hover:translate-x-1.5"
                          strokeWidth={2.2}
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={total}
            pageStart={pageStart}
            pageCount={pagePosts.length}
            onChange={(n) => {
              setPage(n);
              if (rootRef.current) {
                const yOffset = -90;
                const y = rootRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
              }
            }}
            labels={data.pagination}
            layoutId="blog-page"
          />
        </div>
      </section>
    );
  }

  /* Homepage Featured Variant: 1 Large Left + 3 Side Posts Right */
  const [featured, ...rest] = data.posts.slice(0, data.homepage_count || 4);
  const sidePosts = rest.slice(0, 3);
  if (!featured) return null;

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-white py-6 sm:py-8 lg:py-10 xl:py-12">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Centered Eyebrow & Display Title */}
        <div className="text-center">
          <div data-eyebrow data-reveal className="invisible flex items-center justify-center gap-4 mb-3 sm:mb-4">
            <span className="font-heading text-[10.5px] sm:text-[12px] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.34em] text-primary">
              {data.eyebrow}
            </span>
            <span data-eyebrow-line className="h-[1.5px] w-7 sm:w-9 shrink-0 origin-left bg-primary" />
          </div>

          <h2 data-title data-reveal className="invisible font-heading text-[32px] min-[400px]:text-[38px] sm:text-[46px] lg:text-[54px] leading-[1.05] tracking-[-0.02em] text-center">
            <span className="font-black text-ink">{data.title_regular} {data.title_highlight} </span>
            <span className="font-light text-ink">{data.title_suffix}</span>
          </h2>
        </div>

        {/* 2-Column Content Grid */}
        <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 xl:gap-14 items-start">
          {/* Left Column (Featured Post): lg:col-span-6 */}
          <article data-blog-featured data-reveal className="invisible lg:col-span-6 group">
            <Link
              href={`/blog/${featured.slug}`}
              className="relative block aspect-[16/10] overflow-hidden bg-dark cursor-pointer rounded-none sm:rounded-[2px]"
            >
              <Image
                src={featured.image}
                alt={featured.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Link>

            <div className="mt-5 sm:mt-6">
              <p className="text-[13px] sm:text-[14px] font-normal tracking-wide text-[#8a90a0]">
                {featured.date}
              </p>

              <h3 className="mt-2.5 sm:mt-3 font-heading text-[22px] sm:text-[25px] lg:text-[27px] font-black leading-[1.2] tracking-tight text-ink transition-colors duration-300 group-hover:text-primary">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h3>

              <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15px] leading-[1.65] text-[#646b7a]">
                {featured.excerpt}
              </p>

              {/* Two-Tone Split CTA Button [ Read More | → ] */}
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-6 sm:mt-7 inline-flex items-stretch overflow-hidden rounded-[2px] transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer shadow-[0_8px_20px_-10px_rgba(242,103,34,0.6)]"
              >
                <span className="bg-primary px-6 py-3 font-heading text-[12px] sm:text-[12.5px] font-bold uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:bg-primary-dark flex items-center">
                  {data.read_more_text}
                </span>
                <span className="bg-[#111111] px-4 py-3 flex items-center justify-center text-white transition-colors duration-300 group-hover:bg-primary">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.2} />
                </span>
              </Link>
            </div>
          </article>

          {/* Right Column (3 Side Posts Stacked): lg:col-span-6 */}
          <div className="lg:col-span-6 flex flex-col divide-y divide-[#e5e7eb]">
            {sidePosts.map((post) => (
              <article
                key={post.id}
                data-blog-side-item
                data-reveal
                className="invisible group py-6 first:pt-0 last:pb-0"
              >
                <Link href={`/blog/${post.slug}`} className="flex items-start gap-4 sm:gap-5 cursor-pointer">
                  {/* Thumbnail Image */}
                  <span className="relative aspect-[4/3] w-[130px] min-[400px]:w-[150px] sm:w-[170px] lg:w-[185px] shrink-0 overflow-hidden bg-dark rounded-none sm:rounded-[2px]">
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      sizes="(max-width: 640px) 150px, 200px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </span>

                  {/* Post Info */}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] sm:text-[13px] font-normal tracking-wide text-[#8a90a0]">
                      {post.date}
                    </span>
                    <span className="mt-1 sm:mt-1.5 block font-heading text-[15.5px] sm:text-[17px] lg:text-[18px] font-black leading-snug tracking-[-0.01em] text-ink transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                    </span>
                    <span className="mt-1.5 hidden sm:block text-[13px] sm:text-[13.5px] leading-[1.55] text-[#646b7a] line-clamp-2">
                      {post.excerpt}
                    </span>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
