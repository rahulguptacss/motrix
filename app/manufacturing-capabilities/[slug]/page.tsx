import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../../../components/sections/Header/page';
import Breadcrumb from '../../../components/sections/Breadcrumb/page';
import ManufacturingCapabilitiesDetail from '../../../components/sections/ManufacturingCapabilitiesDetail/page';
import Footer from '../../../components/sections/Footer/page';
import BackToTop from '../../../components/ui/BackToTop';
import { common, pages, sections, type PageComponent, type SlugParams } from '../../../components/types';

type Params = SlugParams;

const pageData = pages.manufacturing_capabilities_detail || {
  title: 'Manufacturing & Capabilities Detail | Motrix',
  pageName: 'Manufacturing & Capabilities Detail',
  metadata: {
    title: 'Manufacturing & Capabilities Detail | Motrix Automotive Engineering',
    description: 'In-depth overview of Motrix manufacturing processes, precision engineering, quality assurance and production capabilities.',
  },
  components: [
    { key: 'BreadcrumbSection', component: 'Breadcrumb' },
    { key: 'ManufacturingCapabilitiesDetailSection', component: 'ManufacturingCapabilitiesDetail' },
  ],
};

const capConfig = sections.manufacturing_capabilities_detail || {
  sidebar_title: 'Manufacturing Capabilities',
  capabilities_list: [
    { name: 'Advanced Manufacturing', slug: 'advanced-manufacturing' },
    { name: 'Precision Engineering', slug: 'precision-engineering' },
    { name: 'Quality Assurance', slug: 'quality-assurance' },
    { name: 'Scalable Production', slug: 'scalable-production' },
    { name: 'Advanced Automation', slug: 'advanced-automation' },
    { name: 'End-to-End Capabilities', slug: 'end-to-end-capabilities' },
  ],
  items: {},
};
const capItemsMap = capConfig.items || sections.manufacturing_capabilities_details || {};

export function generateStaticParams() {
  return Object.keys(capItemsMap).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = capItemsMap[slug];
  if (!detail) {
    return {
      title: pageData.metadata.title,
      description: pageData.metadata.description,
    };
  }
  return {
    title: `${detail.title_black} ${detail.title_orange} | ${common.Header.logo_text}`,
    description: detail.intro || pageData.metadata.description,
  };
}

async function CapabilityDetailContent({ params }: { params: Params }) {
  const { slug } = await params;
  const detail = capItemsMap[slug];
  if (!detail) notFound();

  const labels = capConfig;

  const sectionMap: Record<string, React.ReactNode> = {
    Breadcrumb: (
      <Breadcrumb
        data={sections.breadcrumb}
        currentPage={pageData.pageName}
        items={[
          ...sections.breadcrumb.items,
          { name: pages.manufacturing_capabilities.pageName, href: '/manufacturing-capabilities' },
          { name: `${detail.title_black} ${detail.title_orange}`, href: '' },
        ]}
      />
    ),
    ManufacturingCapabilitiesDetail: (
      <ManufacturingCapabilitiesDetail
        data={detail}
        labels={labels}
        currentSlug={slug}
      />
    ),
  };

  return (
    <>
      {pageData.components.map((block: PageComponent) => (
        <React.Fragment key={block.key}>{sectionMap[block.component] ?? null}</React.Fragment>
      ))}
    </>
  );
}

function DetailFallback() {
  return (
    <div className="animate-pulse py-16">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="aspect-[16/8.8] w-full bg-slate-100 rounded mb-6" />
          <div className="h-10 w-2/3 bg-slate-100 rounded mb-4" />
          <div className="h-4 w-full bg-slate-100 rounded mb-2" />
          <div className="h-4 w-4/5 bg-slate-100 rounded" />
        </div>
        <div className="lg:col-span-4 h-96 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

export default function ManufacturingCapabilityDetailPage({ params }: { params: Params }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header data={common.Header} />
      <main className="w-full flex-1">
        <Suspense fallback={<DetailFallback />}>
          <CapabilityDetailContent params={params} />
        </Suspense>
      </main>
      <Footer data={common.Footer} />
      <BackToTop data={common.BackToTop} />
    </div>
  );
}

