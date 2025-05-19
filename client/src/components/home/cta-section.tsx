import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-16 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-none">
              <span className="inline-block bg-gradient-to-r from-primary to-teal-500 text-transparent bg-clip-text p-[0.15em] mt-0.1">
                Ready to grow your business skills?
              </span>
              <span className="inline-block bg-gradient-to-r from-primary to-teal-500 text-transparent bg-clip-text p-[0.15em] block mt-0.11">
                Start your learning journey today!
              </span>
            </h2>
            <div className="mt-8 flex justify-center flex-wrap gap-4 mb-4">
              <Link href="/auth" aria-label="Sign up for free">
                <Button 
                  variant="secondary"
                  className="text-primary bg-white px-5 py-3 text-base font-bold shadow-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Sign up for free
                </Button>
              </Link>
              <Link href="/courses" aria-label="Browse available courses">
                <Button 
                  variant="outline" 
                  className="px-5 py-3 text-base font-bold shadow-lg border border-teal-400 text-teal-600 bg-transparent hover:bg-teal-600 hover:text-white transition-colors duration-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400"
                >
                  Browse courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
