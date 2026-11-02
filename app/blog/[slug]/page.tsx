import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../../../components/sections/Header/page';
import Breadcrumb from '../../../components/sections/Breadcrumb/page';
import BlogDetail from '../../../components/sections/BlogDetail/page';
import Footer from '../../../components/sections/Footer/page';
import BackToTop from '../../../components/ui/BackToTop';
import { common, pages, sections, type PageComponent, type SlugParams } from '../../../components/types';

type Params = SlugParams;

const pageData = pages.blog_detail;

const blogDetailConfig = sections.blog_detail;
const blogPostsMap = blogDetailConfig?.posts || sections.blog_details || {};

export function generateStaticParams() {
  return sections.blog.posts.filter((post) => blogPostsMap[post.slug]).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = blogPostsMap[slug];
  if (!detail) return { title: pageData.metadata.title, description: pageData.metadata.description };
  return {
    title: `${detail.title} | ${common.Header.logo_text}`,
    description: detail.intro[0] ?? pageData.metadata.description,
  };
}

/** Reads the dynamic slug inside a Suspense boundary (required for instant navigation with Cache Components) */
async function BlogDetailContent({ params }: { params: Params }) {
  const { slug } = await params;
  const detail = blogPostsMap[slug];
  if (!detail) notFound();

  // Latest 4 posts for the "Recent Posts" sidebar (always 4 distinct posts)
  const otherPosts = sections.blog.posts.filter((post) => post.slug !== slug);
  const recentPosts = (otherPosts.length >= 4 ? otherPosts : sections.blog.posts)
    .slice(0, 4)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      image: post.image,
      alt: post.alt,
      date: post.date,
    }));

  const sectionMap: Record<string, React.ReactNode> = {
    Breadcrumb: (
      <Breadcrumb
        data={sections.breadcrumb}
        currentPage={pageData.pageName}
        items={[...sections.breadcrumb.items, { name: pageData.pageName, href: '' }]}
      />
    ),
    BlogDetail: <BlogDetail data={detail} labels={sections.blog_detail} recentPosts={recentPosts} />,
  };

  return (
    <>
      {pageData.components.map((block: PageComponent) => (
        <React.Fragment key={block.key}>{sectionMap[block.component] ?? null}</React.Fragment>
      ))}
    </>
  );
}

function BlogDetailFallback() {
  return (
    <div className="animate-pulse">
      <div className="h-[230px] sm:h-[320px] lg:h-[400px] w-full bg-soft" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="h-10 w-3/4 bg-soft mb-6" />
          <div className="aspect-[16/8] w-full bg-soft mb-6" />
          <div className="h-4 w-full bg-soft mb-2" />
          <div className="h-4 w-5/6 bg-soft" />
        </div>
        <div className="h-80 bg-soft" />
      </div>
    </div>
  );
}

export default function BlogDetailPage({ params }: { params: Params }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header data={common.Header} />
      <main className="w-full flex-1">
        <Suspense fallback={<BlogDetailFallback />}>
          <BlogDetailContent params={params} />
        </Suspense>
      </main>
      <Footer data={common.Footer} />
      <BackToTop data={common.BackToTop} />
    </div>
  );
}

