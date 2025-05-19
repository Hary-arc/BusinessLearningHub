
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Link } from "wouter";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FeaturedCourses() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section id="courses" className="py-16 bg-gradient-to-b from-white to-green-50" aria-label="Featured Courses">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header 
          className="text-center"
          role="banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Career Skills That Work
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            Master the skills you need to advance your career with expert-led courses
          </p>
          <div className="mt-6">
            <Link href="/courses">
              <Button variant="outline" className="bg-white hover:bg-gray-50">
                Start 7-day Free Trial
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, staggerChildren: 0.1 }}
        >
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <motion.div 
                key={`skeleton-${i}`} 
                className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full mt-2" />
                  <Skeleton className="h-24 w-full mt-3" />
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : error ? (
            <div className="col-span-4 text-center text-red-500">
              Failed to load courses. Please try again later.
            </div>
          ) : courses?.length ? (
            courses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
              No courses available at the moment.
            </div>
          )}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Start your Journey Today for a Better Tomorrow
          </h3>
          <p className="max-w-3xl mx-auto text-gray-600 mb-8">
            Embark on your path to a brighter future. Start your journey today, shaping a better tomorrow with endless possibilities.
          </p>
          <Link href="/courses">
            <Button className="px-8 py-3 text-base shadow-md flex items-center gap-2 bg-primary hover:bg-primary/90">
              View All Courses <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
