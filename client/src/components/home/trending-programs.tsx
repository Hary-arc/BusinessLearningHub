import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { TrendingCard } from "@/components/home/trending-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function TrendingPrograms() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    };
    const interval = setInterval(scroll, 25);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="courses" className="relative py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-1 items-center relative z-10">
        {/* Left Frame - Static Heading */}
        <motion.div
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-10 text-left h-full flex flex-col justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            Career skills that work
          </h2>
          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 w-fit">
            Start 7-day Free Trial
          </Button>
        </motion.div>

        {/* Right Frame - Scrolling Cards */}
        <div className="relative w-full h-80 overflow-hidden rounded-lg">
          <div
            ref={scrollRef}
            className="overflow-x-auto whitespace-nowrap pointer-events-none h-full scrollbar-hide"
          >
            <div className="inline-flex space-x-6 h-full items-center">
              {(isLoading ? Array(6).fill(null) : courses?.slice(0, 6) || []).map(
                (course, index) => (
                  <motion.div
                    key={course?._id || `skeleton-${index}`}
                    className="w-56 inline-block opacity-90 hover:opacity-90 pointer-events-none"
                  >
                    {course ? (
                      <TrendingCard course={course} />
                    ) : (
                      <>
                        <Skeleton className="h-48 w-full" />
                        <div className="p-6">
                          <Skeleton className="h-6 w-32 mb-2" />
                          <Skeleton className="h-6 w-48 mb-4" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </>
                    )}
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
