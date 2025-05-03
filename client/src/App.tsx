import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import HomePage from "@/pages/home-page";
import CoursesPage from "@/pages/courses-page";
import CourseDetailPage from "@/pages/course-detail-page";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/dashboard/student-dashboard";
import FacultyDashboard from "@/pages/dashboard/faculty-dashboard";
import AdminDashboard from "@/pages/dashboard/admin-dashboard";
import NotFound from "@/pages/not-found";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";
import CareersPage from "./pages/careers-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/courses/:id" component={CourseDetailPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard/student" component={StudentDashboard} requiredUserType="student" />
      <ProtectedRoute path="/dashboard/faculty" component={FacultyDashboard} requiredUserType="faculty" />
      <ProtectedRoute path="/dashboard/admin" component={AdminDashboard} requiredUserType="admin" />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/careers" component={CareersPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;