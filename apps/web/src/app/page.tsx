import { Loader } from '@/components/loader/Loader';
import { Nav } from '@/components/layout/Nav';
import { Hero } from '@/components/hero/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { Trust } from '@/components/sections/Trust';
import { Services } from '@/components/sections/Services';
import { Work } from '@/components/sections/Work';
import { Process } from '@/components/sections/Process';
import { Healthcare } from '@/components/sections/Healthcare';
import { Receptionist } from '@/components/sections/Receptionist';
import { Stack } from '@/components/sections/Stack';
import { Labs } from '@/components/sections/Labs';
import { About } from '@/components/sections/About';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { PageGlow } from '@/components/sections/PageGlow';
import { Footer } from '@/components/layout/Footer';
import { CompanionLauncher } from '@/components/companion/CompanionLauncher';

export default function HomePage() {
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero />
        {/* everything below the hero shares one ambient brown/green glow field */}
        <div className="relative isolate">
          <PageGlow />
          <Marquee />
          <Trust />
          <Services />
          <Work />
          <Process />
          <Healthcare />
          <Receptionist />
          <Stack />
          <Labs />
          <About />
          <FinalCTA />
          <Footer />
        </div>
      </main>
      <CompanionLauncher />
    </>
  );
}
