'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { FooterData, FooterProps } from '../../types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function SocialIcon({ icon }: { icon: string }) {
  const key = icon.toLowerCase();
  if (key === 'facebook') {
    return (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (key === 'linkedin' || key === 'linkdin') {
    return (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    );
  }
  if (key === 'instagram') {
    return (
      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  return null;
}

/**
 * Motrix Footer:
 * - Column 1: White/Orange Motrix Logo + Tagline description
 * - Column 2: "Main Menu" with orange accent line + 2-column nav links (Home, Blog, About Us, Contact Us, Products)
 * - Column 3: "Contact Us" with orange accent line + phone & email pills
 * - Vertical divider lines separating the 3 columns on desktop
 * - Bottom Bar: Copyright notice + square [ ↑ ] Back-to-Top button
 * - GSAP ScrollTrigger entry animation
 */
export default function Footer({ data }: FooterProps) {
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
          scrollTrigger: { trigger: root, start: 'top 85%', once: true },
        });

        tl.fromTo(
          q('[data-footer-item]'),
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.05 }
        ).fromTo(
          q('[data-footer-line]'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
          0.2
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <footer ref={rootRef} className="relative w-full overflow-hidden bg-[#0d0f12] text-white/70">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Main 3-Column Area with Vertical Divider Lines */}
        <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-0 items-start pt-10 sm:pt-14 pb-8 sm:pb-10">
          {/* Column 1 (Left - Brand & Description): lg:col-span-5 */}
          <div className="lg:col-span-5 lg:pr-12 xl:pr-16 lg:border-r border-white/10">
            <Link
              href="/"
              data-footer-item
              data-reveal
              aria-label={data.logo_text}
              className="invisible relative block w-[260px] sm:w-[290px] lg:w-[320px] aspect-[1514/582] transition-transform duration-300 hover:scale-[1.02]"
            >
              <Image
                src={data.logo}
                alt={data.logo_text}
                fill
                sizes="(max-width: 640px) 260px, 320px"
                priority
                className="object-contain object-left"
              />
            </Link>

            <p
              data-footer-item
              data-reveal
              className="invisible mt-6 sm:mt-7 text-[15px] sm:text-[15.5px] leading-[1.65] text-white/70 max-w-[340px]"
            >
              {data.description}
            </p>
          </div>

          {/* Column 2 (Middle - Main Menu): lg:col-span-4 */}
          <div className="lg:col-span-4 lg:px-8 xl:px-10 lg:border-r border-white/10">
            <div data-footer-item data-reveal className="invisible">
              <h4 className="font-heading text-[17px] sm:text-[18px] font-bold text-white tracking-wide">
                {data.menu_title}
              </h4>
              <span data-footer-line className="mt-2 block h-[2.5px] w-7 bg-primary origin-left" />
            </div>

            <ul className="mt-6 sm:mt-7 grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-3.5">
              {data.menu_links.map((link) => (
                <li key={link.name} data-footer-item data-reveal className="invisible">
                  <Link
                    href={link.href}
                    className="text-[14px] sm:text-[14.5px] text-white/70 transition-colors duration-200 hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 (Right - Contact Us): lg:col-span-3 */}
          <div className="lg:col-span-3 lg:pl-10 xl:pl-14">
            <div data-footer-item data-reveal className="invisible">
              <h4 className="font-heading text-[17px] sm:text-[18px] font-bold text-white tracking-wide">
                {data.contact_title}
              </h4>
              <span data-footer-line className="mt-2 block h-[2.5px] w-7 bg-primary origin-left" />
            </div>

            <ul className="mt-6 sm:mt-7 space-y-4 sm:space-y-5">
              {data.contact_items.map((item) => {
                const isPhone = item.icon === 'phone';
                const IconComponent = isPhone ? Phone : Mail;

                return (
                  <li key={item.label} data-footer-item data-reveal className="invisible">
                    <a
                      href={item.href || '#'}
                      className="group flex items-center gap-3.5 sm:gap-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1b1c21] border border-white/10 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
                        <IconComponent className="h-4 w-4" />
                      </span>
                      <span className="text-[14px] sm:text-[14.5px] font-medium text-white/85 transition-colors duration-200 group-hover:text-primary">
                        {item.text}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Full-Width Border, Copyright (Left) & Social Media Icons (Right) */}
        <div className="border-t border-white/10 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            data-footer-item
            data-reveal
            className="invisible text-[13px] sm:text-[13.5px] text-white/50 tracking-wide text-center sm:text-left"
          >
            {data.copyright}
          </p>

          {data.socials && data.socials.length > 0 && (
            <div
              data-footer-item
              data-reveal
              className="invisible flex items-center gap-2.5 sm:gap-3 sm:mr-12 md:mr-16 lg:mr-20"
            >
              {data.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.aria_label || social.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b1c21] border border-white/10 text-white/70 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:scale-105"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
