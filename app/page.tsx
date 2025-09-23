import { CTA } from "@/components/CTA";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { Services } from "@/components/Services";
import { SocialProof } from "@/components/SocialProof";
import { WhyUs } from "@/components/WhyUs";
import reviews from "@/data/reviews.json";

export default function HomePage() {
  return (
    <>
      <Hero />
      <main className="bg-fix-white">
        <Services />
        <SocialProof />
        <ReviewCarousel reviews={reviews} />
        <WhyUs />
        <FAQ />
        <CTA />
      </main>
    </>
  );
}
