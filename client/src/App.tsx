import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import React, { lazy } from 'react';

import HomePage from "@/pages/home-page";
import CoursesPage from "@/pages/courses-page";
import CourseDetailPage from "@/pages/course-detail-page";
import AuthPage from "@/pages/auth-page";
import StudentDashboard from "@/pages/dashboard/student-dashboard";
import StudentCourses from "@/pages/dashboard/student/courses";
import ProgramsPage from "@/pages/dashboard/student/programs";
import BatchesPage from "@/pages/dashboard/student/batches";
import CertifiedParticipantsPage from "@/pages/dashboard/student/certified";
import JobsPage from "@/pages/dashboard/student/jobs";
import StatisticsPage from "@/pages/dashboard/student/statistics";
import NotificationsPage from "@/pages/dashboard/student/notifications";
import QuizzesPage from "@/pages/dashboard/student/quizzes";
import FacultyDashboard from "@/pages/dashboard/faculty-dashboard";
import AdminDashboard from "@/pages/dashboard/admin-dashboard";
import NotFound from "@/pages/not-found";
import AboutPage from "./pages/about-page";
import ContactPage from "./pages/contact-page";
import CareersPage from "./pages/careers-page";
import JobApplicationPage from "./pages/job-application-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/courses/:id" component={CourseDetailPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard/student" component={() => (
        <StudentDashboard>
          <Route path="/" component={StudentCourses} />
          <Route path="/courses" component={StudentCourses} />
          <Route path="/programs" component={ProgramsPage} />
          <Route path="/batches" component={BatchesPage} />
          <Route path="/certified" component={CertifiedParticipantsPage} />
          <Route path="/jobs" component={JobsPage} />
          <Route path="/statistics" component={StatisticsPage} />
          <Route path="/notifications" component={NotificationsPage} />
          <Route path="/quizzes" component={QuizzesPage} />
        </StudentDashboard>
      )} requiredUserType="student" />

      <ProtectedRoute path="/dashboard/faculty" component={FacultyDashboard} requiredUserType="faculty" />
      <Route path="/dashboard/faculty/courses" component={lazy(() => import('./pages/dashboard/faculty/courses'))} />

      <ProtectedRoute path="/dashboard/admin" component={AdminDashboard} requiredUserType="admin" />
      <ProtectedRoute path="/dashboard/admin/control" component={lazy(() => import('./pages/dashboard/admin/admin-control-panel'))} requiredUserType="admin" />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/job-application" component={JobApplicationPage} />
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