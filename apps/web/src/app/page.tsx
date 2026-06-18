import { Loader } from '@/components/loader/Loader';
import { Nav } from '@/components/layout/Nav';
import { Hero } from '@/components/hero/Hero';
import { Trust } from '@/components/sections/Trust';
import { Services } from '@/components/sections/Services';
import { Footer } from '@/components/layout/Footer';
import { CompanionLauncher } from '@/components/companion/CompanionLauncher';

export default function HomePage() {
  return (
    <>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Services />
        <Footer />
      </main>
      <CompanionLauncher />
    </>
  );
}
