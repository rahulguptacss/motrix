'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { BreadcrumbData, BreadcrumbItem, BreadcrumbProps } from '../../types';

const ease = [0.22, 1, 0.36, 1] as const;

/** Centered inner-page banner matching Motrix design screenshot */
export default function Breadcrumb({ data, currentPage, items }: BreadcrumbProps) {
  const trail: BreadcrumbItem[] = items ?? [...data.items, { name: currentPage, href: '' }];

  return (
    <section className="relative w-full h-[230px] sm:h-[320px] lg:h-[380px] overflow-hidden bg-dark">
      <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease }} className="absolute inset-0">
        <Image src={data.background_image} alt={data.background_alt} fill priority quality={90} sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-7xl mx-auto flex h-full flex-col justify-center items-center text-center px-4 sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="font-heading text-[24px] xs:text-[28px] sm:text-[40px] lg:text-[50px] font-black leading-tight text-white capitalize tracking-tight"
        >
          {currentPage}
        </motion.h1>

        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          className="mt-2.5 sm:mt-4 inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 font-heading text-[12px] sm:text-[14px] font-medium text-white/80"
        >
          {trail.map((item, idx) => {
            const last = idx === trail.length - 1;
            return (
              <span key={`${item.name}-${idx}`} className="inline-flex items-center gap-2.5">
                {idx > 0 && <span className="text-white/40">/</span>}
                {last || !item.href ? (
                  <span className="text-white" aria-current={last ? 'page' : undefined}>
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="transition-colors hover:text-primary text-white/80">
                    {item.name}
                  </Link>
                )}
              </span>
            );
          })}
        </motion.nav>
      </div>
    </section>
  );
}
