
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SubscriptionPlans } from "@/components/home/subscription-plans";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-12 bg-gradient-to-br from-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Flexible Plans for Your Learning Journey
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Choose the plan that works best for your goals and budget
            </p>
          </div>
        </div>
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  );
}
