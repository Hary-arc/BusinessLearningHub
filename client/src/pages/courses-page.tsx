
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Course } from "@shared/schema";
import { CourseCard } from "@/components/course/course-card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Filter courses based on search term and category
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter dropdown
  const categories = courses ? Array.from(new Set(courses.map(course => course.category))) : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-600">
              Explore Our Courses
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
              Discover world-class courses in AI, Cloud Computing, Cybersecurity and more
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search courses by name or description..."
                  className="pl-10 bg-gray-50 border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-64">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
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
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-white rounded-lg shadow">
              <p className="text-xl text-red-500 mb-4">Failed to load courses</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredCourses?.length === 0 ? (
            <div className="text-center text-gray-500 p-8 bg-white rounded-lg shadow">
              <p className="text-xl">No courses found</p>
              <p className="mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses?.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={{
                    _id: course.id.toString(),
                    title: course.title,
                    description: course.description,
                    imageUrl: course.imageUrl,
                    instructorId: {
                      _id: course.facultyId.toString(),
                      name: "Instructor",
                      email: "instructor@example.com"
                    },
                    category: course.category,
                    price: course.price,
                    rating: course.rating || 0,
                    reviewCount: course.reviewCount || 0,
                    level: course.level || "Beginner",
                    duration: course.duration || 0,
                    isPublished: course.published || false,
                    currency: "USD"
                  }} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
