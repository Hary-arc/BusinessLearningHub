import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Users } from "lucide-react";
import { CheckIcon } from "lucide-react";

interface UserTypeFeature {
  text: string;
}

interface UserTypeInfo {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: UserTypeFeature[];
  dashboardLink: string;
}

const userTypes: UserTypeInfo[] = [
  {
    id: "student",
    title: "Student",
    description: "Access educational materials designed to supplement your formal business education with practical, real-world applications.",
    icon: <BookOpen className="h-8 w-8" />,
    features: [
      { text: "Course progress tracking" },
      { text: "Digital certificate of completion" },
      { text: "Networking with local businesses" }
    ],
    dashboardLink: "/dashboard/student"
  },
  {
    id: "faculty",
    title: "Faculty",
    description: "Deliver high-quality business education with our comprehensive teaching tools and resources.",
    icon: <FileText className="h-8 w-8" />,
    features: [
      { text: "Course authoring tools" },
      { text: "Student performance analytics" },
      { text: "Interactive teaching resources" }
    ],
    dashboardLink: "/dashboard/faculty"
  },
  {
    id: "admin",
    title: "Administrator & Affiliates",
    description: "Manage platform settings, user access, and partnership opportunities with our comprehensive admin tools.",
    icon: <Users className="h-8 w-8" />,
    features: [
      { text: "User management" },
      { text: "Revenue & partnership tracking" },
      { text: "Platform performance analytics" }
    ],
    dashboardLink: "/dashboard/admin"
  }
];

export function UserTypes() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tailored for Every Role
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Personalized learning experiences for different user profiles
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {userTypes.map((userType) => (
            <div 
              key={userType.id} 
              className="bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary mb-6">
                  {userType.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{userType.title}</h3>
                <p className="text-gray-600 mb-6">
                  {userType.description}
                </p>
                <ul className="space-y-3 text-left mb-8 w-full">
                  {userType.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-1 mr-2" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href={userType.dashboardLink}>
                  <Button className="w-full">
                    {userType.title} Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
