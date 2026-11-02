import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/sections/Header/page';
import Breadcrumb from '../../components/sections/Breadcrumb/page';
import EnquireNow from '../../components/sections/EnquireNow/page';
import Footer from '../../components/sections/Footer/page';
import BackToTop from '../../components/ui/BackToTop';
import { common, pages, sections, type PageComponent } from '../../components/types';

const pageData = pages.enquire_now;

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
};

export default function EnquireNowPage() {
  const sectionMap: Record<string, React.ReactNode> = {
    Breadcrumb: <Breadcrumb data={sections.breadcrumb} currentPage={pageData.pageName} />,
    EnquireNow: <EnquireNow data={sections.enquire_now} />,
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

