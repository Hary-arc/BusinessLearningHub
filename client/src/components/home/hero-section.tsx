import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Business education</span>
              <span className="block text-primary">for local entrepreneurs</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              Flexible, accessible courses designed to help local business owners and students succeed in today's competitive market.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/courses">
                <Button className="w-full sm:w-auto text-base md:text-lg px-8 py-3 md:py-4 md:px-10">
                  Browse Courses
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 py-3 md:py-4 md:px-10 text-primary border-primary hover:bg-primary-50 hover:text-primary-dark">
                  How it works
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex justify-end">
            <img 
              className="h-auto w-full max-w-lg rounded-lg shadow-lg" 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
              alt="Students collaborating"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
