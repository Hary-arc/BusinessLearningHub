
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Link } from "wouter";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function TrendingPrograms() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Career skills that work
          </h2>
          <Button variant="outline" className="bg-white hover:bg-gray-50">
            Start 7-day Free Trial
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <motion.div 
                key={`skeleton-${i}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </motion.div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              Failed to load courses. Please try again later.
            </div>
          ) : courses?.length ? (
            courses.slice(0, 3).map((course, index) => (
              <motion.div
                key={course._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src={course.instructorId.avatarUrl || '/default-institution.png'} 
                      alt={course.instructorId.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600">{course.instructorId.name}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {course.level || 'Beginner'} · {course.category}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No courses available at the moment.
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="inline-flex items-center gap-2">
            Show 8 more <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
