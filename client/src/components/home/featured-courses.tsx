import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Link } from "wouter";
import { CourseCard } from "@/components/course/course-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedCourses() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section id="courses" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Courses
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Practical skills for real-world business success
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-white h-full">
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
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              Failed to load courses. Please try again later.
            </div>
          ) : courses?.length ? (
            courses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No courses available at the moment.
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/courses">
            <Button className="px-6 py-3 shadow-sm">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
