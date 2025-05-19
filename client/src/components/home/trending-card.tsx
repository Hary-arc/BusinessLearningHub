
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "wouter";
import { Course } from "@shared/schema";

interface TrendingCardProps {
  course: Course;
}

export function TrendingCard({ course }: TrendingCardProps) {
  return (
    <Link href={`/courses/${course.id}`} >
    <Card className="w-[300px] flex-none snap-center cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group">
      
      <div className="relative h-40">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-1 right-2 bg-blue/90">
          {course.level}
        </Badge>
      </div>
      <div className="p-4">
        
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 overflow-hidden text-ellipsis break-words overflow-hidden mb-3">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={
                course.instructorId?.imageUrl ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  course.instructorId?.name || "Instructor"
                )}`
              }
              alt={course.instructorId?.name}
              className="w-8 h-8 rounded-full"
            />

            <span className="text-sm text-gray-700">{course.instructorId?.name}</span>
          </div>
          <div className="flex items-center text-sm text-amber-500 font-medium">
            <Star className="h-4 w-4 fill-current mr-1" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-gray-500 ml-1">({course.reviewCount})</span>
          </div>
        </div>
      </div>
    </Card>
      </Link>
  );
}
