import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import { HowItWorks } from "@/components/home/how-it-works";
import {
  PopularCategories,
  TechnicianCta,
  WhyChooseUs,
} from "@/components/home/categories-trust";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <HowItWorks />
      <PopularCategories />
      <WhyChooseUs />
      <TechnicianCta />
    </>
  );
}
