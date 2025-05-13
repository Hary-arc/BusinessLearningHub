import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  BookOpen, 
  Users, 
  Settings, 
  Bell, 
  Award, 
  CreditCard, 
  BarChart,
  FileText,
  Layout,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardSidebarProps {
  userType: 'student' | 'faculty' | 'admin';
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Define navigation items based on user type
  const navigationItems = {
    student: [
      { icon: Home, label: "Dashboard", href: "/dashboard/student" },
      { icon: BookOpen, label: "My Courses", href: "/dashboard/student/courses" },
      { icon: Award, label: "Certificates", href: "/dashboard/student/certificates" },
      { icon: CreditCard, label: "Subscription", href: "/dashboard/student/subscription" },
      { icon: Bell, label: "Notifications", href: "/dashboard/student/notifications" },
      { icon: User, label: "Profile", href: "/dashboard/student/profile" },
      { icon: Settings, label: "Settings", href: "/dashboard/student/settings" },
    ],
    faculty: [
      { icon: Home, label: "Dashboard", href: "/dashboard/faculty" },
      { icon: BookOpen, label: "My Courses", href: "/dashboard/faculty/courses" },
      { icon: FileText, label: "Course Content", href: "/dashboard/faculty/content" },
      { icon: Users, label: "Students", href: "/dashboard/faculty/students" },
      { icon: BarChart, label: "Analytics", href: "/dashboard/faculty/analytics" },
      { icon: User, label: "Profile", href: "/dashboard/faculty/profile" },
      { icon: Settings, label: "Settings", href: "/dashboard/faculty/settings" },
    ],
    admin: [
      { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
      { icon: Users, label: "Users", href: "/dashboard/admin/users" },
      { icon: BookOpen, label: "Courses", href: "/dashboard/admin/courses" },
      { icon: CreditCard, label: "Subscriptions", href: "/dashboard/admin/subscriptions" },
      { icon: BarChart, label: "Reports", href: "/dashboard/admin/reports" },
      { icon: Layout, label: "Platform", href: "/dashboard/admin/platform" },
      { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
    ],
  };

  const items = navigationItems[userType];

  // Create user initials for avatar fallback
  const initials = user?.fullName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" alt={user?.fullName} />
              <AvatarFallback className="bg-primary-50 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{user?.fullName}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.userType}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {items.map((item) => (
              
                <div 
                  key={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer",
                    location === item.href
                      ? "text-primary bg-primary-50"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  )}
                  onClick={() => window.location.href = item.href}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.label}
                </div>
              
            ))}
          </nav>
        </CardContent>
      </Card>
    </aside>
  );
}