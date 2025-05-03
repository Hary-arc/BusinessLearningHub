
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function CareersPage() {
  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our engineering team to build the future of online education."
    },
    {
      id: 2,
      title: "Course Instructor",
      department: "Education",
      location: "Remote",
      type: "Contract",
      description: "Share your expertise by creating and teaching online courses."
    },
    {
      id: 3,
      title: "Content Developer",
      department: "Content",
      location: "Remote",
      type: "Full-time",
      description: "Create engaging educational content for our platform."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Career Opportunities
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Join our team and help shape the future of education
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobListings.map((job) => (
              <Card key={job.id} className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="text-sm bg-primary-50 text-primary px-2 py-1 rounded">
                    {job.department}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {job.location}
                  </span>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{job.description}</p>
                <Button className="w-full">Apply Now</Button>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Want to Join as an Instructor?
            </h2>
            <p className="text-gray-600 mb-6">
              Share your expertise with our growing community of learners.
            </p>
            <Link href="/auth">
              <Button size="lg">
                Become an Instructor
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
