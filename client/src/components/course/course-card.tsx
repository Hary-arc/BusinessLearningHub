import { Link } from "wouter";
import { Course } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // Fetch the faculty member data
  const { data: faculty, isError } = useQuery<User>({
    queryKey: [`/api/users/${course.facultyId}`],
    enabled: !!course.facultyId,
    staleTime: 1000 * 60 * 5,
    retry: 2, // 5 minutes
    // This may fail if the API doesn't exist yet, we're not handling the error case here
    queryFn: async () => {
      const res = await fetch(`/api/users/${course.facultyId}`);
      if (!res.ok) {
        // Return a mock faculty for demo purposes
        return {
          id: course.facultyId,
          fullName: course.facultyId === 1 
            ? "Robert Smith" 
            : course.facultyId === 2 
            ? "Sarah Johnson" 
            : "Michael Chen",
          userType: "faculty",
        } as User;
      }
      return res.json();
    }
  });

  // Format price from cents to dollars
  const formattedPrice = `$${(course.price / 100).toFixed(2)}`;
  
  // Calculate faculty name and role
  const facultyName = faculty?.fullName || "Faculty Member";
  const facultyRole = faculty?.userType === "faculty" ? "Faculty" : "Instructor";
  
  // Generate initials for avatar fallback
  const initials = facultyName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <img 
          className="h-48 w-full object-cover" 
          src={course.imageUrl} 
          alt={course.title}
        />
      </div>
      <CardContent className="flex-1 p-6 flex flex-col">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="bg-primary-100 text-primary hover:bg-primary-200">
            {course.category}
          </Badge>
          <span className="inline-flex items-center text-sm text-gray-500">
            <Star className="h-5 w-5 text-yellow-400 mr-1 fill-current" />
            {course.rating} ({course.reviewCount})
          </span>
        </div>
        <Link href={`/courses/${course.id}`} className="block mt-2">
          <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
          <p className="mt-3 text-base text-gray-500">{course.description}</p>
        </Link>
      </CardContent>
      <CardFooter className="pt-6 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt={facultyName} />
              <AvatarFallback className="bg-primary-50 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{facultyName}</p>
              <p className="text-xs text-gray-500">{facultyRole}</p>
            </div>
          </div>
          <span className="text-primary font-bold">{formattedPrice}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
