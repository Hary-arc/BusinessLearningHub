
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export function TrendingPrograms() {
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="courses" className="relative py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 items-center relative z-10">
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

        {/* Right Frame - Custom Scrolling Cards */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {isLoading ? 
              Array(3).fill(null).map((_, i) => (
                <Card key={`skeleton-${i}`} className="min-w-[300px] snap-center shrink-0">
                  <Skeleton className="h-40 rounded-t-lg" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))
              : courses?.map((course) => (
                <Link key={course._id} href={`/courses/${course._id}`}>
                  <Card className="min-w-[300px] snap-center shrink-0 cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="relative h-40">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-white/90">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
