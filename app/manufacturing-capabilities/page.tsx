import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/sections/Header/page';
import Breadcrumb from '../../components/sections/Breadcrumb/page';
import ManufacturingCapabilities from '../../components/sections/ManufacturingCapabilities/page';
import Footer from '../../components/sections/Footer/page';
import BackToTop from '../../components/ui/BackToTop';
import { common, pages, sections, type PageComponent } from '../../components/types';

const pageData = pages.manufacturing_capabilities || pages.capabilities;

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
};

export default function ManufacturingCapabilitiesPage() {
  const sectionMap: Record<string, React.ReactNode> = {
    Breadcrumb: <Breadcrumb data={sections.breadcrumb} currentPage={pageData.pageName} />,
    ManufacturingCapabilities: (
      <ManufacturingCapabilities data={sections.manufacturing_capabilities || sections.projects} />
    ),
    Projects: (
      <ManufacturingCapabilities data={sections.manufacturing_capabilities || sections.projects} />
    ),
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header data={common.Header} />
      <main className="w-full flex-1">
        {pageData.components.map((block: PageComponent) => (
          <React.Fragment key={block.key}>{sectionMap[block.component] ?? null}</React.Fragment>
        ))}
      </main>
      <Footer data={common.Footer} />
      <BackToTop data={common.BackToTop} />
    </div>
  );
}
