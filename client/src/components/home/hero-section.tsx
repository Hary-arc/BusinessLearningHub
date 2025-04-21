import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-white to-green-50 overflow-hidden">
      <div className="relative max-w-7xl mx-auto pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Transform Your</span>
              <span className="block bg-gradient-to-r from-primary to-teal-500 text-transparent bg-clip-text">Future With CatterpiWeb</span>
            </h1>
            <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
              We offer modern training that can help you improve your abilities and open doors to exciting new possibilities. It's time to start feeding your success.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/courses">
                <Button className="w-full sm:w-auto text-base md:text-lg px-8 py-3 md:py-4 md:px-10 bg-primary hover:bg-primary/90">
                  Explore Courses
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 py-3 md:py-4 md:px-10 text-primary border-primary hover:bg-primary-50 hover:text-primary-dark">
                  Register Now
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div className="flex items-center">
                <motion.div 
                  className="p-2 rounded-full bg-green-100" 
                  whileHover={{ scale: 1.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
                <span className="ml-2 text-sm font-medium">Get Skilled</span>
              </div>
              <div className="flex items-center">
                <motion.div 
                  className="p-2 rounded-full bg-green-100" 
                  whileHover={{ scale: 1.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <span className="ml-2 text-sm font-medium">Get Experienced</span>
              </div>
              <div className="flex items-center">
                <motion.div 
                  className="p-2 rounded-full bg-green-100" 
                  whileHover={{ scale: 1.1 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </motion.div>
                <span className="ml-2 text-sm font-medium">Get Hired</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="hidden lg:flex justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img 
              className="h-auto w-full max-w-xl rounded-lg shadow-2xl" 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80" 
              alt="Students collaborating"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
