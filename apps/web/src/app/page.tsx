import { Loader } from '@/components/loader/Loader';
import { SideNav } from '@/components/layout/SideNav';
import { FloatingCTA } from '@/components/layout/FloatingCTA';
import { Hero } from '@/components/hero/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { Domains } from '@/components/sections/Domains';
import { CinemaBand } from '@/components/sections/CinemaBand';
import { FeaturedWork } from '@/components/sections/FeaturedWork';
import { Statement } from '@/components/sections/Statement';
import { Projects } from '@/components/sections/Projects';
import { NonDemoReel } from '@/components/sections/NonDemoReel';
import { About } from '@/components/sections/About';
import { Stack } from '@/components/sections/Stack';
import { Contact } from '@/components/sections/Contact';
import { PageGlow } from '@/components/sections/PageGlow';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Loader />
      <SideNav />
      <FloatingCTA />
      <main>
        <Hero />
        <div className="relative isolate">
          <PageGlow />
          <Marquee />
          <Domains />
          <CinemaBand word="WORK" eyebrow="Selected" />
          <FeaturedWork />
          <Statement />
          <Projects />
          <NonDemoReel />
          <About />
          <Stack />
          <CinemaBand
            word="LET'S TALK"
            eyebrow="Your move"
            height="60vh"
            video="/media/fashion.mp4"
          />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
