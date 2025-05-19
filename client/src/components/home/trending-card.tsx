
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Course } from "@shared/schema";

interface TrendingCardProps {
  course: Course;
}

export function TrendingCard({ course }: TrendingCardProps) {
  return (
    <Card className="min-w-[300px] snap-center shrink-0 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative h-40">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-2 right-2 bg-white/90">
          {course.level}
        </Badge>
      </div>
      <div className="p-4">
        <Link href={`/courses/${course._id}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={course.instructorId?.imageUrl || ""}
              alt={course.instructorId?.name}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  course.instructorId?.name || "Instructor"
                )}`;
              }}
            />
            <span className="text-sm text-gray-700">{course.instructorId?.name}</span>
          </div>
          <span className="text-primary font-semibold">
            {course.currency} {course.price}
          </span>
        </div>
      </div>
    </Card>
  );
}
