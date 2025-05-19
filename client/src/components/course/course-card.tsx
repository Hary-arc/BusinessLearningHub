
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, FileText, BookOpen } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    instructorId: {
      _id: string;
      name: string;
      email: string;
    };
    category: string;
    price: number;
    rating: number;
    reviewCount: number;
    level: string;
    duration: number;
    isPublished: boolean;
    currency: string;
    totalLessons?: number;
    totalArticles?: number;
    lastUpdated?: string;
    enrollmentCount?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const formattedPrice = `${course.currency} ${course.price.toFixed(2)}`;
  const instructorName = course.instructorId?.name || "Instructor";
  const initials = instructorName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Link href={`/courses/${course._id}`} className="group">
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          className="h-48 w-full object-cover" 
          src={course.imageUrl} 
          alt={course.title}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 text-primary">
            {course.level}
          </Badge>
        </div>
      </div>
      
      <CardContent className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="bg-primary-50 text-primary border-primary/20">
            {course.category}
          </Badge>
          <div className="flex items-center text-sm text-amber-500 font-medium">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({course.reviewCount})</span>
          </div>
        </div>

        <Link href={`/courses/${course._id}`} className="group">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>
        </Link>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {course.duration}h
          </div>
          {course.totalLessons && (
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              {course.totalLessons} lessons
            </div>
          )}
          {course.totalArticles && (
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              {course.totalArticles} articles
            </div>
          )}
        </div>

        {course.enrollmentCount && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{course.enrollmentCount} enrolled</span>
              <span className="text-primary font-medium">97% completion</span>
            </div>
            <Progress value={97} className="h-1" />
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={instructorName} />
              <AvatarFallback className="bg-primary-50 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{instructorName}</p>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>
          <span className="text-lg font-bold text-primary">{formattedPrice}</span>
        </div>
      </CardFooter>
    </Card>
    </Link>
  );
}
