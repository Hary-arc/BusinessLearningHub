import { Enrollment, Course } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Clock, CheckCircle } from "lucide-react";

interface EnrollmentCardProps {
  enrollment: Enrollment & { course: Course };
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { course, progress, completed } = enrollment;
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={course.imageUrl} 
          alt={course.title}
          className="h-36 w-full object-cover"
        />
        {completed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </div>
        )}
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{course.description}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{progress}% complete</span>
          <span className="text-xs text-gray-500">
            {completed ? (
              <span className="flex items-center text-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </span>
            ) : (
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                In progress
              </span>
            )}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button variant={completed ? "outline" : "default"} className="w-full">
            {completed ? "Review Course" : "Continue Learning"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
