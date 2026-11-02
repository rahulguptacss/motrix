import React from 'react';
import type { Metadata } from 'next';
import Header from '../../components/sections/Header/page';
import Breadcrumb from '../../components/sections/Breadcrumb/page';
import ProductsSolutions from '../../components/sections/ProductsSolutions/page';
import Footer from '../../components/sections/Footer/page';
import BackToTop from '../../components/ui/BackToTop';
import { common, pages, sections, type PageComponent } from '../../components/types';

const pageData = pages.products_solutions || pages.solutions || {
  title: 'Products & Solutions | Motrix',
  pageName: 'Products & Solutions',
  metadata: {
    title: 'Products & Solutions | Motrix Automotive Engineering',
    description: 'Powertrain components, chassis and safety solutions, precision engineered parts and EV systems built by Motrix.',
  },
  components: [
    { key: 'BreadcrumbSection', component: 'Breadcrumb' },
    { key: 'ProductsSolutionsSection', component: 'ProductsSolutions' },
  ],
};

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
};

export default function ProductsSolutionsPage() {
  const sectionMap: Record<string, React.ReactNode> = {
    Breadcrumb: <Breadcrumb data={sections.breadcrumb} currentPage={pageData.pageName} />,
    ProductsSolutions: (
      <ProductsSolutions
        data={sections.products_solutions || sections.solutions}
        variant="grid"
      />
    ),
    Solutions: (
      <ProductsSolutions
        data={sections.products_solutions || sections.solutions}
        variant="grid"
      />
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

