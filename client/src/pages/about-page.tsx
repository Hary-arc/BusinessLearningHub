
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Building2, Users, Target, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-gray-900 h-[500px]">
          <div className="absolute inset-0">
            <img
              src="/office-background.jpg"
              alt="Office Background"
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              About Us
            </h1>
            <p className="text-2xl md:text-3xl text-white font-light">
              We're more than a story; we're a journey
            </p>
          </div>
        </div>

        {/* Who We Are Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center leading-relaxed">
              InternsElite is an organisation with the mission of preparing students for professional success in both technical and nontechnical fields through meaningful internship experiences. Here at InternsElite, we guide students in the right direction by giving them the knowledge, tools, and resources they need to make an informed decision about their future careers. Using artificial intelligence (AI) software and other cutting-edge technology, we teach our pupils and help them improve their skills in general.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-600">Pushing boundaries with cutting-edge solutions</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-gray-600">Building strong relationships and networks</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Excellence</h3>
                <p className="text-gray-600">Striving for the highest quality in everything</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Success</h3>
                <p className="text-gray-600">Dedicated to student achievement</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
