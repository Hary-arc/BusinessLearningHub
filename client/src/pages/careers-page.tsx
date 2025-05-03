
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { Search } from "lucide-react";

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const jobListings = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Join our engineering team to build the future of online education.",
      salary: "$120,000 - $180,000"
    },
    {
      id: 2,
      title: "Course Instructor",
      department: "Education",
      location: "Hybrid",
      type: "Contract",
      description: "Share your expertise by creating and teaching online courses.",
      salary: "$60,000 - $80,000"
    },
    {
      id: 3,
      title: "Content Developer",
      department: "Content",
      location: "Remote",
      type: "Full-time",
      description: "Create engaging educational content for our platform.",
      salary: "$70,000 - $90,000"
    },
    {
      id: 4,
      title: "UI/UX Designer",
      department: "Design",
      location: "On-site",
      type: "Full-time",
      description: "Design intuitive and engaging user experiences.",
      salary: "$90,000 - $120,000"
    },
    {
      id: 5,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Hybrid",
      type: "Full-time",
      description: "Lead our marketing initiatives and growth strategies.",
      salary: "$100,000 - $130,000"
    }
  ];

  const departments = Array.from(new Set(jobListings.map(job => job.department)));
  const locations = Array.from(new Set(jobListings.map(job => job.location)));
  const types = Array.from(new Set(jobListings.map(job => job.type)));

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter;
    const matchesLocation = locationFilter === "all" || job.location === locationFilter;
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

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

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
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
                <p className="text-gray-600 mb-3">{job.description}</p>
                <p className="text-primary font-medium mb-4">{job.salary}</p>
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
