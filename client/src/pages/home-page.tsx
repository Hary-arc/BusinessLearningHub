import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { SubscriptionPlans } from "@/components/home/subscription-plans";
import { Testimonials } from "@/components/home/testimonials";
import { UserTypes } from "@/components/home/user-types";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturedCourses />
        <SubscriptionPlans />
        <Testimonials />
        <UserTypes />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
