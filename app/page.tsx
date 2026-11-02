import React from 'react';
import type { Metadata } from 'next';
import Header from '../components/sections/Header/page';
import Hero from '../components/sections/Hero/page';
import About from '../components/sections/About/page';
import Projects from '../components/sections/Projects/page';
import ProductsSolutions from '../components/sections/ProductsSolutions/page';
import Blog from '../components/sections/Blog/page';
import Footer from '../components/sections/Footer/page';
import BackToTop from '../components/ui/BackToTop';
import { common, pages, sections, type PageComponent } from '../components/types';

const pageData = pages.home;

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
};

export default function Home() {
  const sectionMap: Record<string, React.ReactNode> = {
    Hero: <Hero data={sections.hero} />,
    About: <About data={sections.about} />,
    Projects: <Projects data={sections.projects} variant="mosaic" />,
    ManufacturingCapabilities: <Projects data={sections.projects} variant="mosaic" />,
    ProductsSolutions: <ProductsSolutions data={sections.products_solutions || sections.solutions} variant="split" />,
    Solutions: <ProductsSolutions data={sections.products_solutions || sections.solutions} variant="split" />,
    Blog: <Blog data={sections.blog} variant="featured" />,
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
