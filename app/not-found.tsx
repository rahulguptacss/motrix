import type { Metadata } from 'next';
import Header from '../components/sections/Header/page';
import Footer from '../components/sections/Footer/page';
import PrimaryButton from '../components/ui/PrimaryButton';
import { common, pages } from '../components/types';

const notFoundData = pages.not_found;

export const metadata: Metadata = {
  title: `${notFoundData.code} - ${notFoundData.title}`,
  description: notFoundData.description,
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Header data={common.Header} />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px]" aria-hidden="true" />
        <section className="relative z-10 flex max-w-xl flex-col items-center text-center">
          <p className="font-heading text-[120px] sm:text-[180px] font-extrabold leading-none tracking-tight text-primary select-none" aria-hidden="true">
            {notFoundData.code}
          </p>
          <span className="mt-2 bg-ink px-4 py-1.5 font-heading text-xs font-bold uppercase tracking-[0.2em] text-white">{notFoundData.badge}</span>
          <h1 className="mt-5 font-heading text-3xl sm:text-4xl font-extrabold uppercase text-ink">{notFoundData.title}</h1>
          <p className="mt-3 text-[15px] text-muted">{notFoundData.description}</p>
          <PrimaryButton href={notFoundData.back_home.href} text={notFoundData.back_home.text} className="mt-8" />
        </section>
      </main>
      <Footer data={common.Footer} />
    </div>
  );
}

