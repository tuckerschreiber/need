import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Features } from "@/components/features";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";
import { FadeIn } from "@/components/fade-in";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FadeIn>
          <HowItWorks />
        </FadeIn>
        <FadeIn>
          <Features />
        </FadeIn>
        <FadeIn>
          <Cta />
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
