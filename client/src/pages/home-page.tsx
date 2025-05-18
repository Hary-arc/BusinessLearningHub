import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { CompanyLogos } from "@/components/home/company-logos";
import { CareerSkills } from "@/components/home/career-skills";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { SubscriptionPlans } from "@/components/home/subscription-plans";
import { Testimonials } from "@/components/home/testimonials";
import { UserTypes } from "@/components/home/user-types";
import { CTASection } from "@/components/home/cta-section";
import { FAQSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <CompanyLogos />
        <CareerSkills />
        <FeaturedCourses />
        <SubscriptionPlans />
        <Testimonials />
        <UserTypes />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
