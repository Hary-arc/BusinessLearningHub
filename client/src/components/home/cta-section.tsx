import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-12 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to grow your business skills?</span>
              <span className="block">Start your learning journey today!</span>
            </h2>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link href="/auth">
                  <Button variant="secondary" className="text-primary px-5 py-3 text-base font-medium shadow-sm">
                    Sign up for free
                  </Button>
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link href="/courses">
                  <Button 
                    variant="outline" 
                    className="px-5 py-3 text-base font-medium border-white text-white bg-transparent hover:bg-primary-600 hover:bg-opacity-60"
                  >
                    Browse courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
